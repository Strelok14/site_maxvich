/**
 * Константы проекта Rem-Maxvich-Stroi
 */

export const SITE_CONFIG = {
  name: "Rem-Maxvich-Stroi",
  title: "Ремонт квартир под ключ в Нижнем Новгороде | Rem-Maxvich-Stroi",
  description:
    "Профессиональный ремонт квартир и домов под ключ. Опыт более 8 лет, гарантия 36 месяцев, бесплатный замер. Механизированная штукатурка стен от 650₽",
  url: "https://rem-maxvich-stroi.ru",
  keywords: [
    "ремонт под ключ",
    "ремонт квартир",
    "ремонт дома",
    "укладка плитки",
    "механизированная штукатурка",
    "стяжка",
    "шпаклёвка",
    "Нижний Новгород",
  ],
} as const;

export const CONTACT_INFO = {
  phone: "+7 (905) 665-66-20", // TODO: Заменить на реальный номер
  email: "maximovichumar29@gmail.com", // TODO: Заменить на реальный email
  address: "г. Нижний Новгород", // TODO: Добавить полный адрес
  workingHours: "Пн-Вс: 8:00 - 20:00",
  telegram: "https://t.me/Maximovich96",
  whatsapp: "https://wa.me/79056656620",
  vk: "https://vk.ru/id503396633",
} as const;

export const ADVANTAGES = [
  {
    id: 1,
    title: "Опыт более 8 лет",
    description: "Профессиональная команда с богатым опытом",
    icon: "award",
  },
  {
    id: 2,
    title: "Гарантия 36 месяцев",
    description: "Официальная гарантия на все виды работ",
    icon: "shield",
  },
  {
    id: 3,
    title: "Бесплатный замер",
    description: "В любой район города",
    icon: "ruler",
  },
  {
    id: 4,
    title: "Честные цены",
    description: "Механизированная штукатурка стен от 650₽/м²",
    icon: "wallet",
  },
] as const;

export const NAVIGATION_LINKS = [
  { href: "/", label: "Главная" },
  { href: "#portfolio", label: "Проекты" },
  { href: "#calculator", label: "Стоимость" },
  { href: "#services", label: "Услуги" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#contacts", label: "Контакты" },
] as const;
