"use client";

import React, { useState, useRef } from "react";
import InspiraNavbar from '../components/button';


const ReferForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    primaryCategory: "",
    secondaryCategory: "",
    description: "",
    ticket: "",
    ticketPrice: "",
    latitude: "",
    longitude: "",
    picture: null as File | null,
  });

  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting:", formData);
    // Do something with formData here
  };

  const submitForm = () => {
    formRef.current?.requestSubmit(); // Triggers form submit
  };

  return (

    <div className="min-h-screen flex flex-col">
    {/* Navbar Fixed */}
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
      <InspiraNavbar />
    </div>

    {/* Spacer to offset navbar height */}
    <div className="h-[64px]" /> {/* ปรับความสูงให้เท่ากับความสูงของ Navbar */}
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-xl font-semibold text-[#5b78a4] mb-4">Refer</h2>
        <p className="text-gray-600 mb-4">Please fill in the details below to refer an exhibition.</p>
    
      {/* Form */}
      <form ref={formRef} onSubmit={handleSubmit} className="w-1/2 max-w-md bg-white shadow-xl rounded-2xl p-6 space-y-4"      >

        <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Name *</label>
            <input type="text" name="name" required onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md" />
        </div>

        <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Location *</label>
            <input type="text" name="location" required onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md" />
        </div>

        <div className="flex gap-3">
            <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">Start date *</label>
            <input type="date" name="startDate" required onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md text-gray-400" />
            </div>
            <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">End date *</label>
            <input type="date" name="endDate" required onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md text-gray-400" />
            </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1  text-gray-700">Start time</label>
            <input type="time" name="startTime" onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md text-gray-400" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">End time</label>
            <input type="time" name="endTime" onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md text-gray-400" />
          </div>
        </div>

        <div className="flex gap-3">
            <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-gray-700">Primary Category *</label>
                <input
                     type="text" name="primaryCategory" required onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md"
                />
            </div>
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Secondary Category</label>
                <input type="text" name="secondaryCategory" onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md" />
                </div>
        </div>
        <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Description *</label>
            <textarea name="description" required rows={3} onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md resize-none" />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Ticket *</label>
            <input type="text" name="ticket" required onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md" />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Ticket price * (100,200,300)</label>
            <input type="text" name="ticketPrice" required onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md" />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1  text-gray-700">Latitude</label>
            <input type="text" name="latitude" onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">Longitude</label>
            <input type="text" name="longitude" onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md" />
          </div>
        </div>

        <label className="block text-sm font-medium mb-1 text-gray-700">Picture *</label>
        <div className="relative flex items-center">
          <input
            type="file"
            accept="image/*"
            name="picture"
            required
            onChange={handleChange}
            className="w-full file:hidden p-3 bg-gray-100 rounded-md text-gray-400"
          />
          <div className="absolute right-2 pointer-events-none text-gray-500">📷</div>
        </div>
      </form>

      {/* Button outside the form */}
      <button
        onClick={submitForm}
        className="w-full max-w-md mt-4 bg-[#5b78a4] text-white py-2 rounded-lg hover:bg-[#4a6795] transition"
      >
        Refer
      </button>
    </div>
    </div>
  );
};

export default ReferForm;
