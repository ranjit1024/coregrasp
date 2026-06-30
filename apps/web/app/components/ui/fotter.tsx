import { Facebook01Icon, Instagram, Linkedin } from '@hugeicons/core-free-icons';
import { CircleEllipsis, MessageCircleHeartIcon, Ticket, X } from 'lucide-react';
import React from 'react';


const Footer = () => {
  return (
    <footer className="w-full bg-white px-6 pb-8 mt-20 max-md:px-2 ">
      {/* The thin divider line from your image */}
      <div className="w-full border-t border-gray-200 mb-6" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Social Icons Left */}
        <div className="flex items-center gap-5 text-gray-400">
          <a href="#" className="hover:text-gray-600 transition-colors">
            <Ticket size={20} fill="currentColor" strokeWidth={0} />
          </a>
          <a href="#" className="hover:text-gray-600 transition-colors">
            <CircleEllipsis size={20} />
          </a>
          <a href="#" className="hover:text-gray-600 transition-colors">
            <MessageCircleHeartIcon size={20} fill="currentColor" strokeWidth={0} />
          </a>
          <a href="#" className="hover:text-gray-600 transition-colors">
            <X size={20} fill="currentColor" strokeWidth={0} />
          </a>
        </div>

        {/* Links and Copyright Right */}
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-gray-600 transition-colors">Terms of use</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Shipping</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Legal Notice</a>
          <span className="ml-2">@Revisly 2026</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;