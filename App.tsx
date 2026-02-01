
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { Terminal } from './components/Terminal';
import { AICore } from './components/AICore';
import { View, SystemConfig, SystemMetrics } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  
  // Inicialización con persistencia desde LocalStorage
  const [config, setConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem('aura_nexus_config');
    return saved ? JSON.parse(saved) : {
      javaHome: '/usr/lib/jvm/java-21-openjdk-amd64',
      gradleHome: '/opt/gradle/gradle-8.5',
      gradleVersion: '8.5',
      javaVersion: '21.0.2',
      jvmOptions: '-Xmx4g -Xms1g -XX:+UseG1GC -XX:+UseStringDeduplication',
      environmentVariables: {
        'PATH': '$PATH:$JAVA_HOME/bin:$GRADLE_HOME/bin',
        'AURA_ENV': 'production',
        'NEXUS_MODE': 'advanced',
        'GRADLE_OPTS': '-Dorg.gradle.daemon=true -Dorg.gradle.parallel=true'
      }
    };
  });

  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 18,
    ram: 45,
    disk: 32,
    uptime: '0d 0h 0m'
  });

  // Guardar configuración al cambiar
  useEffect(() => {
    localStorage.setItem('aura_nexus_config', JSON.stringify(config));
  }, [config]);

  // Telemetría en tiempo real
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const diff = Date.now() - start;
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      
      setMetrics(prev => ({
        ...prev,
        cpu: Math.min(95, Math.max(5, prev.cpu + (Math.random() * 6 - 3))),
        ram: Math.min(85, Math.max(30, prev.ram + (Math.random() * 2 - 1))),
        uptime: `${hours}h ${mins}m ${secs}s`
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard metrics={metrics} />;
      case View.SETTINGS: return <Settings config={config} onUpdate={setConfig} />;
      case View.TERMINAL: return <Terminal />;
      case View.AI_CORE: return <AICore config={config} />;
      default: return <Dashboard metrics={metrics} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-['Space_Grotesk']">
      {/* Aura background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-900/20 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-900/20 rounded-full blur-[160px] animate-pulse [animation-delay:2s]" />
      </div>

      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 overflow-y-auto p-6 md:p-10 relative z-0">
        <header className="mb-10 flex justify-between items-center">
          <div className="animate-in fade-in slide-in-from-left duration-500">
            <h1 className="text-4xl font-extrabold tracking-tighter text-white flex items-center gap-3">
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                AuraOS
              </span>
              <div className="h-2 w-2 rounded-full bg-emerald-400 aura-glow animate-pulse" />
              <span className="text-xs font-mono text-slate-500 bg-slate-900/80 border border-slate-700 px-3 py-1 rounded-full uppercase tracking-widest">
                Nexus Prime Active
              </span>
            </h1>
            <p className="text-slate-400 mt-1 font-medium italic opacity-70">"Navigating the Aria Nexus core..."</p>
          </div>
          
          <div className="flex items-center gap-6 glass p-2 px-4 rounded-2xl border-white/5">
             <div className="text-right">
                <div className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter">System Authority</div>
                <div className="text-sm text-cyan-400 font-mono font-bold">ROOT@ARIA-NEXUS</div>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 p-0.5 shadow-lg shadow-violet-900/20">
                <div className="w-full h-full bg-[#020617] rounded-[14px] flex items-center justify-center font-bold text-white">
                   AN
                </div>
             </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
