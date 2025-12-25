'use client';

import { useEffect, useState } from 'react';

export default function DiagnosticPage() {
    const [envValue, setEnvValue] = useState<string>('');

    useEffect(() => {
        // This will show what value is being used in production
        const value = process.env.NEXT_PUBLIC_API_BASE_URL || 'NOT SET (using fallback)';
        setEnvValue(value);
        console.log('NEXT_PUBLIC_API_BASE_URL:', value);
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-2xl font-bold mb-4">Environment Diagnostic</h1>
            <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">NEXT_PUBLIC_API_BASE_URL:</h2>
                <code className="block bg-gray-950 p-4 rounded text-green-400">
                    {envValue}
                </code>

                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Expected Value:</h3>
                    <code className="block bg-gray-950 p-4 rounded text-blue-400">
                        https://AryanDhanuka10-ai-doc-rag.hf.space
                    </code>
                </div>

                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-300">
                        <li>Check the value shown above</li>
                        <li>If it says "NOT SET", add the environment variable in Vercel</li>
                        <li>If it shows HTTP instead of HTTPS, update it in Vercel</li>
                        <li>After updating, redeploy the application</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
