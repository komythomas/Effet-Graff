import { createSupabaseServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getFresqueDetail(id: string) {
  const supabase = createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('fresques')
    .select(`
      *,
      media (url_fichier, credits),
      fresque_personne (personne (id, nom, prenom, nom_artiste, bio))
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export default async function FresqueDetailPage({ params }: { params: { id: string } }) {
  const fresque = await getFresqueDetail(params.id);

  if (!fresque) {
    notFound();
  }

  const artistes = fresque.fresque_personne.map((fp: any) => fp.personne);
  const imageUrl = fresque.media.length > 0 ? fresque.media[0].url_fichier : 'https://via.placeholder.com/1200x800?text=Image+Manquante';
  const imageCredits = fresque.media.length > 0 ? fresque.media[0].credits : 'Inconnu';

  return (
    <div className="py-8">
      <h1 className="text-5xl font-extrabold mb-2 text-primary">{fresque.titre}</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Créée en {fresque.annee_creation}
      </p>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden shadow-xl mb-4">
            <Image 
              src={imageUrl} 
              alt={`Photo de l'œuvre ${fresque.titre}`} 
              fill 
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          <p className="text-sm text-gray-500 text-right">Crédits photo : {imageCredits}</p>

          <section className="mt-8">
            <h2 className="text-3xl font-bold mb-4">Description</h2>
            <p className="text-lg text-gray-700 whitespace-pre-line">{fresque.description}</p>
          </section>
        </div>

        <aside className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Détails Techniques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Technique :</strong> {fresque.technique || 'Non spécifiée'}</p>
              <p><strong>Dimensions :</strong> {fresque.dimensions || 'Non spécifiées'}</p>
              <p><strong>Statut :</strong> {fresque.statut}</p>
              <p><strong>Symbolisme :</strong> {fresque.symbolisme || 'Non spécifié'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Artistes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {artistes.map((artiste: any) => (
                <div key={artiste.id} className="border-b pb-2 last:border-b-0">
                  <h4 className="font-semibold">{artiste.nom_artiste || `${artiste.prenom} ${artiste.nom}`}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{artiste.bio}</p>
                  {/* Lien vers la page artiste si elle existe */}
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
