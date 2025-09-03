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
  // Calculate IPS capacity and actual usage
  const totalCapacityIPS = state.devices.reduce((total, device) => total + (device.ips * device.qty), 0);
  const totalCapacityMonthly = totalCapacityIPS * state.secondsInMonth;
  const actualUsedIPS = totalCapacityIPS * calculations.util; // IPS being used based on utilization
  const actualUsedMonthly = actualUsedIPS * state.secondsInMonth;
  const utilizationPercentage = calculations.util * 100;

  return (
    <div className="bg-card border border-border rounded-2xl p-panel-padding mb-panel">
      <div className="text-headline font-semibold text-foreground">Node Stack</div>
      <div className="text-help text-core mb-panel-gap">
        Add device rows from the catalog. Quantity = how many identical nodes you operate.
      </div>
      
      {/* Device Table */}
      <div className="mb-4">
        {/* Header Row */}
        <div className="grid grid-cols-6 gap-4 items-center py-2 text-help border-b border-border">
          <div className="text-left text-core">Device</div>
          <div className="text-left text-core">Vendor</div>
          <div className="text-left text-core flex items-center gap-1">
            Latency
            <InfoTooltip content="Response time categories: <25ms (ultra-fast), 25-50ms (fast), 50-100ms (standard). Lower latency commands premium pricing." />
          </div>
          <div className="text-right text-core flex items-center gap-1 justify-end">
            IPS / row
            <InfoTooltip content="Inferences Per Second - maximum AI processing capacity per device. Higher IPS = more concurrent jobs." />
          </div>
          <div className="text-center text-core flex items-center gap-1 justify-center">
            Qty
            <InfoTooltip content="Number of identical devices. More devices = higher total capacity and redundancy." />
          </div>
          <div className="text-center text-core font-medium">Actions</div>
        </div>
        
        {/* Device Rows */}
        {devices.length === 0 ? (
          <div className="text-help py-4 text-center text-core">
            No devices yet. Use the catalog below.
          </div>
        ) : (
          [...devices].reverse().map(device => (
            <div key={device.id} className="bg-muted/20 border border-muted rounded-md p-panel-padding my-2">
              <div className="grid grid-cols-6 gap-4 items-center">
                <div className="text-foreground text-headline font-medium">{device.label}</div>
                <div className="text-foreground text-core">{device.vendor}</div>
                <div className="text-right text-foreground text-core">{device.latencyTier}</div>
                <div className="text-right text-foreground text-core">{device.ips}</div>
                <div className="text-center">
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={device.qty}
                    onChange={(e) => onUpdateDevice(device.id, { qty: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-14 h-7 font-mono bg-input border-input-border text-center mx-auto text-core"
                  />
                </div>
                <div className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveDevice(device.id)}
                    className="h-7 w-7 p-0 border-destructive/40 text-destructive hover:bg-destructive/10 mx-auto"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Compute Power Capacity */}
      <div className="mb-4 pt-3 border-t border-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-help text-core">Total Compute Power Available</div>
          <InfoTooltip content="Your hardware's maximum processing capacity. Adding more nodes increases your compute power (IPS = Inferences Per Second)." />
        </div>
        
        {/* Available Capacity */}
        <div className="flex items-center gap-4 mb-3">
          <div className="text-core text-foreground">
            <span className="font-semibold text-number-blue">{totalCapacityIPS.toLocaleString()}</span> IPS available
          </div>
          <div className="text-core text-muted-foreground">
            = <span className="font-mono">{(totalCapacityMonthly / 1_000_000).toFixed(1)}M</span> calls/month max capacity
          </div>
        </div>

        {/* Current Usage */}
        <div className="flex items-center gap-4 mb-3">
          <div className="text-core text-foreground">
            <span className="font-semibold text-primary">{actualUsedIPS.toLocaleString()}</span> IPS being used
          </div>
          <div className="text-core text-muted-foreground">
            = <span className="font-mono">{(actualUsedMonthly / 1_000_000).toFixed(1)}M</span> calls/month actual usage
          </div>
        </div>
        
        {/* Utilization Bar */}
        <div className="relative w-full h-5 bg-muted/30 rounded-md overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-300"
            style={{ width: `${utilizationPercentage}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center px-2 text-core font-medium">
            <span className="text-foreground">
              {utilizationPercentage.toFixed(0)}% utilization
            </span>
          </div>
        </div>
        
        <div className="flex justify-between text-core text-muted-foreground mt-1">
          <span>0% (idle)</span>
          <span>100% (full capacity)</span>
        </div>
      </div>

      {/* Device Picker */}
      <div className="pt-3 border-t border-border">
        <div className="text-core font-medium text-foreground mb-2">Approved Hardware Catalog</div>
        <div className="flex flex-wrap gap-1.5">
          {CATALOG.map(device => (
            <Button
              key={device.id}
              variant="outline"
              size="sm"
              onClick={() => onAddDevice(device.id)}
              className="h-7 px-2 border-input-border hover:border-glass-border text-core"
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