import { useState, useEffect } from "react";
import { Search, ChevronDown, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";


const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
  
  { name: "Events and Campaigns", path: "/campaignandevent" },
  { name: "News and Stories", path: "/news" },
  { name: "Sponsors", path: "/sponsors" },
  { name: "About us", path: "/about" }
];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Logo */}
        <a href="/" className={`font-heading text-2xl tracking-wider uppercase ${scrolled ? "text-gp-green" : "text-gp-green-light"}`}>
          GREENEARTH
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path} // Dùng to thay cho href
              className={`text-sm font-semibold transition-colors hover:text-gp-green ${
                scrolled ? "text-foreground" : "text-primary-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <button className="bg-gp-green text-primary-foreground px-5 py-2 text-sm font-bold flex items-center gap-1 hover:brightness-110 transition">
            Donate <ChevronDown size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="hidden lg:flex items-center gap-2">
          <input
            type="text"
            placeholder="Search"
            className={`bg-transparent border-b text-sm py-1 px-2 w-32 focus:outline-none transition-colors ${
              scrolled ? "border-foreground text-foreground placeholder:text-muted-foreground" : "border-primary-foreground/50 text-primary-foreground placeholder:text-primary-foreground/60"
            }`}
          />
          <Search size={18} className={scrolled ? "text-foreground" : "text-primary-foreground"} />
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? (
            <X size={24} className={scrolled ? "text-foreground" : "text-primary-foreground"} />
          ) : (
            <Menu size={24} className={scrolled ? "text-foreground" : "text-primary-foreground"} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-card border-t shadow-lg">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="text-foreground font-semibold text-sm"
                onClick={() => setMobileOpen(false)} // Tự đóng menu khi nhấn chuyển trang
              >
                {link.name}
              </Link>
            ))}
            <button className="bg-gp-green text-primary-foreground px-5 py-2 text-sm font-bold w-fit">
              Donate
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
