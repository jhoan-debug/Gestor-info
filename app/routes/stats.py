# app/routes/stats.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import extract, func
from datetime import date
from app.db_pg import get_db, SessionLocal, engine
from app import models
from datetime import timedelta

router = APIRouter(
    prefix="/stats",
    tags=["Estadísticas"]
)

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    # Devuelve estadísticas del dashboard: totales y conteos por mes.
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

    from datetime import timedelta  # Agrega esta importación arriba si no la tienes

@router.get("/actividad-reciente")
def get_actividad_reciente(dias: int = 7, db: Session = Depends(get_db)):
    try:
        hoy = date.today()
        inicio = hoy - timedelta(days=dias - 1)  # Últimos 7 días incluyendo hoy
        
        print(f"Fecha hoy (servidor): {hoy}")
        print(f"Fecha inicio: {inicio}")
        
        resultados = []
        for i in range(dias):
            dia_actual = inicio + timedelta(days=i)
            dia_siguiente = dia_actual + timedelta(days=1)
            
            print(f"Procesando día: {dia_actual}")
            
            # Consultas: Cuenta clientes creados ese día
            consultas = db.query(models.Cliente)\
                .filter(
                    models.Cliente.fecha_registro >= dia_actual,
                    models.Cliente.fecha_registro < dia_siguiente
                ).count()
            
            # Ventas: Suma de precios para clientes que compraron (precio > 0) ese día
            ventas = db.query(func.sum(models.Cliente.precio))\
                .filter(
                    models.Cliente.fecha_registro >= dia_actual,
                    models.Cliente.fecha_registro < dia_siguiente,
                    models.Cliente.precio > 0
                ).scalar() or 0
            
            # Nuevos clientes: Igual a consultas
            nuevos_clientes = consultas
            
            dia_fecha = dia_actual.strftime("%Y-%m-%d")
            
            print(f"Día {dia_fecha}: consultas={consultas}, ventas={ventas}, nuevos_clientes={nuevos_clientes}")
            
            resultados.append({
                "dia": dia_fecha,
                "consultas": consultas,
                "ventas": ventas,
                "nuevos_clientes": nuevos_clientes
            })
        
        print(f"Resultados finales: {resultados}")
        return resultados
    except Exception as e:
        print(f"Error en get_actividad_reciente: {e}")
        raise
        
@router.get("/registros-por-mes")
def get_registros_por_mes(anio: int = 2026, db: Session = Depends(get_db)):
    # Devuelve conteo de clientes registrados por mes en un año específico, con acumulado.
    # Parámetro opcional: anio (por defecto 2026)
    
    # Consulta: Agrupa por mes y cuenta nuevos clientes
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
    
    # Mapeo de meses
    meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    
    # Calcula acumulado
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
    
    # Rellena meses sin datos con 0
    result = []
    idx = 0
    for mes in meses:
        if idx < len(data) and data[idx]['mes'] == mes:
            result.append(data[idx])
            idx += 1
        else:
            result.append({"mes": mes, "nuevos": 0, "acumulado": acumulado if idx > 0 else 0})
    
    return result