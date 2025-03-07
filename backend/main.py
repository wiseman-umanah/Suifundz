from fastapi import FastAPI
from routes.auth import router as auth_router
from routes.payment import router as pay_router
from config import engine, Base

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

# Include authentication routes
app.include_router(auth_router, prefix="/auth")
app.include_router(pay_router, prefix="/pay")

@app.get("/")
def home():
    return {"message": "Payment API is running"}
