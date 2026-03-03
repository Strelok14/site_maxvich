import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, addProject, deleteProject } from '@/lib/projects';

// GET - получить все проекты
export async function GET() {
  try {
    const projects = getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении проектов' },
      { status: 500 }
    );
  }
}

// POST - создать новый проект
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, area, duration, price, rooms, imageBefore, imageAfter, images, videos } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Заполните обязательные поля: title' },
        { status: 400 }
      );
    }

    const project = addProject({
      title,
      description: description || '',
      category: category || 'Ремонт квартиры',
      area: area || 0,
      duration: duration || '',
      price: price || undefined,
      rooms: rooms || undefined,
      imageBefore: imageBefore || undefined,
      imageAfter: imageAfter || undefined,
      images: Array.isArray(images) ? images : images ? [images] : undefined,
      videos: Array.isArray(videos) ? videos : videos ? [videos] : undefined,
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании проекта' },
      { status: 500 }
    );
  }
}
