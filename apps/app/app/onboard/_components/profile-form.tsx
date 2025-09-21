'use client';

import { motion } from 'framer-motion';
import { Camera, Sparkles, User, Building2, Lock, Globe } from 'lucide-react';
import { useState } from 'react';
import { useFormStore } from '@/store/use-onboarding-store';
import { Button } from '@repo/design-system/components/ui/button';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';
import { cn } from '@repo/design-system/lib/utils';

import { ProfilePhotoSection } from './profile-photo-section';


export function ProfileForm() {
  const formData = useFormStore((state) => state.formData);
  const setField = useFormStore((state) => state.setField);
  const { accountType, bio, brandDescription, isPublic } = formData;

  const isBrand = accountType === 'brand';

  const handleBioChange = (value: string) => {
    setField('bio', value);
  };

  const handleDescriptionChange = (value: string) => {
    setField('brandDescription', value);
  };

  const handlePrivacyToggle = (isPublicProfile: boolean) => {
    setField('isPublic', isPublicProfile);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 px-4 md:px-6"
      >
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-neutral-900/50 border border-neutral-800">
            <TabsTrigger value="profile" className="data-[state=active]:bg-neutral-700/50 data-[state=active]:text-white text-white/60">
              Profile Photo
            </TabsTrigger>
            <TabsTrigger value="bio" className="data-[state=active]:bg-neutral-700/50 data-[state=active]:text-white text-white/60">
              Bio (Optional)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <ProfilePhotoSection />
          </TabsContent>

          <TabsContent value="bio" className="mt-6">
            <div className="bg-neutral-900/30 rounded-2xl shadow-sm ring-1 ring-neutral-800 overflow-hidden">
              <div className="p-6">
                <Textarea
                  placeholder={isBrand ? "Tell people about your brand..." : "Tell people about yourself..."}
                  value={bio || ''}
                  onChange={(e) => handleBioChange(e.target.value)}
                  className="min-h-[100px] bg-neutral-800/50 border-neutral-700 text-white placeholder:text-white/40 focus:border-white/50 resize-none"
                  maxLength={160}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-white/60">
                    {isBrand ? "Describe your brand in a few words" : "A short description about yourself"}
                  </p>
                  <span className="text-xs text-white/40">
                    {(bio || '').length}/160
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Brand-specific fields */}
        {isBrand && (
          <>
            {/* Brand Description */}
            <div className="bg-neutral-900/30 rounded-2xl shadow-sm ring-1 ring-neutral-800 overflow-hidden">
              <div className="p-6">
                <Textarea
                  placeholder="Describe what your brand does, your mission, values..."
                  value={brandDescription || ''}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  className="min-h-[120px] bg-neutral-800/50 border-neutral-700 text-white placeholder:text-white/40 focus:border-white/50 resize-none"
                  maxLength={300}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-white/60">
                    Detailed description of your brand and what you offer
                  </p>
                  <span className="text-xs text-white/40">
                    {(brandDescription || '').length}/300
                  </span>
                </div>
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="bg-neutral-900/30 rounded-2xl shadow-sm ring-1 ring-neutral-800 overflow-hidden">
              <div className="p-6">
                <div className="space-y-3">
                  <button
                    onClick={() => handlePrivacyToggle(true)}
                    className={cn(
                      "w-full p-4 rounded-xl border transition-all text-left",
                      isPublic
                        ? "border-white bg-neutral-700/50 text-white"
                        : "border-neutral-600 bg-neutral-800/30 text-white/60 hover:border-neutral-500"
                    )}
                  >
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 mr-3" />
                      <div>
                        <h4 className="font-medium">Public Profile</h4>
                        <p className="text-sm text-white/60">Anyone can discover and view your brand</p>
                      </div>
                      {isPublic && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => handlePrivacyToggle(false)}
                    className={cn(
                      "w-full p-4 rounded-xl border transition-all text-left",
                      !isPublic
                        ? "border-white bg-neutral-700/50 text-white"
                        : "border-neutral-600 bg-neutral-800/30 text-white/60 hover:border-neutral-500"
                    )}
                  >
                    <div className="flex items-center">
                      <Lock className="h-5 w-5 mr-3" />
                      <div>
                        <h4 className="font-medium">Private Profile</h4>
                        <p className="text-sm text-white/60">Only you control who can see your brand</p>
                      </div>
                      {!isPublic && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}


        {/* Footer */}
        <div className="bg-neutral-900/30 rounded-2xl shadow-sm ring-1 ring-neutral-800 p-3 sm:p-6">
          <p className="text-center text-sm text-white/60">
            You can always update your profile later in settings
          </p>
        </div>
      </motion.div>
    </div>
  );
}
