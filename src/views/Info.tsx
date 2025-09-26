import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

type Section = {
  key: string;
  title: string;
  text: string;
};

const SECTIONS: Section[] = [
  {
    key: "como-llegar",
    title: "Cómo llegar",
    text:
      "Encontrá las mejores rutas en auto y opciones en transporte público (ómnibus y tren) para llegar desde Capital y alrededores. Recomendamos verificar horarios actualizados y el estado de rutas.",
  },
  {
    key: "numeros-utiles",
    title: "Números útiles",
    text:
      "Emergencias: 911 · Bomberos: 100 · Hospital: (XXX) XXX-XXXX · Policía: (XXX) XXX-XXXX · Turismo municipal: (XXX) XXX-XXXX.",
  },
  {
    key: "atractivos-turisticos",
    title: "Atractivos turísticos",
    text:
      "Principales puntos de interés: plazas, museos, parques y circuitos recomendados. Ideal para paseos a pie o en bici, con propuestas para familias y viajeros curiosos.",
  },
  {
    key: "transporte-local",
    title: "Transporte local",
    text:
      "Líneas de colectivos, remises/taxis y apps de movilidad disponibles. Consejos de tarifas, horarios pico y zonas mejor conectadas.",
  },
];

export default function InfoUtil() {
  // estado controlado por clave, todas cerradas inicialmente
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <main className="mt-5 mx-4 sm:ml-5 max-w-full">
      <div className="w-full max-w-none">
        <h1 className="text-2xl sm:text-3xl font-bold mb-5">Info Útil</h1>

        <div className="space-y-4">
          {SECTIONS.map(({ key, title, text }) => {
            const isOpen = !!open[key];
            const panelId = `panel-${key}`;
            const btnId = `btn-${key}`;
            return (
              <div key={key} className="border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between p-4">
                  <button
                    id={btnId}
                    type="button"
                    onClick={() => toggle(key)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="text-left flex-1 flex items-center gap-2 hover:bg-gray-50 rounded p-2 transition-colors"
                  >
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                    <h2 className="text-xl font-semibold text-gray-900">
                      {title}
                    </h2>
                  </button>
                </div>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    className="px-4 pb-4 space-y-6"
                  >
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {text}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
