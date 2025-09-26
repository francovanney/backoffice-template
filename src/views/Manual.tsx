import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import IconsOrden from "./../assets/icons-manual.png";
import BannersOrden from "./../assets/banners-manual.png";

export default function Manual() {
  const [isBannersOpen, setIsBannersOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  return (
    <main className="mt-5 mx-4 sm:ml-5 max-w-full">
      <div className="w-full max-w-none">
        <h1 className="text-2xl sm:text-3xl font-bold mb-5">Manual</h1>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4">
              <button
                type="button"
                onClick={() => setIsBannersOpen((v) => !v)}
                className="text-left flex-1 flex items-center gap-2 hover:bg-gray-50 rounded p-2 transition-colors"
              >
                {isBannersOpen ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
                <h2 className="text-xl font-semibold text-gray-900">Banners</h2>
              </button>
            </div>

            {isBannersOpen && (
              <div className="px-4 pb-4 space-y-6">
                <span className="text-xs text-gray-600 block">
                  Agrega los sponsors en la sección banners y agregarle el
                  correspondiente orden.
                </span>

                <div className="w-full max-w-3xl">
                  <div className="relative w-full border rounded-md overflow-hidden bg-white">
                    <img
                      src={BannersOrden}
                      alt="Guía de orden para banners (sponsors)"
                      className="w-full h-auto object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4">
              <button
                type="button"
                onClick={() => setIsShortcutsOpen((v) => !v)}
                className="text-left flex-1 flex items-center gap-2 hover:bg-gray-50 rounded p-2 transition-colors"
              >
                {isShortcutsOpen ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
                <h2 className="text-xl font-semibold text-gray-900">
                  Accesos Directos
                </h2>
              </button>
            </div>

            {isShortcutsOpen && (
              <div className="px-4 pb-4 space-y-6">
                <span className="text-xs text-gray-600 block">
                  Agrega los iconos en la sección banners y agregarle el
                  correspondiente orden.
                </span>

                <div className="w-full max-w-3xl">
                  <div className="relative w-full border rounded-md overflow-hidden bg-white">
                    <img
                      src={IconsOrden}
                      alt="Guía de orden para iconos de accesos directos"
                      className="w-full h-auto object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
