'use client';
import React, { useState } from 'react';
import Image from 'next/image';

type AuthMode = 'login' | 'signup';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'user', // 'user' for regular user, 'partner' for partner
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would implement the actual authentication logic
    console.log('Form submitted:', { ...formData, mode });
    // For now, redirect to dashboard after a short delay
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4">
            <Image 
              src="/header-logo.png" 
              alt="Prithvi Nature Club Logo" 
              width={64} 
              height={64} 
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Prithvi Nature Club
          </h1>
          <p className="text-gray-600 mt-2">
            {mode === 'login' ? 'Welcome back! Please sign in' : 'Create your account'}
          </p>
        </div>
        
        {/* Auth Toggle */}
        <div className="flex bg-white/80 backdrop-blur rounded-xl p-1 mb-8 shadow-sm border border-emerald-100">
          <button
            className={`flex-1 py-3 px-4 rounded-lg text-center font-medium transition-all duration-300 ${
              mode === 'login'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-gray-700 hover:bg-white'
            }`}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-3 px-4 rounded-lg text-center font-medium transition-all duration-300 ${
              mode === 'signup'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-gray-700 hover:bg-white'
            }`}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>
        
        {/* User Type Selector */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Account Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className={`py-3 px-4 rounded-lg border transition-all duration-300 ${
                formData.userType === 'user'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-medium'
                  : 'border-gray-300 text-gray-700 hover:border-emerald-300'
              }`}
              onClick={() => setFormData({...formData, userType: 'user'})}
            >
              Regular User
            </button>
            <button
              type="button"
              className={`py-3 px-4 rounded-lg border transition-all duration-300 ${
                formData.userType === 'partner'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-medium'
                  : 'border-gray-300 text-gray-700 hover:border-emerald-300'
              }`}
              onClick={() => setFormData({...formData, userType: 'partner'})}
            >
              Partner
            </button>
          </div>
        </div>
        
        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100/30">
          {mode === 'signup' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-300"
                placeholder="Enter your full name"
                required={mode === 'signup'}
              />
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-300"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-300"
              placeholder="Create a password"
              required
            />
          </div>
          
          {mode === 'signup' && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-300"
                placeholder="Confirm your password"
                required={mode === 'signup'}
              />
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-300 shadow-md"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        {mode === 'login' && (
          <div className="mt-4 text-center">
            <a href="#" className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
              Forgot password?
            </a>
          </div>
        )}
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-emerald-600 hover:underline">Terms of Service</a>{' '}
            and <a href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;