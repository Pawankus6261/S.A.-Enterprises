from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import models, schemas
from database import engine, get_db

# Create Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to S.A. Enterprises"}

# --- CONSUMER ROUTES ---
@app.post("/consumers/", response_model=schemas.ConsumerResponse)
def create_consumer(consumer: schemas.ConsumerCreate, db: Session = Depends(get_db)):
    db_consumer = db.query(models.Consumer).filter(models.Consumer.mobile == consumer.mobile).first()
    if db_consumer:
        raise HTTPException(status_code=400, detail="Mobile already registered")
    new_consumer = models.Consumer(**consumer.dict())
    db.add(new_consumer)
    db.commit()
    db.refresh(new_consumer)
    return new_consumer

@app.get("/consumers/", response_model=list[schemas.ConsumerResponse])
def get_consumers(db: Session = Depends(get_db)):
    return db.query(models.Consumer).order_by(models.Consumer.id.desc()).all()

@app.put("/consumers/{mobile}", response_model=schemas.ConsumerResponse)
def update_consumer(mobile: str, data: schemas.ConsumerCreate, db: Session = Depends(get_db)):
    db_consumer = db.query(models.Consumer).filter(models.Consumer.mobile == mobile).first()
    if not db_consumer:
        raise HTTPException(status_code=404, detail="Consumer not found")
    
    if data.mobile != mobile:
        existing = db.query(models.Consumer).filter(models.Consumer.mobile == data.mobile).first()
        if existing:
            raise HTTPException(status_code=400, detail="New mobile number already registered")
        db.query(models.Entry).filter(models.Entry.mobile == mobile).update({models.Entry.mobile: data.mobile})

    db_consumer.name = data.name
    db_consumer.mobile = data.mobile
    db_consumer.house_no = data.house_no
    db_consumer.area = data.area
    if hasattr(data, 'custom_rate'):
        db_consumer.custom_rate = data.custom_rate
    
    db.commit()
    db.refresh(db_consumer)
    return db_consumer

@app.delete("/consumers/{mobile}")
def delete_consumer(mobile: str, db: Session = Depends(get_db)):
    db.query(models.Consumer).filter(models.Consumer.mobile == mobile).delete()
    db.query(models.Entry).filter(models.Entry.mobile == mobile).delete()
    db.commit()
    return {"message": "Consumer deleted"}

# --- ENTRY ROUTES ---
@app.post("/entries/", response_model=schemas.EntryResponse)
def create_entry(entry: schemas.EntryCreate, db: Session = Depends(get_db)):
    new_entry = models.Entry(
        name=entry.name,
        mobile=entry.mobile,
        date=entry.date,
        qty=entry.qty,
        price=entry.price, 
        type=entry.type,
        is_paid=entry.is_paid
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

@app.get("/entries/", response_model=list[schemas.EntryResponse])
def get_entries(db: Session = Depends(get_db)):
    return db.query(models.Entry).order_by(models.Entry.id.desc()).all()

@app.put("/entries/{entry_id}", response_model=schemas.EntryResponse)
def update_entry(entry_id: int, entry: schemas.EntryUpdate, db: Session = Depends(get_db)):
    db_entry = db.query(models.Entry).filter(models.Entry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    db_entry.qty = entry.qty
    db_entry.date = entry.date
    db_entry.type = entry.type
    db_entry.price = entry.price
    # We generally don't update 'is_paid' here individually often, but we can
    db_entry.is_paid = entry.is_paid
    
    db.commit()
    db.refresh(db_entry)
    return db_entry

@app.delete("/entries/{entry_id}")
def delete_entry(entry_id: int, db: Session = Depends(get_db)):
    db.query(models.Entry).filter(models.Entry.id == entry_id).delete()
    db.commit()
    return {"message": "Entry deleted"}

# --- NEW: PAYMENT ROUTES ---
@app.put("/payments/mark-month")
def mark_month_status(data: schemas.MonthPayment, db: Session = Depends(get_db)):
    # Find all entries for this mobile matching the "YYYY-MM" prefix
    # SQLite 'LIKE' works for string dates
    search_pattern = f"{data.month}%"
    
    rows_updated = db.query(models.Entry).filter(
        models.Entry.mobile == data.mobile,
        models.Entry.date.like(search_pattern)
    ).update({models.Entry.is_paid: data.status}, synchronize_session=False)
    
    db.commit()
    return {"message": "Status updated", "count": rows_updated}

# --- SETTINGS ROUTES ---
@app.get("/rates")
def get_rates(db: Session = Depends(get_db)):
    normal_setting = db.query(models.Setting).filter(models.Setting.key == "jar_rate").first()
    chilled_setting = db.query(models.Setting).filter(models.Setting.key == "chilled_rate").first()
    
    return {
        "normal": float(normal_setting.value) if normal_setting else 20.0,
        "chilled": float(chilled_setting.value) if chilled_setting else 30.0
    }

@app.post("/rates")
def update_rates(data: dict, db: Session = Depends(get_db)):
    if "normal" in data:
        setting = db.query(models.Setting).filter(models.Setting.key == "jar_rate").first()
        if not setting:
            setting = models.Setting(key="jar_rate", value=str(data["normal"]))
            db.add(setting)
        else:
            setting.value = str(data["normal"])
            
    if "chilled" in data:
        setting = db.query(models.Setting).filter(models.Setting.key == "chilled_rate").first()
        if not setting:
            setting = models.Setting(key="chilled_rate", value=str(data["chilled"]))
            db.add(setting)
        else:
            setting.value = str(data["chilled"])
            
    db.commit()
    return {"message": "Rates updated"}