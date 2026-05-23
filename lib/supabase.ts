import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wtckjljbmmphrzgsjbfj.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0Y2tqbGpibW1waHJ6Z3NqYmZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MDk3OTEsImV4cCI6MjA5NTA4NTc5MX0.nxEdFgzamvGjHD0OjjJ7ILScNZUgtw3B7T7FFSwRgiY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type FoodLog = {
  id: string
  user_id: string
  logged_date: string
  food_name: string
  brand?: string
  barcode?: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  serving_size?: string
  servings: number
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  created_at: string
}

export type WeightLog = {
  id: string
  user_id: string
  logged_date: string
  weight_kg: number
  logged_at: string
}

export type DailyLog = {
  id: string
  user_id: string
  log_date: string
  steps: number
  water_glasses: number
  notes?: string
  updated_at: string
}

export type Profile = {
  id: string
  email: string
  calorie_goal: number
  protein_goal: number
  carbs_goal: number
  fat_goal: number
  step_goal: number
  water_goal: number
}

export type FavouriteFood = {
  id: string
  user_id: string
  food_name: string
  brand?: string
  barcode?: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  serving_size?: string
  log_count: number
}
