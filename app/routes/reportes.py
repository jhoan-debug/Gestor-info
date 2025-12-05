from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db_pg import get_db, SessionLocal, engine
from app.models import Cliente
from datetime import date, datetime
from sqlalchemy import func

router = APIRouter(prefix="/reportes", tags=["Reportes"])

@router.get("/cumpleanos")
def obtener_cumpleanos(db: Session = Depends(get_db)):
    hoy = date.today()
    mes_actual = f"{hoy.month:02d}"
    # Para SQLite uso strftime para extraer mes 
    cumpleaneros = db.query(Cliente).filter(
        Cliente.fecha_cumpleanos != None,
        func.strftime('%m', Cliente.fecha_cumpleanos) == mes_actual
    ).all()
    return cumpleaneros

@router.get("/estadisticas")
def obtener_estadisticas(db: Session = Depends(get_db)):
    total_clientes = db.query(Cliente).count()
    # clientes registrados desde inicio de mes (para sqlite uso date compare)
    inicio_mes = datetime.now().replace(day=1)
    clientes_mes = db.query(Cliente).filter(Cliente.fecha_registro >= inicio_mes).count()
    mas_frecuentes = db.query(Cliente.formula_od, Cliente.formula_oi).all()
    return {
        "total_clientes": total_clientes,
        "clientes_este_mes": clientes_mes,
        "mas_frecuentes": mas_frecuentes
    }