// client/app/api/auth/[...nextauth]/route.ts

import axios from "axios";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email : { label: "email", type: "text"},
        password: { label: "password", type: "password"}
      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            email: credentials?.email,
            password: credentials?.password
          })

          const data = res.data

          if (data) {
            return {
              id : data.id,
              username: data.username,
              email: data.email
            }
          } else {
            return null
          }
        } catch (error) {
          // TypeScript error handling: check if error is an AxiosError
          console.error("Authorize error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET
  },
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token.id = user.id,
        token.username = user.username
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      try {
        if (session.user && token?.id) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/find?id=${token.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (!res.ok) {
            console.warn("Fetch find user failed with status:", res.status);
            return session;
          }

          const data = await res.json();

          session.user.id = data.id;
          session.user.username = data.username;
        }
      } catch (e) {
        console.warn("Session fetch failed:", e);
      }

      return session;
    }
  }
})


export { handler as GET, handler as POST };