import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, FileCheck, GraduationCap, Users, Shield, Award, BookOpen, Star, Menu, Bell, User, LogOut, Github, Twitter, Linkedin, Moon, Sun } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { pageFade, cardMotion, buttonMotion } from "@/lib/motion";

// Professional SVG Illustrations
const HeroSVG = () => (
  <motion.svg 
    width="120" 
    height="120" 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'var(--primary)', stopOpacity: 0.1 }} />
        <stop offset="100%" style={{ stopColor: 'var(--primary)', stopOpacity: 0.05 }} />
      </linearGradient>
    </defs>
    <motion.path 
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      d="M60 10C87.5 10 110 32.5 110 60C110 87.5 87.5 110 60 110C32.5 110 10 87.5 10 60C10 32.5 32.5 10 60 10Z" 
      fill="url(#grad1)"
    />
    <motion.path 
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.7 }}
      d="M60 20C77.7 20 92 34.3 92 52C92 69.7 77.7 84 60 84C42.3 84 28 69.7 28 52C28 34.3 42.3 20 60 20Z" 
      stroke="var(--primary)" 
      strokeWidth="2" 
      fill="none"
    />
    <motion.path 
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.9 }}
      d="M60 30C67.9 30 74 36.1 74 44C74 51.9 67.9 58 60 58C52.1 58 46 51.9 46 44C46 36.1 52.1 30 60 30Z" 
      stroke="var(--primary)" 
      strokeWidth="2" 
      fill="none"
    />
    <motion.circle 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 1.2 }}
      cx="60" 
      cy="44" 
      r="6" 
      fill="var(--primary)" 
      fillOpacity="0.2"
    />
    <motion.path 
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: 1.4 }}
      d="M56 44L58 46L64 42" 
      stroke="var(--primary)" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </motion.svg>
);

const HeroIllustration = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="relative"
  >
    <motion.div 
      initial={{ rotate: 0 }}
      animate={{ rotate: 3 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl"
    />
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative rounded-3xl overflow-hidden shadow-2xl"
    >
      <img 
        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&h=800&q=90" 
        alt="Modern Education" 
        className="w-full h-full object-cover"
      />
    </motion.div>
  </motion.div>
);

// Professional Logo Component
// EduFlowLogo component moved to src/components/EduFlowLogo.tsx

// Enhanced Feature Card with more animations
const FeatureCard = ({ icon: Icon, title, description, image }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all group"
  >
    <motion.div 
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
    >
      <Icon className="h-6 w-6 text-primary" />
    </motion.div>
    <motion.h3 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="text-lg font-semibold mb-2"
    >
      {title}
    </motion.h3>
    <motion.p 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="text-sm text-muted-foreground mb-4"
    >
      {description}
    </motion.p>
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="relative h-40 rounded-lg overflow-hidden"
    >
      <motion.img 
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
        src={image} 
        alt={title}
        className="w-full h-full object-cover transition-transform"
      />
    </motion.div>
  </motion.div>
);

// Enhanced Process Step with more animations and better visuals
const ProcessStep = ({ number, title, description, image, icon: Icon }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="relative"
  >
    <div className="flex flex-col lg:flex-row items-center gap-8">
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="relative h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="absolute inset-0 rounded-2xl bg-primary/20 animate-pulse"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="relative z-10"
            >
              {Icon && <Icon className="h-8 w-8 text-primary" />}
            </motion.div>
          </motion.div>
          <div>
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-sm font-medium text-primary"
            >
              Step {number}
            </motion.span>
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl font-bold"
            >
              {title}
            </motion.h3>
          </div>
        </div>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground text-lg"
        >
          {description}
        </motion.p>
      </div>
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="relative w-full lg:w-[500px] h-[300px] rounded-2xl overflow-hidden shadow-xl"
      >
        <motion.img 
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
        />
      </motion.div>
    </div>
    {number < 3 && (
      <div className="hidden lg:block absolute left-8 top-24">
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "100%" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative w-0.5 h-24"
        >
          <div className="absolute inset-0 bg-primary/10 rounded-full" />
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute inset-0 bg-primary/30 rounded-full"
          />
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent rounded-full"
          />
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/40 to-transparent rounded-full"
          />
        </motion.div>
      </div>
    )}
  </motion.div>
);

const TestimonialCard = ({ name, role, content, image }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="group relative bg-background rounded-2xl border p-6 hover:shadow-lg transition-all duration-300"
  >
    <div className="flex gap-6">
      <div className="flex-shrink-0">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/10 rounded-xl blur-md" />
          <img 
            src={image} 
            alt={name}
            className="relative h-16 w-16 rounded-xl object-cover"
          />
        </motion.div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-lg font-semibold truncate">{name}</h4>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, delay: 0.1 * i }}
              >
                <Star className="h-4 w-4 fill-primary text-primary" />
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative"
        >
          <p className="text-muted-foreground text-sm leading-relaxed">{content}</p>
        </motion.div>
      </div>
    </div>
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/20"
    />
  </motion.div>
);

const BenefitCard = ({ icon: Icon, title, description }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl transform transition-transform group-hover:scale-105" />
    <div className="relative p-6 space-y-4">
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
      >
        <Icon className="h-6 w-6 text-primary" />
      </motion.div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  </motion.div>
);

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotification();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const headerBackground = useTransform(scrollYProgress, (scroll) => {
    if (isDark) {
      return scroll < 0.1
        ? 'rgba(24, 24, 27, 0)'
        : 'rgba(24, 24, 27, 0.8)';
    } else {
      return scroll < 0.1
        ? 'rgba(255, 255, 255, 0)'
        : 'rgba(255, 255, 255, 0.8)';
    }
  });
  const headerShadow = useTransform(
    scrollYProgress,
    [0, 0.1],
    ['none', '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)']
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'process', 'benefits', 'testimonials', 'cta'];
      const currentScrollPos = window.scrollY + 90;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          if (
            currentScrollPos >= element.offsetTop &&
            currentScrollPos < element.offsetTop + element.offsetHeight
          ) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
      if (currentScrollPos < document.getElementById('features')?.offsetTop || !document.getElementById('features')) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  const getDashboardURL = () => {
    if (!user) return "/login";
    return `/${user.role}-dashboard`;
  };

  const features = [
    {
      icon: GraduationCap,
      title: "Academic Excellence",
      description: "Streamlined processes for academic success and growth",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&h=600&q=90"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security for your academic data",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&h=600&q=90"
    },
    {
      icon: Award,
      title: "Quality Service",
      description: "Award-winning support and service excellence",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=600&q=90"
    },
    {
      icon: BookOpen,
      title: "Smart Learning",
      description: "Intelligent tools for enhanced academic experience",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&h=600&q=90"
    }
  ];

  const processSteps = [
    {
      number: 1,
      title: "Submit Your Application",
      description: "Begin your academic journey by submitting your application through our intuitive platform. Our smart validation system ensures all required information is complete and accurate.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&h=600&q=90",
      icon: FileCheck
    },
    {
      number: 2,
      title: "Track Your Progress",
      description: "Stay informed with real-time updates on your application status. Our comprehensive tracking system keeps you updated at every stage of the process.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&h=600&q=90",
      icon: Clock
    },
    {
      number: 3,
      title: "Receive Instant Updates",
      description: "Get immediate notifications for important updates, approvals, and next steps. Stay connected and informed throughout your academic journey.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&h=600&q=90",
      icon: Bell
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content: "EduFlow has revolutionized how I manage my academic commitments. The platform's intuitive interface and real-time updates have made my student life so much more organized and stress-free.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=90"
    },
    {
      name: "Prof. Michael Chen",
      role: "Department Head, Engineering",
      content: "The streamlined workflow has significantly improved our department's efficiency. The automated processes and comprehensive analytics have transformed how we manage academic operations.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=90"
    },
    {
      name: "Dr. Amanda Lee",
      role: "Academic Administrator",
      content: "EduFlow's comprehensive features have made academic management effortless. The platform's ability to handle complex workflows while maintaining data security is truly impressive.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=90"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Enterprise-grade security measures protect your academic data and ensure privacy compliance."
    },
    {
      icon: Clock,
      title: "Time Efficiency",
      description: "Automated workflows and streamlined processes save valuable time for students and faculty."
    },
    {
      icon: Users,
      title: "Better Collaboration",
      description: "Seamless communication and collaboration tools connect students, faculty, and administrators."
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Built-in validation and quality checks ensure accuracy in all academic processes."
    },
    {
      icon: FileCheck,
      title: "Paperless Workflow",
      description: "Digital-first approach reduces paperwork and environmental impact while improving efficiency."
    },
    {
      icon: Star,
      title: "User Experience",
      description: "Intuitive interface and responsive design make academic management effortless and enjoyable."
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX }}
      />
      <motion.header 
        className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60"
        style={{ backgroundColor: headerBackground, boxShadow: headerShadow }}
      >
        <div className="container flex h-16 items-center justify-between">
          <Link to="/">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">EduFlow</span>
            </div>
          </Link>
          <nav className="hidden md:flex flex-grow justify-center items-center gap-6">
            {[
              { label: "Features", href: "#features" },
              { label: "Process", href: "#process" },
              { label: "Benefits", href: "#benefits" },
              { label: "Testimonials", href: "#testimonials" }
            ].map((item) => (
              <motion.button
                key={item.label}
                onClick={() => scrollToSection(item.href.replace('#', ''))}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, color: "var(--primary)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`relative text-sm font-medium transition-colors group ${activeSection === item.href.replace('#', '') ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
              >
                {item.label}
                <motion.span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-primary ${activeSection === item.href.replace('#', '') ? 'w-full' : 'w-0'}`}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <motion.button
              type="button"
              aria-label="Toggle theme"
              className="rounded-full p-2 hover:bg-primary/10 transition-colors"
              onClick={() => setIsDark((d) => !d)}
              animate={{ rotate: isDark ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              {...buttonMotion}
            >
              {isDark ? <Sun className="h-5 w-5 text-primary" /> : <Moon className="h-5 w-5 text-primary" />}
            </motion.button>
            {isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(var(--primary-rgb), 0.05)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/notifications')}
                  className="relative p-2 rounded-full text-muted-foreground hover:text-primary transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <motion.span
                      className="absolute top-1 right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </motion.button>
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(var(--primary-rgb), 0.05)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </motion.button>
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        ref={profileRef}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 rounded-lg border bg-background shadow-lg overflow-hidden z-50"
                      >
                        <div className="p-2">
                          <button
                            onClick={() => {
                              navigate('/profile');
                              setIsProfileOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                          >
                            Profile Settings
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Link to={getDashboardURL()}>
                  <Button className="bg-primary hover:bg-primary/90">
                    Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-black focus:text-black dark:hover:text-black dark:focus:text-black"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-primary hover:bg-primary/90">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            )}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(var(--primary-rgb), 0.05)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-muted-foreground hover:text-primary transition-colors"
            >
              <Menu className="h-6 w-6" />
            </motion.button>
          </div>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t"
            >
              <div className="container py-4 space-y-4">
                {[ 
                  { label: "Features", href: "#features" },
                  { label: "Process", href: "#process" },
                  { label: "Benefits", href: "#benefits" },
                  { label: "Testimonials", href: "#testimonials" }
                ].map((item) => (
                  <motion.button
                    key={item.label}
                    onClick={() => {
                      scrollToSection(item.href.replace('#', ''));
                      setIsMobileMenuOpen(false);
                    }}
                    whileHover={{ x: 5, color: "var(--primary)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left px-4 py-2 text-base font-medium text-muted-foreground hover:bg-primary/5 rounded-md transition-all"
                  >
                    {item.label}
                  </motion.button>
                ))}
                <div className="flex justify-end pb-2">
                  <motion.button
                    type="button"
                    aria-label="Toggle theme"
                    className="rounded-full p-2 hover:bg-primary/10 transition-colors"
                    onClick={() => setIsDark((d) => !d)}
                    animate={{ rotate: isDark ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    {...buttonMotion}
                  >
                    {isDark ? <Sun className="h-5 w-5 text-primary" /> : <Moon className="h-5 w-5 text-primary" />}
                  </motion.button>
                </div>
                {isAuthenticated ? (
                  <div className="pt-2 border-t mt-2 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-base font-medium text-muted-foreground hover:bg-primary/5 rounded-md transition-all"
                    >
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-base font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2 transition-all"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t mt-2 flex flex-col gap-2">
                    <Link to="/login">
                      <Button
                        variant="ghost"
                        className="text-muted-foreground hover:text-black focus:text-black dark:hover:text-black dark:focus:text-black"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button className="w-full justify-start bg-primary hover:bg-primary/90">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" 
          />
          <div className="container relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Now Live
                  </motion.div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                EduFlow
                    </span>
                    <br />
                    <span className="text-foreground">Academic Excellence</span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-xl text-muted-foreground"
                  >
                    Transforming Academic Management with Digital Innovation
                  </motion.p>
            </div>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-muted-foreground max-w-[600px]"
                >
                  Streamline your academic processes with our comprehensive platform. From leave applications to department management, we've got you covered.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
              {isAuthenticated ? (
                <Link to={getDashboardURL()}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                    <>
                      <Link to="/register">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                      <Link to="/login">
                    <Button size="lg" variant="outline">
                          Learn More
                    </Button>
                  </Link>
                    </>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-center gap-8 pt-4"
                >
                  <div className="flex -space-x-2">
                    {[
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
                      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80"
                    ].map((src, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                        className="relative"
                      >
                        <img
                          src={src}
                          alt={`User ${i + 1}`}
                          className="h-10 w-10 rounded-full border-2 border-background object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">1,000+</span> active users
                </div>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative lg:sticky lg:top-24"
              >
                <HeroIllustration />
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Process Section */}
        <section id="process" className="py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-16">
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-primary font-medium"
                >
                  How It Works
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl font-bold tracking-tight mt-2 mb-4"
                >
                  Streamlined Academic Process
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-muted-foreground text-lg max-w-2xl mx-auto"
                >
                  Experience a seamless academic journey with our intuitive platform designed for efficiency and clarity.
                </motion.p>
              </div>
              <div className="space-y-24">
                {processSteps.map((step, index) => (
                  <ProcessStep key={index} {...step} />
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-16 text-center"
              >
                <Link to="/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container py-12">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-8">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
            <div className="relative">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: "10K+", label: "Active Users" },
                  { value: "50K+", label: "Applications Processed" },
                  { value: "24/7", label: "Support Available" },
                  { value: "99%", label: "Satisfaction Rate" }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
            </div>
            </div>
            </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-24 bg-gradient-to-b from-muted/20 to-background">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-16">
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-primary font-medium"
                >
                  Why Choose Us
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl font-bold tracking-tight mt-2 mb-4"
                >
                  Benefits of Using EduFlow
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-muted-foreground text-lg max-w-2xl mx-auto"
                >
                  Experience a modern approach to academic management with our comprehensive platform
                </motion.p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                  <BenefitCard key={index} {...benefit} />
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-16 text-center"
              >
                <Link to="/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Experience the Benefits
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-primary font-medium"
                >
                  User Stories
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-bold tracking-tight mt-2 mb-4"
                >
                  Real Experiences, Real Results
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-muted-foreground text-lg max-w-2xl mx-auto"
                >
                  Hear from our community about their journey with EduFlow
                </motion.p>
              </div>
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard key={index} {...testimonial} />
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-12 text-center"
              >
                <Link to="/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 bg-gradient-to-b from-background to-muted/20">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="container max-w-4xl mx-auto text-center"
          >
            <div className="flex flex-col items-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative"
              >
                <div className="relative h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
              </motion.div>
              <div className="space-y-2 max-w-2xl">
                <motion.h2 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
                >
                  Transform Your Academic Journey
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground text-lg"
                >
                  Experience the future of academic management
                </motion.p>
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {!isAuthenticated ? (
                  <>
                    <Link to="/register">
                      <Button size="lg" className="bg-primary hover:bg-primary/90 min-w-[160px]">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button size="lg" variant="outline" className="min-w-[160px]">
                        Sign In
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link to={getDashboardURL()}>
                    <Button size="lg" className="bg-primary hover:bg-primary/90 min-w-[160px]">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-6 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Free Trial</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Secure Platform</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>1,000+ Users</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="w-full border-t bg-muted/5">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  EduFlow
                </span>
              </Link>
          <p className="text-sm text-muted-foreground">
                Transforming academic management with digital innovation and streamlined workflows.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://twitter.com/your-username" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com/company/your-company" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
            © 2024 EduFlow. All rights reserved.
          </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/cookie-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/security" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;