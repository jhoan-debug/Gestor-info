# app/routes/stats.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import extract, func
from datetime import date
from app.db_pg import get_db, SessionLocal, engine
from app import models

router = APIRouter(
    prefix="/stats",
    tags=["Estadísticas"]
)

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    hoy = date.today()

    # Total de clientes
    total_clientes = db.query(models.Cliente).count()

    # Cumpleaños del mes (SQL correcto)
    cumpleanos_mes = db.query(models.Cliente)\
        .filter(
            models.Cliente.fecha_cumpleanos.isnot(None),
            extract('month', models.Cliente.fecha_cumpleanos) == hoy.month
        ).count()

    # Últimas consultas — por ahora será el total de clientes creados este mes
    ultimas_consultas = db.query(models.Cliente)\
        .filter(
            extract('month', models.Cliente.fecha_registro) == hoy.month
        ).count()

    return {
        "total_clientes": total_clientes,
        "cumpleanos_mes": cumpleanos_mes,
        "ultimas_consultas": ultimas_consultas
    }
