'use client';

import { Message } from '@/types';
import { User, Bot } from 'lucide-react';
import CitationChip from './CitationChip';

interface MessageBubbleProps {
    message: Message;
    documentCount?: number;
    chunkCount?: number;
}

export default function MessageBubble({ message, documentCount, chunkCount }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start`}>
            {/* Avatar */}
            <div
                className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isUser ? 'bg-primary' : 'bg-panel border border-gray-700'}
        `}
            >
                {isUser ? (
                    <User className="w-4 h-4 text-white" />
                ) : (
                    <Bot className="w-4 h-4 text-text-primary" />
                )}
            </div>

            {/* Message Content */}
            <div className={`flex-1 max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                    className={`
            px-4 py-3
            ${isUser
                            ? 'bg-gradient-to-br from-primary via-indigo-500 to-accent shadow-lg shadow-primary/20 text-white rounded-[20px]'
                            : 'bg-panel border border-primary/20 shadow-md shadow-primary/10 text-text-primary rounded-[20px]'
                        }
          `}
                >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                    </p>
                </div>

                {/* Document chunks badge for AI messages */}
                {!isUser && (chunkCount || (message.citations && message.citations.length > 0)) && (
                    <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20">
                        <p className="text-xs font-medium text-secondary">
                            📄 Answer based on {chunkCount || message.citations?.length || 0} document {(chunkCount || message.citations?.length || 0) === 1 ? 'chunk' : 'chunks'}
                        </p>
                    </div>
                )}

                {/* Citations as chips */}
                {!isUser && message.citations && message.citations.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {message.citations.map((citation, index) => (
                            <CitationChip key={index} citation={citation} index={index} />
                        ))}
                    </div>
                )}

                {/* Timestamp */}
                <p className="text-xs text-text-secondary mt-1 px-1">
                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                    })}
                </p>
            </div>
        </div>
    );
}
