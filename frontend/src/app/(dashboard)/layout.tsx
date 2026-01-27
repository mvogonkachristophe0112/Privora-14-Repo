'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { Home, Users, Send, Download, FolderOpen, History, LogOut } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, token, isAuthenticated, logout, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (token) {
      connectSocket(token);
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, token, router]);

  const handleLogout = () => {
    disconnectSocket();
    logout();
    router.push('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary-600">🔒 Privora</h1>
          <p className="text-xs text-gray-600 mt-1">{user?.username}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink href="/dashboard" icon={<Home size={18} />}>
            Dashboard
          </NavLink>
          <NavLink href="/online-users" icon={<Users size={18} />}>
            Online Users
          </NavLink>
          <NavLink href="/send" icon={<Send size={18} />}>
            Send File
          </NavLink>
          <NavLink href="/receive" icon={<Download size={18} />}>
            Receive
          </NavLink>
          <NavLink href="/file-manager" icon={<FolderOpen size={18} />}>
            File Manager
          </NavLink>
          <NavLink href="/history" icon={<History size={18} />}>
            History
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
