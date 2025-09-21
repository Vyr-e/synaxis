'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Check, Sparkles, Upload, X, Plus, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@repo/design-system/components/ui/button';
import {
  FileUpload,
  FileUploadDropzone,
} from '@repo/design-system/components/ui/file-upload';
import { ProfileAvatar } from '@repo/design-system/components/ui/profile-avatar';
import { cn } from '@repo/design-system/lib/utils';

import { useUploadThing } from '@/lib/uploadthing';
import { useFormStore } from '@/store/use-onboarding-store';

import { AVATAR_OPTIONS } from '../constants';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/design-system/components/ui/tooltip';

const avatarOptions = AVATAR_OPTIONS.slice(0, 3); // Only show 3 options

export function ProfilePhotoSection() {
  const formData = useFormStore((state) => state.formData);
  const setProfilePictureAction = useFormStore(
    (state) => state.setProfilePicture
  );
  const setGeneratedAvatar = useFormStore((state) => state.setGeneratedAvatar);
  const clearAvatar = useFormStore((state) => state.clearAvatar);

  const {
    profilePicture,
    profilePicturePreview,
    profilePictureUrl,
    brandName,
    generatedAvatarMetadata,
  } = formData;

  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState<number | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [avatarSeed, setAvatarSeed] = useState(0);

  const { startUpload, isUploading: uploadThingIsUploading } = useUploadThing(
    'imageUploader',
    {
      onClientUploadComplete: (res) => {
        if (res?.[0]?.ufsUrl) {
          setProfilePictureAction(previewFile, res[0].ufsUrl);
          toast.success('Profile picture uploaded successfully!');
          setUploadProgress(100);
          // Clear preview state since we now have the uploaded URL
          setPreviewFile(null);
          setPreviewUrl('');
        } else {
          toast.error('Upload completed but no URL received.');
          setUploadProgress(0);
        }
        setTimeout(() => setUploadProgress(0), 500);
      },
      onUploadError: (error: Error) => {
        toast.error(`Upload failed: ${error.message}`);
        setUploadProgress(0);
        // Keep preview on error
      },
      onUploadProgress: setUploadProgress,
    }
  );

  const handleFileValueChange = (files: File[]) => {
    const file = files[0] ?? null;
    setSelectedAvatarIndex(null);

    if (file) {
      // Just preview, don't upload yet
      const preview = URL.createObjectURL(file);
      setPreviewFile(file);
      setPreviewUrl(preview);
    } else {
      setPreviewFile(null);
      setPreviewUrl('');
    }
  };

  const handleUpload = () => {
    if (previewFile) {
      startUpload([previewFile]);
    }
  };

  const removeProfilePicture = () => {
    // Clear everything and go back to avatar selection
    clearAvatar();
    setSelectedAvatarIndex(null);
    setPreviewFile(null);
    setPreviewUrl('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const selectAvatar = (index: number) => {
    setSelectedAvatarIndex(index);
    const avatarUsername = formData.username || brandName || 'User';
    const option = avatarOptions[index];
    const metaData = `${avatarUsername}${option.seed}${avatarSeed}_variant_${option.style}_size_60_square_false`;
    setGeneratedAvatar(metaData);
    // Clear any preview
    setPreviewFile(null);
    setPreviewUrl('');
  };

  const regenerateAvatars = () => {
    setAvatarSeed(prev => prev + 1);
    // If an avatar is currently selected, update it with the new seed
    if (selectedAvatarIndex !== null) {
      selectAvatar(selectedAvatarIndex);
    }
  };

  // Check if we need to show a default avatar
  const hasNoAvatar =
    !profilePicturePreview &&
    !profilePictureUrl &&
    !generatedAvatarMetadata &&
    selectedAvatarIndex === null &&
    !previewUrl;

  // Generate default avatar metadata
  const getDefaultAvatarMetadata = () => {
    const avatarUsername = formData.username || brandName || 'User';
    const seed =
      formData.firstName ||
      formData.lastName ||
      avatarUsername ||
      crypto.randomUUID().slice(0, 8);
    const defaultStyle = 'beam';
    return `${avatarUsername}${seed}_variant_${defaultStyle}_size_60_square_false`;
  };

  const currentAvatarMetadata = hasNoAvatar
    ? getDefaultAvatarMetadata()
    : generatedAvatarMetadata;

  const displayImageUrl = profilePicturePreview || profilePictureUrl || '';
  const fileUploadValue = previewFile ? [previewFile] : [];
  const avatarUsername = formData.username || brandName || 'User';

  // Show uploaded image or preview
  const showUploadedImage = displayImageUrl || previewUrl;

  return (
    <div className="overflow-hidden rounded-2xl bg-neutral-900/30 shadow-sm ring-1 ring-neutral-800">
      

      <div className="p-3 sm:p-6">
        <div className="flex flex-col items-center justify-center gap-4">
          {showUploadedImage ? (
            <>
              {/* Show uploaded/preview image */}
              <div className="relative h-20 w-20 overflow-hidden rounded-lg border-2 border-white">
                <Image
                  src={previewUrl || displayImageUrl}
                  alt="Profile Preview"
                  fill
                  className="object-cover"
                  sizes="80px"
                />

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

              <div className="flex justify-center space-x-2">
                {/* If it's just a preview (not uploaded yet), show upload button */}
                {previewFile && !displayImageUrl && (
                  <Button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploadThingIsUploading}
                    className="relative h-10 overflow-hidden rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-500 transition-all hover:scale-[1.02] hover:bg-emerald-500/30"
                  >
                    <Upload className="mr-1 h-3 w-3" />
                    Upload
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={removeProfilePicture}
                  disabled={uploadThingIsUploading}
                  className="relative h-10 overflow-hidden rounded-xl bg-neutral-700/10 px-4 py-2 text-sm font-medium text-white transition-all hover:scale-[1.02] hover:bg-neutral-600/10"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>

                  <X className="mr-1 h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Remove
                    </TooltipContent>

                  </Tooltip>
                  
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-white/60">PNG, JPG up to 2MB</p>
              </div>
            </>
          ) : (
            <>
              {/* Show avatar selection grid */}
              <div className="flex w-full  items-center justify-between">
                <p className="text-xs text-white/60">Choose an avatar</p>
                <button
                  type="button"
                  onClick={regenerateAvatars}
                  className="flex items-center space-x-1 rounded-md bg-neutral-700/50 px-2 py-1 transition-colors hover:bg-neutral-600/50"
                >
                  <RefreshCw className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">Regenerate</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 w-fit mx-auto">
                {/* Upload slot - first position */}
                <FileUpload
                  value={fileUploadValue}
                  onValueChange={handleFileValueChange}
                  maxFiles={1}
                  maxSize={2 * 1024 * 1024}
                  accept={'image/*'}
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

                {/* Generated avatar options */}
                {avatarOptions.map((option, index) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => selectAvatar(index)}
                    className={cn(
                      'flex size-28 items-center justify-center overflow-hidden rounded-lg transition-all hover:scale-105 m-3',
                      selectedAvatarIndex === index
                        ? 'bg-neutral-700/50 ring-2 ring-white'
                        : 'bg-neutral-800/30 ring-1 ring-neutral-600 hover:ring-neutral-500'
                    )}
                  >
                    <ProfileAvatar
                      username={`${avatarUsername}${option.seed}${avatarSeed}`}
                      avatarStyle={option.style}
                      size={88}
                      className="rounded-lg"
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
