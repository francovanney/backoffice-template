import * as yup from "yup";

export const eventModalSchema = yup.object().shape({
  title: yup
    .string()
    .required("Evento es un campo obligatorio")
    .max(20, "Máximo 20 caracteres"),
  categories: yup
    .array()
    .of(yup.string())
    .required("Categoría es un campo obligatorio"),
  event_date: yup.string().required("Fecha es un campo obligatorio"),
  venue: yup.string().required("Venue es un campo obligatorio"),
  city: yup.string().optional(),
  address: yup.string().optional(),
  instagram: yup.string().optional(),
  web: yup.string().optional(),
  url: yup.string().optional(),
  image_url: yup.string().optional(),
});
