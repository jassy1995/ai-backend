import * as yup from 'yup';

export const createUserSchema = yup.object({
  body: yup.object({
    fullName: yup
      .string()
      .required("fullName is required! Add 'fullName' in the request body"),
    username: yup
      .string()
      .required("username is required! Add 'username' in the request body"),
    phone: yup
      .string()
      .required("phone is required! Add 'phone' in the request body"),
    email: yup.string().optional(),
    password: yup
      .string()
      .required("password is required! Add 'password' in the request body"),
    image: yup.string().optional(),
    lastLogin: yup.date().optional(),
  }),
});
