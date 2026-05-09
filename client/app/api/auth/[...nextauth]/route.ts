import axios from "axios";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import jwt from "jsonwebtoken";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email : { label: "email", type: "text"},
        password: { label: "password", type: "password"}
      },
      async authorize(credentials) {
        try {
          
          console.log(process.env.NEXT_PUBLIC_API_URL)
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-in`, {
            email: credentials?.email,
            password: credentials?.password
          }, { timeout: 5000 })

          const data = res.data

          if (data) {

            const rawToken = jwt.sign(
              {
                id : data.id,
                username: data.username,
                email: data.email,
              },
              process.env.NEXTAUTH_SECRET!,
              {expiresIn: '30d'}
            )

            return {
              id : data.id,
              username: data.username,
              email: data.email,
              createdAt: data.createdAt,
              rawToken
            }
          }
          return null
        } catch (error: any) {
          console.error(error)
          const message = error.response?.data?.error || "Sign In failed"
          throw new Error(message)
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
  pages: {
    signIn: '/sign-in'
  },
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token.id = user.id ?? null,
        token.username = user.username
        token.email = user.email
        token.createdAt = user.createdAt
        token.raw = user.rawToken
      }
      return token
    },
    async session({ session, token }) {
      try {
        if (session.user && token) {
          session.user.id = token.id
          session.user.username = token.username
          session.user.email = token.email
          session.user.createdAt = token.createdAt
          session.user.token = token.raw
          return session
        }
      } catch (e) {
        console.warn("Session fetch failed:", e)
      }

      return session
    }
  }
})


export { handler as GET, handler as POST }