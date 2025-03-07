import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f5e4]">
      <div className="container mx-auto px-4 py-6">
        {/* Navigation */}
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <NavLink to="/" className="font-bold text-3xl flex items-center">
              <span className="text-[#2d5d3d]">SuiFundz</span>
            </NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/about" className="text-[#2d5d3d] hover:text-[#1e3e29]">
              About Us
            </NavLink>
            <NavLink to="/benefits" className="text-[#2d5d3d] hover:text-[#1e3e29]">
              Benefits
            </NavLink>
            <NavLink to="/contact" className="text-[#2d5d3d] hover:text-[#1e3e29]">
              Contact Us
            </NavLink>
          </div>

        </nav>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-16 md:mt-24">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2d5d3d] leading-tight">
              Connecting You To
              <br />
              The Future Of
              <br />
              Finance
            </h1>

            <div className="relative mt-8">
              <NavLink to="/wallet" className="bg-[#2d5d3d] hover:bg-[#1e3e29] text-white rounded-full px-4 py-2">
                Get Started →
              </NavLink>

              {/* Curved line */}
              <svg
                className="absolute -right-16 top-1/2 w-32 h-32 text-[#2d5d3d] hidden md:block"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10,50 Q30,90 90,60"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center md:justify-end">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Green card */}
              <div className="absolute right-0 top-0 w-56 h-36 md:w-64 md:h-40 bg-[#2d5d3d] rounded-xl transform rotate-12 shadow-lg"></div>

              {/* Cream card */}
              <div className="absolute left-0 bottom-0 w-56 h-36 md:w-64 md:h-40 bg-[#f8f5e4] border border-[#2d5d3d]/20 rounded-xl transform -rotate-6 shadow-md flex flex-col justify-between p-4">
                <div className="flex justify-between">
                  <div className="w-8 h-8 rounded-full bg-[#2d5d3d]/10 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-[#2d5d3d]"></div>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    <div className="w-2 h-2 bg-[#2d5d3d]"></div>
                    <div className="w-2 h-2 bg-[#2d5d3d]"></div>
                    <div className="w-2 h-2 bg-[#2d5d3d]"></div>
                    <div className="w-2 h-2 bg-[#2d5d3d]"></div>
                  </div>
                </div>

                <div className="text-[#2d5d3d] text-xs">
                  <div className="mb-1">SUIFUNDZ CARD</div>
                  <div className="mb-1">**** **** **** 4567</div>
                  <div>03/28</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}