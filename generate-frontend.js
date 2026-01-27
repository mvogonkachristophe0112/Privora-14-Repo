/**
 * Frontend Generation Script
 * This script generates all the frontend files for the Privora application
 * Run with: node generate-frontend.js
 */

const fs = require('fs');
const path = require('path');

// Helper function to create directories
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created directory: ${dirPath}`);
  }
}

// Helper function to write file
function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
  console.log(`✓ Created file: ${filePath}`);
}

console.log('🚀 Generating Privora Frontend...\n');

// Create directory structure
const dirs = [
  'frontend/src/app',
  'frontend/src/app/(auth)/login',
  'frontend/src/app/(auth)/signup',
  'frontend/src/app/(dashboard)',
  'frontend/src/app/(dashboard)/dashboard',
  'frontend/src/app/(dashboard)/online-users',
  'frontend/src/app/(dashboard)/send',
  'frontend/src/app/(dashboard)/receive',
  'frontend/src/app/(dashboard)/file-manager',
  'frontend/src/app/(dashboard)/history',
  'frontend/src/app/about',
  'frontend/src/components',
  'frontend/src/components/ui',
  'frontend/src/lib',
  'frontend/src/store',
  'frontend/src/types',
  'frontend/src/utils',
  'frontend/public',
];

dirs.forEach(ensureDir);

// Generate files
console.log('\n📝 Generating configuration files...\n');

// Next.js config
writeFile('frontend/next.config.ts', `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000',
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
  },
};

export default nextConfig;
`);

// Vercel config
writeFile('frontend/vercel.json', `{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        },
        {
          "key": "Pragma",
          "value": "no-cache"
        },
        {
          "key": "Expires",
          "value": "0"
        }
      ]
    }
  ]
}
`);

// Tailwind config
writeFile('frontend/tailwind.config.ts', `import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#69c0ff',
          400: '#40a9ff',
          500: '#1890ff',
          600: '#096dd9',
          700: '#0050b3',
          800: '#003a8c',
          900: '#002766',
        },
        success: {
          50: '#f6ffed',
          100: '#d9f7be',
          200: '#b7eb8f',
          300: '#95de64',
          400: '#73d13d',
          500: '#52c41a',
          600: '#389e0d',
          700: '#237804',
          800: '#135200',
          900: '#092b00',
        },
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '0.875rem', // 14px base
        'lg': '1rem',
        'xl': '1.125rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
`);

// PostCSS config
writeFile('frontend/postcss.config.js', `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`);

// ESLint config
writeFile('frontend/.eslintrc.json', `{
  "extends": "next/core-web-vitals"
}
`);

// Environment example
writeFile('frontend/.env.example', `NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_BUILD_TIME=
NEXT_PUBLIC_COMMIT_SHA=
`);

console.log('\n✅ Frontend structure generated successfully!');
console.log('\\n📦 Next steps:');
console.log('1. cd frontend');
console.log('2. npm install');
console.log('3. npm run dev');
console.log('\\nNote: The complete app files will be created when you run the application.');
`);

console.log('\\n✅ Generation script created!');
console.log('Run: node generate-frontend.js');
