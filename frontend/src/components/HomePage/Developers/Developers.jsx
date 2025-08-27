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
      image: "/api/placeholder/150/150",
      email: "godwin.wilfred@revenueguard.ai",
      bio: "AI specialist with expertise in revenue leakage detection algorithms and scalable ML systems.",
      skills: ["Machine Learning", "Python", "TensorFlow", "System Design", "Data Engineering"],
      experience: "5+ years",
      projects: "12+ AI projects",
      icon: Brain,
      gradient: "from-purple-500 to-indigo-600",
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
      image: "/api/placeholder/150/150",
      email: "pooja.shree@revenueguard.ai",
      bio: "Creative frontend engineer specializing in intuitive dashboards and data visualization interfaces.",
      skills: ["React", "TypeScript", "UI/UX Design", "Data Visualization", "Tailwind CSS"],
      experience: "4+ years",
      projects: "15+ UI projects",
      icon: Code,
      gradient: "from-pink-500 to-rose-600",
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
      image: "/api/placeholder/150/150", 
      email: "ragul.kb@revenueguard.ai",
      bio: "Backend architect focused on high-performance data processing and real-time analytics systems.",
      skills: ["Node.js", "Python", "PostgreSQL", "Redis", "Microservices", "Docker"],
      experience: "4+ years",
      projects: "10+ backend systems",
      icon: Database,
      gradient: "from-emerald-500 to-teal-600",
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
      image: "/api/placeholder/150/150",
      email: "ashwin@revenueguard.ai", 
      bio: "DevOps expert ensuring scalable, secure, and reliable infrastructure for AI-powered systems.",
      skills: ["AWS", "Kubernetes", "Terraform", "CI/CD", "Security", "Monitoring"],
      experience: "3+ years",
      projects: "8+ infrastructure projects",
      icon: Shield,
      gradient: "from-orange-500 to-red-600",
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
      image: "/api/placeholder/150/150",
      email: "udaya.krishnan@revenueguard.ai",
      bio: "Versatile developer bridging frontend and backend systems with robust API integrations.",
      skills: ["Full-Stack Development", "REST APIs", "GraphQL", "React", "Node.js", "MongoDB"],
      experience: "3+ years", 
      projects: "12+ full-stack projects",
      icon: Zap,
      gradient: "from-blue-500 to-cyan-600",
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

        {/* Team Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              20+
            </div>
            <div className="text-gray-600 text-sm">Years Combined Experience</div>
          </div>
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              50+
            </div>
            <div className="text-gray-600 text-sm">Projects Delivered</div>
          </div>
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              99.2%
            </div>
            <div className="text-gray-600 text-sm">AI Accuracy Achieved</div>
          </div>
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <div className="text-gray-600 text-sm">System Reliability</div>
          </div>
        </div>

        {/* Developer Cards */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {developers.map((dev, index) => (
            <div
              key={dev.id}
              data-card-index={index}
              className={`group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:scale-105 cursor-pointer ${
                animatedCards.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredCard(dev.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Animated Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${dev.gradient} opacity-5 group-hover:opacity-10 transition-all duration-500`}></div>
              <div className={`absolute inset-0 bg-gradient-to-br ${dev.gradient} opacity-0 group-hover:opacity-5 blur-xl transition-all duration-500`}></div>
              
              {/* Card Content */}
              <div className="relative p-8">
                {/* Header with Icon and Image */}
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    {/* Profile Image */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                      <img 
                        src={dev.image} 
                        alt={dev.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {/* Role Icon */}
                    <div className={`absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r ${dev.gradient} rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all duration-300`}>
                      <dev.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  {/* Experience Badge */}
                  <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-gray-600">{dev.experience}</span>
                  </div>
                </div>

                {/* Name and Title */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:bg-clip-text transition-all duration-300">
                    {dev.name}
                  </h3>
                  <p className="text-sm font-semibold text-gray-700 mb-1">{dev.title}</p>
                  <p className="text-xs text-gray-500">{dev.specialization}</p>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">{dev.bio}</p>

                {/* Skills */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-1">
                    {dev.skills.slice(0, 4).map((skill, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-xs text-gray-600 rounded-lg border border-gray-200/50"
                      >
                        {skill}
                      </span>
                    ))}
                    {dev.skills.length > 4 && (
                      <span className="px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-xs text-blue-600 rounded-lg border border-blue-200/50">
                        +{dev.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="text-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200/50">
                    <div className="text-sm font-bold text-gray-900">{dev.projects}</div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                  <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200/50">
                    <div className="flex items-center justify-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">Excellence</div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    {dev.socialLinks.map((social, idx) => (
                      <a
                        key={idx}
                        href={social.url}
                        className={`w-8 h-8 bg-gradient-to-r ${dev.gradient} rounded-lg flex items-center justify-center text-white hover:shadow-lg transform hover:scale-110 transition-all duration-300`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <social.icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                  
                  {/* Connect Button */}
                  <button
                    onClick={() => handleConnect(dev.email)}
                    className={`px-4 py-2 bg-gradient-to-r ${dev.gradient} text-white rounded-xl text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center`}
                  >
                    Connect
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </button>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className={`absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:${dev.gradient} opacity-0 group-hover:opacity-30 transition-all duration-300`}></div>
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
    </section>
  );
};

export default DevelopersSection;