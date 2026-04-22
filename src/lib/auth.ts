import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)
          
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await prisma.user.findUnique({ where: { email } })
          if (!user) return null
          
          const passwordsMatch = await bcrypt.compare(password, user.password)
          if (passwordsMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              image: user.image
            }
          }
        }
        return null
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 horas
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false
        
        // Bloquear correos que no sean de @gmail.com
        if (!user.email.endsWith("@gmail.com")) {
          return "/login?error=business_domain"
        }
        
        try {
          const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
              email: user.email,
              name: user.name || "Usuario Google",
              password: "GOOGLE_AUTH_NO_PASSWORD",
              role: "COBRADOR",
              image: user.image
            }
          })
          
          // Adjuntar rol e ID para el token JWT
          user.id = dbUser.id
          ;(user as any).role = dbUser.role
          user.image = dbUser.image || user.image
          return true
        } catch (error) {
          console.error("Error en auto-registro con Google:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
        token.image = user.image
      }
      if (trigger === "update" && session) {
        if (session.image) token.image = session.image
        if (session.name) token.name = session.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role
        session.user.image = token.image as string | null | undefined
        if (token.name) session.user.name = token.name as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  }
})
