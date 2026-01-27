import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-success-500">
      <div className="text-center text-white p-8 max-w-2xl">
        <h1 className="text-5xl font-bold mb-4">🔒 Privora</h1>
        <p className="text-2xl mb-2">Secure Encrypted File Transfer</p>
        <p className="text-lg mb-8 opacity-90">
          End-to-end encryption • Real-time presence • Zero-knowledge architecture
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/login"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition"
          >
            Sign Up
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="text-3xl mb-2">🔐</div>
            <div className="font-semibold">AES-256-GCM</div>
            <div className="opacity-75">Client-side encryption</div>
          </div>
          <div>
            <div className="text-3xl mb-2">⚡</div>
            <div className="font-semibold">Real-time</div>
            <div className="opacity-75">Instant notifications</div>
          </div>
          <div>
            <div className="text-3xl mb-2">🌐</div>
            <div className="font-semibold">Zero-knowledge</div>
            <div className="opacity-75">Keys never stored</div>
          </div>
        </div>
        <div className="mt-8">
          <Link href="/about" className="text-white opacity-75 hover:opacity-100 underline">
            Learn more →
          </Link>
        </div>
      </div>
    </main>
  );
}
