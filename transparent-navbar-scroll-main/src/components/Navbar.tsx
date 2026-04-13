import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import NavbarSearch from "@/components/NavbarSearch";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { name: "Campaigns", path: "/campaign" },
    { name: "Events", path: "/events" },
    { name: "News and Stories", path: "/news" },
    { name: "About us", path: "/about" },
    { name: "Sponsors", path: "/sponsors" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-card shadow-md": "bg-transparent"}`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        <Link to="/" className={`font-heading text-2xl tracking-wider uppercase ${scrolled ? "text-gp-green" : "text-gp-green-light"}`}>
          GREENPEACE
        </Link>
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-semibold transition-colors hover:text-gp-green ${
                scrolled ? "text-foreground" : "text-primary-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/partners" className="bg-gp-green/90 text-primary-foreground px-5 py-2 text-sm font-bold hover:brightness-110 transition">
            Become Partner
          </Link>
          <Link to="/donate" className="bg-gp-green text-primary-foreground px-5 py-2 text-sm font-bold flex items-center gap-1 hover:brightness-110 transition">
            Donate
          </Link>
        </div>
        <div className="hidden lg:flex items-center gap-2">
          <NavbarSearch scrolled={scrolled} />
        </div>
        <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? (
            <X size={24} className={scrolled ? "text-foreground" : "text-primary-foreground"} />
          ) : (
            <Menu size={24} className={scrolled ? "text-foreground" : "text-primary-foreground"} />
          )}
        </button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden bg-card border-t shadow-lg">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="text-foreground font-semibold text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/partners" className="bg-gp-green/90 text-primary-foreground px-5 py-2 text-sm font-bold w-fit" onClick={() => setMobileOpen(false)}>
              Become Partner
            </Link>
            <Link to="/donate" className="bg-gp-green text-primary-foreground px-5 py-2 text-sm font-bold w-fit">
              Donate
            </Link>
            <div className="pt-2 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Search</p>
              <NavbarSearch scrolled={true} className="w-full" inputClassName="!w-full" onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
