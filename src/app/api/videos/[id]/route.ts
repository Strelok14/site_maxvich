import { NextRequest, NextResponse } from 'next/server';
import { getVideoById, updateVideo, deleteVideo } from '@/lib/videos';

// GET - получить видео по ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = ('params' in context ? context.params : (context as any)) as any;
    const resolvedParams = params instanceof Promise ? await params : params;
    const video = getVideoById(resolvedParams.id);

    if (!video) {
      return NextResponse.json(
        { error: 'Видео не найдено' },
        { status: 404 }
      );
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении видео' },
      { status: 500 }
    );
  }
}

// PATCH - обновить видео
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const body = await request.json();
    const params = ('params' in context ? context.params : (context as any)) as any;
    const resolvedParams = params instanceof Promise ? await params : params;
    const video = updateVideo(resolvedParams.id, body);

    if (!video) {
      return NextResponse.json(
        { error: 'Видео не найдено' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, video });
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении видео' },
      { status: 500 }
    );
  }
}

// DELETE - удалить видео
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = ('params' in context ? context.params : (context as any)) as any;
    const resolvedParams = params instanceof Promise ? await params : params;
    const success = deleteVideo(resolvedParams.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Видео не найдено' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении видео' },
      { status: 500 }
    );
  }
}
