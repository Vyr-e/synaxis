'use client';

import { useUploadThing } from '@/lib/uploadthing';
import { useFormStore } from '@/store/use-onboarding-store';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar';
import { Button } from '@repo/design-system/components/ui/button';
import {
  FileUpload,
  FileUploadDropzone,
} from '@repo/design-system/components/ui/file-upload';
import { Input } from '@repo/design-system/components/ui/input';
import { ProfileAvatar } from '@repo/design-system/components/ui/profile-avatar';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { cn } from '@repo/design-system/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  Camera,
  Check,
  Facebook,
  Globe,
  Instagram,
  Sparkles,
  Twitter,
  Users,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function CommunitySetupForm() {
  const formData = useFormStore((state) => state.formData);
  const setField = useFormStore((state) => state.setField);

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
  const [isPrivate, setIsPrivate] = useState(formData.isPrivate || false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- UploadThing Hook for Logo ---
  const { startUpload, isUploading: uploadThingIsUploading } = useUploadThing(
    'imageUploader',
    {
      onClientUploadComplete: (res) => {
        if (res?.[0]?.url) {
          setField('logo', res[0].url);
          setLogoPreview(res[0].url);
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

  // Determine the username for the avatar based on brandName
  const avatarUsername = brandName || 'Brand';

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

  const handlePrivacyChange = (isPrivate: boolean) => {
    setIsPrivate(isPrivate);
    setField('isPrivate', isPrivate);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setField(name as keyof typeof formData, value);
  };

  return (
    <div className="w-full max-w-4xl h-[calc(100dvh-200px)] flex flex-col md:flex-row gap-6 overflow-hidden">
      {/* Left side - Form fields */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Brand Identity Card */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
            <div className="flex items-center p-5 bg-gray-50/50">
              <Building2 className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="font-medium text-gray-700">Brand Identity</h3>
            </div>

            <div className="p-6 space-y-5">
              {/* Logo Upload - Enhanced */}
              <div className="flex flex-col items-center mb-2">
                <label
                  htmlFor="logo-upload-input"
                  className="block text-sm font-medium text-gray-700 mb-3 self-start"
                >
                  Brand Logo{' '}
                  <span className="text-gray-500 text-xs">
                    (Recommended, or we'll generate an icon)
                  </span>
                </label>

                <FileUpload
                  value={logoFile ? [logoFile] : []}
                  onValueChange={handleLogoFileChange}
                  maxFiles={1}
                  maxSize={2 * 1024 * 1024}
                  accept="image/png, image/jpeg, image/jpg"
                  className="w-full"
                  id="logo-upload-input"
                >
                  <FileUploadDropzone
                    className={cn(
                      'group relative flex flex-col items-center justify-center p-6 rounded-xl transition-all cursor-pointer border-2 border-dashed min-h-[180px] w-full',
                      logoPreview && !uploadThingIsUploading
                        ? 'border-[#0057FF] bg-blue-50/20'
                        : 'border-gray-300 bg-gray-50/50 hover:border-[#0057FF] hover:bg-blue-50/30',
                      uploadThingIsUploading && 'cursor-not-allowed opacity-70'
                    )}
                  >
                    {!uploadThingIsUploading && logoPreview && (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                        <Image
                          src={logoPreview}
                          alt="Brand logo preview"
                          fill
                          className="object-contain"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all group-hover:bg-opacity-40">
                          <Camera className="text-white opacity-0 group-hover:opacity-100 h-6 w-6" />
                        </div>
                      </div>
                    )}
                    {!uploadThingIsUploading && !logoPreview && (
                      <div className="flex flex-col items-center justify-center text-center">
                        <ProfileAvatar
                          username={avatarUsername}
                          avatarStyle="marble"
                          size={64}
                          className="mb-3 opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#0057FF] transition-colors">
                          Click to upload Logo
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">
                          or drag and drop
                        </span>
                      </div>
                    )}

                    <AnimatePresence>
                      {uploadThingIsUploading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-xl"
                        >
                          <div className="relative h-16 w-16">
                            <svg
                              className="h-full w-full"
                              viewBox="0 0 100 100"
                            >
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
                                transition={{
                                  ease: 'linear',
                                  duration: 0.1,
                                }}
                                transform="rotate(-90 50 50)"
                              />
                            </svg>
                            {uploadProgress === 100 && (
                              <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-white" />
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FileUploadDropzone>
                </FileUpload>

                {logoPreview && !uploadThingIsUploading && (
                  <div className="flex justify-center mt-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeLogo}
                      className="rounded-full text-xs"
                    >
                      <X className="mr-1 h-3 w-3" />
                      Remove logo
                    </Button>
                  </div>
                )}

                <p className="mt-3 text-xs text-gray-500 text-center">
                  Upload a square logo (PNG, JPG). Max 2MB.
                  <br />
                  Recommended size: 500x500px.
                </p>
              </div>

              <div>
                <label
                  htmlFor="brandName"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="brandName"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Enter your brand name"
                  className="w-full rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0057FF] border-0"
                />
              </div>

              <div>
                <label
                  htmlFor="brandSlug"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Brand URL <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-xl ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-[#0057FF] border-0 overflow-hidden">
                  <span className="inline-flex items-center border-r border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">
                    synaxis.com/
                  </span>
                  <Input
                    id="brandSlug"
                    value={brandSlug}
                    onChange={(e) => {
                      setBrandSlug(e.target.value);
                      setField('slug', e.target.value);
                    }}
                    placeholder="your-brand"
                    className="rounded-l-none flex-1 border-0 ring-0 focus:ring-0 min-w-0"
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-500">
                  This will be your unique URL on Synaxis
                </p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Brand Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="description"
                  value={formData.brandDescription || ''}
                  onChange={(e) => setField('brandDescription', e.target.value)}
                  placeholder="Tell potential members about your brand..."
                  className="w-full resize-none rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0057FF] border-0"
                  rows={3}
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Describe what your brand offers and what makes it unique
                </p>
              </div>
            </div>
          </div>

          {/* Online Presence Card */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
            <div className="flex items-center p-5 bg-gray-50/50">
              <Globe className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="font-medium text-gray-700">Online Presence</h3>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Website URL
                </label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0057FF] border-0"
                />
              </div>

              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Social Media
                </h4>

                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                    <Instagram className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3 flex-1">
                    <label
                      htmlFor="instagram"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Instagram
                    </label>
                    <div className="relative mt-1 rounded-xl ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-[#0057FF] border-0 overflow-hidden">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">@</span>
                      </div>
                      <Input
                        type="text"
                        name="instagram"
                        id="instagram"
                        className="pl-7 w-full border-0 ring-0 focus:ring-0"
                        placeholder="username"
                        value={formData.instagram || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
                    <Twitter className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3 flex-1">
                    <label
                      htmlFor="twitter"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Twitter
                    </label>
                    <div className="relative mt-1 rounded-xl ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-[#0057FF] border-0 overflow-hidden">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">@</span>
                      </div>
                      <Input
                        type="text"
                        name="twitter"
                        id="twitter"
                        className="pl-7 w-full border-0 ring-0 focus:ring-0"
                        placeholder="username"
                        value={formData.twitter || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800">
                    <Facebook className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3 flex-1">
                    <label
                      htmlFor="facebook"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Facebook
                    </label>
                    <Input
                      type="text"
                      name="facebook"
                      id="facebook"
                      placeholder="username or page URL"
                      value={formData.facebook || ''}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0057FF] border-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
            <div className="flex items-center p-5 bg-gray-50/50">
              <Users className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="font-medium text-gray-700">Privacy Settings</h3>
            </div>

            <div className="p-6">
              <div>
                <div
                  id="privacy-setting-label"
                  className="text-sm font-medium text-gray-700 mb-3"
                >
                  Brand Visibility
                </div>
                <div
                  aria-labelledby="privacy-setting-label"
                  className="grid grid-cols-2 gap-3"
                >
                  <button
                    type="button"
                    onClick={() => handlePrivacyChange(false)}
                    className={cn(
                      'flex flex-col items-center p-4 rounded-xl border transition-all duration-150 ease-in-out',
                      isPrivate
                        ? 'ring-1 ring-gray-200 hover:ring-gray-300 bg-white hover:bg-gray-50/50'
                        : 'ring-2 ring-[#0057FF] bg-blue-50/70 border-transparent'
                    )}
                  >
                    <Globe className="h-5 w-5 mb-1.5" />
                    <span className="font-medium text-sm">Public</span>
                    <span className="text-xs text-gray-500 mt-1 text-center">
                      Anyone can discover your brand
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePrivacyChange(true)}
                    className={cn(
                      'flex flex-col items-center p-4 rounded-xl border transition-all duration-150 ease-in-out',
                      isPrivate
                        ? 'ring-2 ring-[#0057FF] bg-blue-50/70 border-transparent'
                        : 'ring-1 ring-gray-200 hover:ring-gray-300 bg-white hover:bg-gray-50/50'
                    )}
                  >
                    <Users className="h-5 w-5 mb-1.5" />
                    <span className="font-medium text-sm">Private</span>
                    <span className="text-xs text-gray-500 mt-1 text-center">
                      By invitation only
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Preview */}
      <div className="hidden md:block w-80 bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="sticky top-0 z-10 p-5 bg-gray-50/80 rounded-t-2xl backdrop-blur-sm flex items-center border-b border-gray-100">
          <Sparkles className="h-5 w-5 mr-2 text-[#0057FF]" />
          <h3 className="font-medium text-gray-800">Brand Preview</h3>
        </div>

        <div className="p-6 space-y-5 rounded-2xl">
          <div className="w-full aspect-video rounded-xl mb-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center overflow-hidden ring-1 ring-gray-200">
            <AnimatePresence>
              <motion.div
                key={logoPreview || 'fallback'}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Avatar className="h-24 w-24 rounded-lg shadow-md bg-white border border-gray-200">
                  <AvatarImage
                    src={formData.logo || undefined}
                    alt={brandName || 'Brand Logo'}
                    className="object-contain h-full w-full"
                  />
                  <AvatarFallback className="flex items-center justify-center h-full w-full bg-transparent">
                    {logoPreview && !formData.logo ? (
                      <Image
                        src={logoPreview}
                        alt="Preview"
                        fill
                        className="object-contain rounded-lg"
                      />
                    ) : (
                      <ProfileAvatar
                        username={avatarUsername}
                        avatarStyle="marble"
                        size={80}
                      />
                    )}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="text-center">
            <AnimatePresence mode="wait">
              <motion.h3
                key={brandName || 'Your Brand Name'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="font-semibold text-xl text-gray-800 mb-1.5 truncate"
              >
                {brandName || 'Your Brand Name'}
              </motion.h3>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={isPrivate ? 'private' : 'public'}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-gray-500 mb-3 flex items-center justify-center"
              >
                {isPrivate ? (
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1.5" /> Private Brand
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Globe className="h-4 w-4 mr-1.5" /> Public Brand
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={formData.brandDescription || '...'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-sm text-gray-600 line-clamp-4 mb-4 text-center leading-relaxed"
            >
              {formData.brandDescription ||
                'Your brand description will appear here. Be concise and clear about what your brand offers. This preview shows how your core identity might look.'}
            </motion.p>
          </AnimatePresence>

          <div className="w-full h-px bg-gray-200 my-4" />

          <div className="flex justify-center items-center p-2 bg-gray-50 rounded-lg ring-1 ring-gray-200 hover:ring-gray-300 transition-all">
            <AnimatePresence mode="wait">
              <motion.span
                key={brandSlug || 'your-brand'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-gray-600 truncate"
              >
                synaxis.com/{brandSlug || 'your-brand'}
              </motion.span>
            </AnimatePresence>
            <ArrowRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
          </div>

          {/* Social Preview */}
          <AnimatePresence>
            {(formData.instagram || formData.twitter || formData.facebook) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-5 pt-4 border-t border-gray-200 overflow-hidden"
              >
                <h4 className="text-xs font-medium text-gray-500 mb-3 text-center uppercase tracking-wider">
                  Connect
                </h4>
                <div className="flex gap-4 items-center justify-center">
                  {formData.instagram && (
                    <a
                      href={formData.instagram}
                      className="text-gray-400 hover:text-purple-500 transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="h-6 w-6" />
                    </a>
                  )}
                  {formData.twitter && (
                    <a
                      href={formData.twitter}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      title="Twitter"
                    >
                      <Twitter className="h-6 w-6" />
                    </a>
                  )}
                  {formData.facebook && (
                    <a
                      href={formData.facebook}
                      className="text-gray-400 hover:text-blue-700 transition-colors"
                      title="Facebook"
                    >
                      <Facebook className="h-6 w-6" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
