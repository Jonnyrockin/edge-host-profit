import React from 'react';
import { useHostDashboard } from '@/hooks/useHostDashboard';
import { NodeCard } from '@/components/host/NodeCard';
import { FleetSummary } from '@/components/host/FleetSummary';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Server } from 'lucide-react';

export default function HostDashboard() {
  const { state, fleetMetrics, updateScenario } = useHostDashboard();

  return (
    <div className="min-h-screen bg-[#020817] text-foreground p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Server className="w-10 h-10 text-cyan-400" />
              HyperEdgeX - Host Area (Hermes)
            </h1>
            <p className="text-gray-400">Network Health: <Badge className="ml-2 bg-green-500">GOOD</Badge></p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right mr-4">
              <div className="text-sm text-gray-400">Volume</div>
              <div className="text-2xl font-bold text-cyan-400">70.7%</div>
            </div>
            <Select value={state.selectedScenario} onValueChange={updateScenario}>
              <SelectTrigger className="w-[180px] bg-[#0a1628] border-[#1e3a5f] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0a1628] border-[#1e3a5f]">
                <SelectItem value="Conservative" className="text-white">Conservative</SelectItem>
                <SelectItem value="Median" className="text-white">Median</SelectItem>
                <SelectItem value="Optimistic" className="text-white">Optimistic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Node Stack */}
          <div className="col-span-7">
            <Card className="bg-[#0a1628] border-[#1e3a5f] mb-6">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center justify-between">
                  <span>Node Stack</span>
                  <Select defaultValue="utilization">
                    <SelectTrigger className="w-[200px] bg-[#0d1f3a] border-[#1e3a5f] text-white text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a1628] border-[#1e3a5f]">
                      <SelectItem value="utilization" className="text-white">Sort by Utilization</SelectItem>
                      <SelectItem value="revenue" className="text-white">Sort by Revenue</SelectItem>
                      <SelectItem value="location" className="text-white">Sort by Location</SelectItem>
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
            <Card className="bg-[#0a1628] border-[#1e3a5f]">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  Diagnostics & Alerts
                </CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Run SEL Test</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-[#0d1f3a] rounded-lg p-4 border-l-4 border-yellow-500">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-semibold mb-1">Latency spike detected on node-003 (lng berlin)</div>
                      <div className="text-gray-400 text-sm">Latency: 45ms (usual 18ms) • 33 minutes ago</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0d1f3a] rounded-lg p-4 border-l-4 border-orange-500">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-semibold mb-1">Energy efficiency below threshold on node-002 (lng munich)</div>
                      <div className="text-gray-400 text-sm">Current: 0.85 J/inf (target: 0.7) • 2 hours ago</div>
                    </div>
                  </div>
                </div>

                <div className="text-center py-4">
                  <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                    View all alerts →
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
