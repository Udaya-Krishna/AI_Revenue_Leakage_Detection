import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Phone, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Users, 
  DollarSign,
  ArrowRight,
  Check,
  Star,
  Play,
  ChevronDown,
  Brain,
  Eye,
  Clock,
  Award,
  Code,
  Menu,
  X,
  Moon,
  Sun,
  Search,
  Target
} from 'lucide-react';
import { useGlobalTheme } from "./GlobalThemeContext";

import DevelopersSection from "./Developers/Developers";

import ChatBot from './ChatBot/ChatBot';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useGlobalTheme();
  
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

const HomePage = ({ onDomainSelect }) => {
  const { isDark } = useGlobalTheme();
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('features');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [counters, setCounters] = useState({
    revenue: 0,
    issues: 0,
    accuracy: 0,
    clients: 0
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Animate counters
    const animateCounter = (key, target, duration = 2000) => {
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 16);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id === 'stats-section') {
          animateCounter('revenue', 2400000);
          animateCounter('issues', 15000);
          animateCounter('accuracy', 99);
          animateCounter('clients', 150);
        }
      });
    });

    const statsSection = document.getElementById('stats-section');
    if (statsSection) observer.observe(statsSection);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const domains = [
    {
      id: 'supermarket',
      title: 'Retail & Supermarket',
      icon: ShoppingCart,
      description: 'Detect pricing errors, inventory discrepancies, and promotional billing issues in retail environments.',
      features: ['SKU Price Validation', 'Inventory Reconciliation', 'Promotional Discount Accuracy', 'Tax Calculation Verification'],
      color: 'from-emerald-400 to-teal-500',
      lightColor: 'from-emerald-500 to-teal-600',
      stats: { leakage: '$2.1M', accuracy: '99.2%', time: '15min' }
    },
    {
      id: 'telecom',
      title: 'Telecommunications',
      icon: Phone,
      description: 'Identify billing cycle errors, usage discrepancies, and contract mismatches in telecom services.',
      features: ['Usage Pattern Analysis', 'Billing Cycle Validation', 'Roaming Charge Accuracy', 'Contract Compliance'],
      color: 'from-cyan-400 to-blue-500',
      lightColor: 'from-blue-500 to-indigo-600',
      stats: { leakage: '$3.8M', accuracy: '98.7%', time: '12min' }
    }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning algorithms identify complex revenue leakage patterns with 99%+ accuracy.',
      color: 'from-purple-400 to-indigo-500',
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Process large datasets and detect discrepancies in near real-time with automated alerts.',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: Eye,
      title: 'Comprehensive Analysis',
      description: 'Cross-reference billing, usage, contracts, and provisioning data for complete visibility.',
      color: 'from-pink-400 to-rose-500',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Rich visualizations and insights help understand root causes and prevent future leakages.',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'Automated Workflow',
      description: 'Automatic ticket creation and routing streamlines investigation and resolution processes.',
      color: 'from-emerald-400 to-teal-500',
    },
    {
      icon: Clock,
      title: 'Faster Recovery',
      description: 'Reduce manual audit time by 80% and accelerate revenue recovery significantly.',
      color: 'from-indigo-400 to-purple-500',
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CFO, MegaRetail Corp',
      avatar: 'SC',
      rating: 5,
      text: 'Revenue Leak Hunter AI helped us recover $2.4M in leaked revenue within the first quarter. The accuracy is phenomenal.'
    },
    {
      name: 'Michael Rodriguez',
      role: 'VP Operations, TeleConnect',
      avatar: 'MR',
      rating: 5,
      text: 'The real-time detection capabilities have transformed our billing accuracy. We catch issues before they impact customers.'
    },
    {
      name: 'Emily Watson',
      role: 'Head of Finance, QuickMart',
      avatar: 'EW',
      rating: 5,
      text: 'Implementation was seamless and ROI was evident within weeks. This is a game-changer for retail billing.'
    }
  ];

  const handleDomainSelect = (domainId) => {
    setSelectedDomain(domainId);
    if (onDomainSelect) {
      onDomainSelect(domainId);
    }
  };

  const themeClasses = {
    // Main backgrounds
    mainBg: isDark ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50',
    
    // Header
    headerBg: isDark 
      ? (isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-2xl border-b border-gray-700' : 'bg-transparent')
      : (isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'),
    
    // Text colors
    primaryText: isDark ? 'text-white' : 'text-gray-900',
    secondaryText: isDark ? 'text-gray-300' : 'text-gray-600',
    mutedText: isDark ? 'text-gray-400' : 'text-gray-500',
    
    // Navigation
    navText: isDark ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-blue-600',
    navButton: isDark 
      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:scale-105'
      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all',
    
    // Cards and sections
    cardBg: isDark ? 'bg-gray-800/60 backdrop-blur-sm' : 'bg-white',
    cardBorder: isDark ? 'border border-gray-700 hover:border-gray-600' : 'shadow-lg hover:shadow-2xl',
    
    // Stats section
    statsBg: isDark ? 'bg-gray-800/40 backdrop-blur-sm border-y border-gray-700' : 'bg-white',
    
    // Gradients
    gradientText: isDark 
      ? 'bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'
      : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent',
    
    // Buttons
    primaryButton: isDark
      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl hover:shadow-xl hover:shadow-cyan-500/25 transition-all transform hover:scale-105'
      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all transform hover:scale-105',
    
    // Hero patterns
    heroPattern: isDark 
      ? 'bg-gradient-to-br from-gray-900/20 via-blue-900/10 to-purple-900/20'
      : 'bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]'
  };

  return (
    <div className={themeClasses.mainBg}>
      <ThemeToggle />
      
      {/* ========== NAVIGATION HEADER SECTION ========== */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${themeClasses.headerBg}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${isDark ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} rounded-xl flex items-center justify-center shadow-lg`}>
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${themeClasses.gradientText}`}>
                  Revenue Leak Hunter AI
                </h1>
                <p className={`text-xs ${themeClasses.mutedText}`}>Intelligent Leakage Detection</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className={themeClasses.navText + ' transition-colors'}>Features</a>
              <a href="#domains" className={themeClasses.navText + ' transition-colors'}>Domains</a>
              <a href="#analytics" className={themeClasses.navText + ' transition-colors'}>Analytics</a>
              <a href="#testimonials" className={themeClasses.navText + ' transition-colors'}>Reviews</a>
              <a href="#developers" className={themeClasses.navText + ' transition-colors flex items-center'}>
                <Code className="w-4 h-4 mr-2" />
                Developers
              </a>
              <button 
                onClick={() => document.getElementById('domains').scrollIntoView({ behavior: 'smooth' })}
                className={themeClasses.navButton}
              >
                Get Started
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className={`md:hidden ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className={`md:hidden mt-4 pb-4 ${isDark ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
              <nav className="flex flex-col space-y-4 mt-4">
                <a href="#features" className={themeClasses.navText + ' transition-colors'}>Features</a>
                <a href="#domains" className={themeClasses.navText + ' transition-colors'}>Domains</a>
                <a href="#analytics" className={themeClasses.navText + ' transition-colors'}>Analytics</a>
                <a href="#testimonials" className={themeClasses.navText + ' transition-colors'}>Reviews</a>
                <a href="#developers" className={`${themeClasses.navText} transition-colors flex items-center`}>
                  <Code className="w-4 h-4 mr-2" />
                  Developers
                </a>
                <button 
                  onClick={() => {
                    document.getElementById('domains').scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className={`${isDark ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white px-6 py-2 rounded-lg text-center`}
                >
                  Get Started
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* ========== HERO SECTION ========== */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className={`absolute inset-0 ${themeClasses.heroPattern}`}></div>
        {isDark && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-gray-900/10 to-transparent"></div>}
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className={`inline-flex items-center ${isDark ? 'bg-gray-800/60 text-cyan-400 border border-gray-700' : 'bg-blue-100 text-blue-700'} px-4 py-2 rounded-full text-sm font-medium mb-6`}>
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Revenue Protection
            </div>
            <h1 className={`text-5xl md:text-6xl font-bold ${themeClasses.primaryText} mb-6 leading-tight`}>
              Stop Revenue Leakage
              <span className={`block ${themeClasses.gradientText}`}>
                Before It Happens
              </span>
            </h1>
            <p className={`text-xl ${themeClasses.secondaryText} mb-10 leading-relaxed`}>
              Advanced AI system that proactively identifies and prioritizes revenue leakage in complex billing workflows. 
              Analyze datasets, detect discrepancies, and recover lost revenue in real-time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={() => document.getElementById('domains').scrollIntoView({ behavior: 'smooth' })}
                className={themeClasses.primaryButton + ' flex items-center'}
              >
                Start Detection
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className={`flex items-center ${themeClasses.secondaryText} hover:${isDark ? 'text-cyan-400' : 'text-blue-600'} transition-colors`}>
                <div className={`w-12 h-12 ${isDark ? 'bg-gray-800/60 backdrop-blur-sm shadow-lg hover:shadow-xl hover:bg-gray-700/60 border border-gray-700' : 'bg-white shadow-lg hover:shadow-xl'} rounded-full flex items-center justify-center mr-3 transition-all`}>
                  <Play className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
                </div>
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== STATS SECTION ========== */}
      <section id="stats-section" className={`py-16 ${themeClasses.statsBg}`}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className={`text-3xl font-bold ${isDark ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'text-gray-900'} ${isDark ? 'bg-clip-text text-transparent' : ''} mb-2 group-hover:scale-110 transition-transform`}>
                ${counters.revenue.toLocaleString()}+
              </div>
              <div className={themeClasses.mutedText}>Revenue Recovered</div>
            </div>
            <div className="text-center group">
              <div className={`text-3xl font-bold ${isDark ? 'bg-gradient-to-r from-cyan-400 to-blue-400' : 'text-gray-900'} ${isDark ? 'bg-clip-text text-transparent' : ''} mb-2 group-hover:scale-110 transition-transform`}>
                {counters.issues.toLocaleString()}+
              </div>
              <div className={themeClasses.mutedText}>Issues Detected</div>
            </div>
            <div className="text-center group">
              <div className={`text-3xl font-bold ${isDark ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'text-gray-900'} ${isDark ? 'bg-clip-text text-transparent' : ''} mb-2 group-hover:scale-110 transition-transform`}>
                {counters.accuracy}%
              </div>
              <div className={themeClasses.mutedText}>Detection Accuracy</div>
            </div>
            <div className="text-center group">
              <div className={`text-3xl font-bold ${isDark ? 'bg-gradient-to-r from-orange-400 to-red-400' : 'text-gray-900'} ${isDark ? 'bg-clip-text text-transparent' : ''} mb-2 group-hover:scale-110 transition-transform`}>
                {counters.clients}+
              </div>
              <div className={themeClasses.mutedText}>Enterprise Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${themeClasses.primaryText} mb-4`}>
              Powerful AI-Driven Features
            </h2>
            <p className={`text-xl ${themeClasses.secondaryText} max-w-2xl mx-auto`}>
              Comprehensive revenue protection with cutting-edge technology and intelligent automation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`group p-8 ${themeClasses.cardBg} ${themeClasses.cardBorder} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}>
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-xl font-semibold ${themeClasses.primaryText} mb-3`}>{feature.title}</h3>
                <p className={`${themeClasses.secondaryText} leading-relaxed`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== DOMAIN SELECTION SECTION ========== */}
      <section id="domains" className={`py-20 ${isDark ? 'bg-gradient-to-r from-gray-800/40 to-slate-800/40 backdrop-blur-sm' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${themeClasses.primaryText} mb-4`}>
              Choose Your Domain
            </h2>
            <p className={`text-xl ${themeClasses.secondaryText} max-w-2xl mx-auto`}>
              Specialized AI models trained for specific industry requirements and billing patterns.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {domains.map((domain) => (
              <div 
                key={domain.id} 
                className={`group relative overflow-hidden rounded-3xl ${themeClasses.cardBg} ${themeClasses.cardBorder} shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${
                  selectedDomain === domain.id ? (isDark ? 'ring-4 ring-cyan-400 ring-opacity-50 border-cyan-400' : 'ring-4 ring-blue-500 ring-opacity-50') : ''
                }`}
                onClick={() => handleDomainSelect(domain.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? domain.color : domain.lightColor} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="relative p-8">
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${isDark ? domain.color : domain.lightColor} rounded-2xl flex items-center justify-center mr-4 shadow-lg`}>
                      <domain.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${themeClasses.primaryText}`}>{domain.title}</h3>
                      <p className={`text-sm ${themeClasses.mutedText}`}>Specialized Detection</p>
                    </div>
                  </div>
                  
                  <p className={`${themeClasses.secondaryText} mb-6 leading-relaxed`}>{domain.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className={`text-center p-3 ${isDark ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50'} rounded-xl`}>
                      <div className={`text-lg font-bold ${themeClasses.primaryText}`}>{domain.stats.leakage}</div>
                      <div className={`text-xs ${themeClasses.mutedText}`}>Accuracy</div>
                    </div>
                    <div className={`text-center p-3 ${isDark ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50'} rounded-xl`}>
                      <div className={`text-lg font-bold ${themeClasses.primaryText}`}>{domain.stats.time}</div>
                      <div className={`text-xs ${themeClasses.mutedText}`}>Process Time</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {domain.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <Check className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-green-500'} mr-3 flex-shrink-0`} />
                        <span className={themeClasses.secondaryText}>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className={`w-full bg-gradient-to-r ${isDark ? domain.color : domain.lightColor} text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center`}>
                    Select {domain.title}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ANALYTICS PREVIEW SECTION ========== */}
      <section id="analytics" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${themeClasses.primaryText} mb-4`}>
              Advanced Analytics & Insights
            </h2>
            <p className={`text-xl ${themeClasses.secondaryText} max-w-2xl mx-auto`}>
              Comprehensive dashboards and visualizations provide deep insights into revenue patterns.
            </p>
          </div>
          
          <div className={`${themeClasses.cardBg} ${themeClasses.cardBorder} rounded-3xl shadow-2xl overflow-hidden`}>
            <div className={`${isDark ? 'bg-gradient-to-r from-gray-700/60 to-gray-800/60 border-b border-gray-600' : 'bg-gradient-to-r from-gray-50 to-blue-50 border-b'} p-6`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-semibold ${themeClasses.primaryText}`}>Revenue Leakage Dashboard</h3>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className={`${isDark ? 'bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-800/30' : 'bg-gradient-to-r from-red-50 to-red-100'} p-6 rounded-xl`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`${isDark ? 'text-red-400' : 'text-red-700'} font-semibold`}>Critical Issues</h4>
                    <TrendingUp className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                  </div>
                  <div className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-700'}`}>247</div>
                  <div className={`text-sm ${isDark ? 'text-red-300' : 'text-red-600'}`}>$156,780 impact</div>
                </div>
                
                <div className={`${isDark ? 'bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border border-yellow-800/30' : 'bg-gradient-to-r from-yellow-50 to-yellow-100'} p-6 rounded-xl`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`${isDark ? 'text-yellow-400' : 'text-yellow-700'} font-semibold`}>Medium Priority</h4>
                    <BarChart3 className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  </div>
                  <div className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>1,432</div>
                  <div className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`}>$89,450 impact</div>
                </div>
                
                <div className={`${isDark ? 'bg-gradient-to-r from-emerald-900/20 to-emerald-800/20 border border-emerald-800/30' : 'bg-gradient-to-r from-green-50 to-green-100'} p-6 rounded-xl`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`${isDark ? 'text-emerald-400' : 'text-green-700'} font-semibold`}>Resolved</h4>
                    <Award className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-green-600'}`} />
                  </div>
                  <div className={`text-2xl font-bold ${isDark ? 'text-emerald-400' : 'text-green-700'}`}>8,756</div>
                  <div className={`text-sm ${isDark ? 'text-emerald-300' : 'text-green-600'}`}>$2.1M recovered</div>
                </div>
              </div>
              
              <div className={`${isDark ? 'bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-800/30' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} p-6 rounded-xl`}>
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <BarChart3 className={`w-16 h-16 ${isDark ? 'text-cyan-400' : 'text-blue-500'} mx-auto mb-4`} />
                    <p className={themeClasses.secondaryText}>Interactive charts and real-time monitoring available in full dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS SECTION ========== */}
      <section id="testimonials" className={`py-20 ${isDark ? 'bg-gradient-to-r from-gray-800/40 to-slate-800/40 backdrop-blur-sm' : 'bg-gradient-to-r from-gray-50 to-blue-50'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${themeClasses.primaryText} mb-4`}>
              Trusted by Industry Leaders
            </h2>
            <p className={`text-xl ${themeClasses.secondaryText} max-w-2xl mx-auto`}>
              See how organizations are transforming their revenue protection with AI.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`${themeClasses.cardBg} ${themeClasses.cardBorder} p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all`}>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className={`${themeClasses.secondaryText} mb-6 italic leading-relaxed`}>"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${isDark ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'} rounded-full flex items-center justify-center text-white font-semibold mr-4 shadow-lg`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className={`font-semibold ${themeClasses.primaryText}`}>{testimonial.name}</div>
                    <div className={`text-sm ${themeClasses.mutedText}`}>{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== DEVELOPERS SECTION ========== */}
      <section id="developers">
        <DevelopersSection />
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className={`py-20 ${isDark ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-sm border-y border-cyan-800/30' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-white'} mb-4`}>
            Ready to Protect Your Revenue?
          </h2>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-blue-100'} mb-10 max-w-2xl mx-auto`}>
            Join leading organizations using AI to detect, prevent, and recover lost revenue automatically.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={() => document.getElementById('domains').scrollIntoView({ behavior: 'smooth' })}
              className={`${isDark ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-cyan-500/25 transition-all transform hover:scale-105' : 'bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all transform hover:scale-105'}`}
            >
              Start Free Trial
            </button>
            <button className={`${isDark ? 'text-white border-2 border-cyan-400/50 bg-cyan-400/10 px-8 py-4 rounded-xl font-semibold hover:bg-cyan-400/20 hover:border-cyan-400 transition-all' : 'text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all'}`}>
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* ========== FOOTER SECTION ========== */}
      <footer className={`${isDark ? 'bg-gray-900 border-t border-gray-800' : 'bg-gray-900'} text-white py-12`}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-8 h-8 ${isDark ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'} rounded-lg flex items-center justify-center shadow-lg`}>
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">Revenue Leak Hunter AI</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI-powered revenue leakage detection for modern enterprises.
              </p>
            </div>
            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? 'text-cyan-400' : 'text-white'}`}>Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className={`hover:${isDark ? 'text-cyan-400' : 'text-white'} transition-colors`}>Features</a></li>
                <li><a href="#domains" className={`hover:${isDark ? 'text-cyan-400' : 'text-white'} transition-colors`}>Domains</a></li>
                <li><a href="#analytics" className={`hover:${isDark ? 'text-cyan-400' : 'text-white'} transition-colors`}>Analytics</a></li>
                <li><a href="#" className={`hover:${isDark ? 'text-cyan-400' : 'text-white'} transition-colors`}>Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? 'text-cyan-400' : 'text-white'}`}>Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className={`hover:${isDark ? 'text-cyan-400' : 'text-white'} transition-colors`}>About</a></li>
                <li><a href="#" className={`hover:${isDark ? 'text-cyan-400' : 'text-white'} transition-colors`}>Careers</a></li>
                <li><a href="#developers" className={`hover:${isDark ? 'text-cyan-400' : 'text-white'} transition-colors`}>Developers</a></li>
                <li><a href="#" className={`hover:${isDark ? 'text-cyan-400' : 'text-white'} transition-colors`}>Contact</a></li>
                <li><a href="#" className={`hover:${isDark ? 'text-cyan-400' : 'text-white'} transition-colors`}>Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? 'text-cyan-400' : 'text-white'}`}>Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className={`hover:${isDark ? 'text-cyan-400' : 'text-white'} transition-colors`}>Documentation</a></li>
                <li><a href="#" className={`hover:${isDark ? 'text-cyan-400' : 'text-white'} transition-colors`}>Help Center</a></li>
                <li><a href="#" className={`hover:${isDark ? 'text-cyan-400' : 'text-white'} transition-colors`}>Security</a></li>
                <li><a href="#" className={`hover:${isDark ? 'text-cyan-400' : 'text-white'} transition-colors`}>Status</a></li>
              </ul>
            </div>
          </div>
          <div className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-700'} mt-8 pt-8 text-center text-sm text-gray-400`}>
            <p>&copy; 2025 Revenue Leak Hunter AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <ChatBot />
    </div>
  );
};

export default HomePage;