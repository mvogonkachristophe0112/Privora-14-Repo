'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';
import { Card, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { Send, UserPlus, TrendingUp } from 'lucide-react';

interface OnlineUser {
  userId: string;
  username: string;
  email: string;
  connectedAt: string;
}

export default function OnlineUsersPage() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const response = await api.get('/users/online');
        setOnlineUsers(response.data.onlineUsers.filter((u: OnlineUser) => u.userId !== currentUser?.id));
      } catch (error) {
        console.error('Failed to fetch online users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOnlineUsers();

    const socket = getSocket();
    if (socket) {
      socket.on('online-users-updated', (data: { onlineUsers: OnlineUser[] }) => {
        setOnlineUsers(data.onlineUsers.filter(u => u.userId !== currentUser?.id));
      });
    }

    return () => {
      if (socket) {
        socket.off('online-users-updated');
      }
    };
  }, [currentUser]);

  const handleSendFile = (userId: string) => {
    router.push(`/send?recipient=${userId}`);
  };

  if (loading) {
    return <Loading text="Loading online users..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Online Users</h1>
          <p className="text-gray-600">
            {onlineUsers.length} {onlineUsers.length === 1 ? 'user' : 'users'} currently online
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-success-50 rounded-full">
            <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-success-700">Live</span>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      {onlineUsers.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="👥"
              title="No other users online"
              description="Users will appear here when they log in. Invite your friends to join!"
            />
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {onlineUsers.map((user) => (
            <Card key={user.userId} hover>
              <CardBody className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar 
                    name={user.username} 
                    size="lg" 
                    status="online"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-lg">
                      {user.username}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Online since {new Date(user.connectedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSendFile(user.userId)}
                    className="w-full"
                  >
                    <Send size={16} />
                    Send File
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-primary-50 to-success-50 border-primary-200">
        <CardBody className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <UserPlus className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Invite More Users</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Share Privora with your team to enable secure file transfers. The more users online, the easier collaboration becomes!
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
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
    <Card>
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
