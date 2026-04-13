import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, ArrowLeft, Loader2, 
  CheckCircle2, Users, Info, Send 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { apiUrl } from "@/lib/apiBase";

const API_URL = apiUrl("/api/green_earth/event");

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [regData, setRegData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [statusMsg, setStatusMsg] = useState({ type: '', content: '' });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        const result = await response.json();
        setEvent(result.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg({ type: '', content: '' });

    try {
      const response = await fetch(apiUrl("/api/green_earth/event/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: id,
          ...regData
        })
      });

      if (response.ok) {
        setStatusMsg({ type: 'success', content: 'Successfully registered for the event!' });
        setRegData({ fullName: '', email: '', phone: '', message: '' });
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      setStatusMsg({ type: 'error', content: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-green-600" /></div>;
  if (!event) return <div className="text-center py-20 text-gray-500 font-medium pt-32">Event not found.</div>;

  // Status vs today (aligned with campaign pages)
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const eventDay = event.eventDate ? new Date(event.eventDate) : null;
  const isExpired = eventDay && now > eventDay;
  const status = isExpired ? 'COMPLETED' : 'UPCOMING';

  return (
    <div className="bg-slate-50 min-h-screen pb-20 text-left">
      
      {/* Hero */}
      <div className="bg-green-900 text-white pt-32 pb-24 px-4 relative overflow-hidden">
        {event.image && (
          <div className="absolute inset-0 opacity-20">
            <img 
              src={event.image} 
              alt="cover" 
              className={`w-full h-full object-cover transition-all duration-700 ${status === 'COMPLETED' ? 'grayscale opacity-50' : ''}`} 
            />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-transparent"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <Link to="/event" className="inline-flex items-center gap-2 text-green-300 hover:text-white mb-6 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" /> Back to Events
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight max-w-4xl">
              {event.title}
            </h1>
            <span className={`self-start md:self-auto px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${
              status === 'COMPLETED' ? 'bg-blue-500/80 text-white border-blue-400' : 'bg-green-500/80 text-white border-green-400'
            }`}>
              {status}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-6 text-green-50 border-t border-green-800/50 pt-5 mt-4">
            <span className="flex items-center gap-2 font-medium">
              <MapPin className="w-5 h-5 text-green-400" /> {event.location}
            </span>
            <span className={`flex items-center gap-2 font-medium ${isExpired ? 'text-red-300' : ''}`}>
              <Calendar className={`w-5 h-5 ${isExpired ? 'text-red-400' : 'text-green-400'}`} /> 
              {new Date(event.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT SECTION --- */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 -mt-10">
        
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-lg border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-4 flex items-center gap-2">
              <Info className="text-green-600 w-6 h-6" /> About this event
            </h2>
            
            <div className="mb-10 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <img src={event.image} alt="illustration" className={`w-full max-h-[400px] object-cover ${status === 'COMPLETED' ? 'grayscale opacity-80' : ''}`} />
            </div>

            <div 
              className="prose prose-green max-w-none text-slate-600 leading-loose break-words overflow-hidden" 
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: event.description }} 
            />
          </div>
        </div>

        {/* Registration sidebar */}
        <div className="relative">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-green-100 lg:sticky lg:top-24">
            <div className="text-center mb-8">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${status === 'COMPLETED' ? 'bg-blue-50' : 'bg-green-50'}`}>
                <Users className={`w-8 h-8 ${status === 'COMPLETED' ? 'text-blue-600' : 'text-green-600'}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Registration</h3>
              <p className="text-sm text-gray-500 mt-1">Join us in this activity</p>
            </div>

            {status === 'COMPLETED' ? (
              <div className="mt-2 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                </div>
                <p className="font-bold text-slate-700 uppercase tracking-widest text-sm mb-2">Event Closed</p>
                <p className="text-sm text-slate-500">
                  This event has already taken place. Thank you for your interest! ⏰
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" required placeholder="John Doe"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-slate-700"
                    value={regData.fullName}
                    onChange={e => setRegData({...regData, fullName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                  <input 
                    type="email" required placeholder="example@gmail.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-slate-700"
                    value={regData.email}
                    onChange={e => setRegData({...regData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone</label>
                  <input 
                    type="tel" required placeholder="090..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-slate-700"
                    value={regData.phone}
                    onChange={e => setRegData({...regData, phone: e.target.value})}
                  />
                </div>

                {statusMsg.content && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                      statusMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}
                  >
                    {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                    {statusMsg.content}
                  </motion.div>
                )}

                <button 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 active:scale-[0.98] transition-all shadow-xl shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-4 uppercase tracking-wider text-sm"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  Register Now
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}