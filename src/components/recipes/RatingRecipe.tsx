"use client";

import { Rating } from "flowbite-react";

export function RatingRecipe({ rating }: { rating: number }) {
  const ratingStars = Array.from({ length: 5 }, (_, index) => (
    <Rating.Star
      key={index}
      filled={index < Math.round(rating)}
    />
  ));
  return <Rating>{ratingStars}</Rating>;
}
