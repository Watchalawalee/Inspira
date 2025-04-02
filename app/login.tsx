'use client';
import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in:', { username, password });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-green-100 via-white to-pink-200">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <p className="text-gray-600 mb-6">Welcome back! Please login to your account.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="w-full text-left">
              <label className="block text-md mb-2">User Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 bg-gray-200 text-gray-800 rounded-md border-none"
              />
            </div>
            <div className="w-full text-left mt-4">
              <label className="block text-md mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-200 text-gray-800 rounded-md border-none"
              />
            </div>  
          </form>
        <p className="mt-6 text-gray-600 text-left text-md">
          New User? <a href="/signup" className="text-blue-500 underline">Signup</a>
        </p>
      </div>
      <button 
        type="submit" 
        className="mt-4 bg-[#FFA3A3] px-6 py-2 rounded-full w-60 text-lg font-semibold hover:bg-red-400"
      >
        Login
      </button>
    </div>
  );
}
