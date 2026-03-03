import React from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/forms/ContactForm";
import { CONTACT_INFO } from "@/data/constants";
import { Phone, Mail, MapPin, Clock, MessageCircle, Smartphone } from "lucide-react";
import { MapWidget } from "@/components/ui/MapWidget";

export const ContactSection: React.FC = () => {
  return (
    <Section id="contacts" className="bg-white">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-primary-500">Контакты</p>
              <h2 className="heading-2">Свяжитесь с нами любым способом</h2>
              <p className="text-gray-600 max-w-2xl">
                Оставьте заявку в форме или напишите в мессенджер. Ответим в течение 15 минут в рабочие часы.
              </p>
            </div>

            <Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <ContactInfoItem icon={<Phone className="w-5 h-5" />} title="Телефон" value={CONTACT_INFO.phone} href={`tel:${CONTACT_INFO.phone}`} />
                <ContactInfoItem icon={<Mail className="w-5 h-5" />} title="Email" value={CONTACT_INFO.email} href={`mailto:${CONTACT_INFO.email}`} />
                <ContactInfoItem icon={<MapPin className="w-5 h-5" />} title="Адрес" value={CONTACT_INFO.address} />
                <ContactInfoItem icon={<Clock className="w-5 h-5" />} title="График" value={CONTACT_INFO.workingHours} />
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-800 mb-3">Мессенджеры</p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    href={CONTACT_INFO.telegram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle className="w-4 h-4" /> Telegram
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    href={CONTACT_INFO.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Smartphone className="w-4 h-4" /> WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    href={CONTACT_INFO.vk}
                    target="_blank"
                    rel="noreferrer"
                  >
                    VK
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-800 mb-3">QR для ВКонтакте</p>
                <p className="text-sm text-gray-600 mb-2">Сканируйте, чтобы открыть профиль в VK</p>
                <a href={CONTACT_INFO.vk} target="_blank" rel="noreferrer" className="inline-block">
                  <img
                    src={typeof CONTACT_INFO.vk === 'string'
                      ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(CONTACT_INFO.vk)}`
                      : '/images/vk-qr.png'
                    }
                    alt="QR VK"
                    className="w-40 h-40 object-contain rounded-lg border"
                  />
                </a>
              </div>
            </Card>

            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-semibold text-gray-800">Карта офиса</p>
              <p className="text-sm text-gray-600 mt-2">Адрес уточним позже — пока показан центр города.</p>
              <div className="mt-4">
                <MapWidget query={CONTACT_INFO.address || "Нижний Новгород"} height={220} />
              </div>
            </div>
          </div>

          <ContactForm title="Оставьте заявку" subtitle="Ответим за 15 минут в рабочее время" />
        </div>
      </Container>
    </Section>
  );
};

interface ContactInfoItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}

const ContactInfoItem: React.FC<ContactInfoItemProps> = ({ icon, title, value, href }) => {
  const content = (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.08em] text-gray-500">{title}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block hover:text-primary-600 transition-colors">
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
};
