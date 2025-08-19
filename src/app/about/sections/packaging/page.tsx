"use client";

import Image from "next/image";

export default function PackagingSection() {
  return (
    <section id="packaging" className="py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6">
            <div className="text-left  ">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-serif text-gray-800 mb-2 sm:mb-3 lg:mb-4">
                The Maven Experience Uniquely Yours
              </h2>
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-serif text-gray-800 mb-3 sm:mb-4">
              Every Detail Tells a Story
            </h3>
            <p className="text-base sm:text-lg  text-gray-700 font-light leading-relaxed">
              Our packaging serves as an integral component of our brand,
              enhancing the value of the antique items it contains.
            </p>
            <p className="text-base sm:text-lg text-gray-700 font-light leading-relaxed">
              Each collection is presented in a sealed envelope, adorned with
              the luxurious Maven Rose symbol, representing our love and passion
              for our clients.
            </p>
            <p className="text-base sm:text-lg text-gray-700 font-light leading-relaxed">
              Each box is crafted to reflect uniqueness and exclusivity, with
              every detail conveying the care and effort invested in the
              product.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="relative aspect-[4/4] overflow-hidden">
              <Image
                src="/images/must-have/left (1).webp"
                alt="Maven Rose symbol"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/4] overflow-hidden">
              <Image
                src="/images/must-have/left (2).webp"
                alt="Sealed envelope packaging"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/4] overflow-hidden">
              <Image
                src="/images/must-have/left (3).webp"
                alt="Luxury packaging box"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/4] overflow-hidden">
              <Image
                src="/images/must-have/left (4).webp"
                alt="Unboxing experience"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
