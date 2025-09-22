import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface InfoTooltipProps {
  content: string;
  className?: string;
}

export function InfoTooltip({ content, className = "" }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`cursor-help font-bold text-yellow-500 ${className}`}>
            (i)
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-md p-5">
          <p className="text-lg">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}