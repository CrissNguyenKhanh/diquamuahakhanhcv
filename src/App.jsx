import ContactForm from "./components/ContactForm";
import HeroSection from "./components/HeroSection";
import IntroSection from "./components/IntroSection";
import ProjectsSection from "./components/ProjectsSection";
import SiteHeader from "./components/SiteHeader";
import SkillsSection from "./components/SkillsSection";

function App() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <IntroSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactForm />
      </main>
    </>
  );
}

export default App;
