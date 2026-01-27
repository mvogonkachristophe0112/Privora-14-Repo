'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { decryptFile, formatFileSize, downloadBlob } from '@/lib/crypto';
import { getSocket } from '@/lib/socket';
import toast from 'react-hot-toast';

interface Transfer {
  id: string;
  file: {
    id: string;
    originalName: string;
    size: number;
    mimeType: string;
  };
  sender: {
    id: string;
    username: string;
    email: string;
  };
  status: string;
  sentAt: string;
}

export default function ReceivePage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [decryptingId, setDecryptingId] = useState<string | null>(null);
  const [decryptKey, setDecryptKey] = useState('');

  useEffect(() => {
    fetchTransfers();

    const socket = getSocket();
    if (socket) {
      socket.on('file-received', () => {
        fetchTransfers();
        toast.success('New file received!');
      });
    }

    return () => {
      if (socket) {
        socket.off('file-received');
      }
    };
  }, []);

  const fetchTransfers = async () => {
    try {
      const response = await api.get('/transfers/received');
      setTransfers(response.data.transfers);
    } catch (error) {
      console.error('Failed to fetch transfers:', error);
      toast.error('Failed to load received files');
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async (transfer: Transfer) => {
    if (!decryptKey) {
      toast.error('Please enter the decryption key');
      return;
    }

    setDecryptingId(transfer.id);

    try {
      // Download encrypted file
      const response = await api.get(`/files/download/${transfer.file.id}`, {
        responseType: 'arraybuffer',
      });

      // Parse key and IV
      const [keyHex, ivHex] = decryptKey.split(':');
      if (!keyHex || !ivHex) {
        throw new Error('Invalid key format. Expected format: key:iv');
      }

      // Decrypt file
      const decryptedData = await decryptFile(response.data, keyHex, ivHex);

      // Download decrypted file
      const blob = new Blob([decryptedData], { type: transfer.file.mimeType });
      downloadBlob(blob, transfer.file.originalName);

      // Update transfer status
      await api.patch(`/transfers/${transfer.id}/status`, { status: 'decrypted' });

      toast.success('File decrypted and downloaded!');
      setDecryptKey('');
      fetchTransfers();
    } catch (error) {
      console.error('Decryption error:', error);
      toast.error('Failed to decrypt file. Check your key.');
    } finally {
      setDecryptingId(null);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Receive Files</h1>
      <p className="text-gray-600 mb-8">Files sent to you</p>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      ) : transfers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">No files received yet</p>
          <p className="text-sm text-gray-500 mt-2">Files sent to you will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transfers.map((transfer) => (
            <div
              key={transfer.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {transfer.file.originalName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    From: {transfer.sender.username} ({transfer.sender.email})
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Size: {formatFileSize(transfer.file.size)} • 
                    Sent: {new Date(transfer.sentAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
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

              {transfer.status !== 'decrypted' && (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={decryptingId === transfer.id ? decryptKey : ''}
                    onChange={(e) => setDecryptKey(e.target.value)}
                    placeholder="Enter decryption key (key:iv)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => handleDecrypt(transfer)}
                    disabled={loading || !decryptKey}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {decryptingId === transfer.id ? 'Decrypting...' : 'Decrypt & Download'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="font-semibold text-green-900 mb-3">How to decrypt:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-green-800">
          <li>Get the decryption key from the sender</li>
          <li>Enter the key in the format: key:iv</li>
          <li>Click "Decrypt & Download"</li>
          <li>File will be decrypted in your browser and downloaded</li>
        </ol>
      </div>
    </div>
  );
}
