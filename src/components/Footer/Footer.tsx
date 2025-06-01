import { TwitterOutlined, LinkedinOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white px-10 pt-12 pb-6 mt-16">
      <div className="p-10 pt-0 pb-0 mx-auto flex flex-col md:flex-row justify-between">
        {/* Left Side: Logo + Social */}
        <div>
          <div className="flex items-center space-x-3">
            <img
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              alt="Logo"
              className="w-10 h-10"
            />
            <h2 className="text-2xl font-bold">Saass ChatBot</h2>
          </div>
          <p className="mt-3 text-m text-gray-300">
            Custom ChatBot for your business
          </p>
          <div className="flex space-x-4 mt-5">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full w-18 h-18 "
            >
              <TwitterOutlined className="text-white text-2xl" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full w-18 h-18 "
            >
              <LinkedinOutlined className="text-white text-2xl" />
            </a>
          </div>
        </div>

        {/* Right Side: Company Links */}
        <div className="mt-10 md:mt-0 text-right">
          <h3 className="font-semibold mb-4 text-lg">Company</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link to="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="p-10 pt-0 pb-0 mx-auto mt-5 mb-5">
        <div className="flex justify-start text-lg text-white font-bold">
          © {new Date().getFullYear()} Saass ChatBot. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
