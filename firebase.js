// 1) Firebase Console > Project settings > Your apps > Web app > copy config here.
// These values are public identifiers, not secrets. Security comes from firestore.rules / storage.rules.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
const app = initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "000000000000",
  appId: "YOUR_APP_ID"
});
export const db = getFirestore(app), auth = getAuth(app), storage = getStorage(app);
export const $ = s => document.querySelector(s);
export const money = n => "৳" + Number(n || 0).toLocaleString("en-IN");
export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const price = p => (p.salePrice > 0 && p.salePrice < p.price ? p.salePrice : p.price);
export const bottle = `<svg viewBox="0 0 100 140" class="bottle" aria-hidden="true"><rect x="40" y="6" width="20" height="16" fill="none" stroke="currentColor"/><rect x="34" y="22" width="32" height="10" fill="none" stroke="currentColor"/><path d="M22 44q0-12 12-12h32q12 0 12 12v70q0 12-12 12H34q-12 0-12-12z" fill="none" stroke="currentColor"/><path d="M50 62l9 14-9 14-9-14z" fill="none" stroke="currentColor"/></svg>`;
