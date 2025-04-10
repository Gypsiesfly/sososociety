"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function HandlerPopup() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 bg-white rounded-full px-4 py-2 text-black hover:bg-gray-100 transition-colors"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="w-6 h-6 rounded-full bg-[#00A652] flex items-center justify-center text-white">?</div>
        <span>Who is a handler?</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 bg-white rounded-3xl shadow-xl p-6 w-[350px] z-50 animate-fadeIn">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#00A652] flex items-center justify-center text-white text-xl">
              ?
            </div>
            <h3 className="text-2xl font-bold">Who is a handler?</h3>
          </div>

          <p className="text-center mb-6 text-lg">
            A handler is a dedicated member of our organization who will personally oversee your requests. This
            individual will manage your account and ensure that you receive the highest level of service.
          </p>

          <div className="flex justify-center">
            <Button
              className="bg-[#1A73E9] hover:bg-blue-600 text-white rounded-full px-12 py-6 text-xl"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
