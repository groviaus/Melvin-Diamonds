import Image from "next/image";

export default function Benefits() {
  const benefits = [
    {
      icon: "/images/icons/icons (3).png",
      text: "FREE SHIPPING & RETURNS",
    },
    {
      icon: "/images/icons/icons (2).png",
      text: "FREE LIFETIME WARRANTY",
    },
    {
      icon: "/images/icons/icons (5).png",
      text: "24/7 CUSTOMER SUPPORT",
    },
    {
      icon: "/images/icons/icons (1).png",
      text: "LIFETIME DIAMOND UPGRADE",
    },
    {
      icon: "/images/icons/icons (4).png",
      text: "FREE 60-DAY RESIZING",
    },
  ];

  return (
    <section className="bg-teal-950 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-white mb-8">
            We&apos;ve Got You Covered
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {/* Icon Container with 3D Effect */}
              <div className="relative mb-4">
                {/* 3D Circle Background */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/30 shadow-lg backdrop-blur-sm flex items-center justify-center hover:scale-110 hover:rotate-[360deg] transition-all duration-300">
                  {/* Icon */}
                  <div className="w-12 h-12 relative">
                    <Image
                      src={benefit.icon}
                      alt={benefit.text}
                      fill
                      className="object-contain "
                      sizes="48px"
                    />
                  </div>
                </div>

                {/* Subtle Glow Effect */}
                {/* <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-sm" /> */}
              </div>

              {/* Text Label */}
              <p className="text-white text-sm font-medium tracking-wide uppercase">
                {benefit.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
