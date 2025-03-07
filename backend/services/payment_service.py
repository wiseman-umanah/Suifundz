from sqlalchemy.orm import Session
from models.transaction import Transaction
from services.sui_service import send_sui_transaction

def process_payment(db: Session, sender: str, recipient: str, amount: int):
    txn_response = send_sui_transaction(sender, recipient, amount)

    if "error" in txn_response:
        return {"error": txn_response["error"]}

    new_payment = Transaction(
        sender=sender,
        recipient=recipient,
        amount=amount,
        transaction_id=txn_response["result"]["txHash"]
    )
    
    db.add(new_payment)
    db.commit()
    
    return {"success": True, "txn": txn_response}
