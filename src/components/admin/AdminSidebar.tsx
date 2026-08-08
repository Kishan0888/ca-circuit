'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase,Heart, Users, BarChart3, ShieldCheck, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ADMIN_NAV_LINKS } from '@/constants';

const ICONS: Record<string, typeof LayoutDashboard> = {
  LayoutDashboard,
  Briefcase,
  Heart,
  Users,
  BarChart3,
};

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export function AdminSidebarContent({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-sidebar-border">
        <div className="w-9 h-9 bg-sidebar-primary rounded-lg flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <p className="font-heading font-bold text-sm leading-tight">CA Connect</p>
          <p className="text-xs text-muted-foreground leading-tight">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {ADMIN_NAV_LINKS.map((link) => {
          const Icon = ICONS[link.icon];
          const isActive = link.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          Back to site
        </Link>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 border-r border-sidebar-border z-40">
      <AdminSidebarContent />
    </aside>
  );
}
