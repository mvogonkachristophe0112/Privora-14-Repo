'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { encryptFile, formatFileSize } from '@/lib/crypto';
import toast from 'react-hot-toast';

interface User {
  id: string;
  username: string;
  email: string;
}

export default function SendPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [encryptionKey, setEncryptionKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'encrypt' | 'send'>('select');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data.users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error('Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStep('encrypt');
    }
  };

  const handleEncryptAndUpload = async () => {
    if (!file) return;

    setLoading(true);
    try {
      // Encrypt file
      const { encryptedData, key, iv } = await encryptFile(file);
      setEncryptionKey(`${key}:${iv}`);

      // Upload encrypted file
      const formData = new FormData();
      formData.append('file', new Blob([encryptedData]));
      formData.append('originalName', file.name);
      formData.append('mimeType', file.type);

      const response = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('File encrypted and uploaded!');
      setStep('send');
      return response.data.file.id;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (fileId: string) => {
    if (!selectedUser) {
      toast.error('Please select a recipient');
      return;
    }

    setLoading(true);
    try {
      await api.post('/transfers', {
        fileId,
        receiverId: selectedUser,
      });

      toast.success('File sent successfully!');
      
      // Reset form
      setFile(null);
      setSelectedUser('');
      setEncryptionKey('');
      setStep('select');
    } catch (error) {
      console.error('Send error:', error);
      toast.error('Failed to send file');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 'encrypt') {
      const fileId = await handleEncryptAndUpload();
      if (fileId) {
        await handleSend(fileId);
      }
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Send File</h1>
      <p className="text-gray-600 mb-8">Encrypt and send a file securely</p>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        {/* Step 1: Select File */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            1. Select File
          </label>
          <input
            type="file"
            onChange={handleFileSelect}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            disabled={loading}
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {file.name} ({formatFileSize(file.size)})
            </p>
          )}
        </div>

        {/* Step 2: Select Recipient */}
        {file && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              2. Select Recipient
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              disabled={loading}
            >
              <option value="">Choose a user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Step 3: Encryption Key Display */}
        {encryptionKey && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 mb-2">
              ⚠️ Important: Save this encryption key!
            </p>
            <code className="block p-3 bg-white border border-yellow-300 rounded text-xs font-mono break-all">
              {encryptionKey}
            </code>
            <p className="text-xs text-yellow-700 mt-2">
              Share this key with the recipient securely (not through this app).
              They will need it to decrypt the file.
            </p>
          </div>
        )}

        {/* Submit Button */}
        {file && selectedUser && (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Encrypt and Send'}
          </button>
        )}
      </form>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">How it works:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
          <li>Select a file from your device</li>
          <li>Choose a recipient from the list</li>
          <li>File is encrypted with AES-256-GCM in your browser</li>
          <li>Encrypted file is uploaded to the server</li>
          <li>Recipient is notified in real-time</li>
          <li>Share the encryption key with recipient securely</li>
        </ol>
      </div>
    </div>
  );
}
