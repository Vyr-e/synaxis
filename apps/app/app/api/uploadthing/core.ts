import { auth } from '@repo/auth/server';
import { headers } from 'next/headers';
import { type FileRouter, createUploadthing } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

export const ourFileRouter: FileRouter = {
  imageUploader: f({ image: { maxFileSize: '8MB', maxFileCount: 2 } })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      const user = session?.user;

      if (!user) {
        throw new UploadThingError('Unauthorized');
      }

      return { userId: user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      const metaUser = metadata.userId;
      const uploadedFileInfo = file;
      return {
        uploadedBy: metaUser,
        url: uploadedFileInfo.url,
        ufsUrl: uploadedFileInfo.ufsUrl,
        key: uploadedFileInfo.key,
        name: uploadedFileInfo.name,
        size: uploadedFileInfo.size,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
