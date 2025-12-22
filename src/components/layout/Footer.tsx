import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CONTACT_INFO, NAVIGATION_LINKS } from "@/data/constants";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-500 text-white">
      <Container>
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* О компании */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-white">Rem</span>-Maxvich
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Профессиональный ремонт квартир и домов под ключ в Нижнем Новгороде.
              Опыт более 8 лет.
            </p>
            <div className="flex space-x-4">
              <a
                href={CONTACT_INFO.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors"
                aria-label="Telegram"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={CONTACT_INFO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href={CONTACT_INFO.vk}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors"
                aria-label="VK"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.35 14.63h-1.48c-.45 0-.59-.36-1.4-1.17-.71-.71-1.02-.81-1.2-.81-.24 0-.31.07-.31.42v1.07c0 .29-.09.46-1.01.46-1.53 0-3.23-.93-4.43-2.67-1.81-2.54-2.31-4.45-2.31-4.84 0-.18.07-.35.42-.35h1.48c.32 0 .44.15.56.5.64 1.84 1.73 3.46 2.17 3.46.17 0 .24-.08.24-.5v-1.96c-.06-.98-.57-1.07-.57-1.42 0-.14.12-.29.3-.29h2.32c.27 0 .37.14.37.46v2.64c0 .27.12.37.2.37.17 0 .3-.1.61-.41 1.04-1.16 1.79-2.96 1.79-2.96.1-.2.25-.35.57-.35h1.48c.36 0 .44.18.36.46-.15.69-1.61 2.89-1.61 2.89-.13.21-.18.31 0 .55.13.18.55.54.83.87.52.6 1.04 1.21 1.16 1.59.13.39-.07.59-.45.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Навигация */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Навигация</h3>
            <nav className="flex flex-col space-y-2">
              {NAVIGATION_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-primary-500 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <div className="flex flex-col space-y-3 text-sm">
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="flex items-center space-x-2 text-gray-300 hover:text-primary-500 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{CONTACT_INFO.phone}</span>
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center space-x-2 text-gray-300 hover:text-primary-500 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{CONTACT_INFO.email}</span>
              </a>
              <div className="flex items-start space-x-2 text-gray-300">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>{CONTACT_INFO.address}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Clock className="w-4 h-4" />
                <span>{CONTACT_INFO.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Информация */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Информация</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <Link
                href="/privacy"
                className="text-gray-300 hover:text-primary-500 transition-colors"
              >
                Политика конфиденциальности
              </Link>
              <Link
                href="/terms"
                className="text-gray-300 hover:text-primary-500 transition-colors"
              >
                Договор оферты
              </Link>
              <Link
                href="/requisites"
                className="text-gray-300 hover:text-primary-500 transition-colors"
              >
                Реквизиты
              </Link>
            </div>
          </div>
        </div>

        {/* Копирайт */}
        <div className="border-t border-white/10 py-6 text-center text-sm text-gray-400">
          <p>
            © {currentYear} Rem-Maxvich-Stroi. Все права защищены.
          </p>
        </div>
      </Container>
    </footer>
  );
};
