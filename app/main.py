from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from datetime import datetime
import app.models
from app.routes import auth, clients, reportes, config, stats
from app.database.db_pg import Base, engine
from app.routes.config import SessionLocal, ClienteDB, supabase, BUCKET_NAME
from app.routes.clients import UPLOAD_DIR
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Gestor de Óptica", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear tablas si no existen
Base.metadata.create_all(bind=engine)

# Registrar routers
app.include_router(auth.router)
app.include_router(stats.router)
app.include_router(clients.router)
app.include_router(reportes.router)
app.include_router(config.router)

# ---------------------------------------------------------
# SERVIR EL FRONTEND (build de producción de React/Vite)
# ---------------------------------------------------------
FRONTEND_DIR = os.getenv("FRONTEND_DIR", "./frontend/dist")

if os.path.isdir(FRONTEND_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = os.path.join(FRONTEND_DIR, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))
else:
    @app.get("/")
    def home():
        return {"msg": "Servidor funcionando. Frontend no encontrado en FRONTEND_DIR."}

def auto_backup_archivos_job():
    """
    Revisa la carpeta local de archivos y sube a Supabase Storage
    cualquier archivo que todavía no esté respaldado.
    Corre en background, no bloquea nada si falla.
    """
    if not supabase:
        print("⚠️ Supabase no configurado, se omite respaldo de archivos.")
        return

    try:
        # 1. Listar qué archivos ya existen en el bucket
        archivos_remotos = supabase.storage.from_(BUCKET_NAME).list()
        nombres_remotos = {a["name"] for a in archivos_remotos} if archivos_remotos else set()

        # 2. Listar qué archivos hay localmente
        if not os.path.isdir(UPLOAD_DIR):
            print("📁 Carpeta de uploads local no encontrada, se omite respaldo.")
            return

        archivos_locales = set(os.listdir(UPLOAD_DIR))

        # 3. Calcular cuáles faltan subir
        faltantes = archivos_locales - nombres_remotos

        if not faltantes:
            print("☁️ Archivos de clientes: todo respaldado, nada nuevo que subir.")
            return

        print(f"☁️ Subiendo {len(faltantes)} archivo(s) pendiente(s) a Supabase...")
        print(f"DEBUG - Archivos remotos encontrados: {nombres_remotos}")
        print(f"DEBUG - Archivos locales encontrados: {archivos_locales}")
        print(f"DEBUG - Faltantes calculados: {faltantes}")
        for filename in faltantes:
            path = os.path.join(UPLOAD_DIR, filename)
            if not os.path.isfile(path):
                continue
            try:
                with open(path, "rb") as f:
                    contenido = f.read()
                resultado = supabase.storage.from_(BUCKET_NAME).upload(
                    path=filename,
                    file=contenido,
                    file_options={"upsert": "true"}
                )
                print(f"  ✅ {filename} — respuesta: {resultado}")  # 👈 ahora mostramos la respuesta real
            except Exception as e:
                print(f"  ❌ {filename} — error: {e}")

        print("☁️ Respaldo de archivos completado.")

    except Exception as e:
        print(f"📡 Respaldo de archivos omitido (sin internet o error): {e}")

def auto_backup_job():
    try:
        res = supabase.table('clientes').select('id').limit(1).execute()
        print("Conexión detectada. Ejecutando respaldo automático a Supabase...")

        db: Session = SessionLocal()
        try:
            clientes_db = db.query(ClienteDB).all()
            datos_mapeados = []
            for c in clientes_db:
                fecha_cumple = c.fecha_cumpleanos.strftime('%Y-%m-%d') if c.fecha_cumpleanos else None
                datos_mapeados.append({
                    'nombre': c.nombre,
                    'apellido': c.apellido,
                    'documento': c.documento,
                    'telefono': c.telefono,
                    'correo': c.correo,
                    'direccion': c.direccion,
                    'formula_od': c.formula_od,
                    'formula_oi': c.formula_oi,
                    'observaciones': c.observaciones,
                    'od_esfera': c.od_esfera,
                    'od_cilindro': c.od_cilindro,
                    'od_eje': c.od_eje,
                    'od_add': c.od_add,
                    'od_dp': c.od_dp,
                    'od_alt': c.od_alt,
                    'od_prisma': c.od_prisma,
                    'oi_esfera': c.oi_esfera,
                    'oi_cilindro': c.oi_cilindro,
                    'oi_eje': c.oi_eje,
                    'oi_add': c.oi_add,
                    'oi_dp': c.oi_dp,
                    'oi_alt': c.oi_alt,
                    'oi_prisma': c.oi_prisma,
                    'tipo_lente': c.tipo_lente,
                    'tratamiento_lente': c.tratamiento_lente,
                    'laboratorio': c.laboratorio,
                    'precio': c.precio,
                    'tiene_factura': c.tiene_factura,
                    'numero_factura': c.numero_factura,
                    'archivo': c.archivo,
                    'fecha_cumpleanos': fecha_cumple,
                })

            if datos_mapeados:
                supabase.table('clientes').delete().neq('id', 0).execute()
                supabase.table('clientes').insert(datos_mapeados).execute()
                print(f"Backup automático completado: {len(datos_mapeados)} registros sincronizados.")
            else:
                print("No hay clientes locales para respaldar.")
        finally:
            db.close()
    except Exception as e:
        print(f"📡 Backup automático omitido (sin internet o error): {e}")


scheduler = BackgroundScheduler()

scheduler.add_job(
    auto_backup_job,
    'interval',
    minutes=30,
    next_run_time=datetime.now()
)

scheduler.add_job(
    auto_backup_archivos_job,
    'interval',
    minutes=30,
    next_run_time=datetime.now()
)
scheduler.start()