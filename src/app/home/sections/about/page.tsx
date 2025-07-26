import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="grid grid-cols-2 h-[700px] ">
      {/* Left Section - Background Image with Overlay */}
      <div className="py-10  h-full">
        <div className="relative h-full ">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/products/asset (1).jpeg')",
            }}
          />

          {/* Semi-transparent Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
        </div>
      </div>

      {/* Right Section - Heading and Product Grid */}
      <div className="flex flex-col justify-center items-start p-12 h-full ">
        {/* Main Heading */}
        <h1 className="text-3xl tracking-wide font-serif text-gray-800 mb-5 font-light">
          We&apos;re Here for You, In Person and Online
        </h1>
        <p className="text-gray-600 mb-10 text-">
          Whether it&apos;s at a store near you or online, we curate your
          appointment just for you.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className=" text-white px-10 py-6 rounded-none  transition-colors text-base  duration-300 bg-teal-900 hover:bg-gradient-to-b from-teal-900 to-teal-950 hover:border-teal-900 hover:text-white"
          >
            Visit a Showroom
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 px-10 py-6 rounded-none hover:bg-teal-900 hover:text-white transition-colors text-base duration-300"
          >
            Book a Virtual Appointment
          </Button>
        </div>
      </div>
    </div>
  );
}
