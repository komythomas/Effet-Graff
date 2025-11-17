import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { User, Palette, Users, Settings } from 'lucide-react';

// Composant pour afficher les informations de base de l'utilisateur
function UserInfoCard({ profile }: { profile: any }) {
  const roleMap: { [key: string]: string } = {
    artiste: 'Artiste',
    staff: 'Membre du Staff',
    benevole: 'Bénévole',
    partenaire: 'Partenaire',
    autre: 'Autre',
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-6 h-6" />
          <span>Bienvenue, {profile.nom_artiste || profile.prenom || 'Membre'} !</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p><strong>Rôle déclaré :</strong> {roleMap[profile.type]}</p>
        <p><strong>Statut du profil :</strong> 
          <span className={`font-semibold ml-2 ${profile.statut_profil === 'approuve' ? 'text-green-600' : 'text-yellow-600'}`}>
            {profile.statut_profil === 'approuve' ? 'Approuvé' : 'En attente de validation'}
          </span>
        </p>
        {profile.statut_profil === 'approuve' && (
          <p className="text-sm text-primary">Félicitations ! Vous avez accès à toutes les fonctionnalités de votre rôle.</p>
        )}
      </CardContent>
    </Card>
  );
}

// Composant pour le menu de navigation spécifique au rôle
function RoleSpecificMenu({ profile }: { profile: any }) {
  const baseLinks = [
    { href: '/dashboard/profile', icon: User, title: 'Mon Profil', description: 'Gérer mes informations personnelles.' },
  ];

  let roleLinks: { href: string, icon: any, title: string, description: string }[] = [];

  if (profile.statut_profil === 'approuve') {
    if (profile.type === 'artiste') {
      roleLinks.push({ href: '/dashboard/artiste/fresques', icon: Palette, title: 'Mes Fresques', description: 'Ajouter ou modifier mes œuvres.' });
    } else if (profile.type === 'staff' || profile.type === 'benevole') {
      roleLinks.push({ href: '/dashboard/benevole/missions', icon: Users, title: 'Mes Missions', description: 'Consulter mon planning et mes tâches.' });
    }
  }

  if (profile.type === 'admin') {
    roleLinks.push({ href: '/dashboard/admin/validation', icon: Settings, title: 'Administration', description: 'Valider les profils et gérer le contenu.' });
  }

  const allLinks = [...baseLinks, ...roleLinks];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {allLinks.map((link) => (
        <Link href={link.href} key={link.href}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <link.icon className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-xl">{link.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{link.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Le middleware devrait déjà gérer ça, mais c'est une sécurité
    redirect('/login');
  }

  // Récupération du profil utilisateur
  const { data: profile, error } = await supabase
    .from('personnes')
    .select('*')
    .eq('auth_user_id', user.id)
    .single();

  if (error || !profile) {
    // Si le profil n'existe pas (cas très rare après l'inscription)
    // On pourrait rediriger vers une page de création de profil initial
    return <div>Erreur de chargement du profil.</div>;
  }

  // Logique de redirection pour l'onboarding forcé
  if (!profile.onboarding_complete) {
    redirect('/dashboard/onboarding');
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Tableau de Bord</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <UserInfoCard profile={profile} />
      </div>

      <section className="pt-4">
        <h2 className="text-2xl font-semibold mb-4">Accès Rapide</h2>
        <RoleSpecificMenu profile={profile} />
      </section>
    </div>
  );
}
