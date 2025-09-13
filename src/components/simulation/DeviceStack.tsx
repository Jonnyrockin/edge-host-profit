import React from 'react';
import { Device, SimulationState, CalculationResult } from '../../types/simulation';
import { CATALOG } from '../../data/constants';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Trash2, Cpu, HardDrive, MemoryStick, DollarSign } from 'lucide-react';
import { Progress } from '../ui/progress';
import { InfoTooltip } from '../ui/info-tooltip';
interface DeviceStackProps {
  devices: Device[];
  state: SimulationState;
  calculations: CalculationResult;
  onAddDevice: (deviceId: string) => void;
  onUpdateDevice: (deviceId: string, updates: Partial<Device>) => void;
  onRemoveDevice: (deviceId: string) => void;
}
export function DeviceStack({
  devices,
  state,
  calculations,
  onAddDevice,
  onUpdateDevice,
  onRemoveDevice
}: DeviceStackProps) {
  const totalCapacity = calculations.inventoryIPS;
  const usedCapacity = totalCapacity * calculations.util;
  const utilizationPercentage = Math.round(calculations.util * 100);
  const inferenceNodes = CATALOG.filter(device => device.category === 'inference');
  const memoryNodes = CATALOG.filter(device => device.category === 'memory');
  return <div className="bg-card border border-border p-panel-padding mb-panel rounded-none">
      <div className="flex items-center justify-between mb-lg">
        <div className="text-headline font-semibold text-foreground">Node Stack</div>
        <div className="text-help text-core">
          Add devices from the catalog. Quantity = how many identical nodes you operate.
        </div>
      </div>

      {/* Device Table */}
      <div className="mb-4">
        {/* Header Row */}
        <div className="grid grid-cols-8 gap-4 items-center py-2 text-help border-b border-border">
          <div className="text-left text-core">Device</div>
          <div className="text-left text-core">Vendor</div>
          <div className="text-left text-core flex items-center gap-1 mx-[59px]">
            Latency
            <InfoTooltip content="Response time categories: <25ms (ultra-fast), 25-50ms (fast), 50-100ms (standard). Lower latency commands premium pricing." />
          </div>
          <div className="text-right text-core flex items-center gap-1 justify-end">
            TOPS
            <InfoTooltip content="Tera Operations Per Second - raw compute power for AI workloads. Higher TOPS = better performance for complex models." />
          </div>
          <div className="text-right text-core flex items-center gap-1 justify-end">
            Price
            <InfoTooltip content="Approximate unit price in USD. Higher-end systems cost more but deliver superior performance and capabilities." />
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
        {devices.length === 0 ? <div className="text-help py-4 text-center text-core">
            No devices yet. Use the catalog below.
          </div> : [...devices].reverse().map(device => <div key={device.id} className="border border-muted rounded-md p-1 mx-0 px-px my-[10px] py-px bg-gray-800">
              <div className="grid grid-cols-8 gap-4 items-center min-h-[22px] bg-blue-500 py-px my-0">
                <div className="text-foreground text-core font-normal px-[7px]">{device.label}</div>
                <div className="text-foreground text-core mx-[7px]">{device.vendor}</div>
                <div className="text-right text-foreground text-core py-0 mx-[30px]">{device.latencyTier}</div>
                <div className="text-right text-foreground text-core">{device.tops?.toLocaleString() || 'N/A'}</div>
                <div className="text-right text-foreground text-core">
                  {device.price === 0 ? 'Vizrt' : `$${(device.price / 1000).toFixed(0)}K`}
                </div>
                <div className="text-right text-foreground text-core">{device.ips}</div>
                <div className="text-center mx-[24px] my-0 px-0 py-[3px]">
                  <Input type="number" min="0" step="1" value={device.qty} onChange={e => onUpdateDevice(device.id, {
              qty: Math.max(0, parseInt(e.target.value) || 0)
            })} className="w-14 h-7 font-mono border-input-border text-center text-core bg-blue-400 mx-[20px]" />
                </div>
                <div className="text-center">
                  <Button variant="outline" size="sm" onClick={() => onRemoveDevice(device.id)} className="h-7 w-7 p-0 border-destructive/40 mx-auto text-yellow-500 text-base bg-orange-800 hover:bg-orange-700">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>)}
      </div>

      {/* Compute Power Capacity */}
      <div className="mb-4 pt-3 border-t border-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-help text-core">Total Compute Power Available</div>
          <InfoTooltip content="Your hardware's maximum processing capacity. Adding more nodes increases your compute power (IPS = Inferences Per Second)." />
        </div>
        
        {/* Available Capacity */}
        <div className="flex items-center justify-between mb-panel-gap">
          <div>
            <div className="text-core text-foreground">
              <span className="font-semibold text-number-blue">{totalCapacity.toLocaleString()}</span> IPS available
            </div>
            <div className="text-core text-muted-foreground">
              = <span className="font-mono">{(totalCapacity * state.secondsInMonth / 1_000_000).toFixed(1)}M</span> calls/month max capacity
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-core text-foreground">
              <span className="font-semibold text-primary">{usedCapacity.toLocaleString()}</span> IPS being used
            </div>
            <div className="text-core text-muted-foreground">
              = <span className="font-mono">{(usedCapacity * state.secondsInMonth / 1_000_000).toFixed(1)}M</span> calls/month actual usage
            </div>
          </div>
        </div>
        
        {/* Utilization Bar */}
        <div className="relative w-full h-6 rounded-md overflow-hidden bg-zinc-700 py-0 my-[12px] px-0">
          <div className="h-full bg-slider-blue transition-all duration-300" style={{
          width: `${utilizationPercentage}%`
        }} />
          <div className="absolute top-0 h-full flex items-center" style={{
          left: `${utilizationPercentage}%`,
          transform: 'translateX(8px)'
        }}>
            <span className="text-headline font-semibold text-foreground whitespace-nowrap">
              {utilizationPercentage.toFixed(0)}% utilization
            </span>
          </div>
        </div>
        
        <div className="flex justify-between text-core text-muted-foreground mt-1">
          <span>0% (idle)</span>
          <span>100% (full capacity)</span>
        </div>
      </div>

      {/* Hardware Catalog */}
      <div className="mt-8">
        <div className="text-xl font-semibold text-center mb-6 text-primary tracking-wide bg-gray-300">
          CERTIFIED HARDWARE CATALOGUE
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Inference-Optimized Nodes */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              
              <h3 className="font-semibold text-foreground text-xl">AI Inference-Optimized Nodes</h3>
              <InfoTooltip content="Built for raw throughput — maximizing GPU density to process AI tasks at scale. Critical for video, image, and high-volume chat workloads." />
            </div>
            
            <div className="space-y-3">
              {inferenceNodes.map(device => <div key={device.id} onClick={() => onAddDevice(device.id)} className="group cursor-pointer bg-gradient-to-br from-card/50 to-muted/20 hover:from-primary/10 hover:to-primary/5 border border-border hover:border-primary/30 p-3 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 rounded-none">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white group-hover:text-primary">
                        {device.vendor} {device.label}
                      </div>
                      <div className="text-xs text-gray-400">
                        {device.formFactor} • {device.latencyTier}
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <div className="text-sm font-bold text-white">
                        {device.price === 0 ? 'Vizrt' : `$${(device.price / 1000).toFixed(0)}K`}
                      </div>
                      <div className="text-xs text-gray-400">
                        {device.price === 0 ? 'owned' : 'per unit'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                    <div className="bg-card/50 rounded px-2 py-1 text-center">
                      <div className="text-gray-400 flex items-center justify-center gap-1">
                        <Cpu className="w-3 h-3" />
                        TOPS
                      </div>
                      <div className="font-semibold text-white text-xs">
                        {device.tops.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-card/50 rounded px-2 py-1 text-center">
                      <div className="text-gray-400">IPS</div>
                      <div className="font-semibold text-white text-xs">
                        {device.ips}
                      </div>
                    </div>
                    <div className="bg-card/50 rounded px-2 py-1 text-center">
                      <div className="text-gray-400 flex items-center justify-center gap-1">
                        <MemoryStick className="w-3 h-3" />
                        MEM
                      </div>
                      <div className="font-semibold text-white text-xs">
                        {device.memory.split(' ')[0]}
                      </div>
                    </div>
                    <div className="bg-card/50 rounded px-2 py-1 text-center">
                      <div className="text-gray-400">LAT</div>
                      <div className="font-semibold text-white text-xs">
                        {device.latencyTier}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400 flex-1">
                      <div className="truncate">{device.maxGpus}</div>
                    </div>
                    <div className="text-xs text-white font-medium group-hover:text-primary ml-2">
                      + Add to Stack
                    </div>
                  </div>
                </div>)}
            </div>
          </div>

          {/* AI Memory Nodes */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              
              <h3 className="text-foreground font-semibold text-xl">AI Memory Nodes</h3>
              <InfoTooltip content="Designed for large context windows and memory-heavy inference. Critical for LLM agents, compliance, and RAG workflows." />
            </div>
            
            <div className="space-y-3">
              {memoryNodes.map(device => <div key={device.id} onClick={() => onAddDevice(device.id)} className="group cursor-pointer bg-gradient-to-br from-card/50 to-muted/20 hover:from-primary/10 hover:to-primary/5 border border-border hover:border-primary/30 p-3 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 rounded-none">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white group-hover:text-primary">
                        {device.vendor} {device.label}
                      </div>
                      <div className="text-xs text-gray-400">
                        {device.formFactor} • {device.latencyTier}
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <div className="text-sm font-bold text-white">
                        {device.price === 0 ? 'Vizrt' : `$${(device.price / 1000).toFixed(0)}K`}
                      </div>
                      <div className="text-xs text-gray-400">
                        {device.price === 0 ? 'owned' : 'per unit'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                    <div className="bg-card/50 rounded px-2 py-1 text-center">
                      <div className="text-gray-400 flex items-center justify-center gap-1">
                        <Cpu className="w-3 h-3" />
                        TOPS
                      </div>
                      <div className="font-semibold text-white text-xs">
                        {device.tops.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-card/50 rounded px-2 py-1 text-center">
                      <div className="text-gray-400">IPS</div>
                      <div className="font-semibold text-white text-xs">
                        {device.ips}
                      </div>
                    </div>
                    <div className="bg-card/50 rounded px-2 py-1 text-center">
                      <div className="text-gray-400 flex items-center justify-center gap-1">
                        <MemoryStick className="w-3 h-3" />
                        MEM
                      </div>
                      <div className="font-semibold text-white text-xs">
                        {device.memory.split(' ')[0]}
                      </div>
                    </div>
                    <div className="bg-card/50 rounded px-2 py-1 text-center">
                      <div className="text-gray-400">LAT</div>
                      <div className="font-semibold text-white text-xs">
                        {device.latencyTier}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400 flex-1">
                      <div className="truncate">{device.maxGpus}</div>
                    </div>
                    <div className="text-xs text-white font-medium group-hover:text-primary ml-2">
                      + Add to Stack
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>;
}