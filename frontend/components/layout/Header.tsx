'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  session: any; // Type Supabase Session
  userProfile: any; // Type Personne
}

export default function Header({ session, userProfile }: HeaderProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center py-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          EFFETGRAFF
        </Link>

        <nav className="flex space-x-4 items-center">
          <Link href="/fresques" className="text-sm hover:text-primary transition-colors">
            Fresques
          </Link>
          <Link href="/editions" className="text-sm hover:text-primary transition-colors">
            Éditions
          </Link>
          <Link href="/artistes" className="text-sm hover:text-primary transition-colors">
            Artistes
          </Link>
          
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{userProfile?.nom_artiste || userProfile?.prenom || 'Dashboard'}</span>
                </Button>
              </Link>
              <Button variant="destructive" size="sm" onClick={handleSignOut} className="flex items-center space-x-1">
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Connexion</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
