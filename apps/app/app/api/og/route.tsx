import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'community' | 'event' | 'ticket'
    const title = searchParams.get('title');
    const description = searchParams.get('description');
    const image = searchParams.get('image');
    const date = searchParams.get('date');
    const brandName = searchParams.get('brand');

    if (!type || !title) {
      return new Response('Missing required parameters', { status: 400 });
    }

    // Different layouts based on content type
    const layout = {
      community: (
        <div
          style={{
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            padding: '48px 64px',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {image && (
              // biome-ignore lint/nursery/noImgElement: <explanation>
              <img
                src={image}
                alt={title}
                width="96"
                height="96"
                style={{ borderRadius: '16px' }}
              />
            )}
            <div>
              <p style={{ fontSize: '24px', color: '#666' }}>{brandName}</p>
              <h1 style={{ fontSize: '48px', fontWeight: 'bold' }}>{title}</h1>
            </div>
          </div>
          {description && (
            <p style={{ fontSize: '32px', color: '#666' }}>{description}</p>
          )}
        </div>
      ),
      event: (
        <div
          style={{
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            padding: '48px',
            position: 'relative',
          }}
        >
          {image && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `url(${image})`,
                backgroundSize: 'cover',
                opacity: 0.1,
              }}
            />
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              zIndex: 1,
            }}
          >
            <div>
              <p style={{ fontSize: '24px', color: '#666' }}>{brandName}</p>
              <h1 style={{ fontSize: '64px', fontWeight: 'bold' }}>{title}</h1>
            </div>
            {description && (
              <p style={{ fontSize: '32px', color: '#666' }}>{description}</p>
            )}
            {date && (
              <p style={{ fontSize: '24px', color: '#666' }}>
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>
      ),
      ticket: (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            padding: '48px',
            backgroundImage:
              'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            color: 'white',
          }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            <div>
              <p style={{ fontSize: '24px', opacity: 0.8 }}>{brandName}</p>
              <h1 style={{ fontSize: '64px', fontWeight: 'bold' }}>{title}</h1>
            </div>
            {description && (
              <p style={{ fontSize: '32px', opacity: 0.9 }}>{description}</p>
            )}
            {date && (
              <p style={{ fontSize: '24px', opacity: 0.8 }}>
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>
      ),
    };

    return await new ImageResponse(layout[type as keyof typeof layout], {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error(e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
