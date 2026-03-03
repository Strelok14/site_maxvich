import React from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ClipboardList, Ruler, Palette, FileText, FileCheck, Hammer } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Заявка",
    description: "Позвоните нам или оставьте заявку на сайте. Мы свяжемся с вами в течение 15 минут",
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "Выезд на замер",
    description: "Бесплатный выезд мастера для замера помещения и оценки объёма работ",
    icon: Ruler,
  },
  {
    number: "03",
    title: "Дизайн-проект",
    description: "Разработаем дизайн-проект с учётом ваших пожеланий и бюджета",
    icon: Palette,
  },
  {
    number: "04",
    title: "Смета и расчёт",
    description: "Прозрачная смета с детализацией всех работ и материалов без скрытых платежей",
    icon: FileText,
  },
  {
    number: "05",
    title: "Договор",
    description: "Заключаем официальный договор с гарантией 36 месяцев на все виды работ",
    icon: FileCheck,
  },
  {
    number: "06",
    title: "Ремонт под ключ",
    description: "Выполняем все работы качественно и в срок. Сдаём объект с полной уборкой",
    icon: Hammer,
  },
];

export const WorkflowSection: React.FC = () => {
  return (
    <Section id="workflow" className="bg-gradient-to-b from-white to-gray-50">
      <Container>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full border border-primary-100 mb-4">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-primary-600">Этапы работы</span>
          </div>
          <h2 className="heading-2 mb-3">Как мы работаем</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Прозрачный процесс от заявки до сдачи объекта — без сюрпризов и скрытых платежей
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step, idx) => (
            <div
              key={idx}
              className="relative group"
            >
              <div className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">{step.number}</span>
                </div>

                <div className="mb-4 mt-2">
                  <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-7 h-7 text-primary-600" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {idx < STEPS.length - 1 && (idx + 1) % 3 !== 0 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#contacts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <span className="text-sm font-semibold">Готовы начать? Оставьте заявку прямо сейчас!</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </Container>
    </Section>
  );
};
