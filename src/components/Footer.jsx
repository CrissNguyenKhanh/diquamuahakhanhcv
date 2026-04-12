import "./Footer.css";
import { FiGithub, FiLinkedin, FiExternalLink, FiHeart } from "react-icons/fi";

const GITHUB   = "https://github.com/CrissNguyenKhanh";
const LINKEDIN = "https://www.linkedin.com/in/qu%E1%BB%91c-kh%C3%A1nh-3679842ba/";
const TREE     = "https://tr.ee/cuachukhanh";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">

        {/* Brand */}
        <div className="site-footer__brand">
          <span className="site-footer__name">Criss Nguyen</span>
          <span className="site-footer__tagline">Software Engineer · Da Nang, VN</span>
        </div>

        {/* Social icons */}
        <nav className="site-footer__social" aria-label="Social links">
          <a href={GITHUB}   target="_blank" rel="noreferrer noopener" aria-label="GitHub"   className="site-footer__link"><FiGithub /></a>
          <a href={LINKEDIN} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn" className="site-footer__link"><FiLinkedin /></a>
          <a href={TREE}     target="_blank" rel="noreferrer noopener" aria-label="Links"    className="site-footer__link"><FiExternalLink /></a>
        </nav>

        {/* Credits */}
        <p className="site-footer__credit">
          Built with{" "}
          <FiHeart className="site-footer__heart" aria-hidden />
          {" "}using <strong>React</strong> + <strong>Vite</strong>
          <span className="site-footer__year"> · © {new Date().getFullYear()}</span>
        </p>
      </div>
    </footer>
  );
}
