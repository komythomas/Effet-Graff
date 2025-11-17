'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast'; // Supposons l'existence d'un composant Toast

const ROLES = [
  { value: 'artiste', label: 'Artiste' },
  { value: 'staff', label: 'Staff' },
  { value: 'benevole', label: 'Bénévole' },
  { value: 'partenaire', label: 'Partenaire' },
  { value: 'autre', label: 'Autre' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: '',
    nom: '',
    prenom: '',
    nom_artiste: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, type: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Appel à l'API FastAPI pour mettre à jour le profil
    try {
      const token = 'REMPLACER_PAR_TOKEN_SUPABASE'; // Récupérer le token de session Supabase
      
      const response = await fetch('/api/v1/personnes/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          onboarding_complete: true, // Marquer l'onboarding comme terminé
        }),
      });

      if (!response.ok) {
        throw new Error('Échec de la mise à jour du profil.');
      }

      // 2. Redirection vers le dashboard générique
      router.push('/dashboard');
      router.refresh(); // Force la mise à jour du layout
      
      toast({
        title: 'Profil soumis',
        description: 'Votre profil est en attente de validation par l\'équipe EFFETGRAFF.',
      });

    } catch (error) {
      console.error(error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la soumission.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">Finalisez votre inscription</CardTitle>
          <p className="text-muted-foreground">Veuillez choisir votre rôle et compléter les informations de base pour accéder au tableau de bord.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type">Votre Rôle au Festival *</Label>
              <Select onValueChange={handleSelectChange} required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionnez votre rôle" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map(role => (
                    <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input id="prenom" value={formData.prenom} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input id="nom" value={formData.nom} onChange={handleChange} required />
              </div>
            </div>

            {formData.type === 'artiste' && (
              <div className="space-y-2">
                <Label htmlFor="nom_artiste">Nom d'Artiste (Alias)</Label>
                <Input id="nom_artiste" value={formData.nom_artiste} onChange={handleChange} />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="bio">Biographie / Présentation</Label>
              <Textarea id="bio" value={formData.bio} onChange={handleChange} rows={4} placeholder="Parlez-nous de vous et de votre lien avec Effet Graff..." />
            </div>

            <Button type="submit" className="w-full" disabled={loading || !formData.type}>
              {loading ? 'Soumission en cours...' : 'Soumettre et Accéder au Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
