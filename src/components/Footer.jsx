

import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#09090b] border-t border-[rgba(255,255,255,0.05)] py-10 px-5 mt-auto">

      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between items-center gap-5">

        {/* ShopNest */}
        <div>
          <h3 className="text-white text-base mb-2.5">
            ShopNest
          </h3>

          <p className="text-white text-base">
            Premium E-Commerce Platform.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap gap-5">

          <NavLink
            to="/about"
            className="text-white text-base hover:text-red-500 transition-colors duration-300 whitespace-nowrap"
          >
            About Us
          </NavLink>

          <NavLink
            to="/return"
            className="text-white text-base hover:text-red-500 transition-colors duration-300 whitespace-nowrap"
          >
            Return Policy
          </NavLink>

          <NavLink
            to="/disclaimer"
            className="text-white text-base hover:text-red-500 transition-colors duration-300 whitespace-nowrap"
          >
            Disclaimer
          </NavLink>

        </div>

        {/* Copyright */}
        <div className="text-white text-base">
          &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;

