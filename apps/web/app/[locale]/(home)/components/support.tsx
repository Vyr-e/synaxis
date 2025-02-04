'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { clashDisplay, lora } from '@repo/design-system/fonts';

const supportOptions = [
  {
    title: 'Chat Support',
    description: 'Get instant help from our support team',
    action: 'Start Chat',
    href: '#chat',
  },
  {
    title: 'Email Support',
    description: "Send us an email, we'll respond within 24 hours",
    action: 'Send Email',
    href: 'mailto:support@synaxis.com',
  },
  {
    title: 'Phone Support',
    description: 'Schedule a call with our support team',
    action: 'Schedule Call',
    href: '#schedule',
  },
];

export function Support() {
  return (
    <section
      id="support"
      className="mt-1.5 rounded-lg bg-white py-12 shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.05)]"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className={`font-bold text-2xl md:text-3xl ${clashDisplay.className}`}
          >
            Need Help?
          </h2>
          <p
            className={`mt-2 text-gray-600 text-sm md:text-base ${lora.className}`}
          >
            Our support team is here to help you with any questions
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {supportOptions.map((option) => (
            <div
              key={option.title}
              className="group relative overflow-hidden rounded-2xl bg-gray-50 p-6 transition-colors hover:bg-gray-100"
            >
              <h3
                className={`mb-2 font-bold text-lg ${clashDisplay.className}`}
              >
                {option.title}
              </h3>

              <p className={`mb-4 text-gray-600 text-sm ${lora.className}`}>
                {option.description}
              </p>

              <Button
                asChild
                variant="ghost"
                className="w-full justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-900 text-sm shadow-sm transition-colors hover:bg-gray-50"
              >
                <a href={option.href}>{option.action}</a>
              </Button>
            </div>
          ))}
        </div>

        {/* <div className="mt-12 text-center">
          <p className={`text-gray-600 text-sm ${lora.className}`}>
            Can't find what you're looking for?{' '}
            <a href="#faq" className="text-purple-600 hover:text-purple-700">
              Check our FAQ
            </a>
          </p>
        </div> */}
      </div>
    </section>
  );
}
