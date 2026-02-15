
import React from 'react';
import { CartItem } from '../types';

interface CartProps {
  cart: CartItem[];
  updateQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  onCheckout: () => void;
  onBack: () => void;
}

const Cart: React.FC<CartProps> = ({ cart, updateQuantity, removeFromCart, onCheckout, onBack }) => {
  const totalPrice = cart.reduce((acc, item) => acc + (item.mrp * item.cartQuantity), 0);
  const totalPV = cart.reduce((acc, item) => acc + (item.pv * item.cartQuantity), 0);

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-white p-8 rounded-2xl shadow-sm inline-block">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">আপনার কার্ট খালি</h2>
          <button 
            onClick={onBack}
            className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-colors"
          >
            শপিং করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">শপিং কার্ট</h2>
      
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
        <ul className="divide-y divide-gray-100">
          {cart.map(item => (
            <li key={item.id} className="p-4 flex items-center">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover mr-4" />
              <div className="flex-grow">
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">প্রতিটি ৳{item.mrp} (PV: {item.pv})</p>
              </div>
              <div className="flex items-center space-x-3 mr-8">
                <button 
                  onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100"
                >-</button>
                <span className="font-bold w-6 text-center">{item.cartQuantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100"
                >+</button>
              </div>
              <div className="text-right min-w-[100px]">
                <p className="font-bold text-gray-800">৳{item.mrp * item.cartQuantity}</p>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs text-red-500 hover:underline"
                >মুছে ফেলুন</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center space-x-4">
             <span className="text-gray-500">মোট পিভি (PV): <span className="text-blue-600 font-bold">{totalPV}</span></span>
             <span className="text-2xl font-bold text-gray-800">মোট টাকা: ৳{totalPrice}</span>
          </div>
        </div>
        <div className="flex space-x-4 w-full md:w-auto">
          <button 
            onClick={onBack}
            className="flex-1 md:flex-none px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl"
          >
            আরো কিনুন
          </button>
          <button 
            onClick={onCheckout}
            className="flex-1 md:flex-none px-12 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
          >
            চেকআউট
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
