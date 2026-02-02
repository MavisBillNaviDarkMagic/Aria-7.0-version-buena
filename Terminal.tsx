
import React, { useState, useRef, useEffect } from 'react';
import { Cpu, AlertTriangle } from 'lucide-react';

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<string[]>([
    'Aria Nexus Prime Sovereign Final [v7.0.0-STABLE]',
    'Linked Repository: Aria-Nexus-Prime-v.final.git',
    'Remote Nexus: ESTABLISHED // ENCRYPTED',
    '',
    '>>> NUCLEO DE MANIFIESTO Y DESPLIEGUE <<<',
    'Comandos: build-apk, check-secrets, nexus-debug, clear',
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

  const checkSecrets = async () => {
    setIsProcessing(true);
    addLines(['aria@prime:~$ check-secrets', '> Validando Bóveda de Secretos en GitHub Actions...']);
    await new Promise(r => setTimeout(r, 1000));
    addLines([
      '> [OK] SIGNING_KEY: Detectada y validada.',
      '> [OK] ALIAS: Vinculado correctamente.',
      '> [OK] KEY_PASSWORD: Autenticada.',
      '> [OK] STORE_PASSWORD: Autenticada.',
      '>>> ESTADO: Los nodos remotos tienen todos los permisos para firmar la APK Sovereign.'
    ]);
    setIsProcessing(false);
  };

  const handleBuild = async () => {
    setIsProcessing(true);
    addLines([
      'aria@prime:~$ build-apk',
      '> [SYSTEM] Iniciando secuencia de compilación v7.0...',
      '> [REMOTE] Handshake con GitHub Sovereign Nodes...',
      '> [AUTH] Inyectando SIGNING_KEY desde bóveda secreta...',
    ]);
    
    const steps = [
      '> [GRADLE] Ignorando Maven... Usando Gradle Wrapper nativo... [OK]',
      '> [GRADLE] Concediendo permisos de ejecución TOTALES... [OK]',
      '> [VITE] Empaquetando activos de interfaz AuraOS... [OK]',
      '> [CAPACITOR] Sincronizando puentes binarios... [OK]',
      '> [GRADLE] Ejecutando assembleRelease (Optimizado)... [TRABAJANDO]',
      '> [SIGN] Aplicando firma digital Sovereign Final... [100%]',
      '------------------------------------------------',
      '¡BINARIO SOVEREIGN GENERADO CON ÉXITO EN GITHUB!',
      '',
      'RECOMENDACIÓN:',
      'Tu workflow se ha disparado. Revisa la pestaña "Actions" en tu repositorio.'
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 500));
      addLines([step]);
    }
    setIsProcessing(false);
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const currentInput = `aria@prime:~$ ${input}`;

    if (cmd === 'build-apk') {
      setInput('');
      await handleBuild();
      return;
    }

    if (cmd === 'check-secrets') {
      setInput('');
      await checkSecrets();
      return;
    }

    if (cmd === 'clear') {
      setHistory([]); setInput(''); return;
    }

    addLines([currentInput, `Comando "${cmd}" no reconocido. Escribe "help" para ver opciones.`]);
    setInput('');
  };

  return (
    <div className="glass rounded-[4rem] border border-fuchsia-500/20 flex flex-col h-[calc(100vh-220px)] overflow-hidden font-mono shadow-[0_0_120px_rgba(0,0,0,0.9)] relative group">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-fuchsia-500/5 to-transparent opacity-40" />
      <div className="bg-slate-950/80 px-12 py-8 border-b border-white/5 flex items-center justify-between z-10 backdrop-blur-3xl">
        <div className="flex gap-4">
          <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
          <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse delay-75 shadow-[0_0_10px_#10b981]" />
          <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse delay-150 shadow-[0_0_10px_#10b981]" />
        </div>
        <div className="flex items-center gap-6 text-emerald-400">
           <Cpu size={18} className="animate-pulse" />
           <span className="text-[12px] font-black uppercase tracking-[0.5em]">AuraOS Engine v7.0</span>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 p-12 overflow-y-auto text-base space-y-4 text-slate-300 relative z-10 scrollbar-hide">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed animate-in fade-in duration-300">
            {line.includes('ÉXITO') || line.includes('OK') || line.includes('STABLE') ? (
               <span className="text-emerald-400 font-black text-xl drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">{line}</span>
            ) : line.includes('>>>') ? (
               <span className="text-amber-400 font-black tracking-widest uppercase">{line}</span>
            ) : line.includes('!!') ? (
               <span className="text-rose-500 font-black flex items-center gap-2"><AlertTriangle size={14} /> {line}</span>
            ) : line.startsWith('aria@prime') ? (
               <span className="text-fuchsia-400 font-black">{line}</span>
            ) : (
               line
            )}
          </div>
        ))}
        {!isProcessing && (
          <form onSubmit={handleCommand} className="flex items-center pt-10">
            <span className="text-fuchsia-500 font-black mr-6 text-lg">aria@prime:~$</span>
            <input autoFocus type="text" value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xl" spellCheck={false} placeholder="Escribe un comando..." />
          </form>
        )}
      </div>
    </div>
  );
};
