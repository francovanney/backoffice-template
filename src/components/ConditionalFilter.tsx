import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useModal } from "@/hooks/useModal";
import Filter from "./FilterComponent";
import NewEventModal from "@/components/NewEventModal";
import NewBannerModal from "@/components/NewBannerModal";

interface ConditionalFilterProps {
  search: string;
  setSearch: (search: string) => void;
}

const ConditionalFilter = ({ search, setSearch }: ConditionalFilterProps) => {
  const { openModal } = useModal();
  const location = useLocation();
  const pathname = location.pathname;

  // Guarda el último pathname para detectar transiciones reales de ruta
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    const prev = prevPathnameRef.current;
    if (prev !== pathname) {
      // Solo limpiar cuando realmente ENTRO a /events o /banners
      if (pathname === "/events" || pathname === "/banners") {
        setSearch("");
      }
      prevPathnameRef.current = pathname;
    }
  }, [pathname, setSearch]);

  if (pathname === "/events") {
    return (
      <div className="flex-shrink-0 bg-white border-b">
        <Filter
          search={search}
          setSearch={setSearch}
          placeholder="Buscar evento..."
          addLabel="Agregar Evento"
          onAdd={() => openModal(<NewEventModal />)}
        />
      </div>
    );
  }

  if (pathname === "/banners") {
    return (
      <div className="flex-shrink-0 bg-white border-b">
        <Filter
          search={search}
          setSearch={setSearch}
          placeholder="Buscar banner..."
          addLabel="Agregar Banner"
          onAdd={() => openModal(<NewBannerModal />)}
        />
      </div>
    );
  }

  return null;
};

export default ConditionalFilter;
