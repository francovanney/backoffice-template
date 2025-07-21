import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";

export default function Filter({ onAdd }: { onAdd: () => void }) {
  const [search, setSearch] = useState("");
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
      <Button className="ml-4" onClick={onAdd} type="button" size={"default"}>
        Agregar
      </Button>
    </div>
  );
}
