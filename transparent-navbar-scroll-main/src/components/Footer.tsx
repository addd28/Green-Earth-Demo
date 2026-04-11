import { Link } from "react-router-dom";

const Footer = () => {
  const footerSections = [
    { 
      title: "Explore", 
      links: [
        { name: "Events", path: "/events" }, 
        { name: "Campaigns", path: "/campaign" }, 
      ] 
    },
    { 
      title: "Get involved", 
      links: [
        { name: "Act now", path: "/campaign" }, 
        { name: "Volunteer", path: "/events" }, 
        { name: "Fundraise", path: "/donate" }
      ] 
    },
    { 
      title: "About", 
      links: [
        { name: "Our values", path: "/about" }, 
        { name: "How we're funded", path: "/sponsors" }, 
        { name: "Contact us", path: "/contact" }
      ] 
    },
  ];

  return (
    <footer className="bg-foreground text-primary-foreground py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-heading text-xl mb-4 text-gp-green-light">GREENEARTH</h4>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Greenearth is a global network of independent campaigning organizations that use peaceful protest and creative communication to expose global environmental problems.
            </p>
          </div>
          {footerSections.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="text-sm text-primary-foreground/70 hover:text-gp-green-light transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Greenpeace International. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;