
import React, { useState, useRef } from 'react';
import { Product } from '../types.ts';

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
    alert('সেভ হয়েছে! (এটি আপনার ফোনে সেভ হলো। সবাইকে দেখানোর জন্য নিচের এক্সপোর্ট বাটন ব্যবহার করুন)');
  };

  const exportGlobalData = () => {
    const dataString = JSON.stringify(products, null, 2);
    navigator.clipboard.writeText(dataString);
    alert('পণ্যের ডাটা কপি করা হয়েছে! এখন এটি আমাকে পাঠিয়ে দিন যাতে আমি এটি সবার জন্য সেট করে দিতে পারি।');
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24">
      <div className="lg:col-span-5">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-green-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black">নতুন পণ্য যোগ</h2>
            <button 
              onClick={exportGlobalData}
              className="bg-blue-600 text-white text-[10px] font-black px-3 py-2 rounded-xl shadow-md active:scale-95"
            >
              সবাইকে দেখানোর কোড কপি করুন
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="পণ্যের নাম *" className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold" required />
            <div className="grid grid-cols-2 gap-3">
              <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold">
                <option value="Personal Care">Personal Care</option>
                <option value="Medicine">Medicine</option>
                <option value="Hair Care">Hair Care</option>
                <option value="Nutrition">Nutrition</option>
              </select>
              <input type="text" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="পরিমাণ (যেমন: ১০০ গ্রাম)" className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold" />
            </div>
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="বিবরণ..." className="w-full bg-gray-50 p-4 rounded-2xl outline-none" rows={2} />
            <div className="grid grid-cols-3 gap-2">
              <input type="number" name="mrp" value={formData.mrp} onChange={handleInputChange} placeholder="MRP" className="bg-gray-50 p-3 rounded-xl text-center font-bold" />
              <input type="number" name="dp" value={formData.dp} onChange={handleInputChange} placeholder="DP" className="bg-green-50 p-3 rounded-xl text-center font-bold" />
              <input type="number" name="pv" value={formData.pv} onChange={handleInputChange} placeholder="PV" className="bg-blue-50 p-3 rounded-xl text-center font-bold" />
            </div>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 p-4 rounded-2xl text-center cursor-pointer hover:bg-green-50">
              {formData.image ? <img src={formData.image} className="w-16 h-16 object-cover rounded-xl mx-auto" /> : <p className="text-xs font-bold text-gray-400 uppercase">ছবি যোগ করুন</p>}
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            </div>
            <button type="submit" className="w-full bg-green-600 text-white font-black py-4 rounded-2xl shadow-lg">পণ্য সেভ করুন</button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden">
          <div className="p-6 bg-gray-50 flex justify-between items-center">
            <h2 className="font-black">পণ্য তালিকা ({products.length})</h2>
            <button onClick={() => setIsAuthenticated(false)} className="text-xs font-bold text-red-500">লগ আউট</button>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {products.map(p => (
              <div key={p.id} className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <img src={p.image} className="w-10 h-10 rounded-lg object-cover mr-3" />
                  <div>
                    <p className="font-black text-sm">{p.name}</p>
                    <p className="text-[10px] text-gray-400">MRP: ৳{p.mrp}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => { setEditingId(p.id); setFormData({...p, mrp: p.mrp.toString(), dp: p.dp.toString(), pv: p.pv.toString()}); window.scrollTo(0,0); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2"/></svg></button>
                  <button onClick={() => onDelete(p.id)} className="p-2 bg-red-50 text-red-600 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2"/></svg></button>
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
