from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# --> Este archivo se encarga de crear la conexión local a la base de datos SQLite.
# --> Básicamente aquí se establece cómo se guardan y leen los datos de forma persistente.

SQLALCHEMY_DATABASE_URL = "postgresql+psycopg://postgres:2006@localhost:5432/optica"

    # --> Se crea el "motor" que gestiona la conexión con SQLite.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

    # --> Se configura la sesión para trabajar con la base de datos.
    # --> Aquí se controlan las operaciones (crear, modificar, eliminar registros, etc.)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # --> Base principal desde la cual se crean todas las tablas definidas en los modelos.
Base = declarative_base()

def get_db():
    # Dependencia local: crea una sesión y la cierra al finalizar.
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()