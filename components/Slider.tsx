
import React, { useState, useEffect } from 'react';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&q=80&w=2000',
    title: 'প্রাকৃতিক সুস্থতা সবার জন্য',
    subtitle: 'মডার্ণ হারবাল পণ্য নিয়ে নিয়ে সুস্থ থাকুন প্রতিদিন।'
  },
  {
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecee?auto=format&fit=crop&q=80&w=2000',
    title: 'ত্বকের যত্নে সেরা হারবাল নিম সোপ',
    subtitle: 'জীবাণুমুক্ত থাকুন প্রাকৃতিক উপায়ে।'
  },
  {
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&q=80&w=2000',
    title: 'নতুন মাশরুম টুথপেস্ট',
    subtitle: 'দাঁত ও মাড়ির সুরক্ষায় নতুন সমাধান।'
  }
];

const Slider: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden rounded-2xl shadow-lg mb-8">
      {SLIDES.map((slide, idx) => (
        <div 
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">{slide.title}</h2>
            <p className="text-lg md:text-2xl text-white opacity-90">{slide.subtitle}</p>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {SLIDES.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all ${idx === current ? 'bg-white w-8' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
