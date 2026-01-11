/**
 * API Client Example
 * 
 * This file demonstrates how to use the account deletion API
 * from your frontend components or pages.
 */

import { getSupabaseBrowserClient } from '@/lib/supabase/client'

// ==========================================
// Example 1: Check if user is authenticated
// ==========================================

export async function example1_CheckAuth() {
  const supabase = getSupabaseBrowserClient()
  
  // Get current session
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    console.log('User is not authenticated')
    return false
  }
  
  // Call auth check API
  const response = await fetch('/api/auth/check', {
    headers: {
      'Authorization': `Bearer ${session.access_token}`
    }
  })
  
  const data = await response.json()
  console.log('Auth status:', data)
  
  return data.authenticated
}

// ==========================================
// Example 2: Submit deletion request
// ==========================================

export async function example2_SubmitDeletionRequest(reason: string) {
  const supabase = getSupabaseBrowserClient()
  
  // Get current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError || !session) {
    throw new Error('User must be authenticated')
  }
  
  // Submit deletion request
  const response = await fetch('/api/account-deletion/request', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: session.user.email,
      reason: reason
    })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to submit request')
  }
  
  const result = await response.json()
  console.log('Request submitted:', result)
  
  return result
}

// ==========================================
// Example 3: Get user's deletion requests
// ==========================================

export async function example3_GetMyDeletionRequests() {
  const supabase = getSupabaseBrowserClient()
  
  // Get current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError || !session) {
    throw new Error('User must be authenticated')
  }
  
  // Fetch deletion requests
  const response = await fetch('/api/account-deletion/request', {
    headers: {
      'Authorization': `Bearer ${session.access_token}`
    }
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch requests')
  }
  
  const result = await response.json()
  console.log('My requests:', result.data)
  
  return result.data
}

// ==========================================
// Example 4: Admin - Get all requests
// ==========================================

export async function example4_AdminGetAllRequests(status: string = 'pending') {
  const supabase = getSupabaseBrowserClient()
  
  // Get current session (must be admin)
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError || !session) {
    throw new Error('Admin must be authenticated')
  }
  
  // Fetch all deletion requests
  const response = await fetch(
    `/api/account-deletion/admin?status=${status}&limit=50&offset=0`,
    {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    }
  )
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch requests')
  }
  
  const result = await response.json()
  console.log('All requests:', result.data)
  console.log('Pagination:', result.pagination)
  
  return result
}

// ==========================================
// Example 5: Admin - Process a request
// ==========================================

export async function example5_AdminProcessRequest(
  requestId: string,
  action: 'approved' | 'rejected' | 'completed',
  notes?: string
) {
  const supabase = getSupabaseBrowserClient()
  
  // Get current session (must be admin)
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError || !session) {
    throw new Error('Admin must be authenticated')
  }
  
  // Process deletion request
  const response = await fetch('/api/account-deletion/admin', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      request_id: requestId,
      action: action,
      notes: notes
    })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to process request')
  }
  
  const result = await response.json()
  console.log('Request processed:', result)
  
  return result
}

// ==========================================
// Example 6: React Component Usage
// ==========================================

/*
export function Example6_ReactComponent() {
  // In your React component (.tsx file):
  
  const handleSubmitDeletion = async () => {
    try {
      const result = await example2_SubmitDeletionRequest(
        'I no longer need this account'
      )
      
      alert('Request submitted successfully!')
      console.log(result)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred')
      console.error(error)
    }
  }
  
  return (
    <button onClick={handleSubmitDeletion}>
      Submit Deletion Request
    </button>
  )
}
*/

// ==========================================
// Example 7: Check deletion request status
// ==========================================

export async function example7_CheckDeletionStatus() {
  try {
    const requests = await example3_GetMyDeletionRequests()
    
    if (requests.length === 0) {
      console.log('No deletion requests found')
      return null
    }
    
    // Get the most recent request
    const latestRequest = requests[0]
    
    console.log('Latest request status:', latestRequest.status)
    console.log('Requested at:', new Date(latestRequest.requested_at).toLocaleString())
    
    if (latestRequest.processed_at) {
      console.log('Processed at:', new Date(latestRequest.processed_at).toLocaleString())
    }
    
    return latestRequest
  } catch (error) {
    console.error('Error checking status:', error)
    return null
  }
}

// ==========================================
// Example 8: Using with Next.js Server Actions
// ==========================================

/*
 * Create a separate file for server actions (e.g., actions/deletion.ts)
 * Add 'use server' at the top of that file
 * 
 * Example:
 * 
 * 'use server'
 * 
 * import { cookies } from 'next/headers'
 * 
 * export async function submitDeletionServerAction(formData: FormData) {
 *   const reason = formData.get('reason') as string
 *   const cookieStore = await cookies()
 *   const supabaseToken = cookieStore.get('supabase-auth-token')
 *   
 *   // Make API call...
 * }
 */

// ==========================================
// Example 9: Error Handling
// ==========================================

export async function example9_WithErrorHandling() {
  try {
    const result = await example2_SubmitDeletionRequest('Test reason')
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific error messages
      if (error.message.includes('authenticated')) {
        return { success: false, error: 'Please login first' }
      }
      if (error.message.includes('minimal 10 karakter')) {
        return { success: false, error: 'Reason must be at least 10 characters' }
      }
      if (error.message.includes('sudah memiliki permintaan')) {
        return { success: false, error: 'You already have a pending request' }
      }
      
      return { success: false, error: error.message }
    }
    
    return { success: false, error: 'An unknown error occurred' }
  }
}

// ==========================================
// Example 10: Polling for status updates
// ==========================================

export function example10_PollRequestStatus(
  requestId: string,
  onStatusChange: (status: string) => void
) {
  let currentStatus = ''
  
  const checkStatus = async () => {
    try {
      const requests = await example3_GetMyDeletionRequests()
      const request = requests.find((r: { id: string; status: string }) => r.id === requestId)
      
      if (request && request.status !== currentStatus) {
        currentStatus = request.status
        onStatusChange(currentStatus)
      }
    } catch (error) {
      console.error('Error checking status:', error)
    }
  }
  
  // Check immediately
  checkStatus()
  
  // Poll every 30 seconds
  const interval = setInterval(checkStatus, 30000)
  
  // Return cleanup function
  return () => clearInterval(interval)
}

// Usage:
// const cleanup = example10_PollRequestStatus('request-id', (status) => {
//   console.log('Status changed to:', status)
// })
// 
// When component unmounts:
// cleanup()
