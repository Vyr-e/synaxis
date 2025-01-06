'use client'

import { motion } from 'framer-motion'
import { useMenuStore } from '@/store/menu-store'

export default function Button() {
  const { isOpen, toggle } = useMenuStore()

  return (
    <motion.div 
      className="absolute top-0 right-0 w-[100px] h-[40px] cursor-pointer rounded-[25px] 
      overflow-hidden border border-gray-300 bg-white flex items-center justify-center select-none"
      transition={{ duration: 0.5 }}
      onClick={toggle}
    >
      <motion.span 
        className="absolute uppercase text-sm font-medium pointer-events-none"
        animate={{ 
          y: isOpen ? -20 : 0,
          opacity: isOpen ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        Menu
      </motion.span>
      <motion.span 
        className="absolute uppercase text-sm font-medium pointer-events-none"
        animate={{ 
          y: isOpen ? 0 : 20,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        Close
      </motion.span>
    </motion.div>
  )
} 