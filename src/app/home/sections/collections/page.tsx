import React from "react";
import Image from "next/image";

const page = () => {
  const collections = [
    {
      title: "Signature Collections",
      description: "The ultimate line in luxury inspired pieces",
      image: "/images/collections/collection (1).webp",
      buttonText: "Shop Now",
    },
    {
      title: "Pacific Green Lab Diamonds",
      description: "A range of fine luxury created stones",
      image: "/images/collections/collection (3).webp",
      buttonText: "Shop Now",
    },
    {
      title: "20th Anniversary Collection",
      description: "Celebrate 20 years of artisan inspired creativity",
      image: "/images/collections/collection (2).webp",
      buttonText: "Shop Now",
    },
  ];
  return (
    <section className="pt-8 sm:pt-12 lg:pt-16">
      <div className="sm:text-left text-center mb-8 sm:mb-10 lg:mb-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-gray-800 mb-2 sm:mb-3 lg:mb-4">
          Shop Jewelry by Collections
        </h1>
        <p className="text-base sm:text-lg font-light text-gray-600 max-w-2xl">
          Thoughtfully designed collections for the big day.
        </p>
      </div>
      <section className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {collections.map((collection, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden aspect-[4/5] mb-3 sm:mb-4">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 right-0 left-0 text-white flex flex-col items-center justify-center px-4">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-medium mb-2 text-center">
                    {collection.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 mb-3 sm:mb-4 text-center">
                    {collection.description}
                  </p>
                  <button className="border border-white px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm hover:bg-white hover:text-black transition-colors duration-300 text-center mx-auto w-fit">
                    {collection.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default page;
