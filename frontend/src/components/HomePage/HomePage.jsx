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
  Award
} from 'lucide-react';

const HomePage = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('features');
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
      color: 'from-emerald-500 to-teal-600',
      stats: { leakage: '$2.1M', accuracy: '99.2%', time: '15min' }
    },
    {
      id: 'telecom',
      title: 'Telecommunications',
      icon: Phone,
      description: 'Identify billing cycle errors, usage discrepancies, and contract mismatches in telecom services.',
      features: ['Usage Pattern Analysis', 'Billing Cycle Validation', 'Roaming Charge Accuracy', 'Contract Compliance'],
      color: 'from-blue-500 to-indigo-600',
      stats: { leakage: '$3.8M', accuracy: '98.7%', time: '12min' }
    }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning algorithms identify complex revenue leakage patterns with 99%+ accuracy.',
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Process large datasets and detect discrepancies in near real-time with automated alerts.',
    },
    {
      icon: Eye,
      title: 'Comprehensive Analysis',
      description: 'Cross-reference billing, usage, contracts, and provisioning data for complete visibility.',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Rich visualizations and insights help understand root causes and prevent future leakages.',
    },
    {
      icon: Shield,
      title: 'Automated Workflow',
      description: 'Automatic ticket creation and routing streamlines investigation and resolution processes.',
    },
    {
      icon: Clock,
      title: 'Faster Recovery',
      description: 'Reduce manual audit time by 80% and accelerate revenue recovery significantly.',
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CFO, MegaRetail Corp',
      avatar: 'SC',
      rating: 5,
      text: 'Revenue Guard AI helped us recover $2.4M in leaked revenue within the first quarter. The accuracy is phenomenal.'
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
    // In a real app, this would navigate to the dashboard
    setTimeout(() => {
      alert(`Redirecting to ${domainId} dashboard...`);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Revenue Guard AI
                </h1>
                <p className="text-xs text-gray-500">Intelligent Leakage Detection</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#domains" className="text-gray-700 hover:text-blue-600 transition-colors">Domains</a>
              <a href="#analytics" className="text-gray-700 hover:text-blue-600 transition-colors">Analytics</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">Reviews</a>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all">
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Revenue Protection
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Stop Revenue Leakage
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Before It Happens
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Advanced AI system that proactively identifies and prioritizes revenue leakage in complex billing workflows. 
              Analyze datasets, detect discrepancies, and recover lost revenue in real-time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all transform hover:scale-105 flex items-center">
                Start Detection
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center mr-3 hover:shadow-xl transition-all">
                  <Play className="w-5 h-5 text-blue-600" />
                </div>
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ${counters.revenue.toLocaleString()}+
              </div>
              <div className="text-gray-600">Revenue Recovered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {counters.issues.toLocaleString()}+
              </div>
              <div className="text-gray-600">Issues Detected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {counters.accuracy}%
              </div>
              <div className="text-gray-600">Detection Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {counters.clients}+
              </div>
              <div className="text-gray-600">Enterprise Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful AI-Driven Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive revenue protection with cutting-edge technology and intelligent automation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domain Selection */}
      <section id="domains" className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Domain
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Specialized AI models trained for specific industry requirements and billing patterns.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {domains.map((domain) => (
              <div 
                key={domain.id} 
                className={`group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${
                  selectedDomain === domain.id ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
                }`}
                onClick={() => handleDomainSelect(domain.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${domain.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="relative p-8">
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${domain.color} rounded-2xl flex items-center justify-center mr-4`}>
                      <domain.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{domain.title}</h3>
                      <p className="text-sm text-gray-500">Specialized Detection</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">{domain.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <div className="text-lg font-bold text-gray-900">{domain.stats.leakage}</div>
                      <div className="text-xs text-gray-500">Avg. Recovery</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <div className="text-lg font-bold text-gray-900">{domain.stats.accuracy}</div>
                      <div className="text-xs text-gray-500">Accuracy</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <div className="text-lg font-bold text-gray-900">{domain.stats.time}</div>
                      <div className="text-xs text-gray-500">Process Time</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {domain.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className={`w-full bg-gradient-to-r ${domain.color} text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center`}>
                    Select {domain.title}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Preview */}
      <section id="analytics" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Analytics & Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive dashboards and visualizations provide deep insights into revenue patterns.
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Revenue Leakage Dashboard</h3>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-red-700 font-semibold">Critical Issues</h4>
                    <TrendingUp className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-red-700">247</div>
                  <div className="text-sm text-red-600">$156,780 impact</div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-yellow-700 font-semibold">Medium Priority</h4>
                    <BarChart3 className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-700">1,432</div>
                  <div className="text-sm text-yellow-600">$89,450 impact</div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-green-700 font-semibold">Resolved</h4>
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-700">8,756</div>
                  <div className="text-sm text-green-600">$2.1M recovered</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Interactive charts and real-time monitoring available in full dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how organizations are transforming their revenue protection with AI.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Protect Your Revenue?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join leading organizations using AI to detect, prevent, and recover lost revenue automatically.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all transform hover:scale-105">
              Start Free Trial
            </button>
            <button className="text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">Revenue Guard AI</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI-powered revenue leakage detection for modern enterprises.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Domains</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Revenue Guard AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;