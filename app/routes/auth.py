from fastapi import APIRouter, HTTPException, Depends, Form
from jose import jwt, JWTError
from datetime import datetime, timedelta
from app.db_pg import SessionLocal
from sqlalchemy.orm import Session

SECRET_KEY = "clave-super-segura"
ALGORITHM = "HS256"

router = APIRouter(prefix="/login", tags=["Autenticación"])

def get_db():
    # Dependencia que proporciona una sesión de base de datos para los endpoints.
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def login(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    # Endpoint de login: valida credenciales y emite un JWT si son válidas.
    # credenciales fijas
    if username != "admin" or password != "1234":
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    expiration = datetime.utcnow() + timedelta(hours=8)
    token = jwt.encode({"sub": username, "exp": expiration}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}