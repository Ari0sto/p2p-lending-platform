from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, loans, investments, users, admin


app = FastAPI(
    title="P2P Lending Platform"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(loans.router)
app.include_router(investments.router)
app.include_router(users.router)
app.include_router(admin.router)

