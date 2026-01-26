from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from datetime import date
from app import schemas, crud, models
from app.db_pg import get_db, SessionLocal, engine
import os
from typing import Optional

router = APIRouter(
    prefix="/clientes",
    tags=["Clientes"]
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mueve endpoints específicos arriba
@router.get("/cumpleanos-proximos", response_model=list[schemas.CumpleanosProximo])
def proximos_cumpleanos(db: Session = Depends(get_db)):
    # Lista clientes con cumpleaños en los próximos 7 días.
    hoy = date.today()
    clientes = db.query(models.Cliente).all()
    proximos = []

    for c in clientes:
        if not c.fecha_cumpleanos:
            continue

        cumple = c.fecha_cumpleanos.replace(year=hoy.year)

        if cumple < hoy:  # Si ya pasó este año → mover al próximo
            cumple = cumple.replace(year=hoy.year + 1)

        dias = (cumple - hoy).days

        if 0 <= dias <= 7:  # Próximos 7 días
            proximos.append({
                "nombre": c.nombre,  # Campos directos, sin id
                "apellido": c.apellido,
                "dias": dias,
                "fecha_cumpleanos": c.fecha_cumpleanos.strftime("%Y-%m-%d") if c.fecha_cumpleanos else None  # Añade fecha para edades
            })

    return sorted(proximos, key=lambda x: x["dias"])

@router.get("/cumpleanos", response_model=list[schemas.ClienteOut])
def listar_cumpleanos_mes_actual(db: Session = Depends(get_db)):
    # Lista clientes cuyo cumpleaños cae en el mes actual.
    hoy = date.today()
    clientes = db.query(models.Cliente).filter(models.Cliente.fecha_cumpleanos != None).all()
    return [c for c in clientes if c.fecha_cumpleanos.month == hoy.month]

@router.get("/archivo/{filename}")
def descargar_archivo(filename: str):
    # Devuelve un archivo subido si existe en el directorio de uploads.
    path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    return FileResponse(path, filename=filename)

# Ahora los endpoints con parámetros dinámicos
@router.post("/", response_model=schemas.ClienteOut)
async def create_cliente(
    nombre: str = Form(...),
    apellido: str = Form(...),
    documento: str = Form(...),
    telefono: Optional[str] = Form(None),
    correo: Optional[str] = Form(None),
    direccion: Optional[str] = Form(None),
    observaciones: Optional[str] = Form(None),
    od_esfera: Optional[str] = Form(None),
    od_cilindro: Optional[str] = Form(None),
    od_eje: Optional[str] = Form(None),
    od_add: Optional[str] = Form(None),
    od_dp: Optional[str] = Form(None),
    od_alt: Optional[str] = Form(None),
    od_prisma: Optional[str] = Form(None),
    oi_esfera: Optional[str] = Form(None),
    oi_cilindro: Optional[str] = Form(None),
    oi_eje: Optional[str] = Form(None),
    oi_add: Optional[str] = Form(None),
    oi_dp: Optional[str] = Form(None),
    oi_alt: Optional[str] = Form(None),
    oi_prisma: Optional[str] = Form(None),
    tipo_lente: Optional[str] = Form(None),
    tratamiento_lente: Optional[str] = Form(None),
    laboratorio: Optional[str] = Form(None),
    precio: Optional[int] = Form(None),

    tiene_factura: Optional[bool] = Form(False),
    numero_factura: Optional[str] = Form(None),

    fecha_cumpleanos: Optional[str] = Form(None),
    archivo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    ##fecha_cumpleanos = cliente.fecha_cumpleanos if cliente.fecha_cumpleanos else None  # Solo asigna si tiene valor
    nuevo_cliente = models.Cliente(
        # ... otros campos
            fecha_cumpleanos=fecha_cumpleanos  # Si es None, se guarda como null (aceptable para opcional)
)
    # Crea un cliente desde un formulario y guarda el archivo opcional.
    filename = None
    if archivo:
        filename = archivo.filename
        path = os.path.join(UPLOAD_DIR, filename)
        with open(path, "wb") as f:
            f.write(await archivo.read())

    data = schemas.ClienteCreate(
        nombre=nombre,
        apellido=apellido,
        documento=documento,
        telefono=telefono,
        correo=correo,
        direccion=direccion,
        observaciones=observaciones,
        od_esfera=od_esfera,
        od_cilindro=od_cilindro,
        od_eje=od_eje,
        od_add=od_add,
        od_dp=od_dp,
        od_alt=od_alt,
        od_prisma=od_prisma,
        oi_esfera=oi_esfera,
        oi_cilindro=oi_cilindro,
        oi_eje=oi_eje,
        oi_add=oi_add,
        oi_dp=oi_dp,
        oi_alt=oi_alt,
        oi_prisma=oi_prisma,
        tipo_lente=tipo_lente,
        tratamiento_lente=tratamiento_lente,
        laboratorio=laboratorio,
        precio=precio,
        tiene_factura=tiene_factura,
        numero_factura=numero_factura,
        fecha_cumpleanos=fecha_cumpleanos  # Ya es opcional, no necesitas manipularlo
    )

    return crud.create_cliente(db, data, archivo=filename)

@router.get("/", response_model=list[schemas.ClienteOut])
def obtener_clientes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Endpoint para obtener una lista paginada de clientes.
    return crud.obtener_clientes(db, skip=skip, limit=limit)

@router.get("/buscar", response_model=list[schemas.ClienteOut])
def buscar_clientes(
    nombre: Optional[str] = None,
    documento: Optional[str] = None,
    telefono: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Busca clientes por nombre, documento o teléfono y retorna coincidencias.
    resultados = crud.buscar_clientes(db, nombre=nombre, documento=documento, telefono=telefono)
    if not resultados:
        raise HTTPException(status_code=404, detail="No se encontraron clientes")
    return resultados

@router.put("/{cliente_id}", response_model=schemas.ClienteOut)
async def actualizar_cliente(
    cliente_id: int,
    nombre: str = Form(...),
    apellido: str = Form(...),
    documento: str = Form(...),
    telefono: Optional[str] = Form(None),
    correo: Optional[str] = Form(None),
    direccion: Optional[str] = Form(None),
    observaciones: Optional[str] = Form(None),
    od_esfera: Optional[str] = Form(None),
    od_cilindro: Optional[str] = Form(None),
    od_eje: Optional[str] = Form(None),
    od_add: Optional[str] = Form(None),
    od_dp: Optional[str] = Form(None),
    od_alt: Optional[str] = Form(None),
    od_prisma: Optional[str] = Form(None),
    oi_esfera: Optional[str] = Form(None),
    oi_cilindro: Optional[str] = Form(None),
    oi_eje: Optional[str] = Form(None),
    oi_add: Optional[str] = Form(None),
    oi_dp: Optional[str] = Form(None),
    oi_alt: Optional[str] = Form(None),
    oi_prisma: Optional[str] = Form(None),
    tipo_lente: Optional[str] = Form(None),
    tratamiento_lente: Optional[str] = Form(None),
    laboratorio: Optional[str] = Form(None),
    precio: Optional[int] = Form(None),
    tiene_factura: Optional[bool] = Form(False),
    numero_factura: Optional[str] = Form(None),
    fecha_cumpleanos: Optional[date] = Form(None),
    archivo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    # Actualiza un cliente desde un formulario y guarda archivo si se proporciona.
    filename = None
    if archivo:
        filename = archivo.filename
        path = os.path.join(UPLOAD_DIR, filename)
        with open(path, "wb") as f:
            f.write(await archivo.read())

    datos = schemas.ClienteCreate(
        nombre=nombre,
        apellido=apellido,
        documento=documento,
        telefono=telefono,
        correo=correo,
        direccion=direccion,
        observaciones=observaciones,
        od_esfera=od_esfera,
        od_cilindro=od_cilindro,
        od_eje=od_eje,
        od_add=od_add,
        od_dp=od_dp,
        od_alt=od_alt,
        od_prisma=od_prisma,
        oi_esfera=oi_esfera,
        oi_cilindro=oi_cilindro,
        oi_eje=oi_eje,
        oi_add=oi_add,
        oi_dp=oi_dp,
        oi_alt=oi_alt,
        oi_prisma=oi_prisma,
        fecha_cumpleanos=fecha_cumpleanos
    )

    cliente_actualizado = crud.actualizar_cliente(db, cliente_id, datos, archivo=filename)
    if not cliente_actualizado:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente_actualizado

@router.get("/{cliente_id}", response_model=schemas.ClienteOut)
def obtener_cliente(cliente_id: int, db: Session = Depends(get_db)):
    # Obtiene un cliente por su ID.
    cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente

@router.delete("/{cliente_id}")
def eliminar_cliente(cliente_id: int, db: Session = Depends(get_db)):
    # Elimina un cliente por ID.
    eliminado = crud.eliminar_cliente(db, cliente_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return {"msg": "Cliente eliminado correctamente"}