import { prisma } from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = getServerSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const recipes = await prisma.recipe.findMany({
    include: {
      ingredients: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return NextResponse.json(recipes);
}
