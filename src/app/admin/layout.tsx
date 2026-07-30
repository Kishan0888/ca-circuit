'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-muted/30">
        <AdminSidebar />
        <div className="lg:pl-64">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
