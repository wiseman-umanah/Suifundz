from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from config import Base



class Wallet(Base):
	__tablename__ = "wallet"

	id = Column(Integer, primary_key=True, index=True)
	address = Column(String, unique=True, index=True, nullable=False)
	user_id = Column(Integer, ForeignKey("users.id"))
	
	user = relationship("User")

