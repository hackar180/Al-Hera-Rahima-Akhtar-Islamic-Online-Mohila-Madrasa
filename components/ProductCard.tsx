
import React from 'react';
import { Product } from '../types.ts';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
        />
        {/* Category tag removed as per request */}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-black text-gray-800 leading-tight group-hover:text-green-700 transition-colors">{product.name}</h3>
          <span className="text-xs font-bold bg-green-50 text-green-600 px-2 py-1 rounded-lg ml-2 whitespace-nowrap">{product.quantity}</span>
        </div>
        
        <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed h-[40px]">
          {product.description}
        </p>
        
        <div className="mt-auto">
          <div className="grid grid-cols-3 gap-1 mb-5 bg-gray-50/50 rounded-2xl p-3 border border-gray-100 group-hover:bg-green-50/30 transition-colors">
            <div className="text-center">
              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter mb-1">MRP</div>
              <div className="text-sm font-black text-gray-800">৳{product.mrp}</div>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="text-[10px] text-green-500 uppercase font-bold tracking-tighter mb-1">DP</div>
              <div className="text-sm font-black text-green-600">৳{product.dp}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-blue-500 uppercase font-bold tracking-tighter mb-1">PV</div>
              <div className="text-sm font-black text-blue-600">{product.pv}</div>
            </div>
          </div>
          
          <button 
            onClick={() => onAdd(product)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl transition-all transform active:scale-95 flex items-center justify-center shadow-lg shadow-green-100 hover:shadow-green-200"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            অর্ডার করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
