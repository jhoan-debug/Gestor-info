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
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=60))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/token")
def login_for_access_token(username: str = Form(...), password: str = Form(...)):
    if username != fake_user["username"] or not verify_password(password, fake_user["password"]):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    token = create_access_token({"sub": username})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/test")
def test_auth():
    return {"msg": "Auth funcionando correctamente"}
