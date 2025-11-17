import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EFFETGRAFF - Festival International d\'Art Urbain',
  description: 'Plateforme officielle du festival EFFETGRAFF, Bénin.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialisation du client Supabase côté serveur pour vérifier la session
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // Récupération des données utilisateur pour le header (si connecté)
  let userProfile = null;
  if (session) {
    // Note: La RLS permet de ne récupérer que le profil de l'utilisateur connecté
    const { data } = await supabase.from('personnes').select('*').eq('auth_user_id', session.user.id).single();
    userProfile = data;
  }

  return (
    <html lang="fr">
      <body className={cn(inter.className, 'min-h-screen antialiased')}>
        <Header session={session} userProfile={userProfile} />
        <main className="flex-1 container mx-auto py-8">
          {children}
        </main>
        {/* Footer ici */}
      </body>
    </html>
  );
}
