import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FleetMetrics } from '@/types/host-dashboard';
import { Activity, Cpu, DollarSign, TrendingUp } from 'lucide-react';

interface FleetSummaryProps {
  metrics: FleetMetrics;
}

export function FleetSummary({ metrics }: FleetSummaryProps) {
  return (
    <Card className="bg-[#0a1628] border-[#1e3a5f]">
      <CardHeader>
        <CardTitle className="text-white text-xl flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          Fleet Revenue (5 Nodes)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#0d1f3a] rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <Cpu className="w-4 h-4" />
              <span>Total IPS</span>
            </div>
            <div className="text-cyan-400 text-2xl font-bold">
              {metrics.totalIPS.toLocaleString()}
            </div>
            <div className="text-gray-500 text-xs mt-1">
              {metrics.onlineNodes}/{metrics.totalNodes} nodes online
            </div>
          </div>

          <div className="bg-[#0d1f3a] rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>Monthly Inferences</span>
            </div>
            <div className="text-white text-2xl font-bold">
              {(metrics.monthlyInferences / 1e9).toFixed(2)}B
            </div>
            <div className="text-gray-500 text-xs mt-1">
              Avg util: {Math.round(metrics.avgUtilization * 100)}%
            </div>
          </div>

          <div className="bg-[#0d1f3a] rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <DollarSign className="w-4 h-4" />
              <span>Gross Revenue</span>
            </div>
            <div className="text-green-400 text-2xl font-bold">
              ${(metrics.grossRevenue / 1000).toFixed(1)}K
            </div>
            <div className="text-gray-500 text-xs mt-1">
              Monthly projection
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center p-3 bg-[#0d1f3a] rounded">
            <span className="text-gray-400 text-sm">Monthly Breakdown:</span>
            <span className="text-white font-semibold">${Math.round(metrics.grossRevenue).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#0d1f3a] rounded">
            <span className="text-gray-400 text-sm">Gross Revenue</span>
            <span className="text-white font-semibold">${Math.round(metrics.grossRevenue).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#0d1f3a] rounded">
            <span className="text-gray-400 text-sm">Costs / Expenses (OPEX)</span>
            <span className="text-red-400 font-semibold">-${Math.round(metrics.totalOpex).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#0d1f3a] rounded">
            <span className="text-gray-400 text-sm">Platform Fee (25%)</span>
            <span className="text-red-400 font-semibold">-${Math.round(metrics.platformFee).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-900/30 to-cyan-900/30 rounded border border-green-500/30 mt-3">
            <span className="text-white font-semibold text-lg">Net Revenue:</span>
            <div className="text-right">
              <div className="text-green-400 font-bold text-2xl">
                ${Math.round(metrics.netRevenue).toLocaleString()}
              </div>
              <div className="text-green-500/70 text-sm">
                +{((metrics.netRevenue / metrics.grossRevenue) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
