import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Файл не найден' },
        { status: 400 }
      );
    }

    // Проверка типа файла и выбор папки для сохранения
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Можно загружать только изображения или видео' },
        { status: 400 }
      );
    }

    const uploadDir = isVideo
      ? path.join(process.cwd(), 'public', 'uploads', 'videos')
      : path.join(process.cwd(), 'public', 'uploads', 'projects');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Генерируем уникальное имя файла
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '-');
    const fileName = `${timestamp}-${originalName}`;
    const filePath = path.join(uploadDir, fileName);

    // Сохраняем файл
    await writeFile(filePath, buffer);

    // Возвращаем путь к файлу
    const publicPath = isVideo
      ? `/uploads/videos/${fileName}`
      : `/uploads/projects/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      path: publicPath 
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке файла' },
      { status: 500 }
    );
  }
}
