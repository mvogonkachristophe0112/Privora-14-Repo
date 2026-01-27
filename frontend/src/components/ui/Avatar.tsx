import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'none';
  src?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  status = 'none',
  src,
  className = '',
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`avatar ${sizes[size]} rounded-full bg-primary-100 text-primary-700 font-semibold flex items-center justify-center overflow-hidden`}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {status !== 'none' && (
        <span
          className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 border-white ${
            status === 'online' ? 'bg-success-500' : 'bg-gray-400'
          }`}
        />
      )}
    </div>
  );
};
