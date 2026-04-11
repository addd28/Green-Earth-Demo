import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Loader2, Globe, ShieldCheck, HeartHandshake } from 'lucide-react';

const API_URL = "http://localhost:8081/api/green_earth/organization_info";

const Contact = () => {
  const [orgInfo, setOrgInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgInfo = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();
        setOrgInfo(result.data || result);
      } catch (error) {
        console.error("Error fetching organization info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgInfo();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-emerald-600" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-slate-900 py-24 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight uppercase">Get In Touch</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Have questions about our global campaigns or want to join our mission? 
            Reach out to the GreenEarth team today.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            
            {/* LEFT: INFO */}
            <div className="space-y-16">
              <div className="space-y-8">
                <h2 className="text-4xl font-black text-slate-900 border-l-8 border-emerald-500 pl-6 uppercase">Contact Information</h2>
                <div className="grid gap-8">
                  <div className="flex items-start gap-6 group">
                    <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                      <MapPin size={32} />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 uppercase tracking-widest text-xs mb-1">Headquarters</p>
                      <p className="text-slate-600 text-lg leading-relaxed">{orgInfo?.address || "123 Le Loi Street, District 1, Ho Chi Minh City"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 group">
                    <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                      <Mail size={32} />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 uppercase tracking-widest text-xs mb-1">Email Inquiry</p>
                      <p className="text-slate-600 text-lg">{orgInfo?.email || "contact@greenearth.org"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 group">
                    <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                      <Phone size={32} />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 uppercase tracking-widest text-xs mb-1">Hotline Support</p>
                      <p className="text-slate-600 text-lg">{orgInfo?.phone || "+84 123 456 789"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SOCIALS */}
              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Connect with our community</h3>
                <div className="flex gap-4">
                  <a href={orgInfo?.facebook ? `https://${orgInfo.facebook}` : "#"} target="_blank" rel="noreferrer" className="p-5 bg-slate-50 rounded-2xl text-slate-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><Facebook size={24} /></a>
                  <a href={orgInfo?.twitter ? `https://${orgInfo.twitter}` : "#"} target="_blank" rel="noreferrer" className="p-5 bg-slate-50 rounded-2xl text-slate-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><Twitter size={24} /></a>
                  <a href={orgInfo?.instagram ? `https://${orgInfo.instagram}` : "#"} target="_blank" rel="noreferrer" className="p-5 bg-slate-50 rounded-2xl text-slate-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><Instagram size={24} /></a>
                  <a href={orgInfo?.youtube ? `https://${orgInfo.youtube}` : "#"} target="_blank" rel="noreferrer" className="p-5 bg-slate-50 rounded-2xl text-slate-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><Youtube size={24} /></a>
                </div>
              </div>
            </div>

            {/* RIGHT: MAP & VALUES */}
            <div className="space-y-12">
              <div className="w-full h-[400px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.460232428399!2d106.69701461144957!3d10.776019389327663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f388916d63b%3A0xb5a3c10a469857d9!2zMTIzIEzDqiBM4bujaSwgQuG6v24gVGjDoG5oLCBRdeG6rW4gMSwgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1712820000000!5m2!1svi!2s" 
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" 
                ></iframe>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-8 bg-slate-900 text-white rounded-[2rem] space-y-3">
                  <div className="text-emerald-400"><ShieldCheck size={32} /></div>
                  <h4 className="font-bold text-lg">Transparency</h4>
                  <p className="text-slate-400 text-sm">We provide clear reports on how every donation is used.</p>
                </div>
                <div className="p-8 bg-emerald-600 text-white rounded-[2rem] space-y-3 shadow-xl shadow-emerald-100">
                  <div className="text-white"><HeartHandshake size={32} /></div>
                  <h4 className="font-bold text-lg">Solidarity</h4>
                  <p className="text-emerald-100 text-sm">Working together across borders for a greener future.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;