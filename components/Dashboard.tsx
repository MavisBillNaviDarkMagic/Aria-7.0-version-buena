
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { SystemMetrics } from '../types';
import { Cpu, Server, HardDrive, Clock, Activity } from 'lucide-react';

const data = [
  { time: '00:00', load: 45 },
  { time: '04:00', load: 32 },
  { time: '08:00', load: 68 },
  { time: '12:00', load: 85 },
  { time: '16:00', load: 54 },
  { time: '20:00', load: 38 },
  { time: '23:59', load: 41 },
];

interface DashboardProps {
  metrics: SystemMetrics;
}

export const Dashboard: React.FC<DashboardProps> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="CPU Usage" value={`${Math.round(metrics.cpu)}%`} icon={Cpu} color="text-violet-400" />
        <MetricCard label="Memory" value={`${Math.round(metrics.ram)}%`} icon={Server} color="text-cyan-400" />
        <MetricCard label="Disk Space" value={`${metrics.disk}%`} icon={HardDrive} color="text-amber-400" />
        <MetricCard label="Uptime" value={metrics.uptime} icon={Clock} color="text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <Activity size={18} className="text-violet-400" />
              Process Load History
            </h3>
            <span className="text-xs text-slate-500 font-mono">Real-time Telemetry</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#8b5cf6' }}
                />
                <Area type="monotone" dataKey="load" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorLoad)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5">
          <h3 className="font-bold mb-6">Active Nexus Nodes</h3>
          <div className="space-y-4">
            <NodeStatus name="Primary-Hub-α" status="online" load={12} />
            <NodeStatus name="Gradle-Daemon-Worker" status="online" load={45} />
            <NodeStatus name="Gemini-Inference-Engine" status="online" load={88} />
            <NodeStatus name="Backup-Relay-β" status="idle" load={2} />
            <NodeStatus name="Auth-Service-Aura" status="online" load={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: string; icon: any; color: string }> = ({ label, value, icon: Icon, color }) => (
  <div className="glass p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300">
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2 rounded-lg bg-slate-800 ${color}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="text-2xl font-bold text-white mb-1 font-mono">{value}</div>
    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</div>
  </div>
);

const NodeStatus: React.FC<{ name: string; status: 'online' | 'idle' | 'offline'; load: number }> = ({ name, status, load }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-400' : status === 'idle' ? 'bg-amber-400' : 'bg-rose-400'} animate-pulse`} />
      <span className="text-sm font-medium text-slate-300">{name}</span>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-[10px] font-mono text-slate-500">{load}% Load</div>
      <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div 
          className={`h-full ${load > 80 ? 'bg-rose-500' : load > 50 ? 'bg-amber-500' : 'bg-cyan-500'}`} 
          style={{ width: `${load}%` }} 
        />
      </div>
    </div>
  </div>
);
