'use client';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { OpportunityForm } from '@/components/admin/OpportunityForm';

export default function NewOpportunityPage() {
  return (
    <div>
      <AdminHeader title="New Opportunity" description="Create and publish an opportunity directly" />
      <div className="p-4 sm:p-6">
        <OpportunityForm />
      </div>
    </div>
  );
}
