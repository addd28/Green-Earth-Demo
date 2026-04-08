// src/pages/News.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';

const stripHtmlTags = (htmlString: string) => {
  if (!htmlString) return '';
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  return doc.body.textContent || "";
};

export default function News() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);       
        const response = await axios.get('http://localhost:8080/api/green_earth/article');
        if (response.data && response.data.data) {
          setArticles(response.data.data);
        }
        setLoading(false);
        

      } catch (err) {
        console.error("Lỗi tải tin tức", err);
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen"> 
      {/* 1. MẢNG NỀN TỐI (HERO HEADER) */}
      <div className="bg-emerald-900 pt-36 pb-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-serif">
            News & Stories
          </h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-lg">
            Stay updated with the latest environmental news, inspiring stories, and eco-friendly tips.
          </p>
        </div>
      </div>

      {/* 2. DANH SÁCH BÀI VIẾT (CARD GRID) */}
      <div className="max-w-6xl mx-auto px-4 -mt-12 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
              
              {/* Ảnh Cover & Nhãn Danh Mục */}
              <div className="h-56 bg-slate-200 relative overflow-hidden">
                <img 
                  src={article.image || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80"} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {article.category || "Tin tức"}
                </div>
              </div>

              {/* Nội dung bài viết */}
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-slate-800 mb-3 leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {article.title}
                </h2>
                
                <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-1">
                  {stripHtmlTags(article.description)}
                </p>

                {/* Footer Card: Ngày tháng & Tác giả */}
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-6 border-t border-slate-100 pt-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-500" /> 
                    {article.publishedAt}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-500" /> 
                    {article.author}
                  </span>
                </div>

                {/* Nút bấm Đọc tiếp có mũi tên hiệu ứng */}
                <Link 
                  to={`/news/${article.id}`} 
                  className="flex items-center justify-center gap-2 w-full text-center bg-emerald-50 text-emerald-700 rounded-xl py-3 font-bold hover:bg-emerald-600 hover:text-white transition-all group/btn"
                >
                  ĐỌC TIẾP
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}