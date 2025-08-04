import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirige a /login si no hay sesión y está accediendo a una ruta protegida
  const protectedRoutes = ['/dashboard', '/proyectos', '/sensores', '/actuadores'];

  if (!session && protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/proyectos/:path*', '/sensores/:path*', '/actuadores/:path*'],
};
