import * as yup from "yup";

export const colorSchema = yup.object({
  color: yup
    .string()
    .required("El color es requerido")
    .matches(
      /^#[0-9A-Fa-f]{6}$/,
      "El color debe ser un código hexadecimal válido (ej: #FF0000)"
    ),
});

export type ConfigFormData = {
  color: string;
};
