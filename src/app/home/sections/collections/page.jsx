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
    <section className="pt-16">
      <div className="text-left mb-12 px-8">
        <h1 className="text-4xl font-serif text-gray-800 mb-4">
          Shop Jewelry by Collections
        </h1>
        <p className="text-lg font-light text-gray-600 max-w-2xl">
          Thoughtfully designed collections for the big day.
        </p>
      </div>
      <section className="w-full">
        <div className="grid grid-cols-3 gap-3">
          {collections.map((collection, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden aspect-[4/5] mb-4">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* <div className="absolute inset-0 bg bg-black/30"></div> */}
                <div className="absolute bottom-10  right-0 left-0 text-white flex flex-col items-center justify-center">
                  <h3 className="text-2xl font-medium mb-2 text-center">
                    {collection.title}
                  </h3>
                  <p className="text-sm text-white/90 mb-4 text-center">
                    {collection.description}
                  </p>
                  <button className="border border-white px-6 py-2 text-sm hover:bg-white hover:text-black transition-colors duration-300 text-center mx-auto w-fit">
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
