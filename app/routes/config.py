from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
import os
import traceback
from typing import List, Dict, Any
from supabase import create_client, Client
from pydantic import BaseModel, ConfigDict
from typing import Optional
from sqlalchemy import text

from app.database.db_pg import Base, engine, SessionLocal
from app.models.models import Cliente as ClienteDB

load_dotenv()
router = APIRouter(prefix="/config", tags=["config"])


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  # O usa SUPABASE_KEY si es la clave de servicio
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
BUCKET_NAME = "clientes-archivos"
if not SUPABASE_URL or not SUPABASE_KEY:
    print("ADVERTENCIA: SUPABASE_URL o SUPABASE_KEY no están configuradas en el .env")
    supabase = None
else:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

##engine = create_engine(DATABASE_URL)
##SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
##Base.metadata.create_all(bind=engine)

##print("DSN generada por SQLAlchemy:", engine.url)  # Esto mostrará la URL completa
##print("DB_HOST:", repr(os.environ.get('DB_HOST')))
##print("DB_PASS:", repr(os.environ.get('DB_PASS')))
##print("DB_USER:", repr(os.environ.get('DB_USER')))

class Cliente(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # Recomendado para SQLAlchemy (antes orm_mode)

    nombre: str
    apellido: str
    documento: Optional[str] = None
    telefono: Optional[str] = None
    correo: Optional[str] = None
    direccion: Optional[str] = None
    formula_od: Optional[str] = None
    formula_oi: Optional[str] = None
    observaciones: Optional[str] = None
    od_esfera: Optional[str] = None
    od_cilindro: Optional[str] = None
    od_eje: Optional[str] = None
    od_add: Optional[str] = None
    od_dp: Optional[str] = None
    od_alt: Optional[str] = None
    od_prisma: Optional[str] = None
    oi_esfera: Optional[str] = None
    oi_cilindro: Optional[str] = None
    oi_eje: Optional[str] = None
    oi_add: Optional[str] = None
    oi_dp: Optional[str] = None
    oi_alt: Optional[str] = None
    oi_prisma: Optional[str] = None
    tipo_lente: Optional[str] = None
    tratamiento_lente: Optional[str] = None
    laboratorio: Optional[str] = None
    precio: Optional[int] = None
    tiene_factura: Optional[bool] = False
    numero_factura: Optional[str] = None
    archivo: Optional[str] = None
    fecha_cumpleanos: Optional[str] = None

@router.post("/sync-to-supabase")
async def sync_to_supabase(clientes: List[Dict[str, Any]]):
    if not supabase:
        raise HTTPException(status_code=500, detail="Credenciales de Supabase no configuradas")
    
    try:
        if not isinstance(clientes, list):
            raise HTTPException(status_code=400, detail="Los datos deben ser una lista de clientes")

        supabase.table('clientes').delete().neq('id', 0).execute()

        datos_mapeados = []
        for c in clientes:
            fecha_cumple = c.get('fecha_cumpleanos')
            if fecha_cumple and isinstance(fecha_cumple, str):
                fecha_cumple = fecha_cumple.split('T')[0]
            else:
                fecha_cumple = None

            datos_mapeados.append({
                'nombre': c.get('nombre'),
                'apellido': c.get('apellido'),
                'documento': c.get('documento'),
                'telefono': c.get('telefono'),
                'correo': c.get('correo'),
                'direccion': c.get('direccion'),
                'formula_od': c.get('formula_od'),
                'formula_oi': c.get('formula_oi'),
                'observaciones': c.get('observaciones'),
                'od_esfera': c.get('od_esfera'),
                'od_cilindro': c.get('od_cilindro'),
                'od_eje': c.get('od_eje'),
                'od_add': c.get('od_add'),
                'od_dp': c.get('od_dp'),
                'od_alt': c.get('od_alt'),
                'od_prisma': c.get('od_prisma'),
                'oi_esfera': c.get('oi_esfera'),
                'oi_cilindro': c.get('oi_cilindro'),
                'oi_eje': c.get('oi_eje'),
                'oi_add': c.get('oi_add'),
                'oi_dp': c.get('oi_dp'),
                'oi_alt': c.get('oi_alt'),
                'oi_prisma': c.get('oi_prisma'),
                'tipo_lente': c.get('tipo_lente'),
                'tratamiento_lente': c.get('tratamiento_lente'),
                'laboratorio': c.get('laboratorio'),
                'precio': c.get('precio'),
                'tiene_factura': c.get('tiene_factura'),
                'numero_factura': c.get('numero_factura'),
                'archivo': c.get('archivo'),
                'fecha_cumpleanos': fecha_cumple,
            })

        supabase.table('clientes').insert(datos_mapeados).execute()
        return {"message": "¡Datos sincronizados a Supabase exitosamente!"}

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error en sync_to_supabase: {str(e)}")

@router.post("/sync-to-local-db")
async def sync_to_local_db():
    try:
        print("🔄 Iniciando sincronización a base local...")
        
        # Obtener datos de Supabase
        response = supabase.table('clientes').select('*').execute()
        clientes_supabase = response.data
        print(f"✅ Datos obtenidos de Supabase: {len(clientes_supabase)} registros")
        
        if not isinstance(clientes_supabase, list):
            raise HTTPException(status_code=400, detail="Los datos de Supabase no son una lista válida")
        
        # Conectar a PostgreSQL
        db = SessionLocal()
        print("🔗 Conexión a PostgreSQL abierta")
        
        try:
            for i, c in enumerate(clientes_supabase):
                print(f"Procesando registro {i+1}/{len(clientes_supabase)}: ID {c.get('id')}")
                
                # Consulta UPSERT: Inserta si no existe, actualiza si existe (basado en 'documento')
                db.execute(text("""
                    INSERT INTO clientes (
                        nombre, apellido, documento, telefono, correo, direccion,
                        formula_od, formula_oi, observaciones,
                        od_esfera, od_cilindro, od_eje, od_add, od_dp, od_alt, od_prisma,
                        oi_esfera, oi_cilindro, oi_eje, oi_add, oi_dp, oi_alt, oi_prisma,
                        tipo_lente, tratamiento_lente, laboratorio, precio, tiene_factura, numero_factura,
                        archivo, fecha_cumpleanos, fecha_registro
                    ) VALUES (:nombre, :apellido, :documento, :telefono, :correo, :direccion,
                              :formula_od, :formula_oi, :observaciones,
                              :od_esfera, :od_cilindro, :od_eje, :od_add, :od_dp, :od_alt, :od_prisma,
                              :oi_esfera, :oi_cilindro, :oi_eje, :oi_add, :oi_dp, :oi_alt, :oi_prisma,
                              :tipo_lente, :tratamiento_lente, :laboratorio, :precio, :tiene_factura, :numero_factura,
                              :archivo, :fecha_cumpleanos, :fecha_registro)
                    ON CONFLICT (documento) DO UPDATE SET
                        nombre = EXCLUDED.nombre,
                        apellido = EXCLUDED.apellido,
                        telefono = EXCLUDED.telefono,
                        correo = EXCLUDED.correo,
                        direccion = EXCLUDED.direccion,
                        formula_od = EXCLUDED.formula_od,
                        formula_oi = EXCLUDED.formula_oi,
                        observaciones = EXCLUDED.observaciones,
                        od_esfera = EXCLUDED.od_esfera,
                        od_cilindro = EXCLUDED.od_cilindro,
                        od_eje = EXCLUDED.od_eje,
                        od_add = EXCLUDED.od_add,
                        od_dp = EXCLUDED.od_dp,
                        od_alt = EXCLUDED.od_alt,
                        od_prisma = EXCLUDED.od_prisma,
                        oi_esfera = EXCLUDED.oi_esfera,
                        oi_cilindro = EXCLUDED.oi_cilindro,
                        oi_eje = EXCLUDED.oi_eje,
                        oi_add = EXCLUDED.oi_add,
                        oi_dp = EXCLUDED.oi_dp,
                        oi_alt = EXCLUDED.oi_alt,
                        oi_prisma = EXCLUDED.oi_prisma,
                        tipo_lente = EXCLUDED.tipo_lente,
                        tratamiento_lente = EXCLUDED.tratamiento_lente,
                        laboratorio = EXCLUDED.laboratorio,
                        precio = EXCLUDED.precio,
                        tiene_factura = EXCLUDED.tiene_factura,
                        numero_factura = EXCLUDED.numero_factura,
                        archivo = EXCLUDED.archivo,
                        fecha_cumpleanos = EXCLUDED.fecha_cumpleanos,
                        fecha_registro = EXCLUDED.fecha_registro
                """), {
                    'nombre': c.get('nombre'),
                    'apellido': c.get('apellido'),
                    'documento': c.get('documento'),
                    'telefono': c.get('telefono'),
                    'correo': c.get('correo'),
                    'direccion': c.get('direccion'),
                    'formula_od': c.get('formula_od'),
                    'formula_oi': c.get('formula_oi'),
                    'observaciones': c.get('observaciones'),
                    'od_esfera': c.get('od_esfera'),
                    'od_cilindro': c.get('od_cilindro'),
                    'od_eje': c.get('od_eje'),
                    'od_add': c.get('od_add'),
                    'od_dp': c.get('od_dp'),
                    'od_alt': c.get('od_alt'),
                    'od_prisma': c.get('od_prisma'),
                    'oi_esfera': c.get('oi_esfera'),
                    'oi_cilindro': c.get('oi_cilindro'),
                    'oi_eje': c.get('oi_eje'),
                    'oi_add': c.get('oi_add'),
                    'oi_dp': c.get('oi_dp'),
                    'oi_alt': c.get('oi_alt'),
                    'oi_prisma': c.get('oi_prisma'),
                    'tipo_lente': c.get('tipo_lente'),
                    'tratamiento_lente': c.get('tratamiento_lente'),
                    'laboratorio': c.get('laboratorio'),
                    'precio': c.get('precio'),
                    'tiene_factura': c.get('tiene_factura'),
                    'numero_factura': c.get('numero_factura'),
                    'archivo': c.get('archivo'),
                    'fecha_cumpleanos': c.get('fecha_cumpleanos').split('T')[0] if c.get('fecha_cumpleanos') else None,
                    'fecha_registro': c.get('fecha_registro')
                })
            
            # Commit global después de procesar todos los registros
            db.commit()
            print("✅ Commit exitoso a PostgreSQL")
            return {"message": "¡Datos sincronizados a base local (PostgreSQL) exitosamente con reemplazos!", "registros_procesados": len(clientes_supabase)}
        
        finally:
            db.close()
            print("🔌 Conexión a PostgreSQL cerrada")
    
    except Exception as e:
        print(f"❌ Error en sincronización: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.get("/import-from-supabase")
async def import_from_supabase(offset: int = 0, limit: int = 1000):
    if not supabase:
        raise HTTPException(status_code=500, detail="Credenciales de Supabase no configuradas")
        
    try:
        response = supabase.table('clientes').select('*').range(offset, offset + limit - 1).execute()
        data = response.data
        
        if data is None:
            raise HTTPException(status_code=500, detail="Respuesta inválida de Supabase (data es None)")
        
        has_more = len(data) == limit
        return {
            "clientes": data,
            "has_more": has_more,
            "next_offset": offset + limit if has_more else None
        }
    
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error interno en import_from_supabase: {str(e)}")