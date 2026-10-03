'use client';

import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-nordic-dark/10 dark:border-white/5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center dark:bg-white">
              <span className="material-icons text-white dark:text-nordic-dark text-lg">apartment</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-nordic-dark dark:text-white">
              LuxeEstate
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-mosque font-medium text-sm border-b-2 border-mosque px-1 py-1" href="#">
              Buy
            </a>
            <a
              className="text-nordic-dark/70 hover:text-nordic-dark dark:text-white/70 dark:hover:text-white font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
              href="#"
            >
              Rent
            </a>
            <a
              className="text-nordic-dark/70 hover:text-nordic-dark dark:text-white/70 dark:hover:text-white font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
              href="#"
            >
              Sell
            </a>
            <a
              className="text-nordic-dark/70 hover:text-nordic-dark dark:text-white/70 dark:hover:text-white font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
              href="#"
            >
              Saved Homes
            </a>
          </div>

          {/* Actions & Profile */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button className="text-nordic-dark hover:text-mosque dark:text-gray-400 dark:hover:text-white transition-colors p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
              <span className="material-icons text-2xl">search</span>
            </button>
            
            <button className="text-nordic-dark hover:text-mosque dark:text-gray-400 dark:hover:text-white transition-colors relative p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
              <span className="material-icons text-2xl">notifications_none</span>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 dark:border-white/10">
              <button className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all">
                <img
                  alt="Profile"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAWhQZ663Bd08kmzjbOPmUk4UIxYooNONShMEFXLR-DtmVi6Oz-TiaY77SPwFk7g0OobkeZEOMvt6v29mSOD0Xm2g95WbBG3ZjWXmiABOUwGU0LOySRfVDo-JTXQ0-gtwjWxbmue0qDm91m-zEOEZwAW6iRFB1qC1bAU-wkjxm67Sbztq8w7srHkFT9bVEC86qG-FzhOBTomhAurNRmx9l8Yfqabk328NfdKuVLckgCdaPsNFE3yN65MeoRi05GA_gXIMwG4YDIeA"
                />
              </button>
            </div>

            {/* Mobile Burger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-nordic-dark dark:text-white p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              <span className="material-icons text-2xl">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden border-t border-nordic-dark/5 bg-background-light dark:bg-background-dark overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-2 space-y-1">
          <a
            className="block px-3 py-2 rounded-md text-base font-medium text-mosque bg-mosque/10"
            href="#"
          >
            Buy
          </a>
          <a
            className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5"
            href="#"
          >
            Rent
          </a>
          <a
            className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5"
            href="#"
          >
            Sell
          </a>
          <a
            className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5"
            href="#"
          >
            Saved Homes
          </a>
        </div>
      </div>
    </nav>
  );
}
