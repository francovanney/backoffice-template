import * as yup from "yup";

export interface SettingsFormData {
  title: string;
  description: string;
  email: string;
  instagram: string;
  telephone: string;
}

export const settingsSchema = yup.object().shape({
  title: yup
    .string()
    .required("El título es obligatorio")
    .min(2, "El título debe tener al menos 2 caracteres"),
  description: yup
    .string()
    .required("La descripción es obligatoria")
    .min(5, "La descripción debe tener al menos 5 caracteres"),
  email: yup
    .string()
    .required("El email es obligatorio")
    .email("Debe ser un email válido"),
  instagram: yup
    .string()
    .required("El Instagram es obligatorio")
    .min(2, "El Instagram debe tener al menos 2 caracteres"),
  telephone: yup
    .string()
    .required("El teléfono es obligatorio")
    .min(8, "El teléfono debe tener al menos 8 caracteres"),
});
