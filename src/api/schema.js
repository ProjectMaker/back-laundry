import {object, string} from "yup";

export const buildSignUpSchema = () => {
  return object({
    email: string()
      .required('Requis'),
    password: string().required('Requis')
  })
}
