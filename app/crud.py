from sqlalchemy import or_
from sqlalchemy.orm import Session
from app import models, schemas
from typing import Optional

# --> Este archivo contiene todas las funciones que realizan las operaciones en la base de datos.
# --> "CRUD" (Create, Read, Update, Delete).

def create_cliente(db: Session, cliente: schemas.ClienteCreate, archivo: str = None):
    # Crea un nuevo cliente en la base de datos.
    nuevo_cliente = models.Cliente(
        nombre=cliente.nombre,
        apellido=cliente.apellido,
        documento=cliente.documento,
        telefono=cliente.telefono,
        correo=cliente.correo,
        direccion=cliente.direccion,
        observaciones=cliente.observaciones,
        od_esfera=cliente.od_esfera,
        od_cilindro=cliente.od_cilindro,
        od_eje=cliente.od_eje,
        od_add=cliente.od_add,
        od_dp=cliente.od_dp,
        od_alt=cliente.od_alt,
        od_prisma=cliente.od_prisma,
        oi_esfera=cliente.oi_esfera,
        oi_cilindro=cliente.oi_cilindro,
        oi_eje=cliente.oi_eje,
        oi_add=cliente.oi_add,
        oi_dp=cliente.oi_dp,
        oi_alt=cliente.oi_alt,
        oi_prisma=cliente.oi_prisma,
        tipo_lente=cliente.tipo_lente,
        tratamiento_lente=cliente.tratamiento_lente,
        laboratorio=cliente.laboratorio,
        precio=cliente.precio,
        tiene_factura=cliente.tiene_factura,
        numero_factura=cliente.numero_factura,
        fecha_cumpleanos=cliente.fecha_cumpleanos,  # Se asigna directamente, opcional
        archivo=archivo
    )
    db.add(nuevo_cliente)
    db.commit()
    db.refresh(nuevo_cliente)
    return nuevo_cliente

def buscar_cliente_por_documento(db: Session, documento: str):
    # Busca un cliente por su número de documento exacto.
    """Busca y devuelve un cliente por su número de documento.

    Args:
        db (Session): Sesión de SQLAlchemy.
        documento (str): Número de documento a buscar.

    Returns:
        models.Cliente | None: Instancia del cliente o None si no existe.
    """
    return db.query(models.Cliente).filter(models.Cliente.documento == documento).first()

def obtener_clientes(db: Session, skip: int = 0, limit: int = 10):
    # Devuelve clientes con paginación (offset y limit).
    """Obtiene una lista paginada de clientes.

    Args:
        db (Session): Sesión de SQLAlchemy.
        skip (int): Cantidad de registros a omitir (offset).
        limit (int): Número máximo de registros a devolver.

    Returns:
        list[models.Cliente]: Lista de clientes.
    """
    return db.query(models.Cliente).offset(skip).limit(limit).all()

def buscar_clientes(db: Session, nombre: str = None, documento: str = None, telefono: str = None):
    # Busca clientes por nombre, documento o teléfono usando coincidencia parcial.
    """Busca clientes usando filtros flexibles (nombre, documento, teléfono).

    Si no se provee ningún criterio, devuelve una lista vacía.

    Args:
        db (Session): Sesión de SQLAlchemy.
        nombre (str | None): Nombre o apellido parcial a buscar.
        documento (str | None): Documento parcial a buscar.
        telefono (str | None): Teléfono parcial a buscar.

    Returns:
        list[models.Cliente]: Coincidencias encontradas.
    """
    if not (nombre or documento or telefono):
        return []

    query = db.query(models.Cliente)
    filtros = []

    if nombre:
        filtros.append(models.Cliente.nombre.ilike(f"%{nombre}%"))
        filtros.append(models.Cliente.apellido.ilike(f"%{nombre}%"))
    if documento:
        filtros.append(models.Cliente.documento.ilike(f"%{documento}%"))
    if telefono:
        filtros.append(models.Cliente.telefono.ilike(f"%{telefono}%"))

    query = query.filter(or_(*filtros))
    return query.all()

def actualizar_cliente(db: Session, cliente_id: int, datos: schemas.ClienteCreate, archivo: Optional[str] = None):
    # Actualiza campos de un cliente existente y opcionalmente reemplaza archivo.
    """Actualiza los datos de un cliente existente.

    Args:
        db (Session): Sesión de SQLAlchemy.
        cliente_id (int): ID del cliente a actualizar.
        datos (schemas.ClienteCreate): Datos con los campos a actualizar.
        archivo (Optional[str]): Nuevo archivo asociado (opcional).

    Returns:
        models.Cliente | None: Cliente actualizado o None si no existe.
    """
    cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if not cliente:
        return None
   
    for key, value in datos.dict(exclude_unset=True).items():
        setattr(cliente, key, value)
    
    if archivo:
        cliente.archivo = archivo
    db.commit()
    db.refresh(cliente)
    return cliente

def eliminar_cliente(db: Session, cliente_id: int):
    # Elimina un cliente por ID y confirma la eliminación.
    """Elimina un cliente de la base de datos por su ID.

    Args:
        db (Session): Sesión de SQLAlchemy.
        cliente_id (int): ID del cliente a eliminar.

    Returns:
        models.Cliente | None: Instancia del cliente eliminado, o None si no existía.
    """
    cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if cliente:
        db.delete(cliente)
        db.commit()
    return cliente