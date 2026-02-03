from sqlalchemy import Column, Integer, String, Float, DateTime, func
from database import Base

# 1. Consumer Table
class Consumer(Base):
    __tablename__ = "consumers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    mobile = Column(String, unique=True, index=True, nullable=False)
    house_no = Column(String, nullable=True)
    area = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# 2. Entry Table (Daily Logs)
class Entry(Base):
    __tablename__ = "entries"

    id = Column(Integer, primary_key=True, index=True)
    mobile = Column(String, index=True, nullable=False) # Linked to Consumer Mobile
    name = Column(String) # Snapshot of name
    date = Column(String, nullable=False) # YYYY-MM-DD
    qty = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# 3. Settings Table (Global Config)
class Setting(Base):
    __tablename__ = "settings"

    key = Column(String, primary_key=True, index=True) # e.g., 'jar_rate'
    value = Column(String) # Stored as string, converted when needed