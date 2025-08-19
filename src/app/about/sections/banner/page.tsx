"use client";

import Image from "next/image";

export default function BannerSection() {
  return (
    <section className="relative h-[500px]">
      {/* Sky Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-blue-50 to-pink-100"></div>

      {/* Central Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <div className="flex flex-col items-center justify-center h-full w-full -mt-20">
          {/* Main Heading */}
          <h1 className="text-4xl m font-light text-gray-800 mb-6 tracking-wide text-center">
            JEWELRY REDEFINED
          </h1>

          {/* Tagline */}
          <p className="text-lg  text-gray-700 max-w-4xl mx-auto leading-relaxed font-light text-center">
            We are pioneers. We are disruptors. We are innovators. Join us in
            transforming the jewelry industry for good.
          </p>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-teal-800 py-6 px-8 flex justify-center z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center w-full space-x-8">
            <a
              href="#hero"
              className="text-white font-medium hover:text-white/90 transition-colors cursor-pointer relative z-10 group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#mission"
              className="text-white font-medium hover:text-white/90 transition-colors cursor-pointer relative z-10 group"
            >
              Mission
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#philosophy"
              className="text-white font-medium hover:text-white/90 transition-colors cursor-pointer relative z-10 group"
            >
              Philosophy
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#gallery"
              className="text-white font-medium hover:text-white/90 transition-colors cursor-pointer relative z-10 group"
            >
              Gallery
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#craftsmanship"
              className="text-white font-medium hover:text-white/90 transition-colors cursor-pointer relative z-10 group"
            >
              Craftsmanship
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#packaging"
              className="text-white font-medium hover:text-white/90 transition-colors cursor-pointer relative z-10 group"
            >
              Experience
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
