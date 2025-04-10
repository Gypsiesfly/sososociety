"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect, useRef } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("home")

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let currentSection = "home";

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionBottom = sectionTop + sectionHeight;
        
        if (
          window.pageYOffset >= sectionTop - 100 &&
          window.pageYOffset < sectionBottom - 100
        ) {
          currentSection = section.id;
        }
      });

      setActiveSection(currentSection);
    };

    // Initial check
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (section: string) => {
    return activeSection === section;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <nav
        className="flex items-center justify-between px-6 py-3 mx-auto max-w-7xl rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg"
        style={{ backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-Lu9m1eAj386wCUO2F9EBEMvsh3TzwS.svg"
            alt="Logo"
            width={41}
            height={41}
            className="mr-4"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-2">
          <Link
            href="/"
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              isActive("home") ? "bg-blue-500 text-white" : "text-white hover:bg-white/20",
            )}
          >
            Home
          </Link>

          <Link
            href="#pricing"
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              isActive("pricing") ? "bg-blue-500 text-white" : "text-white hover:bg-white/20",
            )}
          >
            Pricing
          </Link>

          <Link
            href="#faqs"
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              isActive("faqs") ? "bg-blue-500 text-white" : "text-white hover:bg-white/20",
            )}
          >
            Faqs
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:bg-white/20"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-7xl">
          <div className="rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg overflow-hidden">
            <div className="flex flex-col p-4 space-y-2">
              <Link
                href="/"
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive("home") ? "bg-blue-500 text-white" : "text-white hover:bg-white/20",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              <Link
                href="#pricing"
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive("pricing") ? "bg-blue-500 text-white" : "text-white hover:bg-white/20",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>

              <Link
                href="#faqs"
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive("faqs") ? "bg-blue-500 text-white" : "text-white hover:bg-white/20",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Faqs
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
