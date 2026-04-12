import "./TechMarquee.css";

const ITEMS = [
  "Java", "Spring Boot", "Kotlin", "Android",
  "Python", "Flask", "OpenCV", "MediaPipe", "scikit-learn",
  "React 19", "Vite", "JavaScript", "TypeScript",
  "MySQL", "Docker", "Nginx", "Ubuntu",
  "Laravel", "PHP", "C++",
  "Socket.IO", "RMI", "JUnit", "Maven",
  "REST APIs", "JWT", "JPA", "Hibernate",
  "Git", "Linux",
];

export default function TechMarquee() {
  // Duplicate for seamless loop
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="tech-marquee" aria-hidden="true">
      <div className="tech-marquee__track">
        {doubled.map((label, i) => (
          <span key={i} className="tech-marquee__item">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
