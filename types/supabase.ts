export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      inquiries: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          status: 'unread' | 'read' | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          status?: 'unread' | 'read' | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          status?: 'unread' | 'read' | null
        }
        Relationships: []
      }
      media: {
        Row: {
          file_url: string
          id: string
          media_type: 'video' | 'image'
          project_id: string | null
          sort_order: number | null
        }
        Insert: {
          file_url: string
          id?: string
          media_type: 'video' | 'image'
          project_id?: string | null
          sort_order?: number | null
        }
        Update: {
          file_url?: string
          id?: string
          media_type?: 'video' | 'image'
          project_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          category: 'videography' | 'drone pilot' | 'photography' | 'video editor' | 'motion graphics'
          client: string | null
          created_at: string | null
          description: string | null
          id: string
          is_featured: boolean | null
          slug: string
          title: string
        }
        Insert: {
          category: 'videography' | 'drone pilot' | 'photography' | 'video editor' | 'motion graphics'
          client?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          slug: string
          title: string
        }
        Update: {
          category?: 'videography' | 'drone pilot' | 'photography' | 'video editor' | 'motion graphics'
          client?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          id: string
          name: string
          role: string | null
          content: string
          rating: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          role?: string | null
          content: string
          rating?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string | null
          content?: string
          rating?: number | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
