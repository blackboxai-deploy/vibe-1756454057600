"use client";

import { HotelBillGenerator } from "@/components/HotelBillGenerator";

export default function Home() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Hotel Jatashanker
          </h1>
          <p className="text-xl text-gray-600 mb-1">Chatterpur, Madhya Pradesh</p>
          <p className="text-lg text-gray-500">Professional Bill Generator</p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <HotelBillGenerator />
        </div>
      </div>
    </main>
  );
}