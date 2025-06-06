import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Button from '../components/ui/Button';

const Custom404: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">ChronoBox</span>
        </Link>

        {/* 404 Content */}
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-amber-500 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Page Not Found
            </h2>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto px-8">
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto px-6">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              
              <Link href="/memories">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto px-6">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Memories
                </Button>
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              If you believe this is an error, please{' '}
              <a 
                href="mailto:support@chronobox.com" 
                className="text-amber-600 hover:text-amber-500 font-medium"
              >
                contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Custom404; 