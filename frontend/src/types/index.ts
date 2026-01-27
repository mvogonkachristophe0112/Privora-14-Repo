// User types
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt?: string;
}

// File types
export interface File {
  id: string;
  originalName: string;
  encryptedName: string;
  size: number;
  mimeType: string;
  uploaderId: string;
  uploadedAt: string;
}

// Transfer types
export interface Transfer {
  id: string;
  fileId: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'received' | 'decrypted';
  sentAt: string;
  receivedAt?: string;
  decryptedAt?: string;
  file: File;
  sender?: User;
  receiver?: User;
}

// Online user types
export interface OnlineUser {
  userId: string;
  username: string;
  email: string;
  connectedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Socket event types
export interface SocketEvents {
  'online-users-updated': (data: { onlineUsers: OnlineUser[] }) => void;
  'file-received': (data: { transfer: Transfer }) => void;
  'user-connected': (data: { user: OnlineUser }) => void;
  'user-disconnected': (data: { userId: string }) => void;
}

// API response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// Stats types
export interface DashboardStats {
  totalFiles: number;
  sentFiles: number;
  receivedFiles: number;
  onlineUsers: number;
}
