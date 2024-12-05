import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET() {
  return NextResponse.json({
    message:
      "Этот эндпоинт предназначен для отправки POST-запросов с данными для регистрации.",
  });
}

export async function POST(req: Request) {
  try {
    const { name, email, password, repeatPassword } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email и пароль обязательны" },
        { status: 400 }
      );
    }

    if (password !== repeatPassword) {
      return NextResponse.json(
        { message: "Пароли не совпадают" },
        { status: 400 }
      );
    }

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
        name,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Пользователь успешно создан", newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка регистрации пользователя:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
