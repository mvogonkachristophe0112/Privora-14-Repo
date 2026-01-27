'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatFileSize } from '@/lib/crypto';
import toast from 'react-hot-toast';

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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Transfer History</h1>
      <p className="text-gray-600 mb-8">View all your file transfers</p>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'sent'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Sent ({sent.length})
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'received'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Received ({received.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      ) : transfers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">
            No {activeTab} transfers yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {transfers.map((transfer) => (
            <div
              key={transfer.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">
                    {transfer.file.originalName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {activeTab === 'sent' ? 'To: ' : 'From: '}
                    {activeTab === 'sent' 
                      ? `${transfer.receiver?.username} (${transfer.receiver?.email})`
                      : `${transfer.sender?.username} (${transfer.sender?.email})`
                    }
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span>Size: {formatFileSize(transfer.file.size)}</span>
                    <span>Type: {transfer.file.mimeType}</span>
                    <span>Sent: {new Date(transfer.sentAt).toLocaleString()}</span>
                    {transfer.receivedAt && (
                      <span>Received: {new Date(transfer.receivedAt).toLocaleString()}</span>
                    )}
                    {transfer.decryptedAt && (
                      <span>Decrypted: {new Date(transfer.decryptedAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    transfer.status === 'decrypted'
                      ? 'bg-success-100 text-success-700'
                      : transfer.status === 'received'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {transfer.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
