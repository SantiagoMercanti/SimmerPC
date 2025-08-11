import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  // Rutas públicas sin sesión
  const publicRoutes = ['/login', '/register'];

  // 1️⃣ Bloqueo global antes de login
  if (!user && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 2️⃣ Si hay sesión y está en /login o /register → redirigir al dashboard
  if (user && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 3️⃣ Bloqueo de /admin si no es tipo 'admin'
  if (user && pathname.startsWith('/admin')) {
    const { data: metadata, error } = await supabase
      .from('UserMetadata')
      .select('tipo')
      .eq('id', user.id)
      .single();

    if (error || !metadata || metadata.tipo !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return res;
}

// Aplica a todas las rutas menos archivos estáticos
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
