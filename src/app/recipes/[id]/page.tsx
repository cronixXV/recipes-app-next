import RecipeCard from "@/components/recipes/RecipeCard";
import type { Recipe, Chef } from "@prisma/client";
import Link from "next/link";

interface MyRecipe extends Recipe {
  chef?: Chef;
}

async function fetchRecipeById(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("404");
  }

  return await res.json();
}

export default async function RecipesPage({
  params,
}: {
  params: { id: string };
}) {
  const recipe: MyRecipe = await fetchRecipeById(params.id);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-6">{recipe.title}</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecipeCard
          id={recipe.id}
          title={recipe.title}
          description={recipe.description}
          image={recipe.imageUrl}
          rating={recipe.rating ?? 0}
          chef={recipe.chef?.name}
        />
      </ul>
      <div className="mt-8">
        <Link
          href="/recipes"
          className="text-blue-500 hover:underline"
        >
          Посмотреть все рецепты
        </Link>
      </div>
    </div>
  );
}
