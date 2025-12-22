import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

export default function RequisitesPage() {
  return (
    <Section className="py-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Реквизиты компании</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Основная информация */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold">Основная информация</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Наименование</p>
                  <p className="font-semibold">ИП Балиев Умар Максимович</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">ИНН</p>
                  <p className="font-semibold">053406901109</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">КПП</p>
                  <p className="font-semibold">—</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">ОГРН</p>
                  <p className="font-semibold">—</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Юридический адрес</p>
                  <p className="font-semibold">г. Нижний Новгород</p>
                </div>
              </div>
            </div>

            {/* Банковские реквизиты */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold">Банковские реквизиты</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Расчётный счёт</p>
                  <p className="font-semibold">40802810016480003342</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Банк</p>
                  <p className="font-semibold">ФИЛИАЛ &laquo;ЦЕНТРАЛЬНЫЙ&raquo; БАНКА ВТБ (ПАО)</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">БИК</p>
                  <p className="font-semibold">044525411</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Корр. счёт</p>
                  <p className="font-semibold">30101810145250000411</p>
                </div>
              </div>
            </div>

            {/* Контактная информация */}
            <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-lg p-8 text-white md:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Контактная информация</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80 mb-1">Телефон</p>
                    <a href="tel:+79056656620" className="font-semibold hover:underline">
                      +7 (905) 665-66-20
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80 mb-1">Email</p>
                    <a href="mailto:maximovichumar29@gmail.com" className="font-semibold hover:underline break-all">
                      maximovichumar29@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80 mb-1">Адрес</p>
                    <p className="font-semibold">г. Нижний Новгород</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Примечание */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <p className="text-sm text-yellow-800">
              <strong>Примечание:</strong> Компания находится в процессе регистрации. 
              Полные реквизиты будут опубликованы после завершения процедуры регистрации. 
              По всем вопросам обращайтесь по контактным данным выше.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
