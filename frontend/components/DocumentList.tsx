'use client';

import { Document } from '@/types';
import { FileText, Check, Trash2 } from 'lucide-react';

interface DocumentListProps {
    documents: Document[];
    onToggleDocument: (id: string) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    onDeleteDocument: (id: string) => void;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
}

export default function DocumentList({
    documents,
    onToggleDocument,
    onSelectAll,
    onDeselectAll,
    onDeleteDocument,
}: DocumentListProps) {
    const selectedCount = documents.filter(doc => doc.selected).length;
    const allSelected = documents.length > 0 && selectedCount === documents.length;

    if (documents.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="w-12 h-12 bg-panel border border-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-text-secondary" />
                </div>
                <p className="text-sm text-text-secondary">No documents uploaded yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                <p className="text-xs text-text-secondary">
                    {selectedCount} of {documents.length} selected
                </p>
                <button
                    onClick={allSelected ? onDeselectAll : onSelectAll}
                    className="text-xs text-primary hover:text-indigo-400 font-medium transition-colors"
                >
                    {allSelected ? 'Deselect All' : 'Select All'}
                </button>
            </div>

            {/* Document list */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {documents.map((doc) => (
                    <div
                        key={doc.id}
                        className={`
              group relative flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer
              ${doc.selected
                                ? 'bg-primary/10 border-primary/30 hover:border-primary/50'
                                : 'bg-panel border-gray-800 hover:border-gray-700'
                            }
            `}
                        onClick={() => onToggleDocument(doc.id)}
                    >
                        {/* Checkbox */}
                        <div className="flex-shrink-0 mt-0.5">
                            <div
                                className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                  ${doc.selected
                                        ? 'bg-primary border-primary'
                                        : 'border-gray-600 group-hover:border-gray-500'
                                    }
                `}
                            >
                                {doc.selected && <Check className="w-3 h-3 text-white" />}
                            </div>
                        </div>

                        {/* Document info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 text-text-secondary flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-text-primary truncate">
                                        {doc.filename}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-xs text-text-secondary">
                                            {doc.pageCount} {doc.pageCount === 1 ? 'page' : 'pages'}
                                        </p>
                                        <p className="text-xs text-text-secondary">
                                            {formatDate(doc.uploadedAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delete button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteDocument(doc.id);
                            }}
                            className="
                flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity
                p-1.5 rounded-lg hover:bg-red-500/10 text-text-secondary hover:text-red-400
              "
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
