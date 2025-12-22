'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface Service {
  id: string;
  title: string;
  description?: string;
  price?: string;
  imageUrl?: string;
  category?: string;
}

export default function ServicesAdmin() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Service[]>([]);
  const [isModal, setIsModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ title: '', description: '', price: '', imageUrl: '', category: 'all' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token === 'authenticated') {
      setIsAuth(true);
      load();
    } else {
      router.push('/adminmaxrem');
    }
    setLoading(false);
  }, [router]);

  const load = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) setItems(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleUpload = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    setUploading(true);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        setForm(prev => ({ ...prev, imageUrl: data.path }));
      } else alert('Ошибка загрузки');
    } catch (e) { console.error(e); alert('Ошибка загрузки'); }
    setUploading(false);
  };

  const openCreate = () => { setForm({ title: '', description: '', price: '', imageUrl: '' }); setEditing(null); setIsModal(true); };

  const submit = async (e: any) => {
    e.preventDefault();
    try {
      const url = editing ? `/api/services/${editing.id}` : '/api/services';
      const method = editing ? 'PATCH' : 'POST';
      const body = { ...form };
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { setIsModal(false); load(); }
      else alert('Ошибка сохранения');
    } catch (e) { console.error(e); alert('Ошибка'); }
  };

  const edit = (it: Service) => { setEditing(it); setForm({ title: it.title, description: it.description || '', price: it.price || '', imageUrl: it.imageUrl || '', category: it.category || 'all' }); setIsModal(true); };

  const remove = async (id: string) => {
    if (!confirm('Удалить услугу?')) return;
    try { const res = await fetch(`/api/services/${id}`, { method: 'DELETE' }); if (res.ok) load(); } catch (e) { console.error(e); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <Container>
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold">Управление услугами</h1>
              <p className="text-sm text-gray-500">Добавляйте, редактируйте и удаляйте карточки услуг</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push('/adminmaxrem/dashboard')}>Назад</Button>
              <Button variant="outline" onClick={() => { localStorage.removeItem('adminToken'); router.push('/adminmaxrem'); }}>Выйти</Button>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-10">
        <Container>
          <div className="mb-6"><Button onClick={openCreate}>Добавить услугу</Button></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(it => (
              <Card key={it.id} className="overflow-hidden">
                {it.imageUrl && <img src={it.imageUrl} alt={it.title} className="w-full h-48 object-cover" />}
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{it.title}</h3>
                  <p className="text-sm text-gray-600">{it.description}</p>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => edit(it)} variant="outline" className="flex-1">Редактировать</Button>
                    <Button onClick={() => remove(it.id)} variant="outline" className="text-red-600">Удалить</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </main>

      {isModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">{editing ? 'Редактировать услугу' : 'Новая услуга'}</h2>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Название *</label>
                <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">Описание</label>
                <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">Цена</label>
                <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">Категория</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Все услуги</option>
                  <option value="complex">Комплексный ремонт</option>
                  <option value="rooms">Ремонт помещений</option>
                  <option value="works">Отдельные работы</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Фото (опционально)</label>
                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
                {uploading && <p className="text-sm text-gray-500">Загрузка...</p>}
                {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-2 w-48 h-32 object-cover" />}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModal(false)}>Отмена</Button>
                <Button type="submit">{editing ? 'Сохранить' : 'Создать'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
