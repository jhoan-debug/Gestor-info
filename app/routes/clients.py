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
                "id": c.id,
                "nombre": c.nombre,
                "apellido": c.apellido,
                "dias": dias
            })

    return sorted(proximos, key=lambda x: x["dias"])

@router.get("/cumpleanos", response_model=list[schemas.ClienteOut])
def listar_cumpleanos_mes_actual(db: Session = Depends(get_db)):
    hoy = date.today()
    clientes = db.query(models.Cliente).filter(models.Cliente.fecha_cumpleanos != None).all()
    return [c for c in clientes if c.fecha_cumpleanos.month == hoy.month]

@router.get("/archivo/{filename}")
def descargar_archivo(filename: str):
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
    fecha_cumpleanos: Optional[date] = Form(None),
    archivo: UploadFile | None = File(None),
    db: Session = Depends(get_db)
):
    filename = None
    if archivo:
        unique_name = f"{date.today().strftime('%Y%m%d')}_{archivo.filename}"
        filepath = os.path.join(UPLOAD_DIR, unique_name)
        with open(filepath, "wb") as f:
            content = await archivo.read()
            f.write(content)
        filename = unique_name

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
        fecha_cumpleanos=fecha_cumpleanos
    )

    return crud.create_cliente(db, data, archivo=filename)

@router.get("/", response_model=list[schemas.ClienteOut])
def obtener_clientes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.obtener_clientes(db, skip=skip, limit=limit)

@router.get("/buscar", response_model=list[schemas.ClienteOut])
def buscar_clientes(
    nombre: Optional[str] = None,
    documento: Optional[str] = None,
    telefono: Optional[str] = None,
    db: Session = Depends(get_db)
):
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
    fecha_cumpleanos: Optional[date] = Form(None),
    archivo: UploadFile | None = File(None),
    db: Session = Depends(get_db)
):
    filename = None
    if archivo:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{archivo.filename}"
        path = os.path.join(UPLOAD_DIR, filename)
        with open(path, "wb") as f:
            content = await archivo.read()
            f.write(content)

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
    cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente

@router.delete("/{cliente_id}")
def eliminar_cliente(cliente_id: int, db: Session = Depends(get_db)):
    eliminado = crud.eliminar_cliente(db, cliente_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return {"msg": "Cliente eliminado correctamente"}