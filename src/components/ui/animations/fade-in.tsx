'use client'

import { motion } from 'framer-motion'
import { fadeIn } from '@/lib/animations'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  className 
}: FadeInProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ delay, duration }}
      className={className}
    >
      {children}
    </motion.div>
  )
}