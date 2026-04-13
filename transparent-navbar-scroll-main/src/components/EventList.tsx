import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from "@/lib/apiBase";
import { Calendar, MapPin, Loader2, AlertCircle } from 'lucide-react';

interface EventListProps {
  campaignId: number;
  /** Notifies parent (CampaignDetail) which event the user chose to register for */
  onRegisterClick: (event: any) => void; 
}

export default function EventList({ campaignId, onRegisterClick }: EventListProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(apiUrl(`/api/green_earth/event/campaign/${campaignId}`));
        
        if (response.data && response.data.data) {
          setEvents(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchEvents();
    }
  }, [campaignId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-slate-100 shadow-sm text-center flex flex-col items-center">
        <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
        <p className="text-slate-500 font-medium">There are no events for this campaign yet.</p>
        <p className="text-slate-400 text-sm mt-1">Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((ev) => (
        <div 
          key={ev.id} 
          className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-center hover:border-emerald-300 hover:shadow-md transition-all duration-300"
        >
          <div className="w-full md:w-auto flex-1">
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
              {ev.status === 'UPCOMING' ? 'Upcoming' : 'Registration open'}
            </span>
            <h3 className="text-xl font-bold text-slate-800">{ev.name || ev.title}</h3>
            
            <div className="mt-3 space-y-1.5">
              <p className="text-slate-500 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" /> 
                {ev.startDate} {ev.time && `• ${ev.time}`}
              </p>
              {ev.location && (
                <p className="text-slate-500 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" /> {ev.location}
                </p>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => onRegisterClick(ev)}
            className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-700 w-full md:w-auto transition-colors shadow-lg shadow-emerald-200 active:scale-95"
          >
            Join now
          </button>
        </div>
      ))}
    </div>
  );
}