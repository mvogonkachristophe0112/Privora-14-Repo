'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { decryptFile, formatFileSize, downloadBlob } from '@/lib/crypto';
import { getSocket } from '@/lib/socket';
import toast from 'react-hot-toast';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { Download, Key, FileText, CheckCircle, Clock } from 'lucide-react';

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
  const [decryptKeys, setDecryptKeys] = useState<Record<string, string>>({});

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
    const key = decryptKeys[transfer.id];
    if (!key) {
      toast.error('Please enter the decryption key');
      return;
    }

    setDecryptingId(transfer.id);

    try {
      const response = await api.get(`/files/download/${transfer.file.id}`, {
        responseType: 'arraybuffer',
      });

      const [keyHex, ivHex] = key.split(':');
      if (!keyHex || !ivHex) {
        throw new Error('Invalid key format. Expected format: key:iv');
      }

      const decryptedData = await decryptFile(response.data, keyHex, ivHex);
      const blob = new Blob([decryptedData], { type: transfer.file.mimeType });
      downloadBlob(blob, transfer.file.originalName);

      await api.patch(`/transfers/${transfer.id}/status`, { status: 'decrypted' });

      toast.success('File decrypted and downloaded!');
      setDecryptKeys({ ...decryptKeys, [transfer.id]: '' });
      fetchTransfers();
    } catch (error) {
      console.error('Decryption error:', error);
      toast.error('Failed to decrypt file. Check your key.');
    } finally {
      setDecryptingId(null);
    }
  };

  if (loading) {
    return <Loading text="Loading received files..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Receive Files</h1>
        <p className="text-gray-600">Files sent to you by other users</p>
      </div>

      {/* Transfers List */}
      {transfers.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="📥"
              title="No files received yet"
              description="Files sent to you will appear here. You'll get a real-time notification when someone sends you a file."
            />
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {transfers.map((transfer) => (
            <Card key={transfer.id} className="animate-scale-in">
              <CardBody className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-primary-50 rounded-xl">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 truncate">
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
                      >
                        {transfer.status === 'decrypted' && <CheckCircle size={12} />}
                        {transfer.status === 'pending' && <Clock size={12} />}
                        {transfer.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={transfer.sender.username} size="sm" />
                        <span>From: {transfer.sender.username}</span>
                      </div>
                      <span>•</span>
                      <span>{formatFileSize(transfer.file.size)}</span>
                      <span>•</span>
                      <span>{new Date(transfer.sentAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {transfer.status !== 'decrypted' && (
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <Key className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Get the decryption key from the sender and enter it below</span>
                    </div>
                    <div className="flex gap-3">
                      <Input
                        type="text"
                        value={decryptKeys[transfer.id] || ''}
                        onChange={(e) =>
                          setDecryptKeys({ ...decryptKeys, [transfer.id]: e.target.value })
                        }
                        placeholder="Enter decryption key (key:iv)"
                        disabled={decryptingId === transfer.id}
                      />
                      <Button
                        variant="primary"
                        onClick={() => handleDecrypt(transfer)}
                        disabled={!decryptKeys[transfer.id] || decryptingId === transfer.id}
                        loading={decryptingId === transfer.id}
                        className="whitespace-nowrap"
                      >
                        <Download size={18} />
                        Decrypt & Download
                      </Button>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Instructions */}
      <Card className="bg-gradient-to-r from-green-50 to-success-50 border-green-200">
        <CardBody className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Key className="w-5 h-5 text-green-600" />
            How to decrypt files
          </h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="font-semibold text-success-600">1.</span>
              <span>Get the decryption key from the sender (via secure channel)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-success-600">2.</span>
              <span>Enter the key in the format: key:iv</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-success-600">3.</span>
              <span>Click "Decrypt & Download" to decrypt and save the file</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-success-600">4.</span>
              <span>File is decrypted in your browser and downloaded automatically</span>
            </li>
          </ol>
        </CardBody>
      </Card>
    </div>
  );
}
