'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, FileText, X, RotateCcw } from 'lucide-react';
import { Message, Document } from '@/types';
import { askQuestion } from '@/lib/api';
import { resetSession } from '@/lib/utils';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
    selectedDocuments: Document[];
    isOpen: boolean;
    onClose: () => void;
    chatEnabled: boolean;
    status: string;
    documentCount: number;
}

export default function ChatWindow({
    selectedDocuments,
    isOpen,
    onClose,
    chatEnabled,
    status,
    documentCount
}: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current && chatEnabled) {
            inputRef.current.focus();
        }
    }, [isOpen, chatEnabled]);

    const handleSend = async () => {
        if (!input.trim() || !chatEnabled || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // CRITICAL: Only pass question - session from localStorage
            const response = await askQuestion(userMessage.content);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.answer,
                citations: response.citations,
                timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="
        fixed top-0 right-0 h-full z-50
        w-[450px]
        glass-drawer
        flex flex-col
        animate-in slide-in-from-right duration-300
      ">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary">AI Assistant</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${chatEnabled ? 'bg-success animate-pulse' : 'bg-secondary'}`} />
                            <p className="text-xs text-text-secondary">
                                {status}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => resetSession()}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors group"
                            title="New Session"
                        >
                            <RotateCcw className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-text-secondary" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
                                <FileText className="w-8 h-8 text-primary" />
                            </div>
                            <h4 className="font-medium text-text-primary mb-2">
                                {chatEnabled ? 'Start chatting' : status}
                            </h4>
                            <p className="text-sm text-text-secondary">
                                {chatEnabled
                                    ? `Ask questions across ${documentCount} indexed ${documentCount === 1 ? 'document' : 'documents'}`
                                    : 'Upload documents and wait for indexing to complete'}
                            </p>
                        </div>
                    ) : (
                        <>
                            {messages.map((message) => (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    documentCount={message.role === 'assistant' ? documentCount : undefined}
                                    chunkCount={message.role === 'assistant' ? message.citations?.length : undefined}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </>
                    )}

                    {/* Typing Indicator */}
                    {isLoading && (
                        <div className="flex gap-3 items-start">
                            <div className="w-8 h-8 bg-panel border border-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                                <Loader2 className="w-4 h-4 text-text-secondary animate-spin" />
                            </div>
                            <div className="flex-1 bg-panel border border-gray-800 rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-text-secondary rounded-full typing-dot" />
                                    <div className="w-2 h-2 bg-text-secondary rounded-full typing-dot" />
                                    <div className="w-2 h-2 bg-text-secondary rounded-full typing-dot" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-gray-800">
                    <div className="flex gap-3 items-end">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={!chatEnabled || isLoading}
                            placeholder={chatEnabled ? 'Ask a question...' : 'Waiting for indexing...'}
                            rows={1}
                            className="
                flex-1 resize-none bg-panel border border-gray-800 rounded-xl px-4 py-3
                text-sm text-text-primary placeholder-text-secondary
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent
                disabled:opacity-50 disabled:cursor-not-allowed
                max-h-32 transition-all
              "
                            style={{ minHeight: '44px' }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!chatEnabled || !input.trim() || isLoading}
                            className="
                flex-shrink-0 w-11 h-11 rounded-xl
                bg-primary hover:bg-indigo-600
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all
                flex items-center justify-center
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-panel
              "
                        >
                            <Send className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
