from pydantic import BaseModel
from typing import Optional

# --- CONSUMER SCHEMAS ---
class ConsumerBase(BaseModel):
    name: str
    mobile: str
    house_no: Optional[str] = None
    area: Optional[str] = None
    custom_rate: Optional[float] = None 

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
    type: str = "normal" 
    price: float 
    is_paid: bool = False # Default unpaid

class EntryUpdate(BaseModel):
    qty: int
    date: str
    type: str = "normal"
    price: float
    is_paid: bool = False

class EntryResponse(BaseModel):
    id: int
    name: str
    mobile: str
    date: str
    qty: int
    price: float
    type: str
    is_paid: bool
    class Config:
        from_attributes = True

class RateUpdate(BaseModel):
    rate: float

# New Schema for Marking Paid
class MonthPayment(BaseModel):
    mobile: str
    month: str # Format: "YYYY-MM"
    status: bool # True for Paid, False for Unpaid