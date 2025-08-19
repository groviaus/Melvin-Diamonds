"use client";

import Image from "next/image";

export default function PhilosophySection() {
  return (
    <section id="philosophy" className="py-8 sm:py-12 lg:py-16 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6">
            <div className="text-left  ">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-serif text-gray-800 mb-2 sm:mb-3 lg:mb-4">
                Our Philosophy: Regal Elegance for Everyday
              </h2>
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-serif text-gray-800 mb-3 sm:mb-4">
              Where Royalty Meets Daily Life
            </h3>
            <p className="text-base sm:text-lg text-gray-700 font-light leading-relaxed">
              Each of our pieces is inspired by the understated luxuries of
              daily wear that may not immediately catch the eye but hold
              significant value.
            </p>
            <p className="text-base sm:text-lg text-gray-700 font-light leading-relaxed">
              We draw influence from the regal elegance found in the everyday
              attire of kings and queens.
            </p>
          </div>

          <div className="relative aspect-[4/4] overflow-hidden">
            <Image
              src="/images/products/asset (4).webp"
              alt="Regal elegance in everyday jewelry"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
