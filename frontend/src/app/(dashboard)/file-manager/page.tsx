'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatFileSize } from '@/lib/crypto';
import toast from 'react-hot-toast';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { Trash2, Download, FileText, Search, Filter } from 'lucide-react';

interface File {
  id: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export default function FileManagerPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await api.get('/files');
      setFiles(response.data.files);
    } catch (error) {
      console.error('Failed to fetch files:', error);
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId: string, filename: string) => {
    if (!confirm(`Delete "${filename}"?`)) return;

    try {
      await api.delete(`/files/${fileId}`);
      toast.success('File deleted successfully');
      fetchFiles();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleDownload = async (fileId: string, filename: string) => {
    try {
      const response = await api.get(`/files/download/${fileId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('File downloaded (encrypted)');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const filteredFiles = files.filter((file) =>
    file.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading text="Loading files..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">File Manager</h1>
          <p className="text-gray-600">{files.length} files uploaded</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Files List */}
      {filteredFiles.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="📁"
              title={searchTerm ? 'No files match your search' : 'No files uploaded yet'}
              description={searchTerm ? 'Try a different search term' : 'Upload files by sending them to other users'}
            />
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredFiles.map((file) => (
            <Card key={file.id} hover>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-50 rounded-xl">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate mb-1">
                      {file.originalName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{file.mimeType}</span>
                      <span>•</span>
                      <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(file.id, file.originalName)}
                      title="Download (encrypted)"
                    >
                      <Download size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(file.id, file.originalName)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardBody className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">About Your Files</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                All files are stored in encrypted form. Download them here to get the encrypted version, or decrypt them in the Receive page if they were sent to you.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
