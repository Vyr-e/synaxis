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
          <h2 key={index} className="text-2xl font-semibold text-gray-900 mb-4 mt-10 first:mt-0">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="text-lg font-medium text-gray-900 mb-3 mt-8">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('- ')) {
        if (!isInList) {
          isInList = true;
        }
        listItems.push(
          <li key={index} className="text-gray-700 leading-relaxed">
            {line.replace('- ', '')}
          </li>
        );
      } else if (line.trim()) {
        flushList();
        elements.push(
          <p key={index} className="text-gray-700 mb-4 leading-relaxed">
            {line}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AnimatedIcon className="w-8 h-8" />
              <span className={cn('font-semibold text-xl text-gray-900', clashDisplay.className)}>
                Synaxis
              </span>
            </div>

            <motion.button
              type="button"
              aria-label="Go back"
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        <motion.article
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Document Header */}
          <header className="px-8 py-6 border-b border-gray-100">
            <h1 className={cn('text-3xl font-bold text-gray-900 mb-2', clashDisplay.className)}>
              {title}
            </h1>
            <p className="text-sm text-gray-500">
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
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Synaxis. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}