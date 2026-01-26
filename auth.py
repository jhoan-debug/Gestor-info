from fastapi import APIRouter, HTTPException, Depends, Form
from jose import jwt
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext

SECRET_KEY = "clave_super_segura_123"
ALGORITHM = "HS256"

router = APIRouter(prefix="/auth", tags=["auth"])

# ⚙️ Para simplificar, solo un usuario por defecto (puedes reemplazar luego por BD)
fake_user = {
    "username": "admin",
    "password": "$2b$12$XlRWWf6fAXnE7ok9wD/0gu3iNiQiD1xHLxqR7C8P.Ts0PIFDB9uVe"  # hash de "1234"
}

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    # Verifica contraseña en texto plano contra el hash almacenado.
    """Verifica si una contraseña en texto plano coincide con un hash.

    Args:
        plain_password (str): Contraseña en texto plano proporcionada por el usuario.
        hashed_password (str): Hash almacenado de la contraseña.

    Returns:
        bool: True si coinciden, False en caso contrario.
    """
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    # Genera un JWT y establece su tiempo de expiración.
    """Crea un token JWT con un payload y tiempo de expiración opcional.

    Args:
        data (dict): Diccionario con los datos a codificar en el token (ej. {'sub': username}).
        expires_delta (timedelta | None): Tiempo hasta expiración. Si es None, usa 60 minutos.

    Returns:
        str: Token JWT codificado.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=60))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/token")
def login_for_access_token(username: str = Form(...), password: str = Form(...)):
    # Endpoint: valida credenciales y devuelve un token de acceso.
    """Endpoint para obtener un token de acceso a partir de credenciales.

    Este endpoint valida las credenciales proporcionadas mediante `Form`.
    Actualmente utiliza un usuario falso definido en `fake_user`.

    Args:
        username (str): Nombre de usuario desde un formulario.
        password (str): Contraseña desde un formulario.

    Raises:
        HTTPException: Si las credenciales son incorrectas.

    Returns:
        dict: Contiene `access_token` y `token_type`.
    """
    if username != fake_user["username"] or not verify_password(password, fake_user["password"]):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    token = create_access_token({"sub": username})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/test")
def test_auth():
    # Endpoint de prueba para comprobar que el módulo de autenticación responde.
    """Endpoint de prueba para verificar que el submódulo de autenticación funciona.

    Returns:
        dict: Mensaje de estado simple.
    """
    return {"msg": "Auth funcionando correctamente"}
