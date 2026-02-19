
import React, { useState, useRef } from 'react';
import { Product } from '../types.ts';
import { isConfigured } from '../firebaseConfig.ts';

interface AdminProps {
  products: Product[];
  onAdd: (product: Omit<Product, 'id'>) => void;
  onUpdate: (product: Product) => void;
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
}

const Admin: React.FC<AdminProps> = ({ products, onAdd, onUpdate, onDelete, onDeleteAll }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
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
    } else {
      alert('ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড: kuyasa.com');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('নাম দিন');

    const productData: Omit<Product, 'id'> = {
      ...formData,
      mrp: Number(formData.mrp) || 0,
      dp: Number(formData.dp) || 0,
      pv: Number(formData.pv) || 0,
      image: formData.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecee?auto=format&fit=crop&q=80&w=400'
    };

    if (editingId) {
      onUpdate({ ...productData, id: editingId });
      setEditingId(null);
    } else {
      onAdd(productData);
    }

    setFormData({ name: '', description: '', quantity: '', mrp: '', dp: '', pv: '', image: '', category: 'General' });
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    if (isConfigured) {
      alert('সফল! পণ্যটি ডাটাবেসে সেভ হয়েছে এবং সবাই এখন এটি দেখতে পাবে।');
    } else {
      alert('সেভ হয়েছে (লোকাল)। সবাইকে দেখাতে firebaseConfig.ts ফাইলটি সেটআপ করুন।');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center">
          <h2 className="text-2xl font-black mb-6">অ্যাডমিন লগইন</h2>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="পাসওয়ার্ড দিন"
            className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 p-4 rounded-2xl outline-none font-bold text-center mb-4"
            required
          />
          <button type="submit" className="w-full bg-green-600 text-white font-black py-4 rounded-2xl shadow-lg">প্রবেশ করুন</button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24 px-2">
      <div className="lg:col-span-5">
        
        {/* ডাটাবেস স্ট্যাটাস ইন্ডিকেটর */}
        <div className={`p-4 rounded-2xl mb-6 flex items-center justify-between shadow-sm border ${isConfigured ? 'bg-green-100 border-green-200 text-green-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
          <div className="flex items-center">
             <div className={`w-3 h-3 rounded-full mr-3 animate-pulse ${isConfigured ? 'bg-green-500' : 'bg-red-500'}`}></div>
             <div>
               <h3 className="font-bold text-sm">{isConfigured ? 'ডাটাবেস লাইভ আছে' : 'ডাটাবেস কানেক্ট নেই'}</h3>
               <p className="text-[10px] opacity-80">{isConfigured ? 'আপনার চেঞ্জ সবাই দেখতে পাবে' : 'শুধুমাত্র আপনার ফোনে সেভ হচ্ছে'}</p>
             </div>
          </div>
          {!isConfigured && (
            <div className="text-[10px] font-black bg-white px-2 py-1 rounded">
               Config Missing
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-green-50">
          <h2 className="text-xl font-black mb-6 text-gray-800">{editingId ? 'পণ্য এডিট করুন' : 'নতুন পণ্য যোগ'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="পণ্যের নাম *" className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold" required />
            <div className="grid grid-cols-2 gap-3">
              <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold cursor-pointer">
                <option value="Personal Care">Personal Care</option>
                <option value="Medicine">Medicine</option>
                <option value="Hair Care">Hair Care</option>
                <option value="Nutrition">Nutrition</option>
                <option value="General">General</option>
              </select>
              <input type="text" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="পরিমাণ (যেমন: ১০০ গ্রাম)" className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold" />
            </div>
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="বিবরণ..." className="w-full bg-gray-50 p-4 rounded-2xl outline-none" rows={2} />
            <div className="grid grid-cols-3 gap-2">
              <input type="number" name="mrp" value={formData.mrp} onChange={handleInputChange} placeholder="MRP" className="bg-gray-50 p-3 rounded-xl text-center font-bold" />
              <input type="number" name="dp" value={formData.dp} onChange={handleInputChange} placeholder="DP" className="bg-green-50 p-3 rounded-xl text-center font-bold" />
              <input type="number" name="pv" value={formData.pv} onChange={handleInputChange} placeholder="PV" className="bg-blue-50 p-3 rounded-xl text-center font-bold" />
            </div>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 p-4 rounded-2xl text-center cursor-pointer hover:bg-green-50 transition-colors">
              {formData.image ? <img src={formData.image} className="w-16 h-16 object-cover rounded-xl mx-auto" /> : <p className="text-xs font-bold text-gray-400 uppercase">ছবি যোগ করুন</p>}
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            </div>
            <button type="submit" className={`w-full text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 ${editingId ? 'bg-orange-500' : 'bg-green-600 hover:bg-green-700'}`}>
              {editingId ? 'আপডেট করুন' : 'পণ্য সেভ করুন'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({name: '', description: '', quantity: '', mrp: '', dp: '', pv: '', image: '', category: 'General'}); }} className="w-full text-gray-500 font-bold py-2 text-xs">ক্যানসেল</button>
            )}
          </form>
        </div>
      </div>

      <div className="lg:col-span-7 mt-8 lg:mt-0">
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="font-black text-gray-800">পণ্য তালিকা</h2>
              <p className="text-xs text-gray-500 font-bold">মোট {products.length} টি পণ্য</p>
            </div>
            <div className="flex space-x-2">
               <button onClick={onDeleteAll} className="text-[10px] font-black bg-red-50 text-red-600 px-3 py-2 rounded-xl border border-red-100">সব মুছুন</button>
               <button onClick={() => setIsAuthenticated(false)} className="text-[10px] font-black bg-gray-200 text-gray-600 px-3 py-2 rounded-xl">লগ আউট</button>
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {products.map(p => (
              <div key={p.id} className="p-4 border-b border-gray-100 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <img src={p.image} className="w-12 h-12 rounded-xl object-cover mr-4 shadow-sm" />
                  <div>
                    <p className="font-black text-sm text-gray-800">{p.name}</p>
                    <p className="text-[10px] font-bold text-gray-400">MRP: ৳{p.mrp} | PV: {p.pv}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => { setEditingId(p.id); setFormData({...p, mrp: p.mrp.toString(), dp: p.dp.toString(), pv: p.pv.toString()}); window.scrollTo(0,0); }} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2.5"/></svg></button>
                  <button onClick={() => onDelete(p.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5"/></svg></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
