import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white py-6">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; {currentYear} Daniel Obuchowicz | Wszystkie prawa zastrzeżone</p>
      </div>
    </footer>
  );
}

export default Footer;
