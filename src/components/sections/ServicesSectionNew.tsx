"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SERVICE_CATEGORIES } from "@/data/services";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

type ServiceCategoryId = (typeof SERVICE_CATEGORIES)[number]["id"];

// Временные изображения для услуг - можно заменить на реальные
const serviceImages: Record<number, string> = {
  1: "/images/services/remont-pod-kluch.jpg",
  2: "/images/services/kosmeticheskiy.jpg",
  4: "/images/services/vannaya.jpg",
  5: "/images/services/kuhnya.jpg",
  6: "/images/services/shtukaturka.jpg",
  7: "/images/services/plitka.jpg",
  8: "/images/services/styazhka.jpg",
  9: "/images/services/pokraska.jpg",
  10: "/images/services/spalnya.jpg",
  11: "/images/services/detskaya.jpg",
  12: "/images/services/dizayn-proekt.jpg",
  13: "/images/services/premium.jpg",
  14: "/images/services/kapitalnyy.jpg",
  15: "/images/services/dom.jpg",
};

export const ServicesSectionNew: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ServiceCategoryId>(SERVICE_CATEGORIES[0].id);
  const current = SERVICE_CATEGORIES.find((c) => c.id === activeTab) ?? SERVICE_CATEGORIES[0];

  return (
    <Section id="services" className="bg-gradient-to-b from-white to-gray-50">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full border border-primary-100">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-primary-600">Услуги</span>
            </div>
            <h2 className="heading-2">Полный комплекс работ<br/>для эстетичного и надёжного ремонта</h2>
          </div>
        </div>

        {/* Табы */}
        <div className="flex flex-wrap gap-3 mb-8">
          {SERVICE_CATEGORIES.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full border-2 px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? "border-secondary-800 bg-secondary-800 text-white shadow-lg"
                  : "border-gray-300 text-gray-700 hover:border-secondary-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Сетка услуг с изображениями */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {current.services.map((service, index) => (
            <div
              key={service.id}
              className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer aspect-[3/4]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Фоновое изображение или градиент */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-600">
                {/* Здесь будет изображение когда добавите */}
                {/* <Image 
                  src={serviceImages[service.id] || "/images/placeholder.jpg"} 
                  alt={service.title}
                  fill
                  className="object-cover"
                /> */}
              </div>
              
              {/* Оверлей градиент */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-500"></div>
              
              {/* Контент */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-3 group-hover:mb-4 transition-all duration-300">
                  {service.title}
                </h3>
                <p className="text-sm text-white/90 mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold opacity-90">
                    {service.price}
                  </span>
                  <button className="flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all duration-300">
                    Подробнее
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Блок "Не знаете с чего начать" */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-primary-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <p className="text-sm uppercase tracking-wider text-white/90 mb-2">Не знаете с чего начать?</p>
                <h3 className="text-3xl md:text-4xl font-bold mb-3">Сделаем бесплатный замер и смету</h3>
                <p className="text-white/90 text-lg">
                  Выезжаем в любой район города, консультируем по материалам, рассчитываем смету за 24 часа.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-white/90 font-bold"
                  size="lg"
                  href="#contacts"
                >
                  Вызвать замерщика
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 font-bold"
                  size="lg"
                  href="#calculator"
                >
                  Рассчитать стоимость
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
