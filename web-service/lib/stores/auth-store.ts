import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "../supabase"
import { prisma } from "../prisma"
import type { User, Session } from "@supabase/supabase-js"
import type { UserMetadata } from "@prisma/client"

interface AuthStore {
  user: User | null
  session: Session | null
  userMetadata: UserMetadata | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateUserMetadata: (updates: Partial<Pick<UserMetadata, 'fullName' | 'phone'>>) => Promise<{ error: any }>
  fetchUserMetadata: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      userMetadata: null,
      loading: true,

      signUp: async (email: string, password: string, fullName: string) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          })

          if (error) return { error }

          // UserMetadata는 트리거에 의해 자동으로 생성됩니다
          return { error: null }
        } catch (error) {
          return { error }
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) return { error }

          if (data.user && data.session) {
            set({ user: data.user, session: data.session })
            await get().fetchUserMetadata()
          }

          return { error: null }
        } catch (error) {
          return { error }
        }
      },

      signOut: async () => {
        try {
          await supabase.auth.signOut()
          set({ user: null, session: null, userMetadata: null })
        } catch (error) {
          console.error("Sign out error:", error)
        }
      },

      updateUserMetadata: async (updates: Partial<Pick<UserMetadata, 'fullName' | 'phone'>>) => {
        try {
          const user = get().user
          if (!user) return { error: "No user found" }

          const updatedMetadata = await prisma.userMetadata.update({
            where: { id: user.id },
            data: {
              ...updates,
              updatedAt: new Date(),
            },
          })

          set({ userMetadata: updatedMetadata })
          return { error: null }
        } catch (error) {
          console.error("Update user metadata error:", error)
          return { error }
        }
      },

      fetchUserMetadata: async () => {
        try {
          const user = get().user
          if (!user) return

          const userMetadata = await prisma.userMetadata.findUnique({
            where: { id: user.id },
          })

          set({ userMetadata })
        } catch (error) {
          console.error("Fetch user metadata error:", error)
        }
      },

      initialize: async () => {
        try {
          set({ loading: true })

          const {
            data: { session },
          } = await supabase.auth.getSession()

          if (session) {
            set({ user: session.user, session })
            await get().fetchUserMetadata()
          }

          // 인증 상태 변경 리스너
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
              set({ user: session.user, session })
              await get().fetchUserMetadata()
            } else {
              set({ user: null, session: null, userMetadata: null })
            }
          })
        } catch (error) {
          console.error("Auth initialization error:", error)
        } finally {
          set({ loading: false })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        userMetadata: state.userMetadata,
      }),
    },
  ),
)
