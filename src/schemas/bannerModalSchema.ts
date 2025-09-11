import * as yup from "yup";

export const bannerModalSchema = yup.object().shape({
  banner_name: yup
    .string()
    .required("Nombre es un campo obligatorio")
    .max(255, "Máximo 255 caracteres"),

  banner_url: yup
    .string()
    .max(255, "Máximo 255 caracteres")
    .test("is-url", "Debe contener www", (value) => {
        if (!value) return true; 
        return value.includes("www");
      }),

  banner_order: yup
    .number()
    .typeError("Debe ser un número")
    .integer("Debe ser un entero")
    .min(0, "Debe ser ≥ 0")
    .optional(),

  available: yup.boolean().optional().default(true),
  image_url: yup.string().optional(),
});
