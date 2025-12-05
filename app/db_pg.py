from sqlalchemy import create_engine, Column, Integer, String, Date, DateTime, func, text
from sqlalchemy.orm import sessionmaker, declarative_base
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# -----------------------------------------------------
# CONFIG POSTGRESQL
# -----------------------------------------------------
DB_USER = "postgres"
DB_PASS = "2006"
DB_HOST = "localhost"
DB_PORT = "5433"
DB_NAME = "optica"

# Conectar a postgres para crear la base si no existe
def create_database_if_not_exists():
    try:
        conn = psycopg2.connect(
            dbname="postgres",
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST,
            port=DB_PORT
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        cur.execute(f"SELECT 1 FROM pg_database WHERE datname='{DB_NAME}'")
        exists = cur.fetchone()
        if not exists:
            cur.execute(f"CREATE DATABASE {DB_NAME}")
            print(f"Base de datos '{DB_NAME}' creada correctamente")
        cur.close()
        conn.close()
    except Exception as e:
        print("Error creando la base de datos:", e)

create_database_if_not_exists()

# URL de conexión a la base de datos
DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Engine y Session
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=1800,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para modelos
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()