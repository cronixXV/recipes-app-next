import { deleteRecipeById } from "@/server/api/recipes";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useDeleteRecipeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRecipeById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast.success("Рецепт удален!", { autoClose: 3000 });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Ошибка при удалении рецепта", {
        autoClose: 3000,
      });
    },
  });
}
