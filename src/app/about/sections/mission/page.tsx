"use client";

import Image from "next/image";

export default function MissionSection() {
  return (
    <section id="mission" className="py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          <div className="relative aspect-[16/9] overflow-hidden order-2 lg:order-1">
            <Image
              src="/images/products/asset (29).webp"
              alt="Custom diamond jewelry experience"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
          </div>

          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-serif text-gray-800 mb-3 sm:mb-4 lg:mb-5">
              Our Mission
            </h2>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-serif text-gray-800 mb-3 sm:mb-4">
              Crafting Dreams into Reality
            </h3>
            <p className="text-base sm:text-lg text-gray-700 font-light leading-relaxed">
              Maven Diamonds is dedicated to offering individuals the
              opportunity to create their own diamond jewelry.
            </p>
            <p className="text-base sm:text-lg text-gray-700 font-light leading-relaxed">
              We continue the legacy of exquisite diamond craftsmanship while
              making luxury accessible to all.
            </p>
            <p className="text-base sm:text-lg text-gray-700 font-light leading-relaxed">
              Maven Diamonds is designed to provide an unparalleled experience
              of elegance and sophistication, specially crafted for you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
