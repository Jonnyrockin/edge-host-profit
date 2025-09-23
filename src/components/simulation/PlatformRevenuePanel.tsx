import { InfoTooltip } from '../ui/info-tooltip';

export function PlatformRevenuePanel() {
  return (
    <div className="bg-card/75 border border-border rounded-none p-panel-padding mb-panel">
      <div className="flex items-center justify-between mb-md">
        <div className="flex items-center gap-md">
          <div className="text-headline font-semibold text-foreground">Platform Revenue Share</div>
          <InfoTooltip content="Fixed 25% revenue share with the platform provider. This covers infrastructure, support, and business development." />
        </div>
        <div className="px-md py-xs inline-block bg-secondary border border-border rounded-none text-secondary-foreground select-none">
          25% (fixed)
        </div>
      </div>
      
      <div className="text-help text-core text-sm">
        <strong>What the Federation provides:</strong> Global network orchestration, customer acquisition and billing, technical support infrastructure, compliance and security monitoring, load balancing and traffic routing, business development partnerships, legal framework and contracts, insurance coverage, and continuous platform development and maintenance.
      </div>
    </div>
  );
}