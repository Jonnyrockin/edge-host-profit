import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FleetMetrics } from '@/types/host-dashboard';
import { Activity, Cpu, DollarSign, TrendingUp } from 'lucide-react';

interface FleetSummaryProps {
  metrics: FleetMetrics;
}

export function FleetSummary({ metrics }: FleetSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Fleet Revenue (5 Nodes)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card-hover rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <Cpu className="w-4 h-4" />
              <span>Total IPS</span>
            </div>
            <div className="text-primary text-2xl font-bold">
              {metrics.totalIPS.toLocaleString()}
            </div>
            <div className="text-muted-foreground text-xs mt-1">
              {metrics.onlineNodes}/{metrics.totalNodes} nodes online
            </div>
          </div>

          <div className="bg-card-hover rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>Monthly Inferences</span>
            </div>
            <div className="text-2xl font-bold">
              {(metrics.monthlyInferences / 1e9).toFixed(2)}B
            </div>
            <div className="text-muted-foreground text-xs mt-1">
              Avg util: {Math.round(metrics.avgUtilization * 100)}%
            </div>
          </div>

          <div className="bg-card-hover rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <DollarSign className="w-4 h-4" />
              <span>Gross Revenue</span>
            </div>
            <div className="text-success text-2xl font-bold">
              ${(metrics.grossRevenue / 1000).toFixed(1)}K
            </div>
            <div className="text-muted-foreground text-xs mt-1">
              Monthly projection
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center p-3 bg-card-hover rounded">
            <span className="text-muted-foreground text-sm">Monthly Breakdown:</span>
            <span className="font-semibold">${Math.round(metrics.grossRevenue).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-card-hover rounded">
            <span className="text-muted-foreground text-sm">Gross Revenue</span>
            <span className="font-semibold">${Math.round(metrics.grossRevenue).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-card-hover rounded">
            <span className="text-muted-foreground text-sm">Costs / Expenses (OPEX)</span>
            <span className="text-destructive font-semibold">-${Math.round(metrics.totalOpex).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-card-hover rounded">
            <span className="text-muted-foreground text-sm">Platform Fee (25%)</span>
            <span className="text-destructive font-semibold">-${Math.round(metrics.platformFee).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-card-hover rounded border border-border mt-3">
            <span className="font-semibold text-lg">Net Revenue:</span>
            <div className="text-right">
              <div className="text-success font-bold text-2xl">
                ${Math.round(metrics.netRevenue).toLocaleString()}
              </div>
              <div className="text-success/70 text-sm">
                +{((metrics.netRevenue / metrics.grossRevenue) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
