import { NextRequest, NextResponse } from 'next/server';
import { getServiceById, updateService, deleteService } from '@/lib/services';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = ('params' in context ? context.params : (context as any)) as any;
    const resolvedParams = params instanceof Promise ? await params : params;
    const item = getServiceById(resolvedParams.id);
    if (!item) return NextResponse.json({ error: 'Не найдено' }, { status: 404 });
    return NextResponse.json(item);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const body = await request.json();
    const params = ('params' in context ? context.params : (context as any)) as any;
    const resolvedParams = params instanceof Promise ? await params : params;
    const item = updateService(resolvedParams.id, body);
    if (!item) return NextResponse.json({ error: 'Не найдено' }, { status: 404 });
    return NextResponse.json({ success: true, item });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = ('params' in context ? context.params : (context as any)) as any;
    const resolvedParams = params instanceof Promise ? await params : params;
    const ok = deleteService(resolvedParams.id);
    if (!ok) return NextResponse.json({ error: 'Не найдено' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}
