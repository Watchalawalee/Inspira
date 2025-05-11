'use client';

import React, { useState } from "react";
import Image from 'next/image';

const ChangePassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword)
      return setError("กรุณากรอกรหัสผ่านทั้ง 3 ช่อง");

    if (newPassword !== confirmPassword)
      return setError("รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน");

    try {
      // ส่งข้อมูลเพื่อเปลี่ยนรหัสผ่าน (คุณสามารถปรับ endpoint ตามที่คุณใช้)
      const token = localStorage.getItem('token');
      if (!token) return setError("กรุณาเข้าสู่ระบบใหม่อีกครั้ง");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });


      const data = await res.json();
      if (res.ok) {
        setMessage("🎉 รหัสผ่านของคุณได้รับการเปลี่ยนเรียบร้อยแล้ว!");
      } else {
        setError(data.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
      }
    } catch {
      setError("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative pb-24">
        <Image
            src="/bglogin.svg"
            alt="Background"
            width={1440}
            height={200}
            className="absolute bottom-0 z-0 min-w-screen object-fill object-bottom"
        />
      <h1 className="text-2xl font-semibold  mb-4">Change password</h1>
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        {/* Old Password Input */}
        <label className="text-sm text-gray-700 mb-1">Old Password</label>
        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#5b78a4]"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        {/* New Password Input */}
        <label className="text-sm text-gray-700 mb-1">New Password</label>
        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#5b78a4]"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        {/* Confirm New Password Input */}
        <label className="text-sm text-gray-700 mb-1">Confirm New Password</label>
        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#5b78a4]"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* Change Password Button */}
        <button
          onClick={handleChangePassword}
          className="w-full bg-[#5b78a4] text-white py-2 rounded-full hover:bg-[#4a6795] transition"
        >
          Change Password
        </button>

        {/* Feedback */}
        {message && <p className="text-green-600 text-sm mt-4">{message}</p>}
        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default ChangePassword;
