import { publicEnv } from "@/public-env"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = publicEnv.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 서버 컴포넌트용 클라이언트
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// 데이터베이스 타입 정의
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_data: any
          status: string
          total_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_id: string
          order_data: any
          status: string
          total_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_data?: any
          status?: string
          total_amount?: number
          updated_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          address: string
          detail_address: string
          zip_code: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone: string
          address: string
          detail_address: string
          zip_code: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string
          address?: string
          detail_address?: string
          zip_code?: string
          is_default?: boolean
          updated_at?: string
        }
      }
    }
  }
}
