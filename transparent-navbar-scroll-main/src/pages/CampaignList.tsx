// src/pages/CampaignList.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Users, Loader2, Calendar } from 'lucide-react';

const stripHtmlTags = (htmlString: string) => {
  if (!htmlString) return '';
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  return doc.body.textContent || "";
};

const formatDate = (dateString: string) => {
  if (!dateString) return "TBD";
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [campRes, donRes] = await Promise.all([
          axios.get('http://localhost:8081/api/green_earth/campaign'),
          axios.get('http://localhost:8081/api/green_earth/donation')
        ]);
        
        if (campRes.data?.data) {
          setCampaigns(campRes.data.data);
        }

        if (donRes.data) {
          setDonations(donRes.data.data || donRes.data || []);
        }

      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen"> 
      <div className="bg-emerald-900 pt-36 pb-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-serif">
            Our Campaigns
          </h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-lg">
            Discover our environmental campaigns and take action for a greener future.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-12 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => {

            const totalRaised = donations
              .filter(d => Number(d.campaignId) === Number(campaign.id))
              .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

            const goal = Number(campaign.targetAmount) || 0;
            const progress = goal > 0 ? (totalRaised / goal) * 100 : 0;

            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const end = campaign.endDate ? new Date(campaign.endDate) : null;
            
            const isGoalReached = progress >= 100;
            const isExpired = end && now > end;
            
            const status = (isGoalReached || isExpired) ? 'COMPLETED' : 'ONGOING';

            return (
              <div key={campaign.id} className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                
                <div className="h-56 bg-slate-200 relative overflow-hidden">
                  <img 
                    src={campaign.image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80"} 
                    alt={campaign.title || "cover"} 
                    className={`w-full h-full object-cover transition-all duration-500 ${status === 'COMPLETED' ? 'grayscale opacity-75' : ''}`} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm border ${
                      status === 'COMPLETED' 
                        ? 'bg-blue-500 text-white border-blue-400' 
                        : 'bg-emerald-500 text-white border-emerald-400'
                    }`}>
                      {status}
                    </span>
                  </div>

                  <h2 className="absolute bottom-4 left-4 right-4 text-white font-bold text-xl leading-snug">
                    {campaign.title}
                  </h2>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className={`flex items-center gap-2 text-xs font-bold mb-3 ${isExpired ? 'text-red-500' : 'text-emerald-600'}`}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
                  </div>

                  <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-1">
                    {stripHtmlTags(campaign.description)}
                  </p>

                  <div className="mb-4">
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${status === 'COMPLETED' ? 'bg-blue-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-6 border-t border-slate-100 pt-4">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-red-500" /> 
                      {campaign.location || "Worldwide"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-500" /> 
                      {campaign.targetVolunteers || 0} Vols
                    </span>
                  </div>

                  <Link 
                    to={`/campaign/${campaign.id}`} 
                    className={`block w-full text-center border-2 rounded-full py-2.5 font-bold transition-colors ${
                      status === 'COMPLETED'
                      ? 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
                      : 'border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white'
                    }`}
                  >
                    {status === 'COMPLETED' ? 'VIEW RESULT' : 'VIEW DETAILS'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}