'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What is THE CA CIRCUIT?',
      answer: 'THE CA CIRCUIT is India\'s first professional networking platform exclusively built for Chartered Accountants. It\'s a place where CAs can discover business opportunities, form partnerships, and connect with fellow professionals in a trusted environment.',
    },
    {
      question: 'Who can join THE CA CIRCUIT?',
      answer: 'Chartered Accountants with valid credentials can join as CA members. Professionals, investors, and businesses interested in connecting with CAs can also join as registered users. All CA profiles are verified for authenticity.',
    },
    {
      question: 'How do I verify my CA credentials?',
      answer: 'During registration, you\'ll need to provide your CA membership number and other verification details. Our team will verify your credentials with ICAI records before activating your CA profile. This typically takes 1-2 business days.',
    },
    {
      question: 'Is it free to join?',
      answer: 'Yes, we offer a free plan that allows you to browse opportunities, create a profile, and express interest. For advanced features like direct contact access and unlimited opportunity postings, we have paid Professional and Enterprise plans.',
    },
    {
      question: 'How are opportunities verified?',
      answer: 'All opportunities posted by CAs go through an admin approval process to ensure quality and authenticity. Our team reviews each opportunity before it goes live on the platform.',
    },
    {
      question: 'Can I post opportunities as a non-CA user?',
      answer: 'Currently, only verified Chartered Accountants can post opportunities. However, professionals and investors can browse, express interest, and connect with CA posters.',
    },
    {
      question: 'How do I contact an opportunity poster?',
      answer: 'Once you\'re logged in, you can view contact information for opportunities (depending on your membership plan). You can also express interest in opportunities, and the poster can reach out to you directly.',
    },
    {
      question: 'What types of opportunities can I find?',
      answer: 'You can find various opportunities including partnership opportunities, job openings, investment opportunities, practice sales, mergers, and collaboration requests across different industries and locations.',
    },
    {
      question: 'How do I bookmark opportunities?',
      answer: 'Simply click the bookmark icon on any opportunity card to save it to your bookmarks. You can access all your bookmarked opportunities from your dashboard.',
    },
    {
      question: 'Can I edit or delete my posted opportunities?',
      answer: 'Yes, you can edit or delete opportunities you\'ve posted from your dashboard. However, once an opportunity is approved and published, you\'ll need admin approval to make significant changes.',
    },
    {
      question: 'How does the interest system work?',
      answer: 'When you express interest in an opportunity, the poster receives a notification. They can then review your profile and decide to connect with you. You can track all your expressed interests from your dashboard.',
    },
    {
      question: 'Is my contact information shared publicly?',
      answer: 'Your contact information is only shared with opportunity posters when you express interest or when they approve your connection request. You have full control over your privacy settings.',
    },
    {
      question: 'What if I forget my password?',
      answer: 'You can reset your password by clicking "Forgot Password" on the login page. We\'ll send a password reset link to your registered email address.',
    },
    {
      question: 'Can I change my account type later?',
      answer: 'Yes, you can upgrade from a registered user to a CA profile by providing your CA credentials for verification. Contact our support team for assistance with this process.',
    },
    {
      question: 'How do I report inappropriate content?',
      answer: 'If you come across any inappropriate or suspicious content, please report it using the report button on the opportunity or contact our support team. We take all reports seriously and investigate them promptly.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-4">
            <HelpCircle className="h-8 w-8 text-gold" />
          </div>
          <h1 className="font-heading text-5xl font-bold text-heading mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about THE CA CIRCUIT. Can't find what you're looking for? Contact our support team.
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Card>
                <CardHeader>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-0 h-auto"
                    onClick={() => toggleFAQ(index)}
                  >
                    <CardTitle className="text-lg text-left">{faq.question}</CardTitle>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                </CardHeader>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-3xl mx-auto mt-16"
        >
          <Card className="bg-primary text-white">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">Still Have Questions?</CardTitle>
              <CardDescription className="text-gray-300">
                Our support team is here to help you with any questions or concerns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="bg-gold hover:bg-gold/90 text-white">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
