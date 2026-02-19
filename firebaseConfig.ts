
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// ⚠️ গুরুত্বপূর্ণ: আপনার আসল ডাটাবেস চালু করতে নিচের তথ্যগুলো পরিবর্তন করুন
// ১. https://console.firebase.google.com এ যান
// ২. 'Add Project' এ ক্লিক করে নতুন প্রজেক্ট খুলুন (নাম দিন: MXN Shop)
// ৩. 'Web' আইকনে ক্লিক করে অ্যাপ রেজিস্টার করুন
// ৪. নিচে যে কনফিগারেশন কোড পাবেন তা এখানে কপি করে বসান

const firebaseConfig = {
  // নিচের ভ্যালুগুলো মুছে আপনার আসল কি (Key) বসান
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// চেক করা হচ্ছে কনফিগারেশন আসল কিনা
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";

let db: any = null;
let app: any = null;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    console.log("Firebase Connected Successfully");
  } catch (error) {
    console.error("Firebase connection failed:", error);
  }
}

export { db, isConfigured };
