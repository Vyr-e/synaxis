'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AtSign,
  Camera,
  Check,
  Eye,
  Facebook,
  Instagram,
  Link,
  MapPin,
  Settings,
  Sparkles,
  Twitter,
  Upload,
  User,
  X,
} from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@repo/design-system/components/ui/button';
import {
  FileUpload,
  FileUploadDropzone,
} from '@repo/design-system/components/ui/file-upload';
import { Input } from '@repo/design-system/components/ui/input';
import { Switch } from '@repo/design-system/components/ui/switch';
import { Textarea } from '@repo/design-system/components/ui/textarea';

// Import store and types
import {
  type FormData as StoreFormData,
  useFormStore,
} from '@/store/use-onboarding-store';

import { useUploadThing } from '@/lib/uploadthing';
import { ProfileAvatar } from '@repo/design-system/components/ui/profile-avatar';
import { cn } from '@repo/design-system/lib/utils';

export function ProfileForm() {
  // --- Zustand Store Connection ---
  const formData = useFormStore((state) => state.formData);
  const setField = useFormStore((state) => state.setField);
  const setProfilePictureAction = useFormStore(
    (state) => state.setProfilePicture
  );

  const {
    bio,
    profilePicture,
    profilePicturePreview,
    profilePictureUrl,
    bannerColor,
    accountType,
    brandName,
    brandDescription,
    website,
    communityPrivacy,
    instagram,
    twitter,
    facebook,
    // Add missing fields for new UI
    location = '',
    linkedin = '',
    isProfilePublic = true,
    showLocation = true,
    allowMessages = true,
  } = formData;

  // --- Component State ---
  const [charCount, setCharCount] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState<number | null>(
    null
  );
  const [useGeneratedAvatar, setUseGeneratedAvatar] = useState(false);

  // --- UploadThing Hook ---
  const { startUpload, isUploading: uploadThingIsUploading } = useUploadThing(
    'imageUploader',
    {
      onClientUploadComplete: (res) => {
        if (res?.[0]?.url) {
          setProfilePictureAction(null, res[0].url);
          toast.success('Profile picture uploaded successfully!');
          setUploadProgress(100);
        } else {
          toast.error('Upload completed but no URL received.');
          setUploadProgress(0);
          setProfilePictureAction(null, '');
        }
        setTimeout(() => setUploadProgress(0), 500);
      },
      onUploadError: (error: Error) => {
        toast.error(`Upload failed: ${error.message}`);
        setUploadProgress(0);
        setProfilePictureAction(null, '');
      },
      onUploadProgress: setUploadProgress,
    }
  );

  // Generate avatar options
  const avatarOptions = [
    { style: 'beam' as const, key: 'beam1', seed: 1 },
    { style: 'marble' as const, key: 'marble1', seed: 2 },
    { style: 'beam' as const, key: 'beam2', seed: 3 },
    { style: 'marble' as const, key: 'marble2', seed: 4 },
  ];

  // Update charCount when bio/brandDescription changes
  useEffect(() => {
    const currentText = accountType === 'brand' ? brandDescription : bio;
    const textWithoutSpaces = currentText?.replace(/\s+/g, '') ?? '';
    setCharCount(textWithoutSpaces.length);
  }, [bio, brandDescription, accountType]);

  // --- Event Handlers ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setField(e.target.name as keyof StoreFormData, e.target.value);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const currentText = e.target.value;
    const textWithoutSpaces = currentText.replace(/\s+/g, '');

    if (textWithoutSpaces.length <= 150) {
      const field = accountType === 'brand' ? 'brandDescription' : 'bio';
      setField(field, currentText);
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setField(name as keyof StoreFormData, checked);
  };

  const handleFileValueChange = (files: File[]) => {
    const file = files[0] ?? null;
    setUploadProgress(0);
    setUseGeneratedAvatar(false);
    setSelectedAvatarIndex(null);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfilePictureAction(file, previewUrl);
      startUpload([file]);
    } else {
      setProfilePictureAction(null, '');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileValueChange([file]);
    }
  };

  const removeProfilePicture = () => {
    setProfilePictureAction(null, '');
    setUseGeneratedAvatar(false);
    setSelectedAvatarIndex(null);
  };

  const selectAvatar = (index: number) => {
    setSelectedAvatarIndex(index);
    setUseGeneratedAvatar(true);
    setProfilePictureAction(null, '');
  };

  // Image display logic
  const displayImageUrl = profilePicturePreview || profilePictureUrl || '';
  const fileUploadValue = profilePicture ? [profilePicture] : [];
  const avatarUsername = brandName || 'User';

  return (
    <div className="w-full max-w-2xl mx-auto h-[calc(100dvh-200px)] flex flex-col gap-8 p-4 sm:p-6">
      {/* Left side - Form fields */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Profile Photo Card */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
            <div className="flex items-center p-5 bg-gray-50/50">
              <Camera className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="font-medium text-gray-700">Profile Photo</h3>
            </div>

            <div className="p-6">
              {/* New Photo Upload Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Upload your photo
                </h4>

                <div className="relative">
                  <FileUpload
                    value={fileUploadValue}
                    onValueChange={handleFileValueChange}
                    maxFiles={1}
                    maxSize={2 * 1024 * 1024}
                    accept={'image/*'}
                    disabled={uploadThingIsUploading}
                    className="w-full"
                  >
                    <FileUploadDropzone
                      className={cn(
                        'group relative flex flex-col items-center justify-center p-6 rounded-xl transition-all cursor-pointer border-2 border-dashed min-h-[200px]',
                        uploadThingIsUploading &&
                          'cursor-not-allowed opacity-70',
                        displayImageUrl
                          ? 'border-[#0057FF]'
                          : 'border-gray-300 bg-gray-50/30 hover:border-[#0057FF] hover:bg-blue-50/30'
                      )}
                      style={{
                        backgroundColor: displayImageUrl
                          ? 'transparent'
                          : undefined,
                      }}
                    >
                      {displayImageUrl ? (
                        <div className="relative w-32 h-32 rounded-xl overflow-hidden">
                          <Image
                            src={displayImageUrl || '/placeholder.svg'}
                            alt="Profile Preview"
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                          {!uploadThingIsUploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all group-hover:bg-opacity-40">
                              <Camera className="h-6 w-6 text-white opacity-0 transition-all group-hover:opacity-100" />
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
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0057FF]/10 flex items-center justify-center">
                            <Upload className="h-8 w-8 text-[#0057FF]" />
                          </div>
                          <h5 className="text-sm font-medium text-gray-900 mb-1">
                            Click to upload
                          </h5>
                          <p className="text-xs text-gray-500 mb-2">
                            PNG, JPG up to 2MB
                          </p>
                          <div className="text-xs text-gray-400">
                            or drag and drop
                          </div>
                        </div>
                      )}
                    </FileUploadDropzone>
                  </FileUpload>

                  {displayImageUrl && !uploadThingIsUploading && (
                    <div className="flex justify-center mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeProfilePicture}
                        className="rounded-full text-xs"
                      >
                        <X className="mr-1 h-3 w-3" />
                        Remove photo
                      </Button>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-200/50">
                  <div className="flex items-center text-blue-700 mb-1">
                    <Sparkles className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                    <p className="text-xs font-medium">Pro tip</p>
                  </div>
                  <p className="text-xs text-blue-600">
                    Use a square image with your face clearly visible for the
                    best results.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="my-6 h-px w-full bg-gray-200" />

              {/* Generated Avatar Options */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Or choose a generated avatar
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {avatarOptions.map((option, index) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => selectAvatar(index)}
                      className={cn(
                        'relative p-2 rounded-xl transition-all hover:scale-105',
                        selectedAvatarIndex === index
                          ? 'ring-2 ring-[#0057FF] bg-blue-50/50'
                          : 'ring-1 ring-gray-200 hover:ring-gray-300 bg-white'
                      )}
                    >
                      <ProfileAvatar
                        username={avatarUsername + option.seed}
                        avatarStyle={option.style}
                        size={32}
                        className="mx-auto"
                      />
                      <span className="text-xs text-gray-500 mt-1 block text-center">
                        {option.style}
                      </span>
                    </button>
                  ))}
                </div>
                {/* New description for generated avatars */}
                <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">
                    These avatars are generated uniquely based on your username
                    and will always look the same.
                  </p>
                  <p className="text-xs text-gray-500">
                    Perfect if you prefer not to upload a personal photo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information Card */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
            <div className="flex items-center p-5 bg-gray-50/50">
              <User className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="font-medium text-gray-700">Basic Information</h3>
            </div>

            <div className="p-6 space-y-5">
              {/* Brand Name for brand accounts */}
              {accountType === 'brand' && (
                <div>
                  <label
                    htmlFor="brandName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Brand Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="brandName"
                    name="brandName"
                    placeholder="Your brand name"
                    value={brandName}
                    onChange={handleInputChange}
                    className="rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0057FF] border-0"
                    required
                  />
                </div>
              )}

              {/* Bio/Brand Description */}
              <div>
                <label
                  htmlFor={accountType === 'brand' ? 'brandDescription' : 'bio'}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {accountType === 'brand' ? 'Brand Description' : 'Bio'}
                </label>
                <Textarea
                  name={accountType === 'brand' ? 'brandDescription' : 'bio'}
                  id={accountType === 'brand' ? 'brandDescription' : 'bio'}
                  rows={3}
                  className="resize-none rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0057FF] border-0"
                  placeholder={
                    accountType === 'brand'
                      ? 'Describe your brand...'
                      : 'Tell others about yourself, your interests, and what you do...'
                  }
                  value={accountType === 'brand' ? brandDescription : bio}
                  onChange={handleBioChange}
                  maxLength={300} // Note: charCount logic is for 150, this allows more input
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    Share what makes you unique
                  </p>
                  <span className="text-xs text-gray-400">{charCount}/150</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      id="location"
                      name="location"
                      placeholder="City, Country"
                      value={location}
                      onChange={handleInputChange}
                      className="pl-10 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0057FF] border-0"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Website
                  </label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="url"
                      id="website"
                      name="website"
                      placeholder="https://yourwebsite.com"
                      value={website}
                      onChange={handleInputChange}
                      className="pl-10 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0057FF] border-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Card */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
            <div className="flex items-center p-5 bg-gray-50/50">
              <AtSign className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="font-medium text-gray-700">Social Links</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mr-3">
                    <Instagram className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      name="instagram"
                      placeholder="@username"
                      value={instagram}
                      onChange={handleInputChange}
                      className="rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0057FF] border-0"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mr-3">
                    <Twitter className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      name="twitter"
                      placeholder="@username"
                      value={twitter}
                      onChange={handleInputChange}
                      className="rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0057FF] border-0"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 mr-3">
                    <Facebook className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      name="facebook"
                      placeholder="username or profile URL"
                      value={facebook}
                      onChange={handleInputChange}
                      className="rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0057FF] border-0"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-blue-900 mr-3">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title>LinkedIn</title>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      name="linkedin"
                      placeholder="linkedin.com/in/username"
                      value={linkedin}
                      onChange={handleInputChange}
                      className="rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0057FF] border-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Settings Card */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
            <div className="flex items-center p-5 bg-gray-50/50">
              <Settings className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="font-medium text-gray-700">Privacy Settings</h3>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Public Profile
                    </p>
                    <p className="text-xs text-gray-500">
                      Allow others to discover your profile
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isProfilePublic}
                  onCheckedChange={(checked) =>
                    handleSwitchChange('isProfilePublic', checked)
                  }
                  className="rounded-md [&_span]:rounded [&_span]:shadow-md data-[state=checked]:bg-[#0077FF] data-[state=checked]:[&_span]:ml-auto transition-all duration-300 ease-in-out [&_span]:size-[0.9rem] p-[0.1rem]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Show Location
                    </p>
                    <p className="text-xs text-gray-500">
                      Display your location on your profile
                    </p>
                  </div>
                </div>
                <Switch
                  checked={showLocation}
                  onCheckedChange={(checked) =>
                    handleSwitchChange('showLocation', checked)
                  }
                  className="rounded-md [&_span]:rounded [&_span]:shadow-md data-[state=checked]:bg-[#0077FF] data-[state=checked]:[&_span]:ml-auto transition-all duration-300 ease-in-out [&_span]:size-[0.9rem] p-[0.1rem]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AtSign className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Allow Messages
                    </p>
                    <p className="text-xs text-gray-500">
                      Let others send you direct messages
                    </p>
                  </div>
                </div>
                <Switch
                  checked={allowMessages}
                  onCheckedChange={(checked) =>
                    handleSwitchChange('allowMessages', checked)
                  }
                  className="rounded-md [&_span]:rounded [&_span]:shadow-md data-[state=checked]:bg-[#0077FF] data-[state=checked]:[&_span]:ml-auto transition-all duration-300 ease-in-out [&_span]:size-[0.9rem] p-[0.1rem]"
                />
              </div>
            </div>
          </div>

          {/* Pro Tip Card (Main one at the bottom) */}
          <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Sparkles className="h-5 w-5 text-[#0057FF]" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-800 text-sm">Pro Tip</h3>
                <div className="mt-1 text-gray-600 text-sm">
                  <p>
                    A complete profile with photo and social links helps others
                    connect with you and builds trust in the community!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6">
            <Button className="w-full bg-[#0057FF] hover:bg-[#0057FF]/90 h-12 text-base font-medium rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057FF] text-white">
              Complete Profile Setup
            </Button>
            <p className="text-center text-sm text-gray-500 mt-3">
              You can always update your profile later in settings
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
