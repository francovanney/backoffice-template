import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("Campo requerido"),
  password: Yup.string().required("Campo requerido"),
});
