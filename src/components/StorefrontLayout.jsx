import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

const StorefrontLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />

      <main className="flex flex-1 flex-col bg-black">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default StorefrontLayout;
