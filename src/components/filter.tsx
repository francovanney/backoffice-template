import React from "react";
import { Button } from "@/components/ui/button";

export default function Filter({ onAdd }: { onAdd: () => void }) {
  const [search, setSearch] = React.useState("");
  return (
    <div className="flex gap-2 items-center mb-4">
      <input
        type="text"
        placeholder="Buscar evento..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-3 py-2 w-64 mr-4 ml-4 focus:outline-none focus:ring"
      />
      <Button onClick={onAdd} type="button" size={"default"}>
        Agregar
      </Button>
    </div>
  );
}
