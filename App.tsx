
import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, ViewState } from './types';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

// ডিফল্ট কিছু পণ্য যা প্রথমবার অ্যাপ ওপেন করলে দেখাবে
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'মাশরুম টুথপেস্ট',
    description: 'দাঁত উজ্জ্বল ও মজবুত করে, মাড়ি শক্তিশালী করে এবং নিঃশ্বাসের দুর্গন্ধ দূর করে।',
    quantity: '১৫০ গ্রাম',
    pv: 70,
    dp: 140,
    mrp: 180,
    image: 'https://images.unsplash.com/photo-1559591937-e68fb33054f4?auto=format&fit=crop&q=80&w=400',
    category: 'Personal Care'
  },
  {
    id: '2',
    name: 'মডার্ণ নিম সোপ',
    description: 'জীবাণুমুক্ত করে, শরীরকে দুর্গন্ধমুক্ত রাখে এবং ত্বককে মসৃণ ও কোমল করে।',
    quantity: '১০০ গ্রাম',
    pv: 40,
    dp: 120,
    mrp: 150,
    image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&q=80&w=400',
    category: 'Personal Care'
  },
  {
    id: '3',
    name: 'ড্রিপ ড্রিংক (এনার্জি)',
    description: 'ক্লান্তি দূর করে, শরীরকে দ্রুত এনার্জি দেয়, ভিটামিন C ও E-কমপ্লেক্স যোগায়, হজমে সহায়তা করে এবং তাৎক্ষণিক রিফ্রেশমেন্ট দেয়।',
    quantity: '২৫০ গ্রাম',
    pv: 30,
    dp: 135,
    mrp: 160,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400',
    category: 'Food & Nutrition'
  },
  {
    id: '4',
    name: 'মডার্ণ শতায়ু',
    description: 'ক্লান্তি দূর করে, শরীরের পানিশূন্যতা পূরণ করে, রক্তের হিমোগ্লোবিনের ভারসাম্য রক্ষা করে এবং হজমে সহায়তা কারক।',
    quantity: '৭৫০ মিলি',
    pv: 200,
    dp: 400,
    mrp: 490,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400',
    category: 'Food & Nutrition'
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('সকল পণ্য');
  
  // ডাটাবেস কি (Key) পরিবর্তন করা হয়েছে যাতে নতুন ডাটা ঠিকমতো সেভ হয়
  const PRODUCTS_KEY = 'mxn_final_database_v6';
  const CART_KEY = 'mxn_final_cart_v6';

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_KEY);
      // যদি আগে কোনো পণ্য সেভ করা থাকে তবে সেটি দেখাবে, না হলে ডিফল্ট পণ্য দেখাবে
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  });
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const OWNER_NAME = "Md Anisur Rahman";
  const OWNER_PHONE = "01614997405";

  // যখনই প্রডাক্ট লিস্ট পরিবর্তন হবে, তা ব্রাউজারের মেমোরিতে সেভ হয়ে যাবে
  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'সকল পণ্য' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
        );
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
    alert('কার্টে যোগ করা হয়েছে!');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, cartQuantity: quantity } : item
    ));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: string) => {
    if(window.confirm('আপনি কি নিশ্চিত যে আপনি এই পণ্যটি মুছে ফেলতে চান?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      setCart(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Navbar 
        cartCount={cart.reduce((acc, item) => acc + item.cartQuantity, 0)} 
        setView={setView}
        onSearch={setSearchQuery}
        phone={OWNER_PHONE}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {view === 'home' && (
          <Home 
            products={filteredProducts} 
            addToCart={addToCart} 
            isSearching={searchQuery.length > 0}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        )}
        {view === 'cart' && (
          <Cart 
            cart={cart} 
            updateQuantity={updateCartQuantity} 
            removeFromCart={removeFromCart} 
            onCheckout={() => setView('checkout')}
            onBack={() => setView('home')}
          />
        )}
        {view === 'checkout' && (
          <Checkout 
            cart={cart} 
            onSuccess={() => {
              setCart([]);
              setView('home');
              alert('অর্ডার সফল হয়েছে! ধন্যবাদ।');
            }} 
            onCancel={() => setView('cart')}
          />
        )}
        {view === 'admin' && (
          <Admin 
            products={products} 
            onAdd={addProduct} 
            onUpdate={updateProduct}
            onDelete={deleteProduct} 
          />
        )}
      </main>

      {/* FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col space-y-4">
        {/* WhatsApp Floating */}
        <a 
          href="https://chat.whatsapp.com/LoXe8964UKSIiUJ6iPfmUy?mode=gi_c"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center border-4 border-white active:scale-90"
          title="হোয়াটসঅ্যাপ গ্রুপ"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>

        {/* Messenger Floating */}
        <a 
          href="https://m.me/j/AbY0-Vlqtv0pW5VP/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#0084FF] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center border-4 border-white active:scale-90"
          title="মেসেঞ্জার গ্রুপ"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.112.309 2.289.474 3.513.474 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.291 14.674l-3.062-3.271-5.968 3.271 6.558-6.96 3.125 3.271 5.905-3.271-6.558 6.96z"/>
          </svg>
        </a>

        {/* Call Floating */}
        <a 
          href={`tel:${OWNER_PHONE}`}
          className="bg-green-600 text-white p-4 rounded-full shadow-2xl hover:bg-green-700 transition-all transform hover:scale-110 flex items-center justify-center border-4 border-white active:scale-90"
          title="সরাসরি কল করুন"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        </a>
      </div>

      <footer className="bg-green-900 text-white pt-16 pb-10">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="md:col-span-2">
            <div className="flex items-center justify-center md:justify-start mb-6">
              <div className="bg-white text-green-900 px-3 py-1 rounded-xl font-black text-xl mr-3 shadow-lg">MXN</div>
              <h3 className="text-3xl font-extrabold tracking-tight">Modern Herbal</h3>
            </div>
            <p className="text-green-100 max-w-md leading-relaxed opacity-80 mx-auto md:mx-0 text-sm md:text-base">
              আধুনিক প্রযুক্তিতে ভেষজ চিকিৎসা। আমরা প্রদান করি ১০০% প্রাকৃতিক ও গুণগত মানসম্পন্ন ভেষজ পণ্য। সুস্থ জীবন ও প্রকৃতির ছোঁয়া পেতে আমাদের সাথেই থাকুন।
            </p>
            <div className="mt-8 p-6 bg-white/10 rounded-[2rem] border border-white/5 inline-block text-left w-full md:w-auto">
              <p className="text-green-400 font-bold mb-1 uppercase tracking-widest text-[10px]">পরিচালক ও প্রোপ্রাইটর:</p>
              <h4 className="text-2xl font-black mb-1">{OWNER_NAME}</h4>
              <p className="text-green-200 font-black flex items-center text-lg">
                <a href={`tel:${OWNER_PHONE}`} className="hover:text-white transition-colors">মোবাইল: +{OWNER_PHONE}</a>
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 border-b border-green-800 pb-2 inline-block md:block">লিঙ্কসমূহ</h4>
            <ul className="space-y-4 text-green-200 font-bold">
              <li><button onClick={() => { setView('home'); window.scrollTo(0,0); }} className="hover:text-white transition-all">হোম পেজ</button></li>
              <li><button onClick={() => { setView('admin'); window.scrollTo(0,0); }} className="hover:text-white transition-all">অ্যাডমিন প্যানেল</button></li>
              <li><button onClick={() => { setView('cart'); window.scrollTo(0,0); }} className="hover:text-white transition-all">শপিং কার্ট</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 border-b border-green-800 pb-2 inline-block md:block">আমাদের সাথে যুক্ত হোন</h4>
            <div className="flex flex-col space-y-3 items-center md:items-start">
              <a 
                href="https://chat.whatsapp.com/LoXe8964UKSIiUJ6iPfmUy?mode=gi_c" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center md:justify-start space-x-2 bg-[#25D366] px-4 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                <span>হোয়াটসঅ্যাপ গ্রুপ</span>
              </a>
              <a 
                href="https://m.me/j/AbY0-Vlqtv0pW5VP/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center md:justify-start space-x-2 bg-[#0084FF] px-4 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.112.309 2.289.474 3.513.474 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.291 14.674l-3.062-3.271-5.968 3.271 6.558-6.96 3.125 3.271 5.905-3.271-6.558 6.96z"/></svg>
                <span>মেসেঞ্জার গ্রুপ</span>
              </a>
            </div>
            <div className="mt-6 flex items-start justify-center md:justify-start space-x-3 text-green-200">
              <svg className="w-5 h-5 mt-1 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span className="text-sm font-bold">ঢাকা, বাংলাদেশ।</span>
            </div>
          </div>
        </div>
        <div className="text-center mt-16 pt-8 border-t border-green-800 text-green-400 text-[10px] font-black tracking-widest uppercase">
          &copy; ২০২৪ MXN Modern Herbal Group. Design & Developed by {OWNER_NAME}.
        </div>
      </footer>
    </div>
  );
};

export default App;
