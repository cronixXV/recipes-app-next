"use client";

import { useState } from "react";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import deleteIcon from "@/app/delete.svg";
import editIcon from "@/app/edit.svg";
import Link from "next/link";
import IngredientsList from "@/components/ingredients/IngredientsList";
import { useIngredientsQuery } from "@/hooks/useIngredientsQuery";
import { Card } from "flowbite-react";
import { RatingRecipe } from "@/components/recipes/RatingRecipe";
import RecipeCardModal from "@/components/shared/RecipeCardModal";

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
  onDelete: (id: number) => void;
}

export default function RecipeCard({
  id,
  title,
  description,
  image,
  chef,
  rating,
  onEdit,
  onDelete,
}: RecipeCardProps) {
  const [liked, setLiked] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"edit" | "delete">("edit");

  const {
    data: ingredients,
    isLoading,
    isError,
  } = useIngredientsQuery(id, showIngredients);

  const handleShowIngredients = () => {
    setShowIngredients(!showIngredients);
  };

  const openModal = (type: "edit" | "delete") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <>
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
        <div className="flex justify-end gap-3 mr-1">
          <Image
            src={editIcon}
            alt="edit"
            className="w-6 h-6 cursor-pointer"
            onClick={() => openModal("edit")}
          />
          <Image
            src={deleteIcon}
            alt="delete"
            className="w-6 h-6 cursor-pointer"
            onClick={() => openModal("delete")}
          />
        </div>
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

        {isError && (
          <p className="text-red-500">Не удалось загрузить ингредиенты</p>
        )}

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

      <RecipeCardModal
        modalType={modalType}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={{ title, description, imageUrl: image }}
        onSave={(data) => onEdit(id, data)}
        onDelete={() => {
          onDelete(id);
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
