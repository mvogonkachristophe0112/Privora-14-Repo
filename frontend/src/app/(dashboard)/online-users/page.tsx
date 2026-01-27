'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';

interface OnlineUser {
  userId: string;
  username: string;
  email: string;
  connectedAt: string;
}

export default function OnlineUsersPage() {
  const currentUser = useAuthStore((state) => state.user);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const response = await api.get('/users/online');
        setOnlineUsers(response.data.onlineUsers);
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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Online Users</h1>
      <p className="text-gray-600 mb-8">Users currently online and available</p>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      ) : onlineUsers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">No other users online</p>
          <p className="text-sm text-gray-500 mt-2">Users will appear here when they log in</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {onlineUsers.map((user) => (
            <div
              key={user.userId}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-primary-300 transition"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{user.username}</h3>
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Online since {new Date(user.connectedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
