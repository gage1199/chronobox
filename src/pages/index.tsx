import React from 'react';
import Link from 'next/link';
import { Shield, Clock, Cloud, Play } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your memories are protected with enterprise-grade encryption and secure cloud storage.'
    },
    {
      icon: Clock,
      title: 'Time Capsule Release',
      description: 'Schedule your memories to be shared at the perfect moment, even decades in the future.'
    },
    {
      icon: Cloud,
      title: 'Cloud Backup',
      description: 'Never lose your precious memories with automatic, redundant cloud backup systems.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">ChronoBox</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="primary">Get Started</Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
              Your Story{' '}
              <span className="text-amber-500">Matters</span>
            </h1>
            
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Preserve your most precious memories and messages for future generations. 
              ChronoBox helps you create a secure digital legacy that will be treasured forever.
            </p>

            {/* Video placeholder */}
            <div className="mt-12 relative max-w-4xl mx-auto">
              <div className="aspect-video bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-500 font-medium">
                    Watch How ChronoBox Works
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Video placeholder - Coming soon
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto px-8">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-4 py-16 bg-gray-50 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Built for Your Peace of Mind
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Every feature designed to protect and preserve what matters most
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map(({ icon: Icon, title, description }, index) => (
                <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Start Preserving Your Legacy Today
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Join thousands of families who trust ChronoBox with their most precious memories.
            </p>
            <div className="mt-8">
              <Link href="/auth/register">
                <Button size="lg" className="px-8">
                  Create Your Free Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-xl font-bold">ChronoBox</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 ChronoBox. Preserving memories for future generations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 