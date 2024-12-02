import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? "";

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: { ingredients: true, Chef: true },
    });

    return NextResponse.json(recipes);
  } catch {
    return NextResponse.json(
      { error: "Не удалось найти рецепты" },
      { status: 500 }
    );
  }
}
