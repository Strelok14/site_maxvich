'use client';

import { useEffect, useState } from 'react';
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Image from 'next/image';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  area: number;
  duration: string;
  price?: number;
  rooms?: number;
  imageBefore?: string;
  imageAfter?: string;
  images?: string[];
}

const CATEGORY_BADGE: Record<string, { emoji: string; label: string }> = {
  "Ремонт квартиры": { emoji: "🏠", label: "Квартира" },
  "Ремонт дома": { emoji: "🏡", label: "Дом" },
  "Ремонт офиса": { emoji: "🏢", label: "Офис" },
  "Косметический ремонт": { emoji: "🎨", label: "Косметический" },
  "Капитальный ремонт": { emoji: "🛠️", label: "Капитальный" },
};

const formatPrice = (value?: number) =>
  typeof value === 'number' && !Number.isNaN(value)
    ? new Intl.NumberFormat('ru-RU').format(value)
    : '';

export const PortfolioSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data.slice(0, 6)); // Показываем первые 6 проектов
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (isLoading) {
    return (
      <Section id="portfolio" className="bg-gray-50">
        <Container>
          <div className="flex flex-col gap-3 mb-10">
            <p className="text-sm font-semibold text-primary-500">Портфолио</p>
            <h2 className="heading-2">Наши работы</h2>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">Загрузка проектов...</p>
          </div>
        </Container>
      </Section>
    );
  }

  if (projects.length === 0) {
    return (
      <Section id="portfolio" className="bg-gray-50">
        <Container>
          <div className="flex flex-col gap-3 mb-10">
            <p className="text-sm font-semibold text-primary-500">Портфолио</p>
            <h2 className="heading-2">Наши работы</h2>
            <p className="text-gray-600 max-w-2xl">
              Скоро здесь появятся фотографии наших проектов
            </p>
          </div>
          <Card className="p-12">
            <p className="text-center text-gray-500">Проекты будут добавлены в ближайшее время</p>
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="portfolio" className="bg-gray-50">
      <Container>
        <div className="flex flex-col gap-3 mb-10">
          <p className="text-sm font-semibold text-primary-500">Портфолио</p>
          <h2 className="heading-2">Наши работы: До и После</h2>
          <p className="text-gray-600 max-w-2xl">
            Реальные проекты наших клиентов. Нажмите на карточку, чтобы увидеть результат.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const imgs: string[] = project.images && project.images.length > 0
              ? project.images
              : [project.imageBefore || project.imageAfter].filter(Boolean) as string[];
            const idx = currentIndex[project.id] || 0;

            const badge = CATEGORY_BADGE[project.category] || { emoji: "📌", label: project.category };

            return (
              <Card
                key={project.id}
                hover
                className="overflow-hidden cursor-pointer group border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                onClick={() => {
                  setCurrentIndex(prev => ({ ...prev, [project.id]: (idx + 1) % imgs.length }));
                }}
              >
                <div className="relative h-64">
                  <Image
                    src={imgs[idx]}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {imgs.length > 1 ? `${idx + 1}/${imgs.length}` : 'Фото'}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-gray-800 shadow">
                    <span className="mr-1">{badge.emoji}</span>{badge.label}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-sm font-medium">Нажмите, чтобы переключить фото</p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{project.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                    {project.area > 0 && (
                      <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full">
                        <span aria-hidden>📐</span>
                        <span className="font-semibold">Площадь:</span> {project.area} м²
                      </span>
                    )}
                    {project.duration && (
                      <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full">
                        <span aria-hidden>⏱️</span>
                        <span className="font-semibold">Срок:</span> {project.duration}
                      </span>
                    )}
                    {typeof project.price === 'number' && project.price > 0 && (
                      <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full">
                        <span aria-hidden>💰</span>
                        <span className="font-semibold">Бюджет:</span> {formatPrice(project.price)} ₽
                      </span>
                    )}
                    {project.rooms && project.rooms > 0 && (
                      <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full">
                        <span aria-hidden>🛏️</span>
                        <span className="font-semibold">Комнат:</span> {project.rooms}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center mt-10">
          <Button href="#contacts" size="lg">
            Обсудить ваш проект
          </Button>
        </div>
      </Container>
    </Section>
  );
};
