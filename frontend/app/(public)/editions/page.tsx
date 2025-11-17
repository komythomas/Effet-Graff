import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

async function getEditions() {
  const supabase = createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('editions')
    .select('*')
    .order('annee', { ascending: false });

  if (error) {
    console.error('Erreur de récupération des éditions:', error);
    return [];
  }
  return data;
}

export default async function EditionsPage() {
  const editions = await getEditions();

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Toutes les Éditions du Festival</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {editions.map((edition) => (
          <Link href={`/editions/${edition.annee}`} key={edition.id}>
            <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-3xl font-extrabold text-primary">
                  Édition {edition.annee}
                </CardTitle>
                <p className="text-lg text-muted-foreground">{edition.theme || 'Thème non spécifié'}</p>
              </CardHeader>
              <CardContent>
                <p className="mb-4 line-clamp-3">{edition.description || 'Description à venir.'}</p>
                <div className="text-sm text-gray-600">
                  Du {new Date(edition.date_debut).toLocaleDateString('fr-FR')} au {new Date(edition.date_fin).toLocaleDateString('fr-FR')}
                </div>
                <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${edition.statut === 'terminee' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {edition.statut.charAt(0).toUpperCase() + edition.statut.slice(1).replace('_', ' ')}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {editions.length === 0 && (
        <p className="text-center text-xl text-muted-foreground mt-10">
          Aucune édition trouvée pour le moment.
        </p>
      )}
    </div>
  );
}
