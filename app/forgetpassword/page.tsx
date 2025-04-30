"use client";

import React, { useState } from "react";
import Image from 'next/image';


const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pinSent, setPinSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sendPIN = async () => {
    if (!email) return setError("กรุณากรอกอีเมล");

    try {
      const res = await fetch("http://localhost:5000/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setPinSent(true);
        setError("");
        setMessage("📩 ส่ง PIN ไปยังอีเมลเรียบร้อยแล้ว");
      } else {
        setError(data.message || "เกิดข้อผิดพลาดในการส่ง PIN");
      }
    } catch {
      setError("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  const confirmPIN = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || !email) return setError("กรุณากรอกอีเมลและ PIN");

    try {
      const res = await fetch("http://localhost:5000/auth/confirm-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pin, newPassword: "__dummy__" }),
      });

      const data = await res.json();
      if (res.ok && data.verified) {
        setVerified(true);
        setMessage("✅ PIN ถูกต้อง กรุณาตั้งรหัสผ่านใหม่");
        setError("");
      } else {
        setError(data.message || "PIN ไม่ถูกต้อง");
      }
    } catch {
      setError("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  const resetPassword = async () => {
    if (!newPassword || !confirmPassword)
      return setError("กรุณากรอกรหัสผ่านทั้ง 2 ช่อง");
    if (newPassword !== confirmPassword)
      return setError("รหัสผ่านไม่ตรงกัน");

    try {
      const res = await fetch("http://localhost:5000/auth/confirm-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pin, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("🎉 เปลี่ยนรหัสผ่านสำเร็จแล้ว! กรุณาเข้าสู่ระบบ");
        setVerified(false);
      } else {
        setError(data.message || data.error);
      }
    } catch {
      setError("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
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
      <h2 className="text-2xl font-semibold text-[#5b78a4] mb-4">Forget password</h2>
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        {/* Email Input */}
        <label className="text-sm text-gray-700 mb-1">Enter your email</label>
        <input
          type="email"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#5b78a4]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={sendPIN}
          className="w-full bg-[#5b78a4] text-white py-2 rounded-lg hover:bg-[#4a6795] transition"
        >
          Send PIN
        </button>

        {/* PIN Form */}
        {pinSent && (
          <form onSubmit={confirmPIN} className="mt-6">
            <label className="text-sm text-gray-700 mb-1">Enter PIN</label>
            <input
              type="text"
              maxLength={6}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#5b78a4]"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-[#5b78a4] text-white py-2 rounded-lg hover:bg-[#4a6795] transition"
            >
              Confirm PIN
            </button>
          </form>
        )}

        {/* Password Reset */}
        {verified && (
          <div className="mt-6">
            <label className="text-sm text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#5b78a4]"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label className="text-sm text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#5b78a4]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={resetPassword}
              className="w-full bg-[#5b78a4] text-white py-2 rounded-lg hover:bg-[#4a6795] transition"
            >
              Change Password
            </button>
          </div>
        )}

        {/* Feedback */}
        {message && <p className="text-green-600 text-sm mt-4">{message}</p>}
        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
