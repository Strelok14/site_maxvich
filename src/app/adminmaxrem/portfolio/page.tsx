'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import Image from 'next/image';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  area: number;
  duration: string;
  price?: number;
  imageBefore: string;
  imageAfter: string;
  createdAt: string;
}

export default function PortfolioManagementPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Ремонт квартиры',
    area: 0,
    duration: '',
    price: 0,
    imageBefore: '',
    imageAfter: '',
    video: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token === 'authenticated') {
      setIsAuthenticated(true);
      loadProjects();
    } else {
      router.push('/adminmaxrem');
    }
    setIsLoading(false);
  }, [router]);

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleFileUpload = async (file: File, type: 'before' | 'after' | 'video') => {
    const formData = new FormData();
    formData.append('file', file);

    const setUploading =
      type === 'before' ? setUploadingBefore : type === 'after' ? setUploadingAfter : setUploadingVideo;
    setUploading(true);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (type === 'before' || type === 'after') {
          setFormData(prev => ({
            ...prev,
            [type === 'before' ? 'imageBefore' : 'imageAfter']: data.path,
          }));
        } else {
          setFormData(prev => ({ ...prev, video: data.path }));
        }
      } else {
        alert('Ошибка при загрузке файла');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Ошибка при загрузке файла');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : '/api/projects';
      
      const method = editingProject ? 'PATCH' : 'POST';

      const payload: any = { ...formData };
      if (formData.video) payload.videos = [formData.video];

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingProject(null);
        resetForm();
        loadProjects();
      } else {
        alert('Ошибка при сохранении проекта');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Ошибка при сохранении проекта');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      area: project.area,
      duration: project.duration,
      price: project.price || 0,
      imageBefore: project.imageBefore,
      imageAfter: project.imageAfter,
      video: project.videos && project.videos.length > 0 ? project.videos[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить проект?')) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Ремонт квартиры',
      area: 0,
      duration: '',
      price: 0,
      imageBefore: '',
      imageAfter: '',
    });
  };

  const openCreateModal = () => {
    resetForm();
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/adminmaxrem');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <Container>
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Портфолио</h1>
              <p className="text-sm text-gray-600 mt-1">Управление проектами и фотографиями</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => router.push('/adminmaxrem/dashboard')} variant="outline">
                Назад
              </Button>
              <Button onClick={handleLogout} variant="outline">
                Выйти
              </Button>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-10">
        <Container>
          <div className="mb-6">
            <Button onClick={openCreateModal}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Добавить проект
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <div className="grid grid-cols-2 gap-2 p-2">
                  <div className="relative h-40">
                    <Image
                      src={project.imageBefore}
                      alt="До"
                      fill
                      className="object-cover rounded"
                    />
                    <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      До
                    </span>
                  </div>
                  <div className="relative h-40">
                    <Image
                      src={project.imageAfter}
                      alt="После"
                      fill
                      className="object-cover rounded"
                    />
                    <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      После
                    </span>
                  </div>
                </div>
                {project.videos && project.videos.length > 0 && (
                  <div className="p-2">
                    <video controls className="w-full h-40 object-cover rounded">
                      <source src={project.videos[0]} />
                      Ваш браузер не поддерживает видео.
                    </video>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Категория: {project.category}</p>
                    {project.area > 0 && <p>Площадь: {project.area} м²</p>}
                    {project.duration && <p>Срок: {project.duration}</p>}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => handleEdit(project)} variant="outline" className="flex-1">
                      Редактировать
                    </Button>
                    <Button
                      onClick={() => handleDelete(project.id)}
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {projects.length === 0 && (
            <Card className="p-12">
              <p className="text-center text-gray-500">Проектов пока нет</p>
            </Card>
          )}
        </Container>
      </main>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingProject ? 'Редактировать проект' : 'Новый проект'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название проекта *
                  </label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Например: Ремонт 2-комнатной квартиры"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание
                  </label>
                  <Textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Краткое описание проекта"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Категория
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Ремонт квартиры</option>
                      <option>Ремонт дома</option>
                      <option>Ремонт офиса</option>
                      <option>Косметический ремонт</option>
                      <option>Капитальный ремонт</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Площадь (м²)
                    </label>
                    <Input
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Срок выполнения
                    </label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="Например: 2 месяца"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Стоимость (₽)
                    </label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Фото &quot;До&quot; *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'before');
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploadingBefore && <p className="text-sm text-gray-500 mt-2">Загрузка...</p>}
                    {formData.imageBefore && (
                      <div className="relative h-32 mt-2">
                        <Image
                          src={formData.imageBefore}
                          alt="До"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Фото &quot;После&quot; *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'after');
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploadingAfter && <p className="text-sm text-gray-500 mt-2">Загрузка...</p>}
                    {formData.imageAfter && (
                      <div className="relative h-32 mt-2">
                        <Image
                          src={formData.imageAfter}
                          alt="После"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Видео (опционально)
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'video');
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {uploadingVideo && <p className="text-sm text-gray-500 mt-2">Загрузка...</p>}
                  {formData.video && (
                    <div className="mt-2">
                      <video controls className="w-full h-40 object-cover rounded">
                        <source src={formData.video} />
                        Ваш браузер не поддерживает видео.
                      </video>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingProject(null);
                      resetForm();
                    }}
                    variant="outline"
                  >
                    Отмена
                  </Button>
                  <Button type="submit" disabled={isSaving || uploadingBefore || uploadingAfter}>
                    {isSaving ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
