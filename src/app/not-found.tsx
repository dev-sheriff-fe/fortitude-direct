import { Suspense } from 'react';
import Link from 'next/link';
import Header from '@/../fortitude-app/layout/header';
import Footer from '@/../fortitude-app/layout/footer';

function NotFoundContent() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Being cooked 🧑‍🍳</h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <Link
            href="/"
            className="bg-[#d8480b] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <NotFoundContent />
    </Suspense>
  );
}