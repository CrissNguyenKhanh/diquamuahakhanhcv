import "./SiteHeader.css";
import { IconBrackets } from "./HeroIcons";

const LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#intro", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <a href="#hero" className="site-header__brand">
        <span className="site-header__brand-icon" aria-hidden>
          <IconBrackets />
        </span>
        Criss Nguyen
      </a>
      <nav className="site-header__nav" aria-label="Main navigation">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="site-header__link">
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
