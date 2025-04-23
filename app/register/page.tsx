'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Signup() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    gender: '',
    dob: '',
    interests: [] as string[], // เก็บข้อมูลประเภทที่เลือก
  });

  const steps = ['User Name', 'Password', 'Email', 'Gender & Birthdate', 'Interests'];

  const handleNext = () => {
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
      const newInterests = prev.interests.includes(value)
        ? prev.interests.filter((interest) => interest !== value)
        : [...prev.interests, value];

      return { ...prev, interests: newInterests };
    });
  };

  const handleSubmit = () => {
    alert(JSON.stringify(formData, null, 2));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-blue-200 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Signup</h1>

        {/* Step Dots */}
        <div className="flex justify-center space-x-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${index === step ? 'bg-gray-800' : 'bg-[#D9D9D9]'}`}
              ></div>
          ))}
        </div>

        {/* Animated Step Content */}
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
              <div>
                <label className="block text-sm mb-1">User Name *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className="w-full p-3 bg-gray-100 rounded-md"
                  required
                />
                <label className="block text-sm mb-1">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full p-3 bg-gray-100 rounded-md"
                  required
                />
                <label className="block text-sm mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full p-3 bg-gray-100 rounded-md"
                  required
                />
              </div>
            )}
            {step === 1 && (
              <div>
                <label className="block text-sm mb-1">Gender *</label>
                <div className="flex space-x-4">
                  <div>
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor="male">Male</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor="female">Female</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="other"
                      name="gender"
                      value="other"
                      checked={formData.gender === 'other'}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor="other">Other</label>
                  </div>
                </div>
                <label className="block text-sm mb-1 mt-4">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleChange('dob', e.target.value)}
                  className="w-full p-3 bg-gray-100 rounded-md"
                  required
                />
              </div>
            )}
            {step === 2 && (
              <div>
                <label className="block text-sm mb-1">Interests (Select up to 3)</label>
                <div className="flex flex-wrap gap-4">
                  {['Sports', 'Music', 'Travel', 'Technology', 'Art'].map((interest) => (
                    <button
                      key={interest}
                      onClick={() => handleButtonClick(interest)}
                      type="button"
                      className={`px-6 py-3 rounded-full border-2 text-sm font-semibold transition-colors ${
                        formData.interests.includes(interest)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
            disabled={step === 0}
            className={`w-1/2 py-3 rounded-full border ${
              step === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-400 hover:bg-gray-100'
            }`}>
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="w-1/2 bg-[#5372A4] text-white py-3 rounded-full hover:bg-blue-700"
          >
            {step === steps.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
