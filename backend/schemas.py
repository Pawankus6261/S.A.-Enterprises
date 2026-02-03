from pydantic import BaseModel
from typing import Optional

# --- CONSUMER SCHEMAS ---
class ConsumerBase(BaseModel):
    name: str
    mobile: str
    house_no: Optional[str] = None
    area: Optional[str] = None

class ConsumerCreate(ConsumerBase):
    pass

class ConsumerResponse(ConsumerBase):
    id: int
    class Config:
        from_attributes = True

# --- ENTRY SCHEMAS ---
class EntryCreate(BaseModel):
    name: str
    mobile: str
    date: str
    qty: int
    # Price is calculated on backend

class EntryUpdate(BaseModel):
    date: str
    qty: int

class EntryResponse(BaseModel):
    id: int
    name: str
    mobile: str
    date: str
    qty: int
    price: float
    class Config:
        from_attributes = True

# --- SETTINGS SCHEMA ---
class RateUpdate(BaseModel):
    rate: float