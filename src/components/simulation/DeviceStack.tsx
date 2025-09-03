import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Trash2 } from 'lucide-react';
import { Device, SimulationState, CalculationResult } from '../../types/simulation';
import { CATALOG } from '../../data/constants';
import { InfoTooltip } from '../ui/info-tooltip';

interface DeviceStackProps {
  devices: Device[];
  state: SimulationState;
  calculations: CalculationResult;
  onAddDevice: (deviceId: string) => void;
  onUpdateDevice: (deviceId: string, updates: Partial<Device>) => void;
  onRemoveDevice: (deviceId: string) => void;
}

export function DeviceStack({ devices, state, calculations, onAddDevice, onUpdateDevice, onRemoveDevice }: DeviceStackProps) {
  // Calculate IPS capacity
  const totalCapacityIPS = state.devices.reduce((total, device) => total + (device.ips * device.qty), 0);
  const totalCapacityMonthly = totalCapacityIPS * state.secondsInMonth;
  const usedCapacityMonthly = calculations.monthlyCalls;
  const utilizationPercentage = totalCapacityMonthly > 0 ? Math.min((usedCapacityMonthly / totalCapacityMonthly) * 100, 100) : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-4 mt-4">
      <div className="text-lg font-semibold text-foreground">Node Stack</div>
      <div className="text-help text-sm mb-2">
        Add device rows from the catalog. Quantity = how many identical nodes you operate.
      </div>
      
      {/* Device Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead className="text-help">
            <tr>
              <th className="text-left py-2">Device</th>
              <th className="text-left py-2">Vendor</th>
              <th className="text-left py-2 flex items-center gap-1">
                Latency
                <InfoTooltip content="Response time categories: <25ms (ultra-fast), 25-50ms (fast), 50-100ms (standard). Lower latency commands premium pricing." />
              </th>
              <th className="text-right py-2 flex items-center gap-1 justify-end">
                IPS / row
                <InfoTooltip content="Inferences Per Second - maximum AI processing capacity per device. Higher IPS = more concurrent jobs." />
              </th>
              <th className="text-center py-2 flex items-center gap-1 justify-center">
                Qty
                <InfoTooltip content="Number of identical devices. More devices = higher total capacity and redundancy." />
              </th>
              <th className="text-right py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-help py-4 text-center">
                  No devices yet. Use the catalog below.
                </td>
              </tr>
            ) : (
              [...devices].reverse().map(device => (
                <tr key={device.id} className="border-t border-border">
                  <td className="py-2 text-foreground">{device.label}</td>
                  <td className="py-2 text-foreground">{device.vendor}</td>
                  <td className="py-2 text-right text-foreground">{device.latencyTier}</td>
                  <td className="py-2 text-right text-foreground">{device.ips}</td>
                  <td className="py-2 text-center">
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={device.qty}
                      onChange={(e) => onUpdateDevice(device.id, { qty: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-16 font-mono bg-input border-input-border text-center mx-auto"
                    />
                  </td>
                  <td className="py-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveDevice(device.id)}
                      className="border-destructive/40 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* IPS Capacity Visualization */}
      <div className="mb-6 pt-4 border-t border-border">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-help text-sm">Total Available IPS per Month</div>
            <InfoTooltip content="Your hardware's maximum processing capacity. Shows total inferences per second across all devices and monthly capacity limit." />
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="text-sm text-foreground">
              <span className="font-semibold text-number-blue">{totalCapacityIPS.toLocaleString()}</span> IPS
            </div>
            <div className="text-sm text-muted-foreground">
              = <span className="font-mono">{(totalCapacityMonthly / 1_000_000).toFixed(1)}M</span> calls/month capacity
            </div>
          </div>
          
          {/* Capacity Bar */}
          <div className="relative w-full h-6 bg-muted/30 rounded-lg overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-300"
              style={{ width: `${utilizationPercentage}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-medium">
              <span className="text-foreground">
                {(usedCapacityMonthly / 1_000_000).toFixed(1)}M used
              </span>
              <span className="text-muted-foreground">
                {utilizationPercentage.toFixed(1)}% capacity
              </span>
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span>{(totalCapacityMonthly / 1_000_000).toFixed(1)}M calls</span>
          </div>
        </div>
      </div>

      {/* Device Picker */}
      <div className="pt-4 border-t border-border">
        <div className="text-sm font-medium text-foreground mb-2">Approved Hardware Catalog</div>
        <div className="flex flex-wrap gap-2">
          {CATALOG.map(device => (
            <Button
              key={device.id}
              variant="outline"
              onClick={() => onAddDevice(device.id)}
              className="border-input-border hover:border-glass-border"
              title={`${device.vendor} • ${device.label} • ${device.latencyTier} • ~${device.ips} calls/sec per row`}
            >
              + {device.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}