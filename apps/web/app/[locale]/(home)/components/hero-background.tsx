'use client';
import { MeshGradient } from '@paper-design/shaders-react';
import type { ReactNode } from 'react';

export default function HeroBackground({
  children,
}: { children: Readonly<ReactNode> }) {
  return (
    <div>
      <MeshGradient
        color1="#FFC0CB" // pink
        color2="#FFFF00" // yellow
        color3="#0000FF" // blue
        color4="#800080" // purple
        speed={0.25}
        style={{ width: 500, height: 200 }}
      />
      {children}
    </div>
  );
}
