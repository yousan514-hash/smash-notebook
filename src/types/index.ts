export interface TacticalNote {
  id: string
  title: string
  content: string
  character: string
  situation: string
  tags: string[]
  user_id: string
  user_name: string
  user_avatar?: string
  created_at: string
  updated_at: string
  likes_count: number
  is_public: boolean
}

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
}

export interface Like {
  id: string
  user_id: string
  note_id: string
  created_at: string
}