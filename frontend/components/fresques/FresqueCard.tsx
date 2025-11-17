import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

interface FresqueProps {
  id: string;
  titre: string;
  artiste: string;
  annee: number;
  imageUrl: string;
}

export function FresqueCard({ id, titre, artiste, annee, imageUrl }: FresqueProps) {
  return (
    <Link href={`/fresques/${id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        <div className="relative h-64 w-full">
          <Image 
            src={imageUrl} 
            alt={`Photo de l'œuvre ${titre}`} 
            fill 
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </div>
        <CardHeader>
          <CardTitle className="text-xl truncate">{titre}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Par {artiste} ({annee})
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
