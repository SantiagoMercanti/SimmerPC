import { NextRequest, NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseAdmin';

// GET /api/admin/users
export async function GET() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 100 });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const users = data.users.map((u) => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
  }));

  return NextResponse.json(users);
}

export async function DELETE(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'Falta userId' }, { status: 400 });
  }

  // 1. Eliminar de UserMetadata
  const { error: metaError } = await supabaseAdmin
    .from('UserMetadata')
    .delete()
    .eq('id', userId);

  if (metaError) {
    return NextResponse.json({ error: 'Error al eliminar metadata: ' + metaError.message }, { status: 500 });
  }

  // 2. Eliminar de Auth
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (authError) {
    return NextResponse.json({ error: 'Metadata eliminada, pero error en auth: ' + authError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Usuario eliminado correctamente' });
}
