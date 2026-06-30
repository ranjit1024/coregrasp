"use client";

import  { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight} from 'lucide-react';
import Logo from "../../public/logo.png"
import Image from 'next/image';
const Navbar = () => {
  const [hoveredPath, setHoveredPath] = useState("");

  const navItems = [
    { name: "Features", path: "/features" },
    { name: "How it Works", path: "/how" },
    { name: "Pricing", path: "/pricing" },
    { name: "Resources", path: "/resources" },
  ];

  return (
   
    <nav className="fixed top-8 left-0 right-0 z-50 flex justify-center px-6 ">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, }}
        transition={{ type: "spring", visualDuration: 0.5, bounce: 0.25 }} 
        className="flex items-center  justify-between w-full max-w-5xl bg-white/75 backdrop-blur border border-gray-200 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-3xl px-3 py-2"
      >
     
        <Link href="/" className="flex items-center gap-2.5 pl-4 group">
          <div className="relative flex items-center justify-center">
             <Image src={Logo} height={30} width={30} alt='revlisy'/>
          </div>
          <span className="text-[17px] font-bold bg-clip-text text-transparent bg-liner-to-br from-gray-900 to-gray-500 tracking-tight">
            Revisly
          </span>
        </Link>

 
        <div className="hidden md:flex items-center relative">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onMouseEnter={() => setHoveredPath(item.path)}
              onMouseLeave={() => setHoveredPath("")}
              className="relative px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              {item.name}
              {item.path === hoveredPath && (
                <motion.div
                  layoutId="nav-hover"
                  className="absolute inset-0 bg-gray-100/80 rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
            </Link>
          ))}
        </div>

    
        <div className="flex items-center gap-2">
          <Link 
            href="/login" 
            className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign In
          </Link>
          
          <Link 
            href="/signup" 
            className="group relative overflow-hidden bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:pr-8 active:scale-95 shadow-xl shadow-gray-200"
          >
            <span className="relative z-10">Sign Up</span>
            <div className="absolute inset-0 bg-liear-to-r from-orange-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <ArrowRight 
              size={15} 
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:right-4 z-20" 
            />
          </Link>
        </div>
      </motion.div>
    </nav>
    
  );
};

export default Navbar;