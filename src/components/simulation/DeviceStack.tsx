import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Trash2 } from 'lucide-react';
import { Device } from '../../types/simulation';
import { CATALOG } from '../../data/constants';

interface DeviceStackProps {
  devices: Device[];
  onAddDevice: (deviceId: string) => void;
  onUpdateDevice: (deviceId: string, updates: Partial<Device>) => void;
  onRemoveDevice: (deviceId: string) => void;
}

export function DeviceStack({ devices, onAddDevice, onUpdateDevice, onRemoveDevice }: DeviceStackProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 mt-4">
      <div className="text-lg font-semibold text-foreground">Node Stack</div>
      <div className="text-help text-sm mb-2">
        Add device rows from the catalog. Quantity = how many identical nodes you operate.
      </div>
      
      {/* Device Picker */}
      <div className="flex flex-wrap gap-2 mb-4">
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

      {/* Device Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-help">
            <tr>
              <th className="text-left py-2">Device</th>
              <th className="text-left py-2">Vendor</th>
              <th className="text-right py-2">Latency</th>
              <th className="text-right py-2">IPS / row</th>
              <th className="text-right py-2">Qty</th>
              <th className="text-right py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-help py-4 text-center">
                  No devices yet. Use the catalog above.
                </td>
              </tr>
            ) : (
              devices.map(device => (
                <tr key={device.id} className="border-t border-border">
                  <td className="py-2 text-foreground">{device.label}</td>
                  <td className="py-2 text-foreground">{device.vendor}</td>
                  <td className="py-2 text-right text-foreground">{device.latencyTier}</td>
                  <td className="py-2 text-right text-foreground">{device.ips}</td>
                  <td className="py-2 text-right">
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={device.qty}
                      onChange={(e) => onUpdateDevice(device.id, { qty: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-20 font-mono bg-input border-input-border"
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
    </div>
  );
}