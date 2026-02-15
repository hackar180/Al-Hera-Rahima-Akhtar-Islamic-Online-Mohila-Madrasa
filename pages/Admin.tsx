
import React, { useState, useRef } from 'react';
import { Product } from '../types';

interface AdminProps {
  products: Product[];
  onAdd: (product: Omit<Product, 'id'>) => void;
  onUpdate: (product: Product) => void;
  onDelete: (id: string) => void;
}

const Admin: React.FC<AdminProps> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const ADMIN_PASSWORD = 'kuyasa.com';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    mrp: '',
    dp: '',
    pv: '',
    image: '',
    category: 'General'
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      alert('ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('ছবিটি ২ মেগাবাইটের চেয়ে ছোট হতে হবে।');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mrp) {
      alert('দয়া করে পণ্যের নাম এবং সঠিক দাম দিন।');
      return;
    }

    const submissionData: Omit<Product, 'id'> = {
      name: formData.name,
      description: formData.description,
      quantity: formData.quantity,
      mrp: Number(formData.mrp) || 0,
      dp: Number(formData.dp) || 0,
      pv: Number(formData.pv) || 0,
      image: formData.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecee?auto=format&fit=crop&q=80&w=400',
      category: formData.category
    };

    if (editingId) {
      onUpdate({ ...submissionData, id: editingId });
      setEditingId(null);
    } else {
      onAdd(submissionData);
    }

    setFormData({
      name: '',
      description: '',
      quantity: '',
      mrp: '',
      dp: '',
      pv: '',
      image: '',
      category: 'General'
    });
    
    if (fileInputRef.current) fileInputRef.current.value = '';
    alert('পণ্যটি সফলভাবে সংরক্ষণ করা হয়েছে!');
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      quantity: product.quantity,
      mrp: product.mrp.toString(),
      dp: product.dp.toString(),
      pv: product.pv.toString(),
      image: product.image,
      category: product.category
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      quantity: '',
      mrp: '',
      dp: '',
      pv: '',
      image: '',
      category: 'General'
    });
  };

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-green-50 w-full max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">অ্যাডমিন লগইন</h2>
          <p className="text-gray-500 mb-8 font-medium">পণ্য ম্যানেজ করতে পাসওয়ার্ড দিন</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পাসওয়ার্ড লিখুন"
                className={`w-full bg-gray-50 border-2 ${loginError ? 'border-red-300' : 'border-transparent'} focus:border-green-500 focus:bg-white p-4 pr-12 rounded-2xl outline-none transition-all font-bold text-gray-900 text-center text-lg`}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.882 9.882L5.99 5.99m10.119 10.119l3.9 3.9" />
                  </svg>
                )}
              </button>
            </div>
            <button 
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-green-200 active:scale-95"
            >
              প্রবেশ করুন
            </button>
          </form>
          <p className="mt-6 text-xs text-gray-400 font-bold uppercase tracking-widest">Security Powered by MXN</p>
        </div>
      </div>
    );
  }

  // Admin Panel View (Only visible after login)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24">
      {/* Form Section */}
      <div className="lg:col-span-5">
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-green-50 lg:sticky lg:top-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-800 flex items-center">
              <span className="w-2 h-6 bg-green-600 rounded-full mr-3"></span>
              {editingId ? 'পণ্য সংশোধন' : 'নতুন পণ্য যোগ'}
            </h2>
            <div className="flex space-x-2">
              {editingId && (
                <button onClick={cancelEdit} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1 rounded-full transition-colors">বাতিল</button>
              )}
              <button onClick={() => setIsAuthenticated(false)} className="text-xs font-bold text-gray-400 hover:text-red-500 px-3 py-1 rounded-full transition-colors">লগ আউট</button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">পণ্যের নাম *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white p-4 rounded-2xl outline-none transition-all font-bold text-gray-800" 
                  placeholder="যেমন: মাশরুম টুথপেস্ট"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">উপকারিতা ও বিবরণ</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white p-4 rounded-2xl outline-none transition-all font-medium text-gray-700" 
                  rows={3}
                  placeholder="এই পণ্যটির বিশেষত্ব লিখুন..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">পরিমাণ</label>
                  <input 
                    type="text" 
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 p-4 rounded-2xl outline-none font-bold text-gray-800" 
                    placeholder="১৫০ গ্রাম"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">ক্যাটাগরি</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 p-4 rounded-2xl outline-none font-bold text-gray-800 cursor-pointer"
                  >
                    <option value="Personal Care">Personal Care</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Food & Nutrition">Food & Nutrition</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-2xl border border-gray-100 p-2 shadow-sm">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1 text-center">MRP (৳)</label>
                  <input 
                    type="number" 
                    name="mrp"
                    value={formData.mrp}
                    onChange={handleInputChange}
                    className="w-full text-center p-2 rounded-xl outline-none font-black text-gray-900 bg-transparent text-lg" 
                    placeholder="0"
                    required
                  />
                </div>
                <div className="bg-green-50 rounded-2xl border border-green-100 p-2 shadow-sm">
                  <label className="block text-[10px] font-black text-green-500 uppercase tracking-tighter mb-1 text-center">DP (৳)</label>
                  <input 
                    type="number" 
                    name="dp"
                    value={formData.dp}
                    onChange={handleInputChange}
                    className="w-full text-center p-2 rounded-xl outline-none font-black text-green-700 bg-transparent text-lg" 
                    placeholder="0"
                  />
                </div>
                <div className="bg-blue-50 rounded-2xl border border-blue-100 p-2 shadow-sm">
                  <label className="block text-[10px] font-black text-blue-500 uppercase tracking-tighter mb-1 text-center">PV</label>
                  <input 
                    type="number" 
                    name="pv"
                    value={formData.pv}
                    onChange={handleInputChange}
                    className="w-full text-center p-2 rounded-xl outline-none font-black text-blue-700 bg-transparent text-lg" 
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">পণ্যের ছবি</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 p-8 rounded-3xl text-center cursor-pointer hover:border-green-400 hover:bg-green-50/20 transition-all group overflow-hidden"
                >
                  {formData.image ? (
                    <div className="space-y-3">
                      <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-2xl shadow-xl mx-auto border-4 border-white" />
                      <p className="text-xs font-bold text-green-600">ছবি পরিবর্তন করতে এখানে ক্লিক করুন</p>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 group-hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <p className="text-xs font-bold">ছবি সিলেক্ট করতে ক্লিক করুন</p>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className={`w-full text-white font-black py-5 rounded-[1.5rem] transition-all shadow-xl active:scale-95 text-lg ${editingId ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-100' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}`}
            >
              {editingId ? 'তথ্য আপডেট করুন' : 'নতুন পণ্য সেভ করুন'}
            </button>
          </form>
        </div>
      </div>

      {/* List Section */}
      <div className="lg:col-span-7">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 overflow-hidden">
          <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-800">পণ্য তালিকা</h2>
              <p className="text-sm text-gray-500 font-bold">মোট {products.length} টি পণ্য</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white text-gray-400 uppercase text-[10px] font-black tracking-widest">
                  <th className="py-6 px-8">পণ্য</th>
                  <th className="py-6 px-8 text-center">দাম ও পিভি</th>
                  <th className="py-6 px-8 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-green-50/30 transition-colors">
                    <td className="py-6 px-8">
                      <div className="flex items-center">
                        <img src={product.image} className="w-14 h-14 rounded-xl object-cover mr-4 shadow-md" alt={product.name} />
                        <div>
                          <p className="font-black text-gray-800 text-base">{product.name}</p>
                          <span className="text-[10px] font-black text-gray-400">{product.category} | {product.quantity}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-center">
                      <div className="space-y-0.5">
                        <div className="text-sm font-black text-gray-900">৳{product.mrp}</div>
                        <div className="text-[10px] font-black text-green-600">DP: ৳{product.dp}</div>
                        <div className="text-[10px] font-black text-blue-600">{product.pv} PV</div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => startEdit(product)} className="p-3 bg-gray-100 text-orange-500 hover:bg-orange-500 hover:text-white rounded-xl transition-all shadow-sm">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => onDelete(product.id)} className="p-3 bg-gray-100 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
