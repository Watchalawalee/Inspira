'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError('⚠️ โปรดกรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/auth/login', {
        username: username.trim(),
        password: password.trim(),
      });

      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setError('');
      setUsername('');
      setPassword('');

      // ✅ ไปหน้า /home หลัง Login สำเร็จ
      router.push('/home');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
      setError(`❌ ${msg}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative">
      <Image
        src="/bglogin.svg"
        alt="Background"
        width={1440}
        height={200}
        className="absolute bottom-0 z-0 min-w-screen object-fill object-bottom"
      />
      <h1 className="text-2xl font-semibold mb-4 z-10">Login</h1>
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md text-center z-10">
        <p className="text-gray-600 mb-6">Welcome back! Please login to your account.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="w-full text-left">
            <label className="block text-md mb-2">User Name or Email</label>
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
              New User?{' '}
              <Link href="/register" className="text-blue-500 underline">
                Signup
              </Link>
            </p>
            <p>
              <Link href="/forgetpassword" className="text-blue-500 underline">
                Forget Password
              </Link>
            </p>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className="mt-4 bg-[#5372A4] text-white px-6 py-2 rounded-full w-60 hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
