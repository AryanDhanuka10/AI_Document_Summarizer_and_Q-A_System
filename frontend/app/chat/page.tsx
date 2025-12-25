'use client';

import { useState } from 'react';
import { ArrowLeft, FileText, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import UploadBox from '@/components/UploadBox';
import DocumentList from '@/components/DocumentList';
import ChatLauncher from '@/components/ChatLauncher';
import ChatWindow from '@/components/ChatWindow';
import ChatInterface from '@/components/ChatInterface';
import SummaryPanel from '@/components/SummaryPanel';
import { Document, UploadResponse, SummaryResponse } from '@/types';
import { summarizeUploadedDocuments } from '@/lib/api';
import { resetSession } from '@/lib/utils';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
type SummaryStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ChatPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [activeTab, setActiveTab] = useState<'chat' | 'summaries'>('chat');
    const [isChatOpen, setIsChatOpen] = useState(false);

    // CRITICAL: State management for upload → summarize → chat flow
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
    const [summaryStatus, setSummaryStatus] = useState<SummaryStatus>('idle');
    const [summary, setSummary] = useState<SummaryResponse | null>(null);
    const [summaryError, setSummaryError] = useState<string | null>(null);
    const [documentCount, setDocumentCount] = useState(0);

    // CRITICAL: Store uploaded filenames for chat requests
    const [uploadedFilenames, setUploadedFilenames] = useState<string[]>([]);
    const [sessionId, setSessionId] = useState<string>('');

    const selectedDocuments = documents.filter(doc => doc.selected);

    // Chat is enabled ONLY after summary succeeds
    const chatEnabled = summaryStatus === 'success' && selectedDocuments.length > 0;

    // CRITICAL: This is called after upload succeeds
    const handleUploadSuccess = async (dataArray: UploadResponse[]) => {
        console.log('Upload succeeded, starting summarization flow');

        // Step 1: Store uploaded documents
        const newDocuments: Document[] = dataArray.map((data, index) => ({
            id: (Date.now() + index).toString(),
            filename: data.filename,
            sessionId: data.session_id,
            pageCount: data.page_count,
            uploadedAt: new Date().toISOString(),
            selected: true,
        }));

        setDocuments(prev => [...prev, ...newDocuments]);
        setDocumentCount(prev => prev + newDocuments.length);
        setUploadStatus('success');

        // Step 2: CRITICAL - Call POST /summarize/upload with session_id from localStorage
        setSummaryStatus('loading');
        setSummaryError(null);

        try {
            console.log('Calling POST /summarize/upload');
            const summaryResponse = await summarizeUploadedDocuments();

            console.log('Summarization succeeded:', summaryResponse);
            setSummary(summaryResponse);
            setSummaryStatus('success');

            // Now chat is enabled
        } catch (error) {
            console.error('Summarization failed:', error);
            setSummaryError(error instanceof Error ? error.message : 'Failed to generate summary');
            setSummaryStatus('error');
        }
    };

    const handleToggleDocument = (id: string) => {
        setDocuments(prev =>
            prev.map(doc =>
                doc.id === id ? { ...doc, selected: !doc.selected } : doc
            )
        );
    };

    const handleSelectAll = () => {
        setDocuments(prev => prev.map(doc => ({ ...doc, selected: true })));
    };

    const handleDeselectAll = () => {
        setDocuments(prev => prev.map(doc => ({ ...doc, selected: false })));
    };

    const handleDeleteDocument = (id: string) => {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
        setDocumentCount(prev => Math.max(0, prev - 1));
    };

    // Determine chatbot status
    const getChatbotStatus = () => {
        if (summaryStatus === 'loading') return 'Indexing Documents...';
        if (summaryStatus === 'success') return 'Ready';
        if (summaryStatus === 'error') return 'Error';
        return 'Upload documents to begin';
    };

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Top Navigation Bar */}
            <header className="border-b border-gray-800 bg-panel shadow-lg">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-semibold text-text-primary">
                                Document Workspace
                            </h1>
                            <p className="text-sm text-text-secondary">
                                AI-powered document intelligence
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <button
                            onClick={() => resetSession()}
                            className="flex items-center gap-2 px-3 py-1.5 bg-panel border border-gray-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group"
                            title="Start a new session"
                        >
                            <RotateCcw className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" />
                            <span className="text-text-secondary group-hover:text-primary transition-colors">New Session</span>
                        </button>
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>{documentCount} {documentCount === 1 ? 'document' : 'documents'}</span>
                        </div>
                        {selectedDocuments.length > 0 && (
                            <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                                <span className="text-primary font-medium">
                                    {selectedDocuments.length} selected
                                </span>
                            </div>
                        )}
                        {summaryStatus === 'success' && (
                            <div className="px-3 py-1 bg-success/10 border border-success/20 rounded-full">
                                <span className="text-success font-medium">
                                    ✓ Indexed
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar */}
                <aside className="w-80 bg-panel border-r border-gray-800 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-800">
                        <h2 className="text-lg font-semibold text-text-primary mb-2">Documents</h2>
                        <p className="text-sm text-text-secondary mb-4">
                            Upload and manage your PDFs
                        </p>
                        <UploadBox onUploadSuccess={handleUploadSuccess} />
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <h3 className="text-sm font-medium text-text-primary mb-4">
                            Document Library
                        </h3>
                        <DocumentList
                            documents={documents}
                            onToggleDocument={handleToggleDocument}
                            onSelectAll={handleSelectAll}
                            onDeselectAll={handleDeselectAll}
                            onDeleteDocument={handleDeleteDocument}
                        />
                    </div>
                </aside>

                {/* Main Panel */}
                <main className="flex-1 flex flex-col bg-background">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-800 bg-panel">
                        <div className="flex px-6">
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={`
                                    px-4 py-3 text-sm font-medium border-b-2 transition-colors
                                    ${activeTab === 'chat'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-text-secondary hover:text-text-primary'
                                    }
                                `}
                            >
                                Chat
                            </button>
                            <button
                                onClick={() => setActiveTab('summaries')}
                                className={`
                                    px-4 py-3 text-sm font-medium border-b-2 transition-colors
                                    ${activeTab === 'summaries'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-text-secondary hover:text-text-primary'
                                    }
                                `}
                            >
                                Summaries
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-hidden">
                        {activeTab === 'chat' ? (
                            <ChatInterface
                                chatEnabled={chatEnabled}
                                status={getChatbotStatus()}
                                documentCount={documentCount}
                                summaryStatus={summaryStatus}
                                summaryError={summaryError}
                            />
                        ) : (
                            <SummaryPanel
                                documents={documents}
                                summary={summary}
                                summaryStatus={summaryStatus}
                                summaryError={summaryError}
                            />
                        )}
                    </div>
                </main>
            </div>

            {/* Floating Chat Interface */}
            <ChatLauncher
                selectedCount={selectedDocuments.length}
                onToggle={() => setIsChatOpen(!isChatOpen)}
                isOpen={isChatOpen}
            />
            <ChatWindow
                selectedDocuments={selectedDocuments}
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                chatEnabled={chatEnabled}
                status={getChatbotStatus()}
                documentCount={documentCount}
            />
        </div>
    );
}
