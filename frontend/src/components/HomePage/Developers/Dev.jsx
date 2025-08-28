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

const DevSection = () => {
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
      skills: ["Machine Learning", "Python", "TensorFlow", "System Design", "Data Engineering"],
      experience: "5+ years",
      projects: "12+",
      icon: Brain,
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
      bio: "Creative frontend engineer specializing in intuitive dashboards and data visualization interfaces for complex systems.",
      skills: ["React", "TypeScript", "UI/UX Design", "Data Visualization", "Tailwind CSS"],
      experience: "4+ years",
      projects: "15+",
      icon: Code,
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
      skills: ["Node.js", "Python", "PostgreSQL", "Redis", "Microservices", "Docker"],
      experience: "4+ years",
      projects: "10+",
      icon: Database,
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
      skills: ["AWS", "Kubernetes", "Terraform", "CI/CD", "Security", "Monitoring"],
      experience: "3+ years",
      projects: "8+",
      icon: Shield,
      socialLinks: [
        { type: 'github', url: 'https://github.com/ashwin-devops', icon: Github },
        { type: 'linkedin', url: 'https://linkedin.com/in/ashwin-devops', icon: Linkedin },
        { type: 'email', url: 'mailto:ashwin@revenueguard.ai', icon: Mail }
      ]
    },
    {
      id: 5,
      name: "Udaya Krishna",
      title: "Full-Stack Developer",
      subtitle: "Integration Expert",
      specialization: "API Development & System Integration",
      image: "/api/placeholder/80/80",
      email: "udaya.krishnan@revenueguard.ai",
      bio: "Versatile developer bridging frontend and backend systems with robust API integrations.",
      skills: ["Full-Stack", "REST APIs", "GraphQL", "React", "Node.js", "MongoDB"],
      experience: "3+ years", 
      projects: "12+",
      icon: Zap,
      socialLinks: [
        { type: 'github', url: 'https://github.com/Udaya-Krishna', icon: Github },
        { type: 'linkedin', url: 'https://www.linkedin.com/in/udaya-krishna-21aug/', icon: Linkedin },
        { type: 'email', url: 'mailto:udaya.krishnan@revenueguard.ai', icon: Mail }
      ]
    }
  ];

  const handleConnect = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-20"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4 mr-2" />
            Meet Our Expert Team
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            The Minds Behind 
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Revenue Guard AI
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A passionate team of AI engineers, developers, and specialists dedicated to protecting your revenue 
            through cutting-edge technology and innovative solutions.
          </p>
        </div>

        {/* Developer Cards */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-8 max-w-7xl mx-auto">
          {developers.map((dev, index) => (
            <div
              key={dev.id}
              data-card-index={index}
              className={`group relative w-full sm:w-80 md:w-72 lg:w-80 transition-all duration-700 transform hover:scale-105 cursor-pointer ${
                animatedCards.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredCard(dev.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Outer Card with Animated Border */}
              <div className="relative w-full min-h-[520px] md:min-h-[480px] lg:min-h-[500px] rounded-3xl p-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-[length:400%_400%] animate-[gradientShift_6s_ease_infinite]">
                
                {/* Inner Card Container */}
                <div className="relative w-full h-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                  
                  {/* Top Section with Angled Design */}
                  <div 
                    className="relative h-24 md:h-28 overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 bg-[length:300%_300%] animate-[gradientFlow_8s_ease_infinite]"
                    style={{
                      clipPath: 'polygon(0% 0%, 100% 0%, 100% 60%, 0% 100%)'
                    }}
                  >
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-[length:200%_200%] animate-[gradientPulse_4s_ease_infinite]"></div>
                  </div>

                  {/* Profile Image */}
                  <div className="absolute top-12 md:top-14 left-1/2 transform -translate-x-1/2 flex-shrink-0">
                    <div className="relative">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full p-1 shadow-2xl bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-[length:200%_200%] animate-[gradientRotate_5s_linear_infinite]">
                        <img 
                          src={dev.image} 
                          alt={dev.name}
                          className="w-full h-full rounded-full object-cover bg-white border-2 border-white"
                        />
                      </div>
                      {/* Role Icon */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all duration-300 bg-gradient-to-r from-orange-500 to-red-500">
                        <dev.icon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content Section - Flexible */}
                  <div className="flex-1 flex flex-col pt-10 md:pt-12 px-4 md:px-6 pb-20">
                    {/* Name and Title */}
                    <div className="text-center mb-3 md:mb-4 flex-shrink-0">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {dev.name}
                      </h3>
                      <p className="text-sm font-semibold text-gray-700">{dev.title}</p>
                      <p className="text-xs font-medium text-blue-600">{dev.subtitle}</p>
                      <p className="text-xs text-gray-500 mt-1">{dev.specialization}</p>
                    </div>

                    {/* Bio - Flexible */}
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed text-center">{dev.bio}</p>

                      {/* Skills */}
                      <div className="mb-4 flex-shrink-0">
                        <div className="flex flex-wrap justify-center gap-1">
                          {dev.skills.map((skill, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 text-xs rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 hover:from-blue-500 hover:to-indigo-500 hover:text-white transition-all duration-300 cursor-default"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4 flex-shrink-0">
                        <div className="text-center bg-gray-50 rounded-xl p-2 md:p-3">
                          <div className="text-sm font-bold text-gray-900">{dev.experience}</div>
                          <div className="text-xs text-gray-500">Experience</div>
                        </div>
                        <div className="text-center rounded-xl p-2 md:p-3 bg-gradient-to-r from-blue-50 to-indigo-50">
                          <div className="text-sm font-bold text-blue-700">{dev.projects}</div>
                          <div className="text-xs text-gray-500">Projects</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section with Social Links and Connect Button - Fixed Position */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-between px-4 md:px-6 bg-gradient-to-r from-slate-100 via-blue-100 to-indigo-100 bg-[length:200%_200%] animate-[gradientSlide_7s_ease_infinite]"
                       style={{
                         clipPath: 'polygon(0% 30%, 100% 0%, 100% 100%, 0% 100%)'
                       }}>
                    
                    {/* Social Links */}
                    <div className="flex space-x-2 z-10">
                      {dev.socialLinks.map((social, idx) => (
                        <a
                          key={idx}
                          href={social.url}
                          className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-white hover:shadow-lg transform hover:scale-110 transition-all duration-300 relative overflow-hidden group/social bg-gradient-to-r from-gray-600 to-gray-700 hover:from-blue-500 hover:to-indigo-500"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <social.icon className="w-3 h-3 md:w-4 md:h-4 relative z-10" />
                        </a>
                      ))}
                    </div>
                    
                    {/* Connect Button */}
                    <button
                      onClick={() => handleConnect(dev.email)}
                      className="px-3 py-2 md:px-4 md:py-2 text-white rounded-xl text-xs md:text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden group/btn z-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600"
                    >
                      <span className="relative z-10 flex items-center">
                        Connect
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </span>
                    </button>
                  </div>

                  {/* SVG Decorative Elements */}
                  <svg className="absolute top-2 right-2 w-12 h-12 md:w-16 md:h-16 opacity-10" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id={`grad-${dev.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="50%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="25" fill={`url(#grad-${dev.id})`} className="animate-pulse" />
                    <circle cx="70" cy="30" r="10" fill="#6366F1" opacity="0.6" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 md:mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20 max-w-2xl mx-auto">
            <Award className="w-10 h-10 md:w-12 md:h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Join Our Innovation Journey</h3>
            <p className="text-sm md:text-base text-gray-600 mb-4">
              Interested in working with our team or have a project in mind?
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105">
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


export default DevSection;
