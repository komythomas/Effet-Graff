from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import uuid
from supabase import Client

from app.schemas.all_schemas import Personne, PersonneUpdate, PersonneCreate
from app.dependencies import get_supabase_client, require_auth, require_admin, require_write_access, get_current_user_id

router = APIRouter(
    prefix="/personnes",
    tags=["Personnes"],
)

# --- Routes Utilisateur (Mon Profil) ---

@router.get("/me", response_model=Personne)
def read_my_profile(user_id: uuid.UUID = Depends(require_auth), db: Client = Depends(get_supabase_client)):
    """Récupère le profil de l'utilisateur connecté."""
    # La RLS sur la table 'personnes' garantit que l'utilisateur ne voit que son propre profil
    data, count = db.table("personnes").select("*").eq("auth_user_id", str(user_id)).single().execute()
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profil non trouvé. Veuillez compléter l'onboarding.")
    return data[1]

@router.put("/me", response_model=Personne)
def update_my_profile(profile_update: PersonneUpdate, user_id: uuid.UUID = Depends(require_auth), db: Client = Depends(get_supabase_client)):
    """Met à jour le profil de l'utilisateur connecté (utilisé pour l'onboarding)."""
    # Seuls les champs non-admin sont autorisés pour l'utilisateur
    update_data = profile_update.model_dump(exclude_unset=True, exclude={'statut_profil'})
    
    data, count = db.table("personnes").update(update_data).eq("auth_user_id", str(user_id)).execute()
    
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profil non trouvé ou mise à jour échouée")
    return data[1][0]

# --- Routes Administrateur/Staff (Gestion des profils) ---

@router.get("/pending", response_model=List[Personne])
def read_pending_profiles(db: Client = Depends(get_supabase_client), role: str = Depends(require_write_access)):
    """Liste les profils en attente de validation (réservé aux admins et staff)."""
    data, count = db.table("personnes").select("*").eq("statut_profil", "en_attente").execute()
    return data[1]

@router.post("/{personne_id}/approve", response_model=Personne)
def approve_profile(personne_id: uuid.UUID, db: Client = Depends(get_supabase_client), role: str = Depends(require_write_access)):
    """Approuve un profil et déclenche potentiellement la création du badge (réservé aux admins et staff)."""
    # Mettre à jour le statut du profil
    update_data = {"statut_profil": "approuve"}
    data, count = db.table("personnes").update(update_data).eq("id", str(personne_id)).execute()
    
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profil non trouvé")
    
    return data[1][0]

@router.post("/", response_model=Personne, status_code=status.HTTP_201_CREATED)
def create_personne_admin(personne: PersonneCreate, db: Client = Depends(get_supabase_client), role: str = Depends(require_write_access)):
    """Crée manuellement une personne (réservé aux admins et staff)."""
    data, count = db.table("personnes").insert(personne.model_dump()).execute()
    return data[1][0]
