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
    <footer className="border-t bg-gradient-to-tl from-teal-950 via-teal-800 to-teal-950 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Main Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4 text-white">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white hover:text-white/80 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Signup */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold mb-4 text-white">
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
                  className="flex-1 rounded-l-md border border-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white text-white"
                />
                <button
                  type="submit"
                  className={cn(
                    "bg-white hover:bg-white/80 text-teal-900 px-4 py-2 rounded-r-md flex items-center"
                  )}
                  aria-label="Sign up"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </form>
            <div className="flex gap-4 mt-6">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-white hover:text-white/80 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        {/* Footer Bottom */}
        <div className="border-t mt-12 pt-6 text-xs text-white flex flex-col md:flex-row items-center justify-between gap-2">
          <span>©2025 Mevlin Diamonds</span>
          <div className="flex flex-wrap gap-3">
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
