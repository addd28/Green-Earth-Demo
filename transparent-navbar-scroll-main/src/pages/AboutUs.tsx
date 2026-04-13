import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiUrl } from "@/lib/apiBase";

export default function AboutUs() {
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const API = apiUrl("/api/green_earth/organization_info");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("Could not connect to the server");
        const result = await res.json();
        
        const data = result.data ? (Array.isArray(result.data) ? result.data[0] : result.data) : result;
        setInfo(data);
      } catch (err) {
        console.error("Failed to load About Us data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!info) return <div className="text-center py-20 text-slate-500">Organization information not found.</div>;

  return (
    <div className="min-h-screen bg-white text-left">
      {/* Hero */}
      <section className="relative h-[65vh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-40">
          <img 
            src={info.logo || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000"} 
            className="w-full h-full object-cover"
            alt="About Us Banner"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 uppercase tracking-tighter font-heading">
              {info.name}
            </h1>
            <p className="text-xl md:text-2xl text-emerald-50 font-light opacity-90 mb-8 max-w-2xl leading-relaxed">
              We are a global environmental organization working to protect the planet and promote peace.
            </p>
            <div className="flex gap-4">
              <button className="bg-gp-yellow hover:bg-yellow-500 text-black font-bold py-4 px-10 rounded-sm transition-all uppercase shadow-xl active:scale-95">
                Read our story
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-6 max-w-4xl">
          
          <div className="mb-12 border-l-4 border-gp-green pl-6">
            <span className="text-gp-green font-black uppercase tracking-[0.2em] text-sm">About our work</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2 italic">Inspiring change through action.</h2>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="prose prose-emerald max-w-none text-slate-600 leading-loose break-words overflow-hidden"
            style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: info.description }} 
          />
          
        </div>
      </section>

      {/* --- 3. FOOTER CTA SECTION --- */}
      <section className="bg-emerald-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Together, we can save the oceans.</h2>
          <Link to="/campaign" className="inline-block bg-emerald-600 text-white px-8 py-4 font-bold rounded-lg hover:bg-emerald-700 transition-colors uppercase">
            Join a campaign
          </Link>
        </div>
      </section>
    </div>
  );
}