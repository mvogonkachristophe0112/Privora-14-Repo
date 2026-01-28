'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import ServerInfo from '@/components/ServerInfo';
import { FileText, Send, Download, Users, ArrowRight, TrendingUp } from 'lucide-react';

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

  if (loading) {
    return <Loading text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="text-gray-600">Here's what's happening with your files today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in">
        <StatCard
          title="Total Files"
          value={stats.totalFiles}
          icon={<FileText className="w-6 h-6" />}
          color="blue"
          trend="+12%"
        />
        <StatCard
          title="Sent Files"
          value={stats.sentFiles}
          icon={<Send className="w-6 h-6" />}
          color="green"
          trend="+8%"
        />
        <StatCard
          title="Received Files"
          value={stats.receivedFiles}
          icon={<Download className="w-6 h-6" />}
          color="purple"
          trend="+15%"
        />
        <StatCard
          title="Online Users"
          value={stats.onlineUsers}
          icon={<Users className="w-6 h-6" />}
          color="orange"
          trend="Live"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickActionCard
            title="Send a File"
            description="Encrypt and send a file securely to another user"
            href="/send"
            icon={<Send className="w-8 h-8" />}
            color="primary"
          />
          <QuickActionCard
            title="Receive Files"
            description="View and decrypt files sent to you"
            href="/receive"
            icon={<Download className="w-8 h-8" />}
            color="success"
          />
          <QuickActionCard
            title="Online Users"
            description="See who's currently online and available"
            href="/online-users"
            icon={<Users className="w-8 h-8" />}
            color="purple"
          />
          <QuickActionCard
            title="File Manager"
            description="Manage and organize your uploaded files"
            href="/file-manager"
            icon={<FileText className="w-8 h-8" />}
            color="orange"
          />
        </div>
      </div>

      {/* Server Info - LAN Access */}
      <ServerInfo />

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <Link href="/history" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            View all
            <ArrowRight size={16} />
          </Link>
        </div>
        <Card>
          <CardBody>
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Your recent file transfers will appear here</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend }: any) {
  const colors: any = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <Card className="overflow-hidden">
      <CardBody className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className="text-xs text-success-600 font-medium mt-2 flex items-center gap-1">
                <TrendingUp size={12} />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-lg`}>
            {icon}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function QuickActionCard({ title, description, href, icon, color }: any) {
  const colors: any = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-success-500 to-success-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <Link href={href}>
      <Card hover className="h-full">
        <CardBody className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-lg flex-shrink-0`}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
