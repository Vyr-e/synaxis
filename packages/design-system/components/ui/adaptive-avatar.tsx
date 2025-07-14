'use client';

import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@repo/design-system/components/ui/avatar';
import { ProfileAvatar, type ProfileAvatarProps } from './profile-avatar';
import { cn } from '@repo/design-system/lib/utils';

/**
 * Checks if a string is a valid image source (URL or data URI).
 */
const isImageUrl = (src: string | undefined | null): src is string => {
  if (!src) return false;
  return (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:image') ||
    src.startsWith('/')
  );
};

/**
 * Parses the metadata string from ProfileAvatar.
 */
const parseAvatarString = (
  str: string | undefined | null
): Omit<ProfileAvatarProps, 'onMetaDataGenerated'> | null => {
  if (!str || typeof str !== 'string') return null;
  const parts = str.split('_');
  if (parts.length < 7 || parts[1] !== 'variant' || parts[3] !== 'size' || parts[5] !== 'square') {
    return null;
  }
  return {
    username: parts[0],
    avatarStyle: parts[2] as ProfileAvatarProps['avatarStyle'],
    size: parseInt(parts[4], 10),
    square: parts[6] === 'true',
  };
};

interface AdaptiveAvatarProps {
  src?: string | null;
  alt: string;
  fallbackUsername?: string;
  size?: number;
  className?: string;
  onMetaDataGenerated?: (metaData: string) => void;
}

export const AdaptiveAvatar: React.FC<AdaptiveAvatarProps> = ({
  src,
  alt,
  fallbackUsername = 'Avatar',
  size = 80,
  className,
  onMetaDataGenerated,
}) => {
  const isUrl = isImageUrl(src)

  if(isUrl){
	return (
	<Avatar className={cn('h-24 w-24 rounded-lg', className)}>
        <AvatarImage
          src={src || ''}
          alt={alt}
          className="object-contain"
		  aria-label={`${fallbackUsername} avatar`}	
        />
       <AvatarFallback className="flex h-full w-full items-center justify-center bg-transparent">
		{fallbackUsername}
		</AvatarFallback> 
    </Avatar>
	)	
  }
    
    return (
      <ProfileAvatar
        username={fallbackUsername}
        avatarStyle="marble"
        size={size}
		avatarString={src || ''}
		className={cn('h-24 w-24 rounded-lg', className)}
        onMetaDataGenerated={onMetaDataGenerated}
      />
    );
  };

;