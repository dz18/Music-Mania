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
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-in`, {
            email: credentials?.email,
            password: credentials?.password
          })

          const data = res.data
          // console.log(data)

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
              rawToken
            }
          }
          return null
        } catch (error: any) {
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
        token.id = user.id,
        token.username = user.username
        token.email = user.email
        token.raw = user.rawToken
      }
      return token
    },
    async session({ session, token }) {
      try {
        if (session.user && token.id) {
          const user = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/find`, {
            headers: {
              Authorization: `Bearer ${token.raw}`
            }
          });

          if (!user) {
            console.warn("Fetch find user failed with status:")
            return session
          }

          const data = user.data

          session.user.id = data.id
          session.user.username = data.username
          session.user.avatar = data.avatar
          session.user.createdAt = data.createdAt
          session.user.token = token.raw

          console.log('session:', session)
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