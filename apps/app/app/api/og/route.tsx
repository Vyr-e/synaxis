import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';
import type { JSXElementConstructor, ReactElement } from 'react';

/**
 * Open Graph Image Generator
 *
 * Usage:
 * /api/og?type=community&title=My Community&description=Description&image=imageUrl&brand=BrandName
 * /api/og?type=event&title=My Event&description=Description&date=ISODate&hosts=John and Jane
 * /api/og?type=ticket&title=Event Name&description=Description&date=ISODate&seat=A1&ticketNumber=SYN-001
 *
 * Parameters:
 * - type: 'community' | 'event' | 'ticket' (default: 'community')
 * - title: string (default: 'Synaxis')
 * - description: string
 * - image: string (URL)
 * - brand: string
 * - date: ISO string
 * - hosts: string (for events)
 * - seat: string (for tickets)
 * - ticketNumber: string (for tickets)
 *
 * TODO: This is a preliminary implementation and is subject to change:
 * - Add more layout variations
 * - Improve responsive design
 * - Add theme support
 * - Add more customization options
 * - Add proper error handling for invalid images
 * - Add proper type validation
 * - Add proper date formatting options
 */

export const runtime = 'edge';

const defaultLayout = (): ReactElement<
  unknown,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  string | JSXElementConstructor<any>
> => {
  return (
    <div
      tw="flex flex-col w-full h-full"
      style={{
        background:
          'linear-gradient(to bottom right, rgb(24 24 27), rgb(0 0 0))',
        padding: '48px',
      }}
    >
      <div tw="flex items-center">
        <svg width="96" height="96" viewBox="0 0 32 32" fill="none">
          <title>Logo</title>
          <circle
            cx="16"
            cy="16"
            r="12"
            fill="#000000"
            stroke="#FFFFFF"
            strokeWidth="3"
          />
        </svg>
        <div tw="flex flex-col ml-8">
          <h1
            tw="text-6xl font-bold"
            style={{
              color: '#FFFFFF',
              fontWeight: 'bold',
              fontFamily: 'var(--font-clash-display)',
            }}
          >
            Synaxis
          </h1>
          <p tw="text-2xl mt-3" style={{ color: 'rgb(161 161 170)' }}>
            Create vibrant spaces where conversations flow naturally
          </p>
        </div>
      </div>

      <div tw="flex mt-auto">
        <div tw="flex items-center bg-white/5 px-4 py-2 rounded-full">
          <div
            tw="w-2 h-2 rounded-full"
            style={{ background: 'rgb(34 197 94)' }}
          />
          <span tw="text-sm ml-2" style={{ color: 'rgb(161 161 170)' }}>
            Join the community
          </span>
        </div>
      </div>
    </div>
  );
};

// Convert Tailwind sizes to pixels
const WIDTH_MAP = {
  '2xl': 672, // max-w-2xl -> 42rem -> 672px
  '7xl': 1280, // max-w-7xl -> 80rem -> 1280px
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO: need to look this up
export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const type = searchParams.get('type');

    // Default/Error layout

    // If no type specified or error, return default layout
    if (!type || !['community', 'event', 'ticket'].includes(type)) {
      return await new ImageResponse(defaultLayout(), {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    const title = searchParams.get('title') || 'Synaxis';
    const description =
      searchParams.get('description') ||
      'Create vibrant spaces where conversations flow naturally';
    const date = searchParams.get('date') || new Date().toISOString();
    const brandName = searchParams.get('brand') || 'Synaxis';
    const image = searchParams.get('image') || '';
    const hosts = searchParams.get('hosts') || '';
    const seat = searchParams.get('seat') || '';
    const ticketNumber = searchParams.get('ticketNumber') || '#SYN-2024-001';

    const layouts = {
      community: (
        <div
          tw="flex flex-col w-full max-w-7xl h-full p-12 "
          style={{
            background:
              'linear-gradient(to bottom right, rgb(24 24 27), rgb(0 0 0))',
          }}
        >
          {/* Header with Logo & Invite Info */}
          <div tw="flex items-center justify-between mb-8">
            <div tw="flex items-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <title>Logo</title>
                <circle
                  cx="14"
                  cy="14"
                  r="10"
                  fill="#000000"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                />
              </svg>
              <div tw="flex flex-col ml-4">
                <span
                  tw="text-lg text-zinc-400 font-bold text-left"
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontFamily: 'var(--font-clash-display)',
                  }}
                >
                  {brandName}
                </span>
                <span tw="text-sm text-zinc-500 mt-1 text-left">
                  Community Invitation
                </span>
              </div>
            </div>
            <div tw="flex items-center">
              <div tw="flex items-center bg-white/5 px-3 py-1 rounded-full">
                <div tw="w-2 h-2 rounded-full bg-emerald-500" />
                <span tw="text-sm text-zinc-400 ml-2">1.2k Members</span>
              </div>
              <div tw="flex items-center bg-white/5 px-3 py-1 rounded-full ml-2">
                <div tw="w-2 h-2 rounded-full bg-purple-500" />
                <span tw="text-sm text-zinc-400 ml-2">12 Online</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div tw="flex items-start">
            {/* Community Image */}
            <div tw="flex relative flex-shrink-0 w-32 h-32">
              {/* biome-ignore lint/nursery/noImgElement: <explanation> */}
              <img
                src={image || 'https://github.com/vercel.png'}
                alt="Community"
                width="128"
                height="128"
                tw="rounded-2xl border border-white/10"
              />
              <div tw="flex absolute -bottom-2 -right-2 bg-indigo-500 rounded-full px-2 py-1">
                <span tw="text-xs font-medium">Featured</span>
              </div>
            </div>

            {/* Community Info */}
            <div tw="flex flex-col ml-8">
              <div tw="flex flex-col">
                <span tw="text-sm text-indigo-400 tracking-wider uppercase text-left">
                  You're invited to join
                </span>
                <h1
                  tw="text-5xl font-bold mt-2 text-left"
                  style={{ color: '#FFFFFF', fontWeight: 'bold' }}
                >
                  {title}
                </h1>
              </div>
              <span tw="text-xl text-zinc-300 mt-4 text-left">
                {description}
              </span>

              {/* Tags */}
              <div tw="flex mt-4">
                <span tw="px-3 py-1 bg-white/5 rounded-full text-sm text-zinc-400">
                  Design
                </span>
                <span tw="px-3 py-1 bg-white/5 rounded-full text-sm text-zinc-400 ml-2">
                  Feedback
                </span>
                <span tw="px-3 py-1 bg-white/5 rounded-full text-sm text-zinc-400 ml-2">
                  Collaboration
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div tw="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
            <span tw="text-sm text-zinc-500">
              synaxis.to/c/{title.toLowerCase().replace(/ /g, '-')}
            </span>
            <div tw="flex items-center">
              <span tw="text-sm text-zinc-400">Invited by @sarah_designer</span>
              <div tw="flex items-center bg-indigo-500/20 px-3 py-1 rounded-full ml-2">
                <span tw="text-sm text-indigo-300">Premium Community</span>
              </div>
            </div>
          </div>
        </div>
      ),
      event: (
        <div
          tw="flex flex-col w-full max-w-7xl h-full p-12"
          style={{
            background:
              'linear-gradient(to bottom right, rgb(24 24 27), rgb(0 0 0))',
          }}
        >
          <div tw="flex items-center gap-8 p-8 border-b border-white/10">
            <div tw="flex items-center gap-2">
              <div tw="flex h-8 w-8 items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <title>Logo</title>
                  <circle
                    cx="14"
                    cy="14"
                    r="10"
                    fill="#000000"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                  />
                </svg>
              </div>
              <p
                tw="text-lg text-zinc-400 font-bold"
                style={{ color: '#FFFFFF', fontWeight: 'bold' }}
              >
                {brandName}
              </p>
            </div>
            <div tw="flex items-center gap-2">
              <div tw="w-px h-6 bg-white/20 ml-2 mr-2" />
              <span tw="text-sm text-zinc-500 font-semibold">
                Community Event
              </span>
            </div>
          </div>
          <div tw="flex flex-1 p-8">
            <div tw="flex flex-col w-full gap-8">
              <div tw="flex flex-col gap-3">
                <span tw="text-sm text-indigo-400 tracking-wider uppercase">
                  Featured Space
                </span>
                <h1 tw="text-4xl font-bold tracking-tight leading-tight">
                  {title}
                </h1>
                <p tw="text-xl text-zinc-400">{description}</p>
              </div>
              <div tw="flex items-center justify-between">
                <div tw="flex items-center gap-6">
                  <div tw="flex flex-col items-center gap-1">
                    <span tw="text-sm text-zinc-500">Date</span>
                    <p tw="text-zinc-300">
                      {new Date(date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div tw="w-2px mx-2 h-8 bg-white/10" />
                  <div tw="flex flex-col items-center gap-1">
                    <span tw="text-sm text-zinc-500">Time</span>
                    <p tw="text-zinc-300">
                      {new Date(date).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        timeZoneName: 'short',
                      })}
                    </p>
                  </div>
                  <div tw="w-2px mx-2 h-8 bg-white/10" />
                  <div tw="flex flex-col items-center gap-1">
                    <span tw="text-sm text-zinc-500">Duration</span>
                    <p tw="text-zinc-300">60 mins</p>
                  </div>
                </div>
                {hosts && (
                  <div tw="flex flex-col items-center gap-2 border-2 border-white/10 rounded-lg p-4">
                    <p tw="text-sm text-zinc-400">Hosted by</p>
                    <div tw="flex items-center gap-3">
                      <div tw="flex -space-x-2">
                        <div tw="w-10 h-10 rounded-full bg-zinc-800 border-2 border-black" />
                        <div tw="w-10 h-10 rounded-full bg-zinc-700 border-2 border-black" />
                      </div>
                      <p tw="text-zinc-300 font-medium">{hosts}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div tw="flex items-center justify-between p-2 border-t border-white/10">
            <p tw="text-sm text-zinc-500">
              synaxis.to/events/{title.toLowerCase().replace(/ /g, '-')}
            </p>
            <div tw="flex items-center gap-2">
              <div tw="w-2 h-2 rounded-full bg-emerald-500" />
              <p tw="text-sm text-zinc-500">Registration Open</p>
            </div>
          </div>
        </div>
      ),
      ticket: (
        <div
          tw="flex flex-col w-full max-w-2xl h-full p-12"
          style={{
            background:
              'linear-gradient(to bottom right, rgb(24 24 27), rgb(0 0 0))',
          }}
        >
          <div tw="flex items-center justify-between">
            <div tw="flex items-center gap-2">
              <div tw="flex h-8 w-8 items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <title>Logo</title>
                  <circle
                    cx="14"
                    cy="14"
                    r="10"
                    fill="#000000"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                  />
                </svg>
              </div>
              <p tw="text-lg text-zinc-400 font-bold">{brandName}</p>
            </div>
            <div tw="flex items-center gap-2">
              <span tw="text-sm text-zinc-500 font-mono">{ticketNumber}</span>
            </div>
          </div>
          <div tw="flex flex-col items-center justify-center flex-1 my-8">
            <div tw="flex flex-col items-center bg-white/5 rounded-xl p-8 border border-white/10 backdrop-blur-sm w-full max-w-2xl">
              <span tw="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium mb-6">
                Community Event
              </span>
              <h1 tw="text-4xl font-bold text-center mb-4">{title}</h1>
              <p tw="text-xl text-zinc-400 text-center mb-8">{description}</p>
              <div tw="flex items-center justify-center gap-8 border-t border-white/10 pt-8 w-full">
                <div tw="flex flex-col items-center">
                  <span tw="text-sm text-zinc-500 mb-1">Date</span>
                  <p tw="text-zinc-300 font-medium">
                    {new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div tw="w-2px h-8 bg-white/10 mx-2" />
                <div tw="flex flex-col items-center">
                  <span tw="text-sm text-zinc-500 mb-1">Time</span>
                  <p tw="text-zinc-300 font-medium">
                    {new Date(date).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      timeZoneName: 'short',
                    })}
                  </p>
                </div>
                {seat && (
                  <>
                    <div tw="w-2px h-8 mx-2 bg-white/10" />
                    <div tw="flex flex-col items-center">
                      <span tw="text-sm text-zinc-500 mb-1">Seat</span>
                      <p tw="text-zinc-300 font-medium">{seat}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div tw="flex items-center justify-between border-t border-white/10 pt-4">
            <p tw="text-sm text-zinc-500">
              synaxis.to/tickets/{title.toLowerCase().replace(/ /g, '-')}
            </p>
            <div tw="flex items-center gap-2">
              <div tw="w-2 h-2 rounded-full bg-emerald-500" />
              <p tw="text-sm text-zinc-500">Valid Entry</p>
            </div>
          </div>
        </div>
      ),
    };

    return new ImageResponse(
      layouts[type as keyof typeof layouts] || defaultLayout,
      {
        width: type === 'ticket' ? WIDTH_MAP['2xl'] : WIDTH_MAP['7xl'],
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }
    );
  } catch (e) {
    console.error(e);
    return new ImageResponse(defaultLayout(), {
      width: 1200,
      height: 630,
    });
  }
}
