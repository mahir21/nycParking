import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      firstName?: string | null
      lastName?: string | null
    } & DefaultSession['user']
  }

  interface User {
    id: string
    email: string
    name?: string | null
    firstName?: string | null
    lastName?: string | null
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string
    firstName?: string | null
    lastName?: string | null
  }
}