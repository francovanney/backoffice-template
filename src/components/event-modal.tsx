import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { FormInput } from "@/components/ui/form-input";

import { X } from "lucide-react";
export default function EventModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { register, handleSubmit, watch } = useForm();
  const date = watch("date");
  const onSubmit = (data: any) => {
    // Aquí puedes manejar el submit
    console.log(data);
  };
  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        open ? "" : "invisible"
      }`}
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        style={{ zIndex: 1 }}
      >
        <aside
          className={`absolute top-0 right-0 h-full w-full max-w-md bg-background shadow-lg z-50 transition-transform duration-300 pointer-events-auto ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ zIndex: 2 }}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="bg-background px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Nuevo evento</h2>
              <X
                className="ml-4 font-bold cursor-pointer"
                onClick={onClose}
                aria-label="Cerrar"
              />
            </div>
            <div className="p-6 pt-4">
              <form
                className="space-y-4"
                onSubmit={handleSubmit(onSubmit)}
                id="event-form"
              >
                <FormInput
                  label="Evento"
                  type="text"
                  register={register("event")}
                />
                <FormInput
                  label="Imagen (URL)"
                  type="text"
                  register={register("image")}
                />
                <FormInput label="Categoría">
                  <Select {...register("category")} name="category">
                    <SelectItem value="Conferencia">Conferencia</SelectItem>
                    <SelectItem value="Meetup">Meetup</SelectItem>
                    <SelectItem value="Taller">Taller</SelectItem>
                  </Select>
                </FormInput>
                <FormInput
                  label="Fecha"
                  type="date"
                  register={register("date")}
                />
                <FormInput
                  label="Venue"
                  type="text"
                  register={register("venue")}
                />
                <FormInput
                  label="Dirección"
                  type="text"
                  register={register("address")}
                />
                <FormInput
                  label="Instagram"
                  type="text"
                  register={register("instagram")}
                  placeholder="usuario"
                  span="https://instagram.com/"
                />
                <FormInput label="Web" type="text" register={register("web")} />
                <FormInput
                  label="Ticket"
                  type="text"
                  register={register("ticket")}
                />
                <div className="flex justify-end pt-2">
                  <Button className="w-full mt-2" type="submit">
                    Agregar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
