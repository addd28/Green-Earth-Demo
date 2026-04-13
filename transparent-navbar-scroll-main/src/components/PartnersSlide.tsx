import React, { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"; 
import { motion } from "framer-motion";

import { apiUrl } from "@/lib/apiBase";

const API_PARTNERS = apiUrl("/api/green_earth/partner");

const PartnersSlide = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch(API_PARTNERS);
        const result = await response.json();
        const data = result.data || result || [];
        setPartners([...data].reverse());
      } catch (error) {
        console.error("Failed to load partners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const slide = useCallback((direction) => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const itemWidth = clientWidth >= 1024 ? clientWidth / 5 : (clientWidth >= 768 ? clientWidth / 3 : clientWidth / 2);

      if (direction === "right") {
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          sliderRef.current.scrollBy({ left: itemWidth, behavior: "smooth" });
        }
      } else {
        if (scrollLeft <= 0) {
          sliderRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
        } else {
          sliderRef.current.scrollBy({ left: -itemWidth, behavior: "smooth" });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (loading || partners.length === 0 || isHovered) return;

    const interval = setInterval(() => {
      slide("right");
    }, 3000); 

    return () => clearInterval(interval); 
  }, [loading, partners, isHovered, slide]);

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>;
  if (partners.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-center font-bold text-3xl md:text-4xl text-emerald-700 mb-16 uppercase tracking-widest">
          Partners
        </h2>

        <div 
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}  
          onMouseLeave={() => setIsHovered(false)} 
        >
          {/* Prev */}
          <button 
            onClick={() => slide("left")} 
            className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-slate-100"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Logos */}
          <div 
            ref={sliderRef}
            className="flex items-center overflow-x-auto snap-x snap-mandatory py-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style dangerouslySetInnerHTML={{__html: `div::-webkit-scrollbar { display: none; }`}} />

            {partners.map((partner) => (
              <motion.div 
                key={partner.id} 
                className="snap-center flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/5 flex items-center justify-center px-6"
              >
                <a 
                  href={partner.website} 
                  target="_blank" 
                  rel="noreferrer"
                  className="block w-full flex justify-center"
                >
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="max-w-full h-20 md:h-24 lg:h-28 object-contain transition-all duration-500 hover:scale-110 filter grayscale hover:grayscale-0" 
                    onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        if (target.parentElement) {
                            target.parentElement.innerHTML = `<span class="text-xl font-bold text-slate-400 text-center">${partner.name}</span>`;
                        }
                    }}
                  />
                </a>
              </motion.div>
            ))}
          </div>

          {/* Next */}
          <button 
            onClick={() => slide("right")} 
            className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-slate-100"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PartnersSlide;