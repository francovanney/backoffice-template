import { useState } from "react";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { eventModalSchema } from "@/schemas/eventModalSchema";
import { useModal } from "@/hooks/useModal";
import { useCreateShowMutation } from "@/services/useCreateShowMutation";
import { useShowsQuery } from "@/services/useShowsQuery";

import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { FormInput } from "@/components/ui/form-input";
import { FileUploader } from "react-drag-drop-files";
import { X } from "lucide-react";

import { Event } from "@/types/event";

interface NewEventModalProps {
  event?: Event;
}

export default function NewEventModal({ event }: NewEventModalProps) {
  const { close } = useModal();
  const fileTypes = ["JPG", "JPEG"];
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(eventModalSchema),
    defaultValues: event
      ? {
          title: event.title,
          categories: event.categories,
          event_date: event.event_date ? event.event_date.split("T")[0] : "",
          venue: event.venue,
          city: event.city || "",
          instagram: event.instagram || "",
          web: event.web || "",
          url: event.url || "",
        }
      : {},
  });

  const handleChange = (uploadedFile: File | File[]) => {
    const singleFile = Array.isArray(uploadedFile)
      ? uploadedFile[0]
      : uploadedFile;

    if (singleFile.size > 1048576) {
      toast.error(
        "El archivo es demasiado grande. El tamaño máximo permitido es 1MB."
      );
    } else {
      setFile(singleFile);
      toast.success("Imagen cargada correctamente");
    }
  };

  type EventFormData = {
    title: string;
    categories: (string | undefined)[];
    event_date: string;
    venue: string;
    city?: string;
    address?: string;
    instagram?: string;
    web?: string;
    url?: string;
  };

  const createShowMutation = useCreateShowMutation();
  const { refetch } = useShowsQuery();

  const onSubmit = (data: EventFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("event_date", data.event_date);
    formData.append("venue", data.venue);
    if (data.city) formData.append("city", data.city);
    if (data.address) formData.append("address", data.address);
    if (data.instagram) formData.append("instagram", data.instagram);
    if (data.web) formData.append("web", data.web);
    if (data.url) formData.append("url", data.url);
    if (data.categories && data.categories.length > 0) {
      formData.append(
        "categories",
        JSON.stringify(data.categories.filter(Boolean))
      );
    }
    if (file) formData.append("flyer", file);

    createShowMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Evento creado correctamente");
        refetch();
        close();
      },
      onError: () => {
        toast.error("Error al guardar el evento");
      },
    });
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
              <h2 className="text-lg font-bold">
                {event ? "Editar evento" : "Nuevo evento"}
              </h2>
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
                id="event-form"
              >
                <FormInput
                  label="Evento"
                  type="text"
                  register={register("title")}
                  error={errors.title?.message}
                />
                <FormInput label="Categoría" error={errors.categories?.message}>
                  <Controller
                    name="categories"
                    control={control}
                    render={({ field }) => {
                      const currentValue =
                        Array.isArray(field.value) && field.value.length > 0
                          ? field.value[0]
                          : "";

                      return (
                        <Select
                          value={currentValue}
                          onValueChange={(value) => field.onChange([value])}
                          name="categories"
                        >
                          <SelectItem value="Teatro">Teatro</SelectItem>
                          <SelectItem value="Música">Música</SelectItem>
                          <SelectItem value="Evento">Evento</SelectItem>
                          <SelectItem value="Gastronomía">
                            Gastronomía
                          </SelectItem>
                        </Select>
                      );
                    }}
                  />
                </FormInput>
                <FormInput
                  label="Fecha"
                  type="date"
                  register={register("event_date")}
                  error={errors.event_date?.message}
                />
                <FormInput
                  label="Venue"
                  type="text"
                  register={register("venue")}
                  error={errors.venue?.message}
                />
                <FormInput
                  label="Ciudad"
                  type="text"
                  register={register("city")}
                />
                <FormInput
                  label="Dirección"
                  type="text"
                  placeholder="Dirección"
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
                <FormInput label="Imagen">
                  <div className="space-y-3">
                    <FileUploader
                      handleChange={handleChange}
                      name="image"
                      types={fileTypes}
                      multiple={false}
                      label="Arrastre o suba una imagen"
                      hoverTitle="Arrastre aquí"
                    />
                    {file && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Archivo seleccionado: {file.name}
                        </p>
                        <div className="mt-2 relative w-full h-32 border rounded-md overflow-hidden">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Vista previa"
                            className="object-contain w-full h-full"
                          />
                        </div>
                      </div>
                    )}
                    {!file && event?.image_url && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Imagen actual:</p>
                        <div className="mt-2 relative w-full h-32 border rounded-md overflow-hidden">
                          <img
                            src={event.image_url}
                            alt="Imagen actual"
                            className="object-contain w-full h-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </FormInput>
                <FormInput
                  label="URL Ticket"
                  type="text"
                  register={register("url")}
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
