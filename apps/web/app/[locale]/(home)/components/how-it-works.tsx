'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { clashDisplay, lora } from "@repo/design-system/fonts"
import { useTranslations } from 'next-intl'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design-system/components/ui/accordion"

export function HowItWorks() {
  const t = useTranslations()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const steps = [
    {
      id: 1,
      title: t('howItWorks.steps.discover.title'),
      description: t('howItWorks.steps.discover.description'),
      color: "from-blue-500/20 to-blue-600/20",
      features: [
        {
          title: t('howItWorks.steps.discover.features.discovery.title'),
          content: t('howItWorks.steps.discover.features.discovery.content'),
        },
        {
          title: t('howItWorks.steps.discover.features.types.title'),
          content: t('howItWorks.steps.discover.features.types.content'),
        },
        {
          title: t('howItWorks.steps.discover.features.formats.title'),
          content: t('howItWorks.steps.discover.features.formats.content'),
        },
        {
          title: t('howItWorks.steps.discover.features.profile.title'),
          content: t('howItWorks.steps.discover.features.profile.content'),
        }
      ]
    },
    {
      id: 2,
      title: t('howItWorks.steps.engage.title'),
      description: t('howItWorks.steps.engage.description'),
      color: "from-purple-500/20 to-purple-600/20",
      features: [
        {
          title: t('howItWorks.steps.engage.features.audio.title'),
          content: t('howItWorks.steps.engage.features.audio.content'),
        },
        {
          title: t('howItWorks.steps.engage.features.interactive.title'),
          content: t('howItWorks.steps.engage.features.interactive.content'),
        },
        {
          title: t('howItWorks.steps.engage.features.management.title'),
          content: t('howItWorks.steps.engage.features.management.content'),
        },
        {
          title: t('howItWorks.steps.engage.features.engagement.title'),
          content: t('howItWorks.steps.engage.features.engagement.content'),
        }
      ]
    },
    {
      id: 3,
      title: t('howItWorks.steps.manage.title'),
      description: t('howItWorks.steps.manage.description'),
      color: "from-emerald-500/20 to-emerald-600/20",
      features: [
        {
          title: t('howItWorks.steps.manage.features.ticketing.title'),
          content: t('howItWorks.steps.manage.features.ticketing.content'),
        },
        {
          title: t('howItWorks.steps.manage.features.promotional.title'),
          content: t('howItWorks.steps.manage.features.promotional.content'),
        },
        {
          title: t('howItWorks.steps.manage.features.guest.title'),
          content: t('howItWorks.steps.manage.features.guest.content'),
        },
        {
          title: t('howItWorks.steps.manage.features.analytics.title'),
          content: t('howItWorks.steps.manage.features.analytics.content'),
        }
      ]
    }
  ]

  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="container px-4 mx-auto">
        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 ${clashDisplay.className}`}>
          {t('howItWorks.title')}
        </h2>
        <p className={`text-lg md:text-xl text-center text-gray-600 max-w-3xl mx-auto mb-16 ${lora.className}`}>
          {t('howItWorks.subtitle')}
        </p>
        {/* ... rest of your JSX ... */}
      </div>
    </section>
  )
} 