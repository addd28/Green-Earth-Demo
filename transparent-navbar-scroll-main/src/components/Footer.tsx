const Footer = () => (
  <footer className="bg-foreground text-primary-foreground py-16">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="grid md:grid-cols-4 gap-8 mb-12">
        <div>
          <h4 className="font-heading text-xl mb-4 text-gp-green-light">GREENPEACE</h4>
          <p className="text-sm text-primary-foreground/70 leading-relaxed">
            Greenpeace is a global network of independent campaigning organizations that use peaceful protest and creative communication to expose global environmental problems.
          </p>
        </div>
        {[
          { title: "Explore", links: ["Issues", "Campaigns", "Stories", "Press Centre"] },
          { title: "Get involved", links: ["Act now", "Volunteer", "Events", "Fundraise"] },
          { title: "About", links: ["Our values", "Our history", "How we're funded", "Contact us"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-primary-foreground/70 hover:text-gp-green-light transition-colors">
                    {link}
                  </a>
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

export default Footer;
