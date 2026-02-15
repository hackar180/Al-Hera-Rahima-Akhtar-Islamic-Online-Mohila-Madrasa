
import React, { useState } from 'react';
import { CartItem } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  onSuccess: () => void;
  onCancel: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    payment: 'COD'
  });

  const totalPrice = cart.reduce((acc, item) => acc + (item.mrp * item.cartQuantity), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">অর্ডার তথ্য</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম</label>
              <input 
                type="text" required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ফোন নাম্বার</label>
              <input 
                type="tel" required
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ডেলিভারি ঠিকানা</label>
              <textarea 
                required
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" 
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">পেমেন্ট মেথড</label>
              <select 
                value={formData.payment}
                onChange={e => setFormData({...formData, payment: e.target.value})}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="COD">ক্যাশ অন ডেলিভারি (COD)</option>
                <option value="BKASH">বিকাশ (Bkash)</option>
                <option value="NAGAD">নগদ (Nagad)</option>
              </select>
            </div>
            
            <div className="pt-4 flex space-x-4">
               <button 
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 text-gray-500 font-bold"
              >
                পিছনে যান
              </button>
              <button 
                type="submit"
                className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors shadow-lg"
              >
                অর্ডার নিশ্চিত করুন
              </button>
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">অর্ডার সামারি</h2>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <ul className="divide-y divide-gray-100 mb-6">
              {cart.map(item => (
                <li key={item.id} className="py-3 flex justify-between">
                  <span className="text-gray-600">{item.name} x {item.cartQuantity}</span>
                  <span className="font-bold">৳{item.mrp * item.cartQuantity}</span>
                </li>
              ))}
            </ul>
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg mb-2">
                <span>উপ-মোট</span>
                <span>৳{totalPrice}</span>
              </div>
              <div className="flex justify-between text-lg mb-2">
                <span>ডেলিভারি চার্জ</span>
                <span>৳৫০</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-green-700 border-t pt-4">
                <span>সর্বমোট</span>
                <span>৳{totalPrice + 50}</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-400 text-center">
              নিরাপদ পেমেন্ট এবং দ্রুত ডেলিভারি নিশ্চিত করা হয়।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
