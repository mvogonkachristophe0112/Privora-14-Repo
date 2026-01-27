'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatFileSize } from '@/lib/crypto';
import toast from 'react-hot-toast';
import { Card, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { Send, Download, FileText, Clock, CheckCircle } from 'lucide-react';

interface Transfer {
  id: string;
  file: {
    id: string;
    originalName: string;
    size: number;
    mimeType: string;
  };
  sender?: {
    id: string;
    username: string;
    email: string;
  };
  receiver?: {
    id: string;
    username: string;
    email: string;
  };
  status: string;
  sentAt: string;
  receivedAt?: string;
  decryptedAt?: string;
}

export default function HistoryPage() {
  const [sent, setSent] = useState<Transfer[]>([]);
  const [received, setReceived] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/transfers/history');
      setSent(response.data.sent);
      setReceived(response.data.received);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const transfers = activeTab === 'sent' ? sent : received;

  if (loading) {
    return <Loading text="Loading transfer history..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transfer History</h1>
        <p className="text-gray-600">View all your file transfers</p>
      </div>

      {/* Tabs */}
      <Card>
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 px-6 py-4 font-semibold text-sm transition-all relative ${
              activeTab === 'sent'
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Send size={18} />
              <span>Sent</span>
              <Badge variant="gray" size="sm">{sent.length}</Badge>
            </div>
            {activeTab === 'sent' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 px-6 py-4 font-semibold text-sm transition-all relative ${
              activeTab === 'received'
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Download size={18} />
              <span>Received</span>
              <Badge variant="gray" size="sm">{received.length}</Badge>
            </div>
            {activeTab === 'received' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
            )}
          </button>
        </div>

        <CardBody className="p-6">
          {transfers.length === 0 ? (
            <EmptyState
              icon={activeTab === 'sent' ? '📤' : '📥'}
              title={`No ${activeTab} transfers yet`}
              description={`Your ${activeTab} file transfers will appear here`}
            />
          ) : (
            <div className="space-y-3">
              {transfers.map((transfer) => (
                <div
                  key={transfer.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <div className="p-3 bg-primary-50 rounded-xl">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {transfer.file.originalName}
                      </h3>
                      <Badge
                        variant={
                          transfer.status === 'decrypted'
                            ? 'success'
                            : transfer.status === 'received'
                            ? 'primary'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {transfer.status === 'decrypted' && <CheckCircle size={12} />}
                        {transfer.status === 'pending' && <Clock size={12} />}
                        {transfer.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar
                        name={
                          activeTab === 'sent'
                            ? transfer.receiver?.username || 'Unknown'
                            : transfer.sender?.username || 'Unknown'
                        }
                        size="sm"
                      />
                      <span className="text-sm text-gray-600">
                        {activeTab === 'sent' ? 'To: ' : 'From: '}
                        {activeTab === 'sent'
                          ? transfer.receiver?.username
                          : transfer.sender?.username}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>{formatFileSize(transfer.file.size)}</span>
                      <span>•</span>
                      <span>{new Date(transfer.sentAt).toLocaleString()}</span>
                      {transfer.decryptedAt && (
                        <>
                          <span>•</span>
                          <span className="text-success-600">
                            Decrypted {new Date(transfer.decryptedAt).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
