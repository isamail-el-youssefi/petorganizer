import NextAuth, { NextAuthConfig } from "next-auth";
import credentials from "next-auth/providers/credentials";

const config = {
  pages: {
    signIn: "/login",
  },
  providers: [
    credentials({
        
    })
  ],
  callbacks: {
    authorized: ({ request }) => {
        const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");

        if(isTryingToAccessApp){
            return false
        } else {
            return true;
        }
    }
  },
} satisfies NextAuthConfig;

export const { auth, signIn } = NextAuth(config);
