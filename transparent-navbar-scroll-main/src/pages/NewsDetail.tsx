// src/pages/NewsDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from "@/lib/apiBase";
import { Calendar, User, ArrowLeft, Loader2, Tag } from 'lucide-react';

export default function NewsDetail() {
  const { id } = useParams(); 
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(apiUrl(`/api/green_earth/article/${id}`));
        if (response.data && response.data.data) {
          setArticle(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load article:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArticleDetail();
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Coming soon";
    return dateString.split('T')[0];
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
    </div>
  );

  if (!article) return <div className="text-center py-20 text-slate-500 bg-slate-50 min-h-screen">Article not found.</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-20 relative">
      
      <div className="bg-emerald-900 text-white pt-32 pb-16 px-4 relative overflow-hidden">
        {article.image && (
          <div className="absolute inset-0 opacity-10">
            <img src={article.image} alt="cover" className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/news" className="inline-flex items-center gap-2 text-emerald-300 hover:text-white mb-6 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" /> Back to news
          </Link>
          
          <div className="mb-4">
            <span className="bg-emerald-700 text-emerald-100 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 border border-emerald-600/50">
              <Tag className="w-3 h-3" /> {article.categoryName || article.category || "News"}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6">{article.title}</h1>
          
          <div className="flex flex-wrap gap-6 text-emerald-100 text-sm border-t border-emerald-800/50 pt-4 mt-4">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" /> 
              Published: {formatDate(article.publishedAt || article.created_at || article.createdAt)}
            </span>
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" /> 
              Author: {article.author || article.createdBy?.username || "Editorial team"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 relative z-10 -mt-8">
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-8 md:p-14 mb-12">
          
          {article.image && (
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-[400px] object-cover rounded-2xl mb-10 shadow-sm"
            />
          )}

          <div 
            className="prose prose-emerald prose-lg max-w-none text-slate-700 leading-relaxed [&>p]:mb-5 break-words overflow-hidden w-full [&>img]:rounded-2xl [&>img]:shadow-md [&>img]:mx-auto [&>img]:my-8"
            dangerouslySetInnerHTML={{ __html: article.content || article.description }} 
          />
        </div>
      </div>
    </div>
  );
}
