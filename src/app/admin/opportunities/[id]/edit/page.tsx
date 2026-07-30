'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { OpportunityForm } from '@/components/admin/OpportunityForm';
import { EmptyState } from '@/components/admin/EmptyState';
import { opportunityService } from '@/services/opportunity.service';
import { Opportunity } from '@/types';
import { FileWarning, Loader2 } from 'lucide-react';

export default function EditOpportunityPage() {
  const params = useParams();
  const id = params.id as string;
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    opportunityService.getOpportunityById(id).then((opp) => {
      if (active) {
        setOpportunity(opp);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div>
      <AdminHeader title="Edit Opportunity" description={opportunity?.title} />
      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading…
          </div>
        ) : opportunity ? (
          <OpportunityForm existing={opportunity} />
        ) : (
          <EmptyState icon={FileWarning} title="Opportunity not found" description="It may have been deleted." />
        )}
      </div>
    </div>
  );
}
