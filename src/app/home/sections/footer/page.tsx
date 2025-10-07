// src/components/ui/footer.tsx
import {
  Mail,
  Instagram,
  Facebook,
  // Pinterest,
  X,
  Linkedin,
} from "lucide-react";
import { cn } from "@/lib/utils";

const footerLinks = [
  {
    title: "About",
    links: [
      { label: "Our Story", href: "#" },
      { label: "Our Mission", href: "#" },
      { label: "Responsible Sourcing", href: "#" },
    ],
  },
  {
    title: "Orders",
    links: [
      { label: "Track Your Order", href: "#" },
      { label: "Free 30 Day Returns", href: "#" },
      { label: "Free Shipping Both Ways", href: "#" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Live Chat", href: "#" },
      { label: "Book Appointment", href: "#" },
      { label: "Email Us", href: "#" },
    ],
  },
];

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  // { icon: Pinterest, label: "Pinterest", href: "#" },
  { icon: X, label: "X", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t bg-gradient-to-tl from-teal-950 via-teal-800 to-teal-950 mt-8 sm:mt-12 lg:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 pr-10">
          {/* Main Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">
                {section.title}
              </h3>
              <ul className="space-y-1 sm:space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs sm:text-sm text-white hover:text-white/80 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Signup */}
          <div className="sm:col-span-2 ">
            <h3 className="text-sm font-semibold mb-3 sm:mb-4 text-white">
              Sign Up
            </h3>
            <form className="flex flex-col gap-2">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <div className="flex">
                <input
                  id="footer-email"
                  type="email"
                  placeholder="Your Email Address"
                  className="flex-1  border border-white px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white text-white w-36 sm:w-auto"
                />
                <button
                  type="submit"
                  className={cn(
                    "bg-white hover:bg-white/80 text-teal-900 px-3 sm:px-4 py-1.5 sm:py-2  flex items-center"
                  )}
                  aria-label="Sign up"
                >
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </form>
            <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-white hover:text-white/80 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        {/* Footer Bottom */}
        <div className="border-t mt-8 sm:mt-10 lg:mt-12 pt-4 sm:pt-6 text-xs text-white flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>©2025 Maven Diamonds</span>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <a href="#" className="hover:text-white/80">
              Terms & Conditions
            </a>
            <span>|</span>
            <a href="#" className="hover:text-white/80">
              Privacy Policy
            </a>
            <span>|</span>
            <a href="#" className="hover:text-white/80">
              Site Map
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
