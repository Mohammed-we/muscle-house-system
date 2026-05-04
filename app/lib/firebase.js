import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// هذه البيانات مستخرجة من صورتك الحقيقية لضمان عمل الاتصال
const firebaseConfig = {
  apiKey: "***************************************", // اترك مفتاحك كما هو هنا
  authDomain: "gym-system-5d1bb.firebaseapp.com",
  databaseURL: "https://gym-system-5d1bb-default-rtdb.firebaseio.com", 
  projectId: "gym-system-5d1bb",
  storageBucket: "gym-system-5d1bb.appspot.com",
  messagingSenderId: "***********",
  appId: "1:***********:web:***********"
};

// منع تكرار التهيئة في Next.js
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// تهيئة قاعدة البيانات
const db = getDatabase(app);

export { db };