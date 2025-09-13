import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema types
export interface Database {
  public: {
    Tables: {
      decks: {
        Row: {
          id: string
          name: string
          description: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      cards: {
        Row: {
          id: string
          my_char: string
          opp_char: string
          percent_band: string
          situation: string
          opp_move: string | null
          answer_md: string
          deck_id: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          my_char: string
          opp_char: string
          percent_band: string
          situation: string
          opp_move?: string | null
          answer_md: string
          deck_id?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          my_char?: string
          opp_char?: string
          percent_band?: string
          situation?: string
          opp_move?: string | null
          answer_md?: string
          deck_id?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          content: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      post_cards: {
        Row: {
          post_id: string
          card_id: string
        }
        Insert: {
          post_id: string
          card_id: string
        }
        Update: {
          post_id?: string
          card_id?: string
        }
      }
    }
  }
}