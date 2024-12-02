import { z } from "zod";

export const passwordSchema = z.object({
  email: z
    .string()
    .min(5, "Поле обязательно для заполнения")
    .email("Введите E-mail"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

export type PasswordSchemaType = z.infer<typeof passwordSchema>;
//инфер позволяет извлечь тип

export const emailSchema = passwordSchema.omit({
  password: true,
});
// omit исключает password из схемы

export type EmailSchemaType = z.infer<typeof emailSchema>;

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(5, "Минимум 5 символов")
      .email("Введите корректный E-Mail"),
    password: z.string().min(6, "Минимум 6 символов"),
    repeatPassword: z.string().min(6, "Минимум 6 символов"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Пароли должны совпадать",
  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;
