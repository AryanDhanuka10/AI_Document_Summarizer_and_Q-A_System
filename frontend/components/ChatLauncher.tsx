'use client';

import { MessageSquare, X } from 'lucide-react';

interface ChatLauncherProps {
    selectedCount: number;
    onToggle: () => void;
    isOpen: boolean;
}

export default function ChatLauncher({ selectedCount, onToggle, isOpen }: ChatLauncherProps) {
    return (
        <button
            onClick={onToggle}
            className="
        fixed bottom-6 left-6 z-50
        w-14 h-14 rounded-full
        bg-gradient-to-br from-primary to-accent
        hover:from-accent hover:to-primary shadow-lg shadow-primary/30
        text-white
        shadow-2xl
        pulse-glow
        transition-all duration-200
        flex items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
        hover:scale-110
      "
            aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
            {isOpen ? (
                <X className="w-6 h-6" />
            ) : (
                <>
                    <MessageSquare className="w-6 h-6" />
                    {selectedCount > 0 && (
                        <span className="
              absolute -top-1 -right-1
              w-6 h-6 rounded-full
              bg-success text-white
              text-xs font-bold
              flex items-center justify-center
              border-2 border-background
            ">
                            {selectedCount}
                        </span>
                    )}
                </>
            )}
        </button>
    );
}
