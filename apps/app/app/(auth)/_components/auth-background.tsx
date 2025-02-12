'use client';
import { cn } from '@repo/design-system';
import { MeshGradient } from '@repo/ui-utils';
import type { ReactNode } from 'react';

type Edge = 'sm' | 'md' | 'lg' | 'xl' | string;

export function AuthBackground({
  children,
  className,
  colors1 = '#FFC0CB',
  colors2 = '#FFFF00',
  colors3 = '#0000FF',
  colors4 = '#800080',
  speed = 0,
  edge = 'sm',
  seed = 0,
  ...props
}: {
  children: ReactNode;
  className?: string;
  colors1?: string;
  colors2?: string;
  colors3?: string;
  colors4?: string;
  speed?: number;
  edge?: Edge;
  seed?: number;
}) {
  return (
    <div
      className={cn(
        'relative h-full min-h-full w-full transition-all duration-300 ease-in-out',
        className
      )}
      style={{ borderRadius: getBorderRadius(edge) }}
    >
      <div className={'absolute inset-0 '}>
        <MeshGradient
          color1={colors1}
          color2={colors2}
          color3={colors3}
          color4={colors4}
          speed={speed}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: getBorderRadius(edge),
          }}
          seed={seed}
          {...props}
        />
      </div>
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

function getBorderRadius(edge: Edge) {
  switch (edge) {
    case 'sm':
      return '2%';
    case 'md':
      return '2.5%';
    case 'lg':
      return '3%';
    case 'xl':
      return '3.5%';
    case String(edge):
      return edge;
    default:
      return '2%';
  }
}
