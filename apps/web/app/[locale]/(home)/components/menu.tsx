'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Button from './button'
import Nav from './nav'
import { useMenuStore } from '@/store/menu-store'
import { useEffect, useRef } from 'react'

const menuVariants = {
  open: {
    width: "100vw",
    height: "100vh",
    top: "-12px",
    right: "-12px",
    transition: { duration: 0.75, type: "tween", ease: [0.76, 0, 0.24, 1]}
  },
  closed: {
    width: "100px",
    height: "40px",
    top: "0px",
    right: "0px",
    transition: { duration: 0.75, delay: 0.35, type: "tween", ease: [0.76, 0, 0.24, 1]}
  }
}

const menuVariantsMd = {
  open: {
    width: "480px",
    height: "650px",
    top: "-25px",
    right: "-25px",
    transition: { duration: 0.75, type: "tween", ease: [0.76, 0, 0.24, 1]}
  },
  closed: {
    width: "100px",
    height: "40px",
    top: "0px",
    right: "0px",
    transition: { duration: 0.75, delay: 0.35, type: "tween", ease: [0.76, 0, 0.24, 1]}
  }
}

export default function Menu() {
  const { isOpen, toggle, close } = useMenuStore()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        close()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, close])

  return (
    <>
      {/* Gray Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-gray-500/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      <div 
        className="fixed right-4 top-8 z-50 md:right-8"
        ref={menuRef}
        suppressHydrationWarning
      >
        <motion.div 
          className="bg-white rounded-[25px] relative hidden md:block"
          variants={menuVariantsMd}
          animate={isOpen ? "open" : "closed"}
          initial="closed"
        >
          <AnimatePresence>
            {isOpen && <Nav />}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          className="bg-white rounded-[25px] relative md:hidden"
          variants={menuVariants}
          animate={isOpen ? "open" : "closed"}
          initial="closed"
        >
          <AnimatePresence>
            {isOpen && <Nav />}
          </AnimatePresence>
        </motion.div>
        <Button />
      </div>
    </>
  )
} 