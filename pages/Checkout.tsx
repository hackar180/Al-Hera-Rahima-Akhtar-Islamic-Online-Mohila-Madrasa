
import React, { useState } from 'react';
import { CartItem } from '../types.ts';

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
    payment: 'Cash on Delivery'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sendToTelegram = async () => {
    const BOT_TOKEN = '7914227549:AAHYmV6JQ1H8n05kI0f6g1a3PEFeBy6OBvw';
    const CHAT_ID = '7868741210';
    
    const itemsList = cart.map((item, index) => 
      `${index + 1}. ${item.name} (${item.cartQuantity} টি) - ৳${item.mrp * item.cartQuantity}`
    ).join('\n');

    const totalAmount = cart.reduce((acc, item) => acc + (item.mrp * item.cartQuantity), 0) + 50;
    const totalPV = cart.reduce((acc, item) => acc + (item.pv * item.cartQuantity), 0);

    const message = `
🌟 নতুন অর্ডার!
━━━━━━━━━━━━━━━━━━
👤 নাম: ${formData.name}
📞 ফোন: ${formData.phone}
📍 ঠিকানা: ${formData.address}
💳 পেমেন্ট: ${formData.payment}
━━━━━━━━━━━━━━━━━━
🛒 পণ্যসমূহ:
${itemsList}

━━━━━━━━━━━━━━━━━━
💰 মোট টাকা: ৳${totalAmount}
💎 মোট PV: ${totalPV}
━━━━━━━━━━━━━━━━━━
    `;

    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message })
      });
      return response.ok;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert('সব তথ্য সঠিকভাবে দিন।');
      return;
    }

    setIsSubmitting(true);
    const success = await sendToTelegram();
    setIsSubmitting(false);

    if (success) {
      onSuccess();
    } else {
      alert('দুঃখিত, সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-black mb-6 flex items-center">
            <span className="w-2 h-6 bg-green-600 rounded-full mr-3"></span>
            অর্ডার তথ্য দিন
          </h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-xl space-y-5">
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">আপনার নাম *</label>
              <input 
                name="name" type="text" required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="নাম লিখুন"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 p-4 rounded-2xl outline-none font-bold text-gray-800" 
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">ফোন নাম্বার *</label>
              <input 
                name="phone" type="tel" required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="০১XXXXXXXXX"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 p-4 rounded-2xl outline-none font-bold text-gray-800" 
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">ঠিকানা *</label>
              <textarea 
                name="address" required
                value={formData.address}
                onChange={handleInputChange}
                placeholder="আপনার পূর্ণ ঠিকানা"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 p-4 rounded-2xl outline-none font-medium text-gray-800" 
                rows={3}
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">পেমেন্ট মেথড</label>
              <select name="payment" value={formData.payment} onChange={handleInputChange} className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold text-gray-800">
                <option value="Cash on Delivery">ক্যাশ অন ডেলিভারি (COD)</option>
                <option value="Bkash">বিকাশ (Bkash)</option>
              </select>
            </div>
            <div className="pt-4 flex space-x-4">
              <button type="button" onClick={onCancel} className="flex-1 py-4 text-gray-400 font-bold uppercase text-xs">পিছনে যান</button>
              <button type="submit" disabled={isSubmitting} className="flex-2 px-8 py-4 bg-green-600 text-white font-black rounded-2xl shadow-lg active:scale-95">
                {isSubmitting ? 'প্রসেসিং...' : 'অর্ডার নিশ্চিত করুন'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl h-fit border border-blue-50">
           <h2 className="text-xl font-black mb-6">অর্ডার সামারি</h2>
           <div className="space-y-4 max-h-[300px] overflow-y-auto">
             {cart.map(item => (
               <div key={item.id} className="flex justify-between items-center text-sm">
                 <span className="font-bold text-gray-600">{item.name} x {item.cartQuantity}</span>
                 <span className="font-black">৳{item.mrp * item.cartQuantity}</span>
               </div>
             ))}
           </div>
           <div className="mt-6 pt-6 border-t border-dashed space-y-2">
             <div className="flex justify-between text-gray-400 font-bold text-xs uppercase"><span>ডেলিভারি চার্জ</span><span>৳৫০</span></div>
             <div className="flex justify-between text-lg font-black text-green-700"><span>সর্বমোট</span><span>৳{cart.reduce((a, i) => a + (i.mrp * i.cartQuantity), 0) + 50}</span></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
