'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Check, Sparkles, Upload, X } from 'lucide-react';
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

const avatarOptions = AVATAR_OPTIONS;

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
  } = formData;

  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState<number | null>(
    null
  );

  const { startUpload, isUploading: uploadThingIsUploading } = useUploadThing(
    'imageUploader',
    {
      onClientUploadComplete: (res) => {
        if (res?.[0]?.url || res?.[0]?.ufsUrl) {
          setProfilePictureAction(null, res[0].url || res[0].ufsUrl);
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

  const handleFileValueChange = (files: File[]) => {
    const file = files[0] ?? null;
    setUploadProgress(0);
    setSelectedAvatarIndex(null);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfilePictureAction(file, previewUrl);
      startUpload([file]);
    } else {
      setProfilePictureAction(null, '');
    }
  };

  const removeProfilePicture = () => {
    clearAvatar();
    setSelectedAvatarIndex(null);
  };

  const selectAvatar = (index: number) => {
    setSelectedAvatarIndex(index);
    const avatarUsername = formData.username || brandName || 'User';
    const option = avatarOptions[index];
    const metaData = `${avatarUsername}${option.seed}-${option.style}`;
    setGeneratedAvatar(metaData);
  };

  const displayImageUrl = profilePicturePreview || profilePictureUrl || '';
  const fileUploadValue = profilePicture ? [profilePicture] : [];
  const avatarUsername = formData.username || brandName || 'User';

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
      <div className="flex items-center p-3 sm:p-5 bg-gray-50/50">
        <Camera className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="font-medium text-gray-700">Profile Photo</h3>
      </div>

      <div className="p-3 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    uploadThingIsUploading && 'cursor-not-allowed opacity-70',
                    displayImageUrl
                      ? 'border-[#0057FF]'
                      : 'border-gray-300 bg-gray-50/30 hover:border-[#0057FF] hover:bg-blue-50/30'
                  )}
                >
                  {displayImageUrl ? (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden">
                      <Image
                        src={displayImageUrl}
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
                                  transition={{ ease: 'linear', duration: 0.1 }}
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
                Use a square image with your face clearly visible for the best
                results.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">
              Or choose a generated avatar
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {avatarOptions.map((option, index) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => selectAvatar(index)}
                  className={cn(
                    'relative p-3 rounded-xl transition-all hover:scale-105',
                    selectedAvatarIndex === index
                      ? 'ring-2 ring-[#0057FF] bg-blue-50/50'
                      : 'ring-1 ring-gray-200 hover:ring-gray-300 bg-white'
                  )}
                >
                  <ProfileAvatar
                    username={avatarUsername + option.seed}
                    avatarStyle={option.style}
                    size={40}
                    className="mx-auto"
                  />
                  <span className="text-xs text-gray-500 mt-2 block text-center capitalize">
                    {option.style}
                  </span>
                </button>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">
                These avatars are generated uniquely based on your username and
                will always look the same.
              </p>
              <p className="text-xs text-gray-500">
                Perfect if you prefer not to upload a personal photo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
