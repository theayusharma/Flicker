// @ts-nocheck
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const userData = await response.json();
          
          return {
            id: userData.id.toString(),
            name: userData.username,
            email: userData.email,
            backendId: userData.id,
            backendToken: userData.token,
            role: userData.role,
          };
        } catch (error) {
          return null;
        }
      }
    })
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
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (typeof window !== 'undefined' && user.backendToken) {
        localStorage.setItem('userToken', user.backendToken);
      }
    }
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
