import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, RotateCcw } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- CONFIGURATION ---

// ⚠️ IMPORTANT SECURITY WARNING ⚠️
// This approach is for development and prototyping ONLY. Exposing API keys in client-side
// code is insecure. For production, you MUST use a backend proxy to make API calls securely.

// Standardize on Vite's `import.meta.env` for all client-side environment variables.
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;

// The comprehensive system context is crucial for high-quality AI responses.
const systemContext = `You are a specialized AI assistant for "Revenue Leak Hunter AI", an advanced Business Intelligence platform for financial anomaly detection and revenue leakage prevention. Your sole purpose is to answer questions based on the context provided about this platform. You must ONLY answer questions related to revenue leakage detection, billing discrepancies, financial anomaly detection, and related BI topics. If asked about unrelated topics, you must politely decline and redirect the conversation back to the platform's purpose. Be professional, helpful, and concise, using formatting like lists or bold text to improve readability.

PLATFORM OVERVIEW:
Revenue Leak Hunter AI is a comprehensive BI platform that uses advanced AI/ML algorithms to detect financial anomalies and prevent revenue leakage across various industries including telecommunications, retail/supermarket, and subscription-based businesses.

CORE CAPABILITIES:
- Advanced anomaly detection using hybrid AI models (XGBoost classifier + Rules-based validation engine)
- Real-time billing validation and revenue assurance
- Automated report generation with AI-powered executive summaries
- Enterprise-grade security, scalability, and performance optimization

TECHNICAL ARCHITECTURE:
- Frontend: React 18, Vite, Tailwind CSS, Chart.js
- Backend: Python Flask, Pandas, NumPy, Scikit-learn
- ML Models: XGBoost, Google Generative AI SDK (Gemini) for summaries
- Infrastructure: Docker, Kubernetes

ANOMALY DETECTION TYPES:
Missing Charges, Incorrect Rates, Duplicate Entries, Usage Mismatches, Payment Issues, Post-deactivation Billing, Promotional Logic Errors.

INDUSTRY SOLUTIONS:
- Supermarket/Retail: POS transaction validation, promotional logic verification, tax compliance.
- Telecommunications: Billing intelligence for complex rate plans, roaming charge validation.

BUSINESS VALUE PROPOSITION:
- Recover 2-8% of annual revenue.
- Reduce manual audit costs by 70-90%.
- Achieve positive ROI within 3-6 months.`;

// The comprehensive keyword list provides a better gate for query relevance.
const domainKeywords = [
    'about', 'accuracy', 'actions', 'advantages', 'ai', 'algorithms', 'analysis', 'analytics', 'anomalies',
    'anomaly', 'api', 'application', 'architecture', 'assurance', 'audit', 'automate', 'automation', 'backend',
    'benefits', 'bi', 'billing', 'business', 'capabilities', 'case', 'cdr', 'charge', 'charges', 'compliance',
    'confidence', 'cost', 'csv', 'customer', 'data', 'database', 'dashboard', 'detect', 'detection', 'discounts',
    'discrepancies', 'docker', 'docx', 'download', 'duplicate', 'efficiency', 'enterprise-grade', 'error',
    'errors', 'etl', 'explain', 'export', 'feature', 'features', 'financial', 'find', 'flask', 'frontend',
    'functionality', 'gemini', 'generate', 'help', 'how', 'hunter', 'impact', 'implement', 'incorrect', 'industry',
    'insights', 'integration', 'intelligence', 'interactive', 'interface', 'invoice', 'invoices', 'issues',
    'kubernetes', 'leak', 'leakage', 'machine learning', 'manual', 'mismatch', 'ml', 'model', 'money', 'monitoring',
    'openai', 'operations', 'optimize', 'pandas', 'pattern', 'payment', 'pdf', 'performance', 'platform', 'pos',
    'prevent', 'prevention', 'price', 'pricing', 'process', 'product', 'profit', 'promotional', 'purpose', 'python',
    'rate', 'react', 'real-time', 'reconciliation', 'recover', 'reduce', 'report', 'reporting', 'reports', 'results',
    'retail', 'revenue', 'risk', 'roaming', 'roi', 'rules', 'scalability', 'score', 'scoring', 'security', 'service',
    'solution', 'stack', 'subscription', 'summary', 'supermarket', 'support', 'system', 'tax', 'tech', 'technical',
    'technology', 'telecom', 'telecommunications', 'tell me', 'transaction', 'transactions', 'trial', 'upload',
    'usage', 'use case', 'user', 'validation', 'value', 'versus', 'visualization', 'what', 'why', 'workflow', 'xgboost'
];


const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your Revenue Leak Hunter AI assistant. Ask me anything about our platform, billing analysis, or revenue leakage detection.",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    
    // Use a ref to hold the initialized Gemini chat model for conversation history.
    const chatModelRef = useRef(null);
    const genAIRef = useRef(null);

    // Initialize the Gemini chat model once.
    useEffect(() => {
        if (geminiApiKey && !chatModelRef.current) {
            try {
                genAIRef.current = new GoogleGenerativeAI(geminiApiKey);
                const model = genAIRef.current.getGenerativeModel({
                    model: "gemini-1.5-flash",
                    systemInstruction: systemContext,
                });
                chatModelRef.current = model.startChat({ history: [] });
                console.log("Gemini chat model initialized.");
            } catch (error) {
                console.error("Failed to initialize Gemini AI:", error);
            }
        }
    }, []);

    const startNewConversation = () => {
        // Re-initialize Gemini chat history for a new conversation
        if (genAIRef.current) {
            const model = genAIRef.current.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: systemContext,
            });
            chatModelRef.current = model.startChat({ history: [] });
        }
        setMessages([
            {
                id: 1,
                text: "Conversation reset. How can I assist you with revenue leakage detection?",
                sender: 'bot',
                timestamp: new Date()
            }
        ]);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const isRelevantQuestion = (userMessage) => {
        const message = userMessage.toLowerCase();
        return domainKeywords.some(keyword => message.includes(keyword));
    };

    // A single function to try OpenAI (stateless) then Gemini (stateful).
    const getAIResponse = async (userMessage) => {
        // 1. Try OpenAI first (if key is available)
        if (openAIApiKey) {
            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${openAIApiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            { role: 'system', content: systemContext },
                            { role: 'user', content: userMessage }
                        ],
                        max_tokens: 500,
                        temperature: 0.7,
                    }),
                });
                if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
                const data = await response.json();
                return data.choices[0].message.content;
            } catch (error) {
                console.warn("OpenAI API call failed, falling back to Gemini:", error.message);
            }
        }

        // 2. Fallback to Gemini (if key and model are available)
        if (chatModelRef.current) {
            try {
                const result = await chatModelRef.current.sendMessage(userMessage);
                return result.response.text();
            } catch (error) {
                console.warn("Gemini API call failed:", error.message);
            }
        }

        // 3. Return null if all APIs fail or are not configured
        return null;
    };

    // The comprehensive, intelligent fallback system ensures the bot is always helpful.
    const generateIntelligentFallback = (userMessage) => {
        const msg = userMessage.toLowerCase();
        if (msg.includes('architecture') || msg.includes('tech stack') || msg.includes('how it works')) {
            return "Our platform uses a hybrid AI architecture. The tech stack includes a **React 18** frontend, a **Python Flask** backend with **Pandas** for data processing, and an **XGBoost** model for anomaly detection, all deployed via **Docker and Kubernetes** for scalability.";
        }
        if (msg.includes('anomaly') || msg.includes('detect') || msg.includes('leakage')) {
            return "We detect several key types of revenue leakage:\n• **Missing Charges:** Services rendered but not billed.\n• **Incorrect Rates:** Wrong pricing or tax calculations.\n• **Duplicate Entries:** Double-billing errors.\n• **Usage Mismatches:** Discrepancies between usage and billing.\n• **Post-deactivation Billing:** Charges after service cancellation.";
        }
        if (msg.includes('roi') || msg.includes('value') || msg.includes('benefit')) {
            return "Clients typically recover **2-8% of annual revenue**, reduce manual audit costs by over **70%**, and achieve a positive **Return on Investment (ROI)** within 3-6 months by automating the detection of costly billing errors.";
        }
        // A generic but helpful default fallback
        return `I can help with questions about our Revenue Leak Hunter AI platform. For example, you can ask about its technical architecture, the types of anomalies it detects, or its business value. What would you like to know?`;
    };

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessageText = inputMessage;
        const userMessage = {
            id: Date.now(),
            text: userMessageText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            let botResponseText;

            if (!isRelevantQuestion(userMessageText)) {
                botResponseText = "I am a specialized assistant for Revenue Leak Hunter AI and can only answer questions about revenue leakage, billing analysis, and our platform's features. Please ask a relevant question.";
            } else {
                const aiResponse = await getAIResponse(userMessageText);

                if (aiResponse) {
                    botResponseText = aiResponse;
                } else {
                    console.log("All APIs failed or are not configured. Using intelligent fallback.");
                    botResponseText = generateIntelligentFallback(userMessageText);
                }
            }
            
            const botMessage = {
                id: Date.now() + 1,
                text: botResponseText,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Error processing message:", error);
            const errorMessage = {
                id: Date.now() + 1,
                text: "Sorry, I'm having a technical issue right now. Please try again in a moment.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // UI/Theme configuration (no changes needed)
    const themeConfig = {
        chatButton: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-cyan-500/25',
        windowBg: 'bg-gray-900 border border-gray-700',
        headerBg: 'bg-gradient-to-r from-cyan-600/90 to-blue-600/90 backdrop-blur-md',
        messagesBg: 'bg-gray-800/50',
        userMessage: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white',
        botMessage: 'bg-gray-700/80 text-gray-100 border border-gray-600',
        inputBg: 'bg-gray-800/80 backdrop-blur-sm border-t border-gray-700',
        inputField: 'bg-gray-700/60 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/30',
        sendButton: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600',
        headerButton: 'hover:bg-white/10 text-white/80 hover:text-white',
        tooltip: 'bg-gray-800 text-gray-100 border border-gray-700',
        loadingDots: 'bg-gray-500',
        userAvatar: 'bg-gradient-to-r from-cyan-500 to-blue-500',
        botAvatar: 'bg-gradient-to-r from-purple-500 to-cyan-500'
    };

    return (
        <>
            {!isOpen && (
                <button onClick={() => setIsOpen(true)} className={`fixed bottom-6 right-6 ${themeConfig.chatButton} text-white rounded-full p-4 hover:shadow-xl transition-all duration-300 z-50 group opacity-90 hover:opacity-100`}>
                    <MessageCircle size={24} />
                    <div className="absolute -top-2 -left-2 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <div className={`absolute bottom-full right-0 mb-2 px-3 py-1 ${themeConfig.tooltip} text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap`}>
                        Chat with an AI Expert
                    </div>
                </button>
            )}

            {isOpen && (
                <div className={`fixed bottom-20 right-6 ${themeConfig.windowBg} rounded-2xl shadow-2xl z-50 transition-all duration-300 flex flex-col ${isMinimized ? 'w-80 h-16' : 'w-96 max-h-[80vh] h-[600px]'}`}>
                    <div className={`${themeConfig.headerBg} text-white p-4 rounded-t-2xl flex items-center justify-between flex-shrink-0`}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg"><Bot size={18} /></div>
                            <div>
                                <h3 className="font-bold text-sm">Revenue Leak Hunter AI</h3>
                                <p className="text-xs opacity-90">AI Revenue Assistant</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={startNewConversation} className={`p-2 ${themeConfig.headerButton} rounded-lg`} title="New Conversation"><RotateCcw size={16} /></button>
                            <button onClick={() => setIsMinimized(!isMinimized)} className={`p-2 ${themeConfig.headerButton} rounded-lg`} title={isMinimized ? "Expand" : "Minimize"}>{isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}</button>
                            <button onClick={() => setIsOpen(false)} className={`p-2 ${themeConfig.headerButton} rounded-lg`} title="Close Chat"><X size={16} /></button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            <div className={`flex-grow overflow-y-auto p-4 space-y-4 ${themeConfig.messagesBg}`}>
                                {messages.map((message) => (
                                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex items-start gap-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${message.sender === 'user' ? themeConfig.userAvatar : themeConfig.botAvatar}`}>{message.sender === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}</div>
                                            <div className={`rounded-2xl p-4 backdrop-blur-sm ${message.sender === 'user' ? `${themeConfig.userMessage} rounded-br-lg` : `${themeConfig.botMessage} rounded-bl-lg`}`}>
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                                                <p className={`text-xs mt-2 opacity-70`}>{formatTime(message.timestamp)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="flex items-start gap-3 max-w-[85%]">
                                            <div className={`w-8 h-8 rounded-xl ${themeConfig.botAvatar} flex items-center justify-center shadow-sm`}><Bot size={16} className="text-white" /></div>
                                            <div className={`${themeConfig.botMessage} rounded-2xl rounded-bl-lg p-4`}>
                                                <div className="flex space-x-2">
                                                    <div className={`w-2 h-2 ${themeConfig.loadingDots} rounded-full animate-bounce`}></div>
                                                    <div className={`w-2 h-2 ${themeConfig.loadingDots} rounded-full animate-bounce`} style={{animationDelay: '0.1s'}}></div>
                                                    <div className={`w-2 h-2 ${themeConfig.loadingDots} rounded-full animate-bounce`} style={{animationDelay: '0.2s'}}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className={`p-4 ${themeConfig.inputBg} flex-shrink-0`}>
                                <div className="flex items-end gap-3">
                                    <div className="flex-1">
                                        <textarea value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask about revenue leakage..." className={`w-full px-4 py-3 ${themeConfig.inputField} rounded-xl focus:outline-none focus:ring-2 resize-none`} rows="2" disabled={isLoading} />
                                    </div>
                                    <button onClick={sendMessage} disabled={!inputMessage.trim() || isLoading} className={`${themeConfig.sendButton} text-white p-3 rounded-xl transition-all duration-200 disabled:cursor-not-allowed`}><Send size={20} /></button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default ChatBot;