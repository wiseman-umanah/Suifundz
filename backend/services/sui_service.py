import requests
import json
from eth_keys import keys
import binascii
from config import SUI_RPC_URL, PRIVATE_KEY_HEX

def sign_transaction(message: str, private_key_hex: str):
    private_key_bytes = binascii.unhexlify(private_key_hex)
    private_key = keys.PrivateKey(private_key_bytes)
    signature = private_key.sign_msg(bytes.fromhex(message))
    return signature.to_hex()

def send_sui_transaction(sender: str, recipient: str, amount: int):
    txn_payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "sui_sendTransaction",
        "params": [
            {
                "sender": sender,
                "recipient": recipient,
                "amount": amount
            }
        ]
    }

    txn_str = json.dumps(txn_payload)
    signature = sign_transaction(txn_str, PRIVATE_KEY_HEX)

    txn_payload["params"].append(signature)

    response = requests.post(SUI_RPC_URL, json=txn_payload)
    return response.json()
