from sqlalchemy import Column, Integer, String, DateTime, Date, Boolean
from sqlalchemy.sql import func
from app.db_pg import Base 

# Modelo Cliente: representa la tabla 'clientes' en la base de datos.
class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    correo = Column(String, nullable=True)
    documento = Column(String, nullable=False, unique=True)
    telefono = Column(String(20), nullable=True)
    direccion = Column(String(150), nullable=True)
    formula_od = Column(String(50), nullable=True)
    formula_oi = Column(String(50), nullable=True)
    observaciones = Column(String(255), nullable=True)
    
    # --> Campos para fórmula visual
    od_esfera = Column(String, nullable=True)
    od_cilindro = Column(String, nullable=True)
    od_eje = Column(String, nullable=True)
    od_add = Column(String(20), nullable=True)
    od_dp = Column(String(20), nullable=True)
    od_alt = Column(String(20), nullable=True)
    od_prisma = Column(String(20), nullable=True)


    oi_esfera = Column(String, nullable=True)
    oi_cilindro = Column(String, nullable=True)
    oi_eje = Column(String, nullable=True)
    oi_add = Column(String(20), nullable=True)
    oi_dp = Column(String(20), nullable=True)
    oi_alt = Column(String(20), nullable=True)
    oi_prisma = Column(String(20), nullable=True)

    # --> Campos adicionales para gestión de lentes

    tipo_lente = Column(String(50), nullable=True)
    tratamiento_lente = Column(String, nullable=True)
    laboratorio = Column(String(80), nullable=True)
    precio = Column(Integer, nullable=True)

    tiene_factura = Column(Boolean, default=False)
    numero_factura = Column(String(30), nullable=True)

    archivo = Column(String, nullable=True)
    fecha_cumpleanos = Column(Date, nullable=True) 
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())