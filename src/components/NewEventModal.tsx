import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react";
import { FileUploader } from "react-drag-drop-files";
import Select from "react-select";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { Checkbox } from "@/components/ui/checkbox";
import Spinner from "@/components/ui/Spinner";

import { useModal } from "@/hooks/useModal";
import { useCreateShowMutation } from "@/services/useCreateShowMutation";
import { useQueryClient } from "@tanstack/react-query";
import { SHOWS_KEY } from "@/const/queryKeys";

import { eventModalSchema } from "@/schemas/eventModalSchema";
import { Event } from "@/services/types/event";

interface NewEventModalProps {
  event?: Event;
}

export default function NewEventModal({ event }: NewEventModalProps) {
  const { close } = useModal();
  const fileTypes = ["JPG", "JPEG", "PNG"];
  const [file, setFile] = useState<File | null>(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
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
          image_url: event.image_url || "",
          is_featured: event.is_featured || false,
        }
      : {
          is_featured: false,
        },
  });

  const handleChange = (uploadedFile: File | File[]) => {
    const singleFile = Array.isArray(uploadedFile)
      ? uploadedFile[0]
      : uploadedFile;

    if (singleFile.size > 1048576) {
      toast.error(
        "El archivo es demasiado grande. El tamaño máximo permitido es 1MB."
      );
      setError("image_url", {
        type: "manual",
        message: "El archivo es demasiado grande",
      });
      setFile(null);
    } else {
      setFile(singleFile);
      clearErrors("image_url");
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
    is_featured?: boolean;
  };

  const createShowMutation = useCreateShowMutation();
  const queryClient = useQueryClient();

  const onSubmit = (data: EventFormData) => {
    if (!file && !event?.image_url) {
      setError("image_url", {
        type: "manual",
        message: "La imagen es obligatoria",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("event_date", data.event_date);
    formData.append("venue", data.venue);
    if (data.city) formData.append("city", data.city);
    if (data.address) formData.append("address", data.address);
    if (data.instagram) formData.append("instagram", data.instagram);
    if (data.web) formData.append("web", data.web);
    if (data.url) formData.append("url", data.url);
    if (data.is_featured !== undefined)
      formData.append("is_featured", String(data.is_featured));
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
        queryClient.invalidateQueries({ queryKey: [SHOWS_KEY] });
        close();
      },
      onError: () => {
        toast.error("Error al guardar el evento");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 transition-opacity duration-300"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      />
      <div className="fixed inset-0 flex items-end md:items-center justify-center p-0 md:p-4 pointer-events-none">
        <div className="w-full h-full md:h-auto md:max-w-md md:max-h-[90vh] bg-background shadow-lg md:rounded-lg overflow-hidden flex flex-col pointer-events-auto max-w-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0 min-w-0">
            <h2 className="text-lg font-bold truncate pr-4">Nuevo Evento</h2>
            <button
              onClick={close}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 max-w-full min-w-0">
            <form
              className="space-y-4 w-full max-w-full min-w-0"
              onSubmit={handleSubmit(onSubmit)}
              id="event-form"
            >
              <FormInput
                label="Nombre del Evento"
                type="text"
                register={register("title")}
                error={errors.title?.message}
              />

              <FormInput label="Categorías" error={errors.categories?.message}>
                <div className="w-full overflow-hidden">
                  <Controller
                    name="categories"
                    control={control}
                    render={({ field }) => {
                      const options = [
                        { value: "Teatro", label: "Teatro" },
                        { value: "Música", label: "Música" },
                        { value: "Evento", label: "Evento" },
                        { value: "Gastronomía", label: "Gastronomía" },
                        { value: "Aire Libre", label: "Aire Libre" },
                        { value: "Gratis", label: "Gratis" },
                        { value: "Feria", label: "Feria" },
                      ];

                      return (
                        <Select
                          isMulti
                          options={options}
                          value={options.filter((opt) =>
                            field.value?.includes(opt.value)
                          )}
                          onChange={(selected) => {
                            const values = Array.isArray(selected)
                              ? selected.map((opt) => opt.value)
                              : [];
                            if (values.length < 3) {
                              field.onChange(values);
                              setMenuIsOpen(true);
                            } else if (values.length === 3) {
                              field.onChange(values);
                              setMenuIsOpen(false);
                            } else {
                              toast.error("Máximo 3 categorías permitidas");
                            }
                          }}
                          placeholder="Selecciona hasta 3 categorías"
                          closeMenuOnSelect={false}
                          menuIsOpen={menuIsOpen}
                          onMenuOpen={() => setMenuIsOpen(true)}
                          onMenuClose={() => setMenuIsOpen(false)}
                          className="w-full"
                          classNamePrefix="react-select"
                        />
                      );
                    }}
                  />
                </div>
              </FormInput>
              <FormInput
                label="Fecha"
                type="date"
                register={register("event_date")}
                error={errors.event_date?.message}
                className="max-w-full min-w-0 w-full"
                style={{
                  maxWidth: "100%",
                  width: "100%",
                  minWidth: "0",
                  boxSizing: "border-box",
                  overflow: "hidden",
                }}
              />
              <FormInput
                label="Lugar del Evento"
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

              <div className="space-y-2 w-full">
                <label className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Evento Destacado
                </label>
                <div className="flex items-center space-x-2">
                  <Controller
                    name="is_featured"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="is_featured"
                      />
                    )}
                  />
                  <label
                    htmlFor="is_featured"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Marcar como evento destacado
                  </label>
                </div>
              </div>

              <FormInput label="Imagen" error={errors.image_url?.message}>
                <div className="space-y-3 w-full min-w-0 overflow-hidden">
                  <div className="w-full">
                    <FileUploader
                      handleChange={handleChange}
                      name="image"
                      types={fileTypes}
                      multiple={false}
                      label="Arrastre o suba una imagen"
                      hoverTitle="Arrastre aquí"
                    />
                  </div>
                  {file && (
                    <div className="mt-2 w-full min-w-0">
                      <p className="text-sm text-gray-500 break-all">
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
                    <div className="mt-2 w-full min-w-0">
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
              <div className="flex justify-end pt-2 w-full">
                <Button
                  className="w-full mt-2"
                  type="submit"
                  disabled={createShowMutation.isPending}
                >
                  {createShowMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="flex">
                        <Spinner />
                      </span>
                    </div>
                  ) : (
                    "Agregar"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
