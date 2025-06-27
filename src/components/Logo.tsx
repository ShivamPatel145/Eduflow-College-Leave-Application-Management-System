import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";

const Logo = ({ className = "" }: { className?: string }) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Only animate once when component first mounts
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 1000); // Stop animations after 1 second

    return () => clearTimeout(timer);
  }, []);

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative inline-flex items-center">
        <div className="relative">
          {/* Background glow - only animate initially */}
          <motion.div
            animate={hasAnimated ? {} : {
              rotate: [0, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={hasAnimated ? {} : {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-xl"
          />
          <GraduationCap className="h-6 w-6 text-primary relative z-10" />
        </div>
        <div className="ml-2">
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            EduFlow
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Logo; 