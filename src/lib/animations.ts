import { Variants } from 'framer-motion'

// 頁面轉場動畫
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

// 淡入動畫
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

// 滑入動畫
export const slideIn: Variants = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 }
}

// 縮放動畫
export const scaleIn: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 }
}

// 交錯動畫
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const staggerItem: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 }
}

// 按鈕 hover 動畫
export const buttonHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
}

// 卡片 hover 動畫
export const cardHover = {
  whileHover: { 
    y: -5, 
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)" 
  }
}