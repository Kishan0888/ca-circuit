'use client';
import Image from "next/image";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Search,
  LogOut,
  Bell,
  Upload,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { NAV_LINKS } from '@/constants';

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userData, logout } = useAuth();
  const { unreadCount } = useNotifications(user?.uid || '');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <motion.nav
  initial={{ y: -100 }}
  animate={{ y: 0 }}
  className="fixed top-5 left-0 right-0 z-50 px-4"
>
<div className="max-w-7xl mx-auto">
<div
  className={`flex items-center justify-between h-20 px-8 rounded-full transition-all duration-300 ${
    isScrolled
      ? "bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl"
      : "bg-white/70 backdrop-blur-lg border border-slate-100 shadow-lg"
  }`}
>          {/* Logo */}
          
            <Link href="/" className="flex items-center">
  <Image
  src="/logo.png"
  alt="CA Connect"
  width={180}
  height={70}
  priority
  unoptimized
  className="h-12 w-auto object-contain transition-all duration-300"
/>
</Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-semibold transition-all duration-300 hover:text-gold ${
  pathname === link.href
    ? "text-gold"
    : "text-slate-700"
}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Link href="/opportunities">
              <Button
  variant="ghost"
  size="icon"
  className="hidden sm:flex rounded-full hover:bg-gold/10"
>
                <Search className="h-5 w-5" />
              </Button>
            </Link>

            {/* Opportunity Actions */}
<div className="hidden lg:flex items-center gap-2">
  

  {user ? (
    <Link href="/dashboard/create-opportunity">
      <Button className="rounded-full bg-gold hover:bg-[#b8860b] text-white">
        <Upload className="mr-2 h-4 w-4" />
        Import Opportunity
      </Button>
    </Link>
  ) : (
    <Link href="/login?redirect=/dashboard/create-opportunity">
      <Button className="rounded-full bg-gold hover:bg-[#b8860b] text-white">
        <Upload className="mr-2 h-4 w-4" />
        Import Opportunity
      </Button>
    </Link>
  )}
</div>

            {user && userData ? (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="relative" />}>
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gold">
                          {unreadCount}
                        </Badge>
                      )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Notifications</div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/dashboard/notifications" className="w-full">
                        View All Notifications
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-10 w-10 rounded-full" />}>
                      <Avatar>
                        <AvatarImage src={userData.profileImage} alt={userData.name} />
                        <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex flex-col space-y-1 px-2 py-1.5">
                      <p className="text-sm font-medium">{userData.name}</p>
                      <p className="text-xs text-muted-foreground">{userData.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
        
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-full bg-gold hover:bg-[#b8860b] text-white px-6 shadow-lg hover:shadow-xl transition-all duration-300">Join Now</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
<AnimatePresence>
  {isMobileMenuOpen && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="md:hidden border-t border-border bg-background"
    >
      <div className="px-4 py-4 space-y-3">

        {/* Main Navigation */}
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block py-2 text-sm font-medium transition-colors hover:text-primary ${
              pathname === link.href
                ? 'text-primary'
                : 'text-foreground'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}

        {/* Mobile Action Buttons */}
        <div className="pt-2 space-y-2 border-t border-border">

          {/* Explore Opportunities */}
          <Link
            href="/opportunities"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block"
          >
            <Button
              variant="outline"
              className="w-full justify-center rounded-full border-gold text-gold hover:bg-gold/10"
            >
              Explore Opportunities
            </Button>
          </Link>

          {/* Submit / Import Opportunity */}
          <Link
            href={
              user
                ? "/dashboard/create-opportunity"
                : "/login?redirect=/dashboard/create-opportunity"
            }
            onClick={() => setIsMobileMenuOpen(false)}
            className="block"
          >
            <Button
              className="w-full justify-center rounded-full bg-gold hover:bg-[#b8860b] text-white"
            >
              Import Opportunity
            </Button>
          </Link>

        </div>

        {/* Authentication */}
        {!user ? (
          <div className="pt-2 border-t border-border space-y-1">
            <Link
              href="/login"
              className="block py-2 text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>

            <Link
              href="/register"
              className="block py-2 text-sm font-medium text-gold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Join Now
            </Link>
          </div>
        ) : null}

      </div>
    </motion.div>
  )}
</AnimatePresence>
    </motion.nav>
  );
}
