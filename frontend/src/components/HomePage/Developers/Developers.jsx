import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code, 
  Brain, 
  Database,
  Zap,
  Shield,
  Users,
  Star,
  Award,
  Moon,
  Sun
} from 'lucide-react';

// Theme Context
const ThemeContext = createContext();

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // Default to dark theme

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={`fixed top-4 right-4 z-50 p-3 rounded-full transition-all duration-300 shadow-lg ${
        isDark 
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 border border-gray-700' 
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

// Counter Animation Hook
const useCountAnimation = (targetValue, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const startAnimation = () => {
    if (hasStarted) return;
    setHasStarted(true);
    
    const startTime = Date.now();
    const startValue = 0;
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutCubic);
      
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  return [count, startAnimation, hasStarted];
};

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = "", className = "" }) => {
  const numericValue = parseInt(value.toString().replace(/[^\d.]/g, ''));
  const [count, startAnimation, hasStarted] = useCountAnimation(numericValue, 1500);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          startAnimation();
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`counter-${value}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [startAnimation, hasStarted, value]);

  return (
    <div id={`counter-${value}`} className={className}>
      {count}{suffix}
    </div>
  );
};

const DevelopersSection = () => {
  const { isDark } = useTheme();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animatedCards, setAnimatedCards] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = entry.target.getAttribute('data-card-index');
            if (cardIndex) {
              setTimeout(() => {
                setAnimatedCards(prev => new Set([...prev, parseInt(cardIndex)]));
              }, parseInt(cardIndex) * 150);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    const cards = document.querySelectorAll('[data-card-index]');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const developers = [
    {
      id: 1,
      name: "Godwin Wilfred",
      title: "Lead AI Engineer",
      subtitle: "Project Architect",
      specialization: "Machine Learning & System Architecture",
      image: "/api/placeholder/80/80",
      email: "godwin.wilfred@revenueguard.ai",
      bio: "AI specialist with expertise in revenue leakage detection algorithms and scalable ML systems.",
      skills: ["Machine Learning", "Python", "TensorFlow", "System Design", "Data Engineering", "PyTorch"],
      experience: "5+ years",
      projects: "12+",
      icon: Brain,
      gradient: isDark ? "from-purple-400 to-indigo-500" : "from-purple-500 to-indigo-600",
      primaryColor: isDark ? "#A855F7" : "#8B5CF6",
      hoverColor: isDark ? "rgba(168, 85, 247, 0.1)" : "rgba(139, 92, 246, 0.1)",
      socialLinks: [
        { type: 'github', url: 'https://github.com/godwin-wilfred', icon: Github },
        { type: 'linkedin', url: 'https://linkedin.com/in/godwin-wilfred', icon: Linkedin },
        { type: 'email', url: 'mailto:godwin.wilfred@revenueguard.ai', icon: Mail }
      ]
    },
    {
      id: 2,
      name: "Pooja Shree",
      title: "Frontend Lead",
      subtitle: "UI/UX Architect", 
      specialization: "User Interface & Experience Design",
      image: "/api/placeholder/80/80",
      email: "pooja.shree@revenueguard.ai",
      bio: "Creative frontend engineer specializing in intuitive data visualization interfaces for complex systems.",
      skills: ["React", "TypeScript", "UI/UX Design", "Data Visualization", "Tailwind CSS", "Figma"],
      experience: "4+ years",
      projects: "15+",
      icon: Code,
      gradient: isDark ? "from-pink-400 to-rose-500" : "from-pink-500 to-rose-600",
      primaryColor: isDark ? "#EC4899" : "#EC4899",
      hoverColor: "rgba(236, 72, 153, 0.1)",
      socialLinks: [
        { type: 'github', url: 'https://github.com/pooja-shree', icon: Github },
        { type: 'linkedin', url: 'https://linkedin.com/in/pooja-shree', icon: Linkedin },
        { type: 'email', url: 'mailto:pooja.shree@revenueguard.ai', icon: Mail }
      ]
    },
    {
      id: 3,
      name: "Ragul K B",
      title: "Backend Engineer",
      subtitle: "Data Specialist",
      specialization: "Distributed Systems & Data Processing",
      image: "/api/placeholder/80/80", 
      email: "ragul.kb@revenueguard.ai",
      bio: "Backend architect focused on high-performance data processing and real-time analytics systems.",
      skills: ["Node.js", "Python", "PostgreSQL", "Redis", "Microservices", "Docker", "AWS"],
      experience: "4+ years",
      projects: "10+",
      icon: Database,
      gradient: isDark ? "from-emerald-400 to-teal-500" : "from-emerald-500 to-teal-600",
      primaryColor: "#10B981",
      hoverColor: "rgba(16, 185, 129, 0.1)",
      socialLinks: [
        { type: 'github', url: 'https://github.com/ragul-kb', icon: Github },
        { type: 'linkedin', url: 'https://linkedin.com/in/ragul-kb', icon: Linkedin },
        { type: 'email', url: 'mailto:ragul.kb@revenueguard.ai', icon: Mail }
      ]
    },
    {
      id: 4,
      name: "Ashwin",
      title: "DevOps Engineer",
      subtitle: "Security Specialist",
      specialization: "Cloud Infrastructure & Security",
      image: "/api/placeholder/80/80",
      email: "ashwin@revenueguard.ai", 
      bio: "DevOps expert ensuring scalable, secure, and reliable infrastructure for AI-powered systems with advanced monitoring.",
      skills: ["AWS", "Kubernetes", "Terraform", "CI/CD", "Security", "Monitoring", "Docker"],
      experience: "3+ years",
      projects: "8+",
      icon: Shield,
      gradient: isDark ? "from-orange-400 to-red-500" : "from-orange-500 to-red-600",
      primaryColor: "#F97316",
      hoverColor: "rgba(249, 115, 22, 0.1)",
      socialLinks: [
        { type: 'github', url: 'https://github.com/ashwin-devops', icon: Github },
        { type: 'linkedin', url: 'https://linkedin.com/in/ashwin-devops', icon: Linkedin },
        { type: 'email', url: 'mailto:ashwin@revenueguard.ai', icon: Mail }
      ]
    },
    {
      id: 5,
      name: "Udaya Krishnan",
      title: "Full-Stack Developer",
      subtitle: "Integration Expert",
      specialization: "API Development & System Integration",
      image: "/api/placeholder/80/80",
      email: "udaya.krishnan@revenueguard.ai",
      bio: "Versatile developer bridging frontend and backend systems with robust API integrations.",
      skills: ["Full-Stack", "REST APIs", "GraphQL", "React", "Node.js", "MongoDB", "TypeScript"],
      experience: "3+ years", 
      projects: "12+",
      icon: Zap,
      gradient: isDark ? "from-cyan-400 to-blue-500" : "from-blue-500 to-cyan-600",
      primaryColor: isDark ? "#06B6D4" : "#3B82F6",
      hoverColor: isDark ? "rgba(6, 182, 212, 0.1)" : "rgba(59, 130, 246, 0.1)",
      socialLinks: [
        { type: 'github', url: 'https://github.com/udaya-krishnan', icon: Github },
        { type: 'linkedin', url: 'https://linkedin.com/in/udaya-krishnan', icon: Linkedin },
        { type: 'email', url: 'mailto:udaya.krishnan@revenueguard.ai', icon: Mail }
      ]
    }
  ];

  const handleConnect = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const themeClasses = {
    // Main backgrounds
    mainBg: isDark 
      ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800' 
      : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50',
    
    // Background patterns
    bgPattern: isDark 
      ? 'bg-gradient-to-br from-gray-800/20 via-blue-900/10 to-purple-900/20 opacity-50'
      : 'bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-20',
    
    // Text colors
    primaryText: isDark ? 'text-white' : 'text-gray-900',
    secondaryText: isDark ? 'text-gray-300' : 'text-gray-600',
    mutedText: isDark ? 'text-gray-400' : 'text-gray-500',
    
    // Badge colors
    badgeBg: isDark ? 'bg-gray-800/60 text-cyan-400 border-gray-700' : 'bg-blue-100 text-blue-700',
    
    // Gradient text
    gradientText: isDark 
      ? 'bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'
      : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent',
    
    // Stats cards
    statsCardBg: isDark ? 'bg-gray-800/40 backdrop-blur-sm border-gray-700' : 'bg-white/60 backdrop-blur-sm border-white/20',
    
    // Stats gradient colors
    statsGradient1: isDark ? 'from-cyan-400 to-blue-400' : 'from-blue-600 to-indigo-600',
    statsGradient2: isDark ? 'from-purple-400 to-pink-400' : 'from-purple-600 to-pink-600',
    statsGradient3: isDark ? 'from-emerald-400 to-teal-400' : 'from-emerald-600 to-teal-600',
    statsGradient4: isDark ? 'from-orange-400 to-red-400' : 'from-orange-600 to-red-600',
    
    // Card backgrounds
    cardOuterBorder: isDark 
      ? 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-[length:400%_400%] animate-[gradientShift_6s_ease_infinite]'
      : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-[length:400%_400%] animate-[gradientShift_6s_ease_infinite]',
    
    cardInnerBg: isDark ? 'bg-gray-800' : 'bg-white',
    cardBorder: isDark ? 'border-gray-700' : '',
    
    // Header gradients
    cardHeaderBg: isDark 
      ? 'bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 bg-[length:300%_300%] animate-[gradientFlow_8s_ease_infinite]'
      : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 bg-[length:300%_300%] animate-[gradientFlow_8s_ease_infinite]',
    
    cardHeaderPattern: isDark 
      ? 'from-pink-400 via-purple-400 to-cyan-400 bg-[length:200%_200%] animate-[gradientPulse_4s_ease_infinite]'
      : 'from-pink-500 via-red-500 to-yellow-500 bg-[length:200%_200%] animate-[gradientPulse_4s_ease_infinite]',
    
    // Profile image border
    profileBorder: isDark 
      ? 'from-emerald-400 via-cyan-400 to-purple-400 bg-[length:200%_200%] animate-[gradientRotate_5s_linear_infinite]'
      : 'from-emerald-500 via-blue-500 to-purple-500 bg-[length:200%_200%] animate-[gradientRotate_5s_linear_infinite]',
    
    profileImageBg: isDark ? 'bg-gray-700 border-gray-800' : 'bg-white border-white',
    
    // Skills and stats
    skillsBg: isDark ? 'bg-gray-700/50 border-gray-600 text-gray-300' : '',
    statsBg1: isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50',
    
    // Bottom section
    bottomSectionBg: isDark 
      ? 'from-gray-700 via-gray-800 to-gray-700 bg-[length:200%_200%] animate-[gradientSlide_7s_ease_infinite] border-t border-gray-600'
      : 'from-slate-100 via-blue-100 to-indigo-100 bg-[length:200%_200%] animate-[gradientSlide_7s_ease_infinite]',
    
    // CTA section
    ctaBg: isDark ? 'bg-gray-800/60 backdrop-blur-sm border-gray-700' : 'bg-white/80 backdrop-blur-sm border-white/20',
    ctaIcon: isDark ? 'text-cyan-400' : 'text-blue-600',
    ctaButton: isDark 
      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-cyan-500/25'
      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
    
    // SVG gradient stops
    svgGrad1: isDark ? '#06B6D4' : '#3B82F6',
    svgGrad2: isDark ? '#8B5CF6' : '#8B5CF6',
    svgGrad3: isDark ? '#EC4899' : '#EC4899',
    svgCircle2: isDark ? '#8B5CF6' : '#6366F1'
  };

  return (
    <section className={`py-12 md:py-20 ${themeClasses.mainBg} relative overflow-hidden`}>
      <ThemeToggle />
      
      {/* Background Pattern */}
      <div className={`absolute inset-0 ${themeClasses.bgPattern}`}></div>
      
      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className={`inline-flex items-center ${themeClasses.badgeBg} px-4 py-2 rounded-full text-sm font-medium mb-6 border`}>
            <Users className="w-4 h-4 mr-2" />
            Meet Our Expert Team
          </div>
          <h2 className={`text-3xl md:text-5xl font-bold ${themeClasses.primaryText} mb-6`}>
            The Minds Behind 
            <span className={`block ${themeClasses.gradientText}`}>
              Revenue Guard AI
            </span>
          </h2>
          <p className={`text-lg md:text-xl ${themeClasses.secondaryText} max-w-3xl mx-auto leading-relaxed`}>
            A passionate team of AI engineers, developers, and specialists dedicated to protecting your revenue 
            through cutting-edge technology and innovative solutions.
          </p>
        </div>

        {/* Team Stats with Animated Counters */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className={`text-center ${themeClasses.statsCardBg} rounded-xl p-6 border`}>
            <AnimatedCounter 
              value="20" 
              suffix="+" 
              className={`text-3xl font-bold bg-gradient-to-r ${themeClasses.statsGradient1} bg-clip-text text-transparent mb-2`} 
            />
            <div className={`${themeClasses.mutedText} text-sm`}>Years Combined Experience</div>
          </div>
          <div className={`text-center ${themeClasses.statsCardBg} rounded-xl p-6 border`}>
            <AnimatedCounter 
              value="50" 
              suffix="+" 
              className={`text-3xl font-bold bg-gradient-to-r ${themeClasses.statsGradient2} bg-clip-text text-transparent mb-2`} 
            />
            <div className={`${themeClasses.mutedText} text-sm`}>Projects Delivered</div>
          </div>
          <div className={`text-center ${themeClasses.statsCardBg} rounded-xl p-6 border`}>
            <AnimatedCounter 
              value="99.2" 
              suffix="%" 
              className={`text-3xl font-bold bg-gradient-to-r ${themeClasses.statsGradient3} bg-clip-text text-transparent mb-2`} 
            />
            <div className={`${themeClasses.mutedText} text-sm`}>AI Accuracy Achieved</div>
          </div>
          <div className={`text-center ${themeClasses.statsCardBg} rounded-xl p-6 border`}>
            <div className={`text-3xl font-bold bg-gradient-to-r ${themeClasses.statsGradient4} bg-clip-text text-transparent mb-2`}>
              24/7
            </div>
            <div className={`${themeClasses.mutedText} text-sm`}>System Reliability</div>
          </div>
        </div>

        {/* Developer Cards */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-8 max-w-7xl mx-auto"
             style={{ alignItems: 'stretch' }}>
          {developers.map((dev, index) => (
            <div
              key={dev.id}
              data-card-index={index}
              className={`group relative w-full sm:w-80 md:w-72 lg:w-80 transition-all duration-700 transform hover:scale-105 cursor-pointer ${
                animatedCards.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                alignSelf: 'stretch'
              }}
              onMouseEnter={() => setHoveredCard(dev.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Outer Card with Animated Border */}
              <div className={`relative w-full h-full rounded-3xl p-1 ${themeClasses.cardOuterBorder}`}>
                
                {/* Inner Card Container */}
                <div className={`relative w-full h-full ${themeClasses.cardInnerBg} rounded-3xl overflow-hidden shadow-2xl flex flex-col ${themeClasses.cardBorder ? 'border ' + themeClasses.cardBorder : ''}`}>
                  
                  {/* Individual Hover Background - Only this layer changes color */}
                  <div 
                    className="absolute inset-0 transition-all duration-500 opacity-0 group-hover:opacity-100"
                    style={{ backgroundColor: dev.hoverColor }}
                  ></div>
                  
                  {/* Top Section with Angled Design */}
                  <div 
                    className={`relative h-24 md:h-28 overflow-hidden flex-shrink-0 ${themeClasses.cardHeaderBg}`}
                    style={{
                      clipPath: 'polygon(0% 0%, 100% 0%, 100% 60%, 0% 100%)'
                    }}
                  >
                    {/* Animated Background Pattern */}
                    <div className={`absolute inset-0 opacity-20 bg-gradient-to-r ${themeClasses.cardHeaderPattern}`}></div>
                  </div>

                  {/* Profile Image */}
                  <div className="absolute top-12 md:top-14 left-1/2 transform -translate-x-1/2 flex-shrink-0 z-10">
                    <div className="relative">
                      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full p-1 shadow-2xl bg-gradient-to-r ${themeClasses.profileBorder}`}>
                        <img 
                          src={dev.image} 
                          alt={dev.name}
                          className={`w-full h-full rounded-full object-cover ${themeClasses.profileImageBg} border-2`}
                        />
                      </div>
                      {/* Role Icon */}
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all duration-300 bg-gradient-to-r ${dev.gradient}`}>
                        <dev.icon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content Section - Flexible */}
                  <div className="flex-1 flex flex-col pt-10 md:pt-12 px-4 md:px-6 pb-20 relative z-10">
                    {/* Name and Title */}
                    <div className="text-center mb-3 md:mb-4 flex-shrink-0">
                      <h3 className={`text-lg md:text-xl font-bold ${themeClasses.primaryText} mb-1 group-hover:bg-gradient-to-r group-hover:${dev.gradient} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}>
                        {dev.name}
                      </h3>
                      <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{dev.title}</p>
                      <p className={`text-xs font-medium bg-gradient-to-r ${dev.gradient} bg-clip-text text-transparent`}>{dev.subtitle}</p>
                      <p className="text-xs" style={{ color: dev.primaryColor }}>{dev.specialization}</p>
                    </div>

                    {/* Bio - Flexible */}
                    <div className="flex-1 flex flex-col justify-center">
                      <p className={`text-sm ${themeClasses.secondaryText} mb-4 leading-relaxed text-center`}>{dev.bio}</p>

                      {/* Skills - Show All Skills */}
                      <div className="mb-4 flex-shrink-0">
                        <div className="flex flex-wrap justify-center gap-1">
                          {dev.skills.map((skill, idx) => (
                            <span 
                              key={idx}
                              className={`px-2 py-1 text-xs rounded-lg border transition-colors duration-300 hover:text-white cursor-default ${themeClasses.skillsBg}`}
                              style={{ 
                                backgroundColor: `${dev.primaryColor}15`,
                                borderColor: `${dev.primaryColor}30`,
                                color: dev.primaryColor
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = dev.primaryColor;
                                e.target.style.color = 'white';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = `${dev.primaryColor}15`;
                                e.target.style.color = dev.primaryColor;
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4 flex-shrink-0">
                        <div className={`text-center ${themeClasses.statsBg1} rounded-xl p-2 md:p-3 ${isDark ? 'border border-gray-600' : ''}`}>
                          <div className={`text-sm font-bold ${themeClasses.primaryText}`}>{dev.experience}</div>
                          <div className={`text-xs ${themeClasses.mutedText}`}>Experience</div>
                        </div>
                        <div className={`text-center rounded-xl p-2 md:p-3 ${isDark ? 'border border-gray-600' : ''}`} style={{ backgroundColor: `${dev.primaryColor}${isDark ? '20' : '10'}` }}>
                          <div className="text-sm font-bold" style={{ color: dev.primaryColor }}>{dev.projects}</div>
                          <div className={`text-xs ${themeClasses.mutedText}`}>Projects</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section with Social Links and Connect Button - Fixed Position */}
                  <div className={`absolute bottom-0 left-0 right-0 h-16 flex items-center justify-between px-4 md:px-6 bg-gradient-to-r ${themeClasses.bottomSectionBg} z-10`}
                       style={{
                         clipPath: 'polygon(0% 30%, 100% 0%, 100% 100%, 0% 100%)'
                       }}>
                    
                    {/* Social Links */}
                    <div className="flex space-x-2">
                      {dev.socialLinks.map((social, idx) => (
                        <a
                          key={idx}
                          href={social.url}
                          className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-white hover:shadow-lg transform hover:scale-110 transition-all duration-300 bg-gradient-to-r ${dev.gradient}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <social.icon className="w-3 h-3 md:w-4 md:h-4" />
                        </a>
                      ))}
                    </div>
                    
                    {/* Connect Button */}
                    <button
                      onClick={() => handleConnect(dev.email)}
                      className={`px-3 py-2 md:px-4 md:py-2 text-white rounded-xl text-xs md:text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-r ${dev.gradient}`}
                    >
                      <span className="flex items-center">
                        Connect
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </span>
                    </button>
                  </div>

                  {/* SVG Decorative Elements */}
                  <svg className="absolute top-2 right-2 w-12 h-12 md:w-16 md:h-16 opacity-10 z-10" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id={`grad-${dev.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={themeClasses.svgGrad1} />
                        <stop offset="50%" stopColor={themeClasses.svgGrad2} />
                        <stop offset="100%" stopColor={themeClasses.svgGrad3} />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="25" fill={`url(#grad-${dev.id})`} className="animate-pulse" />
                    <circle cx="70" cy="30" r="10" fill={themeClasses.svgCircle2} opacity="0.6" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 md:mt-16">
          <div className={`${themeClasses.ctaBg} rounded-2xl p-6 md:p-8 border max-w-2xl mx-auto`}>
            <Award className={`w-10 h-10 md:w-12 md:h-12 ${themeClasses.ctaIcon} mx-auto mb-4`} />
            <h3 className={`text-lg md:text-xl font-bold ${themeClasses.primaryText} mb-2`}>Join Our Innovation Journey</h3>
            <p className={`text-sm md:text-base ${themeClasses.secondaryText} mb-4`}>
              Interested in working with our team or have a project in mind?
            </p>
            <button className={`${themeClasses.ctaButton} px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105`}>
              Get In Touch
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 0%; }
          75% { background-position: 0% 0%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes gradientFlow {
          0% { background-position: 0% 0%; }
          33% { background-position: 100% 0%; }
          66% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes gradientPulse {
          0% { background-position: 0% 50%; opacity: 0.2; }
          50% { background-position: 100% 50%; opacity: 0.4; }
          100% { background-position: 0% 50%; opacity: 0.2; }
        }
        @keyframes gradientRotate {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes gradientSlide {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
};

// Wrap the DevelopersSection with ThemeProvider
const DevelopersSectionWithTheme = (props) => (
  <ThemeProvider>
    <DevelopersSection {...props} />
  </ThemeProvider>
);

export default DevelopersSectionWithTheme;