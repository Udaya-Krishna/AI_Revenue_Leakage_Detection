import React, { useState, useEffect } from 'react';
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
  Award
} from 'lucide-react';

const DevelopersSection = () => {
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
      title: "Lead AI Engineer & Project Architect",
      specialization: "Machine Learning & System Architecture",
      image: "/api/placeholder/80/80",
      email: "godwin.wilfred@revenueguard.ai",
      bio: "AI specialist with expertise in revenue leakage detection algorithms and scalable ML systems.",
      skills: ["Machine Learning", "Python", "TensorFlow", "System Design"],
      experience: "5+ years",
      projects: "12+ AI projects",
      icon: Brain,
      primaryColor: "#8B5CF6",
      secondaryColor: "#3B82F6",
      socialLinks: [
        { type: 'github', url: 'https://github.com/godwin-wilfred', icon: Github },
        { type: 'linkedin', url: 'https://linkedin.com/in/godwin-wilfred', icon: Linkedin },
        { type: 'email', url: 'mailto:godwin.wilfred@revenueguard.ai', icon: Mail }
      ]
    },
    {
      id: 2,
      name: "Pooja Shree",
      title: "Frontend Lead & UI/UX Architect", 
      specialization: "User Interface & Experience Design",
      image: "/api/placeholder/80/80",
      email: "pooja.shree@revenueguard.ai",
      bio: "Creative frontend engineer specializing in intuitive dashboards and data visualization interfaces.",
      skills: ["React", "TypeScript", "UI/UX Design", "Data Visualization"],
      experience: "4+ years",
      projects: "15+ UI projects",
      icon: Code,
      primaryColor: "#EC4899",
      secondaryColor: "#F59E0B",
      socialLinks: [
        { type: 'github', url: 'https://github.com/pooja-shree', icon: Github },
        { type: 'linkedin', url: 'https://linkedin.com/in/pooja-shree', icon: Linkedin },
        { type: 'email', url: 'mailto:pooja.shree@revenueguard.ai', icon: Mail }
      ]
    },
    {
      id: 3,
      name: "Ragul K B",
      title: "Backend Engineer & Data Specialist",
      specialization: "Distributed Systems & Data Processing",
      image: "/api/placeholder/80/80", 
      email: "ragul.kb@revenueguard.ai",
      bio: "Backend architect focused on high-performance data processing and real-time analytics systems.",
      skills: ["Node.js", "Python", "PostgreSQL", "Microservices"],
      experience: "4+ years",
      projects: "10+ backend systems",
      icon: Database,
      primaryColor: "#10B981",
      secondaryColor: "#059669",
      socialLinks: [
        { type: 'github', url: 'https://github.com/ragul-kb', icon: Github },
        { type: 'linkedin', url: 'https://linkedin.com/in/ragul-kb', icon: Linkedin },
        { type: 'email', url: 'mailto:ragul.kb@revenueguard.ai', icon: Mail }
      ]
    },
    {
      id: 4,
      name: "Ashwin",
      title: "DevOps Engineer & Security Specialist",
      specialization: "Cloud Infrastructure & Security",
      image: "/api/placeholder/80/80",
      email: "ashwin@revenueguard.ai", 
      bio: "DevOps expert ensuring scalable, secure, and reliable infrastructure for AI-powered systems.",
      skills: ["AWS", "Kubernetes", "Terraform", "Security"],
      experience: "3+ years",
      projects: "8+ infrastructure projects",
      icon: Shield,
      primaryColor: "#F97316",
      secondaryColor: "#EF4444",
      socialLinks: [
        { type: 'github', url: 'https://github.com/ashwin-devops', icon: Github },
        { type: 'linkedin', url: 'https://linkedin.com/in/ashwin-devops', icon: Linkedin },
        { type: 'email', url: 'mailto:ashwin@revenueguard.ai', icon: Mail }
      ]
    },
    {
      id: 5,
      name: "Udaya Krishnan",
      title: "Full-Stack Developer & Integration Expert",
      specialization: "API Development & System Integration",
      image: "/api/placeholder/80/80",
      email: "udaya.krishnan@revenueguard.ai",
      bio: "Versatile developer bridging frontend and backend systems with robust API integrations.",
      skills: ["Full-Stack Development", "REST APIs", "GraphQL", "React"],
      experience: "3+ years", 
      projects: "12+ full-stack projects",
      icon: Zap,
      primaryColor: "#3B82F6",
      secondaryColor: "#06B6D4",
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

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-20"></div>
      
      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4 mr-2" />
            Meet Our Expert Team
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            The Minds Behind 
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Revenue Guard AI
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A passionate team of AI engineers, developers, and specialists dedicated to protecting your revenue 
            through cutting-edge technology and innovative solutions.
          </p>
        </div>

        {/* Developer Cards */}
        <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
          {developers.map((dev, index) => (
            <div
              key={dev.id}
              data-card-index={index}
              className={`group relative w-80 h-[480px] transition-all duration-700 transform hover:scale-105 cursor-pointer ${
                animatedCards.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredCard(dev.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Outer Card with Animated Border */}
              <div className="relative w-full h-full rounded-3xl p-1 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 via-orange-500 via-emerald-500 to-indigo-500 bg-[length:300%_300%] animate-[gradient_8s_ease_infinite]">
                
                {/* Inner Card Container */}
                <div className="relative w-full h-full bg-white rounded-3xl overflow-hidden shadow-2xl">
                  
                  {/* Top Section with Angled Design */}
                  <div 
                    className="relative h-32 overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${dev.primaryColor}00 0%, ${dev.primaryColor}40 50%, ${dev.secondaryColor}60 100%)`,
                      clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 0% 100%)'
                    }}
                  >
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div 
                        className="w-full h-full bg-[length:30px_30px] animate-pulse"
                        style={{
                          backgroundImage: `radial-gradient(circle at 15px 15px, ${dev.primaryColor}30 2px, transparent 2px)`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Profile Image */}
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                      <div 
                        className="w-20 h-20 rounded-full p-1 shadow-2xl animate-pulse"
                        style={{ background: `linear-gradient(45deg, ${dev.primaryColor}, ${dev.secondaryColor})` }}
                      >
                        <img 
                          src={dev.image} 
                          alt={dev.name}
                          className="w-full h-full rounded-full object-cover bg-white border-2 border-white"
                        />
                      </div>
                      {/* Role Icon */}
                      <div 
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all duration-300"
                        style={{ background: `linear-gradient(45deg, ${dev.primaryColor}, ${dev.secondaryColor})` }}
                      >
                        <dev.icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="pt-16 px-6 pb-20 text-center relative">
                    {/* Name and Title */}
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300"
                          style={{ '--tw-gradient-from': dev.primaryColor, '--tw-gradient-to': dev.secondaryColor }}>
                        {dev.name}
                      </h3>
                      <p className="text-sm font-semibold text-gray-700 mb-1">{dev.title}</p>
                      <p className="text-xs" style={{ color: dev.primaryColor }}>{dev.specialization}</p>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-gray-600 mb-4 leading-relaxed">{dev.bio}</p>

                    {/* Skills */}
                    <div className="mb-4">
                      <div className="flex flex-wrap justify-center gap-1">
                        {dev.skills.map((skill, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 text-xs rounded-lg border transition-colors duration-300 hover:text-white"
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
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center bg-gray-50 rounded-xl p-2">
                        <div className="text-sm font-bold text-gray-900">{dev.experience}</div>
                        <div className="text-xs text-gray-500">Experience</div>
                      </div>
                      <div className="text-center rounded-xl p-2"
                           style={{ backgroundColor: `${dev.primaryColor}10` }}>
                        <div className="text-sm font-bold" style={{ color: dev.primaryColor }}>{dev.projects}</div>
                        <div className="text-xs text-gray-500">Completed</div>
                      </div>
                    </div>
                  </div>

                  {/* SVG Decorative Elements */}
                  <svg className="absolute top-0 right-0 w-16 h-16 opacity-10" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id={`grad-${dev.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={dev.primaryColor} />
                        <stop offset="100%" stopColor={dev.secondaryColor} />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="30" fill={`url(#grad-${dev.id})`} className="animate-pulse" />
                    <circle cx="70" cy="30" r="15" fill={dev.secondaryColor} opacity="0.6" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
            <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Join Our Innovation Journey</h3>
            <p className="text-gray-600 mb-4">
              Interested in working with our team or have a project in mind?
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105">
              Get In Touch
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
};

export default DevelopersSection;