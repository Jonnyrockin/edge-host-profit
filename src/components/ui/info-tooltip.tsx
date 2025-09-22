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
          <span className={`cursor-pointer font-bold text-yellow-500 ${className}`}>
            (i)
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-md p-5 shadow-[0_20px_60px_-10px] shadow-black/10">
          <p className="text-lg">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}