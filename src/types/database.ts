export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          username: string
          email: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          email?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          email?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      decks: {
        Row: {
          id: string
          title: string
          description: string | null
          is_public: boolean
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          is_public?: boolean
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          is_public?: boolean
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      cards: {
        Row: {
          id: string
          deck_id: string
          owner_id: string
          situation: string
          percent_band: string
          opp_char: string | null
          opp_move: string | null
          question_md: string
          answer_md: string
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          deck_id: string
          owner_id: string
          situation: string
          percent_band: string
          opp_char?: string | null
          opp_move?: string | null
          question_md: string
          answer_md: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          deck_id?: string
          owner_id?: string
          situation?: string
          percent_band?: string
          opp_char?: string | null
          opp_move?: string | null
          question_md?: string
          answer_md?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          content: string
          is_public: boolean
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          is_public?: boolean
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          is_public?: boolean
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          title: string
          target_char: string
          section: string
          percent: string
          opp_move: string | null
          answer_md: string
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          target_char: string
          section: string
          percent: string
          opp_move?: string | null
          answer_md: string
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          target_char?: string
          section?: string
          percent?: string
          opp_move?: string | null
          answer_md?: string
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          owner_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          created_at?: string
        }
      }
    }
  }
}