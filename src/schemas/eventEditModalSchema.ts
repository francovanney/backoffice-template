import * as yup from "yup";

export const eventEditModalSchema = yup.object().shape({
  event: yup
    .string()
    .required("Evento es un campo obligatorio")
    .max(20, "Máximo 20 caracteres"),
  category: yup.string().required("Categoría es un campo obligatorio"),
  date: yup.string().required("Fecha es un campo obligatorio"),
  venue: yup.string().required("Venue es un campo obligatorio"),
  address: yup.string().optional(),
  instagram: yup.string().optional(),
  web: yup.string().optional(),
});
