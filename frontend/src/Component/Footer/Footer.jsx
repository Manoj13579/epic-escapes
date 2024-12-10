import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
    <div className="mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 px-8">
      {/* Logo and description */}
      <div className="flex flex-col items-center md:items-start space-y-4">
      <img
           alt="Your Company"
           src={logo}
           className="h-8 w-auto"
         />
        <p className="text-center md:text-left text-sm">
          © 2024 Epic Escapes. All rights reserved.
        </p>
      </div>

      {/* Links Section */}
      <div className="flex space-x-8">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/" className="hover:underline">
          About
        </Link>
        <Link to="/" className="hover:underline">
          Services
        </Link>
        <Link to="/" className="hover:underline">
          Contact
        </Link>
      </div>

      {/* Social Icons */}
      <div className="flex space-x-6">
        <Link to="#facebook" className="hover:text-blue-500">
          <FaFacebookF size={20} />
        </Link>
        <Link to="#twitter" className="hover:text-blue-400">
          <FaTwitter size={20} />
        </Link>
        <Link to="#linkedin" className="hover:text-blue-600">
          <FaLinkedinIn size={20} />
        </Link>
        <Link to="#instagram" className="hover:text-pink-500">
          <FaInstagram size={20} />
        </Link>
      </div>
    </div>
  </footer>
  )
}

export default Footer;
