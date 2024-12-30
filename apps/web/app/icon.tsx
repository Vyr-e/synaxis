import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1A1A1A',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            width: '90%',
            height: '90%',
            border: '2px solid #5FFF2F',
            borderRadius: '6px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Center dot */}
          <div
            style={{
              width: '4px',
              height: '4px',
              backgroundColor: '#5FFF2F',
              borderRadius: '50%',
              position: 'absolute',
            }}
          />
          
          {/* Static items in a circle */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI * 2) / 8;
            const x = Math.cos(angle) * 8;
            const y = Math.sin(angle) * 8;
            
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#1E1E1E',
                  border: '1px solid #5FFF2F',
                  borderRadius: '50% 50% 0 0',
                  transform: `translate(${x}px, ${y}px) rotate(${angle}rad)`,
                }}
              />
            );
          })}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
