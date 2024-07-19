import {object, string, array, number} from "yup";

export const buildSignUpSchema = () => {
  return object({
    email: string()
      .required('Requis'),
    password: string().required('Requis')
  })
}

export const buildPublicLaundrySchema = () => {
  return object({
    coordinate: object({
      latitude: string().required('Requis'),
      longitude: string().required('Requis')
    }),
    address:  string().required('Requis'),
    machines: array()
      .of(object({
        weight: number().typeError('Formate invalide').required()
      }))
  })
}
