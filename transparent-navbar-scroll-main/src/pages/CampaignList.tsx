// src/pages/CampaignList.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Users, Loader2, Calendar, Target } from 'lucide-react';

const API_URL = "http://localhost:8080/api/green_earth/campaign";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        // Dựa trên ảnh Postman, lấy data từ response.data.data
        if (response.data && response.data.data) {
          setCampaigns(response.data.data);
        }
      } catch (err) {
        console.error("Error loading campaigns", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen"> 
      {/* HERO HEADER */}
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

      {/* DANH SÁCH CARD */}
      <div className="max-w-6xl mx-auto px-4 -mt-12 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => {
            // Lấy dữ liệu trực tiếp từ API (theo đúng tên field trong ảnh Postman)
            const raised = campaign.raisedAmount || 0;
            const goal = campaign.targetAmount || 0;
            const progress = campaign.progressPercentage || 0;

            return (
              <div key={campaign.id} className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                
                <div className="h-56 bg-slate-200 relative overflow-hidden">
                  <img 
                    src={campaign.image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80"} 
                    alt={campaign.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h2 className="absolute bottom-4 left-4 right-4 text-white font-bold text-xl leading-snug">
                    {campaign.title}
                  </h2>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1">
                    {stripHtmlTags(campaign.description)}
                  </p>

                  {/* THANH TIẾN ĐỘ (PROGRESS BAR) */}
                  <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Raised</span>
                        <span className="text-sm font-bold text-emerald-600">${raised.toLocaleString()}</span>
                      </div>
                      <div className="text-right flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Goal</span>
                        <span className="text-sm font-bold text-slate-700">${goal.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-right mt-1.5">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">
                        {progress}% achieved
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-6 border-t border-slate-100 pt-4">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-red-500" /> {campaign.location || "Hanoi"}</span>
                    <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-blue-500" /> {campaign.status || "ONGOING"}</span>
                  </div>

                  <Link 
                    to={`/campaign/${campaign.id}`} 
                    className="block w-full text-center border-2 border-emerald-600 text-emerald-700 rounded-full py-2.5 font-bold hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    VIEW DETAILS
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