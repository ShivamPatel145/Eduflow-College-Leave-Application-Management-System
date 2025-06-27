// Shared Framer Motion animation variants for consistent motion across the app
export const pageFade = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 32 },
  transition: { duration: 0.5, ease: ['easeOut'] }
};

export const cardMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: ['easeOut'] }
};

export const buttonMotion = {
  whileHover: { scale: 1.04 },
  whileTap: { scale: 0.97 }
}; 