'use client';

import { Citation } from '@/types';
import { BookOpen } from 'lucide-react';

interface CitationListProps {
    citations: Citation[];
}

export default function CitationList({ citations }: CitationListProps) {
    if (!citations || citations.length === 0) {
        return null;
    }

    return (
        <div className="mt-3 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs font-medium text-slate-600">Sources</p>
            </div>
            <div className="space-y-1.5">
                {citations.map((citation, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-2 text-xs text-slate-600 bg-white/50 px-3 py-2 rounded-lg"
                    >
                        <span className="text-primary font-medium">•</span>
                        <div className="flex-1">
                            <span className="text-slate-700 font-medium">{citation.source_file}</span>
                            <span className="text-slate-400"> — </span>
                            <span className="text-slate-600">Page {citation.page_number}</span>
                            {citation.text && (
                                <p className="text-slate-500 mt-1 line-clamp-2">{citation.text}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
