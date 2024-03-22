import NextAuth, { NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./db";
import bcrypt from "bcryptjs";
import { authSchema } from "./validations";

const config = {
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // runs on every login attempt

        // validation
        const validatedCredentials = authSchema.safeParse(credentials);
        if (!validatedCredentials.success) {
          return null;
        }

        // extract values
        const { email, password } = validatedCredentials.data;

        // check if user exists
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (!user) {
          console.log("No user found");
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          password,
          user.hashedPassword
        );
        if (!isValidPassword) {
          console.log("Invalid password");
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth, request }) => {
      // runs on every request with middleware
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");

      if (!isLoggedIn && isTryingToAccessApp) {
        return false;
      }

      if (isLoggedIn && isTryingToAccessApp) {
        return true;
      }

      if (isLoggedIn && !isTryingToAccessApp) {
        return Response.redirect(new URL("/app/dashboard", request.nextUrl));
      }

      if (!isLoggedIn && !isTryingToAccessApp) {
        return true;
      }

      return false;
    },
    //
    jwt: ({ token, user }) => {
      if (user) {
        // on sign in (grabing id from the user to the token)
        token.userId = user.id;
        console.log("user", user);
      }
      return token;
    },
    session: ({ session, token }) => {
      // on every request (grabing the id from the token to the session, bz the id in the jwt callback is encrypted
      // we cant access it so thats why we passing the id to the session to be consummed in the client)
      if (session.user) {
        session.user.id = token.userId;
      }
      console.log("session", session.user);

      return session;
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(config);
