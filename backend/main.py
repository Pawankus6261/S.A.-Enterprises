# from fastapi import FastAPI, Depends, HTTPException
# from sqlalchemy.orm import Session
# from fastapi.middleware.cors import CORSMiddleware
# import models, schemas
# from database import engine, get_db

# # Create Tables
# models.Base.metadata.create_all(bind=engine)

# app = FastAPI()

# # Enable CORS (So React can talk to Python)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"], # In production, change to ["http://localhost:5173"]
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --- 1. CONSUMER ROUTES ---

# @app.post("/consumers/", response_model=schemas.ConsumerResponse)
# def create_consumer(consumer: schemas.ConsumerCreate, db: Session = Depends(get_db)):
#     # Check if exists
#     db_consumer = db.query(models.Consumer).filter(models.Consumer.mobile == consumer.mobile).first()
#     if db_consumer:
#         raise HTTPException(status_code=400, detail="Mobile already registered")
    
#     new_consumer = models.Consumer(**consumer.dict())
#     db.add(new_consumer)
#     db.commit()
#     db.refresh(new_consumer)
#     return new_consumer

# @app.get("/consumers/", response_model=list[schemas.ConsumerResponse])
# def get_consumers(db: Session = Depends(get_db)):
#     return db.query(models.Consumer).order_by(models.Consumer.id.desc()).all()

# @app.delete("/consumers/{mobile}")
# def delete_consumer(mobile: str, db: Session = Depends(get_db)):
#     db.query(models.Consumer).filter(models.Consumer.mobile == mobile).delete()
#     db.commit()
#     return {"message": "Consumer deleted"}

# @app.put("/consumers/{mobile}", response_model=schemas.ConsumerResponse)
# def update_consumer(mobile: str, data: schemas.ConsumerCreate, db: Session = Depends(get_db)):
#     # 1. Find the consumer by old mobile number
#     db_consumer = db.query(models.Consumer).filter(models.Consumer.mobile == mobile).first()
    
#     if not db_consumer:
#         raise HTTPException(status_code=404, detail="Consumer not found")
    
#     # 2. Update fields
#     db_consumer.name = data.name
#     db_consumer.house_no = data.house_no
#     db_consumer.area = data.area
    
#     # Optional: If you want to allow changing mobile number, you need complex logic.
#     # For now, we update everything except the ID.
    
#     db.commit()
#     db.refresh(db_consumer)
#     return db_consumer

# @app.post("/entries/", response_model=schemas.EntryResponse)
# def create_entry(entry: schemas.EntryCreate, db: Session = Depends(get_db)):
#     # Get Current Rate
#     rate_setting = db.query(models.Setting).filter(models.Setting.key == "jar_rate").first()
#     rate = float(rate_setting.value) if rate_setting else 20.0
    
#     total_price = entry.qty * rate
    
#     new_entry = models.Entry(
#         name=entry.name,
#         mobile=entry.mobile,
#         date=entry.date,
#         qty=entry.qty,
#         price=total_price
#     )
#     db.add(new_entry)
#     db.commit()
#     db.refresh(new_entry)
#     return new_entry

# @app.get("/entries/", response_model=list[schemas.EntryResponse])
# def get_entries(db: Session = Depends(get_db)):
#     return db.query(models.Entry).order_by(models.Entry.id.desc()).all()

# @app.put("/entries/{entry_id}", response_model=schemas.EntryResponse)
# def update_entry(entry_id: int, entry: schemas.EntryUpdate, db: Session = Depends(get_db)):
#     db_entry = db.query(models.Entry).filter(models.Entry.id == entry_id).first()
#     if not db_entry:
#         raise HTTPException(status_code=404, detail="Entry not found")
    
#     # Recalculate Price
#     rate_setting = db.query(models.Setting).filter(models.Setting.key == "jar_rate").first()
#     rate = float(rate_setting.value) if rate_setting else 20.0
    
#     db_entry.qty = entry.qty
#     db_entry.date = entry.date
#     db_entry.price = entry.qty * rate
    
#     db.commit()
#     db.refresh(db_entry)
#     return db_entry

# @app.delete("/entries/{entry_id}")
# def delete_entry(entry_id: int, db: Session = Depends(get_db)):
#     db.query(models.Entry).filter(models.Entry.id == entry_id).delete()
#     db.commit()
#     return {"message": "Entry deleted"}

# # --- 3. SETTINGS ROUTES ---

# @app.get("/rate")
# def get_rate(db: Session = Depends(get_db)):
#     setting = db.query(models.Setting).filter(models.Setting.key == "jar_rate").first()
#     return {"rate": float(setting.value) if setting else 20.0}

# @app.post("/rate")
# def update_rate(data: schemas.RateUpdate, db: Session = Depends(get_db)):
#     setting = db.query(models.Setting).filter(models.Setting.key == "jar_rate").first()
#     if not setting:
#         setting = models.Setting(key="jar_rate", value=str(data.rate))
#         db.add(setting)
#     else:
#         setting.value = str(data.rate)
    
#     db.commit()
#     return {"message": "Rate updated", "rate": data.rate}

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"status": "Backend running on Vercel"}
