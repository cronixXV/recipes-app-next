import { passwordSchema } from "@/app/auth/_models/schema";
import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/libs/prisma";
import { mailOptions, transporter } from "./nodemailer";

const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? "",
  session: {
    strategy: "jwt",
    maxAge: 90 * 24 * 60 * 60, // 90 days
  },
  pages: {
    signIn: "/auth/login",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        const { email, password } =
          await passwordSchema.parseAsync(credentials);

        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!user) {
          throw new Error("Неправильный email или пароль");
        }

        const isPasswordValid =
          user.password && (await bcrypt.compare(password, user.password));
        if (!isPasswordValid) {
          throw new Error("Неправильный email или пароль");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.SMTP_FROM,
      // функция для отправки
      async sendVerificationRequest(params) {
        const { identifier, url } = params;
        const { host } = new URL(url);
        // identifier - email пользователя
        //url - ссылка, по которой нужно перейти, чтобы авторизоваться

        if (process.env.NODE_ENV === "development") {
          console.log(`Link ${identifier}: ${url}`);
          return;
        }

        const result = await transporter.sendMail({
          ...mailOptions,
          to: identifier,
          subject: `Вход на сайт ${host}`,
          text: text({ url, host }),
        });

        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email не может быть отправлен`);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
        };
      }
      return session;
    },
  },
};

//можно вынести в отдельный файл
function text({ url, host }: { url: string; host: string }) {
  return `Ссылка для входа на сайт ${host}\n${url}\n\n`;
}

export default NextAuth(authOptions);
