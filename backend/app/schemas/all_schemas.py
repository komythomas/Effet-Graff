from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
import uuid
from datetime import date, datetime

# --- Personne (Révisé pour la clarté) ---
class PersonneBase(BaseModel):
    type: str
    nom: Optional[str] = None
    prenom: Optional[str] = None
    nom_artiste: Optional[str] = None
    bio: Optional[str] = None
    email: Optional[EmailStr] = None
    telephone: Optional[str] = None
    site_web: Optional[str] = None
    reseaux_sociaux: Optional[Dict[str, Any]] = None

class PersonneCreate(PersonneBase):
    # Utilisé pour la création manuelle par un admin
    auth_user_id: Optional[uuid.UUID] = None

class PersonneUpdate(BaseModel):
    nom: Optional[str] = None
    prenom: Optional[str] = None
    nom_artiste: Optional[str] = None
    bio: Optional[str] = None
    onboarding_complete: Optional[bool] = None
    statut_profil: Optional[str] = None # Pour l'admin

class Personne(PersonneBase):
    id: uuid.UUID
    auth_user_id: Optional[uuid.UUID] = None
    statut_profil: str
    onboarding_complete: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Fresque ---
class FresqueBase(BaseModel):
    titre: str
    technique: Optional[str] = None
    dimensions: Optional[str] = None
    symbolisme: Optional[str] = None
    description: Optional[str] = None
    annee_creation: Optional[int] = None
    statut: str = 'visible'

class FresqueCreate(FresqueBase):
    pass

class Fresque(FresqueBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True

# --- Edition ---
class EditionBase(BaseModel):
    annee: int
    theme: Optional[str] = None
    date_debut: date
    date_fin: date
    statut: str = 'planifiee'
    description: Optional[str] = None

class EditionCreate(EditionBase):
    pass

class Edition(EditionBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True

# --- Lieu ---
class LieuBase(BaseModel):
    nom: str
    adresse: Optional[str] = None
    # Les coordonnées GPS sont stockées comme un POINT dans PG, on utilise un tuple/liste ici
    coordonnees_gps: Optional[List[float]] = None 
    description: Optional[str] = None
    type_lieu: Optional[str] = None

class LieuCreate(LieuBase):
    pass

class Lieu(LieuBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True

# --- Partenaire ---
class PartenaireBase(BaseModel):
    nom: str
    type_partenariat: Optional[str] = None
    description: Optional[str] = None
    contact_principal_id: Optional[uuid.UUID] = None
    site_web: Optional[str] = None

class PartenaireCreate(PartenaireBase):
    pass

class Partenaire(PartenaireBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True

# --- Media ---
class MediaBase(BaseModel):
    url_fichier: str
    type_media: str
    titre: Optional[str] = None
    description: Optional[str] = None
    credits: Optional[str] = None
    fresque_id: Optional[uuid.UUID] = None
    personne_id: Optional[uuid.UUID] = None
    edition_id: Optional[uuid.UUID] = None
    lieu_id: Optional[uuid.UUID] = None

class MediaCreate(MediaBase):
    pass

class Media(MediaBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True

# --- Badge ---
class BadgeBase(BaseModel):
    personne_id: uuid.UUID
    url_badge: str
    type_badge: str
    is_active: bool = True

class BadgeCreate(BadgeBase):
    pass

class Badge(BadgeBase):
    id: uuid.UUID
    date_emission: datetime

    class Config:
        from_attributes = True
