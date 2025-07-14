import { cn } from '@repo/design-system/lib/utils';

interface SquircleLoaderProps {
  size?: number;
  color?: string;
  speed?: number;
  className?: string;
}

export function SquircleLoader({
  size = 37,
  color = 'black',
  speed = 0.9,
  className = '',
}: SquircleLoaderProps) {
  const pathD =
    'M0.37 18.5 C0.37 5.772 5.772 0.37 18.5 0.37 S36.63 5.772 36.63 18.5 S31.228 36.63 18.5 36.63 S0.37 31.228 0.37 18.5';

  return (
    <>
      <svg
        viewBox="0 0 37 37"
        height={size}
        width={size}
        className={cn(className, 'text-black')}
        preserveAspectRatio="xMidYMid meet"
        style={{
          height: size,
          width: size,
          transformOrigin: 'center',
          overflow: 'visible',
        }}
      >
        <title>Loading...</title>
        <path
          fill="none"
          stroke={color}
          strokeWidth="5"
          pathLength="100"
          d={pathD}
          opacity={0.1}
          style={{
            transition: 'stroke 0.5s ease',
          }}
        />
        <path
          fill="none"
          stroke={color}
          strokeWidth="5"
          pathLength="100"
          d={pathD}
          strokeDasharray="15, 85"
          strokeDashoffset="0"
          strokeLinecap="round"
          style={{
            animation: `travel ${speed}s linear infinite`,
            willChange: 'stroke-dasharray, stroke-dashoffset',
            transition: 'stroke 0.5s ease',
          }}
        />
      </svg>

      <style jsx>{`
        @keyframes travel {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
    </>
  );
}
