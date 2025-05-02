'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AtSign,
  Briefcase,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Facebook,
  Globe,
  Instagram,
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

import {
  FileUpload,
  FileUploadDropzone,
} from '@repo/design-system/components/ui/file-upload';
// Import UI components
import { Input } from '@repo/design-system/components/ui/input';

// Import store and types
import {
  type FormData as StoreFormData,
  useFormStore,
} from '@/store/use-onboarding-store';

import { useUploadThing } from '@/lib/uploadthing';
import { cn } from '@repo/design-system/lib/utils';

// Define section types
type SectionId = 'photo' | 'bio' | 'social' | 'brand';
type Section = {
  id: SectionId;
  label: string;
  icon: React.ElementType;
};

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
  } = formData;

  // --- Component State ---
  const [charCount, setCharCount] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionId>('photo');
  const [uploadProgress, setUploadProgress] = useState(0);

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

  // Calculate sections based on account type
  const sections: Section[] = [
    { id: 'photo', label: 'Profile Photo', icon: User },
    { id: 'bio' as SectionId, label: 'Bio', icon: Edit2 },
    { id: 'social' as SectionId, label: 'Social', icon: AtSign },
    ...(accountType === 'brand'
      ? [{ id: 'brand' as SectionId, label: 'Brand', icon: Briefcase }]
      : []),
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

  const handleFileValueChange = (files: File[]) => {
    const file = files[0] ?? null;
    setUploadProgress(0);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfilePictureAction(file, previewUrl);
      startUpload([file]);
    } else {
      setProfilePictureAction(null, '');
    }
  };

  const handlePrivacyChange = (value: 'public' | 'private') => {
    setField('communityPrivacy', value);
  };

  // --- Helper Functions ---
  const isSectionCompleted = (sectionId: SectionId): boolean => {
    switch (sectionId) {
      case 'photo':
        return (
          !!profilePictureUrl ||
          (!!profilePicturePreview && !uploadThingIsUploading)
        );
      case 'bio':
        return accountType === 'brand'
          ? !!brandDescription?.trim()
          : !!bio?.trim();
      case 'social':
        return !!(
          instagram ||
          twitter ||
          facebook ||
          (accountType === 'brand' && website)
        );
      case 'brand':
        return accountType === 'brand' && !!brandName?.trim();
      default:
        return false;
    }
  };

  const goToNextSection = () => {
    const currentIndex = sections.findIndex((s) => s.id === activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  const goToPrevSection = () => {
    const currentIndex = sections.findIndex((s) => s.id === activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
    }
  };

  // Image display logic
  const displayImageUrl = profilePicturePreview || profilePictureUrl || '';
  const fileUploadValue = profilePicture ? [profilePicture] : [];
  const isLastSection = activeSection === sections.at(-1)?.id;

  // --- Render Components ---
  const renderProgressIndicator = () => (
        <div className="relative mb-8 flex justify-center">
      {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation> */}
          {sections.map((section, index) => {
            const isActive = section.id === activeSection;
            const isCompleted = isSectionCompleted(section.id);
            const Icon = section.icon;

            return (
              <div key={section.id} className="flex items-center">
                {/* Section circle */}
                <motion.div
              className={cn(
                'relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full',
                {
                  'bg-[#0057FF] text-white shadow-lg': isActive,
                  'bg-green-500 text-white': isCompleted && !isActive,
                  'bg-gray-100 text-gray-400': !isActive && !isCompleted,
                }
              )}
              whileHover={{ scale: 1.1 }}
                  onClick={() => setActiveSection(section.id)}
                >
                  {isCompleted && !isActive ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}

                  {/* Label below */}
                  <div className="-bottom-6 -translate-x-1/2 absolute left-1/2 transform whitespace-nowrap">
                    <span
                  className={cn('font-medium text-xs', {
                    'text-[#0057FF]': isActive,
                    'text-gray-500': !isActive,
                  })}
                    >
                      {section.label}
                    </span>
                  </div>
                </motion.div>

                {/* Connector line */}
                {index < sections.length - 1 && (
                  <div className="mx-1 h-[2px] w-16 bg-gray-200">
                      <motion.div
                  className={`h-full ${
                    isSectionCompleted(sections[index + 1].id) ||
                    sections[index + 1].id === activeSection
                      ? 'bg-[#0057FF]'
                      : 'bg-gray-200'
                  }`}
                  initial={{
                    width: isSectionCompleted(section.id) ? '100%' : '0%',
                  }}
                  animate={{
                    width: isSectionCompleted(section.id) ? '100%' : '0%',
                  }}
                        transition={{ duration: 0.5 }}
                      />
                  </div>
                )}
              </div>
            );
          })}
        </div>
  );

  const renderPhotoSection = () => (
              <motion.div
                key="photo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
      <FileUpload
        value={fileUploadValue}
        onValueChange={handleFileValueChange}
        maxFiles={1}
        maxSize={2 * 1024 * 1024}
        accept={'image/*'}
        disabled={uploadThingIsUploading}
        className="relative mb-8"
      >
        <FileUploadDropzone
          className={`group relative flex h-48 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-dashed p-0 ${
            displayImageUrl ? 'border-0' : 'border-2 border-gray-300 bg-gray-50'
          } ${uploadThingIsUploading ? 'cursor-not-allowed opacity-70' : ''}`}
          style={{
            backgroundColor: displayImageUrl ? 'transparent' : bannerColor,
          }}
        >
          {displayImageUrl ? (
            <div className="relative h-full w-full">
              <Image
                src={displayImageUrl}
                alt="Profile Preview"
                fill
                className="object-cover"
                sizes="192px"
              />
              {!uploadThingIsUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all group-hover:bg-opacity-50">
                  <Camera className="h-10 w-10 text-white opacity-0 transition-all group-hover:opacity-100" />
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
                    <div className="relative h-20 w-20">
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
                        <Check className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-8 w-8 text-white" />
                      )}
                        </div>
                    '-translate-x-1/2 -translate-y-1/2 '
                  </motion.div>
                )}
              </AnimatePresence>
                          </div>
          ) : (
            <div className="p-6 text-center text-gray-400">
              <Upload className="mx-auto mb-4 h-12 w-12" />
              <p className="font-medium text-gray-500 text-sm">
                Click or Drag to Upload
                        </p>
                      </div>
                    )}
        </FileUploadDropzone>
      </FileUpload>

                <div className="mt-4 max-w-md text-center">
                  <h3 className="mb-2 font-medium text-gray-800 text-lg">
                    Your profile photo
                  </h3>
                  <p className="text-gray-600 text-sm">
          This will be displayed on your profile and throughout the platform. A
          clear photo helps others recognize you.
                  </p>
                </div>

      {displayImageUrl && !uploadThingIsUploading && (
                <div className="mt-8 flex space-x-4">
                  <button
                    type="button"
            onClick={() => handleFileValueChange([])}
                      className="flex items-center rounded-lg border border-gray-300 px-5 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Remove
                    </button>
        </div>
                  )}
              </motion.div>
  );

  const renderBioSection = () => (
              <motion.div
                key="bio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-xl"
              >
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center font-medium text-gray-800 text-lg">
                    <Edit2 className="mr-2 h-5 w-5 text-[#0057FF]" />
          {accountType === 'brand'
            ? 'Brand Description'
            : 'Tell us about yourself'}
                  </h3>

                  <div className="space-y-4">
                    <div className="relative">
                      <textarea
              name={accountType === 'brand' ? 'brandDescription' : 'bio'}
              id={accountType === 'brand' ? 'brandDescription' : 'bio'}
                        rows={5}
              className="w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-3 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0057FF] focus-visible:ring-offset-2"
                        placeholder={
                          accountType === 'brand'
                            ? 'Describe your brand...'
                            : 'Tell others about yourself...'
                        }
              value={accountType === 'brand' ? brandDescription : bio}
                        onChange={handleBioChange}
              maxLength={300}
                      />
                      <div className="absolute right-3 bottom-3 text-gray-400 text-xs">
                        {charCount}/150
                      </div>
                    </div>

                    {accountType === 'brand' && (
            <div className="space-y-2">
                        <label
                          htmlFor="brandName"
                          className="block font-medium text-gray-700 text-sm"
                        >
                          Brand Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          id="brandName"
                          name="brandName"
                          placeholder="Your brand name"
                          className="border-gray-200"
                value={brandName}
                onChange={handleInputChange}
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Sparkles className="h-5 w-5 text-[#0057FF]" />
                    </div>
                    <div className="ml-3">
            <h3 className="font-medium text-gray-800 text-sm">Pro Tip</h3>
                      <div className="mt-1 text-gray-600 text-sm">
                        <p>
                A great bio helps others understand who you are and what you're
                interested in. Keep it concise but informative!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
  );

  const renderSocialSection = () => {
    const SocialLinkItem = ({
      name,
      label,
      value,
      icon,
      bgClass,
      placeholder,
      withAt = false,
    }: {
      name: string;
      label: string;
      value: string | undefined;
      icon: React.ReactNode;
      bgClass: string;
      placeholder: string;
      withAt?: boolean;
    }) => (
      <div className="flex items-center">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${bgClass}`}
        >
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <label
            htmlFor={name}
            className="mb-1 block font-medium text-gray-700 text-sm"
          >
            {label}
          </label>
          <div className="relative rounded-md">
            {withAt && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">@</span>
              </div>
            )}
            <Input
              type="text"
              name={name}
              id={name}
              className={`border-gray-200 ${withAt ? 'pl-8' : ''}`}
              placeholder={placeholder}
              value={value || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    );

    return (
              <motion.div
                key="social"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-xl"
              >
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-6 flex items-center font-medium text-gray-800 text-lg">
                    <AtSign className="mr-2 h-5 w-5 text-[#0057FF]" />
            Connect your social accounts (Optional)
                  </h3>

                  <div className="space-y-6">
            <SocialLinkItem
                            name="instagram"
              label="Instagram"
              value={instagram}
              icon={<Instagram className="h-6 w-6 text-white" />}
              bgClass="bg-gradient-to-br from-purple-500 to-pink-500"
                            placeholder="username"
              withAt={true}
            />

            <SocialLinkItem
                            name="twitter"
              label="Twitter / X"
              value={twitter}
              icon={<Twitter className="h-6 w-6 text-white" />}
              bgClass="bg-gradient-to-br from-blue-400 to-blue-600"
                            placeholder="username"
              withAt={true}
            />

            <SocialLinkItem
                          name="facebook"
              label="Facebook"
              value={facebook}
              icon={<Facebook className="h-6 w-6 text-white" />}
              bgClass="bg-gradient-to-br from-blue-600 to-blue-800"
                          placeholder="Profile URL or username"
                        />

                    {accountType === 'brand' && (
              <SocialLinkItem
                            name="website"
                label="Website"
                value={website}
                icon={<Globe className="h-6 w-6 text-white" />}
                bgClass="bg-gradient-to-br from-gray-500 to-gray-700"
                            placeholder="https://yourbrand.com"
                          />
                    )}
                  </div>
                </div>

                <div className="mt-6 text-center text-gray-500 text-sm">
                  <p>
            Connecting your social accounts helps others find and follow you
            across platforms. This information is optional.
                  </p>
                </div>
              </motion.div>
    );
  };

  const renderBrandSection = () => (
              <motion.div
                key="brand"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-xl"
              >
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center font-medium text-gray-800 text-lg">
                    <Briefcase className="mr-2 h-5 w-5 text-[#0057FF]" />
          Community Settings
                  </h3>

                  <div className="space-y-4">
                    <div className="border-gray-100 border-t pt-4">
                      <h4 className="mb-3 font-medium text-gray-700 text-sm">
              Community Privacy
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          {
                            id: 'public',
                  label: 'Public',
                  description: 'Anyone can join',
                          },
                          {
                            id: 'private',
                  label: 'Private',
                  description: 'Approval required',
                          },
                        ].map((option) => (
                          <button
                            key={option.id}
                  className={`cursor-pointer rounded-lg border p-3 text-left transition-all ${
                    communityPrivacy === option.id
                      ? 'border-[#0057FF] bg-blue-50 ring-2 ring-[#0057FF]'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                            onClick={() =>
                    handlePrivacyChange(option.id as 'public' | 'private')
                  }
                            type="button"
                          >
                            <div className="mb-1 flex items-center">
                              <input
                      id={`privacy-${option.id}`}
                      name="communityPrivacyRadio"
                                type="radio"
                                value={option.id}
                                className="h-4 w-4 border-gray-300 text-[#0057FF] focus:ring-[#0057FF]"
                      checked={communityPrivacy === option.id}
                      onChange={() =>
                        handlePrivacyChange(option.id as 'public' | 'private')
                      }
                      tabIndex={-1}
                              />
                              <label
                      htmlFor={`privacy-${option.id}`}
                                className="ml-2 block cursor-pointer font-medium text-gray-700 text-sm"
                              >
                                {option.label}
                              </label>
                            </div>
                            <p className="ml-6 text-gray-500 text-xs">
                              {option.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
  );

  const renderNavigationControls = () => (
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={goToPrevSection}
        className={`flex items-center rounded-lg px-4 py-2 font-medium text-sm transition-opacity ${
          activeSection === sections[0].id
            ? 'invisible opacity-0'
            : 'text-gray-600 opacity-100 hover:text-gray-900'
        }`}
        disabled={activeSection === sections[0].id}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </button>
          <button
            type="button"
            onClick={goToNextSection}
            className={`flex items-center rounded-lg px-5 py-2 font-medium text-sm ${
          isLastSection
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-[#0057FF] text-white hover:bg-[#0057FF]/90'
        }`}
          >
        {isLastSection ? 'Finish Section' : 'Next'}
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
    </div>
  );

  return (
    <div className="w-full max-w-3xl">
      <div className="relative">
        {renderProgressIndicator()}

        <div className="mt-12">
          <AnimatePresence mode="wait">
            {activeSection === 'photo' && renderPhotoSection()}
            {activeSection === 'bio' && renderBioSection()}
            {activeSection === 'social' && renderSocialSection()}
            {activeSection === 'brand' &&
              accountType === 'brand' &&
              renderBrandSection()}
          </AnimatePresence>
        </div>

        {renderNavigationControls()}
      </div>
    </div>
  );
}
