// Host Revenue Simulator MVP - Main Component

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { SimulatorConfig, SelectedNode } from '../../types/simulator';
import { calculateSimulatorResults, getValidationResults } from '../../utils/simulator-calculations';
import { 
  CITIES, 
  INDUSTRY_UPLIFTS, 
  LATENCY_MULTIPLIERS, 
  ESG_TIERS, 
  HARDWARE_CATALOG, 
  SIMULATOR_SCENARIOS 
} from '../../data/simulator-data';

const DEFAULT_CONFIG: SimulatorConfig = {
  selectedCity: 'New York',
  selectedIndustry: 'Generic',
  selectedLatencyCategory: 'below',
  selectedESGTier: 'None',
  selectedNodes: [],
  isDynamicCallsEnabled: true,
  manualCallsPerJob: 4,
  agenticAdoption: 80,
  currentYear: 2025,
  complexityFactor: 2.0,
  hybridOverhead: 1,
  selectedScenario: 'Median',
  energyPricePerKWh: 0.12
};

export function Simulator() {
  const [config, setConfig] = useState<SimulatorConfig>(DEFAULT_CONFIG);
  
  const results = useMemo(() => calculateSimulatorResults(config), [config]);
  const validation = useMemo(() => getValidationResults(results), [results]);
  
  const updateConfig = (updates: Partial<SimulatorConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };
  
  const addNode = (hardwareId: string) => {
    const existingIndex = config.selectedNodes.findIndex(n => n.hardwareId === hardwareId);
    if (existingIndex >= 0) {
      const newNodes = [...config.selectedNodes];
      newNodes[existingIndex].quantity += 1;
      updateConfig({ selectedNodes: newNodes });
    } else {
      updateConfig({
        selectedNodes: [...config.selectedNodes, { hardwareId, quantity: 1 }]
      });
    }
  };
  
  const updateNodeQuantity = (hardwareId: string, quantity: number) => {
    if (quantity <= 0) {
      updateConfig({
        selectedNodes: config.selectedNodes.filter(n => n.hardwareId !== hardwareId)
      });
    } else {
      const newNodes = config.selectedNodes.map(n => 
        n.hardwareId === hardwareId ? { ...n, quantity } : n
      );
      updateConfig({ selectedNodes: newNodes });
    }
  };
  
  const getValidationColor = (status: 'green' | 'yellow' | 'red') => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Host Revenue Simulator MVP</h1>
          <p className="text-muted-foreground">Edge Compute Economics Dashboard</p>
        </div>

        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monthly Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {results.monthlyCallsTotal.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Price/Call</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ${results.pricePerCall.toFixed(4)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Gross Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ${results.grossRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ${results.netRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Traffic Lights Validation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Validation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${getValidationColor(validation.inputs)}`}></div>
                <span className="text-sm">Inputs Valid</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${getValidationColor(validation.price)}`}></div>
                <span className="text-sm">Price Positive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${getValidationColor(validation.nodes)}`}></div>
                <span className="text-sm">≥1 Node</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Market Context */}
            <Card>
              <CardHeader>
                <CardTitle>Market Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>City</Label>  
                    <Select value={config.selectedCity} onValueChange={(value) => updateConfig({ selectedCity: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border">
                        {CITIES.map(city => (
                          <SelectItem key={city.name} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Industry</Label>
                    <Select value={config.selectedIndustry} onValueChange={(value) => updateConfig({ selectedIndustry: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border">
                        {INDUSTRY_UPLIFTS.map(industry => (
                          <SelectItem key={industry.name} value={industry.name}>
                            {industry.name} ({industry.multiplier}×)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Latency Category</Label>
                    <Select value={config.selectedLatencyCategory} onValueChange={(value) => updateConfig({ selectedLatencyCategory: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border">
                        {LATENCY_MULTIPLIERS.map(latency => (
                          <SelectItem key={latency.category} value={latency.category}>
                            {latency.threshold} ({latency.multiplier}×)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>ESG Tier</Label>
                    <Select value={config.selectedESGTier} onValueChange={(value) => updateConfig({ selectedESGTier: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border">
                        {ESG_TIERS.map(esg => (
                          <SelectItem key={esg.name} value={esg.name}>
                            {esg.name} {esg.uplift > 0 && `(+${esg.uplift}%)`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scenario Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={config.selectedScenario} onValueChange={(value) => updateConfig({ selectedScenario: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border">
                    {SIMULATOR_SCENARIOS.map(scenario => (
                      <SelectItem key={scenario.name} value={scenario.name}>
                        {scenario.name} (util {(scenario.utilization * 100).toFixed(0)}%, price {scenario.priceMultiplier}×, CPJ {scenario.baseCPJ})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Workload Modeling */}
            <Card>
              <CardHeader>
                <CardTitle>Workload Modeling</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.isDynamicCallsEnabled}
                    onCheckedChange={(checked) => updateConfig({ isDynamicCallsEnabled: checked })}
                  />
                  <Label>Dynamic Calls/Job Formula</Label>
                </div>
                
                {config.isDynamicCallsEnabled ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Agentic Adoption: {config.agenticAdoption}%</Label>
                      <Slider
                        value={[config.agenticAdoption]}
                        onValueChange={([value]) => updateConfig({ agenticAdoption: value })}
                        max={100}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label>Year: {config.currentYear}</Label>
                      <Slider
                        value={[config.currentYear]}
                        onValueChange={([value]) => updateConfig({ currentYear: value })}
                        min={2025}
                        max={2030}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label>Complexity Factor: {config.complexityFactor.toFixed(1)}</Label>
                      <Slider
                        value={[config.complexityFactor]}
                        onValueChange={([value]) => updateConfig({ complexityFactor: value })}
                        min={1.0}
                        max={3.0}
                        step={0.1}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label>Hybrid Overhead</Label>
                      <Input
                        type="number"
                        value={config.hybridOverhead}
                        onChange={(e) => updateConfig({ hybridOverhead: parseInt(e.target.value) || 0 })}
                        min={0}
                        max={10}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label>Manual Calls/Job</Label>
                    <Input
                      type="number"
                      value={config.manualCallsPerJob}
                      onChange={(e) => updateConfig({ manualCallsPerJob: parseInt(e.target.value) || 1 })}
                      min={1}
                      className="mt-1"
                    />
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground">
                  Current Calls/Job: <span className="font-medium">{results.callsPerJob.toFixed(1)}</span>
                </div>
              </CardContent>
            </Card>

            {/* OPEX */}
            <Card>
              <CardHeader>
                <CardTitle>OPEX Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Energy Price ($/kWh)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={config.energyPricePerKWh}
                    onChange={(e) => updateConfig({ energyPricePerKWh: parseFloat(e.target.value) || 0.12 })}
                    className="mt-1"
                  />
                </div>
                
                <div className="text-sm space-y-1">
                  <div>Energy Cost: ${results.energyCost.toLocaleString()}</div>
                  <div>Platform Fee (25%): ${results.platformFee.toLocaleString()}</div>
                  <div>Total OPEX: ${results.totalOPEX.toLocaleString()}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Hardware & Results */}
          <div className="space-y-6">
            {/* Selected Hardware */}
            <Card>
              <CardHeader>
                <CardTitle>Selected Hardware</CardTitle>
              </CardHeader>
              <CardContent>
                {config.selectedNodes.length === 0 ? (
                  <p className="text-muted-foreground">No nodes selected</p>
                ) : (
                  <div className="space-y-2">
                    {config.selectedNodes.map(node => {
                      const hardware = HARDWARE_CATALOG.find(h => h.id === node.hardwareId);
                      return hardware ? (
                        <div key={node.hardwareId} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex-1">
                            <div className="font-medium">{hardware.model}</div>
                            <div className="text-sm text-muted-foreground">
                              {hardware.ips} IPS • {hardware.powerConsumptionKW} kW
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={node.quantity}
                              onChange={(e) => updateNodeQuantity(node.hardwareId, parseInt(e.target.value) || 0)}
                              min="0"
                              className="w-16"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateNodeQuantity(node.hardwareId, 0)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : null;
                    })}
                    
                    <Separator className="my-4" />
                    <div className="text-sm font-medium">
                      Total: {results.totalIPS} IPS • {results.totalPowerKW.toFixed(1)} kW
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hardware Catalog */}
            <Card>
              <CardHeader>
                <CardTitle>Certified Hardware Catalog</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {HARDWARE_CATALOG.map(hardware => (
                    <div key={hardware.id} className="p-3 border rounded hover:bg-muted/50 cursor-pointer" onClick={() => addNode(hardware.id)}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{hardware.model}</div>
                          <div className="text-sm text-muted-foreground">
                            {hardware.vendor} • {hardware.ips} IPS • {hardware.powerConsumptionKW} kW
                          </div>
                        </div>
                        <Badge variant={hardware.category === 'inference' ? 'default' : 'secondary'}>
                          {hardware.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Math Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Calculation Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>
                  <strong>Monthly Calls:</strong> IPS({results.totalIPS}) × Calls/job({results.callsPerJob.toFixed(1)}) × Util({SIMULATOR_SCENARIOS.find(s => s.name === config.selectedScenario)?.utilization || 0}) × Seconds(2,592,000) = {results.monthlyCallsTotal.toLocaleString()}
                </div>
                <div>
                  <strong>Price/Call:</strong> Base(${CITIES.find(c => c.name === config.selectedCity)?.baselinePricePerCall.toFixed(4)}) × Industry({INDUSTRY_UPLIFTS.find(i => i.name === config.selectedIndustry)?.multiplier}×) × Latency({LATENCY_MULTIPLIERS.find(l => l.category === config.selectedLatencyCategory)?.multiplier}×) × Scenario({SIMULATOR_SCENARIOS.find(s => s.name === config.selectedScenario)?.priceMultiplier}×) × ESG({1 + ((ESG_TIERS.find(e => e.name === config.selectedESGTier)?.uplift || 0) / 100)}×) = ${results.pricePerCall.toFixed(4)}
                </div>
                <div>
                  <strong>Gross Revenue:</strong> {results.monthlyCallsTotal.toLocaleString()} × ${results.pricePerCall.toFixed(4)} = ${results.grossRevenue.toLocaleString()}
                </div>
                <div>
                  <strong>Net Revenue:</strong> ${results.grossRevenue.toLocaleString()} - ${results.platformFee.toLocaleString()} (fee) - ${results.totalOPEX.toLocaleString()} (OPEX) = ${results.netRevenue.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}