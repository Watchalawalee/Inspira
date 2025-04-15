'use client';
import { useState } from 'react';
import Image from 'next/image';
import bglogin from '../public/bglogin.svg';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if username and password are provided
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    // Simple validation for incorrect username or password
    if (username !== 'correctUsername' || password !== 'correctPassword') {
      setError('Invalid username or password');
      return;
    }

    setError(''); // Clear the error after successful login attempt

    // Show success modal after login
    setModalVisible(true);
    
    // Optionally clear the form after successful login
    setUsername('');
    setPassword('');
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative">
      <Image src={bglogin} alt="Background" className="absolute bottom-0 z-0 min-w-screen" />
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
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
          <div className="mt-6 flex justify-between text-gray-600 text-md">
            <p>
              New User? <a href="/signup" className="text-blue-500 underline">Signup</a>
            </p>
            <p>
              <a href="/forgetpassword" className="text-blue-500 underline">Forget Password</a>
            </p>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
      <button
        onClick={handleLogin} // Trigger form submission when clicked
        className="mt-4 bg-[#5372A4] text-white px-6 py-2 rounded-full w-60 hover:bg-blue-700"
      >
        Login
      </button>

      {/* Success Modal */}
      {modalVisible && (
        <div className="modal open">
          <div className="bg-[#2A2B5A] text-white p-8 rounded-lg text-center w-[480px] xl:w-60">
            <div className="checkmark-container">
              <div>
                <img alt="Check" src="/Check.png"/>
              </div>
            </div>
            <p className="text-bold text-[20px]">Your login is successful!</p>
            <button
              className="close-button"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


