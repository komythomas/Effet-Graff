import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

async function getArtistes() {
  const supabase = createSupabaseServerClient();
  
  // Récupère uniquement les personnes de type 'artiste' dont le profil est 'approuve'
  const { data, error } = await supabase
    .from('personnes')
    .select('id, nom, prenom, nom_artiste, bio, reseaux_sociaux')
    .eq('type', 'artiste')
    .eq('statut_profil', 'approuve')
    .order('nom_artiste', { ascending: true });

  if (error) {
    console.error('Erreur de récupération des artistes:', error);
    return [];
  }
  return data;
}

export default async function ArtistesPage() {
  const artistes = await getArtistes();

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Les Artistes du Festival</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artistes.map((artiste) => (
          <Card key={artiste.id}>
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <CardTitle className="text-xl">{artiste.nom_artiste || `${artiste.prenom} ${artiste.nom}`}</CardTitle>
                <p className="text-sm text-muted-foreground">{artiste.nom_artiste ? `${artiste.prenom} ${artiste.nom}` : 'Artiste'}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-gray-700">{artiste.bio || 'Biographie non disponible.'}</p>
              {/* Ajouter ici les liens vers les réseaux sociaux */}
            </CardContent>
          </Card>
        ))}
      </div>
      {artistes.length === 0 && (
        <p className="text-center text-xl text-muted-foreground mt-10">
          Aucun artiste approuvé trouvé pour le moment.
        </p>
      )}
    </div>
  );
}
