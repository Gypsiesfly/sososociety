"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Building2, Home, Store, Info, Instagram, Facebook, Twitter, Youtube, Check } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Country codes with emoji flags
const countryCodes = [
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
]

// Pricing data in NGN
const PRICING_DATA = {
  basePricesNGN: {
    instagram: 50000,
    facebook: 50000,
    twitter: 50000,
    youtube: 100000,
    tiktok: 100000,
  },
  videoEditingNGN: {
    standardPlatforms: 50000, // Facebook, Twitter, Instagram
    premiumPlatforms: 100000, // YouTube, TikTok
  },
  clientTypeModifiers: {
    enterprise: {
      multiplier: 3,
      discountPercentage: 0.3,
    },
    small: {
      multiplier: 2,
      discountPercentage: 0.2,
    },
    nonprofit: {
      multiplier: 2,
      discountPercentage: 0.2,
    },
  },
  exchangeRateToGBP: 0.00065,
}

// Platform categories
const STANDARD_PLATFORMS = ["facebook", "twitter", "instagram"]
const PREMIUM_PLATFORMS = ["youtube", "tiktok"]

interface FormData {
  fullName: string
  email: string
  countryCode: string
  phone: string
  businessType: string
  platforms: string[]
  videoEditing: boolean
  postFrequency: number
  price: number
  priceNGN: number
  discountCode: string
}

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    countryCode: "+44", // Default to UK
    phone: "",
    businessType: "enterprise",
    platforms: [],
    videoEditing: false,
    postFrequency: 2,
    price: 0,
    priceNGN: 0,
    discountCode: "",
  })
  const [errors, setErrors] = useState({
    fullName: false,
    email: false,
    phone: false,
  })

  // Get the flag for the currently selected country code
  const getSelectedFlag = () => {
    const country = countryCodes.find((c) => c.code === formData.countryCode)
    return country ? country.flag : "🏳️"
  }

  // Check if any premium platforms are selected
  const hasPremiumPlatforms = () => {
    return formData.platforms.some((platform) => PREMIUM_PLATFORMS.includes(platform))
  }

  const validateStep1 = () => {
    const newErrors = {
      fullName: !formData.fullName,
      email: !formData.email || !/^\S+@\S+\.\S+$/.test(formData.email),
      phone: !formData.phone,
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      return
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: false }))
    }
  }

  const handleSelectBusinessType = (type: string) => {
    setFormData((prev) => ({ ...prev, businessType: type }))
  }

  const handlePlatformToggle = (platform: string) => {
    setFormData((prev) => {
      const platforms = [...prev.platforms]

      if (platforms.includes(platform)) {
        // Remove platform if already selected
        return { ...prev, platforms: platforms.filter((p) => p !== platform) }
      } else {
        // Add platform if not selected
        return { ...prev, platforms: [...platforms, platform] }
      }
    })
  }

  const handleSelectFrequency = (frequency: number) => {
    setFormData((prev) => ({ ...prev, postFrequency: frequency }))
  }

  const handleVideoEditingChoice = (choice: boolean) => {
    setFormData((prev) => ({ ...prev, videoEditing: choice }))
  }

  const handleCountryCodeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, countryCode: value }))
  }

  // Format price with commas for thousands
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 mb-10">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`w-8 h-2 rounded-full ${
              step === currentStep ? "bg-[#1A73E9]" : step < currentStep ? "bg-[#1A73E9] opacity-70" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center mb-8">Tell us about yourself</h2>

          <div>
            <Input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`rounded-full px-6 py-5 text-lg ${errors.fullName ? "border-red-500" : ""}`}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1 ml-4">Please enter your full name</p>}
          </div>

          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className={`rounded-full px-6 py-5 text-lg ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1 ml-4">Please enter a valid email address</p>}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <div className="w-1/3">
                <Select value={formData.countryCode} onValueChange={handleCountryCodeChange}>
                  <SelectTrigger className="rounded-full px-4 py-5 text-lg">
                    <SelectValue>
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{getSelectedFlag()}</span>
                        <span>{formData.countryCode}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{country.flag}</span>
                          <span className="font-medium">{country.code}</span>
                          <span className="ml-2 text-gray-500 text-sm">{country.country}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-2/3">
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`rounded-full px-6 py-5 text-lg ${errors.phone ? "border-red-500" : ""}`}
                />
              </div>
            </div>
            {errors.phone && <p className="text-red-500 text-sm mt-1 ml-4">Please enter your phone number</p>}
          </div>
        </div>
      )}

      {/* Step 2: Business Classification */}
      {currentStep === 2 && (
        <div>
          <h2 className="text-2xl font-semibold text-center mb-8">
            What would you classify your
            <br />
            business as
          </h2>

          <div className="space-y-4">
            {/* Enterprise Option */}
            <button
              className={`w-full flex items-center justify-between px-6 py-3 rounded-full border ${
                formData.businessType === "enterprise" ? "border-[#00A652]" : "border-gray-200"
              } transition-colors`}
              onClick={() => handleSelectBusinessType("enterprise")}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <Building2 className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-left">Enterprise</span>
              </div>
              {formData.businessType === "enterprise" && (
                <div className="w-6 h-6 rounded-full bg-[#00A652] flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </button>

            {/* Small Business Option */}
            <button
              className={`w-full flex items-center justify-between px-6 py-3 rounded-full border ${
                formData.businessType === "small" ? "border-[#00A652]" : "border-gray-200"
              } transition-colors`}
              onClick={() => handleSelectBusinessType("small")}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <Store className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-left">Small business</span>
              </div>
              {formData.businessType === "small" && (
                <div className="w-6 h-6 rounded-full bg-[#00A652] flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </button>

            {/* Non-profit Option */}
            <button
              className={`w-full flex items-center justify-between px-6 py-3 rounded-full border ${
                formData.businessType === "nonprofit" ? "border-[#00A652]" : "border-gray-200"
              } transition-colors`}
              onClick={() => handleSelectBusinessType("nonprofit")}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <Home className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-left">Non-profit organization</span>
              </div>
              {formData.businessType === "nonprofit" && (
                <div className="w-6 h-6 rounded-full bg-[#00A652] flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Platform Selection - Modified for multiple selection */}
      {currentStep === 3 && (
        <div>
          <h2 className="text-2xl font-semibold text-center mb-8">
            Which social media platforms would
            <br />
            you prefer us to manage on your
            <br />
            behalf?
          </h2>

          <p className="text-center text-gray-500 mb-6">Select all that apply</p>

          <div className="space-y-4 mb-6">
            {/* Instagram */}
            <div
              className={`flex items-center justify-between px-4 py-3 rounded-full border cursor-pointer ${
                formData.platforms.includes("instagram") ? "border-[#00A652] bg-gray-50" : "border-gray-200"
              }`}
              onClick={() => handlePlatformToggle("instagram")}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center mr-3">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <span>Instagram</span>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  formData.platforms.includes("instagram") ? "bg-[#00A652]" : "border border-gray-300"
                }`}
              >
                {formData.platforms.includes("instagram") && <Check className="h-4 w-4 text-white" />}
              </div>
            </div>

            {/* Facebook */}
            <div
              className={`flex items-center justify-between px-4 py-3 rounded-full border cursor-pointer ${
                formData.platforms.includes("facebook") ? "border-[#00A652] bg-gray-50" : "border-gray-200"
              }`}
              onClick={() => handlePlatformToggle("facebook")}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center mr-3">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <span>Facebook</span>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  formData.platforms.includes("facebook") ? "bg-[#00A652]" : "border border-gray-300"
                }`}
              >
                {formData.platforms.includes("facebook") && <Check className="h-4 w-4 text-white" />}
              </div>
            </div>

            {/* Twitter */}
            <div
              className={`flex items-center justify-between px-4 py-3 rounded-full border cursor-pointer ${
                formData.platforms.includes("twitter") ? "border-[#00A652] bg-gray-50" : "border-gray-200"
              }`}
              onClick={() => handlePlatformToggle("twitter")}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center mr-3">
                  <Twitter className="w-5 h-5 text-white" />
                </div>
                <span>Twitter</span>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  formData.platforms.includes("twitter") ? "bg-[#00A652]" : "border border-gray-300"
                }`}
              >
                {formData.platforms.includes("twitter") && <Check className="h-4 w-4 text-white" />}
              </div>
            </div>

            {/* TikTok */}
            <div
              className={`flex items-center justify-between px-4 py-3 rounded-full border cursor-pointer ${
                formData.platforms.includes("tiktok") ? "border-[#00A652] bg-gray-50" : "border-gray-200"
              }`}
              onClick={() => handlePlatformToggle("tiktok")}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </div>
                <span>TikTok</span>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  formData.platforms.includes("tiktok") ? "bg-[#00A652]" : "border border-gray-300"
                }`}
              >
                {formData.platforms.includes("tiktok") && <Check className="h-4 w-4 text-white" />}
              </div>
            </div>

            {/* YouTube */}
            <div
              className={`flex items-center justify-between px-4 py-3 rounded-full border cursor-pointer ${
                formData.platforms.includes("youtube") ? "border-[#00A652] bg-gray-50" : "border-gray-200"
              }`}
              onClick={() => handlePlatformToggle("youtube")}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center mr-3">
                  <Youtube className="w-5 h-5 text-white" />
                </div>
                <span>YouTube</span>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  formData.platforms.includes("youtube") ? "bg-[#00A652]" : "border border-gray-300"
                }`}
              >
                {formData.platforms.includes("youtube") && <Check className="h-4 w-4 text-white" />}
              </div>
            </div>
          </div>

          {/* Selected platforms summary */}
          {formData.platforms.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-4 mt-4">
              <p className="font-medium text-blue-800">Selected platforms: {formData.platforms.length}</p>
              <p className="text-sm text-blue-600">
                {formData.platforms.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(", ")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Post Frequency */}
      {currentStep === 4 && (
        <div>
          <h2 className="text-2xl font-semibold text-center mb-8">
            How often do you want us to post
            <br />
            on these accounts each week?
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {[2, 3, 4, 5, 6].map((frequency) => (
              <button
                key={frequency}
                className={`py-3 px-4 rounded-full border ${
                  formData.postFrequency === frequency ? "bg-[#1A73E9] text-white" : "border-gray-200"
                }`}
                onClick={() => handleSelectFrequency(frequency)}
              >
                {frequency} times per week
              </button>
            ))}
          </div>

          {formData.postFrequency > 2 && (
            <div className="bg-blue-50 rounded-xl p-4 mt-4">
              <p className="text-sm text-blue-600">
                Additional days beyond the base 2 days/week will be prorated based on your selections.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 5: Video Editing */}
      {currentStep === 5 && (
        <div>
          <h2 className="text-2xl font-semibold text-center mb-8">
            Would you like us to edit videos
            <br />
            for these posts
          </h2>

          <div className="flex flex-col gap-4 mb-6">
            <button
              className={`py-3 px-6 rounded-full ${
                formData.videoEditing ? "bg-[#1A73E9] text-white" : "border border-gray-200"
              } ${formData.platforms.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => formData.platforms.length > 0 && handleVideoEditingChoice(true)}
              disabled={formData.platforms.length === 0}
            >
              Yes, please do
            </button>

            <button
              className={`py-3 px-6 rounded-full ${
                formData.videoEditing === false ? "bg-[#1A73E9] text-white" : "border border-gray-200"
              }`}
              onClick={() => handleVideoEditingChoice(false)}
            >
              No, I have mine
            </button>
          </div>

          {formData.platforms.length === 0 && (
            <div className="bg-yellow-100 rounded-xl p-4 flex items-center mt-8">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3">
                <Info className="w-4 h-4 text-yellow-500" />
              </div>
              <p>Please select at least one platform before choosing video editing options.</p>
            </div>
          )}

          {formData.videoEditing && formData.platforms.length > 0 && (
            <div className="bg-blue-200 rounded-xl p-4 flex items-center mt-8">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3">
                <Info className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p>Video editing has been added to your package.</p>
                {hasPremiumPlatforms() ? (
                  <p className="text-sm mt-1">Premium video editing for YouTube/TikTok included.</p>
                ) : (
                  <p className="text-sm mt-1">Standard video editing for your selected platforms included.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10">
        {currentStep > 1 ? (
          <Button className="bg-[#FF6D38] hover:bg-orange-600 text-white rounded-full px-6" onClick={handleBack}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Button>
        ) : (
          <div></div>
        )}

        <Button className="bg-[#1A73E9] hover:bg-blue-600 text-white rounded-full px-6" onClick={handleNext}>
          Next
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
