
import React from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  cartCount: number;
  setView: (view: ViewState) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  phone: string;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, setView, onSearch, searchQuery, phone }) => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div 
          className="flex items-center cursor-pointer group"
          onClick={() => { setView('home'); window.scrollTo(0,0); }}
        >
          <div className="bg-green-700 text-white p-2 rounded-lg font-bold text-xl mr-2 group-hover:bg-green-800 transition-colors shadow-md shadow-green-100">MXN</div>
          <span className="text-xl font-black text-green-800 hidden md:block tracking-tight">Modern Herbal</span>
        </div>

        <div className="flex-1 max-w-md mx-4 hidden sm:block">
          <div className="relative">
            <input 
              type="text" 
              value={searchQuery} 
              placeholder="পণ্য বা বৈশিষ্ট্য দিয়ে খুঁজুন..." 
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-sm font-bold text-gray-800"
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center space-x-3 md:space-x-6">
          <a 
            href={`tel:${phone}`}
            className="hidden md:flex items-center space-x-2 text-green-700 font-black border-2 border-green-700 px-5 py-2 rounded-full hover:bg-green-700 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            <span>কল করুন</span>
          </a>

          <button 
            onClick={() => { setView('admin'); window.scrollTo(0,0); }}
            className="text-gray-500 hover:text-green-700 font-black text-sm uppercase tracking-widest hidden lg:block"
          >
            অ্যাডমিন
          </button>
          
          <button 
            onClick={() => { setView('cart'); window.scrollTo(0,0); }}
            className="relative p-2 text-gray-700 hover:text-green-700 transition-colors group"
          >
            <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="sm:hidden px-4 pb-4 flex space-x-2">
        <div className="relative flex-grow">
          <input 
            type="text" 
            value={searchQuery} 
            placeholder="পণ্য খুঁজুন..." 
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-bold text-gray-800"
          />
          <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <a 
          href={`tel:${phone}`}
          className="bg-green-600 text-white px-4 rounded-xl flex items-center justify-center shadow-lg shadow-green-100 active:scale-90 transition-transform"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
        </a>
        <button 
          onClick={() => { setView('admin'); window.scrollTo(0,0); }}
          className="bg-gray-100 text-gray-600 p-2 rounded-xl flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
