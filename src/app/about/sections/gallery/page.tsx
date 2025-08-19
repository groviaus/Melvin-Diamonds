"use client";

import Image from "next/image";

export default function GallerySection() {
  return (
    <section id="gallery" className="py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-serif text-gray-800 mb-2 sm:mb-3 lg:mb-4">
            The Art of Perfection
          </h2>
          <p className="text-base sm:text-lg font-light text-gray-600 max-w-2xl mx-auto">
            Witness the intricate details and masterful techniques that make
            each Melvin Diamond piece extraordinary
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <div className="relative aspect-[4/5] overflow-hidden bg-white border border-gray-100 shadow-xs">
            <Image
              src="/images/rings/mainLeftRing.webp"
              alt="Brilliant-cut diamond showcasing precision"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-3">
              <p className="text-sm font-medium text-gray-800 text-center">
                Precision in Every Facet
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden bg-white border border-gray-100 shadow-xs">
            <Image
              src="/images/experience/rings (1).webp"
              alt="Hands crafting jewelry with precision"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-3">
              <p className="text-sm font-medium text-gray-800 text-center">
                Meticulous Craftsmanship
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden bg-white border border-gray-100 shadow-xs">
            <Image
              src="/images/experience/rings (2).webp"
              alt="Artisan focusing on intricate details"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-3">
              <p className="text-sm font-medium text-gray-800 text-center">
                Artisan's Dedication
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden bg-white border border-gray-100 shadow-xs">
            <Image
              src="/images/rings/ring (1).webp"
              alt="Finished diamond piece"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-3">
              <p className="text-sm font-medium text-gray-800 text-center">
                Timeless Beauty
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden bg-white border border-gray-100 shadow-xs">
            <Image
              src="/images/rings/ring (2).webp"
              alt="Diamond brilliance and sparkle"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-3">
              <p className="text-sm font-medium text-gray-800 text-center">
                Brilliance Captured
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden bg-white border border-gray-100 shadow-xs">
            <Image
              src="/images/rings/ring (3).webp"
              alt="Elegant jewelry design"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-3">
              <p className="text-sm font-medium text-gray-800 text-center">
                Design Excellence
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
