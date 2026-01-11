import { getSupabaseBrowserClient } from './client'

/**
 * Get the current authenticated user from Supabase
 */
export async function getCurrentUser() {
  const supabase = getSupabaseBrowserClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

/**
 * Get the current session
 */
export async function getSession() {
  const supabase = getSupabaseBrowserClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    return null
  }
  
  return session
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw error
  }
}
