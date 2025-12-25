'use client';

import { useState } from 'react';
import { Citation } from '@/types';

interface CitationChipProps {
    citation: Citation;
    index: number;
}

export default function CitationChip({ citation, index }: CitationChipProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="relative inline-block">
            <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="
          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
          bg-secondary/10 border border-secondary/30
          hover:bg-secondary/20 hover:border-secondary/40
          transition-all duration-200
          text-xs font-medium text-text-primary
          hover:shadow-lg hover:shadow-secondary/10
        "
            >
                <span className="text-secondary">[</span>
                <span className="truncate max-w-[100px]">{citation.source_file}</span>
                <span className="text-text-secondary">–</span>
                <span className="text-secondary">Page {citation.page_number}]</span>
            </button>

            {/* Tooltip */}
            {showTooltip && (
                <div className="
          absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
          px-3 py-2 rounded-lg
          bg-panel border border-secondary/30
          text-xs text-text-primary
          whitespace-nowrap
          z-50
          shadow-lg
        ">
                    <div className="font-medium">{citation.source_file}</div>
                    <div className="text-text-secondary mt-0.5">Page {citation.page_number}</div>
                    {citation.text && (
                        <div className="text-text-secondary mt-1 max-w-xs truncate">
                            {citation.text}
                        </div>
                    )}
                    {/* Arrow */}
                    <div className="
            absolute top-full left-1/2 transform -translate-x-1/2
            w-2 h-2 rotate-45
            bg-panel border-r border-b border-secondary/30
          " />
                </div>
            )}
        </div>
    );
}
