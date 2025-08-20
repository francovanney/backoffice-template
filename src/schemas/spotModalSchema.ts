import * as yup from "yup";

export const spotModalSchema = yup.object().shape({
  nombre: yup
    .string()
    .required("El nombre es requerido")
    .max(30, "El nombre no puede exceder 30 caracteres"),
  direccion: yup.string().notRequired(),
  link_direccion: yup
    .string()
    .notRequired()
    .test("is-url", "Debe contener www", (value) => {
      if (!value) return true;
      return value.includes("www");
    }),
  telefono: yup
    .string()
    .notRequired()
    .test("is-numeric", "El teléfono debe contener solo números", (value) => {
      if (!value) return true;
      return /^[0-9]*$/.test(value);
    }),
  descripcion: yup
    .string()
    .notRequired()
    .max(50, "La descripción no puede exceder 50 caracteres"),
  instagram: yup.string().notRequired(),
  reservas: yup.string().notRequired(),
  menu: yup.string().notRequired(),
  delivery: yup.string().notRequired(),
  web: yup
    .string()
    .notRequired()
    .test("is-url", "Debe contener www", (value) => {
      if (!value) return true;
      return value.includes("www");
    }),
});
