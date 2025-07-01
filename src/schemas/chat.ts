import * as yup from "yup";

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
export const conversationSchema = yup.object({
  body: yup.object({
    message: yup
      .string()
      .required("text is required! Add 'text' in the request body"),
    chatId: yup.string().optional(),
    bot: yup.string().optional(),
    userId: yup
      .string()
      .required("userId is required! Add 'userId' in the request body"),
    tool: yup
      .string()
      .oneOf(["web_search", "custom_function"])
      .required("tool is required! Add 'tool' in the request body"),
  }),
});
export const messageSchemaParam = yup.object({
  params: yup.object({
    chatId: yup.string().required("chatId is required! Add 'chatId' in params"),
  }),
});
export const updateChatSchema = yup.object({
  title: yup.string().max(32).trim(),
});

export interface UpdateChatBody
  extends yup.InferType<typeof updateChatSchema> {}
export interface ConversationBody {
  message: string;
  chatId?: string;
  bot?: string;
  userId: string;
  useTools?: boolean;
  stream?: boolean;
}
export interface MessageBody {
  role: "user" | "assistant" | "system";
  content: string;
  chat?: string;
}
export interface StreamResponse {
  type: "content" | "function_call" | "function_result" | "end";
  content?: string;
  functionCall?: {
    name: string;
    arguments: string;
  };
  functionResult?: any;
}
