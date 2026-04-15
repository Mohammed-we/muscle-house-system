


"use client"
import React, { useState, useEffect } from 'react';
import { Trash2, MessageCircle, Plus, Search, Calendar, DollarSign, User, Phone, Activity, Users, CreditCard, Wallet } from 'lucide-react';

interface Member {
  id: number;
  name: string;
  phone: string;
  startDate: string;
  endDate: string;
  totalAmount: string; // السعر الإجمالي
  paidAmount: string;  // المدفوع
}

export default function GymDashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', startDate: '', endDate: '', totalAmount: '', paidAmount: '' });

  useEffect(() => {
    const saved = localStorage.getItem('gym_pro_data');
    if (saved) setMembers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('gym_pro_data', JSON.stringify(members));
  }, [members]);

  const addMember = () => {
    if (!form.name || !form.phone || !form.endDate || !form.totalAmount) return;
    const newMember = { 
      ...form, 
      id: Date.now(), 
      startDate: form.startDate || new Date().toISOString().split('T')[0],
      paidAmount: form.paidAmount || "0" 
    };
    setMembers([newMember, ...members]);
    setForm({ name: '', phone: '', startDate: '', endDate: '', totalAmount: '', paidAmount: '' });
  };

  const deleteMember = (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا العضو؟")) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const getDaysLeft = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const filteredMembers = members.filter(m => 
    m.name.includes(searchTerm) || m.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#0f111a] text-slate-300 font-sans p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <span className="bg-blue-600 p-2 rounded-lg"><Activity className="text-white" /></span>
              MUSCLE HOUSE
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">نظام إدارة العضويات والمحاسبة والديون</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-[#161d2b] border border-slate-800 px-5 py-3 rounded-2xl flex items-center gap-3">
              <Users className="text-blue-500" size={20} />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">الأعضاء</p>
                <p className="text-xl font-bold text-white leading-none">{members.length}</p>
              </div>
            </div>
            <div className="bg-[#161d2b] border border-slate-800 px-5 py-3 rounded-2xl flex items-center gap-3">
              <CreditCard className="text-green-500" size={20} />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">إجمالي التحصيل</p>
                <p className="text-xl font-bold text-white leading-none">{members.reduce((acc, m) => acc + Number(m.paidAmount || 0), 0)} ₪</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Form Section */}
          <section className="lg:col-span-4">
            <div className="bg-[#161d2b] rounded-[2rem] p-8 border border-slate-800 shadow-2xl sticky top-8">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Plus className="text-blue-500" size={20} /> إضافة عضو جديد
              </h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 mr-1">الاسم الكامل</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input type="text" placeholder="اسم المشترك" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="modern-input" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 mr-1">رقم الواتساب</label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input type="text" placeholder="970..." value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} className="modern-input" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 mr-1">تاريخ البدء</label>
                    <input type="date" value={form.startDate} onChange={e=>setForm({...form, startDate:e.target.value})} className="modern-input px-4" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-blue-500 mr-1">تاريخ الانتهاء</label>
                    <input type="date" value={form.endDate} onChange={e=>setForm({...form, endDate:e.target.value})} className="modern-input px-4 border-blue-500/30" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 mr-1">سعر الاشتراك</label>
                    <input type="number" placeholder="الاجمالي" value={form.totalAmount} onChange={e=>setForm({...form, totalAmount:e.target.value})} className="modern-input px-4" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-green-500 mr-1">المبلغ المدفوع</label>
                    <input type="number" placeholder="المدفوع حالياً" value={form.paidAmount} onChange={e=>setForm({...form, paidAmount:e.target.value})} className="modern-input px-4 border-green-500/20" />
                  </div>
                </div>
                <button onClick={addMember} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 mt-4">
                  تأكيد وتسجيل
                </button>
              </div>
            </div>
          </section>

          {/* Table Section */}
          <section className="lg:col-span-8 space-y-6">
            <div className="relative group max-w-md">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="ابحث عن مشترك بالاسم أو الرقم..." 
                className="w-full bg-[#161d2b] border border-slate-800 rounded-2xl py-3 pr-12 pl-4 focus:ring-2 ring-blue-500/20 outline-none transition-all"
                onChange={(e)=>setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-[#161d2b] rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-800/20">
                      <th className="px-6 py-5 text-xs font-black uppercase text-slate-500">المشترك</th>
                      <th className="px-6 py-5 text-xs font-black uppercase text-slate-500">الحالة المالية</th>
                      <th className="px-6 py-5 text-xs font-black uppercase text-slate-500">تاريخ الانتهاء</th>
                      <th className="px-6 py-5 text-xs font-black uppercase text-slate-500 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredMembers.map(m => {
                      const daysLeft = getDaysLeft(m.endDate);
                      const isExpired = daysLeft <= 0;
                      const remaining = Number(m.totalAmount) - Number(m.paidAmount);
                      
                      return (
                        <tr key={m.id} className="hover:bg-slate-800/20 transition-colors group">
                          <td className="px-6 py-5 text-white font-bold">
                            <div className="flex flex-col">
                              <span>{m.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono tracking-wider">{m.phone}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            {remaining > 0 ? (
                              <div className="flex flex-col">
                                <span className="text-orange-500 text-xs font-black italic">متبقي: {remaining} ₪</span>
                                <span className="text-[10px] text-slate-500">من أصل {m.totalAmount} ₪</span>
                              </div>
                            ) : (
                              <span className="text-green-500 text-xs font-black flex items-center gap-1">
                                <Wallet size={12} /> خالص تماماً
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                <Calendar size={12} className="text-blue-500" /> {m.endDate}
                              </div>
                              {isExpired ? (
                                <span className="bg-red-500/10 text-red-500 text-[9px] font-black px-2 py-0.5 rounded-full border border-red-500/20 w-fit">منتهي</span>
                              ) : (
                                <span className="bg-blue-500/10 text-blue-500 text-[9px] font-black px-2 py-0.5 rounded-full border border-blue-500/20 w-fit italic">باقي {daysLeft} يوم</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => {
                                  const msg = remaining > 0 
                                    ? `كابتن ${m.name}، نذكرك بانتهاء اشتراكك بتاريخ ${m.endDate}. متبقي عليك مبلغ ${remaining} ₪. ننتظرك لتكمل التمرين!`
                                    : `كابتن ${m.name}، نذكرك بانتهاء اشتراكك بتاريخ ${m.endDate}. ننتظرك للتجديد والحفاظ على مستواك!`;
                                  window.open(`https://wa.me/${m.phone}?text=${encodeURIComponent(msg)}`)
                                }}
                                className="p-2 hover:bg-green-500/10 text-slate-500 hover:text-green-500 rounded-xl transition-all"
                              >
                                <MessageCircle size={18} />
                              </button>
                              <button 
                                onClick={() => deleteMember(m.id)}
                                className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-xl transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredMembers.length === 0 && (
                <div className="p-20 text-center text-slate-600 font-medium">لم يتم العثور على نتائج..</div>
              )}
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .modern-input {
          width: 100%;
          background: #0f111a;
          border: 1px solid #1e293b;
          border-radius: 1rem;
          padding: 0.75rem 2.75rem 0.75rem 1rem;
          outline: none;
          font-size: 0.875rem;
          color: white;
          transition: all 0.2s;
        }
        .modern-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}