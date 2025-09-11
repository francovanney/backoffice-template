import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { Plus, X } from "lucide-react";

interface UnifiedFilterProps {
  search: string;
  setSearch: (search: string) => void;
  placeholder: string;              
  addLabel: string;                 
  onAdd: () => void;                
  inputWidthClass?: string;         
}

const Filter = ({
  search,
  setSearch,
  placeholder,
  addLabel,
  onAdd,
  inputWidthClass = "w-64",
}: UnifiedFilterProps) => {
  const clearSearch = () => setSearch("");

  return (
    <div className="flex gap-2 items-center mb-4 mt-6">
      <div className={`relative ${inputWidthClass} ml-4`}>
        <FormInput
          type="text"
          placeholder={placeholder}
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
            aria-label="Limpiar búsqueda"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <Button className="ml-4" onClick={onAdd} type="button" size="default">
        <Plus size={16} />
        <span className="hidden lg:inline">{addLabel}</span>
      </Button>
    </div>
  );
};

export default Filter;
