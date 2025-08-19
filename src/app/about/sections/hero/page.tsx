"use client";

import Image from "next/image";

export default function HeroSection() {
  return (
    <section id="hero" className="py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
          <div className="relative aspect-[16/12] overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-xl sm:-ml-40">
            <Image
              src="/images/products/asset (27).webp"
              alt="Understated luxury diamond jewelry"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent" />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="text-left   lg:mb- flex flex-col items-start justify-center">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-serif text-gray-800 mb-2 sm:mb-3 lg:mb-4">
                What Are We
              </h1>
              <p className="text-base sm:text-lg font-light text-gray-600 max-w-2xl">
                Maven Diamonds was established to evoke a sense of uniqueness
                and symbolize understated luxury.
              </p>
            </div>
            {/* <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif text-gray-800 mb-3 sm:mb-4">
              The Essence of Understated Luxury
            </h2> */}
            <p className="text-base sm:text-lg text-gray-700 font-light leading-relaxed">
              Our focus is not on creating eye-catching pieces that require
              validation of their worth; rather, each item possesses intrinsic
              value.
            </p>
            <p className="text-base sm:text-lg text-gray-700 font-light leading-relaxed">
              Our brand is rooted in an inspiring narrative that informs our
              simple yet luxurious designs.
            </p>
            <p className="text-base sm:text-lg text-gray-700 font-light leading-relaxed">
              While many adorn themselves with extravagant jewelry reminiscent
              of royalty, it is essential to recognize that kings and queens did
              not wear such opulent diamonds on a daily basis. Instead, they
              favored understated elegance that often went unnoticed—true luxury
              in its most authentic form.
            </p>
            <p className="text-base sm:text-lg text-gray-700 font-light leading-relaxed">
              Therefore, we draw inspiration from the jewels that reflect the
              everyday sophistication of royals, offering pieces that seamlessly
              integrate a touch of luxury into your collection.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
