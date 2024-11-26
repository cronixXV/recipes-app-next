"use client";

import RecipeCard from "@/components/recipes/RecipeCard";
import { fetchRecipes, NewRecipe } from "@/server/api/recipes";
// import React, { useEffect, useState } from "react";
import type { Recipe } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import RecipeForm from "./RecipeForm";
// import { toast } from "react-toastify";
// import { use } from "react";
import { useAddRecipeMutation } from "@/hooks/useAddRecipeMutation";

export default function Recipes() {
  // const queryClient = useQueryClient();
  const {
    data: recipes,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["recipes"],
    //ключ, по которому хранится кэш
    queryFn: () => fetchRecipes(),
  });

  // const mutation = useMutation({
  //   mutationFn: addNewRecipe,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["recipes"] });
  //     toast.success("Рецепт добавлен!", { autoClose: 3000 });
  //   },
  //   onError: (err: Error) => {
  //     toast.error(err.message || "Ошибка при добавлении рецепта", {
  //       autoClose: 3000,
  //     });
  //   },
  // });

  const mutation = useAddRecipeMutation();

  // const [recipes, setRecipes] = useState<Recipe[]>([]);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchRecipes = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes`);
  //       if (!res.ok) {
  //         throw new Error("404");
  //       }

  //       const data = await res.json();
  //       setRecipes(data);
  //     } catch (error: unknown) {
  //       if (error instanceof Error) {
  //         setError(error.message);
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchRecipes();
  // }, []);

  if (isPending) {
    return <p className="text-center text-lg font-semibold">Загрузка</p>;
  }

  if (isError) {
    return <p className="text-center text-lg text-red-500">{error.message}</p>;
  }

  const handleAddRecipe = async (data: NewRecipe) => {
    mutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-6">Рецепты</h1>
      <RecipeForm onSubmit={handleAddRecipe} />
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        {recipes.map((recipe: Recipe) => (
          <RecipeCard
            key={recipe.id}
            id={recipe.id}
            title={recipe.title}
            description={recipe.description}
            image={recipe.imageUrl}
          />
        ))}
      </ul>
    </div>
  );
}
