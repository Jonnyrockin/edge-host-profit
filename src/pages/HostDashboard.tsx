import React from 'react';
import { useHostDashboard } from '@/hooks/useHostDashboard';
import { NodeCard } from '@/components/host/NodeCard';
import { FleetSummary } from '@/components/host/FleetSummary';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

export default function HostDashboard() {
  const { state, fleetMetrics, updateScenario } = useHostDashboard();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Host Dashboard
          </h1>
          <p className="text-muted-foreground">Monitor your fleet performance and earnings</p>
        </div>
        <Select value={state.selectedScenario} onValueChange={updateScenario}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Conservative">Conservative</SelectItem>
            <SelectItem value="Median">Median</SelectItem>
            <SelectItem value="Optimistic">Optimistic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Node Stack */}
        <div className="col-span-7">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center justify-between">
                <span>Node Stack</span>
                <Select defaultValue="utilization">
                  <SelectTrigger className="w-[200px] text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utilization">Sort by Utilization</SelectItem>
                    <SelectItem value="revenue">Sort by Revenue</SelectItem>
                    <SelectItem value="location">Sort by Location</SelectItem>
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.nodes.map(node => (
                <NodeCard 
                  key={node.id} 
                  node={node} 
                  selectedScenario={state.selectedScenario}
                  currentYear={state.currentYear}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Fleet Summary & Diagnostics */}
        <div className="col-span-5 space-y-6">
          <FleetSummary metrics={fleetMetrics} />

          {/* Diagnostics & Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Diagnostics & Alerts
              </CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">Run SEL Test</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-card-hover rounded-lg p-4 border-l-4 border-warning">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Latency spike detected on node-003 (lng berlin)</div>
                    <div className="text-muted-foreground text-sm">Latency: 45ms (usual 18ms) • 33 minutes ago</div>
                  </div>
                </div>
              </div>

              <div className="bg-card-hover rounded-lg p-4 border-l-4 border-destructive">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Energy efficiency below threshold on node-002 (lng munich)</div>
                    <div className="text-muted-foreground text-sm">Current: 0.85 J/inf (target: 0.7) • 2 hours ago</div>
                  </div>
                </div>
              </div>

              <div className="text-center py-4">
                <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                  View all alerts →
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
