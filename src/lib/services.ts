import fs from 'fs';
import path from 'path';

const SERVICES_PATH = path.join(process.cwd(), 'data', 'services.json');

export interface ServiceItem {
  id: string;
  title: string;
  description?: string;
  price?: string;
  imageUrl?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

function initDB() {
  const dir = path.dirname(SERVICES_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(SERVICES_PATH)) fs.writeFileSync(SERVICES_PATH, JSON.stringify([], null, 2));
}

export function getAllServices(): ServiceItem[] {
  initDB();
  const data = fs.readFileSync(SERVICES_PATH, 'utf-8');
  return JSON.parse(data);
}

export function getServiceById(id: string): ServiceItem | null {
  const items = getAllServices();
  return items.find(i => i.id === id) || null;
}

export function addService(item: Omit<ServiceItem, 'id' | 'createdAt' | 'updatedAt'>): ServiceItem {
  initDB();
  const items = getAllServices();
  const newItem: ServiceItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  items.unshift(newItem);
  fs.writeFileSync(SERVICES_PATH, JSON.stringify(items, null, 2));
  return newItem;
}

export function updateService(id: string, updates: Partial<Omit<ServiceItem, 'id' | 'createdAt'>>): ServiceItem | null {
  initDB();
  const items = getAllServices();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...updates, updatedAt: new Date().toISOString() };
  fs.writeFileSync(SERVICES_PATH, JSON.stringify(items, null, 2));
  return items[idx];
}

export function deleteService(id: string): boolean {
  initDB();
  const items = getAllServices();
  const filtered = items.filter(i => i.id !== id);
  if (filtered.length === items.length) return false;
  fs.writeFileSync(SERVICES_PATH, JSON.stringify(filtered, null, 2));
  return true;
}
