import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import RecipeCard from "@/components/recipes/RecipeCard";

export const metadata: Metadata = {
  title: "Книга рецептов",
  description:
    "Книга рецептов. Делитесь любимыми рецептами и открывайте для себя новые",
};

export default async function Home(): Promise<React.JSX.Element> {
  const id = process.env.NEXT_PUBLIC_MAIN_RECIPE_ID ?? null;
  const dailyRecipe = id
    ? await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`).then(
        (res) => res.json()
      )
    : null;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">
        Добро пожаловать на платформу рецептов
      </h1>
      <p className="mt-4 mb-2 text-lg text-blue-500">Рецепт дня!</p>
      {dailyRecipe && (
        <ul className="daily-recipes">
          <RecipeCard
            id={dailyRecipe.id}
            title={dailyRecipe.title}
            description={dailyRecipe.description}
            image={dailyRecipe.image}
          />
        </ul>
      )}
      <nav className="mt-6">
        <Link
          href="/recipes"
          className="text-blue-500 hover:underline"
        >
          Посмотреть рецепты
        </Link>
      </nav>
    </div>
  );
}
