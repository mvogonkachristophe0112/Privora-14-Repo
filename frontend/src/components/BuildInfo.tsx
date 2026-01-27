'use client';

export default function BuildInfo() {
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || 'Unknown';
  const commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA || 'development';

  return (
    <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-lg mb-4 text-gray-800">📦 Build Information</h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <span className="font-medium text-gray-600 min-w-[100px]">Commit SHA:</span>
          <code className="bg-white px-3 py-1 rounded border border-gray-300 font-mono text-xs">
            {commitSha.substring(0, 7)}
          </code>
        </div>
        <div className="flex items-start gap-3">
          <span className="font-medium text-gray-600 min-w-[100px]">Build Time:</span>
          <code className="bg-white px-3 py-1 rounded border border-gray-300 font-mono text-xs">
            {new Date(buildTime).toLocaleString()}
          </code>
        </div>
        <div className="flex items-start gap-3">
          <span className="font-medium text-gray-600 min-w-[100px]">Environment:</span>
          <code className="bg-white px-3 py-1 rounded border border-gray-300 font-mono text-xs">
            {process.env.NODE_ENV}
          </code>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-500">
        ✅ If the commit SHA matches your latest commit, the deployment is up-to-date.
      </p>
    </div>
  );
}
