'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { opportunityService } from '@/services/opportunity.service';
import { storageService } from '@/services/storage.service';
import { CATEGORIES, INDUSTRIES, INVESTMENT_RANGES, BUSINESS_TYPES, STATES } from '@/constants';

export default function CreateOpportunityPage() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    industry: '',
    businessType: '',
    investmentRange: '',
    city: '',
    state: '',
    shortDescription: '',
    description: '',
    requirements: '',
    contactPreference: 'email' as 'email' | 'phone' | 'both',
    contactEmail: '',
    contactPhone: '',
    isUrgent: false,
    images: [] as File[],
    documents: [] as File[],
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      setError('Some files were not images and were skipped');
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles].slice(0, 5),
    }));
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files].slice(0, 3),
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title || !formData.category || !formData.industry || !formData.businessType ||
        !formData.investmentRange || !formData.city || !formData.state ||
        !formData.shortDescription || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.shortDescription.length > 200) {
      setError('Short description must be less than 200 characters');
      return;
    }

    if (formData.contactPreference === 'email' && !formData.contactEmail) {
      setError('Please provide contact email');
      return;
    }

    if (formData.contactPreference === 'phone' && !formData.contactPhone) {
      setError('Please provide contact phone');
      return;
    }

    if (formData.contactPreference === 'both' && (!formData.contactEmail || !formData.contactPhone)) {
      setError('Please provide both email and phone contact details');
      return;
    }

    setLoading(true);

    try {
      // Upload images
      const imageUrls = [];
      for (const image of formData.images) {
        const url = await storageService.uploadImage(image, `opportunities/${user?.uid}`);
        if (url) {
          imageUrls.push(url);
        }
      }

      // Upload documents
      const documentUrls = [];
      for (const document of formData.documents) {
        const url = await storageService.uploadDocument(document, `opportunities/${user?.uid}`);
        if (url) {
          documentUrls.push(url);
        }
      }

      // Create opportunity
      const opportunityData: any = {
        title: formData.title,
        category: formData.category,
        industry: formData.industry,
        businessType: formData.businessType,
        investmentRange: formData.investmentRange,
        city: formData.city,
        state: formData.state,
        shortDescription: formData.shortDescription,
        description: formData.description,
        requirements: formData.requirements,
        contactPreference: formData.contactPreference,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        isUrgent: formData.isUrgent,
        images: imageUrls,
        documents: documentUrls,
        status: 'pending',
      };

      const result = await opportunityService.createOpportunity(opportunityData, user?.uid || '', userData?.name || '');
      
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Failed to create opportunity');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="font-heading text-4xl font-bold text-heading mb-2">Create Opportunity</h1>
          <p className="text-muted-foreground">Share a business opportunity with the CA community</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Details</CardTitle>
              <CardDescription>Fill in the details about your opportunity</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-heading text-lg font-semibold">Basic Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Partnership Opportunity for CA Firm"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry *</Label>
                      <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRIES.map((ind) => (
                            <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUSINESS_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="investmentRange">Investment Range *</Label>
                      <Select value={formData.investmentRange} onValueChange={(value) => handleInputChange('investmentRange', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          {INVESTMENT_RANGES.map((range) => (
                            <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        placeholder="e.g., Mumbai"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATES.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description * (max 200 chars)</Label>
                    <Textarea
                      id="shortDescription"
                      placeholder="Brief summary of the opportunity..."
                      value={formData.shortDescription}
                      onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                      maxLength={200}
                      rows={2}
                      required
                    />
                    <p className="text-xs text-muted-foreground">{formData.shortDescription.length}/200</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed information about the opportunity..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={6}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements (Optional)</Label>
                    <Textarea
                      id="requirements"
                      placeholder="What are you looking for in a partner/investor?"
                      value={formData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-heading text-lg font-semibold">Contact Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactPreference">Contact Preference *</Label>
                    <Select value={formData.contactPreference} onValueChange={(value: any) => handleInputChange('contactPreference', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email Only</SelectItem>
                        <SelectItem value="phone">Phone Only</SelectItem>
                        <SelectItem value="both">Both Email and Phone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(formData.contactPreference === 'email' || formData.contactPreference === 'both') && (
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {(formData.contactPreference === 'phone' || formData.contactPreference === 'both') && (
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone *</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Images */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-heading text-lg font-semibold">Images (Optional)</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="images">Upload Images (max 5)</Label>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <div className="h-24 bg-secondary/30 rounded-lg flex items-center justify-center">
                            <span className="text-sm text-muted-foreground truncate px-2">{image.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Documents */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-heading text-lg font-semibold">Documents (Optional)</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="documents">Upload Documents (max 3)</Label>
                    <Input
                      id="documents"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      multiple
                      onChange={handleDocumentUpload}
                    />
                  </div>

                  {formData.documents.length > 0 && (
                    <div className="space-y-2">
                      {formData.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                          <span className="text-sm truncate">{doc.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDocument(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isUrgent">Mark as Urgent</Label>
                      <p className="text-sm text-muted-foreground">Highlight this opportunity as urgent</p>
                    </div>
                    <input
                      type="checkbox"
                      id="isUrgent"
                      checked={formData.isUrgent}
                      onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                      className="w-5 h-5"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-gold hover:bg-gold/90 text-white" disabled={loading}>
                    {loading ? 'Creating...' : 'Submit for Approval'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
