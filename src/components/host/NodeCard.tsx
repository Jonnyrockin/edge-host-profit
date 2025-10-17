import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HostNode } from '@/types/host-dashboard';
import { calculateNodeRevenue } from '@/utils/host-calculations';
import { SCENARIOS } from '@/types/host-dashboard';
import { Cpu, HardDrive, Zap, Wifi, TrendingUp, DollarSign } from 'lucide-react';

interface NodeCardProps {
  node: HostNode;
  selectedScenario: string;
  currentYear: number;
}

export function NodeCard({ node, selectedScenario, currentYear }: NodeCardProps) {
  const scenario = SCENARIOS[selectedScenario] || SCENARIOS.Median;
  const revenue = calculateNodeRevenue(node, scenario, currentYear);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-500';
      case 'WARNING': return 'bg-yellow-500';
      case 'DEGRADED': return 'bg-orange-500';
      case 'OFFLINE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'default';
      case 'WARNING': return 'secondary';
      default: return 'destructive';
    }
  };

  return (
    <Card className="p-4 hover:border-primary/50 transition-colors bg-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(node.status)} animate-pulse`} />
          <div>
            <h3 className="font-semibold text-sm">{node.label}</h3>
            <p className="text-foreground/85 text-xs mt-0.5">{node.location}</p>
          </div>
        </div>
        <Badge variant={getStatusBadge(node.status)} className="text-xs">
          {node.status}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-card-hover rounded p-2">
          <div className="flex items-center gap-1 text-foreground/85 text-xs mb-1">
            <Cpu className="w-3 h-3" />
            <span>CPU</span>
          </div>
          <div className="text-sm font-semibold">{node.cpuCores} Cores</div>
        </div>

        <div className="bg-card-hover rounded p-2">
          <div className="flex items-center gap-1 text-foreground/85 text-xs mb-1">
            <HardDrive className="w-3 h-3" />
            <span>Memory</span>
          </div>
          <div className="text-sm font-semibold">{node.memory}</div>
        </div>

        <div className="bg-card-hover rounded p-2">
          <div className="flex items-center gap-1 text-foreground/85 text-xs mb-1">
            <Zap className="w-3 h-3" />
            <span>GPU</span>
          </div>
          <div className="text-sm font-semibold">{node.gpuModel}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-card-hover rounded p-2">
          <div className="flex items-center gap-1 text-foreground/85 text-xs mb-1">
            <TrendingUp className="w-3 h-3" />
            <span>IPS</span>
          </div>
          <div className="text-primary text-lg font-bold">{node.ips}</div>
        </div>

        <div className="bg-card-hover rounded p-2">
          <div className="flex items-center gap-1 text-foreground/85 text-xs mb-1">
            <Wifi className="w-3 h-3" />
            <span>Latency</span>
          </div>
          <div className="text-primary text-sm font-semibold">{node.latencyTier}</div>
        </div>
      </div>

      <div className="h-2 bg-card-hover rounded-full overflow-hidden mb-2">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${Math.round(revenue.adjustedUtil * 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-foreground/85 mb-3">
        <span>Utilization: {Math.round(revenue.adjustedUtil * 100)}%</span>
        <span>Uptime: {node.uptime}%</span>
      </div>

      <div className="border-t border-border pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-foreground/85 text-xs">
            <DollarSign className="w-3 h-3" />
            <span>Net Revenue</span>
          </div>
          <div className="text-success text-lg font-bold">
            ${Math.round(revenue.netRevenue).toLocaleString()}
            <span className="text-xs text-foreground/85 ml-1">/mo</span>
          </div>
        </div>
        <div className="text-right text-xs text-foreground/85 mt-1">
          ${Math.round(revenue.dailyRevenue).toLocaleString()}/day • ${Math.round(revenue.hourlyRevenue).toLocaleString()}/hr
        </div>
      </div>
    </Card>
  );
}
