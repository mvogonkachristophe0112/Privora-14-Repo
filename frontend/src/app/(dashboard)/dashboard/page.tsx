'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState({
    totalFiles: 0,
    sentFiles: 0,
    receivedFiles: 0,
    onlineUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [files, sent, received, online] = await Promise.all([
          api.get('/files'),
          api.get('/transfers/sent'),
          api.get('/transfers/received'),
          api.get('/users/online'),
        ]);

        setStats({
          totalFiles: files.data.files.length,
          sentFiles: sent.data.transfers.length,
          receivedFiles: received.data.transfers.length,
          onlineUsers: online.data.onlineUsers.length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username}!</h1>
      <p className="text-gray-600 mb-8">Secure file transfer dashboard</p>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Files"
              value={stats.totalFiles}
              icon="📁"
              color="blue"
            />
            <StatCard
              title="Sent Files"
              value={stats.sentFiles}
              icon="📤"
              color="green"
            />
            <StatCard
              title="Received Files"
              value={stats.receivedFiles}
              icon="📥"
              color="purple"
            />
            <StatCard
              title="Online Users"
              value={stats.onlineUsers}
              icon="👥"
              color="orange"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickAction
              title="Send a File"
              description="Encrypt and send a file to another user"
              href="/send"
              icon="📤"
            />
            <QuickAction
              title="Receive Files"
              description="View and decrypt received files"
              href="/receive"
              icon="📥"
            />
            <QuickAction
              title="Online Users"
              description="See who's currently online"
              href="/online-users"
              icon="👥"
            />
            <QuickAction
              title="File Manager"
              description="Manage your uploaded files"
              href="/file-manager"
              icon="📁"
            />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className={`inline-block p-3 rounded-lg ${colors[color]} mb-3`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
}

function QuickAction({ title, description, href, icon }: any) {
  return (
    <Link
      href={href}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-primary-300 hover:shadow-md transition"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
