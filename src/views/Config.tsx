import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SliderPicker } from "react-color";
import { ConfigFormData, colorSchema } from "@/schemas/colorSchema";
import { FormInput } from "@/components/ui/form-input";
import { ChevronDown, ChevronUp } from "lucide-react";

const Config = () => {
  const [showManualInput, setShowManualInput] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ConfigFormData>({
    resolver: yupResolver(colorSchema),
    defaultValues: {
      color: "#c2c2f2",
    },
  });

  const watchedColor = watch("color");

  const onSubmit = (data: ConfigFormData) => {
    console.log("Form data:", data);
  };

  const handleColorChange = (color: { hex: string }) => {
    setValue("color", color.hex);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (!value.startsWith("#")) {
      value = "#" + value.replace("#", "");
    }

    const hexValue = value.slice(1);

    const validHex = hexValue.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);

    const finalValue = "#" + validHex;

    setValue("color", finalValue);
  };

  const imgPlaceholder = "https://placehold.co/150x50/EEE/31343C";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="overflow-x-hidden">
      <main className="mt-5 mx-4 sm:ml-5 max-w-full">
        <div className="w-full max-w-none">
          <h1 className="text-2xl sm:text-3xl font-bold">Configuración</h1>
          <div className="mt-5"></div>
          <h2 className="text-lg sm:text-xl font-semibold mb-5">
            Elegí la apariencia de tu app
          </h2>
          <div className="flex items-center overflow-hidden w-full">
            <div
              className="w-full h-14 flex items-center justify-start px-2 sm:px-0 min-w-0"
              style={{ backgroundColor: watchedColor }}
            >
              <img
                src={imgPlaceholder}
                alt="Preview"
                className="flex-shrink-0 mx-2 sm:mr-4 w-6 h-3 sm:w-8 sm:h-4 md:w-auto md:h-auto"
              />
              <ul className="text-white text-xs sm:text-sm font-semibold flex gap-1 sm:gap-2 md:gap-5 overflow-hidden min-w-0">
                <li className="whitespace-nowrap truncate">¿Donde Salir?</li>
                <li className="whitespace-nowrap truncate hidden sm:block">
                  ¿Donde Comer?
                </li>
                <li className="whitespace-nowrap truncate hidden md:block">
                  ¿Donde Dormir?
                </li>
              </ul>
            </div>
          </div>
          <div className="space-y-5 mt-10">
            <h3 className="text-lg font-medium">Imagen</h3>
            <img
              src={imgPlaceholder}
              alt="Preview"
              className="w-[120px] sm:w-[150px] h-auto mt-2"
            />
            <Button type="button" size="sm" className="w-full sm:w-auto">
              Cargar Imagen
            </Button>
          </div>
          <div className="space-y-5 mt-10">
            <h3 className="text-lg font-medium">Color</h3>

            <div className="w-full overflow-hidden">
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <div className="w-full overflow-hidden">
                    <div className="max-w-full">
                      <SliderPicker
                        color={field.value}
                        onChange={handleColorChange}
                      />
                    </div>
                  </div>
                )}
              />

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowManualInput(!showManualInput)}
                  className="flex items-center gap-2 font-semibold text-sm text-gray-700 hover:text-gray-900 transition-colors w-full sm:w-auto justify-center sm:justify-start break-words"
                >
                  <span className="text-center sm:text-left">
                    Ingresar código de color manualmente
                  </span>
                  {showManualInput ? (
                    <ChevronUp size={16} className="flex-shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="flex-shrink-0" />
                  )}
                </button>

                {showManualInput && (
                  <div className="mt-2">
                    <Controller
                      name="color"
                      control={control}
                      render={({ field }) => (
                        <FormInput
                          {...field}
                          onChange={handleInputChange}
                          maxLength={7}
                          placeholder="#000000"
                          className="bg-slate-200 rounded-md p-2 font-semibold w-full sm:max-w-32"
                        />
                      )}
                    />
                    {errors.color && (
                      <p className="text-red-500 text-sm mt-1 break-words">
                        {errors.color.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              Guardar Cambios
            </Button>
          </div>
        </div>
      </main>
    </form>
  );
};

export default Config;
