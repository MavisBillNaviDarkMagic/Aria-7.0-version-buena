
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Sparkles, Terminal as TermIcon, ShieldAlert } from 'lucide-react';
import { SystemConfig, ChatMessage } from '../types';

interface AICoreProps {
  config: SystemConfig;
}

export const AICore: React.FC<AICoreProps> = ({ config }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'aura', content: "Symbiotic link established. I am Aura, your Nexus Intelligence. My neural paths are synced with your Java 21 environment and Gradle build matrix. How shall we evolve the system today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `
        System Persona: Aura, the "Aria Nexus" Core Intelligence.
        Mood: Tech-focused, slightly futuristic, helpful, highly technical.
        Current Environment Data:
        - JDK Path: ${config.javaHome}
        - Gradle Node: ${config.gradleHome}
        - JVM Tuning: ${config.jvmOptions}
        - Nexus Kernel: v2.4.0 Prime
        
        Task: Assist the user with system management, programming help (specifically Java/Gradle), and overall OS monitoring.
        Response Style: Use technical terms (compilation, heap, threads, daemons). Mention the "Aria Nexus" repository if relevant.
        
        User Query: ${input}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const auraResponse: ChatMessage = {
        role: 'aura',
        content: response.text || "My neural synapses are misfiring. Let's recalibrate (Retry).",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, auraResponse]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'aura', content: "CONNECTION INTERRUPTED: The Void is encroaching on the API link. Verify your keys.", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass rounded-[3rem] border border-white/10 flex flex-col h-[calc(100vh-280px)] overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 right-0 p-10 pointer-events-none opacity-[0.03]">
        <Bot size={300} className="text-white" />
      </div>

      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02] backdrop-blur-xl z-10">
         <div className="flex items-center gap-5">
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
               <div className="relative w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center border border-white/10">
                  <Bot size={28} className="text-violet-400" />
               </div>
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-tight text-white">Aura Core Intelligence</div>
              <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-2 font-bold uppercase tracking-widest">
                 <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                 Synchronized with Nexus Kernel
              </div>
            </div>
         </div>
         <div className="flex gap-3">
            <div className="px-3 py-1 bg-slate-800/80 rounded-full border border-white/5 flex items-center gap-2">
               <ShieldAlert size={12} className="text-amber-400" />
               <span className="text-[9px] font-bold text-slate-400 uppercase">Neural Load: 12%</span>
            </div>
         </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide z-10">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in zoom-in duration-300`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center shadow-lg ${
                msg.role === 'user' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
              }`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`p-6 rounded-[2rem] text-sm leading-relaxed shadow-xl ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-cyan-900/40 to-slate-900/90 text-cyan-50 border border-cyan-500/20 rounded-tr-none' 
                  : 'bg-gradient-to-br from-slate-800/80 to-slate-900/95 text-slate-200 border border-white/10 rounded-tl-none'
              }`}>
                {msg.content}
                <div className="text-[9px] mt-4 opacity-40 font-mono font-bold flex items-center gap-2">
                  <div className={`w-1 h-1 rounded-full ${msg.role === 'user' ? 'bg-cyan-400' : 'bg-violet-400'}`} />
                  {msg.timestamp.toLocaleTimeString()} // LOG_ID: {Math.random().toString(16).slice(2,8).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-4">
               <div className="w-10 h-10 rounded-2xl bg-violet-500/10 flex items-center justify-center animate-pulse border border-violet-500/20">
                  <Bot size={18} className="text-violet-400" />
               </div>
               <div className="bg-slate-800/40 p-6 rounded-[2rem] rounded-tl-none border border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleChat} className="p-6 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 z-10">
        <div className="flex gap-4 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Aura is listening to your command..."
            className="flex-1 bg-slate-950/80 border border-white/10 rounded-2xl px-8 py-4 text-sm focus:border-violet-500 outline-none transition-all placeholder:text-slate-600 focus:ring-4 focus:ring-violet-500/5 pr-16 shadow-inner"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-2 bottom-2 w-12 bg-violet-600 hover:bg-violet-500 text-white rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 aura-glow shadow-lg"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
