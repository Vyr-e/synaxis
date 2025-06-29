'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import { BasicInfoSection } from './basic-info-section';
import { PrivacySettingsSection } from './privacy-settings-section';
import { ProfilePhotoSection } from './profile-photo-section';
import { SocialLinksSection } from './social-links-section';

export function ProfileForm() {
  return (
    <div className="w-full max-w-4xl mx-auto h-[calc(100dvh-200px)] flex flex-col p-1 sm:p-2 md:p-4">
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <ProfilePhotoSection />
          <BasicInfoSection />
          <SocialLinksSection />
          <PrivacySettingsSection />

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

          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-3 sm:p-6">
            <p className="text-center text-sm text-gray-500 mt-3">
              You can always update your profile later in settings
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
