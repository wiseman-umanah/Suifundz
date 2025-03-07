import requests
from fastapi import HTTPException, Depends, APIRouter
from utils.helpers import get_db
from models.wallet import Wallet
from utils.security import get_current_user
from sqlalchemy.orm import Session
from pydantic import BaseModel


SUI_RPC_URL = "https://fullnode.testnet.sui.io:443"

class Transfer(BaseModel):
	receiver_address: str
	amount: int


router = APIRouter()

@router.post("/wallet/transfer")
def transfer_sui(transfer: Transfer, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
	"""Transfers SUI from the user's wallet to another wallet."""
	id = user['id']
	# Get sender's wallet address
	user_wallet = db.query(Wallet).filter(Wallet.user_id == id).first()
	if not user_wallet:
		raise HTTPException(status_code=400, detail="Wallet not connected")

	sender_address = user_wallet.address

	# Construct the transaction payload
	transaction_payload = {
		"jsonrpc": "2.0",
		"id": 1,
		"method": "sui_transferSui",
		"params": {
			"sender": sender_address,
			"recipient": transfer.receiver_address,
			"amount": transfer.amount,  # Amount in MIST (1 SUI = 1,000,000,000 MIST)
			"gas_budget": 1000000
		}
	}

	# Send the request to the Sui blockchain
	response = requests.post(SUI_RPC_URL, headers={"Content-Type": "application/json"}, json=transaction_payload)

	if response.status_code != 200:
		raise HTTPException(status_code=500, detail="Transaction failed")

	tx_result = response.json()
	print(tx_result)
	
	return {"message": "Transaction successful", "transaction_hash": tx_result.get("result", "No result key")}

