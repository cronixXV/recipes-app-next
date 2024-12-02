import { editRecipeById } from "@/server/api/recipes";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useEditRecipeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editRecipeById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast.success("Рецепт обновлен!", { autoClose: 3000 });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Ошибка при обновлении рецепта", {
        autoClose: 3000,
      });
    },
  });
}
