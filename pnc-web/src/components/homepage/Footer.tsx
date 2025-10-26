import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-pnc-green-dark text-pnc-sand py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-serif font-bold mb-2">Prithvi Nature Club</h3>
            <p className="text-pnc-sand/90 max-w-md">
              Sustainable living. Join us in cultivating a greener tomorrow.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link 
              href="#" 
              className="text-pnc-sand hover:text-pnc-accent-orange transition-colors duration-300"
              aria-label="Facebook"
            >
              <FaFacebook size={24} />
            </Link>
            <Link 
              href="#" 
              className="text-pnc-sand hover:text-pnc-accent-blue transition-colors duration-300"
              aria-label="Twitter"
            >
              <FaTwitter size={24} />
            </Link>
            <Link 
              href="#" 
              className="text-pnc-sand hover:text-pnc-accent-orange transition-colors duration-300"
              aria-label="Instagram"
            >
              <FaInstagram size={24} />
            </Link>
          </div>
        </div>
        
        <div className="border-t border-pnc-sand/30 mt-8 pt-8 text-center text-pnc-sand/70">
          <p>&copy; {new Date().getFullYear()} Prithvi Nature Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;