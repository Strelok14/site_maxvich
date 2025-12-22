import fs from 'fs';
import path from 'path';

const PROJECTS_PATH = path.join(process.cwd(), 'data', 'projects.json');

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  area: number;
  duration: string;
  price?: number;
  imageBefore: string;
  imageAfter: string;
  videos?: string[];
  createdAt: string;
  updatedAt: string;
}

// Инициализация базы данных
function initDB() {
  const dir = path.dirname(PROJECTS_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(PROJECTS_PATH)) {
    fs.writeFileSync(PROJECTS_PATH, JSON.stringify([], null, 2));
  }
}

// Получить все проекты
export function getAllProjects(): Project[] {
  initDB();
  const data = fs.readFileSync(PROJECTS_PATH, 'utf-8');
  return JSON.parse(data);
}

// Получить проект по ID
export function getProjectById(id: string): Project | null {
  const projects = getAllProjects();
  return projects.find(p => p.id === id) || null;
}

// Добавить новый проект
export function addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
  initDB();
  const projects = getAllProjects();
  
  const newProject: Project = {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  projects.unshift(newProject);
  fs.writeFileSync(PROJECTS_PATH, JSON.stringify(projects, null, 2));
  
  return newProject;
}

// Обновить проект
export function updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Project | null {
  initDB();
  const projects = getAllProjects();
  const index = projects.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  fs.writeFileSync(PROJECTS_PATH, JSON.stringify(projects, null, 2));
  
  return projects[index];
}

// Удалить проект
export function deleteProject(id: string): boolean {
  initDB();
  const projects = getAllProjects();
  const filtered = projects.filter(p => p.id !== id);
  
  if (filtered.length === projects.length) return false;
  
  fs.writeFileSync(PROJECTS_PATH, JSON.stringify(filtered, null, 2));
  return true;
}
