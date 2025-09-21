'use client';

import { useUploadThing } from '@/lib/uploadthing';
import { useFormStore } from '@/store/use-onboarding-store';
import { Button } from '@repo/design-system/components/ui/button';
import {
  FileUpload,
  FileUploadDropzone,
} from '@repo/design-system/components/ui/file-upload';
import { Input } from '@repo/design-system/components/ui/input';
import { ProfileAvatar } from '@repo/design-system/components/ui/profile-avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { cn } from '@repo/design-system/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Camera,
  Check,
  Facebook,
  Globe,
  Instagram,
  Lock,
  Plus,
  Twitter,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useId } from 'react';
import { toast } from 'sonner';

export function CommunitySetupForm() {
  const formData = useFormStore((state) => state.formData);
  const setField = useFormStore((state) => state.setField);
  const pathname = usePathname();
  const validateCurrentStep = useFormStore(
    (state) => state.validateCurrentStep
  );

  const [brandName, setBrandName] = useState(formData.brandName || '');
  const [brandSlug, setBrandSlug] = useState(
    formData.brandName
      ? formData.brandName
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '')
      : ''
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(
    formData.logo || null
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // UploadThing Hook for Logo
  const { startUpload, isUploading: uploadThingIsUploading } = useUploadThing(
    'imageUploader',
    {
      onClientUploadComplete: (res) => {
        if (res?.[0]?.ufsUrl) {
          setField('logo', res[0].ufsUrl);
          setLogoPreview(res[0].ufsUrl);
          toast.success('Logo uploaded successfully!');
          setUploadProgress(100);
        } else {
          toast.error('Upload completed but no URL received.');
          setUploadProgress(0);
          setField('logo', '');
          setLogoPreview(null);
        }
        setLogoFile(null);
        setTimeout(() => setUploadProgress(0), 500);
      },
      onUploadError: (error: Error) => {
        toast.error(`Logo upload failed: ${error.message}`);
        setUploadProgress(0);
        setField('logo', '');
        setLogoPreview(null);
        setLogoFile(null);
      },
      onUploadProgress: setUploadProgress,
    }
  );

  const avatarUsername = brandName || 'Brand';

  // Auto-validate when brand form data changes
  useEffect(() => {
    if (
      formData.brandName &&
      formData.brandDescription &&
      formData.slug &&
      pathname?.includes('/brand/community')
    ) {
      validateCurrentStep('brand', 'community');
    }
  }, [
    formData.brandName,
    formData.brandDescription,
    formData.slug,
    validateCurrentStep,
    pathname,
  ]);

  useEffect(() => {
    if (brandName) {
      const slug = brandName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
      setBrandSlug(slug);
      setField('slug', slug);
    }
    setField('brandName', brandName);
  }, [brandName, setField]);

  const handleLogoFileChange = (files: File[]) => {
    const file = files[0] ?? null;
    setLogoFile(file);
    setUploadProgress(0);

    if (file) {
      const tempPreviewUrl = URL.createObjectURL(file);
      setLogoPreview(tempPreviewUrl);
      startUpload([file]);
    } else {
      setLogoPreview(null);
      setField('logo', '');
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setField('logo', '');
    setUploadProgress(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setField(name as keyof typeof formData, value);
  };

  const handlePrivacyToggle = (isPublic: boolean) => {
    setField('isPublic', isPublic);
  };

  const urlInputId = useId();

  return (
    <div className="w-full max-w-2xl mx-auto pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 px-4 md:px-6"
      >
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-neutral-900/50 border border-neutral-800">
            <TabsTrigger value="basics" className="data-[state=active]:bg-neutral-700/50 data-[state=active]:text-white text-white/60">
              Basics
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-neutral-700/50 data-[state=active]:text-white text-white/60">
              Profile
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-neutral-700/50 data-[state=active]:text-white text-white/60">
              Social
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-neutral-700/50 data-[state=active]:text-white text-white/60">
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="mt-6">
            <div className="bg-neutral-900/30 rounded-2xl shadow-sm ring-1 ring-neutral-800 overflow-hidden">
              <div className="p-6 space-y-6">
                {/* Brand Name */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Brand Name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Enter your brand name"
                    className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-white/40 focus:border-white/50"
                  />
                </div>

                {/* Brand URL */}
                <div>
                  <label htmlFor={urlInputId} className="block text-sm font-medium text-white mb-2">
                    Brand URL <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id={urlInputId}
                      value={brandSlug}
                      onChange={(e) => {
                        setBrandSlug(e.target.value);
                        setField('slug', e.target.value);
                      }}
                      placeholder="your-brand"
                      className="peer pl-28 bg-neutral-800/50 border-neutral-700 text-white placeholder:text-white/40 focus:border-white/50"
                    />
                    <span className="text-white/60 pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 text-sm peer-disabled:opacity-50">
                      synaxis.com/
                    </span>
                  </div>
                </div>

                {/* Brand Description */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Brand Description <span className="text-red-400">*</span>
                  </label>
                  <Textarea
                    value={formData.brandDescription || ''}
                    onChange={(e) => setField('brandDescription', e.target.value)}
                    placeholder="Tell potential members about your brand..."
                    className="min-h-[100px] bg-neutral-800/50 border-neutral-700 text-white placeholder:text-white/40 focus:border-white/50 resize-none"
                    maxLength={300}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-white/60">
                      Describe what your brand offers and what makes it unique
                    </p>
                    <span className="text-xs text-white/40">
                      {(formData.brandDescription || '').length}/300
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <div className="bg-neutral-900/30 rounded-2xl shadow-sm ring-1 ring-neutral-800 overflow-hidden">
              <div className="p-6 space-y-6">
                {/* Logo Upload Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-white mb-3">
                    Brand Logo{' '}
                    <span className="text-white/60 text-xs">
                      (Optional)
                    </span>
                  </label>

                  <div className="flex flex-col items-center">
                    {logoPreview && !uploadThingIsUploading ? (
                      <>
                        <div className="relative h-20 w-20 overflow-hidden rounded-lg border-2 border-white">
                          <Image
                            src={logoPreview}
                            alt="Brand logo preview"
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={removeLogo}
                          className="mt-3 h-8 w-8 p-0 rounded-full bg-neutral-700/50 hover:bg-neutral-600/50"
                        >
                          <X className="h-4 w-4 text-white" />
                        </Button>
                      </>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 w-fit mx-auto">
                        <FileUpload
                          value={logoFile ? [logoFile] : []}
                          onValueChange={handleLogoFileChange}
                          maxFiles={1}
                          maxSize={2 * 1024 * 1024}
                          accept="image/*"
                          disabled={uploadThingIsUploading}
                        >
                          <FileUploadDropzone className="cursor-pointer p-0 m-3">
                            <div className="flex size-28 items-center justify-center overflow-hidden rounded-lg bg-neutral-800/50 transition-colors hover:bg-neutral-700/50">
                              <div className="flex flex-col items-center space-y-1">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                                  <Plus className="h-3 w-3 text-black" />
                                </div>
                                <span className="text-[10px] font-medium text-white">
                                  Upload
                                </span>
                              </div>
                            </div>
                          </FileUploadDropzone>
                        </FileUpload>

                        <div className="flex size-28 items-center justify-center overflow-hidden rounded-lg bg-neutral-800/30 ring-1 ring-neutral-600 m-3">
                          <ProfileAvatar
                            username={avatarUsername}
                            avatarStyle="marble"
                            size={88}
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                    )}

                    <AnimatePresence>
                      {uploadThingIsUploading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60"
                        >
                          <div className="relative h-16 w-16">
                            <svg className="h-full w-full" viewBox="0 0 100 100">
                              <title>Upload progress</title>
                              <circle
                                className="stroke-current text-gray-700"
                                strokeWidth="10"
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                              />
                              <motion.circle
                                className="stroke-current text-white"
                                strokeWidth="10"
                                strokeLinecap="round"
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                strokeDasharray="251.2"
                                initial={{ strokeDashoffset: 251.2 }}
                                animate={{
                                  strokeDashoffset: `calc(251.2 - (251.2 * ${uploadProgress}) / 100)`,
                                }}
                                transition={{ ease: 'linear', duration: 0.1 }}
                                transform="rotate(-90 50 50)"
                              />
                            </svg>
                            {uploadProgress === 100 && (
                              <Check className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-white" />
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <div className="bg-neutral-900/30 rounded-2xl shadow-sm ring-1 ring-neutral-800 overflow-hidden">
              <div className="p-6 space-y-6">
                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Website URL
                  </label>
                  <Input
                    name="website"
                    value={formData.website || ''}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-white/40 focus:border-white/50"
                  />
                </div>

                {/* Instagram */}
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                    <Instagram className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-white mb-2">
                      Instagram
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-white/60 text-sm">@</span>
                      </div>
                      <Input
                        name="instagram"
                        placeholder="username"
                        value={formData.instagram || ''}
                        onChange={handleInputChange}
                        className="pl-7 bg-neutral-800/50 border-neutral-700 text-white placeholder:text-white/40 focus:border-white/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Twitter */}
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
                    <Twitter className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-white mb-2">
                      Twitter
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-white/60 text-sm">@</span>
                      </div>
                      <Input
                        name="twitter"
                        placeholder="username"
                        value={formData.twitter || ''}
                        onChange={handleInputChange}
                        className="pl-7 bg-neutral-800/50 border-neutral-700 text-white placeholder:text-white/40 focus:border-white/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Facebook */}
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800">
                    <Facebook className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-white mb-2">
                      Facebook
                    </label>
                    <Input
                      name="facebook"
                      placeholder="username or page URL"
                      value={formData.facebook || ''}
                      onChange={handleInputChange}
                      className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-white/40 focus:border-white/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="bg-neutral-900/30 rounded-2xl shadow-sm ring-1 ring-neutral-800 overflow-hidden">
              <div className="p-6">
                <div className="space-y-3">
                  <button
                    onClick={() => handlePrivacyToggle(true)}
                    className={cn(
                      "w-full p-4 rounded-xl border transition-all text-left",
                      formData.isPublic
                        ? "border-white bg-neutral-700/50 text-white"
                        : "border-neutral-600 bg-neutral-800/30 text-white/60 hover:border-neutral-500"
                    )}
                  >
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 mr-3" />
                      <div>
                        <h4 className="font-medium">Public Brand</h4>
                        <p className="text-sm text-white/60">Anyone can discover and view your brand</p>
                      </div>
                      {formData.isPublic && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => handlePrivacyToggle(false)}
                    className={cn(
                      "w-full p-4 rounded-xl border transition-all text-left",
                      !formData.isPublic
                        ? "border-white bg-neutral-700/50 text-white"
                        : "border-neutral-600 bg-neutral-800/30 text-white/60 hover:border-neutral-500"
                    )}
                  >
                    <div className="flex items-center">
                      <Lock className="h-5 w-5 mr-3" />
                      <div>
                        <h4 className="font-medium">Private Brand</h4>
                        <p className="text-sm text-white/60">Only you control who can see your brand</p>
                      </div>
                      {!formData.isPublic && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="bg-neutral-900/30 rounded-2xl shadow-sm ring-1 ring-neutral-800 p-3 sm:p-6">
          <p className="text-center text-sm text-white/60">
            You can always update your brand information later in settings
          </p>
        </div>
      </motion.div>
    </div>
  );
}