import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { useModal } from "@/hooks/useModal";
import NewEventModal from "@/components/NewEventModal";
import { Plus, X } from "lucide-react";

interface FilterProps {
  search: string;
  setSearch: (search: string) => void;
}

const Filter = ({ search, setSearch }: FilterProps) => {
  const { openModal } = useModal();

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="flex gap-2 items-center mb-4 mt-6 ">
      <div className="relative w-64 ml-4">
        <FormInput
          type="text"
          placeholder="Buscar evento..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          className="w-full px-6 py-2 pr-10"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            type="button"
            aria-label="Limpiar busqueda"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <Button
        className="ml-4"
        onClick={() => openModal(<NewEventModal />)}
        type="button"
        size={"default"}
      >
        <Plus size={16} />
        <span className="hidden lg:inline">Agregar Evento</span>
      </Button>
    </div>
  );
};

export default Filter;
