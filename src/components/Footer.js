import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-primary py-6 transition-colors duration-300">
      <div className="container mx-auto text-center">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          &copy; {currentYear} Daniel Obuchowicz | Wszystkie prawa zastrzeżone
        </p>
      </div>
    </footer>
  );
}

export default Footer;
