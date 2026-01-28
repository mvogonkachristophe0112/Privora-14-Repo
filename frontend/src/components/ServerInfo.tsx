'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { Wifi, Copy, CheckCircle, Server } from 'lucide-react';

interface ServerInfoData {
  serverIP: string;
  frontendURL: string;
  backendURL: string;
  socketURL: string;
}

export default function ServerInfo() {
  const [serverInfo, setServerInfo] = useState<ServerInfoData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchServerInfo = async () => {
      try {
        const response = await api.get('/server-info');
        setServerInfo(response.data);
      } catch (error) {
        console.error('Failed to fetch server info:', error);
      }
    };

    fetchServerInfo();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!serverInfo) {
    return null;
  }

  const isLocalNetwork = serverInfo.serverIP !== 'localhost' && !serverInfo.serverIP.startsWith('127.');

  return (
    <Card className="bg-gradient-to-r from-primary-50 to-success-50 border-primary-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Wifi className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Local Network Access</h3>
            <p className="text-xs text-gray-600">Share this URL with devices on your Wi-Fi</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Server IP */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Server IP Address</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono text-gray-900">
              {serverInfo.serverIP}
            </code>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => copyToClipboard(serverInfo.serverIP)}
            >
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            </Button>
          </div>
        </div>

        {/* Frontend URL */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Access URL (Share this)</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-white border border-primary-300 rounded-lg text-sm font-mono text-primary-700 font-semibold">
              {serverInfo.frontendURL}
            </code>
            <Button
              variant="primary"
              size="sm"
              onClick={() => copyToClipboard(serverInfo.frontendURL)}
            >
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            </Button>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-success-700">
              {isLocalNetwork ? 'LAN Mode Active' : 'Localhost Mode'}
            </span>
          </div>
        </div>

        {/* Instructions */}
        {isLocalNetwork && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>📱 To access from other devices:</strong><br/>
              1. Connect device to the same Wi-Fi network<br/>
              2. Open browser and visit: <strong>{serverInfo.frontendURL}</strong><br/>
              3. If connection fails, check firewall settings
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
