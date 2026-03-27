// src/pages/NewsDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User, ArrowLeft, Loader2, Tag } from 'lucide-react';

export default function NewsDetail() {
  const { id } = useParams(); 
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        setLoading(true);
        // Lưu ý: Đảm bảo Spring Boot của bạn có API GET này
        const response = await axios.get(`http://localhost:8081/api/green_earth/article/${id}`);
        if (response.data && response.data.data) {
          setArticle(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi tải tin tức:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArticleDetail();
  }, [id]);

  // Hàm phụ trợ: Cắt lấy phần ngày tháng năm (YYYY-MM-DD)
  const formatDate = (dateString: string) => {
    if (!dateString) return "Đang cập nhật";
    return dateString.split('T')[0];
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
    </div>
  );

  if (!article) return <div className="text-center py-20 text-slate-500 bg-slate-50 min-h-screen">Không tìm thấy bài viết!</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-20 relative">
      
      {/* HEADER CHI TIẾT CỦA BÀI VIẾT */}
      <div className="bg-emerald-900 text-white pt-32 pb-16 px-4 relative overflow-hidden">
        {/* Nền ảnh mờ phía sau Header (Nâng cấp giao diện) */}
        {article.image && (
          <div className="absolute inset-0 opacity-10">
            <img src={article.image} alt="cover" className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/news" className="inline-flex items-center gap-2 text-emerald-300 hover:text-white mb-6 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" /> Quay lại Tin tức
          </Link>
          
          <div className="mb-4">
            <span className="bg-emerald-700 text-emerald-100 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 border border-emerald-600/50">
              <Tag className="w-3 h-3" /> {article.category || "Tin tức xanh"}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6">{article.title}</h1>
          
          <div className="flex flex-wrap gap-6 text-emerald-100 text-sm border-t border-emerald-800/50 pt-4 mt-4">
            {/* Tự động lấy các trường ngày tháng/tác giả tùy theo tên cột trong Database của bạn */}
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" /> 
              Ngày đăng: {formatDate(article.publishedAt || article.created_at || article.createdAt)}
            </span>
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" /> 
              Tác giả: {article.author || article.createdBy?.username || "Ban Biên Tập"}
            </span>
          </div>
        </div>
      </div>

      {/* KHUNG NỘI DUNG CHÍNH (REACT QUILL) */}
      <div className="max-w-4xl mx-auto px-4 mt-8 relative z-10 -mt-8">
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-8 md:p-14 mb-12">
          
          {/* Ảnh Cover phụ hiển thị đầu bài (nếu muốn) */}
          {article.image && (
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-[400px] object-cover rounded-2xl mb-10 shadow-sm"
            />
          )}

          {/* Biến HTML rác thành UI chuẩn - Đã gắn giáp chống tràn chữ */}
          <div 
            className="prose prose-emerald prose-lg max-w-none text-slate-700 leading-relaxed [&>p]:mb-5 break-words overflow-hidden w-full [&>img]:rounded-2xl [&>img]:shadow-md [&>img]:mx-auto [&>img]:my-8"
            dangerouslySetInnerHTML={{ __html: article.content || article.description }} 
          />
        </div>
      </div>
    </div>
  );
}