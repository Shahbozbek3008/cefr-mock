export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type TestRelation<Name extends string> = {
  foreignKeyName: Name;
  columns: ['test_id'];
  isOneToOne: false;
  referencedRelation: 'tests';
  referencedColumns: ['id'];
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          phone: string | null;
          first_name: string | null;
          last_name: string | null;
          avatar_path: string | null;
          target_level: string | null;
          exam_date: string | null;
          daily_minutes: number | null;
          reminder_enabled: boolean;
          push_token: string | null;
          is_pro: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: { [_ in never]: never };
        Update: {
          first_name?: string | null;
          last_name?: string | null;
          avatar_path?: string | null;
          target_level?: string | null;
          exam_date?: string | null;
          daily_minutes?: number | null;
          reminder_enabled?: boolean;
          push_token?: string | null;
        };
        Relationships: [];
      };
      tests: {
        Row: {
          id: string;
          number: number;
          title: string;
          format_month: number;
          format_year: number;
          duration_label: string;
          is_new: boolean;
          is_free: boolean;
          is_pro: boolean;
          content: Json;
          published_at: string;
        };
        Insert: { [_ in never]: never };
        Update: { [_ in never]: never };
        Relationships: [];
      };
      test_keys: {
        Row: {
          test_id: string;
          keys: Json;
        };
        Insert: { [_ in never]: never };
        Update: { [_ in never]: never };
        Relationships: [TestRelation<'test_keys_test_id_fkey'>];
      };
      attempts: {
        Row: {
          id: string;
          user_id: string;
          test_id: string;
          status: 'in_progress' | 'completed';
          current_section: string | null;
          completed_sections: string[];
          answers: Json;
          flags: string[];
          writing: Json;
          recordings: Json;
          ends_at: Json;
          started_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          test_id: string;
          current_section?: string | null;
          completed_sections?: string[];
          answers?: Json;
          flags?: string[];
          writing?: Json;
          recordings?: Json;
          ends_at?: Json;
        };
        Update: {
          current_section?: string | null;
          completed_sections?: string[];
          answers?: Json;
          flags?: string[];
          writing?: Json;
          recordings?: Json;
          ends_at?: Json;
        };
        Relationships: [TestRelation<'attempts_test_id_fkey'>];
      };
      results: {
        Row: {
          id: string;
          user_id: string;
          attempt_id: string;
          test_id: string;
          listening: number;
          reading: number;
          writing: number;
          speaking: number;
          total: number;
          answers: Json;
          duration_sec: number;
          created_at: string;
        };
        Insert: { [_ in never]: never };
        Update: { [_ in never]: never };
        Relationships: [TestRelation<'results_test_id_fkey'>];
      };
      ai_reviews: {
        Row: {
          id: string;
          result_id: string;
          user_id: string;
          kind: 'writing' | 'speaking';
          status: 'pending' | 'processing' | 'ready' | 'failed';
          score: number | null;
          review: Json | null;
          error: string | null;
          runs: number;
          created_at: string;
          updated_at: string;
        };
        Insert: { [_ in never]: never };
        Update: { [_ in never]: never };
        Relationships: [
          {
            foreignKeyName: 'ai_reviews_result_id_fkey';
            columns: ['result_id'];
            isOneToOne: false;
            referencedRelation: 'results';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          kind: 'result' | 'aiReview' | 'reminder' | 'newTest' | 'exam';
          params: Json;
          url: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: { [_ in never]: never };
        Update: {
          read?: boolean;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      submit_attempt: {
        Args: { attempt_id: string };
        Returns: string;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Tables<Name extends keyof Database['public']['Tables']> = Database['public']['Tables'][Name]['Row'];
