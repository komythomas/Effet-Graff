/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour les images externes (Supabase Storage)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Adapter si nécessaire
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // Pour les placeholders
      },
    ],
  },
};

export default nextConfig;
