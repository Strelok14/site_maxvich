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
    const { title, description, category, area, duration, price, imageBefore, imageAfter, videos } = body;

    if (!title || !imageBefore || !imageAfter) {
      return NextResponse.json(
        { error: 'Заполните обязательные поля' },
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
      imageBefore,
      imageAfter,
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
