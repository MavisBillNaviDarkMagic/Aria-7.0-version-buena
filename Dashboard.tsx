
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SystemMetrics, SystemConfig } from '../types';
import { Cpu, Server, Clock, Activity, Zap, Smartphone, Shield, Globe, Github, Brain, Download, CheckCircle, XCircle, Loader2, ExternalLink, Share2 } from 'lucide-react';

const flowData = [
  { time: '00:00', load: 15, neural: 5 }, { time: '04:00', load: 10, neural: 2 },
  { time: '08:00', load: 40, neural: 20 }, { time: '12:00', load: 60, neural: 55 },
  { time: '16:00', load: 80, neural: 85 }, { time: '20:00', load: 45, neural: 30 },
  { time: '23:59', load: 20, neural: 10 },
];

interface DashboardProps {
  metrics: SystemMetrics;
  config: SystemConfig;
}

export const Dashboard: React.FC<DashboardProps> = ({ metrics, config }) => {
  const mockBuilds = [
    { id: 'B-PRIME-FINAL', status: 'SUCCESS', date: 'Recién generado', ver: '7.0.0' },
    { id: 'B-942', status: 'SUCCESS', date: 'Hace 2h', ver: '6.8.0' },
    { id: 'B-941', status: 'SUCCESS', date: 'Ayer', ver: '6.7.5' },
  ];

  return (
    <div className="space-y-8 lg:space-y-12 pb-32">
      
      {/* Prime Status Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
        <StatusCard label="CPU" value={`${Math.round(metrics.cpu)}%`} icon={Cpu} color="text-rose-500" />
        <StatusCard label="RAM" value={`${Math.round(metrics.ram)}%`} icon={Server} color="text-fuchsia-500" />
        <StatusCard label="LATENCY" value="12ms" icon={Zap} color="text-amber-500" />
        <StatusCard label="GLOBAL" value="VISIBLE" icon={Share2} color="text-fuchsia-400" />
        <StatusCard label="UPTIME" value={metrics.uptime} icon={Clock} color="text-slate-400" />
        <StatusCard label="REPO" value="ACTIVE" icon={Github} color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Neural Chart */}
        <div className="lg:col-span-2 glass rounded-[3rem] p-10 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-fuchsia-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="flex items-center justify-between mb-10 relative">
            <div>
               <h3 className="text-3xl font-black text-white tracking-tighter">GLOBAL BROADCAST NETWORK</h3>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">Sincronización de pulsos AuraOS Sovereign - World View</p>
            </div>
            <div className="flex gap-4">
              <a 
                href={`${config.remoteRepo}/actions`} 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-[9px] font-black text-fuchsia-400 uppercase flex items-center gap-2 hover:bg-fuchsia-500/20 transition-all shadow-[0_0_15px_rgba(217,70,239,0.1)]"
              >
                <Share2 size={10} /> Public Exposure Active
              </a>
            </div>
          </div>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={flowData}>
                <defs>
                  <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={config.theme.primaryColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={config.theme.primaryColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="load" stroke={config.theme.primaryColor} strokeWidth={4} fill="url(#colorFlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Remote Deployment Hub */}
        <div className="glass rounded-[3rem] p-10 flex flex-col gap-8 bg-gradient-to-br from-slate-950 to-black border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
           <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-black text-white tracking-tighter uppercase">Historial de Despliegue</h3>
              <Download size={18} className="text-emerald-500 animate-bounce" />
           </div>
           
           <div className="space-y-4">
             {mockBuilds.map((build) => (
               <div key={build.id} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                 <div className="flex items-center gap-4">
                   {build.status === 'SUCCESS' ? <CheckCircle className="text-emerald-500" size={18} /> : <XCircle className="text-rose-500" size={18} />}
                   <div>
                     <div className="text-xs font-black text-white">{build.id} - v{build.ver}</div>
                     <div className="text-[9px] font-bold text-slate-500 uppercase">{build.date}</div>
                   </div>
                 </div>
                 <a 
                  href={`${config.remoteRepo}/actions`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all"
                 >
                   <Download size={14} />
                 </a>
               </div>
             ))}
           </div>

           <div className="mt-auto p-6 rounded-2xl bg-fuchsia-500/5 border border-fuchsia-500/10 text-center">
             <div className="text-[10px] font-black text-fuchsia-400 tracking-widest uppercase mb-2">Auto-Compilación Remota</div>
             <div className="text-sm font-mono text-slate-300">ESTADO: WORLD_VISIBLE</div>
           </div>
        </div>
      </div>
      
      {/* Identity & Technical Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <HardwareLine label="Soberanía OS" value={config.androidVersion} icon={Smartphone} />
        <HardwareLine label="Vínculo Repositorio" value={new URL(config.remoteRepo).pathname.split('/').pop() || ''} icon={Github} />
        <HardwareLine label="Nivel de Autonomía" value={`${(config.aiPersona.autonomy * 100).toFixed(0)}%`} icon={Brain} />
        <HardwareLine label="Status" value="HELLO WORLD ACTIVE" icon={Zap} />
      </div>
    </div>
  );
};

const StatusCard: React.FC<{ label: string; value: string; icon: any; color: string }> = ({ label, value, icon: Icon, color }) => (
  <div className="glass rounded-[2rem] p-6 border-white/5 shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
    <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-6 group-hover:scale-110 transition duration-700 ${color}`}>
      <Icon size={20} />
    </div>
    <div className="text-3xl font-black text-white font-mono tracking-tighter">{value}</div>
    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">{label}</div>
  </div>
);

const HardwareLine: React.FC<{ label: string; value: string; icon: any }> = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-5 p-6 glass rounded-[2rem] border-white/5 hover:border-fuchsia-500/20 transition-all">
    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-fuchsia-400 transition-colors">
      <Icon size={20} />
    </div>
    <div>
      <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-sm font-black text-slate-200 tracking-tight">{value}</div>
    </div>
  </div>
);
