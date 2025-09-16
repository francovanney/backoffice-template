import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormInput } from "@/components/ui/form-input";
import { useCreateSectionMutation } from "@/services/useCreateSectionMutation";
import toast from "react-hot-toast";

interface NewSectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionParent: string;
}

const NewSectionModal = ({
  open,
  onOpenChange,
  sectionParent,
}: NewSectionModalProps) => {
  const [nombre, setNombre] = useState("");
  const [seccionOrder, setSeccionOrder] = useState<number | "">("");
  const createSectionMutation = useCreateSectionMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    try {
      await createSectionMutation.mutateAsync({
        nombre: nombre.trim(),
        seccion_padre: sectionParent,
        seccion_order: Number(seccionOrder),
      });

      toast.success("Sección creada correctamente");
      setNombre("");
      setSeccionOrder("");
      onOpenChange(false);
    } catch (error) {
      toast.error("Error al crear la sección");
      console.error(error);
    }
  };

  const handleClose = () => {
    setNombre("");
    setSeccionOrder("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent contentClassName="p-12">
        <DialogHeader>
          <DialogTitle>
            Nueva Sub-Categoría en:{" "}
            {sectionParent.charAt(0).toUpperCase() + sectionParent.slice(1)}
          </DialogTitle>
        </DialogHeader>

        <div className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div>
              <FormInput
                label="Nombre de la sección"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Bares, Kioskos..."
                required
              />

              <FormInput
                    label="Orden de la sección"
                    type="number"
                    value={seccionOrder}
                    onChange={(e) =>
                        setSeccionOrder(
                        e.target.value === "" ? "" : Number(e.target.value)
                        )
                    }
                    placeholder="Ej: 1, 2, .. (mayor o igual a 0)"
                    min={0}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createSectionMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createSectionMutation.isPending}>
                {createSectionMutation.isPending
                  ? "Creando..."
                  : "Crear Sección"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewSectionModal;
