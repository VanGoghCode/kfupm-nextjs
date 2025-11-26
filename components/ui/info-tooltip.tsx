"use client";

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoTooltipProps {
  term?: string;
  description: string;
}

export function InfoTooltip({ term, description }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 cursor-help">
            {term && (
              <span className="border-b border-dotted border-slate-400">
                {term}
              </span>
            )}
            <Info className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-slate-900 text-slate-50 border-slate-800">
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
