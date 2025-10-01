import { useState, useEffect, useMemo, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SliderPicker } from "react-color";
import { ChevronDown, ChevronUp, ChevronRight, X } from "lucide-react";
import { FileUploader } from "react-drag-drop-files";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useColorsQuery } from "@/services/useColorsQuery";
import { useUpdateColorsMutation } from "@/services/useUpdateColorsMutation";
import { useSettingsQuery } from "@/services/useSettingsQuery";
import { useUpdateSettingsMutation } from "@/services/useUpdateSettingsMutation";
import { useBrandingQuery } from "@/services/useBrandingQuery";
import { useUpdateBrandingMutation } from "@/services/useUpdateBrandingMutation";
import { ConfigFormData } from "@/schemas/colorSchema";
import { SettingsFormData } from "@/schemas/settingsSchema";
import { COLORS_KEY, SETTINGS_KEY, BRANDING_KEY } from "@/const/queryKeys";
import LogoPampa from "@/assets/logoPampa.svg";

interface CombinedFormData extends ConfigFormData, SettingsFormData {}

const combinedSchema = yup.object().shape({
  title: yup.string().required("El título es requerido"),
  description: yup.string().required("La descripción es requerida"),
  email: yup
    .string()
    .email("Debe ser un email válido")
    .required("El email es requerido"),
  instagram: yup.string().required("El Instagram es requerido"),
  telephone: yup.string().required("El teléfono es requerido"),
  general: yup
    .string()
    .matches(/^#[0-9A-F]{6}$/i, "Debe ser un color válido en formato hexadecimal")
    .required("El color es requerido"),
  primary: yup
    .string()
    .matches(/^#[0-9A-F]{6}$/i, "Debe ser un color válido en formato hexadecimal")
    .required("El color es requerido"),
  background: yup
    .string()
    .matches(/^#[0-9A-F]{6}$/i, "Debe ser un color válido en formato hexadecimal")
    .required("El color es requerido"),
});

const Config = () => {
  const [showManualPrimary, setShowManualPrimary] = useState(false);
  const [showManualBackground, setShowManualBackground] = useState(false);
  const [showManualGeneral, setShowManualGeneral] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [isAparienciaOpen, setIsAparienciaOpen] = useState(true);
  const [isTitulosOpen, setIsTitulosOpen] = useState(false);
  const fileTypes = ["JPG", "JPEG", "PNG"];

  const { data: colorsData, isLoading } = useColorsQuery();
  const { data: settingsData, isLoading: isSettingsLoading } = useSettingsQuery();
  const { data: brandingData, isLoading: isBrandingLoading } = useBrandingQuery();

  const updateColorsMutation = useUpdateColorsMutation();
  const updateSettingsMutation = useUpdateSettingsMutation();
  const updateBrandingMutation = useUpdateBrandingMutation();
  const queryClient = useQueryClient();

  const DEFAULT_GENERAL = "#e6c3b3";
  const DEFAULT_PRIMARY = "#e6c3b3";
  const DEFAULT_BACKGROUND = "#FFFFFF";

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CombinedFormData>({
    resolver: yupResolver(combinedSchema),
    defaultValues: {
      general: DEFAULT_GENERAL,
      primary: DEFAULT_PRIMARY,
      background: DEFAULT_BACKGROUND,
      title: "",
      description: "",
      email: "",
      instagram: "",
      telephone: "",
    },
  });

  const [originalValues, setOriginalValues] = useState<CombinedFormData>({
    general: DEFAULT_GENERAL,
    primary: DEFAULT_PRIMARY,
    background: DEFAULT_BACKGROUND,
    title: "",
    description: "",
    email: "",
    instagram: "",
    telephone: "",
  });

  const withHash = (v?: string) => (v ? (v.startsWith("#") ? v : `#${v}`) : "");
  // Si tu API requiere "general" sin '#', podés usar:
  // const stripHash = (v: string) => v.replace(/^#/, "");

  useEffect(() => {
    if (!colorsData) return;

    // El backend a veces puede devolver "general" sin '#'
    const apiGeneral = withHash(colorsData.general || DEFAULT_GENERAL);
    const apiPrimary = withHash(colorsData.primary || DEFAULT_PRIMARY);
    const apiBackground = withHash(colorsData.background || DEFAULT_BACKGROUND);

    setValue("general", apiGeneral);
    setValue("primary", apiPrimary);
    setValue("background", apiBackground);

    setOriginalValues((prev) => ({
      ...prev,
      general: apiGeneral,
      primary: apiPrimary,
      background: apiBackground,
    }));
  }, [colorsData, setValue]);

  useEffect(() => {
    if (!settingsData) return;

    const newValues = {
      title: settingsData.title,
      description: settingsData.description,
      email: settingsData.email,
      instagram: settingsData.instagram,
      telephone: settingsData.telephone,
    };

    setValue("title", newValues.title);
    setValue("description", newValues.description);
    setValue("email", newValues.email);
    setValue("instagram", newValues.instagram);
    setValue("telephone", newValues.telephone);

    setOriginalValues((prev) => ({ ...prev, ...newValues }));
  }, [settingsData, setValue]);

  const previewGeneral = watch("general");
  const previewPrimary = watch("primary");
  const previewBackground = watch("background");

  const watchedValues = watch();

  const hasChanges = useMemo(() => {
    const hasNewFiles = logoFile !== null || bannerFile !== null || iconFile !== null;

    return (
      watchedValues.primary !== originalValues.primary ||
      watchedValues.general !== originalValues.general ||
      watchedValues.background !== originalValues.background ||
      watchedValues.title !== originalValues.title ||
      watchedValues.description !== originalValues.description ||
      watchedValues.email !== originalValues.email ||
      watchedValues.instagram !== originalValues.instagram ||
      watchedValues.telephone !== originalValues.telephone ||
      hasNewFiles
    );
  }, [watchedValues, originalValues, logoFile, bannerFile, iconFile]);

  const onSubmit = (data: CombinedFormData) => {
    const colorPromise = updateColorsMutation.mutateAsync({
      data: {
        primary: data.primary,
        background: data.background,
        // Si tu API quiere 'general' sin '#', usá: general: stripHash(data.general),
        general: data.general,
      },
    });

    const settingsPayload = {
      title: data.title,
      description: data.description,
      email: data.email,
      instagram: data.instagram,
      telephone: data.telephone,
    };

    const settingsPromise = updateSettingsMutation.mutateAsync({
      data: settingsPayload,
    });

    let brandingPromise = Promise.resolve();
    if (logoFile || bannerFile || iconFile) {
      const formData = new FormData();
      if (logoFile) formData.append("logo", logoFile);
      if (bannerFile) formData.append("banner", bannerFile);
      if (iconFile) formData.append("icon", iconFile);
      brandingPromise = updateBrandingMutation.mutateAsync({ data: formData });
    }

    Promise.all([colorPromise, settingsPromise, brandingPromise])
      .then(() => {
        queryClient.invalidateQueries({ queryKey: [COLORS_KEY] });
        queryClient.invalidateQueries({ queryKey: [SETTINGS_KEY] });
        queryClient.invalidateQueries({ queryKey: [BRANDING_KEY] });

        setOriginalValues({
          primary: data.primary,
          general: data.general,
          background: data.background,
          title: data.title,
          description: data.description,
          email: data.email,
          instagram: data.instagram,
          telephone: data.telephone,
        });

        setLogoFile(null);
        setBannerFile(null);
        setIconFile(null);

        toast.success("Configuración actualizada exitosamente");
      })
      .catch(() => {
        toast.error("Error al actualizar la configuración");
      });
  };

  // ================= Handlers por campo =================
  const handlePicker =
    (field: "general" | "primary" | "background") =>
    (color: { hex: string }) => {
      setValue(field, color.hex);
    };

  const handleHexInput =
    (field: "general" | "primary" | "background") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let v = e.target.value;
      if (!v.startsWith("#")) v = "#" + v.replace("#", "");
      setValue(field, v);
    };

  const clearField = (field: "general" | "primary" | "background") => {
    if (field === "general") {
      setValue("general", withHash(colorsData?.general || DEFAULT_GENERAL));
    } else if (field === "primary") {
      setValue("primary", withHash(colorsData?.primary || DEFAULT_PRIMARY));
    } else {
      setValue("background", withHash(colorsData?.background || DEFAULT_BACKGROUND));
    }
  };

  // ======================================================

  const handleLogoChange = (uploadedFile: File | File[]) => {
    const singleFile = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
    if (singleFile.size > 1048576) {
      toast.error("El archivo es demasiado grande. El tamaño máximo permitido es 1MB.");
      setLogoFile(null);
    } else {
      setLogoFile(singleFile);
      toast.success("Logo cargado correctamente");
    }
  };

  const handleBannerChange = (uploadedFile: File | File[]) => {
    const singleFile = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
    if (singleFile.size > 1048576) {
      toast.error("El archivo es demasiado grande. El tamaño máximo permitido es 1MB.");
      setBannerFile(null);
    } else {
      setBannerFile(singleFile);
      toast.success("Banner cargado correctamente");
    }
  };

  const handleIconChange = (uploadedFile: File | File[]) => {
    const singleFile = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
    if (singleFile.size > 1048576) {
      toast.error("El archivo es demasiado grande. El tamaño máximo permitido es 1MB.");
      setIconFile(null);
    } else {
      setIconFile(singleFile);
      toast.success("Ícono cargado correctamente");
    }
  };

  const imgPlaceholder = LogoPampa;

  const getDisplayLogo = useCallback(() => {
    if (logoFile) return URL.createObjectURL(logoFile);
    if (brandingData?.logo_url) return brandingData.logo_url;
    return imgPlaceholder;
  }, [logoFile, brandingData, imgPlaceholder]);

    const ColorDot = ({ color }: { color: string }) => (
    <span
        className="inline-block w-4 h-4 rounded-full border border-gray-300"
        style={{ backgroundColor: color }}
        aria-label={`Color ${color}`}
        title={color}
    />
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="overflow-x-hidden">
      <main className="mt-5 mx-4 sm:ml-5 max-w-full">
        <div className="w-full max-w-none">
          <h1 className="text-2xl sm:text-3xl font-bold mb-5">Configuración</h1>

          {isLoading || isSettingsLoading || isBrandingLoading ? (
            <div className="space-y-4 mt-10">
              <div className="border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
                <div className="px-4 pb-4 space-y-6">
                  <Skeleton className="h-16 sm:h-18 w-full rounded" />
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-[60px] w-[150px] rounded" />
                    <Skeleton className="h-10 w-32 rounded" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-28" />
                    <div className="w-full overflow-hidden">
                      <div className="w-full">
                        <div className="relative h-3 w-full rounded bg-gradient-to-r from-red-500 to-purple-500 opacity-30">
                          <Skeleton className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-white" />
                        </div>
                        <div className="mt-2 relative h-3 w-full rounded bg-gradient-to-r from-gray-200 to-gray-400 opacity-30">
                          <Skeleton className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-white" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg mt-4">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
                <div className="px-4 pb-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>

              <div className="mt-6 mb-10">
                <Skeleton className="h-10 w-32 rounded" />
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4 mt-10">
                <div className="border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between p-4">
                    <button
                      type="button"
                      onClick={() => setIsAparienciaOpen(!isAparienciaOpen)}
                      className="text-left flex-1 flex items-center gap-2 hover:bg-gray-50 rounded p-2 transition-colors"
                    >
                      {isAparienciaOpen ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                      <h2 className="text-xl font-semibold text-gray-900">
                        Apariencia
                      </h2>
                    </button>
                  </div>

                  {isAparienciaOpen && (
                    <div className="px-4 pb-4 space-y-8 mb-6">
                      <span className="text-xs text-gray-600 block">
                        Personaliza los colores, el logo, banner e ícono que se mostrarán en tu aplicación.
                      </span>

                      {/* GENERAL */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium">Color General</h3>
                            <ColorDot color={previewGeneral} />
                        </div>
                        <div className="w-full overflow-hidden max-w-2xl">
                          <Controller
                            name="general"
                            control={control}
                            render={({ field }) => (
                              <div className="w-full overflow-hidden">
                                <div className="max-w-full">
                                  <SliderPicker color={field.value} onChange={handlePicker("general")} />
                                </div>
                              </div>
                            )}
                          />
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => setShowManualGeneral(!showManualGeneral)}
                              className="flex items-center gap-2 font-semibold text-sm text-gray-700 hover:text-gray-900 transition-colors"
                            >
                              <span className="text-lg my-2">Ingresar código manualmente</span>
                              {showManualGeneral ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {showManualGeneral && (
                              <div className="mt-2">
                                <div className="relative inline-block w-full sm:max-w-32">
                                  <Controller
                                    name="general"
                                    control={control}
                                    render={({ field }) => (
                                      <FormInput
                                        {...field}
                                        onChange={handleHexInput("general")}
                                        maxLength={7}
                                        placeholder="#FFA2A3"
                                        className="bg-slate-200 rounded-md p-2 font-semibold w-full pr-8"
                                      />
                                    )}
                                  />
                                  {watch("general") !== (withHash(colorsData?.general) || DEFAULT_GENERAL) && (
                                    <button
                                      type="button"
                                      onClick={() => clearField("general")}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                      aria-label="Limpiar color general"
                                    >
                                      <X size={14} />
                                    </button>
                                  )}
                                </div>
                                {errors.general && (
                                  <p className="text-red-500 text-sm mt-1 break-words">{errors.general.message}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <hr className="my-2 border-gray-300" />

                      {/* BACKGROUND */}
                      <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium">Color de Fondo (Background)</h3>
                            <ColorDot color={previewBackground} />
                          </div>                        
                          <div className="w-full overflow-hidden max-w-2xl">
                          <Controller
                            name="background"
                            control={control}
                            render={({ field }) => (
                              <div className="w-full overflow-hidden">
                                <div className="max-w-full">
                                  <SliderPicker color={field.value} onChange={handlePicker("background")} />
                                </div>
                              </div>
                            )}
                          />

                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => setShowManualBackground(!showManualBackground)}
                              className="flex items-center gap-2 font-semibold text-sm text-gray-700 hover:text-gray-900 transition-colors"
                            >
                              <span className="text-lg my-2">Ingresar código manualmente</span>
                              {showManualBackground ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {showManualBackground && (
                              <div className="mt-2">
                                <div className="relative inline-block w-full sm:max-w-32">
                                  <Controller
                                    name="background"
                                    control={control}
                                    render={({ field }) => (
                                      <FormInput
                                        {...field}
                                        onChange={handleHexInput("background")}
                                        maxLength={7}
                                        placeholder="#FFFFFF"
                                        className="bg-slate-200 rounded-md p-2 font-semibold w-full pr-8"
                                      />
                                    )}
                                  />
                                  {watch("background") !== (withHash(colorsData?.background) || DEFAULT_BACKGROUND) && (
                                    <button
                                      type="button"
                                      onClick={() => clearField("background")}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                      aria-label="Limpiar color background"
                                    >
                                      <X size={14} />
                                    </button>
                                  )}
                                </div>
                                {errors.background && (
                                  <p className="text-red-500 text-sm mt-1 break-words">
                                    {errors.background.message}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <hr className="my-4 border-gray-300" />

                      {/* PRIMARY */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium">Color Primario</h3>
                            <ColorDot color={previewPrimary} />
                        </div>  
                        <div className="w-full overflow-hidden max-w-2xl">
                          <Controller
                            name="primary"
                            control={control}
                            render={({ field }) => (
                              <div className="w-full overflow-hidden">
                                <div className="max-w-full">
                                  <SliderPicker color={field.value} onChange={handlePicker("primary")} />
                                </div>
                              </div>
                            )}
                          />

                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => setShowManualPrimary(!showManualPrimary)}
                              className="flex items-center gap-2 font-semibold text-sm text-gray-700 hover:text-gray-900 transition-colors"
                            >
                              <span className="text-lg my-2">Ingresar código manualmente</span>
                              {showManualPrimary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {showManualPrimary && (
                              <div className="mt-2">
                                <div className="relative inline-block w-full sm:max-w-32">
                                  <Controller
                                    name="primary"
                                    control={control}
                                    render={({ field }) => (
                                      <FormInput
                                        {...field}
                                        onChange={handleHexInput("primary")}
                                        maxLength={7}
                                        placeholder="#000000"
                                        className="bg-slate-200 rounded-md p-2 font-semibold w-full pr-8"
                                      />
                                    )}
                                  />
                                  {watch("primary") !== (withHash(colorsData?.primary) || DEFAULT_PRIMARY) && (
                                    <button
                                      type="button"
                                      onClick={() => clearField("primary")}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                      aria-label="Limpiar color primary"
                                    >
                                      <X size={14} />
                                    </button>
                                  )}
                                </div>
                                {errors.primary && (
                                  <p className="text-red-500 text-sm mt-1 break-words">{errors.primary.message}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <hr className="my-2 border-gray-300" />

                      {/* PREVIEW */}
                      <div
                        className="w-full max-w-2xl rounded-md p-2 border"
                        style={{ backgroundColor: previewBackground }}
                      >
                        <div
                          className="w-full h-16 sm:h-18 flex items-center justify-start px-2 sm:px-0 rounded"
                          style={{ backgroundColor: previewPrimary }}
                        >
                          <div className="flex-shrink-0 mx-1 sm:mr-4 w-24 h-8 flex items-center justify-center rounded">
                            <img
                              src={getDisplayLogo()}
                              alt="Preview"
                              className="max-w-full max-h-full object-contain ml-4"
                            />
                          </div>
                          <ul className="text-white text-xs sm:text-sm font-semibold flex gap-2 md:gap-5 overflow-hidden min-w-0 flex-1 ml-6 lg:ml-2">
                            <li className="whitespace-nowrap truncate flex-shrink-0">¿Dónde Salir?</li>
                            <li className="whitespace-nowrap truncate flex-shrink-0">¿Dónde Comer?</li>
                          </ul>
                        </div>
                      </div>

                      {/* BRANDING */}
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <h3 className="text-lg font-medium">Logo</h3>
                          <div className="space-y-3">
                            {logoFile && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">Archivo seleccionado: {logoFile.name}</p>
                                <div className="mt-2 relative w-full max-w-[150px] h-[60px] border rounded-md overflow-hidden">
                                  <img src={URL.createObjectURL(logoFile)} alt="Vista previa" className="object-contain w-full h-full" />
                                </div>
                              </div>
                            )}
                            {!logoFile && brandingData?.logo_url && (
                              <div className="mt-2">
                                <div className="mt-2 relative w-full max-w-[150px] h-[60px] border rounded-md overflow-hidden">
                                  <img src={brandingData.logo_url} alt="Logo actual" className="object-contain w-full h-full" />
                                </div>
                              </div>
                            )}
                            <div className="max-w-[150px]">
                              <FileUploader
                                handleChange={handleLogoChange}
                                name="logo"
                                types={fileTypes}
                                multiple={false}
                                label="Arrastre o suba un logo"
                                hoverTitle="Arrastre aquí"
                              />
                            </div>
                          </div>
                        </div>

                        <hr className="my-4 border-gray-300" />

                        <div className="space-y-3">
                          <h3 className="text-lg font-medium">Banner</h3>
                          <div className="space-y-3">
                            {bannerFile && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">Archivo seleccionado: {bannerFile.name}</p>
                                <div className="mt-2 relative w-full max-w-[300px] h-[120px] border rounded-md overflow-hidden">
                                  <img src={URL.createObjectURL(bannerFile)} alt="Vista previa banner" className="object-contain w-full h-full" />
                                </div>
                              </div>
                            )}
                            {!bannerFile && brandingData?.banner_url && (
                              <div className="mt-2">
                                <div className="mt-2 relative w-full max-w-[300px] h-[120px] border rounded-md overflow-hidden">
                                  <img src={brandingData.banner_url} alt="Banner actual" className="object-contain w-full h-full" />
                                </div>
                              </div>
                            )}
                            <div className="w-20">
                              <FileUploader
                                handleChange={handleBannerChange}
                                name="banner"
                                types={fileTypes}
                                multiple={false}
                                label="Arrastre o suba un banner"
                                hoverTitle="Arrastre aquí"
                              />
                            </div>
                          </div>
                        </div>

                        <hr className="my-4 border-gray-300" />

                        <div className="space-y-3">
                          <h3 className="text-lg font-medium">Ícono</h3>
                          <div className="space-y-3">
                            {iconFile && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">Archivo seleccionado: {iconFile.name}</p>
                                <div className="mt-2 relative w-full max-w-[60px] h-[60px] border rounded-md overflow-hidden">
                                  <img src={URL.createObjectURL(iconFile)} alt="Vista previa ícono" className="object-contain w-full h-full" />
                                </div>
                              </div>
                            )}
                            {!iconFile && brandingData?.icon_url && (
                              <div className="mt-2">
                                <div className="mt-2 relative w-full max-w-[60px] h-[60px] border rounded-md overflow-hidden">
                                  <img src={brandingData.icon_url} alt="Ícono actual" className="object-contain w-full h-full" />
                                </div>
                              </div>
                            )}
                            <div className="w-20">
                              <FileUploader
                                handleChange={handleIconChange}
                                name="icon"
                                types={fileTypes}
                                multiple={false}
                                label="Arrastre o suba un ícono"
                                hoverTitle="Arrastre aquí"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Información General */}
              <div className="space-y-4 mt-4">
                <div className="border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between p-4">
                    <button
                      type="button"
                      onClick={() => setIsTitulosOpen(!isTitulosOpen)}
                      className="text-left flex-1 flex items-center gap-2 hover:bg-gray-50 rounded p-2 transition-colors"
                    >
                      {isTitulosOpen ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                      <h2 className="text-xl font-semibold text-gray-900">Información General</h2>
                    </button>
                  </div>

                  {isTitulosOpen && (
                    <div className="px-4 pb-4 space-y-6">
                      <span className="text-xs text-gray-600 block">
                        Configura la información general de tu aplicación que se utilizará en metadatos, notificaciones y contacto con usuarios.
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Título</label>
                          <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                              <FormInput {...field} placeholder="Ingrese el título de la app" className="w-full" />
                            )}
                          />
                          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Descripción</label>
                          <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                              <FormInput {...field} placeholder="Ingrese la descripción de la app" className="w-full" />
                            )}
                          />
                          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Email</label>
                          <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                              <FormInput {...field} type="email" placeholder="Ingrese el email de contacto personal" className="w-full" />
                            )}
                          />
                          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Instagram</label>
                          <Controller
                            name="instagram"
                            control={control}
                            render={({ field }) => (
                              <FormInput {...field} placeholder="usuario123" span="https://instagram.com/" className="w-full" />
                            )}
                          />
                          {errors.instagram && <p className="text-red-500 text-sm">{errors.instagram.message}</p>}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">Teléfono</label>
                          <Controller
                            name="telephone"
                            control={control}
                            render={({ field }) => (
                              <FormInput {...field} placeholder="Ingrese el teléfono de contacto" className="w-full" />
                            )}
                          />
                          {errors.telephone && <p className="text-red-500 text-sm">{errors.telephone.message}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 mb-10">
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={
                    !hasChanges ||
                    updateColorsMutation.isPending ||
                    updateSettingsMutation.isPending ||
                    updateBrandingMutation.isPending ||
                    isLoading ||
                    isSettingsLoading ||
                    isBrandingLoading
                  }
                >
                  {updateColorsMutation.isPending ||
                  updateSettingsMutation.isPending ||
                  updateBrandingMutation.isPending
                    ? "Guardando..."
                    : "Guardar Configuración"}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </form>
  );
};

export default Config;
