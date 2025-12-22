import { NextRequest, NextResponse } from 'next/server';
import { getAllVideos, addVideo } from '@/lib/videos';

// GET - получить все видео
export async function GET() {
  try {
    const videos = getAllVideos();
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении видео' },
      { status: 500 }
    );
  }
}

// POST - создать новое видео
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, videoUrl, thumbnailUrl } = body;

    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: 'Заполните обязательные поля (название и видео)' },
        { status: 400 }
      );
    }

    const video = addVideo({
      title,
      description: description || '',
      videoUrl,
      thumbnailUrl: thumbnailUrl || undefined,
    });

    return NextResponse.json({ success: true, video }, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании видео' },
      { status: 500 }
    );
  }
}
