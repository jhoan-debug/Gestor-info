from pydantic import BaseModel, validator
from typing import Optional
from datetime import date, datetime

# Esquemas Pydantic: validación y transformación de datos de Clientes.
class ClienteBase(BaseModel):
    nombre: str
    apellido: str
    documento: Optional[str] = None
    telefono: Optional[str] = None
    correo: Optional[str] = None
    direccion: Optional[str] = None
    observaciones: Optional[str] = None
    od_esfera: Optional[str] = None
    od_cilindro: Optional[str] = None
    od_eje: Optional[str] = None
    od_add: Optional[str] = None
    od_dp: Optional[str] = None
    od_alt: Optional[str] = None
    od_prisma: Optional[str] = None
    oi_esfera: Optional[str] = None
    oi_cilindro: Optional[str] = None
    oi_eje: Optional[str] = None
    oi_add: Optional[str] = None
    oi_dp: Optional[str] = None
    oi_alt: Optional[str] = None
    oi_prisma: Optional[str] = None
    tipo_lente: Optional[str] = None
    tratamiento_lente: Optional[str] = None
    laboratorio: Optional[str] = None
    precio: Optional[int] = None
    tiene_factura: Optional[bool] = False
    numero_factura: Optional[str] = None
    archivo: Optional[str] = None
    fecha_cumpleanos: Optional[date] = None

    class Config:
        from_attributes = True  # Para SQLAlchemy

    @validator("numero_factura", always=True)
    def validar_factura(cls, v, values):
        if values.get("tiene_factura") and not v:
            raise ValueError("Debe ingresar el número de factura si tiene factura")
        if not values.get("tiene_factura"):
            return None
        return v

    # Valida y normaliza formatos de fecha para `fecha_cumpleanos`.
    @validator('fecha_cumpleanos', pre=True, always=True)
    def parse_fecha_cumpleanos(cls, v):
        if v in (None, "", "None"):
            return None
        if isinstance(v, str):
            for fmt in [
                '%Y-%m-%d', '%d/%m/%Y', '%d-%m-%Y',
                '%m/%d/%Y', '%Y/%m/%d', '%d.%m.%Y'
            ]:
                try:
                    return datetime.strptime(v, fmt).date()
                except ValueError:
                    continue
            raise ValueError(f'Formato de fecha inválido: {v}')
        return v

class ClienteCreate(ClienteBase):
    # Esquema usado al crear/actualizar un cliente.
    pass

class ClienteOut(ClienteBase):
    # Esquema retornado por la API con el ID incluido.
    id: int

    class Config:
        from_attributes = True

class CumpleanosProximo(BaseModel):
    nombre: str
    apellido: str
    dias: int
    fecha_cumpleanos: Optional[str] = None

    class Config:
        from_attributes = True