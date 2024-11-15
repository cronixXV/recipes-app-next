"use client";

import { useState } from "react";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import IngredientsList, {
  Ingredient,
} from "@/components/ingredients/IngredientsList";

interface RecipeCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  chef?: string;
}

export default function RecipeCard({
  id,
  title,
  description,
  image,
  chef,
}: RecipeCardProps) {
  const [liked, setLiked] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [showIngredients, setShowIngredients] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  const fetchIngredients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`
      );
      if (!response.ok) {
        throw new Error("Ошибка при загрузке ингредиентов");
      }
      const data = await response.json();
      setIngredients(data.ingredients);
      setShowIngredients(true);
    } catch (error) {
      console.error("Ошибка при получении ингредиентов:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowIngredients = () => {
    if (!showIngredients) {
      fetchIngredients();
    } else {
      setShowIngredients(false);
    }
  };

  // console.log(chef);

  return (
    <li className="border p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
      <Link href={`/recipes/${id}`}>
        <Image
          src={image}
          width={300}
          height={200}
          alt={title}
          className="mb-4 rounded-lg"
        />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">
          {description}
        </p>
        {chef && (
          <p className="text-sm text-gray-700  dark:text-gray-400 mb-4">
            Шеф: {chef}
          </p>
        )}
      </Link>
      <button
        onClick={toggleLike}
        className="flex items-center space-x-2 mt-4"
      >
        {liked ? (
          <SolidHeartIcon className="w-6 h-6 text-red-500" />
        ) : (
          <OutlineHeartIcon className="w-6 h-6 text-gray-500" />
        )}
        <span>{liked ? "Вы поставили лайк!" : "Поставить лайк"}</span>
      </button>

      <button
        onClick={handleShowIngredients}
        className="text-white mt-4 px-4 py-2 rounded-md bg-blue-500"
      >
        {showIngredients ? "Скрыть ингредиенты" : "Посмотреть ингредиенты"}
      </button>

      {isLoading && (
        <div className="flex justify-center items-center mt-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-700">Загрузка ингредиентов...</span>
        </div>
      )}

      {showIngredients && !isLoading && (
        <div className="mt-4">
          <IngredientsList ingredients={ingredients} />
        </div>
      )}
    </li>
  );
}
