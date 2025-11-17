-- #############################################################################
-- ### Script de création des tables pour le festival EFFETGRAFF (v2)         ###
-- ### Intégration de la validation de profil, badges et Row Level Security  ###
-- #############################################################################

-- ========= TABLES PRINCIPALES =========

-- Table pour toutes les personnes (artistes, staff, bénévoles, etc.)
CREATE TABLE personnes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE, -- Lien vers Supabase Auth
    type TEXT NOT NULL CHECK (type IN ('artiste', 'staff', 'benevole', 'partenaire', 'autre')),
    nom TEXT,
    prenom TEXT,
    nom_artiste TEXT,
    bio TEXT,
    email TEXT UNIQUE,
    telephone TEXT,
    site_web TEXT,
    reseaux_sociaux JSONB,
    statut_profil TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut_profil IN ('en_attente', 'approuve', 'rejete')),
    onboarding_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE personnes IS 'Contient tous les individus. Les profils sont créés par les utilisateurs et validés par les admins.';

-- Table pour les éditions du festival
CREATE TABLE editions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    annee INT NOT NULL UNIQUE,
    theme TEXT,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    statut TEXT NOT NULL DEFAULT 'planifiee' CHECK (statut IN ('planifiee', 'en_cours', 'terminee', 'annulee')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE editions IS 'Définit chaque édition annuelle du festival.';

-- Table pour les lieux (murs, espaces d'exposition, etc.)
CREATE TABLE lieux (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    adresse TEXT,
    coordonnees_gps POINT,
    description TEXT,
    type_lieu TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE lieux IS 'Répertorie tous les emplacements physiques utilisés par le festival.';

-- Table pour les fresques et œuvres d'art
CREATE TABLE fresques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titre TEXT NOT NULL,
    technique TEXT,
    dimensions TEXT,
    symbolisme TEXT,
    description TEXT,
    annee_creation INT,
    statut TEXT NOT NULL DEFAULT 'visible' CHECK (statut IN ('visible', 'effacee', 'en_creation', 'vandalisee')),
    created_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE fresques IS 'Catalogue de toutes les œuvres créées pendant le festival.';

-- Table pour les partenaires et sponsors
CREATE TABLE partenaires (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL UNIQUE,
    type_partenariat TEXT,
    description TEXT,
    contact_principal_id UUID REFERENCES personnes(id) ON DELETE SET NULL,
    site_web TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE partenaires IS 'Liste des organisations qui soutiennent le festival.';

-- Table pour les badges des membres
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    personne_id UUID NOT NULL UNIQUE REFERENCES personnes(id) ON DELETE CASCADE,
    url_badge TEXT NOT NULL,
    type_badge TEXT NOT NULL,
    date_emission TIMESTAMPTZ DEFAULT now(),
    is_active BOOLEAN DEFAULT TRUE
);
COMMENT ON TABLE badges IS 'Stocke les badges numériques ou physiques générés pour les membres approuvés.';


-- ========= TABLES DE LIAISON (MODULARITÉ) =========

CREATE TABLE edition_personne (
    edition_id UUID NOT NULL REFERENCES editions(id) ON DELETE CASCADE,
    personne_id UUID NOT NULL REFERENCES personnes(id) ON DELETE CASCADE,
    role_specifique TEXT,
    PRIMARY KEY (edition_id, personne_id)
);

CREATE TABLE fresque_personne (
    fresque_id UUID NOT NULL REFERENCES fresques(id) ON DELETE CASCADE,
    personne_id UUID NOT NULL REFERENCES personnes(id) ON DELETE CASCADE,
    PRIMARY KEY (fresque_id, personne_id)
);

CREATE TABLE fresque_edition (
    fresque_id UUID NOT NULL REFERENCES fresques(id) ON DELETE CASCADE,
    edition_id UUID NOT NULL REFERENCES editions(id) ON DELETE CASCADE,
    PRIMARY KEY (fresque_id, edition_id)
);

CREATE TABLE fresque_lieu (
    fresque_id UUID NOT NULL REFERENCES fresques(id) ON DELETE CASCADE,
    lieu_id UUID NOT NULL REFERENCES lieux(id) ON DELETE CASCADE,
    PRIMARY KEY (fresque_id, lieu_id)
);

CREATE TABLE partenaire_edition (
    partenaire_id UUID NOT NULL REFERENCES partenaires(id) ON DELETE CASCADE,
    edition_id UUID NOT NULL REFERENCES editions(id) ON DELETE CASCADE,
    PRIMARY KEY (partenaire_id, edition_id)
);

-- ========= TABLES SUPPLÉMENTAIRES (ÉVOLUTIVITÉ) =========

CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url_fichier TEXT NOT NULL,
    type_media TEXT NOT NULL CHECK (type_media IN ('image', 'video', 'audio')),
    titre TEXT,
    description TEXT,
    credits TEXT,
    fresque_id UUID REFERENCES fresques(id) ON DELETE CASCADE,
    personne_id UUID REFERENCES personnes(id) ON DELETE CASCADE,
    edition_id UUID REFERENCES editions(id) ON DELETE CASCADE,
    lieu_id UUID REFERENCES lieux(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE logs (
    id BIGSERIAL PRIMARY KEY,
    table_concernee TEXT NOT NULL,
    enregistrement_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    details_modification JSONB,
    modifie_par UUID REFERENCES auth.users(id),
    modifie_le TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE hashtags (
    id SERIAL PRIMARY KEY,
    tag TEXT NOT NULL UNIQUE
);

CREATE TABLE entite_hashtag (
    hashtag_id INT NOT NULL REFERENCES hashtags(id) ON DELETE CASCADE,
    fresque_id UUID REFERENCES fresques(id) ON DELETE CASCADE,
    edition_id UUID REFERENCES editions(id) ON DELETE CASCADE,
    personne_id UUID REFERENCES personnes(id) ON DELETE CASCADE,
    PRIMARY KEY (hashtag_id, fresque_id, edition_id, personne_id)
);


-- #############################################################################
-- ### Configuration de la Sécurité au Niveau des Lignes (Row Level Security) ###
-- #############################################################################

-- 1. Créer une fonction pour extraire le rôle de l'utilisateur depuis son token JWT
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('request.jwt.claims', true)::jsonb->>'user_role';
EXCEPTION
  WHEN others THEN
    RETURN '';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Activer la RLS sur les tables sensibles
ALTER TABLE personnes ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fresques ENABLE ROW LEVEL SECURITY;

-- 3. Définir les politiques pour la table `personnes`
-- Les admins peuvent tout faire
CREATE POLICY "Admins can manage all profiles" ON personnes
    FOR ALL USING (get_user_role() = 'admin');

-- Les utilisateurs peuvent créer leur propre profil
CREATE POLICY "Users can insert their own profile" ON personnes
    FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

-- Les utilisateurs peuvent voir et modifier leur propre profil
CREATE POLICY "Users can view and update their own profile" ON personnes
    FOR SELECT, UPDATE USING (auth.uid() = auth_user_id);

-- Les utilisateurs connectés peuvent voir les profils approuvés
CREATE POLICY "Authenticated users can view approved profiles" ON personnes
    FOR SELECT USING (statut_profil = 'approuve');

-- 4. Définir les politiques pour les autres tables (exemples)
-- Tout le monde peut voir les éditions et les fresques (données publiques)
CREATE POLICY "Public can view editions" ON editions FOR SELECT USING (true);
CREATE POLICY "Public can view fresques" ON fresques FOR SELECT USING (true);

-- Seuls les admins peuvent créer/modifier/supprimer des éditions et fresques
CREATE POLICY "Admins can manage editions" ON editions
    FOR INSERT, UPDATE, DELETE USING (get_user_role() = 'admin');
CREATE POLICY "Admins can manage fresques" ON fresques
    FOR INSERT, UPDATE, DELETE USING (get_user_role() = 'admin');

-- Les utilisateurs peuvent voir leur propre badge
CREATE POLICY "Users can see their own badge" ON badges
    FOR SELECT USING (EXISTS (SELECT 1 FROM personnes WHERE personnes.id = badges.personne_id AND personnes.auth_user_id = auth.uid()));

-- Les admins peuvent gérer tous les badges
CREATE POLICY "Admins can manage badges" ON badges
    FOR ALL USING (get_user_role() = 'admin');
