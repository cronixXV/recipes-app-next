import { useForm } from "react-hook-form";
import { Modal, TextInput, Textarea, Button, Label } from "flowbite-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const recipeSchema = z.object({
  title: z.string().min(3, "Название должно быть не короче 3 символов"),
  description: z.string().min(10, "Описание должно быть не короче 10 символов"),
  imageUrl: z.string().min(3, "Введите корректный URL изображения"),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

interface RecipeCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: "add" | "edit" | "delete";
  initialData?: RecipeFormData;
  onSave?: (data: RecipeFormData) => void;
  onDelete?: () => void;
}

export default function RecipeCardModal(props: RecipeCardModalProps) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: props.initialData,
  });

  useEffect(() => {
    if (props.initialData) {
      reset(props.initialData);
    }
  }, [props.initialData, reset]);

  const handleSave = (data: RecipeFormData) => {
    if (props.onSave) {
      props.onSave(data);
    }
    reset();
    props.onClose();
  };

  const handleDelete = () => {
    if (props.onDelete) {
      props.onDelete();
    }
    props.onClose();
  };
  return (
    <Modal
      show={props.isOpen}
      onClose={props.onClose}
      size="md"
    >
      <Modal.Header>
        {props.modalType === "add" && "Добавить рецепт"}
        {props.modalType === "edit" && "Редактировать рецепт"}
        {props.modalType === "delete" && "Удалить рецепт"}
      </Modal.Header>
      <Modal.Body>
        {props.modalType === "delete" ? (
          <div className="space-y-4">
            <p>Вы уверены, что хотите удалить этот рецепт?</p>
            <div className="flex justify-end space-x-2">
              <Button
                color="failure"
                onClick={handleDelete}
              >
                Удалить
              </Button>
              <Button
                color="gray"
                onClick={props.onClose}
              >
                Отмена
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(handleSave)}
            className="space-y-6"
          >
            <div>
              <Label
                htmlFor="title"
                value="Название"
              />
              <TextInput
                id="title"
                type="text"
                placeholder="Введите название рецепта"
                {...register("title")}
                color={errors.title ? "failure" : undefined}
                helperText={
                  errors.title && (
                    <span className="text-red-500">{errors.title.message}</span>
                  )
                }
              />
            </div>
            <div>
              <Label
                htmlFor="description"
                value="Описание"
              />
              <Textarea
                id="description"
                placeholder="Введите описание рецепта"
                {...register("description")}
                color={errors.description ? "failure" : undefined}
                helperText={
                  errors.description && (
                    <span className="text-red-500">
                      {errors.description.message}
                    </span>
                  )
                }
              />
            </div>
            <div>
              <Label
                htmlFor="imageUrl"
                value="Ссылка на изображение"
              />
              <TextInput
                id="imageUrl"
                type="text"
                placeholder="/images/salad.jpg"
                {...register("imageUrl")}
                color={errors.imageUrl ? "failure" : undefined}
                helperText={
                  errors.imageUrl && (
                    <span className="text-red-500">
                      {errors.imageUrl.message}
                    </span>
                  )
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="submit">
                {props.modalType === "add" ? "Добавить" : "Сохранить"}
              </Button>
              <Button
                color="gray"
                onClick={props.onClose}
              >
                Отмена
              </Button>
            </div>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
}
