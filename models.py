from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.db_pg import Base  # Asegúrate de importar Base desde el archivo correcto

class Cliente(Base):									# --> Modelo de datos para la tabla "clientes"
	__tablename__ = "clientes"							# --> Nombre real de la tabla en la base de datos

	id = Column(Integer, primary_key=True, index=True)	# --> ID autoincremental, clave primaria
	nombre = Column(String(100), nullable=False)		    # --> Nombre del cliente
	apellido = Column(String(100), nullable=False)		# --> Apellido del cliente
	documento = Column(String(50), unique=True, nullable=False)	# --> Documento único
	telefono = Column(String(20))						# --> Teléfono de contacto
	correo = Column(String(100))						# --> Correo electrónico (opcional)
	direccion = Column(String(150))						# --> Dirección del cliente (opcional)
	
	archivo = column(String, nuttable=True)
	
	formula_od = Column(String(50))						# --> Fórmula óptica - Ojo derecho
	formula_oi = Column(String(50))						# --> Fórmula óptica - Ojo izquierdo
	
	observaciones = Column(String(255))					# --> Notas u observaciones médicas

	fecha_registro = Column(DateTime(timezone=True), server_default=func.now())	# --> Fecha automática de registro