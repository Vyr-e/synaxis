import localFont from 'next/font/local';

export const lora = localFont({
  src: [
    {
      path: './Lora-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Lora-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './Lora-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './Lora-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-lora',
  display: 'swap',
  preload:true
}); 