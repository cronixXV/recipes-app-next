import { useQuery } from "@tanstack/react-query";

const fetchIngredients = async (id: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`
  );
  if (!response.ok) {
    throw new Error("Ошибка при загрузке ингредиентов");
  }
  const data = await response.json();
  return data.ingredients;
};

export const useIngredientsQuery = (id: number, enabled: boolean) => {
  return useQuery({
    queryKey: ["ingredients", id],
    queryFn: () => fetchIngredients(id),
    enabled, // Выполняем запрос только если enabled = true
    staleTime: 1000 * 60 * 5, // Данные актуальны в течение 5 минут
  });
};
