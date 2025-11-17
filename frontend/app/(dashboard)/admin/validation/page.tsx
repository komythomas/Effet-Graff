import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, User } from 'lucide-react';

// Composant pour afficher un profil en attente
function PendingProfileCard({ profile }: { profile: any }) {
  const handleAction = async (action: 'approve' | 'reject') => {
    // Logique d'appel à l'API FastAPI pour valider/rejeter le profil
    // Ex: POST /api/v1/personnes/{profile.id}/approve
    console.log(`Action ${action} pour le profil ${profile.id}`);
    // Après l'appel, rafraîchir la page
  };

  return (
    <Card className="flex justify-between items-center p-4">
      <div className="flex items-center space-x-4">
        <User className="w-8 h-8 text-gray-500" />
        <div>
          <p className="font-semibold">{profile.nom_artiste || `${profile.prenom} ${profile.nom}`}</p>
          <p className="text-sm text-muted-foreground">{profile.type.toUpperCase()} - {profile.email}</p>
          <p className="text-xs mt-1 italic line-clamp-1">{profile.bio || 'Pas de bio fournie.'}</p>
        </div>
      </div>
      <div className="space-x-2">
        <Button size="sm" onClick={() => handleAction('approve')}>
          <Check className="w-4 h-4 mr-1" /> Approuver
        </Button>
        <Button size="sm" variant="destructive" onClick={() => handleAction('reject')}>
          <X className="w-4 h-4 mr-1" /> Rejeter
        </Button>
      </div>
    </Card>
  );
}

async function getPendingProfiles() {
  // Cette fonction devrait idéalement appeler l'API FastAPI, mais pour l'exemple SSR, on utilise Supabase
  const supabase = createSupabaseServerClient();
  
  // Vérification du rôle admin (via RLS ou custom claims)
  // Pour l'exemple, on suppose que l'utilisateur a déjà été vérifié comme admin par le middleware ou le dashboard générique
  
  const { data, error } = await supabase
    .from('personnes')
    .select('*')
    .eq('statut_profil', 'en_attente')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Erreur de récupération des profils en attente:', error);
    return [];
  }
  return data;
}

export default async function AdminValidationPage() {
  const pendingProfiles = await getPendingProfiles();

  // Logique de vérification du rôle admin (à affiner avec les custom claims)
  // Pour l'instant, on se base sur la redirection du dashboard générique
  
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary">Tableau de Bord Administrateur</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Profils en Attente de Validation ({pendingProfiles.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingProfiles.length > 0 ? (
            pendingProfiles.map((profile) => (
              <PendingProfileCard key={profile.id} profile={profile} />
            ))
          ) : (
            <p className="text-center text-lg text-muted-foreground py-8">
              Aucun nouveau profil en attente. Tout est à jour !
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
