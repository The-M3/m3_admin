"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Session, User } from '@supabase/supabase-js'
import supabase from '../../supabase-client'

interface UseAuthReturn {
  session: Session | null
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const getSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()

      console.log('session', session)
      
      if (error) {
        console.error('Error fetching session:', error)
        setSession(null)
      } else {
        setSession(session)
      }
    } catch (error) {
      console.error('Session fetch failed:', error)
      setSession(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
 

    getSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        setSession(session)
        setLoading(false)
        
        if (event === 'SIGNED_OUT') {
          router.push('/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return {
    session,
    user: session?.user ?? null,
    loading,
    signOut
  }
}
