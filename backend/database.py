from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Format: postgresql://user:password@localhost/dbname
# Change 'postgres' and 'password' to your actual credentials
# NOTE: Special characters in password must be URL-encoded (e.g., @ -> %40)
# Or use urllib.parse.quote_plus
import urllib.parse
password = urllib.parse.quote_plus("Pawan@2008") 
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", f"postgresql://postgres:{password}@localhost/sa_enterprises")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()