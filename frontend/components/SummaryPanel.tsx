'use client';

import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Document, SummaryResponse } from '@/types';
import CitationChip from './CitationChip';

interface SummaryPanelProps {
    documents: Document[];
    summary: SummaryResponse | null;
    summaryStatus: 'idle' | 'loading' | 'success' | 'error';
    summaryError: string | null;
}

export default function SummaryPanel({ documents, summary, summaryStatus, summaryError }: SummaryPanelProps) {
    const selectedDocs = documents.filter(doc => doc.selected);
    const documentCount = documents.length;

    if (documentCount === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-16 h-16 bg-secondary/10 border border-secondary/20 rounded-2xl flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    No documents uploaded
                </h3>
                <p className="text-sm text-text-secondary max-w-md">
                    Upload documents to see their combined summary here.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b border-gray-800 bg-panel px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary">Document Summary</h2>
                        <p className="text-sm text-text-secondary mt-1">
                            Combined summary from {documentCount} {documentCount === 1 ? 'document' : 'documents'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
                {/* Loading State */}
                {summaryStatus === 'loading' && (
                    <div className="bg-panel border border-gray-800 rounded-2xl p-8 text-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                        <p className="text-text-primary font-medium">Generating summary...</p>
                        <p className="text-text-secondary text-sm mt-2">
                            Analyzing {documentCount} {documentCount === 1 ? 'document' : 'documents'}
                        </p>
                    </div>
                )}

                {/* Error State */}
                {summaryStatus === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-400 font-medium">Summarization failed</p>
                                <p className="text-text-primary text-sm mt-1">{summaryError}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success State */}
                {summaryStatus === 'success' && summary && (
                    <div className="bg-panel border border-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-secondary" />
                            <h3 className="text-lg font-semibold text-text-primary">
                                Combined Summary
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <p className="text-text-primary leading-relaxed whitespace-pre-wrap">
                                {summary.summary}
                            </p>

                            {/* Document count badge */}
                            <div className="pt-3 border-t border-gray-800">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/10 border border-secondary/20 rounded-full">
                                    <span className="text-xs text-secondary font-medium">
                                        Summary generated from {documentCount} {documentCount === 1 ? 'document' : 'documents'}
                                    </span>
                                </div>
                            </div>

                            {/* Citations */}
                            {summary.citations && summary.citations.length > 0 && (
                                <div className="pt-4 border-t border-gray-800">
                                    <p className="text-sm font-medium text-text-primary mb-3">Sources</p>
                                    <div className="flex flex-wrap gap-2">
                                        {summary.citations.map((citation, index) => (
                                            <CitationChip key={index} citation={citation} index={index} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Idle State */}
                {summaryStatus === 'idle' && (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6">
                        <div className="w-16 h-16 bg-secondary/10 border border-secondary/20 rounded-2xl flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-secondary" />
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">
                            Upload documents to begin
                        </h3>
                        <p className="text-sm text-text-secondary max-w-md">
                            Summary will be generated automatically after upload completes.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
