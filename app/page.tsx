// "use client";
// import React, { useState, useEffect } from 'react';
// import { 
//   Trash2, Plus, Search, LayoutDashboard, History, Dumbbell, X, 
//   ArrowUpRight, Wallet, Calendar, User, Phone, CreditCard, Banknote, AlertCircle, Clock, MessageCircle
// } from 'lucide-react';
// import { db } from './lib/firebase'; 
// import { ref, set, onValue, remove, off } from "firebase/database";

// export default function MuscleHouseApp() {
//   const [members, setMembers] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('all'); // all, debt, expired
//   const [activeTab, setActiveTab] = useState('members');
//   const [isMounted, setIsMounted] = useState(false);
  
//   const [form, setForm] = useState({ 
//     name: '', phone: '', startDate: '', endDate: '', totalAmount: '', paidAmount: '' 
//   });

//   useEffect(() => {
//     setIsMounted(true);
//     const membersRef = ref(db, 'members');
//     onValue(membersRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const list = Object.keys(data).map(key => ({ ...data[key], id: key }));
//         setMembers(list.reverse());
//       } else { setMembers([]); }
//     });
//     return () => off(membersRef);
//   }, []);

//   // --- وظائف التنبيهات وإرسال الرسائل ---

//   const getDaysLeft = (endDate: string) => {
//     const diff = new Date(endDate).getTime() - new Date().getTime();
//     return Math.ceil(diff / (1000 * 60 * 60 * 24));
//   };

//   // 1. إرسال SMS عادية (تستخدم رصيد الكرت/الشريحة)
//   const sendDirectSMS = (m: any) => {
//     const message = `كابتن ${m.name}، نذكرك بتجديد اشتراكك في Muscle House قبل تاريخ ${m.endDate}. بانتظارك!`;
//     const smsUrl = `sms:${m.phone}?body=${encodeURIComponent(message)}`;
//     window.location.href = smsUrl;
//   };

//   // 2. إرسال رسالة WhatsApp (مجانية عبر الإنترنت)
//   const sendWhatsApp = (m: any) => {
//     const message = `مرحباً كابتن ${m.name} 🏋️‍♂️، نود تذكيرك بأن اشتراكك في Muscle House ينتهي بتاريخ ${m.endDate}. ننتظرك لتجديد نشاطك!`;
//     const waUrl = `https://wa.me/${m.phone}?text=${encodeURIComponent(message)}`;
//     window.open(waUrl, '_blank');
//   };

//   const saveToFirebase = async () => {
//     if (!form.name || !form.endDate || !form.totalAmount) {
//       return alert("⚠️ يرجى إدخال الاسم، المبلغ الإجمالي، وتاريخ الانتهاء");
//     }
//     const newId = Date.now().toString();
//     try {
//       await set(ref(db, `members/${newId}`), {
//         ...form,
//         id: newId,
//         startDate: form.startDate || new Date().toISOString().split('T')[0],
//         totalAmount: Number(form.totalAmount) || 0,
//         paidAmount: Number(form.paidAmount) || 0,
//       });
//       alert("✅ تم تسجيل المشترك بنجاح!");
//       setForm({ name: '', phone: '', startDate: '', endDate: '', totalAmount: '', paidAmount: '' });
//       setActiveTab('members');
//     } catch (e) { alert("❌ خطأ في الاتصال بقاعدة البيانات"); }
//   };

//   const filteredMembers = members.filter(m => {
//     const matchesSearch = m.name.includes(searchTerm);
//     const debt = Number(m.totalAmount) - Number(m.paidAmount);
//     const daysLeft = getDaysLeft(m.endDate);
//     if (filterType === 'debt') return matchesSearch && debt > 0;
//     if (filterType === 'expired') return matchesSearch && daysLeft <= 0;
//     return matchesSearch;
//   });

//   if (!isMounted) return null;

//   return (
//     <div className="min-h-screen bg-[#010204] text-white font-sans antialiased selection:bg-[#00FF88]/30" dir="rtl">
      
//       {/* المؤثرات الخلفية */}
//       <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
//         <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#00FF88]/10 blur-[150px] rounded-full animate-pulse" />
//       </div>

//       <header className="p-8 pb-6 border-b border-white/[0.03] backdrop-blur-md sticky top-0 z-50">
//         <div className="max-w-md mx-auto flex justify-between items-center">
//           <div className="flex items-center gap-4">
//             <div className="bg-gradient-to-br from-[#00FF88] to-[#00cc6d] p-2.5 rounded-2xl shadow-[0_0_20px_rgba(0,255,136,0.3)]">
//               <Dumbbell size={26} className="text-black" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-black tracking-tight leading-none italic uppercase">Muscle<span className="text-[#00FF88]">House</span></h1>
//               <p className="text-[9px] text-gray-500 font-bold tracking-[0.4em] uppercase mt-1">Management System</p>
//             </div>
//           </div>
//           <div className="text-left leading-none">
//             <span className="text-[#00FF88] text-2xl font-black">{members.length}</span>
//             <p className="text-[8px] text-gray-500 uppercase font-bold">Athletes</p>
//           </div>
//         </div>
//       </header>

//       <main className="px-6 max-w-md mx-auto py-10 pb-44">
        
//         {activeTab === 'members' && (
//           <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
//             {/* الفلاتر */}
//             <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
//               <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all whitespace-nowrap ${filterType === 'all' ? 'bg-[#00FF88] text-black shadow-[0_0_15px_rgba(0,255,136,0.4)]' : 'bg-white/5 text-gray-500'}`}>الكل</button>
//               <button onClick={() => setFilterType('debt')} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all whitespace-nowrap ${filterType === 'debt' ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-500'}`}>المديونين</button>
//               <button onClick={() => setFilterType('expired')} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all whitespace-nowrap ${filterType === 'expired' ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-500'}`}>المنتهية</button>
//             </div>

//             {/* البحث */}
//             <div className="relative mb-8">
//               <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
//               <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="ابحث عن بطل..." className="w-full bg-[#0a0c10] border border-white/5 p-4 pr-12 rounded-2xl focus:border-[#00FF88]/50 transition-all outline-none text-sm" />
//             </div>

//             {/* قائمة المشتركين */}
//             <div className="space-y-5">
//               {filteredMembers.map(m => {
//                 const debt = Number(m.totalAmount) - Number(m.paidAmount);
//                 const daysLeft = getDaysLeft(m.endDate);
//                 const isUrgent = daysLeft <= 3 && daysLeft > 0;
//                 const isExpired = daysLeft <= 0;

//                 return (
//                   <div key={m.id} className={`group bg-gradient-to-b from-[#0f1218] to-[#0a0c10] border rounded-[2.5rem] p-7 shadow-2xl relative overflow-hidden transition-all ${isExpired ? 'border-red-500/20 shadow-red-500/5' : 'border-white/[0.05]'}`}>
                    
//                     <div className="flex justify-between items-start relative z-10">
//                       <div>
//                         <h3 className="text-xl font-black mb-1">{m.name}</h3>
//                         <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider italic">
//                            <Phone size={10} className="text-[#00FF88]" /> {m.phone}
//                         </div>
//                       </div>
                      
//                       {/* أزرار التحكم السريع */}
//                       <div className="flex gap-2">
//                         <button onClick={() => sendWhatsApp(m)} className="p-2.5 bg-green-500/10 rounded-full text-green-500 hover:bg-green-500/20 transition-all" title="واتساب">
//                           <MessageCircle size={16} />
//                         </button>
//                         <button onClick={() => sendDirectSMS(m)} className="p-2.5 bg-blue-500/10 rounded-full text-blue-500 hover:bg-blue-500/20 transition-all" title="رسالة SMS">
//                           <Banknote size={16} />
//                         </button>
//                         <button onClick={() => confirm('حذف المشترك؟') && remove(ref(db, `members/${m.id}`))} className="p-2.5 bg-red-500/10 rounded-full text-red-500 hover:bg-red-500/20 transition-all">
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </div>

//                     <div className="mt-8 grid grid-cols-2 gap-4">
//                       <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 text-center">
//                         <p className="text-[9px] uppercase font-black text-gray-500 mb-1 tracking-tighter">المدفوع / الكلي</p>
//                         <p className="text-md font-mono text-white">{m.paidAmount} / {m.totalAmount}</p>
//                       </div>
//                       <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 text-center">
//                         <p className="text-[9px] uppercase font-black text-gray-500 mb-1">المتبقي</p>
//                         <p className={`text-lg font-mono font-black ${debt > 0 ? 'text-orange-500' : 'text-[#00FF88]'}`}>
//                           {debt > 0 ? `${debt} ₪` : 'خالص'}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="mt-6 pt-4 border-t border-white/[0.03] flex items-center justify-between">
//                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
//                           <Calendar size={12} className="text-[#00FF88]" />
//                           <span>تنتهي في: {m.endDate}</span>
//                        </div>
                       
//                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${isExpired ? 'bg-red-500/10 text-red-500 animate-pulse' : isUrgent ? 'bg-orange-500/10 text-orange-500' : 'bg-white/5 text-gray-500'}`}>
//                           <Clock size={10} />
//                           {isExpired ? 'الاشتراك منتهي' : `باقي ${daysLeft} يوم`}
//                        </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* تبويب الإحصائيات */}
//         {activeTab === 'history' && (
//            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8">
//              <div className="mb-10 text-center">
//                <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Club<br/>Insights<span className="text-[#00FF88]">.</span></h2>
//                <p className="text-gray-500 text-[10px] mt-2 uppercase tracking-[0.3em] font-bold">الأداء المالي العام</p>
//              </div>
//              <div className="grid grid-cols-1 gap-6">
//                 <div className="bg-gradient-to-br from-[#0f1218] to-[#07090d] border border-white/5 rounded-[2.5rem] p-8 text-center relative">
//                   <div className="flex justify-center items-center gap-3 mb-2 text-[#00FF88]">
//                     <Wallet size={20} />
//                     <span className="text-[10px] font-black uppercase tracking-widest text-white">إجمالي المحصل</span>
//                   </div>
//                   <p className="text-5xl font-mono font-black italic text-[#00FF88]">
//                     {members.reduce((acc, m) => acc + (Number(m.paidAmount) || 0), 0)}
//                     <span className="text-lg ml-2 not-italic text-gray-500 font-sans font-normal">₪</span>
//                   </p>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-[#0a0c10] border border-white/5 rounded-[2rem] p-6 text-center">
//                     <AlertCircle size={18} className="text-orange-500 mx-auto mb-2" />
//                     <p className="text-[8px] font-black text-gray-500 uppercase mb-1">الديون الخارجية</p>
//                     <p className="text-2xl font-mono font-black text-orange-500">{members.reduce((acc, m) => acc + (Number(m.totalAmount) - Number(m.paidAmount)), 0)} ₪</p>
//                   </div>
//                   <div className="bg-[#0a0c10] border border-white/5 rounded-[2rem] p-6 text-center">
//                     <CreditCard size={18} className="text-blue-500 mx-auto mb-2" />
//                     <p className="text-[8px] font-black text-gray-500 uppercase mb-1">إجمالي العقود</p>
//                     <p className="text-2xl font-mono font-black">{members.reduce((acc, m) => acc + (Number(m.totalAmount) || 0), 0)} ₪</p>
//                   </div>
//                 </div>
//              </div>
//            </div>
//         )}

//         {/* تبويب إضافة مشترك */}
//         {activeTab === 'add' && (
//           <div className="animate-in slide-in-from-top-4 duration-500">
//             <div className="mb-10">
//               <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">New<br/>Contract<span className="text-[#00FF88]">.</span></h2>
//               <div className="h-1 w-12 bg-[#00FF88] mt-4 rounded-full" />
//             </div>
//             <div className="space-y-6">
//               <div className="space-y-4">
//                 <div className="flex items-center gap-2 text-[10px] font-black text-[#00FF88] uppercase tracking-widest ml-2">
//                   <User size={14} /> المعلومات الأساسية
//                 </div>
//                 <input placeholder="الاسم الكامل" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-[#0a0c10] border border-white/5 p-5 rounded-2xl outline-none focus:border-[#00FF88]/30" />
//                 <input placeholder="رقم الموبايل" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-[#0a0c10] border border-white/5 p-5 rounded-2xl outline-none focus:border-[#00FF88]/30" />
//               </div>
//               <div className="space-y-4">
//                 <div className="flex items-center gap-2 text-[10px] font-black text-[#00FF88] uppercase tracking-widest ml-2">
//                   <CreditCard size={14} /> التفاصيل المالية (₪)
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <input type="number" placeholder="المبلغ الكلي" value={form.totalAmount} onChange={e => setForm({...form, totalAmount: e.target.value})} className="w-full bg-[#0a0c10] border border-white/5 p-5 rounded-2xl outline-none focus:border-[#00FF88]/30" />
//                   <input type="number" placeholder="المدفوع حالياً" value={form.paidAmount} onChange={e => setForm({...form, paidAmount: e.target.value})} className="w-full bg-[#0a0c10] border border-white/5 p-5 rounded-2xl outline-none focus:border-[#00FF88]/30" />
//                 </div>
//               </div>
//               <div className="space-y-4">
//                 <div className="flex items-center gap-2 text-[10px] font-black text-[#00FF88] uppercase tracking-widest ml-2">
//                   <Calendar size={14} /> نهاية الصلاحية
//                 </div>
//                 <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="w-full bg-[#0a0c10] border border-white/5 p-5 rounded-2xl outline-none text-white text-xs uppercase" />
//               </div>
//               <button onClick={saveToFirebase} className="w-full bg-[#00FF88] text-black py-6 rounded-3xl font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(0,255,136,0.15)] active:scale-[0.97] transition-all">
//                 اعتماد العقد
//               </button>
//             </div>
//           </div>
//         )}
//       </main>

//       {/* الشريط السفلي */}
//       <div className="fixed bottom-0 inset-x-0 p-6 flex justify-center z-50 pointer-events-none">
//         <nav className="bg-[#0a0c10]/90 backdrop-blur-2xl border border-white/10 p-2 rounded-[2.5rem] flex items-center gap-2 shadow-2xl pointer-events-auto">
//           <button onClick={() => setActiveTab('members')} className={`p-5 rounded-full transition-all duration-500 ${activeTab === 'members' ? 'bg-[#00FF88] text-black' : 'text-gray-500 hover:text-white'}`}>
//             <LayoutDashboard size={24} />
//           </button>
//           <button onClick={() => setActiveTab('add')} className={`p-5 rounded-full transition-all duration-500 ${activeTab === 'add' ? 'bg-[#00FF88] text-black scale-110' : 'text-gray-500 hover:text-white'}`}>
//             <Plus size={24} />
//           </button>
//           <button onClick={() => setActiveTab('history')} className={`p-5 rounded-full transition-all duration-500 ${activeTab === 'history' ? 'bg-[#00FF88] text-black' : 'text-gray-500 hover:text-white'}`}>
//             <History size={24} />
//           </button>
//         </nav>
//       </div>
//     </div>
//   );
// }


"use client";
import React, { useState, useEffect } from 'react';
import { 
  Trash2, Plus, Search, LayoutDashboard, History, Dumbbell, X, 
  ArrowUpRight, Wallet, Calendar, User, Phone, CreditCard, Banknote, AlertCircle, Clock, MessageCircle,
  Pencil 
} from 'lucide-react';
import { db } from './lib/firebase'; 
import { ref, set, onValue, remove, off } from "firebase/database";

export default function MuscleHouseApp() {
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); 
  const [activeTab, setActiveTab] = useState('members');
  const [isMounted, setIsMounted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [form, setForm] = useState({ 
    name: '', phone: '', startDate: '', endDate: '', totalAmount: '', paidAmount: '' 
  });

  useEffect(() => {
    setIsMounted(true);
    const membersRef = ref(db, 'members');
    onValue(membersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ ...data[key], id: key }));
        setMembers(list.reverse());
      } else { setMembers([]); }
    });
    return () => off(membersRef);
  }, []);

  const getDaysLeft = (endDate: string) => {
    const diff = new Date(endDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const sendDirectSMS = (m: any) => {
    const message = `كابتن ${m.name}، نذكرك بتجديد اشتراكك في Muscle House. يرجى التواصل مع الادارة، دمتم بخير.`;
    const smsUrl = `sms:${m.phone}?body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
  };

  const sendWhatsApp = (m: any) => {
    const message = `كابتن ${m.name} نذكرك بتجديد اشتراكك في نادي Muscle House دمتم بخير`;
    const waUrl = `https://wa.me/${m.phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const saveToFirebase = async () => {
    if (!form.name || !form.endDate || !form.totalAmount) {
      return alert("⚠️ يرجى إدخال الاسم، المبلغ الإجمالي، وتاريخ الانتهاء");
    }
    
    const targetId = editingId || Date.now().toString();
    
    try {
      await set(ref(db, `members/${targetId}`), {
        ...form,
        id: targetId,
        startDate: form.startDate || new Date().toISOString().split('T')[0],
        totalAmount: Number(form.totalAmount) || 0,
        paidAmount: Number(form.paidAmount) || 0,
      });
      alert(editingId ? "✅ تم تحديث بيانات البطل!" : "✅ تم تسجيل المشترك بنجاح!");
      setForm({ name: '', phone: '', startDate: '', endDate: '', totalAmount: '', paidAmount: '' });
      setEditingId(null);
      setActiveTab('members');
    } catch (e) { alert("❌ خطأ في الاتصال بقاعدة البيانات"); }
  };

  const startEditing = (m: any) => {
    setForm({
      name: m.name,
      phone: m.phone,
      startDate: m.startDate,
      endDate: m.endDate,
      totalAmount: m.totalAmount.toString(),
      paidAmount: m.paidAmount.toString(),
    });
    setEditingId(m.id);
    setActiveTab('add');
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.includes(searchTerm);
    const debt = Number(m.totalAmount) - Number(m.paidAmount);
    const daysLeft = getDaysLeft(m.endDate);
    if (filterType === 'debt') return matchesSearch && debt > 0;
    if (filterType === 'expired') return matchesSearch && daysLeft <= 0;
    return matchesSearch;
  });

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#010204] text-white font-sans antialiased selection:bg-[#00FF88]/30" dir="rtl">
      
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#00FF88]/10 blur-[150px] rounded-full animate-pulse" />
      </div>

      <header className="p-8 pb-6 border-b border-white/[0.03] backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-[#00FF88] to-[#00cc6d] p-2.5 rounded-2xl shadow-[0_0_20px_rgba(0,255,136,0.3)]">
              <Dumbbell size={26} className="text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight leading-none italic uppercase">Muscle<span className="text-[#00FF88]">House</span></h1>
              <p className="text-[9px] text-gray-500 font-bold tracking-[0.4em] uppercase mt-1">Management System</p>
            </div>
          </div>
          <div className="text-left leading-none">
            <span className="text-[#00FF88] text-2xl font-black">
              {members.filter(m => getDaysLeft(m.endDate) > 0).length}
            </span>
            <p className="text-[8px] text-gray-500 uppercase font-bold">Active Athletes</p>
          </div>
        </div>
      </header>

      <main className="px-6 max-w-md mx-auto py-10 pb-44">
        
        {activeTab === 'members' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
              <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all whitespace-nowrap ${filterType === 'all' ? 'bg-[#00FF88] text-black shadow-[0_0_15px_rgba(0,255,136,0.4)]' : 'bg-white/5 text-gray-500'}`}>الكل</button>
              <button onClick={() => setFilterType('debt')} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all whitespace-nowrap ${filterType === 'debt' ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-500'}`}>المديونين</button>
              <button onClick={() => setFilterType('expired')} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all whitespace-nowrap ${filterType === 'expired' ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-500'}`}>المنتهية</button>
            </div>

            <div className="relative mb-8">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="ابحث عن بطل..." className="w-full bg-[#0a0c10] border border-white/5 p-4 pr-12 rounded-2xl focus:border-[#00FF88]/50 transition-all outline-none text-sm" />
            </div>

            <div className="space-y-5">
              {filteredMembers.map(m => {
                const debt = Number(m.totalAmount) - Number(m.paidAmount);
                const daysLeft = getDaysLeft(m.endDate);
                const isUrgent = daysLeft <= 3 && daysLeft > 0;
                const isExpired = daysLeft <= 0;

                return (
                  <div key={m.id} className={`group bg-gradient-to-b from-[#0f1218] to-[#0a0c10] border rounded-[2.5rem] p-7 shadow-2xl relative overflow-hidden transition-all ${isExpired ? 'border-red-500/20 shadow-red-500/5' : 'border-white/[0.05]'}`}>
                    
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <h3 className="text-xl font-black mb-1">{m.name}</h3>
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider italic">
                           <Phone size={10} className="text-[#00FF88]" /> {m.phone}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button onClick={() => startEditing(m)} className="p-2.5 bg-[#00FF88]/10 rounded-full text-[#00FF88] hover:bg-[#00FF88]/20 transition-all" title="تعديل">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => sendWhatsApp(m)} className="p-2.5 bg-green-500/10 rounded-full text-green-500 hover:bg-green-500/20 transition-all" title="واتساب">
                          <MessageCircle size={16} />
                        </button>
                        <button onClick={() => sendDirectSMS(m)} className="p-2.5 bg-blue-500/10 rounded-full text-blue-500 hover:bg-blue-500/20 transition-all" title="رسالة SMS">
                          <Banknote size={16} />
                        </button>
                        <button onClick={() => confirm('حذف المشترك؟') && remove(ref(db, `members/${m.id}`))} className="p-2.5 bg-red-500/10 rounded-full text-red-500 hover:bg-red-500/20 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 text-center">
                        <p className="text-[9px] uppercase font-black text-gray-500 mb-1 tracking-tighter">المدفوع / الكلي</p>
                        <p className="text-md font-mono text-white">{m.paidAmount} / {m.totalAmount}</p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 text-center">
                        <p className="text-[9px] uppercase font-black text-gray-500 mb-1">المتبقي</p>
                        <p className={`text-lg font-mono font-black ${debt > 0 ? 'text-orange-500' : 'text-[#00FF88]'}`}>
                          {debt > 0 ? `${debt} ₪` : 'خالص'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/[0.03] flex items-center justify-between">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                          <Calendar size={12} className="text-[#00FF88]" />
                          <span>تنتهي في: {m.endDate}</span>
                       </div>
                       
                       <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${isExpired ? 'bg-red-500/10 text-red-500 animate-pulse' : isUrgent ? 'bg-orange-500/10 text-orange-500' : 'bg-white/5 text-gray-500'}`}>
                          <Clock size={10} />
                          {isExpired ? 'الاشتراك منتهي' : `باقي ${daysLeft} يوم`}
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8">
              <div className="mb-10 text-center">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Club<br/>Insights<span className="text-[#00FF88]">.</span></h2>
                <p className="text-gray-500 text-[10px] mt-2 uppercase tracking-[0.3em] font-bold">الأداء المالي العام</p>
              </div>
              <div className="grid grid-cols-1 gap-6">
                 <div className="bg-gradient-to-br from-[#0f1218] to-[#07090d] border border-white/5 rounded-[2.5rem] p-8 text-center relative">
                   <div className="flex justify-center items-center gap-3 mb-2 text-[#00FF88]">
                     <Wallet size={20} />
                     <span className="text-[10px] font-black uppercase tracking-widest text-white">إجمالي المحصل</span>
                   </div>
                   <p className="text-5xl font-mono font-black italic text-[#00FF88]">
                     {members.reduce((acc, m) => acc + (Number(m.paidAmount) || 0), 0)}
                     <span className="text-lg ml-2 not-italic text-gray-500 font-sans font-normal">₪</span>
                   </p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-[#0a0c10] border border-white/5 rounded-[2rem] p-6 text-center">
                     <AlertCircle size={18} className="text-orange-500 mx-auto mb-2" />
                     <p className="text-[8px] font-black text-gray-500 uppercase mb-1">الديون الخارجية</p>
                     <p className="text-2xl font-mono font-black text-orange-500">{members.reduce((acc, m) => acc + (Number(m.totalAmount) - Number(m.paidAmount)), 0)} ₪</p>
                   </div>
                   <div className="bg-[#0a0c10] border border-white/5 rounded-[2rem] p-6 text-center">
                     <CreditCard size={18} className="text-blue-500 mx-auto mb-2" />
                     <p className="text-[8px] font-black text-gray-500 uppercase mb-1">عقود نشطة</p>
                     <p className="text-2xl font-mono font-black">
                        {members.filter(m => getDaysLeft(m.endDate) > 0).reduce((acc, m) => acc + (Number(m.totalAmount) || 0), 0)} ₪
                     </p>
                   </div>
                 </div>
              </div>
            </div>
        )}

        {activeTab === 'add' && (
          <div className="animate-in slide-in-from-top-4 duration-500">
            <div className="mb-10">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
                {editingId ? 'Edit' : 'New'}<br/>Contract<span className="text-[#00FF88]">.</span>
              </h2>
              <div className="h-1 w-12 bg-[#00FF88] mt-4 rounded-full" />
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-[#00FF88] uppercase tracking-widest ml-2">
                  <User size={14} /> المعلومات الأساسية
                </div>
                <input placeholder="الاسم الكامل" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-[#0a0c10] border border-white/5 p-5 rounded-2xl outline-none focus:border-[#00FF88]/30" />
                <input placeholder="رقم الموبايل" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-[#0a0c10] border border-white/5 p-5 rounded-2xl outline-none focus:border-[#00FF88]/30" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-[#00FF88] uppercase tracking-widest ml-2">
                  <CreditCard size={14} /> التفاصيل المالية (₪)
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="المبلغ الكلي" value={form.totalAmount} onChange={e => setForm({...form, totalAmount: e.target.value})} className="w-full bg-[#0a0c10] border border-white/5 p-5 rounded-2xl outline-none focus:border-[#00FF88]/30" />
                  <input type="number" placeholder="المدفوع حالياً" value={form.paidAmount} onChange={e => setForm({...form, paidAmount: e.target.value})} className="w-full bg-[#0a0c10] border border-white/5 p-5 rounded-2xl outline-none focus:border-[#00FF88]/30" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-[#00FF88] uppercase tracking-widest ml-2">
                  <Calendar size={14} /> نهاية الصلاحية
                </div>
                <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="w-full bg-[#0a0c10] border border-white/5 p-5 rounded-2xl outline-none text-white text-xs uppercase" />
              </div>
              <button onClick={saveToFirebase} className="w-full bg-[#00FF88] text-black py-6 rounded-3xl font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(0,255,136,0.15)] active:scale-[0.97] transition-all">
                {editingId ? 'تحديث بيانات العقد' : 'اعتماد العقد الجديد'}
              </button>
              {editingId && (
                <button onClick={() => {setEditingId(null); setForm({ name: '', phone: '', startDate: '', endDate: '', totalAmount: '', paidAmount: '' }); setActiveTab('members');}} className="w-full text-gray-500 text-[10px] font-black uppercase tracking-widest">إلغاء التعديل</button>
              )}
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 inset-x-0 p-6 flex justify-center z-50 pointer-events-none">
        <nav className="bg-[#0a0c10]/90 backdrop-blur-2xl border border-white/10 p-2 rounded-[2.5rem] flex items-center gap-2 shadow-2xl pointer-events-auto">
          <button onClick={() => {setEditingId(null); setActiveTab('members');}} className={`p-5 rounded-full transition-all duration-500 ${activeTab === 'members' ? 'bg-[#00FF88] text-black' : 'text-gray-500 hover:text-white'}`}>
            <LayoutDashboard size={24} />
          </button>
          <button onClick={() => setActiveTab('add')} className={`p-5 rounded-full transition-all duration-500 ${activeTab === 'add' ? 'bg-[#00FF88] text-black scale-110' : 'text-gray-500 hover:text-white'}`}>
            <Plus size={24} />
          </button>
          <button onClick={() => setActiveTab('history')} className={`p-5 rounded-full transition-all duration-500 ${activeTab === 'history' ? 'bg-[#00FF88] text-black' : 'text-gray-500 hover:text-white'}`}>
            <History size={24} />
          </button>
        </nav>
      </div>
    </div>
  );
}