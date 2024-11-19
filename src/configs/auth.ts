import { passwordSchema } from "@/app/auth/_models/schema";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// const users = [
//   { id: "1", name: "Anna", email: "test@example.local", password: "12345678" },
//   { id: "2", name: "Vika", email: "vika@example.local", password: "12345678" },
// ];

const users = [
  {
    id: "1",
    name: "Anna",
    email: "test@example.local",
    password: "$2a$10$J4roZ66UI2LjMf/NzX6df.cofMbX6Q5VUC9fV7kBSIAHrxAVTwWSW",
  },
  {
    id: "2",
    name: "Vika",
    email: "vika@example.local",
    password: bcrypt.hashSync("12345678"),
  },
];

const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? "",
  session: {
    strategy: "jwt",
    maxAge: 90 * 24 * 60 * 60, // 90 days
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        //    if (!credentials?.email || !credentials.password) {
        //       throw new Error("Введите email и пароль")
        //     }

        const { email, password } =
          await passwordSchema.parseAsync(credentials); // вернется промис

        // const user = users.find(
        //   (user) => user.email === email && user.password === password
        // );

        const user = users.find((user) => user.email === email);

        if (!user) {
          throw new Error("Неправильный email или пароль");
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Неправильный email или пароль");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
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

export default NextAuth(authOptions);
