import AnimatedBg from "./components/AnimatedBg";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import IntroSection from "./components/IntroSection";
import MyFullInfomation from "./components/MyFullInfomation";
import ProjectsSection from "./components/ProjectsSection";
import SiteHeader from "./components/SiteHeader";
import SkillsSection from "./components/SkillsSection";
import UIEnhancements from "./components/UIEnhancements";

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

  if (pathname === "/full-info") {
    return (
      <main>
        <MyFullInfomation />
      </main>
    );
  }

  return (
    <>
      <UIEnhancements />
      <AnimatedBg />
      <SiteHeader />
      <main style={{ position: "relative", zIndex: 1 }}>
        <HeroSection />
        <IntroSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}

export default App;
