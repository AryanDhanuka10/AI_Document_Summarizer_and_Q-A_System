'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, FileText } from 'lucide-react';
import { Message } from '@/types';
import { askQuestion } from '@/lib/api';
import MessageBubble from './MessageBubble';

interface ChatInterfaceProps {
    chatEnabled: boolean;
    status: string;
    documentCount: number;
    summaryStatus: 'idle' | 'loading' | 'success' | 'error';
    summaryError: string | null;
}

export default function ChatInterface({
    chatEnabled,
    status,
    documentCount,
    summaryStatus,
    summaryError
}: ChatInterfaceProps) {
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
        if (inputRef.current && chatEnabled) {
            inputRef.current.focus();
        }
    }, [chatEnabled]);

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

    return (
        <div className="h-full flex flex-col">
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
                        {summaryStatus === 'loading' && (
                            <p className="text-secondary mt-4">
                                Indexing documents...
                            </p>
                        )}
                        {summaryStatus === 'error' && (
                            <p className="text-red-400 mt-4">
                                {summaryError}
                            </p>
                        )}
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
            <div className="p-6 border-t border-gray-800 bg-panel">
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
                            flex-1 resize-none bg-background border border-gray-800 rounded-xl px-4 py-3
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
    );
}
