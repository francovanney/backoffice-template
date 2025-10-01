import * as yup from "yup";

export const colorSchema = yup.object({
  primary: yup
    .string()
    .required("El color es requerido")
    .matches(
      /^#[0-9A-Fa-f]{6}$/,
      "El color debe ser un código hexadecimal válido (ej: #FF0000)"
    ),
  general: yup
    .string()
    .required("El color es requerido")
    .matches(
      /^#[0-9A-Fa-f]{6}$/,
      "El color debe ser un código hexadecimal válido (ej: #FF0000)"
    ), 
  background: yup
    .string()
    .required("El color es requerido")
    .matches(
      /^#[0-9A-Fa-f]{6}$/,
      "El color debe ser un código hexadecimal válido (ej: #FF0000)"
    ),
});

export type ConfigFormData = {
  general: string;    
  primary: string;    
  background: string; 
};
