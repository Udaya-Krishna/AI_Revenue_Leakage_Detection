import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, RotateCcw } from 'lucide-react';
import { useGlobalTheme } from '../GlobalThemeContext';

const ChatBot = () => {
  const { isDark } = useGlobalTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Revenue Leak Hunter AI assistant. I can help you understand revenue leakage detection, billing discrepancies, and how our AI system works. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const startNewConversation = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your Revenue Leak Hunter AI assistant. I can help you understand revenue leakage detection, billing discrepancies, and how our AI system works. What would you like to know?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // System context for revenue leakage detection
  const systemContext = `You are a specialized AI assistant for "Revenue Leak Hunter AI", an AI-powered system for revenue leakage detection. 

  Your expertise covers:
  - Revenue leakage detection and prevention
  - Billing workflow analysis
  - Service provisioning discrepancies
  - Usage log analysis and contract verification
  - Common billing errors like missing charges, incorrect rates, usage mismatches, duplicate entries
  - AI-powered billing accuracy improvements
  - Root cause analysis of billing discrepancies
  - Automated investigation ticket creation
  - Real-time revenue recovery processes

  Always provide responses related to revenue leakage, billing accuracy, and how AI can help detect and prevent revenue loss. Be professional, helpful, and focus on practical solutions for businesses dealing with billing complexities.

  If asked about unrelated topics, politely redirect the conversation back to revenue leakage detection and billing optimization.`;

  const callOpenAI = async (userMessage, conversationHistory) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemContext },
            ...conversationHistory.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            { role: 'user', content: userMessage }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) throw new Error('OpenAI API failed');
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      throw new Error(`OpenAI failed: ${error.message}`);
    }
  };

  const callGemini = async (userMessage, conversationHistory) => {
    try {
      const conversationText = conversationHistory
        .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
        .join('\n');
      
      const prompt = `${systemContext}\n\nConversation History:\n${conversationText}\n\nUser: ${userMessage}\n\nAssistant:`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        })
      });

      if (!response.ok) throw new Error('Gemini API failed');
      
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      throw new Error(`Gemini failed: ${error.message}`);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.slice(-10); // Last 10 messages for context
      let botResponse;

      // Try OpenAI first, fallback to Gemini
      try {
        botResponse = await callOpenAI(inputMessage, conversationHistory);
      } catch (openAIError) {
        console.log('OpenAI failed, trying Gemini...', openAIError.message);
        botResponse = await callGemini(inputMessage, conversationHistory);
      }

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Both APIs failed:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I'm experiencing technical difficulties. However, I can tell you that Revenue Leak Hunter AI helps identify billing discrepancies like missing charges, incorrect rates, and usage mismatches in real-time. Please try again in a moment or contact our support team.",
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

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Theme configuration
  const themeConfig = {
    // Chat button
    chatButton: isDark 
      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-cyan-500/25'
      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-500/25',
    
    // Chat window
    windowBg: isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white',
    
    // Header
    headerBg: isDark 
      ? 'bg-gradient-to-r from-cyan-600/90 to-blue-600/90 backdrop-blur-md'
      : 'bg-gradient-to-r from-blue-600 to-purple-600',
    
    // Messages area
    messagesBg: isDark ? 'bg-gray-800/50' : 'bg-gray-50/50',
    
    // User message
    userMessage: isDark 
      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
    
    // Bot message
    botMessage: isDark 
      ? 'bg-gray-700/80 text-gray-100 border border-gray-600'
      : 'bg-white text-gray-900 shadow-sm border border-gray-200',
    
    // Input area
    inputBg: isDark ? 'bg-gray-800/80 backdrop-blur-sm border-t border-gray-700' : 'bg-white/80 backdrop-blur-sm border-t border-gray-200',
    inputField: isDark 
      ? 'bg-gray-700/60 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/30'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/30',
    
    // Buttons
    sendButton: isDark
      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600'
      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400',
    
    headerButton: isDark
      ? 'hover:bg-white/10 text-white/80 hover:text-white'
      : 'hover:bg-white/20 text-white/80 hover:text-white',
    
    // Text colors
    primaryText: isDark ? 'text-gray-100' : 'text-gray-900',
    secondaryText: isDark ? 'text-gray-300' : 'text-gray-600',
    mutedText: isDark ? 'text-gray-400' : 'text-gray-500',
    
    // Tooltip
    tooltip: isDark 
      ? 'bg-gray-800 text-gray-100 border border-gray-700'
      : 'bg-gray-900 text-white',
    
    // Loading dots
    loadingDots: isDark ? 'bg-gray-500' : 'bg-gray-400',
    
    // Avatar backgrounds
    userAvatar: isDark 
      ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
      : 'bg-gradient-to-r from-blue-600 to-purple-600',
    botAvatar: isDark 
      ? 'bg-gradient-to-r from-purple-500 to-cyan-500'
      : 'bg-gradient-to-r from-purple-500 to-blue-500'
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 ${themeConfig.chatButton} text-white rounded-full p-4 hover:shadow-xl transition-all duration-300 z-50 group opacity-90 hover:opacity-100`}
        >
          <MessageCircle size={24} />
          <div className="absolute -top-2 -left-2 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <div className={`absolute bottom-full right-0 mb-2 px-3 py-1 ${themeConfig.tooltip} text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap`}>
            Chat with Revenue Leak Hunter AI
          </div>
        </button>
      )}      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-20 right-6 ${themeConfig.windowBg} rounded-2xl shadow-2xl z-50 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 max-h-[80vh] h-[600px]'
        }`}>
          {/* Header */}
          <div className={`${themeConfig.headerBg} text-white p-4 rounded-t-2xl flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Revenue Leak Hunter AI</h3>
                <p className="text-xs opacity-90">AI Revenue Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={startNewConversation}
                className={`p-2 ${themeConfig.headerButton} rounded-lg transition-all duration-200`}
                title="Start New Conversation"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className={`p-2 ${themeConfig.headerButton} rounded-lg transition-all duration-200`}
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 ${themeConfig.headerButton} rounded-lg transition-all duration-200`}
                title="Close Chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${themeConfig.messagesBg}`} style={{ height: 'calc(100% - 140px)' }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-3 max-w-[85%] ${
                      message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                        message.sender === 'user' ? themeConfig.userAvatar : themeConfig.botAvatar
                      }`}>
                        {message.sender === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                      </div>
                      <div className={`rounded-2xl p-4 backdrop-blur-sm ${
                        message.sender === 'user'
                          ? `${themeConfig.userMessage} rounded-br-lg`
                          : `${themeConfig.botMessage} rounded-bl-lg`
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                        <p className={`text-xs mt-2 opacity-70`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3 max-w-[85%]">
                      <div className={`w-8 h-8 rounded-xl ${themeConfig.botAvatar} flex items-center justify-center shadow-sm`}>
                        <Bot size={16} className="text-white" />
                      </div>
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

              {/* Input */}
              <div className={`p-4 ${themeConfig.inputBg}`}>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about revenue leakage detection..."
                      className={`w-full px-4 py-3 ${themeConfig.inputField} rounded-xl focus:outline-none focus:ring-2 resize-none transition-all duration-200`}
                      rows="2"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className={`${themeConfig.sendButton} text-white p-3 rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl`}
                  >
                    <Send size={20} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className={`text-xs ${themeConfig.mutedText}`}>
                    Powered by Revenue Leak Hunter AI
                  </p>
                  <p className={`text-xs ${themeConfig.mutedText}`}>
                    Press Enter to send
                  </p>
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