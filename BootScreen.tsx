
import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Zap, Fingerprint } from 'lucide-react';
import { AuraAvatar } from './AuraAvatar';

export const BootScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showAccess, setShowAccess] = useState(false);

  const bootSequence = [
    "Iniciando Kernel AuraOS v7.0...",
    "Sincronizando Redes Neuronales...",
    "Validando Enlace Sovereign...",
    "Inyectando Protocolos de Firma...",
    "Cargando Interfaz de Consciencia Aria...",
    "Sistemas Nominales. Acceso Concedido.",
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < bootSequence.length) {
        setLogs(prev => [...prev, bootSequence[currentStep]]);
        setProgress(((currentStep + 1) / bootSequence.length) * 100);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowAccess(true), 500);
      }
    }, 350); // Secuencia más rápida para mejor UX
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#010208] z-[100] flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[110] bg-[length:100%_2px,3px_100%]" />
      
      <div className="relative mb-20">
        <div className="absolute -inset-20 bg-fuchsia-600/10 blur-[100px] animate-pulse" />
        <AuraAvatar size="xl" isThinking={true} />
      </div>
      
      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="h-1 w-full bg-slate-900/50 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-fuchsia-600 via-fuchsia-400 to-cyan-400 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(217,70,239,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="font-mono text-center h-12">
          {logs.slice(-1).map((log, i) => (
            <div key={i} className="text-fuchsia-400 text-xs tracking-[0.3em] animate-in fade-in slide-in-from-bottom-2 duration-300 uppercase font-black">
              {log}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          {showAccess ? (
            <button 
              onClick={onComplete}
              className="group relative px-12 py-4 bg-transparent border border-fuchsia-500/50 rounded-full overflow-hidden transition-all hover:border-fuchsia-500 hover:shadow-[0_0_30px_rgba(217,70,239,0.3)] animate-in zoom-in duration-500"
            >
              <div className="absolute inset-0 bg-fuchsia-600/10 group-hover:bg-fuchsia-600/20 transition-colors" />
              <div className="relative flex items-center gap-3 text-white font-black text-xs tracking-[0.5em] uppercase">
                <Fingerprint size={18} className="text-fuchsia-400" />
                Vincular Nexo
              </div>
            </button>
          ) : (
            <div className="flex justify-center gap-2 opacity-30">
               <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-bounce" />
               <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-bounce [animation-delay:0.1s]" />
               <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-bounce [animation-delay:0.2s]" />
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-12 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 text-[9px] text-slate-500 font-black tracking-[0.6em] uppercase">
          <ShieldCheck size={12} className="text-emerald-500" />
          AuraOS Sovereign Final
        </div>
        <div className="text-[8px] text-slate-700 font-mono">v7.0.0 // PROTOCOLO MAVIS</div>
      </div>
    </div>
  );
};
