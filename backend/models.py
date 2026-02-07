from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, func
from database import Base

class Consumer(Base):
    __tablename__ = "consumers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    mobile = Column(String, unique=True, index=True, nullable=False)
    house_no = Column(String, nullable=True)
    area = Column(String, nullable=True)
    custom_rate = Column(Float, nullable=True) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Entry(Base):
    __tablename__ = "entries"

    id = Column(Integer, primary_key=True, index=True)
    mobile = Column(String, index=True, nullable=False)
    name = Column(String)
    date = Column(String, nullable=False)
    qty = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    
    # --- NEW COLUMNS ---
    type = Column(String, default="normal") # 'normal' or 'chilled'
    is_paid = Column(Boolean, default=False) # True = Paid, False = Unpaid
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Setting(Base):
    __tablename__ = "settings"
    key = Column(String, primary_key=True, index=True)
    value = Column(String)