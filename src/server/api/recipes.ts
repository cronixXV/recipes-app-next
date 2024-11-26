export interface NewRecipe {
  title: string;
  description: string;
  imageUrl: string;
}

export async function fetchRecipes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes`);
  if (!res.ok) {
    throw new Error("404");
  }

  return await res.json();
}

export async function addNewRecipe(newRecipe: NewRecipe) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes`, {
    method: "POST",
    body: JSON.stringify(newRecipe),
  });

  if (!res.ok) {
    throw new Error("404");
  }

  return await res.json();
}

export async function editRecipeById({
  id,
  data,
}: {
  id: number;
  data: Partial<{ title: string; description: string; imageUrl: string }>;
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("404");
  }

  return await res.json();
}

export async function deleteRecipeById(id: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`, {
    method: "DELETE",
    body: JSON.stringify(id),
  });

  if (!res.ok) {
    throw new Error("404");
  }

  return await res.json();
}
