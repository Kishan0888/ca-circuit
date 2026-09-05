'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  IndianRupee,
  ArrowRight,
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle,
  Star,
  Handshake,
  Store,
  Lightbulb,
  FileCheck,
  BriefcaseBusiness,
  Landmark,
  Building2,
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES } from '@/constants';
import { useOpportunities } from '@/hooks/useOpportunities';

export default function Home() {
  const { opportunities: latestOpportunities, loading } = useOpportunities();
  const features = [
  {
    icon: BriefcaseBusiness,
    title: "Business Opportunities",
    description:
      "Discover verified business buying, selling and investment opportunities from across India.",
  },
  {
    icon: Handshake,
    title: "Referral Collaboration",
    description:
      "Partner with trusted Chartered Accountants and collaborate on client referrals.",
  },
  {
    icon: Landmark,
    title: "Fund Raising",
    description:
      "Connect businesses with investors, lenders and financial institutions.",
  },
  {
    icon: Building2,
    title: "M&A Advisory",
    description:
      "Support mergers, acquisitions and strategic business transactions.",
  },
  {
    icon: TrendingUp,
    title: "Practice Growth",
    description:
      "Expand your CA practice through quality referrals and long-term partnerships.",
  },
  {
    icon: Users,
    title: "Nationwide Network",
    description:
      "Build meaningful connections with Chartered Accountants across India.",
  },
];

const earningSteps = [
  {
    icon: BriefcaseBusiness,
    title: "Post an Opportunity",
    description:
      "Share a business requirement, investment proposal or client opportunity with verified Chartered Accountants.",
  },
  {
    icon: Handshake,
    title: "Connect with the Right CA",
    description:
      "Find experienced professionals across India who match your expertise and business needs.",
  },
  {
    icon: FileCheck,
    title: "Close the Deal",
    description:
      "Work together professionally, complete the transaction and build long-term business relationships.",
  },
  {
    icon: IndianRupee,
    title: "Earn Success Fee",
    description:
      "Generate professional income through successful collaborations, referrals and advisory engagements.",
  },
];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
<section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#f8f3e8_0%,#ffffff_45%,#f8fafc_100%)] py-28 md:py-36">
  {/* Gold Glow */}
  <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gold/10 blur-[140px]" />
  <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
       
   <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

     {/* Introductory Video */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.3 }}
  className="mt-12 max-w-5xl mx-auto"
>
  <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-2xl bg-black">
    <video
  src="/The CA Connect.mp4"
  autoPlay
  loop
  playsInline
  controls
  className="w-full h-full object-cover"
>
  Your browser does not support the video tag.
</video>
  </div>
</motion.div>

    
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-gold text-white hover:bg-gold/90">India's First CA Network</Badge>
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-heading mb-6 leading-tight">
              Connect • Collaborate • <span className="text-gold">Create Value</span>
            </h1>
            <div className="mb-8 max-w-3xl mx-auto text-center">
  <p className="text-lg md:text-xl text-foreground/80">
  The professional networking platform exclusively built for
</p>

<h2 className="mt-2 mb-2 font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-gold">
  Chartered Accountants
</h2>

<p className="text-lg md:text-xl text-foreground/80">
  to share business opportunities and grow together.
</p>
</div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/opportunities">
                <Button size="lg" className="bg-gold hover:bg-gold/90 text-white text-lg px-8">
                  Explore Opportunities
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="text-lg px-8 border-primary text-primary hover:bg-primary hover:text-white">
                  Join The Network Today
                </Button>
              </Link>
            </div>
          </motion.div>


          {/* Stats */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Active CAs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">Opportunities</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">₹50Cr+</div>
              <div className="text-sm text-muted-foreground">Investment Value</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">200+</div>
              <div className="text-sm text-muted-foreground">Successful Connections</div>
            </div>
          </motion.div>
        </div>
      </section> */}
      {/* What the Network Does */}
<section className="py-24 bg-background">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="font-heading text-4xl md:text-5xl font-bold text-heading">
        What the <span className="text-gold">Network Does</span>
      </h2>

      <p className="mt-5 max-w-3xl mx-auto text-lg text-muted-foreground">
        CA Connect empowers Chartered Accountants to collaborate, share opportunities,
        expand their professional network and create new revenue streams through
        trusted partnerships across India.
      </p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

      {features.map((feature, index) => {
        const Icon = feature.icon;

        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full rounded-2xl border hover:border-gold transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

              <CardContent className="p-8">

                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6">

                  <Icon className="w-7 h-7 text-gold" />

                </div>

                <h3 className="text-2xl font-semibold text-heading mb-3">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground leading-7">
                  {feature.description}
                </p>

              </CardContent>

            </Card>
          </motion.div>
        );

      })}

    </div>

  </div>
</section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-4xl font-bold text-heading mb-4">Explore Categories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find opportunities across various business categories tailored for Chartered Accountants
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/opportunities?category=${category.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-gold">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        {category.icon === 'Handshake' && <Handshake className="h-6 w-6 text-primary" />}
                        {category.icon === 'Store' && <Store className="h-6 w-6 text-primary" />}
                        {category.icon === 'TrendingUp' && <TrendingUp className="h-6 w-6 text-primary" />}
                        {category.icon === 'Briefcase' && <Briefcase className="h-6 w-6 text-primary" />}
                        {category.icon === 'Lightbulb' && <Lightbulb className="h-6 w-6 text-primary" />}
                        {category.icon === 'FileCheck' && <FileCheck className="h-6 w-6 text-primary" />}
                      </div>
                      <h3 className="font-semibold text-heading">{category.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

{/* How You Earn */}

<section className="py-24 bg-white">

  <div className="container mx-auto px-4 sm:px-6 lg:px-8">

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >

      <Badge className="mb-4 bg-gold/10 text-gold border border-gold/20">
        PROFESSIONAL GROWTH
      </Badge>

      <h2 className="font-heading text-4xl md:text-5xl font-bold text-heading">

        How You <span className="text-gold">Earn</span>

      </h2>

      <p className="mt-5 max-w-3xl mx-auto text-lg text-muted-foreground leading-8">

        CA Connect helps you transform professional connections into real
        business opportunities. Collaborate with verified Chartered
        Accountants, close deals, and grow your practice through trusted
        partnerships.

      </p>

    </motion.div>

    <div className="relative">

      <div className="hidden lg:block absolute top-10 left-0 right-0 h-1 bg-gradient-to-r from-gold/20 via-gold to-gold/20 rounded-full" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {earningSteps.map((step, index) => {

          const Icon = step.icon;

          return (

            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >

              <Card className="relative h-full rounded-3xl border border-slate-200 hover:border-gold hover:shadow-2xl hover:-translate-y-3 transition-all duration-300">

                <CardContent className="p-8 flex flex-col h-full">

                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-6 shadow-md">

                    <Icon className="w-8 h-8 text-gold" />

                  </div>

                  <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gold text-white flex items-center justify-center font-bold">

                    {index + 1}

                  </div>

                  <h3 className="text-2xl font-bold text-heading mb-4">

                    {step.title}

                  </h3>

                  <p className="text-muted-foreground leading-7 flex-grow">

                    {step.description}

                  </p>

                  <div className="mt-8 flex items-center text-gold font-semibold">

                    Learn More

                    <ArrowRight className="ml-2 w-4 h-4" />

                  </div>

                </CardContent>

              </Card>

            </motion.div>

          );

        })}

      </div>

    </div>

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-20"
    >

      <div className="rounded-3xl bg-gradient-to-r from-primary to-[#0f274f] text-white p-10 text-center shadow-2xl">

        <h3 className="text-3xl font-heading font-bold mb-4">

          Every Connection Can Become Your Next Client

        </h3>

        <p className="text-white/80 max-w-3xl mx-auto mb-8">

          Build trusted partnerships, discover high-value business opportunities,
          and earn through referrals, advisory services and successful
          collaborations.

        </p>

        <Link href="/opportunities">

          <Button
            size="lg"
            className="bg-gold hover:bg-[#b8860b] text-white rounded-full px-8"
          >

            Explore Opportunities

            <ArrowRight className="ml-2 h-5 w-5" />

          </Button>

        </Link>

      </div>

    </motion.div>

  </div>

</section>
      {/* Latest Opportunities */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="font-heading text-4xl font-bold text-heading mb-2">Latest Opportunities</h2>
              <p className="text-lg text-muted-foreground">Fresh opportunities posted by verified CAs</p>
            </div>
            <Link href="/opportunities">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">Loading opportunities...</div>
            ) : latestOpportunities.slice(0, 6).map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/opportunities/${opportunity.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    {opportunity.images.length > 0 && (
                      <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-t-lg" />
                    )}
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary">{opportunity.category}</Badge>
                        {opportunity.isFeatured && <Badge className="bg-gold text-white">Featured</Badge>}
                      </div>
                      <CardTitle className="text-xl line-clamp-2">{opportunity.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{opportunity.shortDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{opportunity.city}</span>
                        <span>{opportunity.investmentRange}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-4xl font-bold text-heading mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to start connecting with opportunities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Users,
                title: 'Create Profile',
                description: 'Register as a CA or professional to access the platform',
              },
              {
                icon: Briefcase,
                title: 'Browse Opportunities',
                description: 'Explore curated business opportunities from verified CAs',
              },
              {
                icon: CheckCircle,
                title: 'Connect & Collaborate',
                description: 'Connect with opportunity posters and build partnerships',
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">Ready to Grow Your Network?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of Chartered Accountants already using THE CA Connect to discover and share business opportunities.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-white text-lg px-8">
                Join Now - It's Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-4xl font-bold text-heading mb-4">What Our Members Say</h2>
            <p className="text-lg text-muted-foreground">Success stories from our community</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Rajesh Kumar',
                role: 'CA, Mumbai',
                content: 'THE CA Connect helped me find the perfect partnership opportunity for my practice. The platform is professional and trustworthy.',
                rating: 5,
              },
              {
                name: 'Priya Sharma',
                role: 'CA, Delhi',
                content: 'I connected with multiple investors through this platform. The admin approval process ensures quality opportunities.',
                rating: 5,
              },
              {
                name: 'Amit Patel',
                role: 'CA, Bangalore',
                content: 'Best networking platform for CAs in India. I found my current business partner here. Highly recommended!',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
