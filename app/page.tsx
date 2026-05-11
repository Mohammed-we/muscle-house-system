
// "use client";
// import React, { useState, useEffect } from 'react';
// import { 
//   Trash2, Plus, Search, LayoutDashboard, History, Dumbbell, 
//   Phone, Banknote, AlertCircle, MessageCircle, Pencil, Users, Wallet, RefreshCw, Calendar
// } from 'lucide-react';
// import { db } from './lib/firebase'; 
// import { ref, set, onValue, remove, off } from "firebase/database";

// export default function MuscleHouseApp() {
//   const [members, setMembers] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('all'); 
//   const [activeTab, setActiveTab] = useState('members');
//   const [isMounted, setIsMounted] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
  
//   const [form, setForm] = useState({ 
//     name: '', phone: '', startDate: '', endDate: '', totalAmount: '', paidAmount: '', renewalCount: 0 
//   });

//   useEffect(() => {
//     setIsMounted(true);
//     const membersRef = ref(db, 'members');
//     onValue(membersRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const list = Object.keys(data).map(key => ({ 
//           ...data[key], 
//           id: key,
//           startDate: data[key].startDate || new Date().toISOString().split('T')[0],
//           renewalCount: data[key].renewalCount || 0
//         }));
//         setMembers(list.reverse());
//       } else { setMembers([]); }
//     });
//     return () => off(membersRef);
//   }, []);

//   const getDaysInfo = (start: string, end: string) => {
//     const total = new Date(end).getTime() - new Date(start).getTime();
//     const elapsed = new Date().getTime() - new Date(start).getTime();
//     const remaining = new Date(end).getTime() - new Date().getTime();
//     const daysRemaining = Math.ceil(remaining / (1000 * 60 * 60 * 24));
//     const progress = Math.min(100, Math.max(0, (elapsed / total) * 100));
//     return { daysRemaining, progress, isExpired: daysRemaining <= 0, isUrgent: daysRemaining <= 5 };
//   };

//   // نص رسالة SMS
//   const sendDirectSMS = (m: any) => {
//     const message = `كابتن ${m.name}، نود تذكيرك بأن اشتراكك في Muscle House قارب على الانتهاء. يسعدنا استمرارك معنا!`;
//     window.location.href = `sms:${m.phone}?body=${encodeURIComponent(message)}`;
//   };

//   // نص رسالة واتساب
//   const sendWhatsApp = (m: any) => {
//     const message = `أهلاً كابتن ${m.name} 🏆، نذكرك بموعد تجديد اشتراكك في نادي Muscle House. بانتظار استمرارك معنا في حرق الدهون وبناء العضلات! 💪`;
//     window.open(`https://wa.me/${m.phone}?text=${encodeURIComponent(message)}`, '_blank');
//   };

//   const handleRenewal = (m: any) => {
//     const today = new Date().toISOString().split('T')[0];
//     const nextMonth = new Date();
//     nextMonth.setMonth(nextMonth.getMonth() + 1);
    
//     setForm({
//       name: m.name,
//       phone: m.phone,
//       startDate: today,
//       endDate: nextMonth.toISOString().split('T')[0],
//       totalAmount: m.totalAmount.toString(),
//       paidAmount: '0',
//       renewalCount: (m.renewalCount || 0) + 1
//     });
//     setEditingId(m.id);
//     setActiveTab('add');
//   };

//   const saveToFirebase = async () => {
//     if (!form.name || !form.endDate || !form.totalAmount) {
//       return alert("⚠️ يرجى إكمال البيانات الأساسية");
//     }
//     const targetId = editingId || Date.now().toString();
//     try {
//       await set(ref(db, `members/${targetId}`), {
//         ...form,
//         id: targetId,
//         totalAmount: Number(form.totalAmount) || 0,
//         paidAmount: Number(form.paidAmount) || 0,
//         renewalCount: Number(form.renewalCount) || 0
//       });
//       setForm({ name: '', phone: '', startDate: '', endDate: '', totalAmount: '', paidAmount: '', renewalCount: 0 });
//       setEditingId(null);
//       setActiveTab('members');
//     } catch (e) { alert("❌ خطأ في الاتصال"); }
//   };

//   const filteredMembers = members.filter(m => {
//     const matchesSearch = m.name?.toLowerCase().includes(searchTerm.toLowerCase());
//     const info = getDaysInfo(m.startDate, m.endDate);
//     if (filterType === 'debt') return matchesSearch && (Number(m.totalAmount) - Number(m.paidAmount) > 0);
//     if (filterType === 'expired') return matchesSearch && info.isExpired;
//     return matchesSearch;
//   });

//   if (!isMounted) return null;

//   return (
//     <div className="min-h-screen bg-[#050505] text-slate-200 font-sans antialiased" dir="rtl">
//       <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
//         <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#00FF88]/5 blur-[120px] rounded-full" />
//       </div>

//       <header className="p-6 sticky top-0 z-50 backdrop-blur-xl border-b border-white/5">
//         <div className="max-w-xl mx-auto flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-[#00FF88] rounded-xl flex items-center justify-center">
//               <Dumbbell size={22} className="text-black" />
//             </div>
//             <h1 className="text-xl font-black italic uppercase">Muscle<span className="text-[#00FF88]">House</span></h1>
//           </div>
//         </div>
//       </header>

//       <main className="px-6 max-w-xl mx-auto py-8 pb-32">
//         {activeTab === 'members' && (
//           <div className="space-y-6">
//             <div className="flex gap-2 p-1 bg-white/5 rounded-2xl">
//               {['all', 'debt', 'expired'].map((type) => (
//                 <button key={type} onClick={() => setFilterType(type)} className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold transition-all ${filterType === type ? 'bg-[#00FF88] text-black' : 'text-gray-400'}`}>
//                   {type === 'all' ? 'الكل' : type === 'debt' ? 'ديون' : 'منتهية'}
//                 </button>
//               ))}
//             </div>

//             <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="ابحث عن بطل..." className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none text-sm" />

//             <div className="grid gap-4">
//               {filteredMembers.map(m => {
//                 const info = getDaysInfo(m.startDate, m.endDate);
//                 const debt = Number(m.totalAmount) - Number(m.paidAmount);
//                 return (
//                   <div key={m.id} className="relative bg-gradient-to-br from-white/[0.07] to-transparent border border-white/10 rounded-[2rem] p-6">
//                     <div className="flex justify-between items-start mb-4">
//                       <div>
//                         <h3 className="text-lg font-bold text-white flex items-center gap-2">
//                           {m.name}
//                           {m.renewalCount > 0 && <span className="bg-[#00FF88]/20 text-[#00FF88] text-[8px] px-2 py-0.5 rounded-full">مجدد {m.renewalCount}</span>}
//                         </h3>
//                         <p className="text-[10px] text-gray-500 font-mono italic">{m.startDate} ← {m.endDate}</p>
//                       </div>
//                       <div className="flex gap-2">
//                          <button onClick={() => handleRenewal(m)} title="تجديد الاشتراك" className="p-2.5 bg-[#00FF88]/10 text-[#00FF88] rounded-xl hover:bg-[#00FF88]/20"><RefreshCw size={14} /></button>
//                          <button onClick={() => sendWhatsApp(m)} title="واتساب" className="p-2.5 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500/20"><MessageCircle size={14} /></button>
//                          <button onClick={() => sendDirectSMS(m)} title="رسالة SMS" className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500/20"><Banknote size={14} /></button>
//                          <button onClick={() => { setForm(m); setEditingId(m.id); setActiveTab('add'); }} className="p-2.5 bg-white/5 rounded-xl"><Pencil size={14} /></button>
//                          <button onClick={() => confirm('حذف؟') && remove(ref(db, `members/${m.id}`))} className="p-2.5 bg-white/5 rounded-xl text-red-500"><Trash2 size={14} /></button>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                       <div className={`p-3 rounded-xl border ${info.isUrgent ? 'border-red-500/20 bg-red-500/5' : 'border-white/5 bg-white/5'}`}>
//                         <p className="text-[8px] text-gray-500 uppercase font-black">الأيام</p>
//                         <p className={`text-xs font-bold ${info.isUrgent ? 'text-red-500' : 'text-[#00FF88]'}`}>{info.isExpired ? 'منتهي' : `متبقي ${info.daysRemaining}`}</p>
//                       </div>
//                       <div className={`p-3 rounded-xl border ${debt > 0 ? 'border-orange-500/20 bg-orange-500/5' : 'border-[#00FF88]/10 bg-[#00FF88]/5'}`}>
//                         <p className="text-[8px] text-gray-500 uppercase font-black">الحساب</p>
//                         <p className={`text-xs font-bold ${debt > 0 ? 'text-orange-500' : 'text-[#00FF88]'}`}>{debt > 0 ? `${debt} ₪` : 'خالص'}</p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {activeTab === 'add' && (
//           <div className="max-w-md mx-auto space-y-4 animate-in slide-in-from-bottom-4">
//             <h2 className="text-2xl font-black italic text-center uppercase">{editingId ? 'تحديث / تجديد' : 'عقد جديد'}</h2>
//             <input placeholder="الاسم" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none" />
//             <input placeholder="الهاتف" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none" />
//             <div className="grid grid-cols-2 gap-3">
//               <input type="number" placeholder="المبلغ الكلي" value={form.totalAmount} onChange={e => setForm({...form, totalAmount: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none" />
//               <input type="number" placeholder="المدفوع" value={form.paidAmount} onChange={e => setForm({...form, paidAmount: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none" />
//             </div>
//             <div className="grid grid-cols-2 gap-3 text-xs">
//               <div><label className="text-gray-500 block mb-1">البدء</label><input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none" /></div>
//               <div><label className="text-gray-500 block mb-1">الانتهاء</label><input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none" /></div>
//             </div>
//             <button onClick={saveToFirebase} className="w-full bg-[#00FF88] text-black py-4 rounded-2xl font-black uppercase shadow-lg">حفظ البيانات</button>
//           </div>
//         )}

//         {activeTab === 'history' && (
//           <div className="grid grid-cols-2 gap-4">
//             <div className="col-span-2 bg-gradient-to-br from-[#00FF88]/20 to-transparent border border-[#00FF88]/20 p-8 rounded-[2.5rem] text-center">
//                <p className="text-[10px] font-black uppercase text-[#00FF88] mb-2">أبطال نشطون الآن</p>
//                <p className="text-6xl font-black text-white">{members.filter(m => getDaysInfo(m.startDate, m.endDate).daysRemaining > 0).length}</p>
//             </div>
//             <div className="col-span-2 bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex items-center justify-between">
//                <div>
//                   <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">إجمالي عمليات التجديد</p>
//                   <p className="text-3xl font-black text-[#00FF88]">{members.reduce((acc, m) => acc + (m.renewalCount || 0), 0)} <span className="text-xs text-gray-500">مرة تجديد</span></p>
//                </div>
//                <RefreshCw size={30} className="text-white/10" />
//             </div>
//             <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] text-center">
//                <Wallet className="mx-auto text-[#00FF88] mb-2" size={20} />
//                <p className="text-xl font-black text-white">{members.reduce((acc, m) => acc + (Number(m.paidAmount) || 0), 0)} ₪</p>
//             </div>
//             <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] text-center">
//                <AlertCircle className="mx-auto text-orange-500 mb-2" size={20} />
//                <p className="text-xl font-black text-orange-500">{members.reduce((acc, m) => acc + (Number(m.totalAmount) - Number(m.paidAmount)), 0)} ₪</p>
//             </div>
//           </div>
//         )}
//       </main>

//       <div className="fixed bottom-6 inset-x-0 flex justify-center z-50 px-6">
//         <nav className="bg-white/5 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] flex items-center gap-2">
//           {[{ id: 'members', icon: LayoutDashboard }, { id: 'add', icon: Plus }, { id: 'history', icon: History }].map((tab) => (
//             <button key={tab.id} onClick={() => { setEditingId(null); setActiveTab(tab.id); }} className={`p-4 rounded-[1.5rem] transition-all ${activeTab === tab.id ? 'bg-[#00FF88] text-black shadow-lg shadow-[#00FF88]/20' : 'text-gray-500 hover:text-white'}`}>
//               <tab.icon size={22} />
//             </button>
//           ))}
//         </nav>
//       </div>
//     </div>
//   );
// }




"use client";
import React, { useState, useEffect } from 'react';
import { 
  Trash2, Plus, Search, LayoutDashboard, History, Dumbbell, 
  Phone, Banknote, AlertCircle, MessageCircle, Pencil, Users, Wallet, RefreshCw, Calendar
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
    name: '', phone: '', startDate: '', endDate: '', totalAmount: '', paidAmount: '', renewalCount: 0 
  });

  useEffect(() => {
    setIsMounted(true);
    const membersRef = ref(db, 'members');
    onValue(membersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ 
          ...data[key], 
          id: key,
          startDate: data[key].startDate || new Date().toISOString().split('T')[0],
          renewalCount: data[key].renewalCount || 0
        }));
        setMembers(list.reverse());
      } else { setMembers([]); }
    });
    return () => off(membersRef);
  }, []);

  const getDaysInfo = (start: string, end: string) => {
    const total = new Date(end).getTime() - new Date(start).getTime();
    const elapsed = new Date().getTime() - new Date(start).getTime();
    const remaining = new Date(end).getTime() - new Date().getTime();
    const daysRemaining = Math.ceil(remaining / (1000 * 60 * 60 * 24));
    const progress = Math.min(100, Math.max(0, (elapsed / total) * 100));
    return { daysRemaining, progress, isExpired: daysRemaining <= 0, isUrgent: daysRemaining <= 5 };
  };


// نص رسالة SMS المحدث حسب طلبك الأخير
  const sendDirectSMS = (m: any) => {
    const message = `كابتن ${m.name} نود تذكيرك بأن اشتراكك في نادي Muscle House قد انتهى، دمت بخير`;
    window.location.href = `sms:${m.phone}?body=${encodeURIComponent(message)}`;
  };

  // نص رسالة واتساب
  const sendWhatsApp = (m: any) => {
    const message = `أهلاً كابتن ${m.name} 🏆، نذكرك بموعد تجديد اشتراكك في نادي Muscle House. بانتظار استمرارك معنا في حرق الدهون وبناء العضلات! 💪`;
    window.open(`https://wa.me/${m.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleRenewal = (m: any) => {
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    setForm({
      name: m.name,
      phone: m.phone,
      startDate: today,
      endDate: nextMonth.toISOString().split('T')[0],
      totalAmount: m.totalAmount.toString(),
      paidAmount: '0',
      renewalCount: (m.renewalCount || 0) + 1
    });
    setEditingId(m.id);
    setActiveTab('add');
  };

  const saveToFirebase = async () => {
    if (!form.name || !form.endDate || !form.totalAmount) {
      return alert("⚠️ يرجى إكمال البيانات الأساسية");
    }
    const targetId = editingId || Date.now().toString();
    try {
      await set(ref(db, `members/${targetId}`), {
        ...form,
        id: targetId,
        totalAmount: Number(form.totalAmount) || 0,
        paidAmount: Number(form.paidAmount) || 0,
        renewalCount: Number(form.renewalCount) || 0
      });
      setForm({ name: '', phone: '', startDate: '', endDate: '', totalAmount: '', paidAmount: '', renewalCount: 0 });
      setEditingId(null);
      setActiveTab('members');
    } catch (e) { alert("❌ خطأ في الاتصال"); }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const info = getDaysInfo(m.startDate, m.endDate);
    if (filterType === 'debt') return matchesSearch && (Number(m.totalAmount) - Number(m.paidAmount) > 0);
    if (filterType === 'expired') return matchesSearch && info.isExpired;
    return matchesSearch;
  });

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans antialiased" dir="rtl">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#00FF88]/5 blur-[120px] rounded-full" />
      </div>

      <header className="p-6 sticky top-0 z-50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00FF88] rounded-xl flex items-center justify-center">
              <Dumbbell size={22} className="text-black" />
            </div>
            <h1 className="text-xl font-black italic uppercase">Muscle<span className="text-[#00FF88]">House</span></h1>
          </div>
        </div>
      </header>

      <main className="px-6 max-w-xl mx-auto py-8 pb-32">
        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex gap-2 p-1 bg-white/5 rounded-2xl">
              {['all', 'debt', 'expired'].map((type) => (
                <button key={type} onClick={() => setFilterType(type)} className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold transition-all ${filterType === type ? 'bg-[#00FF88] text-black' : 'text-gray-400'}`}>
                  {type === 'all' ? 'الكل' : type === 'debt' ? 'ديون' : 'منتهية'}
                </button>
              ))}
            </div>

            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="ابحث عن بطل..." className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none text-sm" />

            <div className="grid gap-4">
              {filteredMembers.map(m => {
                const info = getDaysInfo(m.startDate, m.endDate);
                const debt = Number(m.totalAmount) - Number(m.paidAmount);
                return (
                  <div key={m.id} className="relative bg-gradient-to-br from-white/[0.07] to-transparent border border-white/10 rounded-[2rem] p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          {m.name}
                          {m.renewalCount > 0 && <span className="bg-[#00FF88]/20 text-[#00FF88] text-[8px] px-2 py-0.5 rounded-full">مجدد {m.renewalCount}</span>}
                        </h3>
                        <p className="text-[10px] text-gray-500 font-mono italic">{m.startDate} ← {m.endDate}</p>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => handleRenewal(m)} title="تجديد الاشتراك" className="p-2.5 bg-[#00FF88]/10 text-[#00FF88] rounded-xl hover:bg-[#00FF88]/20"><RefreshCw size={14} /></button>
                         <button onClick={() => sendWhatsApp(m)} title="واتساب" className="p-2.5 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500/20"><MessageCircle size={14} /></button>
                         <button onClick={() => sendDirectSMS(m)} title="رسالة SMS" className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500/20"><Banknote size={14} /></button>
                         <button onClick={() => { setForm(m); setEditingId(m.id); setActiveTab('add'); }} className="p-2.5 bg-white/5 rounded-xl"><Pencil size={14} /></button>
                         <button onClick={() => confirm('حذف؟') && remove(ref(db, `members/${m.id}`))} className="p-2.5 bg-white/5 rounded-xl text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className={`p-3 rounded-xl border ${info.isUrgent ? 'border-red-500/20 bg-red-500/5' : 'border-white/5 bg-white/5'}`}>
                        <p className="text-[8px] text-gray-500 uppercase font-black">الأيام</p>
                        <p className={`text-xs font-bold ${info.isUrgent ? 'text-red-500' : 'text-[#00FF88]'}`}>{info.isExpired ? 'منتهي' : `متبقي ${info.daysRemaining}`}</p>
                      </div>
                      <div className={`p-3 rounded-xl border ${debt > 0 ? 'border-orange-500/20 bg-orange-500/5' : 'border-[#00FF88]/10 bg-[#00FF88]/5'}`}>
                        <p className="text-[8px] text-gray-500 uppercase font-black">الحساب</p>
                        <p className={`text-xs font-bold ${debt > 0 ? 'text-orange-500' : 'text-[#00FF88]'}`}>{debt > 0 ? `${debt} ₪` : 'خالص'}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="max-w-md mx-auto space-y-4 animate-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-black italic text-center uppercase">{editingId ? 'تحديث / تجديد' : 'عقد جديد'}</h2>
            <input placeholder="الاسم" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none" />
            <input placeholder="الهاتف" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none" />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="المبلغ الكلي" value={form.totalAmount} onChange={e => setForm({...form, totalAmount: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none" />
              <input type="number" placeholder="المدفوع" value={form.paidAmount} onChange={e => setForm({...form, paidAmount: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><label className="text-gray-500 block mb-1">البدء</label><input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none" /></div>
              <div><label className="text-gray-500 block mb-1">الانتهاء</label><input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none" /></div>
            </div>
            <button onClick={saveToFirebase} className="w-full bg-[#00FF88] text-black py-4 rounded-2xl font-black uppercase shadow-lg">حفظ البيانات</button>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 bg-gradient-to-br from-[#00FF88]/20 to-transparent border border-[#00FF88]/20 p-8 rounded-[2.5rem] text-center">
               <p className="text-[10px] font-black uppercase text-[#00FF88] mb-2">أبطال نشطون الآن</p>
               <p className="text-6xl font-black text-white">{members.filter(m => getDaysInfo(m.startDate, m.endDate).daysRemaining > 0).length}</p>
            </div>
            <div className="col-span-2 bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex items-center justify-between">
               <div>
                  <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">إجمالي عمليات التجديد</p>
                  <p className="text-3xl font-black text-[#00FF88]">{members.reduce((acc, m) => acc + (m.renewalCount || 0), 0)} <span className="text-xs text-gray-500">مرة تجديد</span></p>
               </div>
               <RefreshCw size={30} className="text-white/10" />
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] text-center">
               <Wallet className="mx-auto text-[#00FF88] mb-2" size={20} />
               <p className="text-xl font-black text-white">{members.reduce((acc, m) => acc + (Number(m.paidAmount) || 0), 0)} ₪</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] text-center">
               <AlertCircle className="mx-auto text-orange-500 mb-2" size={20} />
               <p className="text-xl font-black text-orange-500">{members.reduce((acc, m) => acc + (Number(m.totalAmount) - Number(m.paidAmount)), 0)} ₪</p>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-6 inset-x-0 flex justify-center z-50 px-6">
        <nav className="bg-white/5 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] flex items-center gap-2">
          {[{ id: 'members', icon: LayoutDashboard }, { id: 'add', icon: Plus }, { id: 'history', icon: History }].map((tab) => (
            <button key={tab.id} onClick={() => { setEditingId(null); setActiveTab(tab.id); }} className={`p-4 rounded-[1.5rem] transition-all ${activeTab === tab.id ? 'bg-[#00FF88] text-black shadow-lg shadow-[#00FF88]/20' : 'text-gray-500 hover:text-white'}`}>
              <tab.icon size={22} />
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}