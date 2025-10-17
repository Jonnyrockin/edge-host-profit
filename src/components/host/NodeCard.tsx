import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HostNode } from '@/types/host-dashboard';
import { calculateNodeRevenue } from '@/utils/host-calculations';
import { SCENARIOS } from '@/types/host-dashboard';
import { Cpu, HardDrive, Zap, Activity, Clock, MapPin, CheckCircle2 } from 'lucide-react';

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

  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true });
  const inferenceLoad = Math.round(revenue.adjustedUtil * 100);

  return (
    <Card className="relative overflow-hidden hover:border-primary/50 transition-colors bg-card">
      {/* Blue vertical inference label */}
      <div className="absolute left-0 top-0 bottom-0 w-10 bg-[hsl(217_91%_60%)] flex items-center justify-center">
        <div className="text-white text-xs font-bold tracking-wider transform -rotate-90 whitespace-nowrap">
          INFERENCE
        </div>
      </div>

      {/* Main content with left margin for the blue bar */}
      <div className="ml-10 p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-foreground/70" />
            <h3 className="font-semibold text-base">
              {node.label} / {node.location}
            </h3>
            <Badge variant={getStatusBadge(node.status)} className="text-xs font-semibold">
              {node.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-foreground/70">
            <span>Last sync: {currentTime}</span>
            <div className="flex items-center gap-1 text-green-500">
              <CheckCircle2 className="w-4 h-4" />
              <span>All Systems Green</span>
            </div>
          </div>
        </div>

        {/* Model subtitle */}
        <div className="text-sm text-foreground/70 mb-4">
          {node.gpuModel} Series
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-6 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-1 text-foreground/70 text-xs mb-1">
              <Activity className="w-3 h-3" />
              <span>TOPS</span>
            </div>
            <div className="text-lg font-bold">{node.ips}</div>
          </div>

          <div>
            <div className="flex items-center gap-1 text-foreground/70 text-xs mb-1">
              <Cpu className="w-3 h-3" />
              <span>CPU</span>
            </div>
            <div className="text-sm font-semibold">{node.cpuCores}x Intel Xeon</div>
          </div>

          <div>
            <div className="flex items-center gap-1 text-foreground/70 text-xs mb-1">
              <HardDrive className="w-3 h-3" />
              <span>MEMORY</span>
            </div>
            <div className="text-sm font-semibold">{node.memory}</div>
          </div>

          <div>
            <div className="flex items-center gap-1 text-foreground/70 text-xs mb-1">
              <Zap className="w-3 h-3" />
              <span>GPU</span>
            </div>
            <div className="text-sm font-semibold">{node.gpuModel}</div>
          </div>

          <div>
            <div className="text-foreground/70 text-xs mb-1">GPU COUNT</div>
            <div className="text-lg font-bold">x2</div>
          </div>

          <div className="flex items-end justify-end">
            <div className="flex gap-1">
              {['S', 'E', 'L', 'L', 'C'].map((letter, i) => (
                <div 
                  key={i}
                  className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-medium"
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom metrics row */}
        <div className="flex items-center gap-6 mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-sm text-foreground/70">Util:</span>
            <span className="text-sm font-bold">{inferenceLoad}%</span>
          </div>

          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-foreground/70">Power:</span>
            <span className="text-sm font-bold">320W</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-foreground/70" />
            <span className="text-sm text-foreground/70">Uptime:</span>
            <span className="text-sm font-bold">{node.uptime}%</span>
          </div>
        </div>

        {/* Inference Load progress bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-foreground/70 mb-2">
            <span>Inference Load:</span>
            <span className="font-bold">{inferenceLoad}%</span>
          </div>
          <div className="h-2 bg-card-hover rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
              style={{ width: `${inferenceLoad}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
