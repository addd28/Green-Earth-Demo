// src/pages/CampaignList.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MapPin, Users, Loader2, Search } from "lucide-react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { unwrapListData } from "@/lib/unwrapListData";

const stripHtmlTags = (htmlString: string) => {
  if (!htmlString) return "";
  const doc = new DOMParser().parseFromString(htmlString, "text/html");
  return doc.body.textContent || "";
};

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 400);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ page: "0", size: "100" });
        if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
        const response = await axios.get(`/api/green_earth/campaign?${params}`);
        setCampaigns(unwrapListData(response.data?.data));
      } catch (err) {
        console.error("Failed to load campaigns", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [debouncedQuery]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-emerald-900 pt-36 pb-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-serif">
            Our Campaigns
          </h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-lg mb-8">
            Discover our environmental campaigns and take action for a greener future.
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-700/70" />
            <input
              type="search"
              placeholder="Search by name, description, location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-emerald-100/30 bg-white/95 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-300 outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-12 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="h-56 bg-slate-200 relative overflow-hidden">
                <img
                  src={
                    campaign.image ||
                    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80"
                  }
                  alt={campaign.title || "cover"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h2 className="absolute bottom-4 left-4 right-4 text-white font-bold text-xl leading-snug">
                  {campaign.title}
                </h2>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-1">
                  {stripHtmlTags(campaign.description)}
                </p>

                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-6 border-t border-slate-100 pt-4">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-500" /> {campaign.location || "Worldwide"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-500" /> {campaign.targetVolunteers || 0} Vols
                  </span>
                </div>

                <Link
                  to={`/campaign/${campaign.id}`}
                  className="block w-full text-center border-2 border-emerald-600 text-emerald-700 rounded-full py-2.5 font-bold hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  VIEW DETAILS
                </Link>
              </div>
            </div>
          ))}
        </div>
        {campaigns.length === 0 && (
          <p className="text-center text-slate-500 py-12">No matching campaigns found.</p>
        )}
      </div>
    </div>
  );
}
