'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, AlertCircle, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { opportunityService } from '@/services/opportunity.service';
import { adminService } from '@/services/admin.service';
import { storageService } from '@/services/storage.service';
import { CATEGORIES, INDUSTRIES, INVESTMENT_RANGES, BUSINESS_TYPES, STATES } from '@/constants';
import { Opportunity, OpportunityStatus } from '@/types';

const STATUS_OPTIONS: OpportunityStatus[] = ['draft', 'pending', 'published', 'rejected', 'archived'];

interface OpportunityFormProps {
  existing?: Opportunity;
}

export function OpportunityForm({ existing }: OpportunityFormProps) {
  const router = useRouter();
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(existing?.images || []);

  const [formData, setFormData] = useState({
    title: existing?.title || '',
    category: existing?.category || '',
    industry: existing?.industry || '',
    businessType: existing?.businessType || '',
    investmentRange: existing?.investmentRange || '',
    city: existing?.city || '',
    state: existing?.state || '',
    shortDescription: existing?.shortDescription || '',
    description: existing?.description || '',
    requirements: existing?.requirements || '',
    contactPreference: (existing?.contactPreference || 'email') as 'email' | 'phone' | 'both',
    contactEmail: existing?.contactEmail || '',
    contactPhone: existing?.contactPhone || '',
    status: (existing?.status || 'published') as OpportunityStatus,
    isFeatured: existing?.isFeatured || false,
    isUrgent: existing?.isUrgent || false,
  });

  const handleChange = (field: string, value: string | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value ?? '' }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validation = files.map(f => storageService.validateImageFile(f));
    const invalid = validation.find(v => !v.valid);
    if (invalid) {
      setError(invalid.error || 'Invalid image');
    }
    const validFiles = files.filter((_, i) => validation[i].valid);
    setNewImages(prev => [...prev, ...validFiles].slice(0, 5 - existingImages.length));
  };

  const removeExistingImage = (url: string) => {
    setExistingImages(prev => prev.filter(u => u !== url));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const validate = (): string | null => {
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.category) return 'Category is required';
    if (!formData.industry) return 'Industry is required';
    if (!formData.businessType) return 'Business type is required';
    if (!formData.investmentRange) return 'Investment range is required';
    if (!formData.city.trim() || !formData.state) return 'City and state are required';
    if (!formData.shortDescription.trim()) return 'Short description is required';
    if (!formData.description.trim()) return 'Full description is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!userData) {
      setError('You must be signed in as an admin.');
      return;
    }

    setLoading(true);
    try {
      let uploadedUrls: string[] = [];
      if (newImages.length > 0) {
        uploadedUrls = await storageService.uploadImages(newImages, `opportunities/${existing?.id || 'new'}`);
      }
      const allImages = [...existingImages, ...uploadedUrls];

      if (existing) {
        await opportunityService.updateOpportunity(existing.id, {
          ...formData,
          location: `${formData.city}, ${formData.state}`,
          images: allImages,
        } as unknown as Partial<Opportunity>);
        await adminService.logAction({
          action: 'opportunity_updated',
          targetType: 'opportunity',
          targetId: existing.id,
          targetLabel: formData.title,
          adminId: userData.id,
          adminName: userData.name,
        });
        router.push('/admin/opportunities');
      } else {
        const result = await opportunityService.createOpportunity(
          { ...formData, images: [], documents: [] } as unknown as Parameters<typeof opportunityService.createOpportunity>[0],
          userData.id,
          userData.name,
          userData.profileImage
        );
        if (!result.success || !result.id) {
          throw new Error(result.error || 'Failed to create opportunity');
        }
        await opportunityService.updateOpportunity(result.id, {
          images: allImages,
          status: formData.status,
          isFeatured: formData.isFeatured,
          isUrgent: formData.isUrgent,
        });
        await adminService.logAction({
          action: 'opportunity_created',
          targetType: 'opportunity',
          targetId: result.id,
          targetLabel: formData.title,
          adminId: userData.id,
          adminName: userData.name,
        });
        router.push('/admin/opportunities');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Details</CardTitle>
          <CardDescription>Core information shown on the listing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={formData.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="e.g. Tax Advisory Partnership in Mumbai" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select value={formData.industry} onValueChange={(v) => handleChange('industry', v)}>
                <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Business Type</Label>
              <Select value={formData.businessType} onValueChange={(v) => handleChange('businessType', v)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Investment Range</Label>
              <Select value={formData.investmentRange} onValueChange={(v) => handleChange('investmentRange', v)}>
                <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                <SelectContent>
                  {INVESTMENT_RANGES.map((range) => (
                    <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Input value={formData.city} onChange={(e) => handleChange('city', e.target.value)} placeholder="e.g. Mumbai" />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Select value={formData.state} onValueChange={(v) => handleChange('state', v)}>
                <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>
                  {STATES.map((st) => (
                    <SelectItem key={st} value={st}>{st}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Short Description</Label>
            <Textarea
              value={formData.shortDescription}
              onChange={(e) => handleChange('shortDescription', e.target.value)}
              placeholder="One or two lines shown in listing cards"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Full Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Full details of the opportunity"
              rows={6}
            />
          </div>
          <div className="space-y-2">
            <Label>Requirements (optional)</Label>
            <Textarea
              value={formData.requirements}
              onChange={(e) => handleChange('requirements', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preferred Contact Method</Label>
            <Select value={formData.contactPreference} onValueChange={(v) => handleChange('contactPreference', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input type="email" value={formData.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Contact Phone</Label>
              <Input value={formData.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
          <CardDescription>Up to 5 images, JPEG/PNG/WebP, 5MB max each</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-3">
            {existingImages.map((url) => (
              <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}
            {newImages.map((file, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}
            {existingImages.length + newImages.length < 5 && (
              <label className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <input type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
              </label>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Controls</CardTitle>
          <CardDescription>Status and visibility, set directly by you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(v) => handleChange('status', v as OpportunityStatus)}>
              <SelectTrigger className="w-full sm:w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Badge
              variant={formData.isFeatured ? 'default' : 'outline'}
              className="cursor-pointer select-none"
              onClick={() => handleChange('isFeatured', !formData.isFeatured)}
            >
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
            <Badge
              variant={formData.isUrgent ? 'default' : 'outline'}
              className="cursor-pointer select-none"
              onClick={() => handleChange('isUrgent', !formData.isUrgent)}
            >
              <Zap className="h-3 w-3 mr-1" />
              Urgent
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : existing ? 'Save Changes' : 'Create Opportunity'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/opportunities')} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
