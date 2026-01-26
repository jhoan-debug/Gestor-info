from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# -----------------------------------------------------
# CONFIG POSTGRESQL — Usa variables de entorno (para Docker o local)
# -----------------------------------------------------

DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "2006")  # Asegúrate de que coincida con tu password real de PostgreSQL
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5433")  # <── CAMBIADO: Puerto 5433 según tu configuración
DB_NAME = os.getenv("DB_NAME", "optica")

# URL de conexión a la base
DATABASE_URL = (
    f"postgresql+psycopg://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# Engine con codificación UTF-8 forzada para evitar errores en Windows
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=1800,
    connect_args={"client_encoding": "utf8"}  # Fuerza UTF-8
)

# Session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para modelos
Base = declarative_base()

# Dependencia
def get_db():
    # Dependencia: crea una sesión de DB y la cierra al terminar.
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()