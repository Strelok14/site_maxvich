import { NextRequest, NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/projects';

// GET - получить проект по ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = ('params' in context ? context.params : (context as any)) as any;
    const resolvedParams = params instanceof Promise ? await params : params;
    const project = getProjectById(resolvedParams.id);

    if (!project) {
      return NextResponse.json(
        { error: 'Проект не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении проекта' },
      { status: 500 }
    );
  }
}

// PATCH - обновить проект
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const body = await request.json();
    const params = ('params' in context ? context.params : (context as any)) as any;
    const resolvedParams = params instanceof Promise ? await params : params;
    const project = updateProject(resolvedParams.id, body);

    if (!project) {
      return NextResponse.json(
        { error: 'Проект не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении проекта' },
      { status: 500 }
    );
  }
}

// DELETE - удалить проект
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = ('params' in context ? context.params : (context as any)) as any;
    const resolvedParams = params instanceof Promise ? await params : params;
    const success = deleteProject(resolvedParams.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Проект не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении проекта' },
      { status: 500 }
    );
  }
}
