import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsDiscord, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";

export default function FooterCom() {
  return (
    <Footer container className="bg-green-50 border-t-4 border-green-600 mt-20">
      <div className="w-full max-w-7xl mx-auto px-4 py-10 md:flex md:justify-between md:items-start gap-10">

        {/* Logo & About */}
        <div className="mb-6 md:mb-0 md:w-1/3">
          <Link to="/" className="text-2xl font-bold text-green-700 flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-green-600 text-white rounded-md">Store </span> Beacon
          </Link>
          <p className="text-green-800 text-sm">
            Discover nearby shops, latest offers, and more. Store Beacon helps you find the best local businesses effortlessly.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-6 md:mb-0 md:w-1/3">
          <h3 className="text-lg font-semibold text-green-700 mb-3">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-green-800 text-sm">
            <li><Link to="/" className="hover:text-green-600 transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-green-600 transition">About Us</Link></li>
            <li><Link to="/contactus" className="hover:text-green-600 transition">Contact</Link></li>
            <li><Link to="/search" className="hover:text-green-600 transition">Find Shops</Link></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div className="md:w-1/3">
          <h3 className="text-lg font-semibold text-green-700 mb-3">Contact</h3>
          <p className="text-green-800 text-sm mb-4">
            123 Main Street, Rameshwaram <br />
            Tamil Nadu, India <br />
            Email: info@storebeacon.com
          </p>
          <div className="flex gap-4 text-green-700">
            <Link href="#" className="hover:text-green-600 transition"><BsFacebook size={20} /></Link>
            <Link href="#" className="hover:text-green-600 transition"><BsInstagram size={20} /></Link>
            <Link href="#" className="hover:text-green-600 transition"><BsTwitter size={20} /></Link>
            <Link href="#" className="hover:text-green-600 transition"><BsGithub size={20} /></Link>
            <Link href="#" className="hover:text-green-600 transition"><BsDiscord size={20} /></Link>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-green-200 mt-6" />

      {/* Bottom */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between px-4 py-4 text-green-700 text-sm gap-2 md:gap-0">
        <span>© {new Date().getFullYear()} Sameer. All Rights Reserved.</span>
        <span>Made with ❤️ using React & Tailwind CSS</span>
      </div>
    </Footer>
  );
}
