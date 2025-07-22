import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { useModal } from "@/hooks/useModal";
import NewEventModal from "@/components/NewEventModal";

export default function Filter() {
  const [search, setSearch] = useState("");
  const { openModal } = useModal();
  return (
    <div className="flex gap-2 items-center mb-4 ">
      <FormInput
        type="text"
        placeholder="Buscar evento..."
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
        className="w-64 mr-4 ml-4 px-6 py-2"
      />
      <Button
        className="ml-4"
        onClick={() => openModal(<NewEventModal />)}
        type="button"
        size={"default"}
      >
        Agregar
      </Button>
    </div>
  );
}
