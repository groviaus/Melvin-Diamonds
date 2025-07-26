import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-2">
      {/* Left Hero - Award-Winning Rings */}
      <div className="relative min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/products/asset (27).webp')",
          }}
        />
        <div className="relative z-10 flex flex-col justify-end items-center h-full px-4 sm:px-8 lg:px-12 pb-6 sm:pb-8 lg:pb-10 bg-gradient-to-t from-black/50 via-black/25 to-transparent">
          <div className="text-center text-white max-w-full">
            <h2 className="mb-4 sm:mb-6 lg:mb-8 leading-tight tracking-wide font-extralight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            Best-Selling Jewelry 
            </h2>

            <Button
              className="bg-teal-800 hover:bg-teal-900 text-white px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg font-light tracking-wider transition-all duration-300 hover:shadow-xl border-0 rounded-none hover:scale-105"
              size="lg"
            >
              Shop Engagement Rings
            </Button>
          </div>
        </div>
      </div>

      {/* Right Hero - Best-Selling Jewelry */}
      <div className="relative min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/products/asset (29).webp')",
          }}
        />
        <div className="relative z-10 flex flex-col justify-end items-center h-full px-4 sm:px-8 lg:px-12 pb-6 sm:pb-8 lg:pb-10 bg-gradient-to-t from-black/50 via-black/25 to-transparent">
          <div className="text-center text-white max-w-full">
            <h2 className="mb-4 sm:mb-6 lg:mb-8 leading-tight tracking-wide font-extralight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
             Most-Exquisite Rings
            </h2>

            <Button
              className="bg-teal-800 hover:bg-teal-900 text-white px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg font-light tracking-wider transition-all duration-300 hover:shadow-xl border-0 rounded-none hover:scale-105"
              size="lg"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
