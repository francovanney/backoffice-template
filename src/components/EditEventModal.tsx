import { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react";
import { FileUploader } from "react-drag-drop-files";
import Select from "react-select";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { Checkbox } from "@/components/ui/checkbox";
import Spinner from "./ui/Spinner";

import { useModal } from "@/hooks/useModal";
import { useUpdateShowMutation } from "@/services/useUpdateShowMutation";
import { useQueryClient } from "@tanstack/react-query";
import { SHOWS_KEY } from "@/const/queryKeys";

import { EditEventModalSchema } from "@/schemas/eventEditModalSchema";
import { Event } from "@/services/types/event";

interface EditEventModalProps {
  show: Event;
}

export default function EditEventModal({ show }: EditEventModalProps) {
  const { close } = useModal();
  const fileTypes = ["JPG", "JPEG", "PNG"];
  const [file, setFile] = useState<File | null>(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const initialValues = {
    title: show.title,
    categories: show.categories,
    event_date: show.event_date
      ? new Date(show.event_date).toISOString().split("T")[0]
      : "",
    venue: show.venue,
    city: show.city || undefined,
    address: show.address ?? undefined,
    instagram: show.instagram ?? undefined,
    web: show.web ?? undefined,
    url: show.url || undefined,
    image_url: show.image_url || "",
    is_featured: show.is_featured || false,
  };

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(EditEventModalSchema),
    defaultValues: initialValues,
  });

  const watchedValues = useWatch({ control });

  const hasChanges = () => {
    const hasFormChanges =
      JSON.stringify(watchedValues) !== JSON.stringify(initialValues);
    const hasFileChange = file !== null;
    return hasFormChanges || hasFileChange;
  };

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
    categories?: (string | undefined)[];
    event_date: string;
    venue: string;
    city?: string;
    address?: string;
    instagram?: string;
    web?: string;
    url?: string;
    image_url?: string;
    is_featured?: boolean;
  };

  const updateShowMutation = useUpdateShowMutation();
  const queryClient = useQueryClient();

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
    if (data.is_featured !== undefined)
      formData.append("is_featured", String(data.is_featured));
    if (data.categories && data.categories.length > 0) {
      formData.append(
        "categories",
        JSON.stringify(data.categories.filter(Boolean))
      );
    }
    if (file) formData.append("flyer", file);

    updateShowMutation.mutate(
      { id: show.show_id, data: formData },
      {
        onSuccess: () => {
          toast.success("Evento editado correctamente");
          queryClient.invalidateQueries({ queryKey: [SHOWS_KEY] });
          close();
        },
        onError: () => {
          toast.error("Error al editar el evento");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 transition-all duration-300 overflow-hidden">
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
          <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden">
            <div className="bg-background px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Editar evento</h2>
              <X
                className="ml-4 font-bold cursor-pointer"
                onClick={close}
                aria-label="Cerrar"
              />
            </div>
            <div className="p-6 pt-4 max-w-full min-w-0 overflow-x-hidden flex-1">
              <form
                className="space-y-4 w-full max-w-full min-w-0"
                onSubmit={handleSubmit(onSubmit)}
                id="event-edit-form"
              >
                <FormInput
                  label="Nombre del Evento"
                  type="text"
                  register={register("title")}
                  error={errors.title?.message}
                />
                <FormInput
                  label="Categorías"
                  error={errors.categories?.message}
                >
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
                        <div className="w-full max-w-full min-w-0 overflow-hidden">
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
                          />
                        </div>
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

                <div className="space-y-2">
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
                    {!file && show?.image_url && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Imagen actual:</p>
                        <div className="mt-2 relative w-full h-32 border rounded-md overflow-hidden">
                          <img
                            src={show.image_url}
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
                  <Button
                    className="w-full mt-2"
                    type="submit"
                    disabled={updateShowMutation.isPending || !hasChanges()}
                  >
                    {updateShowMutation.isPending ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="flex">
                          <Spinner />
                        </span>
                      </div>
                    ) : (
                      "Editar"
                    )}
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
