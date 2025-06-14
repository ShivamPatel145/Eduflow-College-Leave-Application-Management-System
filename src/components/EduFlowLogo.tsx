import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const EduFlowLogo = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="relative inline-flex items-center"
  >
    <motion.div
      initial={{ rotate: -10, scale: 0.8 }}
      animate={{ rotate: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative"
    >
      <motion.div
        animate={{
          rotate: [0, 5, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-xl"
      />
      <GraduationCap className="h-8 w-8 text-primary relative z-10" />
    </motion.div>
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="ml-2"
    >
      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
        EduFlow
      </span>
    </motion.div>
  </motion.div>
);

export default EduFlowLogo; 