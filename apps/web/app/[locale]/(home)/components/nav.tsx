'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select"
import { languages } from "@/config/languages"
import { useRouter, usePathname } from "@/i18n/routing"
import ReactCountryFlag from "react-country-flag"

const links = [
  { title: "Features", href: "#features" },
  { title: "How it works", href: "#how-it-works" },
  { title: "Pricing", href: "#pricing" },
  { title: "Community", href: "#community" },
  { title: "Support", href: "#support" },
  { title: "Blog", href: "#blog" }
]

const socialLinks = [
  { title: "Github", href: "https://github.com/vyr-e/synaxis" }
]

const slideIn = {
  initial: { opacity: 0, y: -20 },
  enter: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.5,
      delay: 0.1 * i,
      ease: [0.215, 0.61, 0.355, 1]
    }
  }),
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: "easeInOut" }
  }
}

export default function Nav() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleLanguageChange = (locale: string) => {
    router.replace(pathname, { locale })
  }

  return (
    <div className="flex flex-col justify-between h-full p-10 pt-24 w-full md:w-[480px]">
      <div className="flex flex-col gap-6">
        {links.map((link, i) => (
          <motion.a
            key={i}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className={`text-4xl font-medium transition-all duration-300 ${
              hoveredIndex !== null && hoveredIndex !== i ? 'blur-sm opacity-50' : ''
            }`}
            variants={slideIn}
            initial="initial"
            animate="enter"
            exit="exit"
            custom={i}
            onHoverStart={() => setHoveredIndex(i)}
            onHoverEnd={() => setHoveredIndex(null)}
          >
            {link.title}
          </motion.a>
        ))}
      </div>
      <motion.div 
        className="flex flex-wrap items-baseline gap-4 mb-20 md:mb-4 justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div>
          {socialLinks.map((link, i) => (
            <motion.a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-md opacity-60 hover:opacity-100 transition-opacity"
              variants={slideIn}
              initial="initial"
              animate="enter"
              exit="exit"
              custom={i}
            >
              {link.title}
            </motion.a>
          ))}
        </div>
        <div>
          <div className="relative rounded-lg border border-input bg-background shadow-sm shadow-black/5 transition-shadow focus-within:border-ring focus-within:outline-none focus-within:ring-[3px] focus-within:ring-ring/20 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 [&:has(input:is(:disabled))_*]:pointer-events-none">
            <label htmlFor="language-select" className="block px-3 pt-2 text-xs font-medium text-foreground">
              Languages
            </label>
            <Select onValueChange={handleLanguageChange}>
              <SelectTrigger
                id="language-select"
                className="border-none bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 h-8"
              >
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(languages).map(([locale, { name, flag }]) => (
                  <SelectItem 
                    key={locale} 
                    value={locale}
                    className="flex items-center gap-3"
                  >
                    <ReactCountryFlag 
                      countryCode={flag} 
                      svg 
                      className="w-4 h-4"
                    />
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 

