import React from 'react';
import { Home, Server, TrendingUp, Upload, FileCheck, Terminal, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'nodes', label: 'My Nodes', icon: Server },
  { id: 'earnings', label: 'Earnings', icon: TrendingUp },
  { id: 'upload', label: 'Upload & Test', icon: Upload },
  { id: 'compliance', label: 'Compliance', icon: FileCheck },
  { id: 'logs', label: 'Logs', icon: Terminal },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeSection = 'dashboard', onSectionChange }: SidebarProps) {
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          HyperEdgeX
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Host Area Hermes</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange?.(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all",
                    "text-sm font-medium",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center justify-between">
            <span>Network Health:</span>
            <span className="text-success font-semibold">GOOD</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Volume:</span>
            <span className="text-primary font-semibold">70.7%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
