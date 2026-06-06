import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ type: string; filename: string }> | { type: string; filename: string } }
) {
  try {
    const params = ('params' in context ? context.params : (context as any)) as any;
    const resolvedParams = params instanceof Promise ? await params : params;
    const { type, filename } = resolvedParams as { type: string; filename: string };

    // Валидация типа (только videos, projects или services)
    if (!['videos', 'projects', 'services'].includes(type)) {
      return NextResponse.json(
        { error: 'Неверный тип файла' },
        { status: 400 }
      );
    }

    const filePath = path.join(
      process.cwd(),
      'data',
      'uploads',
      type,
      filename
    );

    // Проверка безопасности - убедиться, что путь внутри data/uploads
    const uploadDir = path.join(process.cwd(), 'data', 'uploads');
    if (!path.resolve(filePath).startsWith(path.resolve(uploadDir))) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Файл не найден' },
        { status: 404 }
      );
    }

    const file = await readFile(filePath);

    // Определяем тип контента
    let contentType = 'application/octet-stream';
    if (type === 'videos') {
      const ext = path.extname(filename).toLowerCase();
      if (ext === '.mp4') contentType = 'video/mp4';
      else if (ext === '.webm') contentType = 'video/webm';
      else if (ext === '.mov') contentType = 'video/quicktime';
    } else {
      const ext = path.extname(filename).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.webp') contentType = 'image/webp';
    }

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении файла' },
      { status: 500 }
    );
  }
}
