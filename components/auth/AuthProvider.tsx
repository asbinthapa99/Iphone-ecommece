'use client'

import { createContext, useContext } from 'react'
import { SessionProvider, useSession, signOut as nextAuthSignOut } from 'next-auth/react'

export interface AuthUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
  isAdmin?: boolean
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  signOut: async () => {},
})

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  const user: AuthUser | null = session?.user
    ? {
        id: (session.user as AuthUser).id ?? session.user.email ?? '',
        email: session.user.email ?? '',
        name: session.user.name,
        image: session.user.image,
        isAdmin: (session.user as AuthUser).isAdmin ?? false,
      }
    : null

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: status === 'loading',
        signOut: () => nextAuthSignOut({ callbackUrl: '/' }),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
