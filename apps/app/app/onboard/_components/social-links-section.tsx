'use client';

import { AtSign, Facebook, Instagram, Twitter } from 'lucide-react';
import type React from 'react';

import { Input } from '@repo/design-system/components/ui/input';

import {
  type FormData as StoreFormData,
  useFormStore,
} from '@/store/use-onboarding-store';

export function SocialLinksSection() {
  const formData = useFormStore((state) => state.formData);
  const setField = useFormStore((state) => state.setField);

  const { instagram, twitter, facebook, linkedin = '' } = formData;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setField(e.target.name as keyof StoreFormData, e.target.value);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
      <div className="flex items-center p-3 sm:p-5 bg-gray-50/50">
        <AtSign className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="font-medium text-gray-700">Social Links</h3>
      </div>

      <div className="p-3 sm:p-6 space-y-4">
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
  );
}
