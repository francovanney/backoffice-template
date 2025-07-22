import { useForm, Controller } from "react-hook-form";
import { useModal } from "@/hooks/useModal";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { FormInput } from "@/components/ui/form-input";
import { X } from "lucide-react";
import { IShow } from "@/services/interfaces/IShow";

const eventModalSchema = yup.object().shape({
  event: yup
    .string()
    .required("Evento es un campo obligatorio")
    .max(20, "Máximo 20 caracteres"),
  category: yup.string().required("Categoría es un campo obligatorio"),
  date: yup.string().required("Fecha es un campo obligatorio"),
  venue: yup.string().required("Venue es un campo obligatorio"),
  address: yup.string().optional(),
  instagram: yup.string().optional(),
  web: yup.string().optional(),
});

interface EventEditModalProps {
  show: IShow;
}

export default function EventEditModal({ show }: EventEditModalProps) {
  const { close } = useModal();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(eventModalSchema),
    defaultValues: {
      event: show.title,
      category: show.categories?.[0] || "",
      date: show.event_date ? show.event_date.slice(0, 10) : "",
      venue: show.venue,
      address: show.address,
      instagram: show.instagram,
      web: show.web,
    },
  });

  const onSubmit = (data: any) => {
    // Aquí iría la lógica para actualizar el evento
    console.log("Editar evento:", data);
    close();
  };

  return (
    <div className="fixed inset-0 z-50 transition-all duration-300">
      <div
        className="absolute inset-0 bg-black/40 transition-opacity duration-300 opacity-100"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        style={{ zIndex: 1 }}
      >
        <aside
          className="absolute top-0 right-0 h-full w-full max-w-md bg-background shadow-lg z-50 transition-transform duration-300 pointer-events-auto translate-x-0"
          style={{ zIndex: 2 }}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="bg-background px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Editar evento</h2>
              <X
                className="ml-4 font-bold cursor-pointer"
                onClick={close}
                aria-label="Cerrar"
              />
            </div>
            <div className="p-6 pt-4">
              <form
                className="space-y-4"
                onSubmit={handleSubmit(onSubmit)}
                id="event-edit-form"
              >
                <FormInput
                  label="Evento"
                  type="text"
                  register={register("event")}
                  error={errors.event?.message}
                />
                <FormInput label="Categoría" error={errors.category?.message}>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        name="category"
                      >
                        <SelectItem value="Teatro">Teatro</SelectItem>
                        <SelectItem value="Música">Música</SelectItem>
                        <SelectItem value="Evento">Evento</SelectItem>
                        <SelectItem value="Gastronomía">Gastronomía</SelectItem>
                      </Select>
                    )}
                  />
                </FormInput>
                <FormInput
                  label="Fecha"
                  type="date"
                  register={register("date")}
                  error={errors.date?.message}
                />
                <FormInput
                  label="Venue"
                  type="text"
                  register={register("venue")}
                  error={errors.venue?.message}
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
                <div className="flex justify-end pt-2">
                  <Button className="w-full mt-2" type="submit">
                    Guardar cambios
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
