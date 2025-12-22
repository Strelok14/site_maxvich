"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { ADVANTAGES } from "@/data/constants";
import { Award, Shield, Ruler, Wallet } from "lucide-react";

const iconMap = {
  award: Award,
  shield: Shield,
  ruler: Ruler,
  wallet: Wallet,
};

export const AdvantagesSection: React.FC = () => {
  return (
    <Section className="bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Декоративный фон */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200 rounded-full blur-3xl"></div>
      </div>
      
      <Container className="relative z-10">
        {/* Заголовок секции */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full border border-primary-100 mb-6">
            <Award className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-semibold text-primary-600">Наши преимущества</span>
          </div>
          <h2 className="heading-2 mb-6">
            Почему выбирают{" "}
            <span className="gradient-text">именно нас</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Мы ценим ваше время и деньги. Поэтому предлагаем лучшие условия для вашего ремонта
          </p>
        </div>

        {/* Сетка преимуществ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {ADVANTAGES.map((advantage, index) => {
            const Icon = iconMap[advantage.icon as keyof typeof iconMap];
            return (
              <Card 
                key={advantage.id} 
                hover 
                variant="premium"
                className="text-center group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Icon className="w-10 h-10 text-primary-500 group-hover:text-primary-600 transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">
                  {advantage.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {advantage.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-white rounded-3xl shadow-xl border border-gray-100">
          {[
            { value: "80+", label: "Выполненных объектов", color: "from-primary-500 to-secondary-500" },
            { value: "98%", label: "Довольных клиентов", color: "from-green-500 to-emerald-500" },
            { value: "24/7", label: "Поддержка клиентов", color: "from-secondary-500 to-blue-500" },
          ].map((stat, index) => (
            <div key={index} className="text-center group cursor-default">
              <div className={`text-5xl md:text-6xl font-extrabold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};
