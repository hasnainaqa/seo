import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/lib/auth/auth-config";
import { prisma } from "@/lib/db";
import { appConfig } from "@/lib/app-config";

const nextAuth = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      // Include additional fields in the session object
      if (session && session.user) {
        session.user.id = token.sub as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }
      return session;
    },

    async jwt({ token, user, trigger }) {
      if (trigger === "update" && token && token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
        });
        if (!dbUser) return token;
        token.name = dbUser.name;
        token.image = dbUser.image;
      }

      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
  },
  pages: {
    signIn: appConfig.auth.login,
    signOut: appConfig.auth.afterLogout,
    newUser: appConfig.auth.newUser, // Route to which user get's redircted after first time signup
  },
  theme: {
    colorScheme: "auto", // "auto" | "dark" | "light"
    brandColor: appConfig.colors.primary,
    logo:
      process.env.NODE_ENV === "production"
        ? `${appConfig.domainUrl}/logo.png`
        : `http://localhost:3000/logo.png`,
  },
  ...authConfig,
});

export const { auth, handlers } = nextAuth;
