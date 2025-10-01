import * as yup from "yup";

export const EditBannerModalSchema = yup.object().shape({
  banner_name: yup
    .string()
    .trim()
    .required("Nombre es un campo obligatorio")
    .max(255, "Máximo 255 caracteres"),

  banner_url: yup
    .string()
    .notRequired(),

  banner_order: yup
    .number()
    .typeError("Debe ser un número")
    .integer("Debe ser un entero")
    .min(0, "Debe ser ≥ 0")
    .optional(),

  available: yup.boolean().optional(),
  image_url: yup.string().optional(),
});
