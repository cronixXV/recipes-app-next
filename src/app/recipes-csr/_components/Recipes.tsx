"use client";

import RecipeCard from "@/components/recipes/RecipeCard";
import {
  // fetchRecipes,
  fetchSearchRecipes,
  NewRecipe,
} from "@/server/api/recipes";
import type { Recipe, Chef } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useAddRecipeMutation } from "@/hooks/useAddRecipeMutation";
import { useEditRecipeMutation } from "@/hooks/useEditRecipeMutation";
import RecipeCardModal from "@/components/shared/RecipeCardModal";
import { Button } from "flowbite-react";
import { useState } from "react";
import { useDeleteRecipeMutation } from "@/hooks/useDeleteRecipeMutation";
import SeactInput from "@/components/shared/SeactInput";
import { useDebounce } from "@/hooks/useDebounce";

interface MyRecipe extends Recipe {
  chef?: Chef;
}

export default function Recipes() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const {
    data: recipes,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["recipes", debouncedQuery],
    //ключ, по которому хранится кэш
    queryFn: () => fetchSearchRecipes(debouncedQuery),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const mutation = useAddRecipeMutation();
  const editRecipeMutation = useEditRecipeMutation();
  const deleteRecipeMutation = useDeleteRecipeMutation();

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

  const handleDeleteRecipe = (id: number) => {
    deleteRecipeMutation.mutate(id);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row items-center justify-between mb-6">
        <SeactInput onSearch={setQuery} />
        <h1 className="text-3xl">Рецепты</h1>

        {isPending && (
          <p className="text-center text-lg font-semibold">Загрузка</p>
        )}

        {isError && (
          <p className="text-center text-lg text-red-500">{error.message}</p>
        )}

        <Button onClick={() => setIsModalOpen(true)}>Добавить рецепт</Button>

        <RecipeCardModal
          modalType="add"
          onSave={handleAddRecipe}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        {recipes?.map((recipe: MyRecipe) => (
          <RecipeCard
            key={recipe.id}
            id={recipe.id}
            title={recipe.title}
            description={recipe.description}
            image={recipe.imageUrl}
            onEdit={handleEditRecipe}
            onDelete={handleDeleteRecipe}
            chef={recipe.chef?.name}
            rating={recipe.rating ?? 0}
          />
        ))}
      </ul>
      {!isPending && recipes?.length === 0 && (
        <p className="text-center text-gray-500 mt-6">Ничего не найдено</p>
      )}
    </div>
  );
}
