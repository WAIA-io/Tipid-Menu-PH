import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, doc, setDoc, onSnapshot, addDoc, updateDoc, increment, arrayUnion, arrayRemove 
} from 'firebase/firestore';
import { 
  getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged 
} from 'firebase/auth';
import { 
  MapPin, Utensils, User, Lock, Search, Plus, ArrowUpCircle, 
  Coffee, Pizza, X, Navigation2, Map as MapIcon, Car, List, 
  ShieldCheck, Star, Zap, Award, CheckCircle, ChevronRight, Share2, Info, Heart, Edit, Crown, Phone, Mail, Calendar
} from 'lucide-react';

// --- Firebase Configuration ---
const getFirebaseConfig = () => {
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    try {
      return typeof __firebase_config === 'string' ? JSON.parse(__firebase_config) : __firebase_config;
    } catch (e) {
      console.error("Firebase config parse error", e);
    }
  }
  return {
    apiKey: "AIzaSyAkvxTp77xtqywYlXTqKAOinNQKMgxuWmg",
    authDomain: "tipid-menu.firebaseapp.com",
    projectId: "tipid-menu",
    storageBucket: "tipid-menu.firebasestorage.app",
    messagingSenderId: "78228329202",
    appId: "1:78228329202:web:51d051d2b2296f2bcdb66b"
  };
};

const firebaseConfig = getFirebaseConfig();
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// RULE 1: Sanitize appId
const rawAppId = typeof __app_id !== 'undefined' ? __app_id : 'tipid-menu-default';
const appId = rawAppId.replace(/\//g, '_');

// --- Mock Data ---
const MOCK_RESTAURANTS = [
  { id: '1', name: 'Jollibee', category: 'Fast Food', rating: 4.8, address: 'BGC, Taguig', lat: 14.5547, lng: 121.0244, top: '40%', left: '50%', img: '🐝', verified: true },
  { id: '2', name: "McDonald's", category: 'Fast Food', rating: 4.5, address: 'Makati Ave', lat: 14.56, lng: 121.03, top: '60%', left: '30%', img: '🍔', verified: true },
  { id: '3', name: 'Mang Inasal', category: 'Fast Food', rating: 4.7, address: 'Quezon City', lat: 14.65, lng: 121.03, top: '20%', left: '70%', img: '🍗', verified: true },
  { id: '4', name: 'Greenwich', category: 'Pizza', rating: 4.3, address: 'Ortigas Center', lat: 14.58, lng: 121.06, top: '45%', left: '80%', img: '🍕', verified: true },
  { id: '5', name: 'Starbucks', category: 'Coffee', rating: 4.6, address: 'Eastwood', lat: 14.60, lng: 121.08, top: '75%', left: '60%', img: '☕', verified: false }
];

const MOCK_PROMOS = [
  { id: 'p1', resId: '1', title: 'Payday Deal: 50% OFF Buckets', source: 'Official FB', verified: true },
  { id: 'p2', resId: '2', title: 'Free Fries Friday (App Only)', source: 'McDo App', verified: true },
];

const MOCK_HACKS = [
  { id: 'h1', resId: '1', title: 'Chickenjoy Unli-Gravy Trick', desc: 'Ask for a "Solo" gravy cup, then request a refill right after they pour it. They give double!', savings: 15, votes: 342, user: 'PinoyEater', avatar: '🍗' },
  { id: 'h2', resId: '1', title: 'Ala Carte + Rice Combo', desc: 'Buying Ala Carte Chicken + Extra Rice is ₱5 cheaper than the meal if you have your own water.', savings: 5, votes: 89, user: 'HackMaster', avatar: '🧠' },
  { id: 'h3', resId: '2', title: 'Fresh Fries Hack', desc: 'Order fries with "No Salt". They have to cook a fresh batch. Ask for salt packets on the side.', savings: 0, votes: 512, user: 'FryGuy', avatar: '🍟' },
];

const TIERS = [
  { name: 'Tipid Legend', icon: '💎', minPoints: 2500, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' },
  { name: 'Hack Master', icon: '🥇', minPoints: 1000, color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
  { name: 'Deal Hunter', icon: '🥈', minPoints: 500, color: 'text-slate-600', bg: 'bg-slate-200', border: 'border-slate-300' },
  { name: 'Smart Spender', icon: '🥉', minPoints: 200, color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-200' },
  { name: 'Newbie Saver', icon: '🥚', minPoints: 0, color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ 
    points: 50, isPro: false, isVerified: false, username: 'Foodie', avatar: '👤', favorites: [], following: [],
    fullName: '', email: '', mobile: '', dob: ''
  });
  const [restaurants] = useState(MOCK_RESTAURANTS);
  const [hacks, setHacks] = useState(MOCK_HACKS);
  const [promos] = useState(MOCK_PROMOS);
  
  const [currentTab, setCurrentTab] = useState('map');
  const [activeView, setActiveView] = useState('main');
  const [selectedRes, setSelectedRes] = useState(null);
  
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyStep, setVerifyStep] = useState(1);
  const [verifyForm, setVerifyForm] = useState({ fullName: '', email: '', mobile: '', dob: '' });
  
  const [showAddHackModal, setShowAddHackModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editForm, setEditForm] = useState({ username: '', avatar: '' });
  const [toast, setToast] = useState('');

  // Helper to derive the user document reference safely
  const getUserRef = () => {
    if (!user?.uid) return null;
    return doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
  };

  // Auth Initialization
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth failed", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Data Fetching with defensive guards
  useEffect(() => {
    if (!user?.uid || !db) return;

    const userRef = getUserRef();
    const unsubUser = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUserData(prev => ({ 
          ...prev, 
          ...data,
          favorites: Array.isArray(data.favorites) ? data.favorites : [],
          following: Array.isArray(data.following) ? data.following : []
        }));
      } else {
        setDoc(userRef, { points: 50, isPro: false, isVerified: false, username: 'Foodie', avatar: '👤', favorites: [], following: [] });
      }
    }, (err) => console.error("Profile sync error:", err));

    const hacksRef = collection(db, 'artifacts', appId, 'public', 'data', 'hacks');
    const unsubHacks = onSnapshot(hacksRef, (snap) => {
      if (!snap.empty) {
        setHacks(snap.docs.map(d => ({ ...d.data(), id: d.id })));
      }
    }, (err) => console.error("Hacks sync error:", err));

    return () => { 
      unsubUser(); 
      unsubHacks(); 
    };
  }, [user]);

  const userTier = useMemo(() => {
    return TIERS.find(t => userData.points >= t.minPoints) || TIERS[TIERS.length - 1];
  }, [userData.points]);

  const showToastMessage = (msg) => { 
    if (typeof msg !== 'string') return;
    setToast(msg); 
    setTimeout(() => setToast(''), 3000); 
  };
  
  const handleVerifyDetails = (e) => {
    e.preventDefault();
    setVerifyStep(2);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const userRef = getUserRef();
    if (!userRef) return;

    if (otpInput === '1234') {
      const updates = { 
        isVerified: true, 
        points: increment(100),
        ...verifyForm 
      };
      await setDoc(userRef, updates, { merge: true });
      setShowVerifyModal(false);
      setVerifyStep(1);
      showToastMessage("Successfully verified! +100 Points");
    } else {
      showToastMessage("Invalid OTP. Try 1234");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const userRef = getUserRef();
    if (!userRef) return;

    const updates = { username: editForm.username, avatar: editForm.avatar };
    await setDoc(userRef, updates, { merge: true });
    setShowEditProfileModal(false);
    showToastMessage("Profile updated successfully!");
  };

  const handleUpgradePro = async (method) => {
    const userRef = getUserRef();
    if (!userRef) return;

    if (method === 'points' && userData.points < 1000) return showToastMessage("Not enough points!");
    const updates = { isPro: true, points: method === 'points' ? increment(-1000) : userData.points };
    await setDoc(userRef, updates, { merge: true });
    showToastMessage("Welcome to PRO!");
  };

  const handleToggleFavorite = async (hackId) => {
    const userRef = getUserRef();
    if (!userRef) return;

    const isFavorited = userData.favorites?.includes(hackId);
    await updateDoc(userRef, { 
      favorites: isFavorited ? arrayRemove(hackId) : arrayUnion(hackId) 
    });
  };

  const handleToggleFollow = async (authorName) => {
    const userRef = getUserRef();
    if (!userRef) return;

    const isFollowing = userData.following?.includes(authorName);
    await updateDoc(userRef, { 
      following: isFollowing ? arrayRemove(authorName) : arrayUnion(authorName) 
    });
  };

  const submitHack = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!userData.isVerified) return setShowVerifyModal(true);
    
    const formData = new FormData(e.target);
    const newHack = {
      resId: selectedRes.id, 
      title: formData.get('title'), 
      desc: formData.get('desc'),
      savings: Number(formData.get('savings')), 
      votes: 1, 
      user: userData.username,
      avatar: userData.avatar, 
      createdAt: new Date().toISOString()
    };

    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'hacks'), newHack);
    await setDoc(getUserRef(), { points: increment(50) }, { merge: true });
    setShowAddHackModal(false);
    showToastMessage("Hack submitted! +50 Points");
  };

  const openNav = (appType, lat, lng) => {
    if (appType === 'google') window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
    if (appType === 'apple') window.open(`http://maps.apple.com/?daddr=${lat},${lng}`);
    if (appType === 'waze') window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`);
  };

  // --- Views ---
  const renderHeader = () => (
    <header className="bg-white px-5 py-4 shadow-sm z-20 flex justify-between items-center sticky top-0">
      <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 italic">Tipid Menu</h1>
      <button onClick={() => setCurrentTab('profile')} className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 hover:bg-orange-100 transition-colors">
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-orange-700">{userData.points} pts</span>
          <span className="text-[10px] font-semibold text-orange-500 flex items-center">{userTier.icon} {userTier.name}</span>
        </div>
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg shadow-sm border border-orange-200">{userData.avatar}</div>
      </button>
    </header>
  );

  const renderTabBar = () => (
    <nav className="bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center sticky bottom-0 z-20 pb-safe">
      <button onClick={() => setCurrentTab('map')} className={`flex flex-col items-center gap-1 ${currentTab === 'map' ? 'text-orange-600' : 'text-slate-400'}`}>
        <MapPin size={24} className={currentTab === 'map' ? 'fill-orange-100' : ''} /><span className="text-[10px] font-bold">Near Me</span>
      </button>
      <button onClick={() => setCurrentTab('spots')} className={`flex flex-col items-center gap-1 ${currentTab === 'spots' ? 'text-orange-600' : 'text-slate-400'}`}>
        <List size={24} /><span className="text-[10px] font-bold">Spots</span>
      </button>
      <button onClick={() => { if(selectedRes) setShowAddHackModal(true); else setCurrentTab('spots'); }} className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-full text-white shadow-lg shadow-orange-500/30 transform -translate-y-4 hover:scale-105 transition-transform"><Plus size={24} /></button>
      <button onClick={() => setCurrentTab('pro')} className={`flex flex-col items-center gap-1 ${currentTab === 'pro' ? 'text-orange-600' : 'text-slate-400'}`}>
        <Zap size={24} className={currentTab === 'pro' ? 'fill-orange-100' : ''} /><span className="text-[10px] font-bold">PRO</span>
      </button>
      <button onClick={() => setCurrentTab('profile')} className={`flex flex-col items-center gap-1 ${currentTab === 'profile' ? 'text-orange-600' : 'text-slate-400'}`}>
        <User size={24} className={currentTab === 'profile' ? 'fill-orange-100' : ''} /><span className="text-[10px] font-bold">Profile</span>
      </button>
    </nav>
  );

  const renderMap = () => (
    <div className="flex-1 relative bg-[#E2E8F0] overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-50 mix-blend-multiply"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full animate-ping absolute"></div>
        <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg z-10"></div>
      </div>
      {restaurants.map(res => (
        <button key={res.id} onClick={() => setSelectedRes(res)} className="absolute flex flex-col items-center group -translate-x-1/2 -translate-y-full z-10 hover:z-20 transition-all duration-300" style={{ top: res.top, left: res.left }}>
          <div className={`p-2 rounded-2xl shadow-xl transition-transform ${selectedRes?.id === res.id ? 'bg-orange-600 text-white scale-110' : 'bg-white text-orange-600 hover:scale-110 border border-slate-200'}`}><span className="text-xl">{res.img}</span></div>
          <span className={`mt-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-xs font-bold rounded-lg shadow-sm border border-slate-100 transition-opacity whitespace-nowrap ${selectedRes?.id === res.id ? 'opacity-100 text-orange-700' : 'opacity-0 group-hover:opacity-100 text-slate-700'}`}>{res.name}</span>
        </button>
      ))}
      {selectedRes && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-5 z-20 animate-in slide-in-from-bottom border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl border border-orange-100">{selectedRes.img}</div>
              <div>
                <h2 className="text-xl font-black text-slate-800 leading-tight">{selectedRes.name}</h2>
                <div className="flex items-center gap-1 mt-0.5"><Star size={12} className="fill-orange-400 text-orange-400" /><span className="text-xs font-bold text-slate-600">{selectedRes.rating}</span><span className="text-xs text-slate-400">• {selectedRes.category}</span></div>
              </div>
            </div>
            <button onClick={() => setSelectedRes(null)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button onClick={() => openNav('google', selectedRes.lat, selectedRes.lng)} className="flex flex-col items-center gap-1.5 p-2 bg-slate-50 rounded-xl hover:bg-orange-50 hover:text-orange-600 text-slate-600 transition-colors"><MapIcon size={20} /><span className="text-[10px] font-bold">G-Maps</span></button>
            <button onClick={() => openNav('apple', selectedRes.lat, selectedRes.lng)} className="flex flex-col items-center gap-1.5 p-2 bg-slate-50 rounded-xl hover:bg-orange-50 hover:text-orange-600 text-slate-600 transition-colors"><Navigation2 size={20} /><span className="text-[10px] font-bold">Apple</span></button>
            <button onClick={() => openNav('waze', selectedRes.lat, selectedRes.lng)} className="flex flex-col items-center gap-1.5 p-2 bg-slate-50 rounded-xl hover:bg-orange-50 hover:text-orange-600 text-slate-600 transition-colors"><Car size={20} /><span className="text-[10px] font-bold">Waze</span></button>
          </div>
          <button onClick={() => setActiveView('restaurant')} className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">View Hacks & Promos <ChevronRight size={18} /></button>
        </div>
      )}
    </div>
  );

  const renderRestaurant = () => {
    if (!selectedRes) return null;
    const resPromos = promos.filter(p => p.resId === selectedRes.id);
    const resHacks = hacks.filter(h => h.resId === selectedRes.id).sort((a,b) => b.votes - a.votes);
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50 pb-8 animate-in slide-in-from-right duration-300">
        <div className="bg-white px-5 pt-4 pb-6 shadow-sm sticky top-0 z-10">
          <button onClick={() => setActiveView('main')} className="flex items-center gap-2 text-slate-500 font-bold mb-4 hover:text-slate-800"><X size={20} /> Back to Map</button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl border border-orange-100">{selectedRes.img}</div>
            <div>
              <h2 className="text-3xl font-black text-slate-800">{selectedRes.name}</h2>
              <div className="flex items-center gap-2 mt-1"><span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold text-slate-600">{selectedRes.category}</span><span className="text-sm font-bold text-slate-500 flex items-center gap-1"><Star size={14} className="fill-orange-400 text-orange-400"/> {selectedRes.rating}</span></div>
            </div>
          </div>
        </div>
        <div className="p-5 space-y-6">
          {resPromos.length > 0 && (
            <section>
              <h3 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2"><ShieldCheck size={20} className="text-blue-500" /> Official Promos</h3>
              <div className="space-y-3">{resPromos.map(p => (
                <div key={p.id} className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
                  <div className="bg-blue-100 p-2 rounded-xl h-fit"><Zap size={20} className="text-blue-600" /></div>
                  <div><h4 className="font-bold text-slate-800">{p.title}</h4><p className="text-xs font-semibold text-blue-600 mt-1">Verified via {p.source}</p></div>
                </div>
              ))}</div>
            </section>
          )}
          <section>
            <div className="flex justify-between items-end mb-3"><h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><Utensils size={20} className="text-orange-500" /> Secret Hacks</h3><span className="text-xs font-bold text-slate-500">{resHacks.length} Hacks</span></div>
            <div className="space-y-4">{resHacks.map((hack, idx) => {
              const isLocked = idx > 0 && !userData.isPro;
              return (
                <div key={hack.id} className={`bg-white border rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all ${isLocked ? 'border-slate-200' : 'border-orange-100'}`}>
                  {isLocked && <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px] z-10 flex flex-col items-center justify-center p-4 text-center"><Lock size={32} className="text-slate-400 mb-2" /><p className="font-bold text-slate-700 mb-3 text-xs">Unlock PRO to see more hacks</p><button onClick={() => { setActiveView('main'); setCurrentTab('pro'); }} className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-xl font-bold text-xs shadow-md">View PRO</button></div>}
                  <div className="flex justify-between items-start mb-2"><h4 className="font-bold text-slate-800 text-lg leading-tight pr-4">{hack.title}</h4><button onClick={() => handleToggleFavorite(hack.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Heart size={20} className={userData.favorites?.includes(hack.id) ? "fill-red-500 text-red-500" : ""} /></button></div>
                  <p className="text-sm text-slate-600 mb-4">{hack.desc}</p>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2"><div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs">{hack.avatar}</div><span className="text-xs font-bold text-slate-500">{hack.user}</span>{hack.user !== userData.username && <button onClick={() => handleToggleFollow(hack.user)} className={`ml-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${userData.following?.includes(hack.user) ? 'bg-slate-100' : 'bg-orange-50 text-orange-600'}`}>{userData.following?.includes(hack.user) ? 'Following' : 'Follow'}</button>}</div>
                    <div className="flex items-center gap-3"><span className="flex items-center gap-1 text-xs font-bold text-slate-400"><ArrowUpCircle size={16}/> {hack.votes}</span><div className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-black">₱{hack.savings}</div></div>
                  </div>
                </div>
              );
            })}</div>
          </section>
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-5">
      <div className="bg-white rounded-3xl p-6 shadow-sm border flex flex-col items-center text-center mb-6">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-5xl mb-4 border-4 border-white shadow-lg relative group">{userData.avatar}<button onClick={() => { setEditForm({ username: userData.username, avatar: userData.avatar }); setShowEditProfileModal(true); }} className="absolute bottom-0 right-0 p-1.5 bg-orange-500 text-white rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"><Edit size={12} /></button></div>
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">{userData.username} {userData.isVerified && <CheckCircle size={20} className="text-blue-500" />}</h3>
        <div className={`mt-3 px-4 py-1.5 rounded-full border flex items-center gap-2 font-bold text-sm ${userTier.bg} ${userTier.color} ${userTier.border}`}>{userTier.icon} {userTier.name} • {userData.points} pts</div>
      </div>
      {!userData.isVerified && (
        <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 mb-6 flex flex-col"><h4 className="font-black text-amber-900 text-lg mb-2">Verify Account</h4><p className="text-sm text-amber-800/80 mb-4">Earn +100 Points instantly.</p><button onClick={() => setShowVerifyModal(true)} className="py-3 bg-amber-500 text-white font-bold rounded-xl shadow-lg">Verify with OTP</button></div>
      )}
      <div className="grid grid-cols-2 gap-4"><div className="bg-white p-5 rounded-3xl border"><div className="text-slate-400 mb-1"><Share2 size={24} /></div><div className="text-2xl font-black">{userData.hacksCount || 0}</div><div className="text-xs font-bold text-slate-500">Hacks Posted</div></div><div className="bg-white p-5 rounded-3xl border"><div className="text-green-500 mb-1 font-black text-2xl">₱</div><div className="text-2xl font-black">{userData.totalSavings || 0}</div><div className="text-xs font-bold text-slate-500">Total Savings</div></div></div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 max-w-md mx-auto relative overflow-hidden font-sans">
      {activeView === 'main' && renderHeader()}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {activeView === 'restaurant' && renderRestaurant()}
        {activeView === 'main' && (
          <>{currentTab === 'map' && renderMap()}{currentTab === 'spots' && renderSpots()}{currentTab === 'profile' && renderProfile()}{currentTab === 'pro' && renderPro()}</>
        )}
      </main>
      {activeView === 'main' && renderTabBar()}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-5 py-2.5 rounded-full shadow-2xl z-[200] flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <Info size={16} className="text-orange-400" />
          <p className="font-bold text-sm">{toast}</p>
        </div>
      )}
      {/* Verification Modal (Multi-step) */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative">
            <button onClick={() => { setShowVerifyModal(false); setVerifyStep(1); }} className="absolute top-6 right-6 p-2 rounded-full"><X size={20} /></button>
            <div className="text-center mb-6 pt-2">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-800">Verify Account</h3>
              <p className="text-xs text-slate-500 font-medium">Step {verifyStep} of 2</p>
            </div>
            {verifyStep === 1 ? (
              <form onSubmit={handleVerifyDetails} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
                  <input required value={verifyForm.fullName} onChange={(e) => setVerifyForm({...verifyForm, fullName: e.target.value})} placeholder="Juan Dela Cruz" className="w-full px-4 py-3.5 bg-slate-50 border rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email</label>
                  <input required type="email" value={verifyForm.email} onChange={(e) => setVerifyForm({...verifyForm, email: e.target.value})} placeholder="juan@email.com" className="w-full px-4 py-3.5 bg-slate-50 border rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Mobile Number</label>
                  <input required type="tel" value={verifyForm.mobile} onChange={(e) => setVerifyForm({...verifyForm, mobile: e.target.value})} placeholder="0912 345 6789" className="w-full px-4 py-3.5 bg-slate-50 border rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Date of Birth</label>
                  <input required type="date" value={verifyForm.dob} onChange={(e) => setVerifyForm({...verifyForm, dob: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg mt-4">Next: Receive OTP</button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <p className="text-center text-sm text-slate-500">We've sent a code to <br/><span className="font-bold text-slate-800">{verifyForm.mobile}</span></p>
                <input type="text" maxLength={4} value={otpInput} onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))} className="w-full text-center text-3xl tracking-[1em] font-black bg-slate-50 py-4 rounded-2xl outline-none border focus:ring-4 focus:ring-blue-500/10" placeholder="••••" />
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg">Confirm OTP</button>
                <div className="flex justify-between px-2">
                  <button type="button" onClick={() => setVerifyStep(1)} className="text-xs font-bold text-slate-400 uppercase hover:text-blue-500 transition-colors">Back</button>
                  <p className="text-xs font-bold text-slate-400 uppercase">Hint: Use code 1234</p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
