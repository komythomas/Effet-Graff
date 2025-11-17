import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }, { req, res });

  const { data: { session } } = await supabase.auth.getSession();

  const protectedRoutes = ['/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  // Redirection vers la page de connexion si non authentifié et route protégée
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirection vers l'onboarding si l'utilisateur est connecté mais n'a pas complété l'onboarding
  // Cette logique sera affinée dans le dashboard générique
  
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
