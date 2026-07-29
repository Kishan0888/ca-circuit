'use client';

import { motion } from 'framer-motion';
import { UserPlus, Search, Handshake, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function HowItWorksPage() {
  const steps = [
    {
      icon: UserPlus,
      title: 'Create Your Account',
      description: 'Sign up as a Chartered Accountant or Professional. Verify your credentials to unlock full platform access.',
    },
    {
      icon: Search,
      title: 'Discover Opportunities',
      description: 'Browse through verified business opportunities, partnerships, and investments from trusted CAs across India.',
    },
    {
      icon: Handshake,
      title: 'Connect & Collaborate',
      description: 'Express interest, bookmark opportunities, and connect directly with opportunity posters through secure messaging.',
    },
    {
      icon: Shield,
      title: 'Grow Together',
      description: 'Build lasting professional relationships, share knowledge, and grow your practice with the CA community.',
    },
  ];

  const features = [
    'Verified CA profiles for trust and authenticity',
    'Curated business opportunities matching your interests',
    'Secure messaging and contact information sharing',
    'Admin-approved content quality control',
    'Advanced search and filtering capabilities',
    'Bookmark and track opportunities of interest',
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-5xl font-bold text-heading mb-4">How It Works</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Getting started on THE CA CIRCUIT is simple. Follow these steps to connect with opportunities and grow your professional network.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                      <step.icon className="h-6 w-6 text-gold" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* For CAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <Card className="bg-primary text-white">
            <CardHeader>
              <CardTitle className="text-3xl font-heading">For Chartered Accountants</CardTitle>
              <CardDescription className="text-gray-300">
                Share opportunities and connect with fellow CAs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                <p>Post business opportunities, partnerships, and investment opportunities</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                <p>Get your opportunities reviewed and approved by admin for quality control</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                <p>Connect with interested professionals and investors directly</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                <p>Build your professional profile and showcase your expertise</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* For Professionals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-heading">For Professionals & Investors</CardTitle>
              <CardDescription>
                Discover opportunities from verified Chartered Accountants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                <p>Browse verified opportunities from trusted Chartered Accountants</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                <p>Filter by category, industry, investment range, and location</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                <p>Express interest and connect directly with opportunity posters</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                <p>Bookmark opportunities and track your interactions</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="font-heading text-3xl font-bold text-heading mb-8 text-center">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.05 }}
              >
                <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-gold flex-shrink-0" />
                  <p className="text-sm">{feature}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl font-bold text-heading mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of Chartered Accountants and professionals already using THE CA CIRCUIT to grow their network.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-gold hover:bg-gold/90 text-white">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/opportunities">
              <Button variant="outline">
                Browse Opportunities
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
