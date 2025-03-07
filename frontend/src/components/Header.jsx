import React from 'react';

const Header = () => {
  return (
    <header className="header flex p-5 justify-between items-center p-5 bg-white shadow-md border-b">
      <div className="text-4xl font-bold">SuiFundz</div>
      <nav className="flex gap-4">
        <a href="#about" className="text-gray-700 hover:text-gray-900">About</a>
        <a href="#contact" className="text-gray-700 hover:text-gray-900">Contact</a>
      </nav>
    </header>
  );
};

export default Header;
