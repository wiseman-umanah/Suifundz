from sqlalchemy import Column, Integer, String
from config import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    sender = Column(String, nullable=False)
    recipient = Column(String, nullable=False)
    amount = Column(Integer, nullable=False)
    transaction_id = Column(String, unique=True, nullable=False)
