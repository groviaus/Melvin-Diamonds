import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Phone,
  
  Calendar,
} from "lucide-react";

export default function Header() {
  return (
    <>
      {/* Promotional Banner */}
      <div className="bg-teal-800 text-white text-center py-3 px-4">
        <p className="text-sm font-light tracking-wide">
          <span className="font-medium">ENDS SOON!</span> Receive Natural
          Diamond Studs With Purchase Over $1,000. Use Code{" "}
          <span className="font-semibold tracking-wider">DIAMOND</span> in Cart.
          →
        </p>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 ">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Top Header */}
          <div className="flex items-center justify-between py-8 relative">
            {/* Left - Contact Info */}
            <div className="flex items-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2 hover:text-teal-700 transition-colors cursor-pointer">
                <Phone className="w-4 h-4" />
                <span className="font-light">800.691.0952</span>
              </div>
              {/* <div className="flex items-center space-x-2 hover:text-teal-700 transition-colors cursor-pointer">
                <MapPin className="w-4 h-4" />
                <span className="font-light">Stores</span>
              </div> */}
              <div className="flex items-center space-x-2 hover:text-teal-700 transition-colors cursor-pointer">
                <Calendar className="w-4 h-4" />
                <span className="font-light">Virtual Appointment</span>
              </div>
            </div>

            {/* Center - Logo */}
            <div className="flex-1 flex justify-center absolute top-0 left-0 right-0 bottom-0 items-center">
              <div className="text-center">
                <h1 className="text-3xl font-light tracking-[0.2em] text-gray-800 mb-1">
                  MEVLIN DIAMONDS<sup className="text-xs">®</sup>
                </h1>
                {/* <p className="text-xs text-gray-500 font-extralight italic tracking-wide">
                  20 Years of love
                </p> */}
              </div>
            </div>

            {/* Right - User Actions */}
            <div className="flex items-center space-x-6">
              <Search className="w-5 h-5 text-gray-600 hover:text-teal-700 transition-colors cursor-pointer" />
              <User className="w-5 h-5 text-gray-600 hover:text-teal-700 transition-colors cursor-pointer" />
              <Heart className="w-5 h-5 text-gray-600 hover:text-teal-700 transition-colors cursor-pointer" />
              <ShoppingBag className="w-5 h-5 text-gray-600 hover:text-teal-700 transition-colors cursor-pointer" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="pb-6 pt-2">
            <ul className="flex justify-center space-x-16 text-sm font-light text-gray-700 tracking-wide">
              <li className="hover:text-teal-700 transition-colors cursor-pointer py-2 border-b-2 border-transparent hover:border-teal-700">
                ENGAGEMENT RINGS
              </li>
              <li className="hover:text-teal-700 transition-colors cursor-pointer py-2 border-b-2 border-transparent hover:border-teal-700">
                WEDDING RINGS
              </li>
              <li className="hover:text-teal-700 transition-colors cursor-pointer py-2 border-b-2 border-transparent hover:border-teal-700">
                DIAMONDS
              </li>
              <li className="hover:text-teal-700 transition-colors cursor-pointer py-2 border-b-2 border-transparent hover:border-teal-700">
                GEMSTONES
              </li>
              <li className="hover:text-teal-700 transition-colors cursor-pointer py-2 border-b-2 border-transparent hover:border-teal-700">
                JEWELRY
              </li>
              <li className="hover:text-teal-700 transition-colors cursor-pointer py-2 border-b-2 border-transparent hover:border-teal-700">
                GIFTS
              </li>
              <li className="hover:text-teal-700 transition-colors cursor-pointer py-2 border-b-2 border-transparent hover:border-teal-700">
                ABOUT
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
