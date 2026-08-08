'use client';
import Image from "next/image";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { CONTACT_INFO, SOCIAL_LINKS, NAV_LINKS } from '@/constants';

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
  <Image
  src="/logo.png"
  alt="CA Connect"
  width={100}
  height={10}
  priority
  unoptimized
  className="..."
/>
</Link>
            <p className="text-sm text-gray-300">
  India&apos;s professional networking platform built for Chartered Accountants to connect, collaborate, and discover business opportunities.
            </p>
            <div className="flex space-x-4">
              <Link href={SOCIAL_LINKS.linkedin} className="text-gray-300 hover:text-gold transition-colors">
                <ExternalLink className="h-5 w-5" />
              </Link>
              <Link href={SOCIAL_LINKS.twitter} className="text-gray-300 hover:text-gold transition-colors">
                <ExternalLink className="h-5 w-5" />
              </Link>
              <Link href={SOCIAL_LINKS.facebook} className="text-gray-300 hover:text-gold transition-colors">
                <ExternalLink className="h-5 w-5" />
              </Link>
              <Link href={SOCIAL_LINKS.instagram} className="text-gray-300 hover:text-gold transition-colors">
                <ExternalLink className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/opportunities?category=partnership" className="text-sm text-gray-300 hover:text-gold transition-colors">
                  Partnership
                </Link>
              </li>
              <li>
                <Link href="/opportunities?category=franchise" className="text-sm text-gray-300 hover:text-gold transition-colors">
                  Franchise
                </Link>
              </li>
              <li>
                <Link href="/opportunities?category=investment" className="text-sm text-gray-300 hover:text-gold transition-colors">
                  Investment
                </Link>
              </li>
              <li>
                <Link href="/opportunities?category=consulting" className="text-sm text-gray-300 hover:text-gold transition-colors">
                  Consulting
                </Link>
              </li>
              <li>
                <Link href="/opportunities?category=advisory" className="text-sm text-gray-300 hover:text-gold transition-colors">
                  Advisory
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-sm text-gray-300 hover:text-gold transition-colors"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
              
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">{CONTACT_INFO.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} THE CA Connect. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-gold transition-colors">
                Terms of Service
              </Link>
              <Link href="/refund" className="text-sm text-gray-400 hover:text-gold transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
