'use client';

import { useState } from 'react';
import { Shield, Zap, Globe, Lock, Users, FileCheck, Server } from 'lucide-react';

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  shortDesc: string;
  fullExplanation: string;
  benefits: string[];
  color: string;
}

const features: Feature[] = [
  {
    id: 'aes-encryption',
    icon: <Lock className="w-8 h-8" />,
    title: 'AES-256-GCM Encryption',
    shortDesc: 'Military-grade encryption in your browser',
    fullExplanation: 'AES-256-GCM is the same encryption standard used by governments and militaries worldwide. The "256" means your encryption key is 256 bits long - that\'s 2^256 possible combinations, making it virtually impossible to crack. "GCM" (Galois/Counter Mode) adds authentication, ensuring files haven\'t been tampered with.',
    benefits: [
      'Your files are encrypted before leaving your device',
      'Even if someone intercepts the file, they can\'t read it',
      'Protects against unauthorized access and tampering',
      'Industry-standard security used by banks and governments'
    ],
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'real-time',
    icon: <Zap className="w-8 h-8" />,
    title: 'Real-time Synchronization',
    shortDesc: 'Instant notifications and presence',
    fullExplanation: 'Real-time means updates happen instantly without refreshing your browser. When someone sends you a file, you see it immediately. When a user comes online, their status updates instantly. This is powered by WebSocket technology, which maintains a live connection between your browser and our servers.',
    benefits: [
      'Get notified the moment a file is sent to you',
      'See who\'s online without refreshing the page',
      'Instant status updates for all transfers',
      'No delays - everything happens in real-time'
    ],
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'zero-knowledge',
    icon: <Globe className="w-8 h-8" />,
    title: 'Zero-knowledge Architecture',
    shortDesc: 'Keys never leave your device',
    fullExplanation: 'Zero-knowledge means we literally cannot access your files or encryption keys - even if we wanted to. Your encryption keys are generated in your browser and never sent to our servers. We only store the encrypted files, which are useless without the keys that only you and your recipient have.',
    benefits: [
      'Complete privacy - we can\'t see your files',
      'Your encryption keys stay on your device',
      'Even our administrators can\'t decrypt your files',
      'True end-to-end security with no backdoors'
    ],
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'secure-design',
    icon: <Shield className="w-8 h-8" />,
    title: 'Secure by Design',
    shortDesc: 'Built with security as the foundation',
    fullExplanation: 'Security isn\'t an afterthought - it\'s built into every part of Privora. From password hashing with bcrypt (making passwords unreadable even to us) to JWT tokens for authentication, to HTTPS encryption for all communications. Every design decision prioritizes your security.',
    benefits: [
      'Passwords are hashed and salted - never stored in plain text',
      'Secure authentication with industry-standard JWT tokens',
      'All communications encrypted with HTTPS',
      'Regular security audits and updates'
    ],
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'presence',
    icon: <Users className="w-8 h-8" />,
    title: 'Real-time Presence',
    shortDesc: 'See who\'s online instantly',
    fullExplanation: 'Presence indicators show you who\'s currently online and available to receive files. A green dot means they\'re active right now. This helps you know the best time to send files and ensures recipients can decrypt and download immediately.',
    benefits: [
      'Know who\'s available before sending files',
      'Green dot = online and ready to receive',
      'Instant updates when users come online or go offline',
      'Better coordination for time-sensitive transfers'
    ],
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'file-management',
    icon: <FileCheck className="w-8 h-8" />,
    title: 'File Management',
    shortDesc: 'Organize and track your files',
    fullExplanation: 'Keep track of all your encrypted files in one place. Search by filename, see upload dates, check file sizes, and monitor transfer status. View complete history of sent and received files with timestamps and status updates.',
    benefits: [
      'Search and filter your files easily',
      'Track transfer status (pending, received, decrypted)',
      'View complete history of all transfers',
      'Delete files you no longer need'
    ],
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'access-anywhere',
    icon: <Server className="w-8 h-8" />,
    title: 'Access Anywhere',
    shortDesc: 'Works on all your devices',
    fullExplanation: 'Privora is fully responsive and works seamlessly on phones, tablets, and computers. The interface adapts to your screen size, with a bottom navigation bar on mobile and a sidebar on desktop. Access your files from any device, anywhere, anytime.',
    benefits: [
      'Use on phone, tablet, or computer',
      'Interface adapts to your screen size',
      'Same features on all devices',
      'Access your files from anywhere with internet'
    ],
    color: 'from-teal-500 to-teal-600'
  }
];

export default function FeatureShowcase() {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const toggleFeature = (featureId: string) => {
    setExpandedFeature(expandedFeature === featureId ? null : featureId);
  };

  return (
    <div className="mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Powerful Features, Simply Explained
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          Click any feature to learn more about how we protect your data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const isExpanded = expandedFeature === feature.id;
          
          return (
            <div
              key={feature.id}
              className="group relative"
            >
              <button
                onClick={() => toggleFeature(feature.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFeature(feature.id);
                  }
                }}
                className="w-full text-left bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-expanded={isExpanded}
                aria-controls={`feature-${feature.id}`}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white/90 transition">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/80 mb-3">{feature.shortDesc}</p>
                <span className="text-xs text-white/60 font-medium">
                  {isExpanded ? 'Click to collapse ▲' : 'Click to learn more ▼'}
                </span>
              </button>

              {/* Expandable Panel */}
              {isExpanded && (
                <div
                  id={`feature-${feature.id}`}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 z-10 animate-scale-in"
                  role="region"
                  aria-label={`${feature.title} details`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color} text-white`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {feature.fullExplanation}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h5 className="text-sm font-semibold text-gray-900 mb-3">Benefits:</h5>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-success-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => setExpandedFeature(null)}
                    className="mt-4 w-full py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tooltip Hint */}
      <div className="mt-8 text-center">
        <p className="text-sm text-white/60">
          💡 Tip: Click any feature card to see detailed explanations
        </p>
      </div>
    </div>
  );
}
