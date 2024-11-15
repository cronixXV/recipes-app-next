-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "chefId" INTEGER;

-- CreateTable
CREATE TABLE "Chef" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,

    CONSTRAINT "Chef_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_chefId_fkey" FOREIGN KEY ("chefId") REFERENCES "Chef"("id") ON DELETE SET NULL ON UPDATE CASCADE;
