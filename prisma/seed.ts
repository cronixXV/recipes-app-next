import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const recipes = [
  {
    title: "Спагетти Карбонара",
    description: "Классическая итальянская паста.",
    imageUrl: "/images/carbonara.jpg",
    ingredients: [
      { name: "Спагетти", amount: "200 г" },
      { name: "Яйца", amount: "2 шт" },
      { name: "Пармезан", amount: "50 г" },
      { name: "Бекон", amount: "100 г" },
    ],
    chef: {
      name: "Рамзи",
      bio: "Лучший",
    },
  },
  {
    title: "Пицца Маргарита",
    description: "Свежая пицца с помидорами, базиликом и моцареллой.",
    imageUrl: "/images/pizza.jpg",
    ingredients: [
      { name: "Тесто", amount: "1 шт" },
      { name: "Томаты", amount: "2 шт" },
      { name: "Моцарелла", amount: "100 г" },
      { name: "Базилик", amount: "по вкусу" },
    ],
  },
  {
    title: "Салат Цезарь",
    description: "Салат с салатом романо, гренками и соусом Цезарь.",
    imageUrl: "/images/salad.jpg",
    ingredients: [
      { name: "Салат романо", amount: "100 г" },
      { name: "Гренки", amount: "50 г" },
      { name: "Соус Цезарь", amount: "30 г" },
      { name: "Пармезан", amount: "20 г" },
    ],
  },
];

async function main() {
  await prisma.ingredient.deleteMany();
  await prisma.recipe.deleteMany();

  //перебираем в цикле данные и записыввем их в базу
  for (const recipe of recipes) {
    await prisma.recipe.create({
      data: {
        title: recipe.title,
        description: recipe.description,
        imageUrl: recipe.imageUrl,
        ingredients: {
          create: recipe.ingredients.map((ingredient) => ({
            name: ingredient.name,
            amount: ingredient.amount,
          })),
        },
        Chef: recipe.chef ? { create: { ...recipe.chef } } : undefined,
      },
    });
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
