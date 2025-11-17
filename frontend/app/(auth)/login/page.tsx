'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Twitter, Discord, Mail } from 'lucide-react';

export default function LoginPage() {
  const supabase = createClientComponentClient();

  const handleSignIn = async (provider: 'google' | 'discord' | 'github' | 'twitter') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-primary">Connexion Membre EFFETGRAFF</CardTitle>
          <p className="text-sm text-muted-foreground">Utilisez vos comptes sociaux pour vous connecter.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center space-x-2"
            onClick={() => handleSignIn('google')}
          >
            <Mail className="w-5 h-5" />
            <span>Continuer avec Google</span>
          </Button>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center space-x-2"
            onClick={() => handleSignIn('github')}
          >
            <Github className="w-5 h-5" />
            <span>Continuer avec GitHub</span>
          </Button>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center space-x-2"
            onClick={() => handleSignIn('discord')}
          >
            <Discord className="w-5 h-5" />
            <span>Continuer avec Discord</span>
          </Button>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center space-x-2"
            onClick={() => handleSignIn('twitter')}
          >
            <Twitter className="w-5 h-5" />
            <span>Continuer avec X (Twitter)</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
