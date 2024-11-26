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
import { useEditRecipeMutation } from "@/hooks/useEditRecipeMutation";

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
  const editRecipeMutation = useEditRecipeMutation();

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

  const handleEditRecipe = (
    id: number,
    updatedData: Partial<{
      title: string;
      description: string;
      imageUrl: string;
    }>
  ) => {
    editRecipeMutation.mutate({ id, data: updatedData });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row items-center justify-between mb-6">
        <h1 className="text-3xl">Рецепты</h1>
        <RecipeForm onSubmit={handleAddRecipe} />
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        {recipes.map((recipe: Recipe) => (
          <RecipeCard
            key={recipe.id}
            id={recipe.id}
            title={recipe.title}
            description={recipe.description}
            image={recipe.imageUrl}
            onEdit={handleEditRecipe}
          />
        ))}
      </ul>
    </div>
  );
}
