import BuildInfo from '@/components/BuildInfo';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-primary-600 hover:underline mb-6 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-6">About Privora</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-sm mb-6">
          <h2 className="text-2xl font-semibold mb-4">🔒 Secure File Transfer</h2>
          <p className="text-gray-700 mb-4">
            Privora is a modern, secure file transfer application with end-to-end encryption,
            real-time presence, and a WhatsApp-like user interface.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Features</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>End-to-End Encryption:</strong> AES-256-GCM client-side encryption</li>
            <li><strong>Real-time Presence:</strong> See who's online with Socket.IO</li>
            <li><strong>Secure Authentication:</strong> JWT-based auth with refresh tokens</li>
            <li><strong>File Management:</strong> Upload, send, receive, and manage encrypted files</li>
            <li><strong>Transfer History:</strong> Track all sent and received files</li>
            <li><strong>Responsive Design:</strong> Works on phone, tablet, laptop, and PC</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Deployment Methods</h3>
          <div className="space-y-3 text-gray-700">
            <div>
              <strong>Local Network:</strong> Deploy on your local network using START_APP.bat
              <br />
              <span className="text-sm text-gray-600">Perfect for testing and local use</span>
            </div>
            <div>
              <strong>Cloud:</strong> Deploy to Vercel (frontend) + Render (backend)
              <br />
              <span className="text-sm text-gray-600">Production-ready with automatic deployments</span>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Tech Stack</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Frontend:</strong>
              <ul className="list-disc list-inside ml-4 text-gray-600">
                <li>Next.js 14</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Socket.IO Client</li>
              </ul>
            </div>
            <div>
              <strong>Backend:</strong>
              <ul className="list-disc list-inside ml-4 text-gray-600">
                <li>Express.js</li>
                <li>Socket.IO</li>
                <li>Prisma ORM</li>
                <li>JWT Auth</li>
              </ul>
            </div>
          </div>
        </div>

        <BuildInfo />

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Built with ❤️ for secure file sharing</p>
        </div>
      </div>
    </div>
  );
}
