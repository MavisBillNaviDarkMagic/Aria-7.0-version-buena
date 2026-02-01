
import React, { useState } from 'react';
import { Save, RefreshCw, Terminal as TermIcon, FileCode, Variable, Zap, ShieldCheck } from 'lucide-react';
import { SystemConfig } from '../types';

interface SettingsProps {
  config: SystemConfig;
  onUpdate: (config: SystemConfig) => void;
}

export const Settings: React.FC<SettingsProps> = ({ config, onUpdate }) => {
  const [localConfig, setLocalConfig] = useState(config);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSave = () => {
    setIsSyncing(true);
    setTimeout(() => {
      onUpdate(localConfig);
      setIsSyncing(false);
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <div className="xl:col-span-3 space-y-6">
        <div className="glass p-8 rounded-[2rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[100px] -z-10" />
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <TermIcon size={24} className="text-violet-400" />
                Nexus Runtime Configuration
              </h3>
              <p className="text-slate-500 text-sm mt-1">Manage Java Home and Gradle Build Environment</p>
            </div>
            <button 
              onClick={handleSave}
              disabled={isSyncing}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-bold flex items-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isSyncing ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
              {isSyncing ? 'Sincronizando...' : 'Apply Core Changes'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <label className="block group">
                <span className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-widest group-hover:text-violet-400 transition-colors">JAVA_HOME PATH</span>
                <input 
                  type="text" 
                  value={localConfig.javaHome}
                  onChange={(e) => setLocalConfig({...localConfig, javaHome: e.target.value})}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-sm font-mono text-cyan-50 focus:border-violet-400/50 outline-none transition-all focus:ring-4 focus:ring-violet-500/5"
                />
              </label>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex justify-between text-xs">
                   <span className="text-slate-500">Detected JDK:</span>
                   <span className="text-violet-300 font-mono">OpenJDK 21.0.2-Aura</span>
                </div>
                <div className="flex justify-between text-xs">
                   <span className="text-slate-500">Architecture:</span>
                   <span className="text-violet-300 font-mono">x86_64 (Optimized)</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <label className="block group">
                <span className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-widest group-hover:text-cyan-400 transition-colors">GRADLE_HOME PATH</span>
                <input 
                  type="text" 
                  value={localConfig.gradleHome}
                  onChange={(e) => setLocalConfig({...localConfig, gradleHome: e.target.value})}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-sm font-mono text-cyan-50 focus:border-cyan-400/50 outline-none transition-all focus:ring-4 focus:ring-cyan-500/5"
                />
              </label>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex justify-between text-xs">
                   <span className="text-slate-500">Daemon Status:</span>
                   <span className="text-cyan-400 font-mono">Warm & Ready</span>
                </div>
                <div className="flex justify-between text-xs">
                   <span className="text-slate-500">Build Cache:</span>
                   <span className="text-cyan-400 font-mono">Enabled (Nexus Cloud)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <label className="block group">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-fuchsia-400 transition-colors">Advanced JVM Arguments (ZGC Tuning)</span>
                 <span className="text-[10px] text-fuchsia-500 font-bold bg-fuchsia-500/10 px-2 py-0.5 rounded">ULTRA-LATENCY MODE</span>
              </div>
              <textarea 
                value={localConfig.jvmOptions}
                onChange={(e) => setLocalConfig({...localConfig, jvmOptions: e.target.value})}
                rows={4}
                className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-5 py-4 text-sm font-mono text-fuchsia-100 focus:border-fuchsia-400/50 outline-none transition-all resize-none"
                placeholder="-Xmx16g -XX:+UseZGC..."
              />
            </label>
          </div>
        </div>

        <div className="glass p-8 rounded-[2rem]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Variable size={22} className="text-cyan-400" />
              Environment Registry
            </h3>
            <div className="flex gap-2">
               <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-colors">Add Key</button>
               <button className="p-2 text-cyan-400 hover:bg-cyan-400/10 rounded-xl transition-all"><RefreshCw size={18} /></button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(localConfig.environmentVariables).map(([key, value]) => (
              <div key={key} className="p-4 bg-slate-950/50 border border-white/5 rounded-xl hover:border-cyan-500/30 transition-all group">
                <div className="text-[10px] font-bold text-slate-500 mb-1 group-hover:text-cyan-400 transition-colors">{key}</div>
                <div className="text-xs font-mono text-slate-300 truncate" title={value}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass p-6 rounded-[2rem] border-violet-500/20">
          <div className="w-12 h-12 bg-violet-500/20 rounded-2xl flex items-center justify-center mb-4">
             <Zap size={24} className="text-violet-400" />
          </div>
          <h4 className="font-bold text-lg mb-2">Build Extensions</h4>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Nexus Aria uses distributed compilation to reduce build times by up to 85%.
          </p>
          <div className="space-y-4">
             <ExtensionToggle label="Parallel Execution" active />
             <ExtensionToggle label="VFS Watcher" active />
             <ExtensionToggle label="Native Image (GraalVM)" />
             <ExtensionToggle label="Nexus Cloud Sync" active />
          </div>
        </div>

        <div className="glass p-6 rounded-[2rem] border-cyan-500/20">
           <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={20} className="text-cyan-400" />
              <h4 className="font-bold">Kernel Status</h4>
           </div>
           <div className="text-[10px] font-mono space-y-2 opacity-60">
              <div>> CHECKING DESCRIPTORS... [OK]</div>
              <div>> VERIFYING JAVA_HOME... [OK]</div>
              <div>> GRADLE_DAEMON_PULSE... [OK]</div>
              <div className="text-cyan-400 animate-pulse">> ALL SYSTEMS NOMINAL</div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ExtensionToggle: React.FC<{ label: string; active?: boolean }> = ({ label, active = false }) => (
  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
     <span className="text-xs font-medium text-slate-300">{label}</span>
     <div className={`w-8 h-4 rounded-full relative transition-colors ${active ? 'bg-violet-600' : 'bg-slate-700'}`}>
        <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${active ? 'left-5' : 'left-1'}`} />
     </div>
  </div>
);
