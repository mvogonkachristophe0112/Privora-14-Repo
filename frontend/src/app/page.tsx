import Link from 'next/link';
import { Shield, Zap, Globe, Lock, Users, FileCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-success-500">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-md border-b border-white/20 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span className="text-xl font-bold text-white">Privora</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/about"
                className="hidden sm:block text-white/90 hover:text-white transition text-sm font-medium"
              >
                About
              </Link>
              <Link
                href="/login"
                className="text-white/90 hover:text-white transition text-sm font-medium px-4 py-2"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-white text-primary-600 px-4 py-2 rounded-lg font-semibold hover:bg-white/90 transition shadow-lg text-sm"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4">
        <div className="container-custom max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Secure File Transfer
              <br />
              <span className="text-white/90">Made Simple</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              End-to-end encrypted file sharing with real-time presence and zero-knowledge architecture
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap mb-16 animate-slide-in">
            <Link
              href="/signup"
              className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition shadow-xl hover:shadow-2xl hover:scale-105 transform text-base"
            >
              Get Started Free
            </Link>
            <Link
              href="/about"
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition text-base"
            >
              Learn More
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <FeatureCard
              icon={<Lock className="w-8 h-8" />}
              title="AES-256-GCM"
              description="Military-grade encryption in your browser"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Real-time"
              description="Instant notifications and presence"
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Zero-knowledge"
              description="Keys never leave your device"
            />
          </div>

          {/* Additional Features */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Shield className="w-12 h-12 text-white mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Secure by Design</h3>
              <p className="text-white/80 leading-relaxed">
                Files are encrypted client-side before upload. Your encryption keys never touch our servers, ensuring true end-to-end security.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Users className="w-12 h-12 text-white mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Real-time Presence</h3>
              <p className="text-white/80 leading-relaxed">
                See who's online instantly. Send files to active users and get real-time notifications when files are received.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <FileCheck className="w-12 h-12 text-white mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">File Management</h3>
              <p className="text-white/80 leading-relaxed">
                Organize, search, and manage your encrypted files. Track transfer history and monitor file status.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Globe className="w-12 h-12 text-white mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Access Anywhere</h3>
              <p className="text-white/80 leading-relaxed">
                Responsive design works seamlessly on mobile, tablet, and desktop. Access your files from any device.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20 py-8">
        <div className="container-custom text-center">
          <p className="text-white/70 text-sm">
            Built with ❤️ for secure file sharing
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:scale-105 transform">
      <div className="text-white mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/80">{description}</p>
    </div>
  );
}
