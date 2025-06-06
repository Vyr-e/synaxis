import { ProfileAvatar } from '@repo/design-system/components/ui/profile-avatar';
import {
  Check,
  Eye,
  EyeOff,
  Facebook,
  Instagram,
  Link,
  MapPin,
  Sparkles,
  Twitter,
  User,
} from 'lucide-react';
import Image from 'next/image';

interface ProfilePreviewCardProps {
  formData: {
    bio: string;
    location: string;
    website: string;
    instagram: string;
    twitter: string;
    facebook: string;
    linkedin: string;
    isProfilePublic: boolean;
    showLocation: boolean;
    profilePicturePreview: string;
    profilePictureUrl: string;
    selectedAvatarIndex: number | null;
    useGeneratedAvatar: boolean;
  };
  avatarOptions: Array<{
    style: 'beam' | 'marble';
    key: string;
    seed: number;
  }>;
  avatarUsername: string;
}

export default function ProfilePreviewCard({
  formData,
  avatarOptions,
  avatarUsername,
}: ProfilePreviewCardProps) {
  const {
    bio,
    location,
    website,
    instagram,
    twitter,
    facebook,
    linkedin,
    isProfilePublic,
    showLocation,
    profilePicturePreview,
    profilePictureUrl,
    selectedAvatarIndex,
    useGeneratedAvatar,
  } = formData;

  const displayImageUrl = profilePicturePreview || profilePictureUrl || '';

  return (
    <div className="w-96">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="relative p-6 pb-4 bg-gray-50">
          {/* Status badges */}
          <div className="absolute top-4 right-4">
            <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium flex items-center">
              {isProfilePublic ? (
                <>
                  <Eye className="h-3 w-3 mr-1" />
                  Public
                </>
              ) : (
                <>
                  <EyeOff className="h-3 w-3 mr-1" />
                  Private
                </>
              )}
            </div>
          </div>

          <div className="absolute top-4 left-4">
            <div className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              Preview
            </div>
          </div>

          {/* Profile photo */}
          <div className="flex justify-center pt-8">
            <div className="relative h-24 w-24">
              {useGeneratedAvatar && selectedAvatarIndex !== null ? (
                <div className="relative h-full w-full rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                  <ProfileAvatar
                    username={
                      avatarUsername + avatarOptions[selectedAvatarIndex].seed
                    }
                    avatarStyle={avatarOptions[selectedAvatarIndex].style}
                    size={96}
                    className="h-full w-full"
                  />
                </div>
              ) : displayImageUrl ? (
                <div className="relative h-full w-full rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                  <Image
                    src={displayImageUrl || '/placeholder.svg'}
                    alt="Profile"
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              ) : (
                <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center ring-4 ring-white shadow-lg">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}

              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 ring-2 ring-white">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-4">
          {/* Name and info */}
          <div className="text-center mb-6">
            <h3 className="font-bold text-gray-900 text-lg mb-1">Your Name</h3>

            {location && showLocation && (
              <div className="flex items-center justify-center text-sm text-gray-500 mb-3">
                <MapPin className="h-3 w-3 mr-1" />
                {location}
              </div>
            )}

            <p className="text-gray-600 text-sm leading-relaxed px-2">
              {bio ||
                'Your bio will appear here. Share what makes you unique and interesting.'}
            </p>
          </div>

          {/* Website */}
          {website && (
            <div className="mb-6 flex justify-center">
              <a
                href={website}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-full transition-colors"
              >
                <Link className="h-3 w-3 mr-2" />
                Visit Website
              </a>
            </div>
          )}

          {/* Social links */}
          {(instagram || twitter || facebook || linkedin) && (
            <div className="mb-6">
              <div className="flex justify-center space-x-3">
                {instagram && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Instagram className="h-4 w-4 text-white" />
                  </div>
                )}
                {twitter && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <Twitter className="h-4 w-4 text-white" />
                  </div>
                )}
                {facebook && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <Facebook className="h-4 w-4 text-white" />
                  </div>
                )}
                {linkedin && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title>LinkedIn</title>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center py-4 border-t border-gray-100 mb-6">
            <div>
              <div className="text-lg font-bold text-gray-900">0</div>
              <div className="text-xs text-gray-500">Posts</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">0</div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">0</div>
              <div className="text-xs text-gray-500">Following</div>
            </div>
          </div>

          {/* Follow button */}
          <button
            className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full h-10 font-medium transition-colors"
            type="button"
          >
            Follow
          </button>
        </div>
      </div>
    </div>
  );
}
