
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// লোকাল স্টোরেজ কি (Key) - যদি ভবিষ্যতে পরিবর্তন করতে চান
export const CONFIG_KEY = 'mxn_firebase_config';

let db: any = null;
let app: any = null;
let isConfigured = false;

// আপনার দেওয়া কনফিগারেশন (আমি ডাটাবেস লিংক যোগ করে দিয়েছি)
const staticConfig = {
  apiKey: "AIzaSyDdanPzDqhyr5MxOhDVfuJ8DhxWSWXVCoo",
  authDomain: "mxn-shop.firebaseapp.com",
  projectId: "mxn-shop",
  storageBucket: "mxn-shop.firebasestorage.app",
  messagingSenderId: "646945103206",
  appId: "1:646945103206:web:ab10832634fca8466a3ca7",
  measurementId: "G-XPTQMQ3KM0",
  // Realtime Database URL (এটি ছাড়া ডাটাবেস কাজ করে না)
  databaseURL: "https://mxn-shop-default-rtdb.firebaseio.com"
};

try {
  // ১. প্রথমে দেখি লোকাল স্টোরেজে নতুন কোনো কনফিগ আছে কিনা (ওভাররাইড করার জন্য)
  const localConfig = localStorage.getItem(CONFIG_KEY);
  
  if (localConfig) {
    const config = JSON.parse(localConfig);
    app = initializeApp(config);
    db = getDatabase(app);
    isConfigured = true;
    console.log("Firebase Connected from Local Config");
  } 
  // ২. না থাকলে আপনার দেওয়া কোড ব্যবহার করবে
  else {
     app = initializeApp(staticConfig);
     db = getDatabase(app);
     isConfigured = true;
     console.log("Firebase Connected from Static Config");
  }
} catch (error) {
  console.error("Firebase connection failed:", error);
}

// কনফিগারেশন সেভ করার ফাংশন (অ্যাডমিন প্যানেল থেকে পরিবর্তনের জন্য)
export const saveConfig = (configString: string) => {
  try {
    let cleanConfig = configString;
    if (configString.includes('=')) {
      cleanConfig = configString.substring(configString.indexOf('=') + 1);
    }
    cleanConfig = cleanConfig.trim().replace(/;$/, '');
    
    localStorage.setItem(CONFIG_KEY, cleanConfig);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export { db, isConfigured };
