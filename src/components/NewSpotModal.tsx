import { useForm } from "react-hook-form";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import Spinner from "@/components/ui/Spinner";

import { useModal } from "@/hooks/useModal";

interface NewSpotModalProps {
  seccionId: number;
}

type SpotFormData = {
  nombre: string;
  direccion: string;
  link_direccion: string;
  telefono: string;
  logo_url: string;
  descripcion: string;
  instagram: string;
};

export default function NewSpotModal({ seccionId }: NewSpotModalProps) {
  const { close } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SpotFormData>({
    defaultValues: {
      nombre: "",
      direccion: "",
      link_direccion: "",
      telefono: "",
      logo_url: "",
      descripcion: "",
      instagram: "",
    },
  });

  const onSubmit = (data: SpotFormData) => {
    console.log("Datos del nuevo spot:", {
      ...data,
      seccion_id: seccionId,
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
          <div
            className="absolute left-0 top-0 h-full w-[0.5px] bg-gray-200 rounded-r"
            style={{ zIndex: 3 }}
          />
          <div className="flex flex-col h-full overflow-y-auto relative">
            <div className="bg-background px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Nuevo Comercio</h2>
              <X
                className="ml-4 font-bold cursor-pointer"
                onClick={close}
                aria-label="Cerrar"
              />
            </div>
            <hr className=" border-t border-gray-200" />
            <div className="p-6 pt-4">
              <form
                className="space-y-4"
                onSubmit={handleSubmit(onSubmit)}
                id="spot-form"
              >
                <FormInput
                  label="Nombre *"
                  type="text"
                  register={register("nombre")}
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
                  label="Link Dirección"
                  type="text"
                  register={register("link_direccion")}
                  error={errors.link_direccion?.message}
                  placeholder="Ingrese el enlace de la dirección"
                />

                <FormInput
                  label="Teléfono"
                  type="text"
                  register={register("telefono")}
                  error={errors.telefono?.message}
                  placeholder="Ingrese el número de teléfono"
                />

                <FormInput
                  label="Logo (URL)"
                  type="text"
                  register={register("logo_url")}
                  error={errors.logo_url?.message}
                  placeholder="Ingrese la URL del logo"
                />

                <FormInput
                  label="Descripción"
                  type="text"
                  register={register("descripcion")}
                  error={errors.descripcion?.message}
                  placeholder="Ingrese la descripción"
                />

                <FormInput
                  label="Instagram"
                  type="text"
                  register={register("instagram")}
                  error={errors.instagram?.message}
                  placeholder="Ingrese el Instagram (ej: @usuario)"
                />

                <div className="flex justify-end pt-2">
                  <Button
                    className="w-full mt-2"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
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
        </aside>
      </div>
    </div>
  );
}
