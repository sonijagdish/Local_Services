import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, User, Zap, MoreHorizontal, RotateCcw } from 'lucide-react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const SupportChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        { id: 'initial-1', text: "Welcome to LocalService AI support node. How can I assist you with your booking or profile today?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isTyping, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        const userText = input.trim();
        if (!userText) return;

        // 1. Add User Message
        const userMsgId = `user-${Date.now()}`;
        const newUserMsg = { id: userMsgId, text: userText, isBot: false };
        setMessages(prev => [...prev, newUserMsg]);
        setInput("");
        setIsTyping(true);

        try {
            // 2. Call AI Backend
            const { data } = await API.post('/ai/chat', { 
                message: userText,
                history: messages.slice(-10) // Send last 10 messages for context
            });

            setMessages(prev => [...prev, { 
                id: `bot-${Date.now()}`, 
                text: data.response, 
                isBot: true 
            }]);
        } catch (error) {
            console.error("AI Node Error:", error);
            toast.error("Failed to connect to AI logic node.");
            setMessages(prev => [...prev, { 
                id: `bot-err-${Date.now()}`, 
                text: "My neural link is currently unstable. Please try again or use our standard support channels.", 
                isBot: true 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const clearChat = () => {
        setMessages([
            { id: 'initial-1', text: "Chat history puraged. Memory node reset. How can I assist you now?", isBot: true }
        ]);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[9999] font-sans">
            {/* Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-2xl transition-all duration-500 flex items-center justify-center border-4 border-white dark:border-gray-800 ${
                    isOpen 
                    ? 'bg-red-500 rotate-90 scale-90' 
                    : 'bg-blue-600 hover:scale-110 shadow-blue-500/30'
                }`}
            >
                {isOpen ? <X className="text-white" size={24} /> : <MessageSquare className="text-white" size={24} />}
                {!isOpen && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-96 max-w-[90vw] h-[550px] bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-[0_30px_90px_-15px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500">
                    
                    {/* Header */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 flex items-center justify-between text-white relative">
                         <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                             <Zap size={80} />
                         </div>
                         <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                                <Bot size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black tracking-tight leading-none mb-1 uppercase italic">ServiceAI</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] uppercase font-black tracking-widest text-white/60">Logic Node Online</span>
                                </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                            <button onClick={clearChat} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white" title="Reset Memory">
                                <RotateCcw size={18} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                         </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-gray-50/50 dark:bg-gray-950/50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-4 duration-300`}>
                                <div className={`flex gap-3 max-w-[85%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border ${
                                        msg.isBot ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500'
                                    }`}>
                                        {msg.isBot ? <Bot size={14} /> : <User size={14} />}
                                    </div>
                                    <div className={`p-4 rounded-[1.5rem] text-sm font-medium shadow-sm leading-relaxed ${
                                        msg.isBot 
                                        ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-50 dark:border-gray-700' 
                                        : 'bg-blue-600 text-white rounded-tr-none'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {isTyping && (
                            <div className="flex justify-start animate-pulse">
                                <div className="flex gap-3 items-center bg-white dark:bg-gray-800 p-4 rounded-[1.5rem] rounded-tl-none border border-gray-50 dark:border-gray-700">
                                    <MoreHorizontal className="text-blue-500 animate-bounce" size={20} />
                                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Processing Node...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
                        <input 
                            type="text" 
                            placeholder="Type protocol request..." 
                            className="flex-1 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 dark:text-white"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            disabled={isTyping}
                            className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default SupportChatbot;
