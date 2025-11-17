from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2Bearer
from app.config import settings
from supabase import create_client, Client
from jose import jwt, JWTError
from typing import Optional, Dict, Any
import uuid

# Initialisation du schéma de sécurité
oauth2_scheme = OAuth2Bearer(auto_error=False)

def get_supabase_client() -> Client:
    """Retourne une instance du client Supabase."""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def get_current_user_claims(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
    """Décode le token JWT et retourne les claims de l'utilisateur."""
    if not token:
        # Permet aux routes publiques de ne pas nécessiter de token
        return {} 
    try:
        # Supabase utilise l'algorithme HS256 par défaut pour les tokens d'accès
        # NOTE: La clé secrète doit être la clé JWT secrète de Supabase (trouvée dans les paramètres de l'API)
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM], audience="authenticated")
        return payload
    except JWTError:
        # Ne pas lever d'exception si le token est manquant pour les routes publiques
        if token is None:
            return {}
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Jeton d'authentification invalide ou expiré",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user_id(claims: Dict[str, Any] = Depends(get_current_user_claims)) -> Optional[uuid.UUID]:
    """Extrait l'ID utilisateur (uid) des claims."""
    user_id = claims.get("sub")
    if user_id:
        return uuid.UUID(user_id)
    return None

def get_current_user_role(claims: Dict[str, Any] = Depends(get_current_user_claims)) -> str:
    """Extrait le rôle utilisateur (via custom claims) ou retourne 'public'."""
    # Le rôle est stocké dans les custom claims de Supabase (ex: claims['user_role'])
    # Si le rôle n'est pas défini, on utilise le type de profil de la table 'personnes'
    # Pour l'instant, on se base sur le custom claim pour la sécurité.
    role = claims.get("user_role", "public")
    return role

def require_auth(user_id: uuid.UUID = Depends(get_current_user_id)):
    """Dépendance pour les routes nécessitant une authentification."""
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentification requise",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user_id

def require_admin(role: str = Depends(get_current_user_role)):
    """Dépendance pour les routes nécessitant le rôle 'admin'."""
    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé. Rôle administrateur requis.",
        )
    return role

def require_write_access(role: str = Depends(get_current_user_role)):
    """Dépendance pour les routes nécessitant le rôle 'admin' ou 'staff'."""
    if role not in ["admin", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé. Rôle administrateur ou staff requis.",
        )
    return role
