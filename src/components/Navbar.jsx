import { NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import LanguageSelector from "../LanguageSelector";
import { auth } from "../firebase";
import { Cookies } from "react-cookie";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

const cookies = new Cookies();

const Navbar = () => {
  const { language } = useLanguage();
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Listen for Firebase auth changes
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        cookies.set("auth-token", user.refreshToken);
        setIsAuth(true);
      } else {
        cookies.remove("auth-token");
        setIsAuth(false);
      }
    });

    return () => unsub(); // 🧼 Cleanup
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    cookies.remove("auth-token");
    navigate("/"); // 👈 redirects to home/login page
  };

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex flex-col md:flex-row justify-between items-center">
      <h1 className="text-2xl font-bold text-green-600">
        🌿 GreenApp {language && `| 🌐 ${language}`}
      </h1>

      <div className="flex items-center gap-4">
        {/* Only show nav links if logged in */}
        {isAuth && (
          <>
            <NavItem to="/" label="🏠 Home" />
            <NavItem to="/chat" label="💬 Chat" />
            <NavItem to="/crop" label="🌾 Crop" />
            <NavItem to="/schemes" label="📜 Schemes" />
            <NavItem to="/detect" label="🧬 Disease Detection" />
            <NavItem to="/comfort" label="🧘 Comfort" />
          </>
        )}

        <LanguageSelector />

        {/* 🧑‍🔓 Login/Logout Button */}
        {isAuth ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            🔓 Logout
          </button>
        ) : (
          <NavLink to="/login">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
              🔐 Login
            </button>
          </NavLink>
        )}
      </div>
    </nav>
  );
};

const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-4 py-2 rounded-md font-medium transition ${
        isActive
          ? "bg-green-100 text-green-700"
          : "text-gray-600 hover:bg-gray-100"
      }`
    }
  >
    {label}
  </NavLink>
);

export default Navbar;
