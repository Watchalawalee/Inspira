'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Signup() {
  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [resendEmail, setResendEmail] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    gender: '',
    dob: '',
    interests: [] as string[],
  });

  const steps = ['User Info', 'Gender & Birthdate', 'Interests'];
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.map((c: any) => c.name)))
      .catch(() => setCategories([]));
  }, []);

  const isStepValid = () => {
    if (step === 0) {
      const { username, password, email } = formData;
      return (
        username.trim() !== '' &&
        password.trim() !== '' &&
        email.includes('@') &&
        email.trim() !== ''
      );
    }
  
    if (step === 1) {
      const { gender, dob } = formData;
      return gender.trim() !== '' && dob.trim() !== '';
    }
  
    if (step === 2) {
      return formData.interests.length > 0;
    }
  
    return true;
  };
  const handleNext = () => {
    const valid = isStepValid();
    setShowErrors(true); // แสดงข้อความเตือนเสมอเมื่อกด
  
    if (!valid) return;
  
    setShowErrors(false); //  clear error
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };
  


  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleButtonClick = (value: string) => {
    setFormData((prev) => {
      const isSelected = prev.interests.includes(value);
      let updated = isSelected
        ? prev.interests.filter((v) => v !== value)
        : [...prev.interests, value];

      if (updated.length > 3) updated = updated.slice(0, 3);
      return { ...prev, interests: updated };
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          birthdate: formData.dob,
        }),
      });
      const data = await res.json();
      alert(data.msg || data.error || 'สมัครสมาชิกเรียบร้อยแล้ว');
    } catch (err) {
      alert('สมัครไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = await res.json();
      alert(data.message || data.error || 'Done');
    } catch {
      alert('Resend failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-blue-200 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Signup</h1>

        <div className="flex justify-center space-x-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${index === step ? 'bg-gray-800' : 'bg-[#D9D9D9]'}`}
            ></div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="space-y-4 text-left"
          >
            {step === 0 && (
              <>
                <label className="block text-sm mb-1">User Name *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className="w-full p-3 bg-gray-100 rounded-md"
                  required
                />
                {showErrors && formData.username.trim() === '' && (
                  <p className="text-red-500 text-sm mt-1">กรุณากรอกชื่อผู้ใช้</p>
                )}
                <label className="block text-sm mb-1">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full p-3 bg-gray-100 rounded-md"
                  required
                />
                {showErrors && formData.password.trim() === '' ? (
                  <p className="text-red-500 text-sm mt-1">กรุณากรอกรหัสผ่าน</p>
                ) : showErrors && formData.password.length < 6 ? (
                  <p className="text-red-500 text-sm mt-1">รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</p>
                ) : null}
                <label className="block text-sm mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full p-3 bg-gray-100 rounded-md"
                  required
                />
                {showErrors && formData.email.trim() === '' ? (
                  <p className="text-red-500 text-sm mt-1">กรุณากรอกอีเมล</p>
                ) : showErrors && !formData.email.includes('@') ? (
                  <p className="text-red-500 text-sm mt-1">รูปแบบอีเมลไม่ถูกต้อง</p>
                ) : null}
              </>
            )}
            {step === 1 && (
              <>
                <label className="block text-sm mb-1">Gender *</label>
                <div className="flex space-x-4">
                  {['male', 'female', 'other'].map((g) => (
                    <label key={g} className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={(e) => handleChange('gender', e.target.value)}
                        className="mr-2"
                      />
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </label>
                  ))}
                </div>
                {showErrors && formData.gender.trim() === '' && (
                  <p className="text-red-500 text-sm mt-1">กรุณาเลือกเพศ</p>
                )}
                <label className="block text-sm mb-1 mt-4">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleChange('dob', e.target.value)}
                  className="w-full p-3 bg-gray-100 rounded-md"
                  required
                />
                {showErrors && formData.dob.trim() === '' && (
                  <p className="text-red-500 text-sm mt-1">กรุณากรอกวันเกิด</p>
                )}
              </>
            )}
            {step === 2 && (
              <>
                <label className="block text-sm mb-1">Interests (Max 3)</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => handleButtonClick(interest)}
                      type="button"
                      className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${
                        formData.interests.includes(interest)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                {showErrors && formData.interests.length === 0 && (
                  <p className="text-red-500 text-sm mt-1">กรุณาเลือกอย่างน้อย 1 หมวดความสนใจ</p>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
            disabled={step === 0}
            className={`w-1/2 py-3 rounded-full border ${
              step === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-400 hover:bg-gray-100'
            }`}
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="w-1/2 py-3 rounded-full bg-[#5372A4] text-white hover:bg-blue-700"
          >
            {step === steps.length - 1 ? 'Register' : 'Next'}
          </button>
        </div>
      {/* 
        <div className="mt-10 text-left border-t pt-6">
          <h3 className="text-sm font-semibold mb-2">ยังไม่ได้รับอีเมลยืนยัน?</h3>
          <form onSubmit={handleResend} className="flex gap-2">
            <input
              type="email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 p-2 rounded-md border border-gray-300"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ส่งอีกครั้ง
            </button>
          </form>
        </div>*/}
      </div>
    </div>
  );
}
