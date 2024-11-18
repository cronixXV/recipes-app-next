"use client";

import { Rating } from "flowbite-react";

export function RatingRecipe({ rating }: { rating: number }) {
  return (
    <Rating>
      {Array.from({ length: 5 }, (_, index) => (
        <Rating.Star
          key={index}
          filled={index < Math.round(rating)}
        />
      ))}
    </Rating>
  );
}
