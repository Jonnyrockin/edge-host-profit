import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Clock, ShieldCheck } from 'lucide-react';

export function StatusBar() {
  const metrics = [
    {
      label: 'Average Latency',
      value: '12.8ms',
      status: 'PASS',
      statusVariant: 'default' as const,
      icon: Clock,
    },
    {
      label: 'Power Efficiency',
      value: '0.42W/Tf',
      status: 'GOOD',
      statusVariant: 'secondary' as const,
      icon: Zap,
    },
    {
      label: 'Mean Node Uptime',
      value: '99.0%',
      status: 'PASS',
      statusVariant: 'default' as const,
      icon: Activity,
    },
    {
      label: 'Compliance Coverage',
      value: '96%',
      status: 'GOOD',
      statusVariant: 'secondary' as const,
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="bg-card border border-border rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-md">
              <metric.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">{metric.label}</div>
              <div className="text-xl font-bold text-foreground">{metric.value}</div>
            </div>
          </div>
          <Badge variant={metric.statusVariant} className="font-semibold">
            {metric.status}
          </Badge>
        </div>
      ))}
    </div>
  );
}
