import RegisterForm from "@/app/auth/_components/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const serverSession = await getServerSession();
  if (serverSession) {
    redirect(`${process.env.NEXT_PUBLIC_APP_URL}`);
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-bold text-xl">Регистрация</h1>
      <RegisterForm />
    </div>
  );
}
