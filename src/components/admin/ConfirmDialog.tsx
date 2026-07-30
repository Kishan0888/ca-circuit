'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  destructive?: boolean;
  requireReason?: boolean;
  reasonLabel?: string;
  loading?: boolean;
  onConfirm: (reason?: string) => void;
}

// Shared confirmation dialog for approve/reject/suspend/delete style admin actions.
// When requireReason is set (e.g. rejecting an opportunity), the confirm button
// stays disabled until the admin types something.
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  destructive = false,
  requireReason = false,
  reasonLabel = 'Reason',
  loading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(requireReason ? reason.trim() : undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {requireReason && (
          <div className="space-y-2">
            <label className="text-sm font-medium">{reasonLabel}</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why, so the poster understands the decision..."
              rows={3}
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={loading || (requireReason && reason.trim().length === 0)}
          >
            {loading ? 'Please wait…' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
