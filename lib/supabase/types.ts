export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      api_tokens: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          last_used_at: string | null
          name: string
          scopes: Json | null
          token_hash: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          last_used_at?: string | null
          name: string
          scopes?: Json | null
          token_hash: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          last_used_at?: string | null
          name?: string
          scopes?: Json | null
          token_hash?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          actor_id: string | null
          created_at: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          payload_diff: Json | null
          severity: string | null
          target_resource_id: string | null
        }
        Insert: {
          actor_id?: string | null
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          payload_diff?: Json | null
          severity?: string | null
          target_resource_id?: string | null
        }
        Update: {
          actor_id?: string | null
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          payload_diff?: Json | null
          severity?: string | null
          target_resource_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_assets: {
        Row: {
          challenge_id: string
          created_at: string | null
          download_count: number | null
          file_hash: string | null
          file_size_bytes: number | null
          filename: string
          id: string
          storage_path: string
        }
        Insert: {
          challenge_id: string
          created_at?: string | null
          download_count?: number | null
          file_hash?: string | null
          file_size_bytes?: number | null
          filename: string
          id?: string
          storage_path: string
        }
        Update: {
          challenge_id?: string
          created_at?: string | null
          download_count?: number | null
          file_hash?: string | null
          file_size_bytes?: number | null
          filename?: string
          id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_assets_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_flags: {
        Row: {
          challenge_id: string
          created_at: string | null
          flag_format: string | null
          flag_hash: string
          id: string
          is_case_sensitive: boolean | null
        }
        Insert: {
          challenge_id: string
          created_at?: string | null
          flag_format?: string | null
          flag_hash: string
          id?: string
          is_case_sensitive?: boolean | null
        }
        Update: {
          challenge_id?: string
          created_at?: string | null
          flag_format?: string | null
          flag_hash?: string
          id?: string
          is_case_sensitive?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_flags_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_tags: {
        Row: {
          challenge_id: string
          tag_id: number
        }
        Insert: {
          challenge_id: string
          tag_id: number
        }
        Update: {
          challenge_id?: string
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenge_tags_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          author_id: string | null
          container_image_ref: string | null
          created_at: string | null
          current_points: number | null
          decay_function: Database["public"]["Enums"]["decay_function"] | null
          description_markdown: string
          difficulty: Database["public"]["Enums"]["challenge_difficulty"]
          id: string
          initial_points: number | null
          is_dynamic_scoring: boolean | null
          min_points: number | null
          requires_container: boolean | null
          slug: string
          solve_count: number | null
          state: Database["public"]["Enums"]["challenge_state"]
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          container_image_ref?: string | null
          created_at?: string | null
          current_points?: number | null
          decay_function?: Database["public"]["Enums"]["decay_function"] | null
          description_markdown: string
          difficulty?: Database["public"]["Enums"]["challenge_difficulty"]
          id?: string
          initial_points?: number | null
          is_dynamic_scoring?: boolean | null
          min_points?: number | null
          requires_container?: boolean | null
          slug: string
          solve_count?: number | null
          state?: Database["public"]["Enums"]["challenge_state"]
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          container_image_ref?: string | null
          created_at?: string | null
          current_points?: number | null
          decay_function?: Database["public"]["Enums"]["decay_function"] | null
          description_markdown?: string
          difficulty?: Database["public"]["Enums"]["challenge_difficulty"]
          id?: string
          initial_points?: number | null
          is_dynamic_scoring?: boolean | null
          min_points?: number | null
          requires_container?: boolean | null
          slug?: string
          solve_count?: number | null
          state?: Database["public"]["Enums"]["challenge_state"]
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      container_instances: {
        Row: {
          challenge_id: string
          connection_info: Json | null
          created_at: string | null
          expires_at: string | null
          id: string
          provider_task_id: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          connection_info?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          provider_task_id?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          connection_info?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          provider_task_id?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "container_instances_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "container_instances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      licenses: {
        Row: {
          created_at: string | null
          expires_at: string | null
          key_hash: string
          max_seats: number | null
          owner_org_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          key_hash: string
          max_seats?: number | null
          owner_org_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          key_hash?: string
          max_seats?: number | null
          owner_org_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "licenses_owner_org_id_fkey"
            columns: ["owner_org_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: string | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: string | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: string | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: string | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: string | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: string | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          deleted_at: string | null
          full_name: string | null
          github_handle: string | null
          id: string
          mfa_enabled: boolean | null
          rank: number | null
          theme_preference: string | null
          total_points: number | null
          total_solves: number | null
          updated_at: string | null
          username: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          full_name?: string | null
          github_handle?: string | null
          id: string
          mfa_enabled?: boolean | null
          rank?: number | null
          theme_preference?: string | null
          total_points?: number | null
          total_solves?: number | null
          updated_at?: string | null
          username: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          full_name?: string | null
          github_handle?: string | null
          id?: string
          mfa_enabled?: boolean | null
          rank?: number | null
          theme_preference?: string | null
          total_points?: number | null
          total_solves?: number | null
          updated_at?: string | null
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      solves: {
        Row: {
          challenge_id: string
          id: string
          is_first_blood: boolean | null
          points_awarded: number
          solved_at: string | null
          team_id: string | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          id?: string
          is_first_blood?: boolean | null
          points_awarded: number
          solved_at?: string | null
          team_id?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          id?: string
          is_first_blood?: boolean | null
          points_awarded?: number
          solved_at?: string | null
          team_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "solves_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solves_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solves_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          challenge_id: string
          created_at: string | null
          execution_time_ms: number | null
          id: string
          input_payload: string
          ip_address: unknown | null
          is_correct: boolean
          team_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          created_at?: string | null
          execution_time_ms?: number | null
          id?: string
          input_payload: string
          ip_address?: unknown | null
          is_correct: boolean
          team_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          created_at?: string | null
          execution_time_ms?: number | null
          id?: string
          input_payload?: string
          ip_address?: unknown | null
          is_correct?: boolean
          team_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          provider_id: string | null
          quantity: number | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          provider_id?: string | null
          quantity?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          provider_id?: string | null
          quantity?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          color_hex: string | null
          created_at: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          color_hex?: string | null
          created_at?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          color_hex?: string | null
          created_at?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          joined_at: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          team_id: string
          user_id: string
        }
        Insert: {
          joined_at?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          team_id: string
          user_id: string
        }
        Update: {
          joined_at?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          avatar_url: string | null
          captain_id: string | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          captain_id?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          captain_id?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_captain_id_fkey"
            columns: ["captain_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_challenge_points: {
        Args: {
          p_initial_points: number
          p_min_points: number
          p_solve_count: number
          p_decay_function: Database["public"]["Enums"]["decay_function"]
        }
        Returns: number
      }
      handle_new_user_profile: {
        Args: {
          argument: unknown
        }
        Returns: unknown
      }
      update_challenge_on_solve: {
        Args: {
          argument: unknown
        }
        Returns: unknown
      }
      verify_flag: {
        Args: {
          p_challenge_id: string
          p_flag_hash: string
        }
        Returns: boolean
      }
    }
    Enums: {
      audit_action: "create" | "update" | "delete" | "login" | "other"
      challenge_difficulty: "easy" | "medium" | "hard" | "insane"
      challenge_state: "draft" | "published" | "deprecated"
      decay_function: "logarithmic" | "linear"
      user_role: "owner" | "admin" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
    Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
    Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof Database["public"]["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof Database["public"]["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof Database["public"]["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
