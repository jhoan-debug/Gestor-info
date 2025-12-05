from pydantic import BaseModel
from typing import Optional
from datetime import date  # --> Importa para validar fechas

class ClienteBase(BaseModel):
    nombre: str
    apellido: str
    documento: str
    telefono: str | None = None
    correo: str | None = None
    direccion: str | None = None
    formula_od: str | None = None
    formula_oi: str | None = None
    observaciones: str | None = None
    
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
    
    fecha_cumpleanos: date | None = None

class ClienteCreate(ClienteBase):
    pass

class ClienteOut(ClienteBase):
    id: int

    class Config:
        orm_mode = True