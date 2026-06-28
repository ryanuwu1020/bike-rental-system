/**
 * Firebase 設定檔
 * ⚠️ 請將下方的 firebaseConfig 替換為你自己的 Firebase 專案設定
 */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);

// 取得 Firestore 資料庫實例（全域使用）
const db = firebase.firestore();
