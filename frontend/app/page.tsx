import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-extrabold tracking-tight text-primary mb-4">
        EFFETGRAFF
      </h1>
      <h2 className="text-3xl font-light text-gray-600 mb-8">
        Le Festival International d'Art Urbain du Bénin
      </h2>
      <p className="max-w-3xl mx-auto text-lg text-gray-700 mb-10">
        Découvrez l'histoire, les artistes et les fresques monumentales qui transforment les murs de Cotonou et d'autres villes du Bénin en galeries à ciel ouvert.
      </p>
      <div className="space-x-4">
        <Link href="/fresques">
          <Button size="lg">Explorer la Galerie</Button>
        </Link>
        <Link href="/editions">
          <Button size="lg" variant="outline">Voir les Éditions</Button>
        </Link>
      </div>

      {/* Section de mise en avant (Exemple) */}
      <section className="mt-20 grid md:grid-cols-3 gap-8">
        <div className="p-6 border rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">La plus longue fresque d'Afrique</h3>
          <p className="text-gray-600">Découvrez le "Mur du Patrimoine" à Cotonou, une œuvre collective de près d'un kilomètre racontant l'histoire du Bénin.</p>
        </div>
        <div className="p-6 border rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Artistes Internationaux</h3>
          <p className="text-gray-600">Parcourez les profils des 40+ artistes locaux et internationaux qui ont participé aux différentes éditions.</p>
        </div>
        <div className="p-6 border rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Devenez Membre</h3>
          <p className="text-gray-600">Artiste, bénévole ou staff ? Rejoignez la communauté et obtenez votre badge numérique.</p>
          <Link href="/login" className="text-sm text-primary mt-2 block">Se connecter / S'inscrire</Link>
        </div>
      </section>
    </div>
  );
}
