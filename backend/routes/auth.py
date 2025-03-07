from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from models.user import User
from utils.helpers import get_db
from utils.security import get_current_user
from models.wallet import Wallet
from utils.security import hash_password, verify_password, create_access_token
import logging



logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


# Pydantic models for request bodies
class UserCreate(BaseModel):
	email: str
	password: str

class UserLogin(BaseModel):
	email: str
	password: str


# Register a new user
@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
	existing_user = db.query(User).filter(User.email == user.email).first()
	if existing_user:
		raise HTTPException(status_code=400, detail="Email already registered")
	
	new_user = User(email=user.email, hashed_password=hash_password(user.password))
	db.add(new_user)
	db.commit()
	return {"message": "User registered successfully"}


# Login and get JWT token
@router.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
	db_user = db.query(User).filter(User.email == user.email).first()
	if not db_user or not verify_password(user.password, db_user.hashed_password):
		raise HTTPException(status_code=401, detail="Invalid credentials")
	
	token = create_access_token({"sub": db_user.id})
	return {"access_token": token}



@router.post("/wallet/connect")
def connect_wallet(address: str, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
	"""Save or update the user's wallet address."""
	
	logger.info(f"Connecting wallet for user ID: {user['id']} with address: {address}")
	id = user['id']
	existing_wallet = db.query(Wallet).filter(Wallet.user_id == user['id']).first()

	if existing_wallet:
		existing_wallet.address = address  # Update existing wallet
	else:
		new_wallet = Wallet(user_id=id, address=address)
		db.add(new_wallet)
	
	db.commit()
	return {"message": "Wallet connected successfully", "address": address}
