import React, { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import supabase from '../../supabase-client';
import { Session } from '@supabase/supabase-js';
import { Flex, Spinner } from '@chakra-ui/react';

interface LayoutProps {
  children: React.ReactNode;
}
export function ProtectedRoute({
  children
}: LayoutProps) {
  const router = useRouter()
  

  const getSession = async () => {
    try {
      const currentSession = await supabase.auth.getSession()

      if (currentSession.error) {
        console.error('Error fetching session:', currentSession.error)
      } else if (currentSession.data.session) {
        router.push('/dashboard/users')
      } else if (!currentSession.data.session) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Session fetch failed:', error)
    }
  }

  useEffect(() => {
    getSession()
  }, [])

  return <>{children}</>;
}