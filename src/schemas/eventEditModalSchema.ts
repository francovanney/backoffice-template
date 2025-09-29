import * as yup from "yup";

export const EditEventModalSchema = yup.object().shape({
  title: yup
    .string()
    .required("Evento es un campo obligatorio")
    .max(30, "Máximo 30 caracteres"),
  categories: yup.array().of(yup.string()).optional(),
  event_date: yup.string().required("Fecha es un campo obligatorio"),
  venue: yup.string().required("Lugar del Evento es un campo obligatorio"),
  city: yup.string().optional(),
  address: yup.string().optional(),
  instagram: yup.string().optional(),
  web: yup.string().optional(),
  url: yup.string().optional(),
  image_url: yup.string().optional(),
  is_featured: yup.boolean().optional().default(false),
});
