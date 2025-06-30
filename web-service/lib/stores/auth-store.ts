import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "../supabase"
import type { User, Session } from "@supabase/supabase-js"

interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

interface AuthStore {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
  fetchProfile: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      profile: null,
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

          if (data.user) {
            // 프로필 생성
            const { error: profileError } = await supabase.from("profiles").insert({
              id: data.user.id,
              email: data.user.email!,
              full_name: fullName,
            })

            if (profileError) {
              console.error("Profile creation error:", profileError)
            }
          }

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
            await get().fetchProfile()
          }

          return { error: null }
        } catch (error) {
          return { error }
        }
      },

      signOut: async () => {
        try {
          await supabase.auth.signOut()
          set({ user: null, session: null, profile: null })
        } catch (error) {
          console.error("Sign out error:", error)
        }
      },

      updateProfile: async (updates: Partial<Profile>) => {
        try {
          const user = get().user
          if (!user) return { error: "No user found" }

          const { error } = await supabase
            .from("profiles")
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq("id", user.id)

          if (error) return { error }

          // 로컬 상태 업데이트
          set((state) => ({
            profile: state.profile ? { ...state.profile, ...updates } : null,
          }))

          return { error: null }
        } catch (error) {
          return { error }
        }
      },

      fetchProfile: async () => {
        try {
          const user = get().user
          if (!user) return

          const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

          if (error) {
            console.error("Fetch profile error:", error)
            return
          }

          set({ profile: data })
        } catch (error) {
          console.error("Fetch profile error:", error)
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
            await get().fetchProfile()
          }

          // 인증 상태 변경 리스너
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
              set({ user: session.user, session })
              await get().fetchProfile()
            } else {
              set({ user: null, session: null, profile: null })
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
        profile: state.profile,
      }),
    },
  ),
)
