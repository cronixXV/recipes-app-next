import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "О нас",
};

export default function AboutPage() {
  // const classDynamic = `text-blue-${"400"}`;

  return (
    // <div className="container mx-auto p-4">
    //   <h1 className="text-4xl font-bold mb-4">О нас</h1>
    //   <p className={`text-lg ${classDynamic} dark:text-gray-400`}>
    //     Добро пожаловать на наш сайт рецептов! Здесь вы найдете лучшие рецепты
    //     из разных уголков мира. Мы стремимся поделиться с вами не только
    //     вкусными рецептами, но и полезной информацией о приготовлении пищи.
    //   </p>
    // </div>

    <section className="bg-white dark:bg-gray-900">
      <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
        <Image
          className="w-full"
          src="/images/pizza.jpg"
          alt="Ой, что-то упало-уже чиним"
          width={300}
          height={300}
        />
        <div className="mt-4 md:mt-0">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Книга рецептов
          </h2>
          <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
            Добро пожаловать на наш сайт рецептов! Здесь вы найдете лучшие
            рецепты из разных уголков мира. Мы стремимся поделиться с вами не
            только вкусными рецептами, но и полезной информацией о приготовлении
            пищи.
          </p>
          <div className="flex items-start">
            <Link
              href="/recipes"
              className="inline-flex items-center text-white bg-primary-700 hover:bg-primary-800 hover:ring-2 hover:ring-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:outline-none"
            >
              К рецептам
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
