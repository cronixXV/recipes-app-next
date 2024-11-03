import { NextResponse } from "next/server";
import { recipes } from "@/data/data";

export async function GET() {
  return NextResponse.json(recipes);
}
