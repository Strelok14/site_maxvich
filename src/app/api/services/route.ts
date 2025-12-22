import { NextRequest, NextResponse } from 'next/server';
import { getAllServices, addService } from '@/lib/services';

export async function GET() {
  try {
    const items = getAllServices();
    return NextResponse.json(items);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Ошибка при получении услуг' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, price, imageUrl, category } = body;
    if (!title) return NextResponse.json({ error: 'Название обязательно' }, { status: 400 });
    const item = addService({ title, description: description || '', price: price || '', imageUrl: imageUrl || '', category: category || 'all' });
    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Ошибка при создании услуги' }, { status: 500 });
  }
}
