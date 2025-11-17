import { FresqueCard } from '@/components/fresques/FresqueCard';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

// Définition du type de données pour la fresque (simplifié pour le frontend)
interface Fresque {
  id: string;
  titre: string;
  annee_creation: number;
  // Ajoutez d'autres champs nécessaires
}

// Fonction pour récupérer les données des fresques (via Supabase directement pour les données publiques)
async function getFresques() {
  const supabase = createSupabaseServerClient();
  // On joint la table media pour avoir l'image principale
  const { data, error } = await supabase
    .from('fresques')
    .select(`
      id,
      titre,
      annee_creation,
      media (url_fichier),
      fresque_personne (personne (nom_artiste))
    `)
    .order('annee_creation', { ascending: false });

  if (error) {
    console.error('Erreur de récupération des fresques:', error);
    return [];
  }

  // Transformation des données pour le composant Card
  return data.map((fresque: any) => ({
    id: fresque.id,
    titre: fresque.titre,
    annee: fresque.annee_creation,
    imageUrl: fresque.media.length > 0 ? fresque.media[0].url_fichier : 'https://via.placeholder.com/600x400?text=Image+Manquante',
    artiste: fresque.fresque_personne.map((fp: any) => fp.personne.nom_artiste).join(', ') || 'Collectif',
  }));
}

export default async function FresquesPage() {
  const fresques = await getFresques();

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Galerie des Fresques</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fresques.map((fresque) => (
          <FresqueCard 
            key={fresque.id} 
            id={fresque.id}
            titre={fresque.titre} 
            artiste={fresque.artiste} 
            annee={fresque.annee} 
            imageUrl={fresque.imageUrl} 
          />
        ))}
      </div>
      {fresques.length === 0 && (
        <p className="text-center text-xl text-muted-foreground mt-10">
          Aucune fresque trouvée pour le moment.
        </p>
      )}
    </div>
  );
}
