
import React, { useState, useRef, useEffect } from 'react';

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<string[]>([
    'AuraOS Nexus v2.4.0 (x86_64-linux-gnu)',
    'Welcome to the Aria Nexus Control Interface.',
    'System established at 0x7F-Nexus-A1.',
    '',
    'Type `help` to see available commands.',
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const addLines = (lines: string[]) => {
    setHistory(prev => [...prev, ...lines]);
  };

  const simulateBuild = async () => {
    setIsProcessing(true);
    addLines(['aura@nexus:~$ nexus-build', '> Starting Nexus Build Process...', '> Initializing Gradle 8.5 Daemon...']);
    
    const steps = [
      '> [TASK] :core:compileJava [75%]',
      '> [TASK] :nexus-api:processResources [OK]',
      '> [TASK] :aura-os:linkBinary [100%]',
      'BUILD SUCCESSFUL in 4s',
      'Artifact located at: /build/libs/aura-nexus-all.jar'
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 600));
      addLines([step]);
    }
    setIsProcessing(false);
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'nexus-build') {
      setInput('');
      await simulateBuild();
      return;
    }

    let response: string[] = [];

    switch (cmd) {
      case 'help':
        response = ['Available commands:', '  help           - Show this menu', '  clear          - Flush console', '  sysinfo        - Nexus Hardware info', '  gradle -v      - Check Build Engine', '  nexus-build    - Execute system compilation', '  env-sync       - Sincronizar variables con el Kernel'];
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'sysinfo':
        response = ['OS: AuraOS Nexus v2.4', 'Kernel: Aria-Nexus-Core-5.15', 'Uptime: Sincronizada con el Pulsar Central', 'Memory: Quantum-ECC Enabled'];
        break;
      case 'env-sync':
        response = ['> Inyectando JAVA_HOME en el Kernel...', '> Sincronizando GRADLE_HOME...', '> Registrando variables de entorno de Aura...', 'SYNC COMPLETE [0x0]'];
        break;
      default:
        response = [`Command not found: ${cmd}`];
    }

    setHistory(prev => [...prev, `aura@nexus:~$ ${input}`, ...response]);
    setInput('');
  };

  return (
    <div className="glass rounded-[2.5rem] border border-white/5 flex flex-col h-[calc(100vh-280px)] overflow-hidden font-mono shadow-2xl relative">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-violet-500/5 to-transparent opacity-50" />
      
      <div className="bg-slate-900/80 px-6 py-4 border-b border-white/5 flex items-center justify-between z-10 backdrop-blur-md">
        <div className="flex gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-rose-500/40 border border-rose-500/20" />
          <div className="w-3.5 h-3.5 rounded-full bg-amber-500/40 border border-amber-500/20" />
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/40 border border-emerald-500/20" />
        </div>
        <div className="flex items-center gap-3">
           <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
           <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Aura Shell // {isProcessing ? 'BUSY' : 'READY'}</span>
        </div>
        <div className="w-12" />
      </div>
      
      <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto text-sm space-y-1.5 text-slate-300 relative z-10 scrollbar-hide">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed animate-in fade-in slide-in-from-left duration-300">
            {line.startsWith('aura@nexus') ? (
               <span className="text-cyan-400 font-bold">{line}</span>
            ) : line.includes('SUCCESSFUL') ? (
               <span className="text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">{line}</span>
            ) : line.includes('Command not found') || line.includes('ERROR') ? (
               <span className="text-rose-400">{line}</span>
            ) : line.startsWith('>') ? (
               <span className="text-violet-400 italic opacity-90">{line}</span>
            ) : (
               line
            )}
          </div>
        ))}
        
        {!isProcessing && (
          <form onSubmit={handleCommand} className="flex items-center pt-4 group">
            <span className="text-cyan-400 font-bold mr-3 shrink-0 group-hover:animate-pulse">aura@nexus:~$</span>
            <input
              autoFocus
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:text-slate-700"
              spellCheck={false}
              placeholder="Enter nexus command..."
            />
          </form>
        )}
      </div>
    </div>
  );
};
