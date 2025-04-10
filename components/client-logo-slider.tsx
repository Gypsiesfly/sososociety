"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ClientLogoSliderProps {
  logos: {
    src: string
    alt: string
  }[]
}

export default function ClientLogoSlider({ logos }: ClientLogoSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      })
      setScrollPosition(Math.max(0, scrollPosition - 1))
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      })
      setScrollPosition(Math.min(logos.length - 3, scrollPosition + 1))
    }
  }

  // Auto-scroll functionality
  useEffect(() => {
    if (isHovering || !scrollContainerRef.current) return

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        // Check if we've reached the end, if so, scroll back to start
        const isAtEnd =
          scrollContainerRef.current.scrollLeft + scrollContainerRef.current.offsetWidth >=
          scrollContainerRef.current.scrollWidth - 10

        if (isAtEnd) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" })
          setScrollPosition(0)
        } else {
          scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
          setScrollPosition((prev) => Math.min(logos.length - 3, prev + 1))
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isHovering, logos.length])

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative">
        {/* Left Arrow */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-blue-600 border-none text-white hover:bg-blue-700"
          onClick={scrollLeft}
          disabled={scrollPosition === 0}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {/* Logo Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide gap-8 py-8 px-12"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {logos.map((logo, index) => (
            <div key={index} className="flex-shrink-0 w-[200px] h-[120px] flex items-center justify-center">
              <Image
                src={logo.src || "/placeholder.svg"}
                alt={logo.alt}
                width={160}
                height={80}
                className="object-contain max-h-[100px] max-w-[160px]"
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-blue-600 border-none text-white hover:bg-blue-700"
          onClick={scrollRight}
          disabled={scrollPosition >= logos.length - 3}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
