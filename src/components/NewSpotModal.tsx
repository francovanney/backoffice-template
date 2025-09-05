import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { FileUploader } from "react-drag-drop-files";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import Spinner from "@/components/ui/Spinner";

import { useModal } from "@/hooks/useModal";
import { useCreateSpotMutation } from "@/services/useCreateSpotMutation";
import { SPOTS_KEY } from "@/const/queryKeys";

interface NewSpotModalProps {
  seccionId: number;
}

type SpotFormData = {
  nombre: string;
  direccion?: string;
  link_direccion?: string;
  telefono?: string;
  descripcion?: string;
  instagram?: string;
  reservas?: string;
  menu?: string;
  delivery?: string;
  web?: string;
};

export default function NewSpotModal({ seccionId }: NewSpotModalProps) {
  const { close } = useModal();
  const queryClient = useQueryClient();
  const createSpotMutation = useCreateSpotMutation();

  const fileTypes = ["JPG", "JPEG", "PNG"];
  const [file, setFile] = useState<File | null>(null);
  const [logoError, setLogoError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SpotFormData>({
    defaultValues: {
      nombre: "",
      direccion: "",
      link_direccion: "",
      telefono: "",
      descripcion: "",
      instagram: "",
      reservas: "",
      menu: "",
      delivery: "",
      web: "",
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
      setLogoError("El archivo es demasiado grande");
      setFile(null);
    } else {
      setFile(singleFile);
      setLogoError("");
      toast.success("Imagen cargada correctamente");
    }
  };

  const onSubmit = async (data: SpotFormData) => {
    try {
      const formData = new FormData();

      formData.append("nombre", data.nombre);
      formData.append("seccion_id", seccionId.toString());

      if (data.direccion) formData.append("direccion", data.direccion);
      if (data.link_direccion)
        formData.append("link_direccion", data.link_direccion);
      if (data.telefono) formData.append("telefono", data.telefono);
      if (data.descripcion) formData.append("descripcion", data.descripcion);
      if (data.instagram) formData.append("instagram", data.instagram);
      if (data.reservas) formData.append("reservas", data.reservas);
      if (data.menu) formData.append("menu", data.menu);
      if (data.delivery) formData.append("delivery", data.delivery);
      if (data.web) formData.append("web", data.web);

      if (file) {
        formData.append("logo", file);
      }

      await createSpotMutation.mutateAsync(formData);

      toast.success(`Negocio ${data.nombre} creado exitosamente`);
      queryClient.invalidateQueries({ queryKey: [SPOTS_KEY] });
      close();
    } catch (error) {
      console.error("Error creating spot:", error);
      toast.error("Error al crear el spot");
    }
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
        <div className="fixed inset-0 flex items-end md:items-center justify-center p-0 md:p-4 pointer-events-none">
          <div className="w-full h-full md:h-auto md:max-w-md md:max-h-[90vh] bg-background shadow-lg md:rounded-lg overflow-hidden flex flex-col pointer-events-auto max-w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0 min-w-0">
              <h2 className="text-lg font-bold truncate pr-4">
                Nuevo Comercio
              </h2>
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
                className="space-y-4"
                onSubmit={handleSubmit(onSubmit)}
                id="spot-form"
              >
                <FormInput
                  label="Nombre *"
                  type="text"
                  register={register("nombre", {
                    required: "El nombre es requerido",
                    maxLength: {
                      value: 30,
                      message: "El nombre no puede exceder 30 caracteres",
                    },
                  })}
                  error={errors.nombre?.message}
                  placeholder="Ingrese el nombre del comercio"
                />

                <FormInput
                  label="Dirección"
                  type="text"
                  register={register("direccion")}
                  error={errors.direccion?.message}
                  placeholder="Ingrese la dirección"
                />

                <FormInput
                  label="Link Dirección (Enlace)"
                  type="text"
                  register={register("link_direccion", {
                    validate: (value) => {
                      if (!value) return true;
                      if (!value.includes("www")) {
                        return "Debe contener www";
                      }
                      return true;
                    },
                  })}
                  error={errors.link_direccion?.message}
                  placeholder="Ingrese el enlace de la dirección"
                />

                <FormInput
                  label="Teléfono"
                  type="text"
                  register={register("telefono", {
                    pattern: {
                      value: /^[0-9]*$/,
                      message: "El teléfono debe contener solo números",
                    },
                  })}
                  error={errors.telefono?.message}
                  placeholder="Ingrese el número de teléfono"
                />

                <div>
                  <label
                    htmlFor="logo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Logo
                  </label>
                  <div className="space-y-3">
                    <FileUploader
                      handleChange={handleChange}
                      name="logo"
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
                    {logoError && (
                      <p className="mt-1 text-sm text-red-600">{logoError}</p>
                    )}
                  </div>
                </div>

                <FormInput
                  label="Descripción"
                  type="text"
                  register={register("descripcion", {
                    maxLength: {
                      value: 50,
                      message: "La descripción no puede exceder 50 caracteres",
                    },
                  })}
                  error={errors.descripcion?.message}
                  placeholder="Ingrese la descripción"
                />

                <FormInput
                  label="Instagram"
                  type="text"
                  register={register("instagram")}
                  error={errors.instagram?.message}
                  placeholder="usuario"
                  span="https://instagram.com/"
                />

                <FormInput
                  label="Reservas (Enlace)"
                  type="text"
                  register={register("reservas")}
                  error={errors.reservas?.message}
                  placeholder="Información de reservas"
                />

                <FormInput
                  label="Menú (Enlace)"
                  type="text"
                  register={register("menu")}
                  error={errors.menu?.message}
                  placeholder="Información del menú"
                />

                <FormInput
                  label="Delivery (Enlace)"
                  type="text"
                  register={register("delivery")}
                  error={errors.delivery?.message}
                  placeholder="Información de delivery"
                />

                <FormInput
                  label="Web (Enlace)"
                  type="text"
                  register={register("web", {
                    validate: (value) => {
                      if (!value) return true;
                      if (!value.includes("www")) {
                        return "Debe contener www";
                      }
                      return true;
                    },
                  })}
                  error={errors.web?.message}
                  placeholder="Sitio web"
                />

                <div className="flex justify-end pt-2">
                  <Button
                    className="w-full mt-2"
                    type="submit"
                    disabled={createSpotMutation.isPending}
                  >
                    {createSpotMutation.isPending ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="flex">
                          <Spinner />
                        </span>
                      </div>
                    ) : (
                      "Crear Comercio"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
