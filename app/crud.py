from sqlalchemy import or_
from sqlalchemy.orm import Session
from app import models, schemas

# --> Este archivo contiene todas las funciones que realizan las operaciones en la base de datos.
# --> "CRUD" (Create, Read, Update, Delete).

def create_cliente(db: Session, cliente: schemas.ClienteCreate, archivo: str = None):
    db_cliente = models.Cliente(**cliente.dict(), archivo=archivo)
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente

def buscar_cliente_por_documento(db: Session, documento: str):
    # --> Busca un cliente exacto por su número de documento.
    return db.query(models.Cliente).filter(models.Cliente.documento == documento).first()

def obtener_clientes(db: Session, skip: int = 0, limit: int = 10):
    # --> Devuelve una lista limitada de clientes.
    return db.query(models.Cliente).offset(skip).limit(limit).all()

def buscar_clientes(db: Session, nombre: str = None, documento: str = None, telefono: str = None):
    # --> Permite buscar clientes de forma flexible usando nombre, documento o teléfono.
    if not (nombre or documento or telefono):
        return []  # --> Si no se escribe nada en el campo de búsqueda, no devuelve nada.

    query = db.query(models.Cliente)
    filtros = []

    # --> Se crean los filtros según los valores que haya ingresado el usuario.
    if nombre:
        filtros.append(models.Cliente.nombre.ilike(f"%{nombre}%"))
        filtros.append(models.Cliente.apellido.ilike(f"%{nombre}%"))
    if documento:
        filtros.append(models.Cliente.documento.ilike(f"%{documento}%"))
    if telefono:
        filtros.append(models.Cliente.telefono.ilike(f"%{telefono}%"))

    # --> Se combinan los filtros para buscar por cualquiera de ellos.
    query = query.filter(or_(*filtros))
    return query.all()

def actualizar_cliente(db: Session, cliente_id: int, datos: schemas.ClienteCreate, archivo: str | None = None):
    cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if not cliente:
        return None
    # actualizar campos desde pydantic
    for key, value in datos.dict(exclude_unset=True).items():
        setattr(cliente, key, value)
    # si viene archivo, actualizar campo archivo
    if archivo:
        cliente.archivo = archivo
    db.commit()
    db.refresh(cliente)
    return cliente

def eliminar_cliente(db: Session, cliente_id: int):
    # --> Elimina un cliente definitivamente de la base de datos.
    cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if cliente:
        db.delete(cliente)
        db.commit()
    return cliente