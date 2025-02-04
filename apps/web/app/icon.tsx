import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/x-icon';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="synaxis logo"
        role="img"
      >
        <title>Synaxis Logo</title>
        <circle
          cx="16"
          cy="16"
          r="13.5"
          stroke="#000000"
          strokeWidth="6"
          style={{
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }}
        />
      </svg>
    </div>,
    {
      ...size,
      headers: {
        'Content-Type': 'image/x-icon',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
}
