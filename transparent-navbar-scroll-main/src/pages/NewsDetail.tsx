// src/pages/NewsDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User, ArrowLeft, Loader2, Tag } from 'lucide-react';

export default function NewsDetail() {
  const { id } = useParams(); 
  const [article, setArticle] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]); // Thêm state lưu danh mục
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
<<<<<<< HEAD
        // Lưu ý: Đảm bảo Spring Boot của bạn có API GET này
        const response = await axios.get(`http://localhost:8080/api/green_earth/article/${id}`);
        if (response.data && response.data.data) {
          setArticle(response.data.data);
=======
        
        // 1. Lấy chi tiết bài viết
        const articleRes = await axios.get(`http://localhost:8081/api/green_earth/article/${id}`);
        if (articleRes.data && articleRes.data.data) {
          setArticle(articleRes.data.data);
>>>>>>> 264cbf38cc1f824654127ec94991447cbed84503
        }

        // 2. Lấy danh sách danh mục (Giống bên Admin để map tên)
        const categoryRes = await axios.get('http://localhost:8081/api/green_earth/article_categories');
        if (categoryRes.data && categoryRes.data.data) {
          setCategories(categoryRes.data.data);
        }

      } catch (error) {
        console.error("Error loading article detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // Hàm helper lấy tên danh mục dựa trên ID
  const getCategoryName = () => {
    if (!article) return "Green News";
    
    // Nếu API đã trả về sẵn object category.name
    if (article.category?.name) return article.category.name;
    
    // Nếu không, tìm trong danh sách categories vừa fetch về
    const found = categories.find(c => 
      c.id === article.categoryId || 
      c.id === article.category_id || 
      c.id === article.category?.id
    );
    
    return found ? found.name : "Environmental";
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "Updating...";
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? "Updating..." : date.toLocaleDateString('en-GB');
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
    </div>
  );

  if (!article) return <div className="text-center py-20 text-slate-500 bg-slate-50 min-h-screen">Article not found!</div>;

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
            <ArrowLeft className="w-5 h-5" /> Back to News
          </Link>
          
          <div className="mb-4">
            <span className="bg-emerald-700 text-emerald-100 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 border border-emerald-600/50">
              <Tag className="w-3 h-3" /> 
              {/* SỬA TẠI ĐÂY: Gọi hàm getCategoryName */}
              {getCategoryName()}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6">{article.title}</h1>
          
          <div className="flex flex-wrap gap-6 text-emerald-100 text-sm border-t border-emerald-800/50 pt-4 mt-4">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" /> 
              Published: {formatDate(article.createdAt || article.publishedAt)}
            </span>
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" /> 
              Author: {article.author?.username || article.authorName || "Editorial Team"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 relative z-10 -mt-8">
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 md:p-14 mb-12">
          {article.image && (
            <img src={article.image} alt={article.title} className="w-full h-[400px] object-cover rounded-2xl mb-10 shadow-sm" />
          )}
          <div 
            className="prose prose-emerald prose-lg max-w-none text-slate-700 leading-relaxed break-words w-full"
            dangerouslySetInnerHTML={{ __html: article.content || article.description }} 
          />
        </div>
      </div>
    </div>
  );
}