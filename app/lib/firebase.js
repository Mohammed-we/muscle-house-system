import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  // لا تقلق بشأن الـ apiKey هنا لأنه لن يُستخدم للـ Auth الآن
  apiKey: "AIzaSyCL1HdbfjGV5jC8jmPDbxrUTiE6_X3TbGI",
  databaseURL: "https://gym-system-5d1bb-default-rtdb.firebaseio.com",
  projectId: "gym-system-5d1bb",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app); 

export { db }; // صدرت فقط قاعدة البيانات