"use client";

import { Alert, Button, Label, TextInput } from "flowbite-react";
import { registerSchema, RegisterSchemaType } from "@/app/auth/_models/schema";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export default function RegisterForm() {
  const [registerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    console.log(data);
  };

  return (
    <form
      className="flex max-w-md flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        {registerError && (
          <Alert
            title={registerError}
            color="failure"
          >
            {registerError}
          </Alert>
        )}
      </div>
      <div>
        <div className="mb-2 block">
          <Label
            htmlFor="email"
            value="Email"
          />
        </div>
        <TextInput
          id="email"
          type="email"
          required
          {...register("email")}
          color={errors.email ? "failure" : "gray"}
          helperText={
            errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )
          }
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label
            htmlFor="password"
            value="Пароль"
          />
        </div>
        <TextInput
          id="password"
          type="password"
          required
          {...register("password")}
          color={errors.password ? "failure" : "gray"}
          helperText={
            errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )
          }
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label
            htmlFor="repassword"
            value="Повторите пароль"
          />
        </div>
        <TextInput
          id="repassword"
          type="password"
          required
          {...register("repeatPassword")}
          color={errors.repeatPassword ? "failure" : "gray"}
          helperText={
            errors.repeatPassword && (
              <span className="text-red-500">
                {errors.repeatPassword.message}
              </span>
            )
          }
        />
      </div>
      <Button type="submit">Зарегистрироваться</Button>
    </form>
  );
}
