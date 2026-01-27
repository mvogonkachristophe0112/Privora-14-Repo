import BuildInfo from '@/components/BuildInfo';
import Link from 'next/link';
import { Shield, Zap, Globe, Lock, Users, FileCheck, ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-4 transition"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">About Privora</h1>
          <p className="text-lg text-gray-600">Secure, encrypted file transfer made simple</p>
        </div>
      </header>

      <main className="container-custom py-12 space-y-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-500 to-success-500 rounded-2xl p-12 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">🔒 Secure File Transfer</h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Privora is a modern, secure file transfer application with end-to-end encryption,
              real-time presence, and a beautiful user interface.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Lock className="w-8 h-8" />}
              title="End-to-End Encryption"
              description="Files are encrypted with AES-256-GCM in your browser before upload. Your encryption keys never touch our servers."
              color="blue"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Real-time Presence"
              description="See who's online instantly with Socket.IO. Get real-time notifications when files are sent or received."
              color="yellow"
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Zero-knowledge"
              description="We never have access to your encryption keys or decrypted files. True zero-knowledge architecture."
              color="green"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Secure Authentication"
              description="JWT-based authentication with bcrypt password hashing. Your credentials are always protected."
              color="purple"
            />
            <FeatureCard
              icon={<FileCheck className="w-8 h-8" />}
              title="File Management"
              description="Upload, send, receive, and manage encrypted files. Track transfer history and monitor file status."
              color="pink"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Responsive Design"
              description="Works seamlessly on mobile, tablet, and desktop. Access your files from any device, anywhere."
              color="indigo"
            />
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tech Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚛️</span>
                Frontend
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  Next.js 14 (App Router)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  TypeScript
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  Tailwind CSS
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  Socket.IO Client
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  Web Crypto API
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚙️</span>
                Backend
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-success-500 rounded-full"></span>
                  Express.js
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-success-500 rounded-full"></span>
                  Socket.IO
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-success-500 rounded-full"></span>
                  Prisma ORM
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-success-500 rounded-full"></span>
                  JWT Authentication
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-success-500 rounded-full"></span>
                  SQLite / PostgreSQL
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Build Info */}
        <BuildInfo />

        {/* Deployment Methods */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Deployment Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-primary-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Network</h3>
              <p className="text-sm text-gray-700 mb-4">
                Deploy on your local network using START_APP.bat. Perfect for testing and local use.
              </p>
              <code className="text-xs bg-white px-3 py-1.5 rounded border border-blue-200 inline-block">
                START_APP.bat
              </code>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-success-50 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cloud Deployment</h3>
              <p className="text-sm text-gray-700 mb-4">
                Deploy to Vercel (frontend) + Render (backend). Production-ready with automatic deployments.
              </p>
              <code className="text-xs bg-white px-3 py-1.5 rounded border border-green-200 inline-block">
                vercel --prod
              </code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-600">Built with ❤️ for secure file sharing</p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              Login
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              Sign Up
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: any) {
  const colors: any = {
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-500 to-yellow-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
    indigo: 'from-indigo-500 to-indigo-600',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colors[color]} text-white mb-4 shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
