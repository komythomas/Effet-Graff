from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import uuid
from supabase import Client

from app.schemas.all_schemas import Fresque, FresqueCreate
from app.dependencies import get_supabase_client, require_write_access

router = APIRouter(
    prefix="/fresques",
    tags=["Fresques"],
)

# --- Routes Publiques (Lecture) ---

@router.get("/", response_model=List[Fresque])
def read_fresques(skip: int = 0, limit: int = 100, db: Client = Depends(get_supabase_client)):
    """Liste toutes les fresques (accessible à tous)."""
    data, count = db.table("fresques").select("*").range(skip, skip + limit - 1).execute()
    return data[1]

@router.get("/{fresque_id}", response_model=Fresque)
def read_fresque(fresque_id: uuid.UUID, db: Client = Depends(get_supabase_client)):
    """Obtient les détails d'une fresque spécifique (accessible à tous)."""
    data, count = db.table("fresques").select("*").eq("id", str(fresque_id)).single().execute()
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fresque non trouvée")
    return data[1]

# --- Routes Administrateur/Staff (Écriture) ---

@router.post("/", response_model=Fresque, status_code=status.HTTP_201_CREATED)
def create_fresque(fresque: FresqueCreate, db: Client = Depends(get_supabase_client), role: str = Depends(require_write_access)):
    """Crée une nouvelle fresque (réservé aux admins et staff)."""
    data, count = db.table("fresques").insert(fresque.model_dump()).execute()
    return data[1][0]

@router.put("/{fresque_id}", response_model=Fresque)
def update_fresque(fresque_id: uuid.UUID, fresque: FresqueCreate, db: Client = Depends(get_supabase_client), role: str = Depends(require_write_access)):
    """Met à jour une fresque (réservé aux admins et staff)."""
    data, count = db.table("fresques").update(fresque.model_dump(exclude_unset=True)).eq("id", str(fresque_id)).execute()
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fresque non trouvée")
    return data[1][0]

@router.delete("/{fresque_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_fresque(fresque_id: uuid.UUID, db: Client = Depends(get_supabase_client), role: str = Depends(require_write_access)):
    """Supprime une fresque (réservé aux admins et staff)."""
    data, count = db.table("fresques").delete().eq("id", str(fresque_id)).execute()
    if count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fresque non trouvée")
    return
