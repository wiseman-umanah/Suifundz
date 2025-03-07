from config import SessionLocal
from sqlalchemy.orm import Session


# Dependency: Get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

