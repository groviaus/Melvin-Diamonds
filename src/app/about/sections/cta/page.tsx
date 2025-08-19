"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden">
          <div className="relative aspect-[21/9] sm:aspect-[16/6] lg:aspect-[16/5]">
            <Image
              src="/images/must-have/right (1).jpeg"
              alt="Experience luxury in person"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-900/70 via-teal-800/30 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif mb-3 sm:mb-4">
                  Experience It In Person
                </h3>
                <p className="text-sm sm:text-base font-light mb-4 sm:mb-6 max-w-2xl mx-auto">
                  Book a one-on-one appointment or connect with us virtually for
                  tailored recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button className="bg-white text-teal-900 hover:bg-white/90 rounded-none px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-sm sm:text-base">
                    Book an Appointment
                  </Button>
                  <Button className="bg-white text-teal-900 hover:bg-white/90 rounded-none px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-sm sm:text-base">
                  Visit a Showroom
                  </Button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
