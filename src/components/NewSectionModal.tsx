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
      });

      toast.success("Sección creada correctamente");
      setNombre("");
      onOpenChange(false);
    } catch (error) {
      toast.error("Error al crear la sección");
      console.error(error);
    }
  };

  const handleClose = () => {
    setNombre("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent contentClassName="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Sub-Sección en {sectionParent}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FormInput
              label="Nombre de la sección"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Ropa, Calzado, etc."
              required
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
              {createSectionMutation.isPending ? "Creando..." : "Crear Sección"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewSectionModal;
