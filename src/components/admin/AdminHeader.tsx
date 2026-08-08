'use client';

import { useState } from 'react';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { AdminSidebarContent } from '@/components/admin/AdminSidebar';

interface AdminHeaderProps {
  title: string;
  description?: string;
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  const { userData, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const initials = (userData?.name || 'A')
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetContent side="left" className="p-0 w-72">
              <SheetTitle className="sr-only">Admin navigation</SheetTitle>
              <AdminSidebarContent onNavigate={() => setMobileNavOpen(false)} />
            </SheetContent>
          </Sheet>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden shrink-0"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open admin menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="font-heading text-lg sm:text-xl font-bold text-heading truncate">{title}</h1>
            {description && <p className="text-xs sm:text-sm text-muted-foreground truncate">{description}</p>}
          </div>
        </div>

        <DropdownMenu>
           <DropdownMenuTrigger className="flex items-center gap-2 px-2">
  <Avatar className="h-8 w-8">
    <AvatarImage
      src={userData?.profileImage}
      alt={userData?.name}
    />
    <AvatarFallback>{initials}</AvatarFallback>
  </Avatar>

  <span className="hidden sm:block text-sm font-medium max-w-[140px] truncate">
    {userData?.name || 'Admin'}
  </span>
</DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href="/dashboard" className="flex items-center w-full">
                <UserIcon className="mr-2 h-4 w-4" />
                My Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
