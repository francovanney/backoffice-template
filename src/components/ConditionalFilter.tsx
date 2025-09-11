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
  const { pathname } = useLocation();

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
