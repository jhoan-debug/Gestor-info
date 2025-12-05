from pydantic import BaseModel, validator
from typing import Optional
from datetime import date, datetime

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

    # Agrega el validador aquí, indentado correctamente (4 espacios bajo la clase)
    @validator('fecha_cumpleanos', pre=True, always=True)
    def parse_fecha_cumpleanos(cls, v):
        if v is None or v == "" or v == "None":
            return None
        if isinstance(v, str):
            # Intenta formatos comunes: YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY
            for fmt in ['%Y-%m-%d', '%d/%m/%Y', '%d-%m-%Y']:
                try:
                    return datetime.strptime(v, fmt).date()
                except ValueError:
                    continue
            raise ValueError(f'Formato de fecha inválido: {v}. Usa YYYY-MM-DD, DD/MM/YYYY o DD-MM-YYYY.')
        return v

class ClienteCreate(ClienteBase):
    pass

class ClienteOut(ClienteBase):
    id: int

class CumpleanosProximo(BaseModel):
    id: int
    nombre: str
    apellido: str
    dias: int

    class Config:
        orm_mode = True