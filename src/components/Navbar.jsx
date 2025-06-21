import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { Cookies } from "react-cookie";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Menu, X } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import LanguageSelector from "../LanguageSelector";

const cookies = new Cookies();

const Navbar = () => {
  const { language } = useLanguage();
  const [isAuth, setIsAuth] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        cookies.set("auth-token", user.refreshToken);
        setIsAuth(true);
      } else {
        cookies.remove("auth-token");
        setIsAuth(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    cookies.remove("auth-token");
    navigate("/");
  };

  return (
    <nav
      className={`sticky top-0 z-50 px-6 py-3 sm:py-4 backdrop-blur-md transition-colors duration-300 shadow-md ${
        scrolled
          ? "bg-white/80 border-b border-white/20"
          : "bg-gradient-to-r from-green-300/30 via-white/30 to-green-300/30"
      }`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-700 via-lime-500 to-green-700 drop-shadow-sm">
          🌿 GreenApp {language && `| 🌐 ${language}`}
        </h1>

        <div className="sm:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-green-700"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          {isAuth && (
            <>
              <NavItem to="/" label="🏠 Home" />
              <NavItem to="/chat" label="💬 Chat" />
              <NavItem to="/crop" label="🌾 Crop" />
              <NavItem to="/schemes" label="📜 Schemes" />
              <NavItem to="/detect" label="🧬 Detection" />
              <NavItem to="/chatbot" label="🧘 Chatbot" />
            </>
          )}

          <LanguageSelector />

          {isAuth ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 transition duration-300 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105"
            >
              🔓 Logout
            </button>
          ) : (
            <NavLink to="/login">
              <button className="bg-green-500 hover:bg-green-600 transition duration-300 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105">
                🔐 Login
              </button>
            </NavLink>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden mt-4 flex flex-col gap-3 items-start transition-all duration-300">
          {isAuth && (
            <>
              <NavItem to="/" label="🏠 Home" />
              <NavItem to="/chat" label="💬 Chat" />
              <NavItem to="/crop" label="🌾 Crop" />
              <NavItem to="/schemes" label="📜 Schemes" />
              <NavItem to="/detect" label="🧬 Detection" />
              <NavItem to="/chatbot" label="🧘 Chatbot" />
            </>
          )}

          <LanguageSelector />

          {isAuth ? (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 transition duration-300 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105"
            >
              🔓 Logout
            </button>
          ) : (
            <NavLink to="/login" className="w-full">
              <button className="w-full bg-green-500 hover:bg-green-600 transition duration-300 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105">
                🔐 Login
              </button>
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 text-sm sm:text-base rounded-lg font-medium transition duration-200 hover:scale-105 shadow-sm ${
        isActive
          ? "bg-green-200 text-green-800"
          : "text-gray-700 hover:bg-white/40"
      }`
    }
  >
    {label}
  </NavLink>
);

export default Navbar;
