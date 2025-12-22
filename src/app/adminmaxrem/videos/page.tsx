'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface Video {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export default function VideoManagementPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token === 'authenticated') {
      setIsAuthenticated(true);
      loadVideos();
    } else {
      router.push('/adminmaxrem');
    }
    setIsLoading(false);
  }, [router]);

  const loadVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  const handleFileUpload = async (file: File, type: 'video' | 'thumbnail') => {
    const formData = new FormData();
    formData.append('file', file);

    const setUploading = type === 'video' ? setUploadingVideo : setUploadingThumbnail;
    setUploading(true);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          [type === 'video' ? 'videoUrl' : 'thumbnailUrl']: data.path,
        }));
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
      const url = editingVideo
        ? `/api/videos/${editingVideo.id}`
        : '/api/videos';
      
      const method = editingVideo ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingVideo(null);
        resetForm();
        loadVideos();
      } else {
        alert('Ошибка при сохранении видео');
      }
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Ошибка при сохранении видео');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить видео?')) return;

    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadVideos();
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
    });
  };

  const openCreateModal = () => {
    resetForm();
    setEditingVideo(null);
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
              <h1 className="text-3xl font-bold text-gray-900">Управление видео</h1>
              <p className="text-sm text-gray-600 mt-1">Добавляйте и управляйте видео для главной страницы</p>
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
              Добавить видео
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="p-2">
                  <video controls className="w-full h-48 object-cover rounded bg-black">
                    <source src={video.videoUrl} />
                    Ваш браузер не поддерживает видео.
                  </video>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                  {video.description && (
                    <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => handleEdit(video)} variant="outline" className="flex-1">
                      Редактировать
                    </Button>
                    <Button
                      onClick={() => handleDelete(video.id)}
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

          {videos.length === 0 && (
            <Card className="p-12">
              <p className="text-center text-gray-500">Видео пока нет. Нажмите &quot;Добавить видео&quot; чтобы загрузить первое видео.</p>
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
                {editingVideo ? 'Редактировать видео' : 'Новое видео'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название видео *
                  </label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Например: Ремонт кухни - процесс работы"
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
                    placeholder="Краткое описание видео"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Видео файл *
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
                  {uploadingVideo && <p className="text-sm text-gray-500 mt-2">Загрузка видео...</p>}
                  {formData.videoUrl && (
                    <div className="mt-2">
                      <video controls className="w-full h-48 object-cover rounded bg-black">
                        <source src={formData.videoUrl} />
                        Ваш браузер не поддерживает видео.
                      </video>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Превью (миниатюра) - опционально
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'thumbnail');
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {uploadingThumbnail && <p className="text-sm text-gray-500 mt-2">Загрузка...</p>}
                  {formData.thumbnailUrl && (
                    <div className="mt-2 relative h-32">
                      <img
                        src={formData.thumbnailUrl}
                        alt="Превью"
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingVideo(null);
                      resetForm();
                    }}
                    variant="outline"
                  >
                    Отмена
                  </Button>
                  <Button type="submit" disabled={isSaving || uploadingVideo || uploadingThumbnail}>
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
