from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import fresques, personnes
from app.config import settings

app = FastAPI(
    title="API EFFETGRAFF",
    description="API RESTful pour la gestion du festival EFFETGRAFF (FastAPI + Supabase)",
    version="1.0.0",
)

# Configuration CORS pour permettre au frontend Next.js d'accéder à l'API
origins = [
    "http://localhost:3000",  # Frontend local
    # Ajoutez ici l'URL de production de votre frontend Next.js
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routeurs
app.include_router(fresques.router, prefix="/api/v1")
app.include_router(personnes.router, prefix="/api/v1")

@app.get("/api/v1/health")
def health_check():
    return {"status": "ok", "service": "EffetGraff API"}
