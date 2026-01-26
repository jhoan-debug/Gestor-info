from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import stats
from app.routes import auth, clients, reportes, config
from app.db_pg import Base, engine

app = FastAPI(title="Gestor de Óptica", version="1.0")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes (puedes cambiarlo luego)
    allow_credentials=True,
    allow_methods=["*"],   # Permite todos los métodos (GET, POST, PUT, DELETE...)
    allow_headers=["*"],   # Permite todas las cabeceras
)

# crear tablas si no existen
Base.metadata.create_all(bind=engine)

# registrar routers
app.include_router(auth.router)
app.include_router(stats.router)
app.include_router(clients.router)
app.include_router(reportes.router)
app.include_router(config.router)

@app.get("/")
def home():
    # Ruta raíz: verifica que API y CORS funcionan.
    """Ruta raíz de la API.

    Retorna un mensaje simple para verificar que el servidor y CORS
    están funcionando correctamente. No recibe parámetros.

    Returns:
        dict: Mensaje de estado.
    """
    return {"msg": "Servidor y CORS funcionando correctamente"}