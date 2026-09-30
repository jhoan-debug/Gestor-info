from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import extract, func
from datetime import date, timedelta
from app.database.db_pg import get_db
from app.models import models

router = APIRouter(
    prefix="/stats",
    tags=["Estadísticas"]
)

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    hoy = date.today()

    total_clientes = db.query(models.Cliente).count()

    cumpleanos_mes = db.query(models.Cliente)\
        .filter(
            models.Cliente.fecha_cumpleanos.isnot(None),
            extract('month', models.Cliente.fecha_cumpleanos) == hoy.month
        ).count()

    ultimas_consultas = db.query(models.Cliente)\
        .filter(
            extract('month', models.Cliente.fecha_registro) == hoy.month
        ).count()

    return {
        "total_clientes": total_clientes,
        "cumpleanos_mes": cumpleanos_mes,
        "ultimas_consultas": ultimas_consultas
    }

@router.get("/cumpleanos-por-mes")
def get_cumpleanos_por_mes(db: Session = Depends(get_db)):
    """Devuelve la distribución de cumpleaños agrupados por mes para la gráfica del Dashboard."""
    resultados = (
        db.query(
            extract('month', models.Cliente.fecha_cumpleanos).label('mes_num'),
            func.count(models.Cliente.id).label('count')
        )
        .filter(models.Cliente.fecha_cumpleanos.isnot(None))
        .group_by('mes_num')
        .all()
    )

    meses_nombres = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ]
    
    conteo_dict = {int(r.mes_num): r.count for r in resultados if r.mes_num is not None}
    
    return [
        {"mes": meses_nombres[i], "count": conteo_dict.get(i + 1, 0)}
        for i in range(12)
    ]

@router.get("/actividad-reciente")
def get_actividad_reciente(dias: int = 7, db: Session = Depends(get_db)):
    try:
        hoy = date.today()
        inicio = hoy - timedelta(days=dias - 1)
        
        resultados = []
        for i in range(dias):
            dia_actual = inicio + timedelta(days=i)
            dia_siguiente = dia_actual + timedelta(days=1)
            
            consultas = db.query(models.Cliente)\
                .filter(
                    models.Cliente.fecha_registro >= dia_actual,
                    models.Cliente.fecha_registro < dia_siguiente
                ).count()
            
            ventas = db.query(func.sum(models.Cliente.precio))\
                .filter(
                    models.Cliente.fecha_registro >= dia_actual,
                    models.Cliente.fecha_registro < dia_siguiente,
                    models.Cliente.precio > 0
                ).scalar() or 0
            
            nuevos_clientes = consultas
            dia_fecha = dia_actual.strftime("%Y-%m-%d")
            
            resultados.append({
                "dia": dia_fecha,
                "consultas": consultas,
                "ventas": ventas,
                "nuevos_clientes": nuevos_clientes
            })
        
        return resultados
    except Exception as e:
        print(f"Error en get_actividad_reciente: {e}")
        raise

@router.get("/registros-por-mes")
def get_registros_por_mes(anio: int = 2026, db: Session = Depends(get_db)):
    query = db.query(
        extract('month', models.Cliente.fecha_registro).label('mes_num'),
        func.count(models.Cliente.id).label('nuevos')
    ).filter(
        extract('year', models.Cliente.fecha_registro) == anio
    ).group_by(
        extract('month', models.Cliente.fecha_registro)
    ).order_by(
        extract('month', models.Cliente.fecha_registro)
    ).all()
    
    meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    
    acumulado = 0
    data = []
    for row in query:
        mes_num = int(row.mes_num)
        nuevos = row.nuevos
        acumulado += nuevos
        data.append({
            "mes": meses[mes_num - 1],
            "nuevos": nuevos,
            "acumulado": acumulado
        })
    
    result = []
    idx = 0
    for mes in meses:
        if idx < len(data) and data[idx]['mes'] == mes:
            result.append(data[idx])
            idx += 1
        else:
            result.append({"mes": mes, "nuevos": 0, "acumulado": acumulado if idx > 0 else 0})
    
    return result