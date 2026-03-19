import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  {
    image: hero1,
    title: "Peace not war",
    description: "As the terrible toll of conflict mounts, people and nature need immediate protection. The world needs peaceful diplomatic solutions – and distributed energy syste...",
  },
  {
    image: hero2,
    title: "Protect our forests",
    description: "Forests are the lungs of the Earth. Every year, millions of hectares are destroyed. We must act now to preserve these vital ecosystems for future generations.",
  },
  {
    image: hero3,
    title: "Save our oceans",
    description: "Our oceans are drowning in plastic. Marine life is suffering. Join us in the fight to protect the world's seas and the creatures that call them home.",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [autoplay, next]);

  return (
    <section className="relative w-full h-[80vh] min-h-[500px] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gp-dark/40" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex flex-col justify-center px-4 lg:px-8">
        <h1
          key={current}
          className="font-heading text-4xl md:text-6xl lg:text-7xl text-primary-foreground mb-6 animate-slide-in"
        >
          {slides[current].title}
        </h1>
        <p className="text-primary-foreground/90 max-w-xl text-base md:text-lg mb-8 animate-slide-in" style={{ animationDelay: "0.1s" }}>
          {slides[current].description}
        </p>
        <button className="bg-accent text-accent-foreground px-8 py-4 font-bold text-sm w-fit hover:brightness-110 transition animate-slide-in" style={{ animationDelay: "0.2s" }}>
          Read more
        </button>
      </div>

      {/* Arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-primary-foreground/60 hover:text-primary-foreground transition">
        <ChevronLeft size={40} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-primary-foreground/60 hover:text-primary-foreground transition">
        <ChevronRight size={40} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-4 lg:left-8 z-10 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all ${
              i === current ? "w-10 bg-primary-foreground" : "w-6 bg-primary-foreground/40"
            }`}
          />
        ))}
        <button
          onClick={() => setAutoplay(!autoplay)}
          className="ml-2 text-primary-foreground/60 hover:text-primary-foreground transition"
        >
          <Play size={16} className={autoplay ? "fill-current" : ""} />
        </button>
      </div>
    </section>
  );
};

export default HeroCarousel;
