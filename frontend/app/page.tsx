import Link from 'next/link';
import { ArrowRight, FileText, MessageSquare, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Document Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-text-primary leading-tight max-w-4xl mx-auto">
            Chat & Summarize Your
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-2">
              Documents
            </span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Upload multiple PDFs, generate summaries, and ask questions with citations.
            Built for professionals who need accurate information fast.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <Link
              href="/chat"
              className="
                inline-flex items-center gap-2 px-8 py-4 
                bg-primary hover:bg-indigo-600
                text-white font-semibold rounded-xl
                transition-all duration-200
                shadow-lg shadow-primary/25 hover:shadow-primary/40
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
              "
            >
              Open Workspace
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-panel border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all">
            <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Multi-PDF Upload</h3>
            <p className="text-text-secondary leading-relaxed">
              Upload multiple documents and manage them in one workspace
            </p>
          </div>

          <div className="bg-panel border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all">
            <div className="w-12 h-12 bg-secondary/10 border border-secondary/20 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Cross-Document Q&A</h3>
            <p className="text-text-secondary leading-relaxed">
              Ask questions across multiple documents and get unified answers
            </p>
          </div>

          <div className="bg-panel border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all">
            <div className="w-12 h-12 bg-success/10 border border-success/20 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Citations</h3>
            <p className="text-text-secondary leading-relaxed">
              Every answer includes source references with page numbers
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-text-secondary mt-20">
          Powered by advanced RAG (Retrieval-Augmented Generation) technology
        </p>
      </main>
    </div>
  );
}
