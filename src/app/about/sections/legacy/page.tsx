"use client";

import Image from "next/image";

export default function LegacySection() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-tl from-teal-950 via-teal-800 to-teal-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6 text-white">
            <div className="text-left ">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-serif text-white ">
                Our Legacy
              </h2>
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-serif text-white mb-3 sm:mb-4">
              Generations of Craftsmanship
            </h3>
            <p className="text-base sm:text-lg font-light leading-relaxed">
              Our journey began as goldsmiths and jewelry craftsmen, evolving
              into Maven Diamonds. From being a leading jeweler in Gorakhpur to
              establishing an empire, our story spans generations.
            </p>
            <p className="text-base sm:text-lg font-light leading-relaxed">
              We focused on jewelry boxes, creating &quot;Suraj Auzar
              Bhandar&quot; (now &quot;Gallery of Jewelry and Gems&quot;), and
              became associated with &quot;Rajan Jewellers&quot; as wholesale
              and single diamond dealers in Purvanchal.
            </p>
            <p className="text-base sm:text-lg font-light leading-relaxed">
              Through dissolution and transition to the third generation, our
              commitment to craftsmanship has remained unwavering.
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-xl -mr-40">
            <Image
              src="/images/products/asset (1).jpeg"
              alt="Traditional goldsmith craftsmanship"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
          </div>
        </div>
      </div>
    </section>
  );
}
