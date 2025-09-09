import { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react";
import { FileUploader } from "react-drag-drop-files";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { Checkbox } from "@/components/ui/checkbox";
import Spinner from "./ui/Spinner";

import { useModal } from "@/hooks/useModal";
import { useQueryClient } from "@tanstack/react-query";
import { BANNERS_KEY } from "@/const/queryKeys";

import { useUpdateBannerMutation } from "@/services/useUpdateBannerMutation";
// Si ya tenés un schema, cambialo acá:
import { EditBannerModalSchema } from "@/schemas/bannerEditModalSchema";

export type Banner = {
  id: number;
  image_url: string | null;
  banner_name: string;
  banner_url: string | null;
  banner_order: number | null;
  available: boolean;
  created_at: string | null;
  updated_at: string | null;
};

interface EditBannerModalProps {
  banner: Banner;
}

export default function EditBannerModal({ banner }: EditBannerModalProps) {
  const { close } = useModal();
  const fileTypes = ["JPG", "JPEG", "PNG"];
  const [file, setFile] = useState<File | null>(null);

  const initialValues = {
    banner_name: banner.banner_name,
    banner_url: banner.banner_url ?? "",
    banner_order: banner.banner_order ?? 0,
    available: !!banner.available,
    image_url: banner.image_url ?? "",
  };

  type BannerFormData = {
    banner_name: string;
    banner_url?: string;      // opcional (puede ir vacío -> se transforma en NULL en el backend)
    banner_order?: number;    // number
    available?: boolean;      // boolean
    image_url?: string;       // solo para vista previa
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<BannerFormData>({
    resolver: yupResolver(EditBannerModalSchema),
    defaultValues: initialValues,
  });

  const watchedValues = useWatch({ control });

  const hasChanges = () => {
    const base = {
      banner_name: initialValues.banner_name,
      banner_url: initialValues.banner_url,
      banner_order: initialValues.banner_order,
      available: initialValues.available,
    };
    const current = {
      banner_name: watchedValues.banner_name,
      banner_url: watchedValues.banner_url,
      banner_order: watchedValues.banner_order,
      available: watchedValues.available,
    };
    const hasFormChanges = JSON.stringify(base) !== JSON.stringify(current);
    const hasFileChange = file !== null;
    return hasFormChanges || hasFileChange;
  };

  const handleChange = (uploadedFile: File | File[]) => {
    const singleFile = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;

    if (singleFile.size > 1048576) {
      toast.error("El archivo es demasiado grande. Máximo 1MB.");
      setFile(null);
    } else {
      setFile(singleFile);
      toast.success("Imagen cargada correctamente");
    }
  };

  const updateBannerMutation = useUpdateBannerMutation();
  const queryClient = useQueryClient();

  const onSubmit = (data: BannerFormData) => {
    const formData = new FormData();
    formData.append("banner_name", data.banner_name);
    // Si viene vacío, el backend lo normaliza a NULL
    if (data.banner_url !== undefined) formData.append("banner_url", data.banner_url ?? "");
    if (typeof data.banner_order === "number") formData.append("banner_order", String(data.banner_order));
    if (typeof data.available === "boolean") formData.append("available", String(data.available));
    if (file) formData.append("image", file); // << importante: el backend espera 'image'

    updateBannerMutation.mutate(
      { id: banner.id, data: formData },
      {
        onSuccess: () => {
          toast.success("Banner editado correctamente");
          queryClient.invalidateQueries({ queryKey: [BANNERS_KEY] });
          close();
        },
        onError: () => {
          toast.error("Error al editar el banner");
        },
      }
    );
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
              <h2 className="text-lg font-bold">Editar banner</h2>
              <X className="ml-4 font-bold cursor-pointer" onClick={close} aria-label="Cerrar" />
            </div>

            <div className="p-6 pt-4">
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} id="banner-edit-form">
                <FormInput
                  label="Nombre"
                  type="text"
                  register={register("banner_name")}
                  error={errors.banner_name?.message}
                />

                <FormInput
                  label="Link opcional"
                  type="text"
                  register={register("banner_url")}
                  error={errors.banner_url?.message}
                  placeholder="www.tu-sitio.com/promo"
                />

                <FormInput
                  label="Orden"
                  type="number"
                  register={register("banner_order", { valueAsNumber: true })}
                  error={errors.banner_order?.message}
                  placeholder="0"
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

                <FormInput label="Imagen">
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
                        <p className="text-sm text-gray-500">Archivo: {file.name}</p>
                        <div className="mt-2 relative w-full h-32 border rounded-md overflow-hidden">
                          <img src={URL.createObjectURL(file)} alt="Vista previa" className="object-contain w-full h-full" />
                        </div>
                      </div>
                    )}

                    {!file && banner?.image_url && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Imagen actual:</p>
                        <div className="mt-2 relative w-full h-32 border rounded-md overflow-hidden">
                          <img src={banner.image_url} alt="Imagen actual" className="object-contain w-full h-full" />
                        </div>
                      </div>
                    )}
                  </div>
                </FormInput>

                <div className="flex justify-end pt-2">
                  <Button className="w-full mt-2" type="submit" disabled={updateBannerMutation.isPending || !hasChanges()}>
                    {updateBannerMutation.isPending ? (
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
