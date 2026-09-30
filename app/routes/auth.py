from fastapi import APIRouter, HTTPException, Depends, Form
from sqlalchemy.orm import Session
from app.database.db_pg import get_db
from app.models.models import Usuario

router = APIRouter(prefix="/login", tags=["Autenticación"])

@router.post("/")
def login(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    # Busca el usuario en la base de datos
    usuario_db = db.query(Usuario).filter(Usuario.usuario == username).first()

    if not usuario_db or usuario_db.contrasena != password:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    return {"ok": True, "usuario": usuario_db.usuario}