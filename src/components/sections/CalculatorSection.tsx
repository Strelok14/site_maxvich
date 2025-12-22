"use client";

import { useEffect, useRef, useState } from "react";

const CALC_CONTAINER_ID = "calculator-container";

declare global {
  interface Window {
    initRepairCalculator?: (containerId: string, customConfig?: unknown) => unknown;
    CALCULATOR_CONFIG?: unknown;
  }
}

const loadScript = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;

    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Не удалось загрузить ${src}`)), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.loading = "true";
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Не удалось загрузить ${src}`));
    document.body.appendChild(script);
  });

const ensureStyles = () => {
  if (document.getElementById("calculator-styles")) return;
  const link = document.createElement("link");
  link.id = "calculator-styles";
  link.rel = "stylesheet";
  link.href = "/calculator/calculator.css";
  document.head.appendChild(link);
};

export function CalculatorSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [config, setConfig] = useState<unknown>(null);

  // Загрузка конфигурации из API
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/calculator-config');
        if (response.ok) {
          const data = await response.json();
          setConfig(data);
          // Устанавливаем глобальную переменную для калькулятора
          if (typeof window !== 'undefined') {
            window.CALCULATOR_CONFIG = data;
          }
        }
      } catch (err) {
        console.error('Error loading calculator config:', err);
      }
    };

    loadConfig();
  }, []);

  useEffect(() => {
    if (initializedRef.current || !config) return;

    const init = async () => {
      try {
        ensureStyles();
        await loadScript("/calculator/template.js");
        await loadScript("/calculator/calculator.js");

        if (typeof window !== "undefined" && window.initRepairCalculator && containerRef.current) {
          window.initRepairCalculator(CALC_CONTAINER_ID, config);
          initializedRef.current = true;
          setReady(true);
        } else {
          throw new Error("initRepairCalculator недоступен");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Не удалось загрузить калькулятор";
        setError(message);
      }
    };

    init();
  }, [config]);

  return (
    <section id="calculator" className="section-padding bg-gradient-to-b from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <div className="container-custom grid gap-12 lg:grid-cols-2 items-start">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-primary-300">Онлайн-калькулятор</p>
          <h2 className="heading-2 text-white">Рассчитайте стоимость ремонта за 1 минуту</h2>
          <p className="text-lg text-white/80">
            Выберите параметры помещения, и мы мгновенно покажем предварительный расчет. Точную смету подтвердит инженер после выезда на объект.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-base font-semibold text-white">Учитываем все работы</p>
              <p className="text-sm text-white/70">Тип отделки, санузлы, электрика, теплые полы, сантехника, перепланировка.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-base font-semibold text-white">Смета в рублях</p>
              <p className="text-sm text-white/70">Автоматический пересчет при любом изменении параметров.</p>
            </div>
          </div>
          <p className="text-sm text-white/60">* Результат носит предварительный характер. Финальную стоимость подтверждаем после осмотра и замеров.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white p-2 shadow-2xl shadow-primary-500/20">
          <div id={CALC_CONTAINER_ID} ref={containerRef} />
          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              Не удалось загрузить калькулятор: {error}
            </div>
          )}
          {!error && !ready && (
            <div className="p-4 text-center text-sm text-secondary-600">Загружаем калькулятор…</div>
          )}
        </div>
      </div>
    </section>
  );
}
