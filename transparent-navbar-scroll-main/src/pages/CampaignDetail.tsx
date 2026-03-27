// src/pages/CampaignDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Users, ArrowLeft, Loader2, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function CampaignDetail() {
  const { id } = useParams(); 
  const [campaign, setCampaign] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  // State cho Modal Đăng ký
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy chi tiết Chiến dịch
        const campRes = await axios.get(`http://localhost:8081/api/green_earth/campaign/${id}`);
        if (campRes.data && campRes.data.data) {
          setCampaign(campRes.data.data);
        }

        // Lấy danh sách Sự kiện

        const eventRes = await axios.get(`http://localhost:8081/api/green_earth/event/campaign/${id}`);
        console.log("=== API SỰ KIỆN TRẢ VỀ ===", eventRes.data); // THÊM DÒNG NÀY ĐỂ SOI DỮ LIỆU
        if (eventRes.data && eventRes.data.data) {
          setEvents(eventRes.data.data);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
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

  // Cắt bỏ phần giờ T00:00:00.000 từ chuỗi ngày tháng của event_date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Sắp thông báo";
    return dateString.split('T')[0];
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
    </div>
  );

  if (!campaign) return <div className="text-center py-20">Không tìm thấy chiến dịch!</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-20 relative">
      
      {/* HEADER CHI TIẾT */}
      <div className="bg-emerald-900 text-white pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/campaign" className="inline-flex items-center gap-2 text-emerald-300 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Quay lại danh sách
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6">{campaign.title}</h1>
          <div className="flex flex-wrap gap-6 text-emerald-100">
            <span className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {campaign.location}</span>
            <span className="flex items-center gap-2"><Users className="w-5 h-5" /> Cần {campaign.targetVolunteers} TNV</span>
            <span className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Hạn chót: {formatDate(campaign.endDate)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        
        {/* ĐÃ SỬA LỖI TRÀN CHỮ: Thêm "break-words overflow-hidden w-full" */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b pb-4">Câu chuyện chiến dịch</h2>
          <div 
            className="prose prose-emerald max-w-none text-slate-700 leading-relaxed [&>p]:mb-4 break-words overflow-hidden w-full"
            dangerouslySetInnerHTML={{ __html: campaign.description }} 
          />
        </div>

        {/* DANH SÁCH SỰ KIỆN */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-3xl font-bold text-slate-900">Sự kiện sắp tới</h2>
            <p className="text-slate-500 text-sm hidden md:block">Hãy đăng ký tham gia cùng chúng tôi!</p>
          </div>

          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((ev) => (
                <div key={ev.id} className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-center hover:border-emerald-300 transition-colors">
                  <div>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                      Mở đăng ký
                    </span>
                    {/* ĐÃ SỬA: Đổi ev.name thành ev.title theo đúng DB */}
                    <h3 className="text-xl font-bold text-slate-800">{ev.title}</h3>
                    
                    <p className="text-slate-500 mt-2 flex items-center gap-2">
                      {/* ĐÃ SỬA: Đổi ev.startDate thành ev.eventDate (hoặc ev.event_date) */}
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
                    Tham gia ngay
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 border border-slate-100 text-center flex flex-col items-center">
              <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">Hiện tại chưa có sự kiện nào cho chiến dịch này.</p>
            </div>
          )}
        </div>
      </div>

      {/* TUYẾN 3: MODAL ĐĂNG KÝ SỰ KIỆN */}
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
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Đăng ký thành công!</h3>
                <p className="text-slate-500">Cảm ơn bạn đã tham gia "{selectedEvent.title}". Chúng tôi sẽ liên hệ sớm nhất.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Đăng ký Sự kiện</h3>
                <p className="text-slate-500 text-sm mb-6">Sự kiện: <strong className="text-emerald-700">{selectedEvent.title}</strong></p>
                
                <form onSubmit={handleRegisterEvent} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Họ và tên</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Nhập tên của bạn" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                    <input type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Địa chỉ email" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Số điện thoại</label>
                    <input type="tel" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Nhập số điện thoại" />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition-colors mt-4 flex justify-center items-center"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Xác nhận Đăng ký'}
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