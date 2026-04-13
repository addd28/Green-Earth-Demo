// src/pages/CampaignDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from "@/lib/apiBase";
import { Calendar, MapPin, Users, ArrowLeft, Loader2, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function CampaignDetail() {
  const { id } = useParams(); 
  const [campaign, setCampaign] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const campRes = await axios.get(apiUrl(`/api/green_earth/campaign/${id}`));
        if (campRes.data && campRes.data.data) {
          setCampaign(campRes.data.data);
        }

        const eventRes = await axios.get(apiUrl(`/api/green_earth/event/campaign/${id}`));
        if (eventRes.data && eventRes.data.data) {
          setEvents(eventRes.data.data);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleRegisterEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setSelectedEvent(null); 
      }, 2000);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "TBA";
    return dateString.split('T')[0];
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
    </div>
  );

  if (!campaign) return <div className="text-center py-20">Campaign not found.</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-20 relative">
      
      <div className="bg-emerald-900 text-white pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/campaign" className="inline-flex items-center gap-2 text-emerald-300 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to list
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6">{campaign.title}</h1>
          <div className="flex flex-wrap gap-6 text-emerald-100">
            <span className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {campaign.location}</span>
            <span className="flex items-center gap-2"><Users className="w-5 h-5" /> Needs {campaign.targetVolunteers} volunteers</span>
            <span className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Deadline: {formatDate(campaign.endDate)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b pb-4">Campaign story</h2>
          <div 
            className="prose prose-emerald max-w-none text-slate-700 leading-relaxed [&>p]:mb-4 break-words overflow-hidden w-full"
            dangerouslySetInnerHTML={{ __html: campaign.description }} 
          />
        </div>

        <div>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-3xl font-bold text-slate-900">Upcoming events</h2>
            <p className="text-slate-500 text-sm hidden md:block">Register to join us!</p>
          </div>

          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((ev) => (
                <div key={ev.id} className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-center hover:border-emerald-300 transition-colors">
                  <div>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                      Open registration
                    </span>
                    <h3 className="text-xl font-bold text-slate-800">{ev.title}</h3>
                    
                    <p className="text-slate-500 mt-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" /> {formatDate(ev.eventDate || ev.event_date)}
                    </p>
                    {ev.location && (
                      <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600" /> {ev.location}
                      </p>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => setSelectedEvent(ev)}
                    className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-700 w-full md:w-auto transition-colors shadow-lg shadow-emerald-200"
                  >
                    Join now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 border border-slate-100 text-center flex flex-col items-center">
              <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">There are no events for this campaign yet.</p>
            </div>
          )}
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => !isSubmitting && setSelectedEvent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
            >
              <X className="w-6 h-6" />
            </button>

            {submitSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Registration successful!</h3>
                <p className="text-slate-500">Thank you for signing up for &quot;{selectedEvent.title}&quot;. We will be in touch soon.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Event registration</h3>
                <p className="text-slate-500 text-sm mb-6">Event: <strong className="text-emerald-700">{selectedEvent.title}</strong></p>
                
                <form onSubmit={handleRegisterEvent} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Full name</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                    <input type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Email address" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                    <input type="tel" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Phone number" />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition-colors mt-4 flex justify-center items-center"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm registration'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
