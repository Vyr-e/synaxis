'use client';

import { AnimatedIcon } from '@/components/animated-logo';
import { cn } from '@repo/design-system';
import { clashDisplay } from '@repo/design-system/fonts';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface LegalPageViewProps {
  title: string;
  lastUpdated: string;
  content: string;
}

export function LegalPageView({ title, lastUpdated, content }: LegalPageViewProps) {
  const parseContent = (text: string) => {
    const lines = text.trim().split('\n');
    const elements: React.ReactElement[] = [];
    let isInList = false;
    let listItems: React.ReactElement[] = [];

    const flushList = () => {
      if (isInList && listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc pl-6 mb-6 space-y-2">
            {listItems}
          </ul>
        );
        listItems = [];
        isInList = false;
      }
    };

    lines.forEach((line, index) => {
      if (line.trim() === '') return;

      if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-2xl font-semibold text-white mb-4 mt-10 first:mt-0">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="text-lg font-medium text-white/90 mb-3 mt-8">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('- ')) {
        if (!isInList) {
          isInList = true;
        }
        listItems.push(
          <li key={index} className="text-white/80 leading-relaxed">
            {line.replace('- ', '')}
          </li>
        );
      } else if (line.trim()) {
        flushList();
        elements.push(
          <p key={index} className="text-white/80 mb-4 leading-relaxed">
            {line}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black/70 border-b border-white/10 sticky top-0 z-10 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-xl bg-white/5" />
                <AnimatedIcon className="relative w-8 h-8" />
              </div>
              <span className={cn('font-semibold text-xl text-white drop-shadow-2xl', clashDisplay.className)}>
                Synaxis
              </span>
            </div>

            <motion.button
              type="button"
              aria-label="Go back"
              onClick={() => window.history.back()}
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 transition-all duration-300 hover:bg-white/10">
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium text-white/60 text-sm">
                  Back
                </span>
              </div>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        <motion.article
          className="bg-black/70 rounded-lg border border-white/10 overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Document Header */}
          <header className="px-8 py-6 border-b border-white/10">
            <h1 className={cn('text-3xl font-bold text-white mb-2', clashDisplay.className)}>
              {title}
            </h1>
            <p className="text-sm text-white/60">
              Last updated: {lastUpdated}
            </p>
          </header>

          {/* Document Content */}
          <div className="px-8 py-6">
            <div className="prose prose-gray max-w-none">
              {parseContent(content)}
            </div>
          </div>
        </motion.article>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-white/60">
          <p>© 2025 Synaxis. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}