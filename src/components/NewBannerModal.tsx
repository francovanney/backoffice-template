import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react";
import { FileUploader } from "react-drag-drop-files";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { Checkbox } from "@/components/ui/checkbox";
import Spinner from "@/components/ui/Spinner";

import { useModal } from "@/hooks/useModal";
import { useQueryClient } from "@tanstack/react-query";
import { BANNERS_KEY } from "@/const/queryKeys";

import { useCreateBannerMutation } from "@/services/useCreateBannerMutation";
import { bannerModalSchema } from "@/schemas/bannerModalSchema";

export default function NewBannerModal() {
  const { close } = useModal();
  const fileTypes = ["JPG", "JPEG", "PNG"];
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(bannerModalSchema),
    defaultValues: {
      banner_name: "",
      banner_url: "",
      banner_order: 0,
      available: true,
      image_url: "", // solo para mostrar error debajo del uploader
    },
  });

  const handleChange = (uploadedFile: File | File[]) => {
    const singleFile = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;

    if (singleFile.size > 1048576) {
      toast.error("El archivo es demasiado grande. Máximo 1MB.");
      setError("image_url", { type: "manual", message: "El archivo es demasiado grande" });
      setFile(null);
    } else {
      setFile(singleFile);
      clearErrors("image_url");
      toast.success("Imagen cargada correctamente");
    }
  };

  type BannerFormData = {
    banner_name: string;
    banner_url?: string;
    banner_order?: number;
    available?: boolean;
    image_url?: string; // solo para mensajes de error en el form
  };

  const createBannerMutation = useCreateBannerMutation();
  const queryClient = useQueryClient();

  const onSubmit = (data: BannerFormData) => {
    // El backend exige SIEMPRE un archivo 'image'
    if (!file) {
      setError("image_url", { type: "manual", message: "La imagen es obligatoria" });
      return;
    }

    const formData = new FormData();
    formData.append("banner_name", data.banner_name);
    if (data.banner_url !== undefined) formData.append("banner_url", data.banner_url);
    if (typeof data.banner_order === "number") formData.append("banner_order", String(data.banner_order));
    if (typeof data.available === "boolean") formData.append("available", String(data.available));
    formData.append("image", file); // << el backend espera 'image'

    createBannerMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Banner creado correctamente");
        queryClient.invalidateQueries({ queryKey: [BANNERS_KEY] });
        close();
      },
      onError: () => {
        toast.error("Error al guardar el banner");
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
          <div className="absolute left-0 top-0 h-full w-[0.5px] bg-gray-200 rounded-r" style={{ zIndex: 3 }} />
          <div className="flex flex-col h-full overflow-y-auto relative">
            <div className="bg-background px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Nuevo Banner</h2>
              <X className="ml-4 font-bold cursor-pointer" onClick={close} aria-label="Cerrar" />
            </div>
            <hr className="border-t border-gray-200" />

            <div className="p-6 pt-4">
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} id="banner-form">
                <FormInput
                  label="Nombre"
                  type="text"
                  register={register("banner_name")}
                  error={errors.banner_name?.message}
                />

                <FormInput
                  label="URL (opcional)"
                  type="text"
                  placeholder="www.tu-sitio.com/promo"
                  register={register("banner_url")}
                  error={errors.banner_url?.message}
                />

                <FormInput
                  label="Orden"
                  type="number"
                  placeholder="0"
                  register={register("banner_order", { valueAsNumber: true })}
                  error={errors.banner_order?.message}
                />

                <div className="space-y-2">
                  <label className="font-medium leading-none">Disponible</label>
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="available"
                      control={control}
                      render={({ field }) => (
                        <Checkbox checked={!!field.value} onCheckedChange={field.onChange} id="available" />
                      )}
                    />
                    <label htmlFor="available" className="text-sm font-medium cursor-pointer">
                      Marcar como disponible
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
                      label="Arrastrá o subí una imagen"
                      hoverTitle="Soltá aquí"
                    />
                    {file && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Archivo seleccionado: {file.name}</p>
                        <div className="mt-2 relative w-full h-32 border rounded-md overflow-hidden">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Vista previa"
                            className="object-contain w-full h-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </FormInput>

                <div className="flex justify-end pt-2">
                  <Button className="w-full mt-2" type="submit" disabled={createBannerMutation.isPending}>
                    {createBannerMutation.isPending ? (
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
        </aside>
      </div>
    </div>
  );
}
