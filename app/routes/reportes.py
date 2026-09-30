from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import extract, func
from datetime import date
from app.database.db_pg import get_db
from app.models.models import Cliente

router = APIRouter(prefix="/reportes", tags=["Reportes"])

def parse_float_seguro(valor):
    """Limpia signos y espacios para convertir un str como '+2.50' a float 2.50 de forma segura."""
    if not valor:
        return None
    try:
        # Reemplaza comas por puntos por si acaso y elimina espacios
        val_clean = str(valor).replace(',', '.').strip()
        return float(val_clean)
    except (ValueError, TypeError):
        return None


@router.get("/cumpleanos")
def obtener_cumpleanos(db: Session = Depends(get_db)):
    hoy = date.today()
    return db.query(Cliente).filter(
        Cliente.fecha_cumpleanos.isnot(None),
        extract('month', Cliente.fecha_cumpleanos) == hoy.month
    ).all()


@router.get("/edades")
def obtener_distribucion_edades(db: Session = Depends(get_db)):
    hoy = date.today()
    clientes = db.query(Cliente.fecha_cumpleanos).filter(Cliente.fecha_cumpleanos.isnot(None)).all()
    
    rangos = {"0-18": 0, "19-35": 0, "36-50": 0, "51-65": 0, "66+": 0}
    
    for (fecha_nac,) in clientes:
        if fecha_nac:
            edad = hoy.year - fecha_nac.year - ((hoy.month, hoy.day) < (fecha_nac.month, fecha_nac.day))
            if edad <= 18:
                rangos["0-18"] += 1
            elif edad <= 35:
                rangos["19-35"] += 1
            elif edad <= 50:
                rangos["36-50"] += 1
            elif edad <= 65:
                rangos["51-65"] += 1
            else:
                rangos["66+"] += 1

    return [{"name": k, "value": v} for k, v in rangos.items()]


@router.get("/lentes")
def obtener_tipos_lentes(db: Session = Depends(get_db)):
    resultados = (
        db.query(Cliente.tipo_lente, func.count(Cliente.id).label("value"))
        .filter(Cliente.tipo_lente.isnot(None), Cliente.tipo_lente != "")
        .group_by(Cliente.tipo_lente)
        .order_by(func.count(Cliente.id).desc())
        .limit(5)
        .all()
    )
    return [{"name": r.tipo_lente, "value": r.value} for r in resultados]


@router.get("/formulas")
def obtener_resumen_formulas(db: Session = Depends(get_db)):
    clientes = db.query(Cliente.od_esfera, Cliente.oi_esfera).all()
    conteo = {}

    for od, oi in clientes:
        val_od = parse_float_seguro(od)
        val_oi = parse_float_seguro(oi)
        
        # Prioriza OD y cae a OI si OD no existe
        esfera = val_od if val_od is not None else val_oi
        if esfera is None:
            continue

        if esfera < -2:
            rango = "Miopía alta"
        elif -2 <= esfera < 0:
            rango = "Miopía leve"
        elif esfera > 2:
            rango = "Hipermetropía alta"
        elif esfera > 0:
            rango = "Hipermetropía leve"
        else:
            rango = "Emetropía / Neutro"

        conteo[rango] = conteo.get(rango, 0) + 1

    return [{"name": k, "value": v} for k, v in sorted(conteo.items(), key=lambda x: x[1], reverse=True)]


@router.get("/graduaciones-extremas")
def obtener_graduaciones_extremas(db: Session = Depends(get_db)):
    clientes = db.query(Cliente).all()
    extremados = []

    for c in clientes:
        od_esf = abs(parse_float_seguro(c.od_esfera) or 0)
        oi_esf = abs(parse_float_seguro(c.oi_esfera) or 0)
        od_cil = abs(parse_float_seguro(c.od_cilindro) or 0)
        oi_cil = abs(parse_float_seguro(c.oi_cilindro) or 0)

        if od_esf > 6 or oi_esf > 6 or od_cil > 2 or oi_cil > 2:
            extremados.append(c)

    return extremados