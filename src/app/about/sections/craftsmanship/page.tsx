"use client";

import Image from "next/image";

export default function CraftsmanshipSection() {
  return (
    <section
      id="craftsmanship"
      className="py-8 sm:py-12 lg:py-16 bg-gradient-to-tl from-teal-950 via-teal-800 to-teal-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6 text-white">
            <div className="text-left  ">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-serif text-white mb-2 sm:mb-3 lg:mb-4">
                The Art of Creation: Handcrafted in Surat
              </h2>
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-serif text-white mb-3 sm:mb-4">
              Where Tradition Meets Innovation
            </h3>
            <p className="text-base sm:text-lg font-light leading-relaxed">
              Our creations are meticulously crafted with precision by the
              skilled artisans of Surat, the diamond capital.
            </p>
            <p className="text-base sm:text-lg font-light leading-relaxed">
              Each piece is designed by our innovative and creative designers,
              and the final product is brought to life by generational craftsmen
              steeped in the rich tradition of diamond jewelry making in Surat.
            </p>
            <p className="text-base sm:text-lg font-light leading-relaxed">
              This collaborative effort adds immense value, as multiple skilled
              hands contribute to the final touch, ultimately enriching your
              collection with Maven Diamonds.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/experience/rings (1).webp"
                alt="Skilled artisan at work"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/experience/rings (2).webp"
                alt="Design process"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/experience/rings (3).webp"
                alt="Surat heritage"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/experience/rings (4).webp"
                alt="Finished diamond piece"
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
