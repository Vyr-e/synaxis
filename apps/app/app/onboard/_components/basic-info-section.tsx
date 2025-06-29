'use client';

import { Link, MapPin, User } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';

import { Input } from '@repo/design-system/components/ui/input';
import { Textarea } from '@repo/design-system/components/ui/textarea';

import {
  type FormData as StoreFormData,
  useFormStore,
} from '@/store/use-onboarding-store';

export function BasicInfoSection() {
  const formData = useFormStore((state) => state.formData);
  const setField = useFormStore((state) => state.setField);

  const {
    bio,
    accountType,
    brandName,
    brandDescription,
    website,
    location = '',
  } = formData;

  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const currentText = accountType === 'brand' ? brandDescription : bio;
    const textWithoutSpaces = currentText?.replace(/\s+/g, '') ?? '';
    setCharCount(textWithoutSpaces.length);
  }, [bio, brandDescription, accountType]);

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

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
      <div className="flex items-center p-3 sm:p-5 bg-gray-50/50">
        <User className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="font-medium text-gray-700">Basic Information</h3>
      </div>

      <div className="p-3 sm:p-6 space-y-5">
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
            maxLength={300}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">Share what makes you unique</p>
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
  );
}
