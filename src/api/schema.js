import {object, string, number, date} from "yup";

export const buildSignUpSchema = () => {
  return object({
    email: string()
      .required('Requis'),
    password: string().required('Requis')
  })
}

export const buildMaterialSchema = () => {
  return object({
    name: string().required('Requis'),
    brand: string().required('Requis'),
    availability_date: date().required('Requis'),
    model: string().required('Requis'),
    year: number().required('Requis'),
    price: number().required('Requis'),
    quantity: number().required('Requis')
  })
}
