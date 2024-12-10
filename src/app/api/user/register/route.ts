import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/app/auth/_models/schema";

export async function GET() {
  return NextResponse.json({
    message:
      "Этот эндпоинт предназначен для отправки POST-запросов с данными для регистрации.",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedData = registerSchema.parse(body);

    const { email, password } = parsedData;

    // Проверка существующего пользователя
    const isUserExisting = await prisma.user.findUnique({
      where: { email },
    });

    if (isUserExisting) {
      return NextResponse.json(
        { message: "Пользователь с таким email уже существует" },
        { status: 409 }
      );
    }

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    newUser.password = "";

    return NextResponse.json(
      { message: "Пользователь успешно создан", newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка регистрации пользователя:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
