import React from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'

function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>{children}</DashboardLayout>
  )
}

export default UsersLayout