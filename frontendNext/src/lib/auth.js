// @ts-nocheck
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            googleId: user.id,
            image: user.image,
          }),
        });

        if (!response.ok) {
          return false;
        }

        const userData = await response.json();
        user.backendId = userData.id;
        user.backendToken = userData.token;
        user.role = userData.role;

        return true;
      } catch (error) {
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.backendId = user.backendId;
        token.backendToken = user.backendToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.backendId = token.backendId;
      session.user.backendToken = token.backendToken;
      session.user.role = token.role;
      
      if (typeof window !== 'undefined' && token.backendToken) {
        localStorage.setItem('userToken', token.backendToken);
      }
      
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
