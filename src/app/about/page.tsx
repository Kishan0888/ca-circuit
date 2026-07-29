'use client';

import { motion } from 'framer-motion';
import { Target, Users, Shield, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-5xl font-bold text-heading mb-4">About THE CA CIRCUIT</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            India's first professional networking platform exclusively built for Chartered Accountants to connect, collaborate, and create value together.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <Card className="bg-primary text-white">
            <CardHeader>
              <CardTitle className="text-3xl font-heading">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                To empower Chartered Accountants across India by providing a trusted platform where they can discover business opportunities, form strategic partnerships, share knowledge, and grow their professional network. We believe in the power of collaboration and the strength of a united CA community.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="font-heading text-3xl font-bold text-heading mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-gold" />
                </div>
                <CardTitle>Trust & Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every CA on our platform is verified, ensuring a trustworthy environment for professional networking.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-gold" />
                </div>
                <CardTitle>Community First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Building a strong, supportive community where CAs help each other grow and succeed.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-gold" />
                </div>
                <CardTitle>Quality Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Curated, verified business opportunities that match the high standards of the CA profession.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-gold" />
                </div>
                <CardTitle>Professional Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Upholding the highest standards of professionalism in every interaction on our platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-heading">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                THE CA CIRCUIT was born from a simple observation: while Chartered Accountants are among the most respected professionals in India, there was no dedicated platform for them to connect and explore business opportunities together.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded by a team of CAs and tech enthusiasts, we understood the unique challenges faced by Chartered Accountants in finding the right partners, investors, or opportunities. Traditional networking platforms were too generic, and industry-specific options were limited.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We built THE CA CIRCUIT to bridge this gap - a platform that understands the CA profession, speaks their language, and provides the tools they need to grow their practices, explore new ventures, and build lasting professional relationships.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl font-bold text-heading mb-4">Join Our Community</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be part of India's fastest-growing network of Chartered Accountants. Connect, collaborate, and create value.
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
