"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Phone, Calculator, Send, CheckCircle2, Award, Shield } from "lucide-react";
import { CONTACT_INFO } from "@/data/constants";

export const HeroSection: React.FC = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover hero-bg-adaptive"
      style={{
        backgroundImage:
          "url('/images/photo_2025-12-20_17-43-12.jpg')",
      }}
    >
      {/* Тёмный оверлей поверх фото */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
      {/* Современный фоновый паттерн */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255, 255, 255) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Анимированные градиентные сферы */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-br from-primary-500/30 to-secondary-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-secondary-500/25 to-blue-500/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>

      <Container className="relative z-10">
        <div className="grid gap-8 items-center py-12">
          {/* Левая часть - контент */}
          <div className="text-white space-y-4">
            {/* Бейдж */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full border border-primary-500/30 backdrop-blur-sm">
              <Award className="w-4 h-4 text-primary-400" />
              <span className="text-primary-300 text-sm font-semibold">
                Профессиональный ремонт с 2016 года
              </span>
            </div>

            {/* Заголовок */}
            <div className="space-y-2">
              <h1 className="heading-1 text-white leading-tight text-4xl md:text-5xl">
                Ремонт квартир{" "}
                <span className="gradient-text block mt-1">
                  под ключ в Нижнем Новгороде
                </span>
              </h1>
              
              <p className="text-base md:text-lg text-gray-300 max-w-4xl font-light leading-snug">
                Превратим вашу квартиру в пространство мечты. Гарантия качества, прозрачные цены, соблюдение сроков.
              </p>
            </div>

            {/* Ключевые преимущества в сетке */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 pt-3 max-w-5xl">
              {[
                { icon: Award, text: "Опыт более 8 лет" },
                { icon: Shield, text: "Гарантия 36 месяцев" },
                { icon: CheckCircle2, text: "Бесплатный замер" },
                { icon: CheckCircle2, text: "Качественная работа" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center border border-primary-500/30 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <item.icon className="w-4 h-4 text-primary-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-300 leading-tight">{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTA кнопки */}
            <div className="flex flex-col sm:flex-row gap-4 pt-3 max-w-4xl">
                <Button variant="premium" size="xl" href="#calculator" className="group">
                  <Calculator className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <div className="flex flex-col items-start">
                    <span>Рассчитать стоимость</span>
                    <span className="text-xs opacity-90">за 30 секунд</span>
                  </div>
                </Button>
                <Button
                  size="xl"
                  className="bg-white/10 text-white hover:bg-white/20"
                  href="#contacts"
                >
                  <Send className="w-5 h-5" />
                  Оставить заявку
                </Button>
            </div>
            
            {/* Контакт */}
            <div className="flex items-center gap-3 pt-1">
              <Button 
                variant="ghost" 
                size="lg" 
                className="bg-white/5 hover:bg-white/10 text-white border border-white/20" 
                href={`tel:${CONTACT_INFO.phone}`}
              >
                <Phone className="w-5 h-5" />
                {CONTACT_INFO.phone}
              </Button>
            </div>

            {/* Статистика */}
            <div className="flex flex-wrap items-center gap-10 pt-4 border-t border-white/10 max-w-5xl">
              {[
                { value: "80+", label: "Проектов" },
                { value: "4.9", label: "Рейтинг" },
                { value: "8+", label: "Лет опыта" },
              ].map((stat, index) => (
                <div key={index} className="group cursor-default">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-0.5 group-hover:text-primary-400 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Правая колонка удалена. Контент слева занимает всю ширину. */}
        </div>
      </Container>

      {/* Индикатор прокрутки */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs font-medium">Листайте вниз</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};
