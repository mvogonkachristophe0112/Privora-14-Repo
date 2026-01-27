'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { encryptFile, formatFileSize } from '@/lib/crypto';
import toast from 'react-hot-toast';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Loading } from '@/components/ui/Loading';
import { Upload, FileText, Key, Send, CheckCircle, AlertCircle } from 'lucide-react';

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
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [dragActive, setDragActive] = useState(false);

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStep(2);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStep(2);
    }
  };

  const handleEncryptAndSend = async () => {
    if (!file || !selectedUser) return;

    setLoading(true);
    try {
      // Encrypt file
      const { encryptedData, key, iv } = await encryptFile(file);
      const fullKey = `${key}:${iv}`;
      setEncryptionKey(fullKey);

      // Upload encrypted file
      const formData = new FormData();
      formData.append('file', new Blob([encryptedData]));
      formData.append('originalName', file.name);
      formData.append('mimeType', file.type);

      const uploadResponse = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Send to recipient
      await api.post('/transfers', {
        fileId: uploadResponse.data.file.id,
        receiverId: selectedUser,
      });

      toast.success('File sent successfully!');
      setStep(3);
    } catch (error) {
      console.error('Send error:', error);
      toast.error('Failed to send file');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setSelectedUser('');
    setEncryptionKey('');
    setStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Send File</h1>
        <p className="text-gray-600">Encrypt and send a file securely to another user</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <StepIndicator number={1} label="Select File" active={step >= 1} completed={step > 1} />
        <div className={`h-0.5 w-16 ${step > 1 ? 'bg-primary-500' : 'bg-gray-300'}`} />
        <StepIndicator number={2} label="Choose Recipient" active={step >= 2} completed={step > 2} />
        <div className={`h-0.5 w-16 ${step > 2 ? 'bg-primary-500' : 'bg-gray-300'}`} />
        <StepIndicator number={3} label="Complete" active={step >= 3} completed={step === 3} />
      </div>

      {/* Step 1: File Upload */}
      {step === 1 && (
        <Card className="animate-scale-in">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary-600" />
              Upload File
            </h2>
          </CardHeader>
          <CardBody className="p-8">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              }`}
            >
              <Upload className={`w-16 h-16 mx-auto mb-4 ${dragActive ? 'text-primary-500' : 'text-gray-400'}`} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Drop your file here
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                or click to browse from your device
              </p>
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="inline-block">
                <span className="btn btn-primary bg-primary-500 text-white hover:bg-primary-600 px-6 py-2.5 rounded-lg font-medium cursor-pointer inline-flex items-center gap-2 transition-all shadow-sm hover:shadow-md">
                  Choose File
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-4">
                Maximum file size: 100MB
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Step 2: Select Recipient */}
      {step === 2 && file && (
        <div className="space-y-6 animate-scale-in">
          {/* File Preview */}
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary-50 rounded-xl">
                  <FileText className="w-8 h-8 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{file.name}</h3>
                  <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                  Change
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Select Recipient */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Select Recipient</h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user.id)}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedUser === user.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Avatar name={user.username} size="md" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{user.username}</h4>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    </div>
                    {selectedUser === user.id && (
                      <CheckCircle className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleEncryptAndSend}
                  disabled={!selectedUser || loading}
                  loading={loading}
                  className="flex-1"
                >
                  <Send size={18} />
                  Encrypt & Send
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <Card className="animate-scale-in">
          <CardBody className="p-12 text-center">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">File Sent Successfully!</h2>
            <p className="text-gray-600 mb-8">
              The recipient has been notified and can now decrypt the file.
            </p>

            {/* Encryption Key */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3 mb-4">
                <Key className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-1">Encryption Key</h3>
                  <p className="text-sm text-yellow-700 mb-3">
                    Share this key with the recipient securely (not through this app)
                  </p>
                  <code className="block p-3 bg-white border border-yellow-300 rounded-lg text-xs font-mono break-all text-gray-900">
                    {encryptionKey}
                  </code>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(encryptionKey);
                  toast.success('Key copied to clipboard!');
                }}
                className="w-full"
              >
                Copy Key
              </Button>
            </div>

            <Button variant="primary" onClick={resetForm} className="w-full max-w-xs">
              Send Another File
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-gradient-to-r from-blue-50 to-primary-50 border-blue-200">
        <CardBody className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            How it works
          </h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="font-semibold text-primary-600">1.</span>
              <span>Select a file from your device or drag and drop</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary-600">2.</span>
              <span>Choose a recipient from the list of users</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary-600">3.</span>
              <span>File is encrypted with AES-256-GCM in your browser</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary-600">4.</span>
              <span>Encrypted file is uploaded and sent to recipient</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary-600">5.</span>
              <span>Share the encryption key with recipient securely</span>
            </li>
          </ol>
        </CardBody>
      </Card>
    </div>
  );
}

function StepIndicator({ number, label, active, completed }: any) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
          completed
            ? 'bg-primary-500 text-white'
            : active
            ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500'
            : 'bg-gray-200 text-gray-500'
        }`}
      >
        {completed ? <CheckCircle size={20} /> : number}
      </div>
      <span className={`text-xs font-medium ${active ? 'text-gray-900' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  );
}
