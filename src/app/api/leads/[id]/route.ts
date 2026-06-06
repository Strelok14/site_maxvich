import { NextRequest, NextResponse } from 'next/server';
import { updateLeadStatus, deleteLead } from '@/lib/db';

// PATCH - обновить статус заявки
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Статус обязателен' },
        { status: 400 }
      );
    }

    const params = ('params' in context ? context.params : (context as any)) as any;
    const resolvedParams = params instanceof Promise ? await params : params;
    const lead = updateLeadStatus(resolvedParams.id, status);

    if (!lead) {
      return NextResponse.json(
        { error: 'Заявка не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении заявки' },
      { status: 500 }
    );
  }
}

// DELETE - удалить заявку
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = ('params' in context ? context.params : (context as any)) as any;
    const resolvedParams = params instanceof Promise ? await params : params;
    const success = deleteLead(resolvedParams.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Заявка не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении заявки' },
      { status: 500 }
    );
  }
}
