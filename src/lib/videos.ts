import fs from 'fs';
import path from 'path';

const VIDEOS_PATH = path.join(process.cwd(), 'data', 'videos.json');

export interface Video {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Инициализация базы данных
function initDB() {
  const dir = path.dirname(VIDEOS_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(VIDEOS_PATH)) {
    fs.writeFileSync(VIDEOS_PATH, JSON.stringify([], null, 2));
  }
}

// Получить все видео
export function getAllVideos(): Video[] {
  initDB();
  const data = fs.readFileSync(VIDEOS_PATH, 'utf-8');
  return JSON.parse(data);
}

// Получить видео по ID
export function getVideoById(id: string): Video | null {
  const videos = getAllVideos();
  return videos.find(v => v.id === id) || null;
}

// Добавить новое видео
export function addVideo(video: Omit<Video, 'id' | 'createdAt' | 'updatedAt'>): Video {
  initDB();
  const videos = getAllVideos();
  
  const newVideo: Video = {
    ...video,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  videos.unshift(newVideo);
  fs.writeFileSync(VIDEOS_PATH, JSON.stringify(videos, null, 2));
  
  return newVideo;
}

// Обновить видео
export function updateVideo(id: string, updates: Partial<Omit<Video, 'id' | 'createdAt'>>): Video | null {
  initDB();
  const videos = getAllVideos();
  const index = videos.findIndex(v => v.id === id);
  
  if (index === -1) return null;
  
  videos[index] = {
    ...videos[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  fs.writeFileSync(VIDEOS_PATH, JSON.stringify(videos, null, 2));
  
  return videos[index];
}

// Удалить видео
export function deleteVideo(id: string): boolean {
  initDB();
  const videos = getAllVideos();
  const filtered = videos.filter(v => v.id !== id);
  
  if (filtered.length === videos.length) return false;
  
  fs.writeFileSync(VIDEOS_PATH, JSON.stringify(filtered, null, 2));
  return true;
}
