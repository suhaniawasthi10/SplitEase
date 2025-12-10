import React from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Zap } from 'lucide-react';

const Home: React.FC = () => {
  const scrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToHowItWorks = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const ctaSection = document.getElementById('how-it-works');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">SE</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SplitEase</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#features" onClick={scrollToFeatures} className="text-gray-700 hover:text-gray-900 font-medium cursor-pointer">
                Features
              </a>
              <a href="#how-it-works" onClick={scrollToHowItWorks} className="text-gray-700 hover:text-gray-900 font-medium cursor-pointer">
                How It Works
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              Now Available
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Split expenses
              <br />
              <span className="text-emerald-600">easily</span> with your
              <br />
              friends 💸
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Track group expenses, settle up, and stay stress-free. No more awkward money conversations.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition duration-200 shadow-lg shadow-emerald-600/30"
              >
                Login
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-emerald-600 hover:text-emerald-600 transition duration-200"
              >
                Sign Up
              </Link>
            </div>
            <div className="mt-12">
              <p className="text-sm text-gray-500 mb-3">Trusted by friends everywhere</p>
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">A</div>
                  <div className="w-8 h-8 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">B</div>
                  <div className="w-8 h-8 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">C</div>
                </div>
                <span className="text-sm text-gray-600 font-medium">+1000 friend groups</span>
              </div>
            </div>
          </div>

          {/* Right Content - Expense Card */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Expenses</h3>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">Group Trip</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-semibold">S</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Sarah</p>
                      <p className="text-sm text-red-600">owes you</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900">$24.50</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-semibold">M</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Mike</p>
                      <p className="text-sm text-emerald-600">you owe</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900">$18.75</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">E</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Emma</p>
                      <p className="text-sm text-gray-600">settled</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-400">$12.25</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose SplitEase?</h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage shared expenses with friends, without the complexity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-emerald-200 transition duration-200">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Group Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Create groups, add friends, and manage multiple friend circles effortlessly.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-emerald-200 transition duration-200">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Settlements</h3>
              <p className="text-gray-600 leading-relaxed">
                Our algorithm finds the optimal way to settle debts with minimal transactions.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-emerald-200 transition duration-200">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Notifications</h3>
              <p className="text-gray-600 leading-relaxed">
                Get real-time updates when expenses are added or settled in your groups.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to simplify?</h2>
          <p className="text-xl text-emerald-50 mb-8">
            Join thousands of friend groups already using SplitEase
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-gray-50 transition duration-200 shadow-lg"
          >
            Get Started Free
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">© 2025 SplitEase. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Privacy</Link>
              <Link to="/" className="text-gray-600 hover:text-gray-900">Terms</Link>
              <Link to="/" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
