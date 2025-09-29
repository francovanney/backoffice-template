import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { ChevronDown, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

import { useInfoQuery } from "@/services/useInfoQuery";
import { useUpdateInfoMutation } from "@/services/useUpdateInfoMutation";
import EditorField from "@/components/EditorField";

type FormFields = {
  id?: number;
  como_llegar: string;
  numeros_utiles: string;
  atractivos: string;
  transporte: string;
};

export default function InfoBackoffice() {
  const { data, isLoading, error } = useInfoQuery();
  const { mutateAsync, isPending } = useUpdateInfoMutation();

  const { control, handleSubmit, reset, watch } = useForm<FormFields>({
    defaultValues: {
      como_llegar: "",
      numeros_utiles: "",
      atractivos: "",
      transporte: "",
    },
  });

  // para comparar cambios
  const [originalValues, setOriginalValues] = useState<FormFields>({
    como_llegar: "",
    numeros_utiles: "",
    atractivos: "",
    transporte: "",
  });

  useEffect(() => {
    if (data) {
      const next = {
        como_llegar: data.como_llegar ?? "",
        numeros_utiles: data.numeros_utiles ?? "",
        atractivos: data.atractivos ?? "",
        transporte: data.transporte ?? "",
      };
      reset(next);
      setOriginalValues(next);
    }
  }, [data, reset]);

  const watched = watch();

  const hasChanges = useMemo(() => {
    return (
      watched.como_llegar !== originalValues.como_llegar ||
      watched.numeros_utiles !== originalValues.numeros_utiles ||
      watched.atractivos !== originalValues.atractivos ||
      watched.transporte !== originalValues.transporte
    );
  }, [watched, originalValues]);

  const [open, setOpen] = useState<Record<string, boolean>>({
    "como-llegar": false,
    "numeros-utiles": false,
    "atractivos-turisticos": false,
    "transporte-local": false,
  });
  const toggle = (k: string) => setOpen((p) => ({ ...p, [k]: !p[k] }));

  const onSubmit = async (values: FormFields) => {
    try {
      await mutateAsync({ data: values }); // si tu mutation recibe { data }
      // await mutateAsync(values);        // usa esta si tu mutation recibe el body directo

      setOriginalValues(values);
      toast.success("Información actualizada exitosamente");
    } catch {
      toast.error("Error al actualizar la información");
    }
  };

  return (
    <main className="mt-5 mx-4 sm:ml-5 max-w-5xl">
      <div className="w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-5">Info Útil</h1>

        {isLoading && <p>Cargando...</p>}
        {error && <p className="text-red-500">No se pudo cargar la información.</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Cómo llegar */}
          <div className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4">
              <button
                type="button"
                onClick={() => toggle("como-llegar")}
                className="text-left flex-1 flex items-center gap-2 hover:bg-gray-50 rounded p-2 transition-colors"
                aria-expanded={open["como-llegar"]}
                aria-controls="panel-como-llegar"
              >
                {open["como-llegar"] ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                <h2 className="text-xl font-semibold text-gray-900">Cómo llegar</h2>
              </button>
            </div>

            {open["como-llegar"] && (
              <div id="panel-como-llegar" className="px-4 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <EditorField control={control} name="como_llegar"/>
                <div className="border rounded-lg p-3 bg-gray-50">
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: watched.como_llegar || "" }}
                />
                </div>
              </div>
            )}
          </div>

          {/* Números útiles */}
          <div className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4">
              <button
                type="button"
                onClick={() => toggle("numeros-utiles")}
                className="text-left flex-1 flex items-center gap-2 hover:bg-gray-50 rounded p-2 transition-colors"
                aria-expanded={open["numeros-utiles"]}
                aria-controls="panel-numeros-utiles"
              >
                {open["numeros-utiles"] ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                <h2 className="text-xl font-semibold text-gray-900">Números útiles</h2>
              </button>
            </div>

            {open["numeros-utiles"] && (
              <div id="panel-numeros-utiles" className="px-4 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <EditorField control={control} name="numeros_utiles"/>
                <div className="border rounded-lg p-3 bg-gray-50">
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: watched.numeros_utiles || "" }}
                />
                </div>
              </div>
            )}
          </div>

          {/* Atractivos turísticos */}
          <div className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4">
              <button
                type="button"
                onClick={() => toggle("atractivos-turisticos")}
                className="text-left flex-1 flex items-center gap-2 hover:bg-gray-50 rounded p-2 transition-colors"
                aria-expanded={open["atractivos-turisticos"]}
                aria-controls="panel-atractivos"
              >
                {open["atractivos-turisticos"] ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                <h2 className="text-xl font-semibold text-gray-900">Atractivos turísticos</h2>
              </button>
            </div>

            {open["atractivos-turisticos"] && (
              <div id="panel-atractivos" className="px-4 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <EditorField control={control} name="atractivos"/>
                <div className="border rounded-lg p-3 bg-gray-50">
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: watched.atractivos || "" }}
                />
                </div>
              </div>
            )}
          </div>

          {/* Transporte local */}
          <div className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4">
              <button
                type="button"
                onClick={() => toggle("transporte-local")}
                className="text-left flex-1 flex items-center gap-2 hover:bg-gray-50 rounded p-2 transition-colors"
                aria-expanded={open["transporte-local"]}
                aria-controls="panel-transporte"
              >
                {open["transporte-local"] ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                <h2 className="text-xl font-semibold text-gray-900">Transporte local</h2>
              </button>
            </div>

            {open["transporte-local"] && (
              <div id="panel-transporte" className="px-4 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <EditorField control={control} name="transporte"/>
                <div className="border rounded-lg p-3 bg-gray-50">
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: watched.transporte || "" }}
                />
                </div>
              </div>
            )}
          </div>

          {/* Botón guardar estilo Config */}
          <div className="mt-6 mb-10">
            <Button
              type="submit"
              className="w-full sm:w-auto mb-10"
              disabled={!hasChanges || isPending || isLoading}
            >
              {isPending ? "Guardando..." : "Guardar Información"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
