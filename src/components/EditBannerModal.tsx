import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { FileUploader } from "react-drag-drop-files";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import Spinner from "@/components/ui/Spinner";

import { useModal } from "@/hooks/useModal";
import { useUpdateBannerMutation } from "@/services/useUpdateBannerMutation";
import { BANNERS_KEY } from "@/const/queryKeys";
import { Banner } from "@/services/types/banners";

interface EditBannerModalProps {
  banner: Banner | null;
}

type BannerFormData = {
  banner_name: string;
  banner_url?: string;
  banner_order?: number;
  available?: boolean;
  image_url?: string; 
};

export default function EditBannerModal({ banner }: EditBannerModalProps) {
  const { close } = useModal();
  const queryClient = useQueryClient();
  const updateBannerMutation = useUpdateBannerMutation();

  const fileTypes = ["JPG", "JPEG", "PNG"];
  const [file, setFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>("");

  const handleChange = (uploadedFile: File | File[]) => {
    const singleFile = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
    if (singleFile.size > 1048576) {
      toast.error("El archivo es demasiado grande. El tamaño máximo permitido es 1MB.");
      setImageError("El archivo es demasiado grande");
      setFile(null);
    } else {
      setFile(singleFile);
      setImageError("");
      toast.success("Imagen cargada correctamente");
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BannerFormData>({
    defaultValues: {
      banner_name: "",
      banner_url: "",
      banner_order: 0,
      available: false,
      image_url: "",
    },
  });

  useEffect(() => {
    if (banner) {
      reset({
        banner_name: banner.banner_name || "",
        banner_url: banner.banner_url || "",
        banner_order: banner.banner_order ?? 0,
        available: !!banner.available,
        image_url: banner.image_url || "",
      });
    }
  }, [banner, reset]);

  const onSubmit = async (data: BannerFormData) => {
    if (!banner?.id) {
      toast.error("Error: ID del banner no encontrado");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("banner_name", data.banner_name);

      if (data.banner_url !== undefined) formData.append("banner_url", data.banner_url ?? "");
      if (typeof data.banner_order === "number") formData.append("banner_order", String(data.banner_order));
      if (typeof data.available === "boolean") formData.append("available", String(data.available));

      if (file) formData.append("image", file); 

      await updateBannerMutation.mutateAsync({ id: banner.id, data: formData });

      toast.success("Banner editado correctamente");
      queryClient.invalidateQueries({ queryKey: [BANNERS_KEY] });
      close();
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error("Error al editar el banner");
    }
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
          <div className="absolute left-0 top-0 h-full w-[0.5px] bg-gray-200 rounded-r" style={{ zIndex: 3 }} />
          <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden relative">
            <div className="bg-background px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Editar banner</h2>
              <X className="ml-4 font-bold cursor-pointer" onClick={close} aria-label="Cerrar" />
            </div>
            <hr className="border-t border-gray-200" />
            <div className="p-6 pt-4 max-w-full min-w-0 overflow-x-hidden flex-1">
              <form
                className="space-y-4 w-full max-w-full min-w-0"
                onSubmit={handleSubmit(onSubmit)}
                id="banner-edit-form"
              >
                <FormInput
                  label="Nombre *"
                  type="text"
                  register={register("banner_name", {
                    required: "El nombre es requerido",
                    maxLength: { value: 255, message: "Máximo 255 caracteres" },
                  })}
                  error={errors.banner_name?.message}
                  placeholder="Nombre del banner"
                />

                <FormInput
                  label="Link opcional"
                  type="text"
                  register={register("banner_url", {
                    validate: (value) => {
                      if (!value) return true;
                      if (!value.includes("www")) return "Debe contener www";
                      return true;
                    },
                  })}
                  error={errors.banner_url?.message}
                  placeholder="www.tu-sitio.com/promo"
                />

                <FormInput
                  label="Orden"
                  type="number"
                  register={register("banner_order", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Debe ser ≥ 0" },
                  })}
                  error={errors.banner_order?.message}
                  placeholder="0"
                />

                {/* Disponible (checkbox nativo, como en el ejemplo simple) */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Disponible</label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" {...register("available")} className="h-4 w-4" />
                    <span className="text-sm">Marcar como disponible</span>
                  </label>
                </div>

                {/* Imagen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
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
                    {!file && banner?.image_url && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Imagen actual:</p>
                        <div className="mt-2 relative w-full h-32 border rounded-md overflow-hidden">
                          <img
                            src={banner.image_url}
                            alt="Imagen actual"
                            className="object-contain w-full h-full"
                          />
                        </div>
                      </div>
                    )}
                    {imageError && <p className="mt-1 text-sm text-red-600">{imageError}</p>}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button className="w-full mt-2" type="submit" disabled={updateBannerMutation.isPending}>
                    {updateBannerMutation.isPending ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="flex">
                          <Spinner />
                        </span>
                      </div>
                    ) : (
                      "Actualizar Banner"
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
