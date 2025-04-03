import * as yup from 'yup';

export const messageSchema = yup.object({
  query: yup.object({
    message: yup
      .string()
      .required("message is required! Add 'message' in query param"),
  }),
});
export const promptSchema = yup.object({
  body: yup.object({
    message: yup
      .string()
      .required("message is required! Add 'message' in the request body"),
  }),
});
