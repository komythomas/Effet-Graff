import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Palette } from 'lucide-react';

async function getMyFresques() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  // Récupère les fresques de l'artiste connecté
  const { data, error } = await supabase
    .from('fresque_personne')
    .select(`
      fresque (id, titre, annee_creation)
    `)
    .eq('personne.auth_user_id', user.id); // Cette jointure nécessite une vue ou une fonction RLS complexe

  if (error) {
    console.error('Erreur de récupération des fresques de l\'artiste:', error);
    return [];
  }
  return data.map(item => item.fresque);
}

export default async function ArtisteFresquesPage() {
  const mesFresques = await getMyFresques();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Mon Espace Artiste</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Ajouter une Fresque
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center space-x-2">
            <Palette className="w-6 h-6" />
            <span>Mes Œuvres ({mesFresques.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mesFresques.length > 0 ? (
            <ul className="space-y-2">
              {mesFresques.map((fresque) => (
                <li key={fresque.id} className="border-b pb-2 flex justify-between items-center">
                  <span className="font-medium">{fresque.titre}</span>
                  <span className="text-sm text-muted-foreground">Édition {fresque.annee_creation}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-lg text-muted-foreground py-8">
              Vous n'avez pas encore de fresque enregistrée.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
