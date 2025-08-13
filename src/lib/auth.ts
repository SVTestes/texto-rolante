import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Credenciais faltando:', { email: !!credentials?.email, password: !!credentials?.password })
          return null
        }

        try {
          console.log('🔍 Procurando usuário:', credentials.email)
          
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            console.log('❌ Usuário não encontrado')
            return null
          }

          console.log('✅ Usuário encontrado:', { id: user.id, email: user.email, isadmin: user.isadmin })

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          console.log('🔑 Senha válida:', isPasswordValid)

          if (!isPasswordValid) {
            console.log('❌ Senha inválida')
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: user.isadmin, // Mapeando isadmin para isAdmin
          }
        } catch (error) {
          console.error('💥 Erro durante autenticação:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.isAdmin = token.isAdmin
      }
      return session
    }
  },
  pages: {
    signIn: '/login'
  },
  debug: true // Ativar debug para ver logs detalhados
}
