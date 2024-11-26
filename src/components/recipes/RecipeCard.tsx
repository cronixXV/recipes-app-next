"use client";

import { useState } from "react";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import IngredientsList, {
  Ingredient,
} from "@/components/ingredients/IngredientsList";
import { Button, Card } from "flowbite-react";
import { RatingRecipe } from "@/components/recipes/RatingRecipe";

interface RecipeCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  chef?: string;
  rating?: number;
  onEdit: (
    id: number,
    data: Partial<{ title: string; description: string; imageUrl: string }>
  ) => void;
}

export default function RecipeCard({
  id,
  title,
  description,
  image,
  chef,
  rating,
  onEdit,
}: RecipeCardProps) {
  const [liked, setLiked] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [showIngredients, setShowIngredients] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title,
    description,
    imageUrl: image,
  });

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

  const handleSave = () => {
    onEdit(id, formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="card">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          type="text"
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData({ ...formData, imageUrl: e.target.value })
          }
        />
        <Button onClick={handleSave}>Сохранить</Button>
        <Button
          color="gray"
          onClick={() => setIsEditing(false)}
        >
          Отмена
        </Button>
      </div>
    );
  }

  return (
    <Card
      className="border p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700"
      renderImage={() => (
        <Link href={`/recipes/${id}`}>
          <Image
            src={image}
            width={300}
            height={200}
            alt={title}
            className="mb-1 rounded-lg mx-auto"
          />
        </Link>
      )}
    >
      <Button onClick={() => setIsEditing(true)}>Редактировать</Button>
      {rating && <RatingRecipe rating={rating} />}
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h5>
      <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">
        {description}
      </p>
      {chef && (
        <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">
          Шеф: {chef}
        </p>
      )}
      <button
        onClick={toggleLike}
        className="flex items-center space-x-2"
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
    </Card>
  );
}
