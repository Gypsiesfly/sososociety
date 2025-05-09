"use client"

import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import ClientLogoSlider from "@/components/client-logo-slider"
import HandlerPopup from "@/components/handler-popup"
import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import PricingCard from "@/components/pricing-card"

function SocialTextCycler() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const socialPlatforms = [
    { name: "socials", color: "#3b82f6" },
    { name: "Twitter", color: "#478BFF" },
    { name: "Facebook", color: "#1877F2" },
    { name: "Instagram", color: "#FF6D38" },
    { name: "YouTube", color: "#00A652" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % socialPlatforms.length)
    }, 2000) // Change every 2 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <span className="social-text-cycler" style={{ color: socialPlatforms[currentIndex].color, transition: "color 0.5s ease" }}>
      {socialPlatforms[currentIndex].name}
    </span>
  )
}

const faqMessages = [
  {
    type: "question",
    text: "Can I get a refund?",
    avatar: "/images/person-icon.svg",
    avatarAlt: "User",
    avatarSize: 24,
    align: "left"
  },
  {
    type: "answer",
    text: "No, there are no refunds for our services",
    avatar: "/images/profile-avatar.png",
    avatarAlt: "Support",
    avatarSize: 40,
    align: "right"
  },
  {
    type: "question",
    text: "What if I have a design preference?",
    avatar: "/images/person-icon.svg",
    avatarAlt: "User",
    avatarSize: 24,
    align: "left"
  },
  {
    type: "answer",
    text: "Relay it to your handler and he'd follow your instructions",
    avatar: "/images/profile-avatar.png",
    avatarAlt: "Support",
    avatarSize: 40,
    align: "right"
  },
  {
    type: "question",
    text: "Will you edit videos for the posts?",
    avatar: "/images/person-icon.svg",
    avatarAlt: "User",
    avatarSize: 24,
    align: "left"
  },
  {
    type: "answer",
    text: "If it's part of your package, we will.",
    avatar: "/images/profile-avatar.png",
    avatarAlt: "Support",
    avatarSize: 40,
    align: "right"
  },
  {
    type: "question",
    text: "How do I cancel my subscription?",
    avatar: "/images/person-icon.svg",
    avatarAlt: "User",
    avatarSize: 24,
    align: "left"
  },
  {
    type: "answer",
    text: "You can decide to not renew it when it ends",
    avatar: "/images/profile-avatar.png",
    avatarAlt: "Support",
    avatarSize: 40,
    align: "right"
  }
]

function FAQChat() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const [canPlaySound, setCanPlaySound] = useState(false)
  const [messagesStarted, setMessagesStarted] = useState(false)
  const chatRef = useRef<HTMLDivElement | null>(null)
  const soundRef = useRef<HTMLAudioElement | null>(null)

  // Enable sound after first user gesture
  useEffect(() => {
    const enableSound = () => setCanPlaySound(true)
    window.addEventListener("click", enableSound, { once: true })
    window.addEventListener("keydown", enableSound, { once: true })
    window.addEventListener("touchstart", enableSound, { once: true })
    return () => {
      window.removeEventListener("click", enableSound)
      window.removeEventListener("keydown", enableSound)
      window.removeEventListener("touchstart", enableSound)
    }
  }, [])

  // Intersection Observer to trigger animation when section is in view
  useEffect(() => {
    const section = document.getElementById("faqs")
    if (!section) return
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !messagesStarted) {
          setMessagesStarted(true)
        }
        if (!entry.isIntersecting) {
          setMessagesStarted(false)
          setVisibleCount(0)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [messagesStarted])

  // Reveal messages one by one only when user is in section
  useEffect(() => {
    if (!messagesStarted) return
    if (visibleCount >= faqMessages.length) return
    let delay = 700
    // After every two messages, insert a 3s gap before next two
    if (visibleCount > 0 && visibleCount % 2 === 0) {
      delay = 3000
    }
    const timeout = setTimeout(() => {
      setVisibleCount((c) => c + 1)
    }, delay)
    return () => clearTimeout(timeout)
  }, [visibleCount, messagesStarted])

  // Play sound effect for every new message
  useEffect(() => {
    if (!messagesStarted) return
    if (!canPlaySound) return
    if (visibleCount === 0) return
    if (soundRef.current) {
      soundRef.current.currentTime = 0
      soundRef.current.play()
    }
  }, [visibleCount, messagesStarted, canPlaySound])

  // Scroll to bottom as new messages appear
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [visibleCount])

  return (
    <div className="max-w-2xl mx-auto space-y-6 relative z-10">
      <audio ref={soundRef} src="/ringtone.mp3" preload="auto" />
      <div
        ref={chatRef}
        style={{ maxHeight: 400, overflowY: "auto", transition: "box-shadow 0.3s" }}
        className="faq-chat-scroll"
      >
        {faqMessages.slice(0, visibleCount).map((msg, i) => (
          <div
            key={i}
            className={`flex items-start ${msg.align === "right" ? "justify-end" : ""} mb-2`}
          >
            {msg.align === "left" && (
              <div className="w-10 h-10 bg-blue-500 rounded-full flex-shrink-0 mr-3 flex items-center justify-center overflow-hidden">
                <Image src={msg.avatar} alt={msg.avatarAlt} width={msg.avatarSize} height={msg.avatarSize} />
              </div>
            )}
            <div className={`bg-white rounded-2xl p-3 text-left max-w-[80%] ${msg.align === "right" ? "mr-3" : ""}`}>
              <p>{msg.text}</p>
            </div>
            {msg.align === "right" && (
              <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
                <Image src={msg.avatar} alt={msg.avatarAlt} width={msg.avatarSize} height={msg.avatarSize} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const clientLogos = [
  { src: "/images/client-logo-1.png", alt: "Her Dreams" },
  { src: "/images/client-logo-2.png", alt: "Blarbar" },
  { src: "/images/client-logo-3.png", alt: "CD Logo" },
  { src: "/images/client-logo-4.png", alt: "WPS Logo" },
  { src: "/images/client-logo-5.png", alt: "Rstream Logo" },
]

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="bg-[#141414] text-white pt-32 pb-16 min-h-screen flex flex-col justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4">We manage your</h1>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-10">
            <SocialTextCycler /> for you
          </h1>

          <p className="max-w-2xl mx-auto text-gray-300 mb-12 text-lg">
            Relax and let us manage your online presence. Our team will handle your social media, ensuring your brand
            stands out. Focus on what you do best while we enhance your visibility and reputation.
          </p>

          <div className="flex justify-center mb-16">
            <Link href="#pricing">
              <Button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-8 py-6 rounded-full text-lg font-medium">
                Get started
              </Button>
            </Link>
          </div>

          {/* Social Media Icons - Desktop View with Specific Shapes */}
          <div className="md:flex hidden justify-center gap-8 max-w-5xl mx-auto">
            {/* Twitter/X Icon - Square with rounded corners */}
            <div
              className="social-icon twitter flex items-center justify-center w-40 h-40"
              style={{
                backgroundColor: "#478BFF",
                borderRadius: "16px",
              }}
            >
              <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>

            {/* Facebook Icon - Circle */}
            <div
              className="social-icon facebook flex items-center justify-center w-40 h-40"
              style={{
                backgroundColor: "#1877F2",
                borderRadius: "50%",
              }}
            >
              <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>

            {/* Instagram Icon - Restored to original shape */}
            <div className="social-icon instagram relative flex items-center justify-center w-40 h-40">
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src="/images/rectangle-6.png"
                  alt="Instagram background"
                  fill
                  className="object-cover rounded-[30px]"
                />
              </div>
              <svg className="w-20 h-20 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </div>

            {/* YouTube Icon - Circle */}
            <div
              className="social-icon youtube flex items-center justify-center w-40 h-40"
              style={{
                backgroundColor: "#00A652",
                borderRadius: "50%",
              }}
            >
              <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
          </div>

          {/* Mobile/Tablet View - Overlapping Layout */}
          <div className="flex md:hidden w-full h-full relative min-h-[300px]">
            {/* Twitter/X Icon */}
            <div
              className="social-icon twitter absolute flex items-center justify-center shadow-lg"
              style={{
                width: "150px",
                height: "150px",
                backgroundColor: "#478BFF",
                borderRadius: "16px",
                left: "50%",
                top: "20%",
                transform: "translateX(-50%) rotate(-5deg)",
                zIndex: "40",
              }}
            >
              <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>

            {/* Facebook Icon */}
            <div
              className="social-icon facebook absolute flex items-center justify-center shadow-lg"
              style={{
                width: "130px",
                height: "130px",
                backgroundColor: "#1877F2",
                borderRadius: "50%",
                left: "30%",
                top: "40%",
                transform: "translateX(-50%) rotate(5deg)",
                zIndex: "30",
              }}
            >
              <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>

            {/* Instagram Icon */}
            <div
              className="social-icon instagram absolute flex items-center justify-center shadow-lg"
              style={{
                width: "140px",
                height: "140px",
                left: "70%",
                top: "60%",
                transform: "translateX(-50%) rotate(-8deg)",
                zIndex: "20",
              }}
            >
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src="/images/rectangle-6.png"
                  alt="Instagram background"
                  fill
                  className="object-cover rounded-[30px]"
                />
              </div>
              <svg className="w-20 h-20 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </div>

            {/* YouTube Icon */}
            <div
              className="social-icon youtube absolute flex items-center justify-center shadow-lg"
              style={{
                width: "120px",
                height: "120px",
                backgroundColor: "#00A652",
                borderRadius: "50%",
                left: "50%",
                top: "80%",
                transform: "translateX(-50%) rotate(3deg)",
                zIndex: "10",
              }}
            >
              <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section id="clients" className="bg-[#1A73E9] text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-[65px] font-bold text-center mb-12">Our clients</h2>

          <ClientLogoSlider logos={clientLogos} />

          <div className="flex justify-center mt-10">
            <Link href="#pricing">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6">
                <span className="mr-2">+</span> Join our clients
              </Button>
            </Link>
           
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-[#1A73E9] text-white py-16">
        <div className="container mx-auto px-4">
          {/* Restored heading with 65px font size */}
          <div className="text-center mb-16">
            <h2 className="text-[65px] font-bold">What we add to your</h2>
            <h2 className="text-[65px] font-bold">social presence</h2>
          </div>

          {/* SVG Icons */}
          <div className="flex flex-wrap justify-center gap-16 md:gap-24 mb-16" id="what-we-add">
            {/* Graphics Design Icon */}
            <div className="service-float-up transition-all duration-700 opacity-0 translate-y-8" data-index="0">
              <Image
                src="/images/graphics-design-icon.svg"
                alt="Graphics design"
                width={240}
                height={240}
                className="object-contain"
              />
            </div>
            {/* Web Design Icon */}
            <div className="service-float-up transition-all duration-700 opacity-0 translate-y-8" data-index="1">
              <Image
                src="/images/web-design-icon.svg"
                alt="Web design & Maintainanace"
                width={240}
                height={240}
                className="object-contain"
              />
            </div>
            {/* Video Editing Icon */}
            <div className="service-float-up transition-all duration-700 opacity-0 translate-y-8" data-index="2">
              <Image
                src="/images/video-editing-icon.svg"
                alt="Video editing"
                width={240}
                height={240}
                className="object-contain"
              />
            </div>
          </div>
          <script dangerouslySetInnerHTML={{__html:`
          if (typeof window !== 'undefined') {
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  document.querySelectorAll('.service-float-up').forEach((el, i) => {
                    setTimeout(() => {
                      el.classList.add('opacity-100', 'translate-y-0');
                    }, i * 120);
                  });
                }
              });
            }, { threshold: 0.3 });
            const section = document.getElementById('what-we-add');
            if (section) observer.observe(section);
          }
          `}} />
          {/* Robot Image - Repositioned below SVG images with padding */}
          <div className="flex justify-center pt-12 pb-16">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/robot-HIOGwOuycXXw4qXqDJxq9FgIcCK2iS.png"
              alt="Robot illustration"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="bg-white h-auto min-h-[700px] py-16 flex items-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#00A652] text-center mb-8 md:mb-16">
            How it works?
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
            {/* Robot Illustration */}
            <div className="w-48 h-48 sm:w-64 sm:h-64 relative mb-6 md:mb-0">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/robotprofile-clIpEIgr6Z927i9RBMVXAQ0isskkKS.png"
                alt="Robot illustration"
                width={250}
                height={250}
                className="object-contain"
              />
            </div>

            <div className="flex flex-col gap-6 w-full md:w-auto">
              {/* Step Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button className="bg-[#00A652] hover:bg-green-600 text-white rounded-md px-4 py-3 text-base sm:text-lg w-full">
                  Step 1: pick a schedule
                </Button>

                <Button className="bg-[#FF6D38] hover:bg-orange-600 text-white rounded-md px-4 py-3 text-base sm:text-lg w-full">
                  Step 2: pay for a plan
                </Button>

                <Button className="bg-[#1A73E9] hover:bg-blue-600 text-white rounded-md px-4 py-3 text-base sm:text-lg w-full sm:col-span-2 lg:col-span-1">
                  Step 3: get confirmation email
                </Button>
              </div>

              {/* Handler Section */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full">
                <div className="w-full sm:w-auto">
                  <HandlerPopup />
                </div>

                <Button className="bg-[#1A73E9] hover:bg-blue-600 text-white rounded-md px-4 py-3 text-base sm:text-lg w-full sm:w-auto">
                  Step 4: Meet your handler
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-[#FF6D38] py-16 min-h-[700px] flex items-center">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-12">Pricing</h2>
          <PricingCard />
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="bg-green-500 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Frequently asked
            <br />
            questions
          </h2>

          {/* --- Real-time FAQ Chat --- */}
          <FAQChat />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-500 py-8 relative">
        <div className="container mx-auto px-4">
          <div className="absolute right-10 bottom-10">
            <div className="w-16 h-16 bg-yellow-400 rounded-full"></div>
          </div>

          <div className="max-w-xl mx-auto bg-white rounded-lg p-4 shadow-lg">
            <div className="flex items-center">
              <div className="mr-2">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-Lu9m1eAj386wCUO2F9EBEMvsh3TzwS.svg"
                  alt="Logo"
                  width={41}
                  height={41}
                />
              </div>
              <span className="ml-2 font-semibold">Social Society</span>
              <div className="ml-auto text-xs text-gray-500">
                <p> Social Society</p>
                <p>All rights reserved</p>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" asChild>
                <a href="mailto:admin@sosociety.org">Contact us</a>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
