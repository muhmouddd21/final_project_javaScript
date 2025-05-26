import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBKwseko7JI tznt37s6Ed8MX46qD0Nu8Sk",
  authDomain: "jsproj-group.firebaseapp.com",
  projectId: "jsproj-group",
  storageBucket: "jsproj-group.firebasestorage.app",
  messagingSenderId: "857452922932",
  appId: "1:857452922932:web:17a57941d2c2ede533e261",
  measurementId: "G-FSS7ZWQ06C",
};

initializeApp(firebaseConfig);
const db = getFirestore();
export { db, collection, getDocs, addDoc, deleteDoc, doc, updateDoc,Timestamp };
