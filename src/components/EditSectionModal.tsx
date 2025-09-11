import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormInput } from "@/components/ui/form-input";
import { useUpdateSectionMutation } from "@/services/useUpdateSectionMutation";
import toast from "react-hot-toast";

interface EditSectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: {
    id: number;
    nombre: string;
    seccion_padre: string;
    seccion_order?: number | null;
  } | null;
}

const EditSectionModal = ({
  open,
  onOpenChange,
  section,
}: EditSectionModalProps) => {
  const [nombre, setNombre] = useState("");
  const [seccionOrder, setSeccionOrder] = useState<number | "">(""); 
  const updateSectionMutation = useUpdateSectionMutation();

  useEffect(() => {
    if (section) {
        console.log("Section prop changed typeof section.seccion_order:", section);

      setNombre(section.nombre);
      setSeccionOrder(
        typeof section.seccion_order === "number" ? section.seccion_order : ""
      );
    } else {
        setNombre("");
        setSeccionOrder("");
      }
  }, [section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    if (!section) return;

    try {
      await updateSectionMutation.mutateAsync({
        id: section.id,
        nombre: nombre.trim(),
        seccion_order: Number(seccionOrder),
        seccion_padre: section.seccion_padre,
      });

      toast.success("Sección actualizada correctamente");
      onOpenChange(false);
    } catch (error) {
      toast.error("Error al actualizar la sección");
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
      <DialogContent contentClassName="sm:max-w-lg p-6">
        <DialogHeader>
          <DialogTitle>Editar Sección {nombre}</DialogTitle>
        </DialogHeader>

        <div className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <FormInput
                label="Nombre de la sección"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Bares, Kioskos..."
                required
              />
            </div>

            <div>
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
                disabled={updateSectionMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateSectionMutation.isPending}>
                {updateSectionMutation.isPending
                  ? "Actualizando..."
                  : "Actualizar Sección"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSectionModal;
