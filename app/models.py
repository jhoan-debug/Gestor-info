from sqlalchemy import Column, Integer, String, DateTime, Date  # --> Añade Date
from sqlalchemy.sql import func
from app.db_pg import Base  # Asegúrate de importar Base desde el archivo correcto

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    documento = Column(String(50), unique=True, nullable=False)
    telefono = Column(String(20))
    correo = Column(String(100))
    direccion = Column(String(150))
    formula_od = Column(String(50))
    formula_oi = Column(String(50))
    observaciones = Column(String(255))
    
    # --> Campos para fórmula visual
    od_esfera = Column(String, nullable=True)
    od_cilindro = Column(String, nullable=True)
    od_eje = Column(String, nullable=True)
    od_add = Column(String(20))
    od_dp = Column(String(20))
    od_alt = Column(String(20))
    od_prisma = Column(String(20))


    oi_esfera = Column(String, nullable=True)
    oi_cilindro = Column(String, nullable=True)
    oi_eje = Column(String, nullable=True)
    oi_add = Column(String(20))
    oi_dp = Column(String(20))
    oi_alt = Column(String(20))
    oi_prisma = Column(String(20))
    
    archivo = Column(String(255))
    fecha_cumpleanos = Column(Date, nullable=True)
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())