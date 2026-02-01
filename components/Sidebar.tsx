
import React from 'react';
import { LayoutDashboard, Settings, Terminal as TerminalIcon, Cpu, ShieldAlert, Database } from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.SETTINGS, label: 'System Config', icon: Settings },
    { id: View.TERMINAL, label: 'Aura Shell', icon: TerminalIcon },
    { id: View.AI_CORE, label: 'AI Core', icon: Cpu },
  ];

  return (
    <aside className="w-64 glass border-r border-white/5 flex flex-col h-full z-10">
      <div className="p-6">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center animate-pulse">
            <ShieldAlert size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tighter">ARIA NEXUS</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                currentView === item.id
                  ? 'bg-white/10 text-violet-400 aura-glow border border-white/10'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Database size={14} className="text-violet-400" />
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Database Sync</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div className="bg-violet-400 h-full w-4/5 animate-pulse" />
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Connected to Nexus-Primary-DB</p>
        </div>
        
        <div className="text-[10px] text-slate-600 font-mono text-center">
          SYSTEM STATUS: OPTIMAL
        </div>
      </div>
    </aside>
  );
};
