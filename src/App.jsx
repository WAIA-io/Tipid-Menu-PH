import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, doc, setDoc, onSnapshot, addDoc, updateDoc, increment, arrayUnion, arrayRemove, serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged 
} from 'firebase/auth';
import { 
  MapPin, Utensils, User, Lock, Search, Plus, ArrowUpCircle, 
  Coffee, Pizza, X, Navigation2, Map as MapIcon, Car, List, 
  ShieldCheck, Star, Zap, Award, CheckCircle, ChevronRight, Share2, Info, Heart, Edit
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

// Sanitize App ID to ensure Firestore paths have the correct number of segments
let appId = 'default-app-id';
if (typeof __app_id !== 'undefined') {
  appId = __app_id.replace(/\//g, '_');
}

const isDummyConfig = firebaseConfig?.apiKey?.includes("AIzaSyAkvxTp77xtqywY");

// --- Mock Data (Version 2 with top/left map positions) ---
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
  const [authReady, setAuthReady] = useState(false);
  const [userData, setUserData] = useState({ 
    points: 50, isPro: false, isVerified: false, username: 'Foodie', avatar: '👤', favorites: [], following: [], hacksCount: 0, totalSavings: 0
  });
  
  const [restaurants] = useState(MOCK_RESTAURANTS);
  const [hacks, setHacks] = useState(MOCK_HACKS);
  const [promos] = useState(MOCK_PROMOS);
  
  const [currentTab, setCurrentTab] = useState('map');
  const [activeView, setActiveView] = useState('main');
  const [selectedRes, setSelectedRes] = useState(null);
  
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showAddHackModal, setShowAddHackModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  
  const [otpInput, setOtpInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editForm, setEditForm] = useState({ username: '', avatar: '' });
  const [toast, setToast] = useState('');

  const getUserRef = () => {
    if (!user?.uid) return null;
    return doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
  };

  // Auth Handshake (Kept for stability)
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth init error", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setAuthReady(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Data Sync (Kept strict guard to prevent permissions crash)
  useEffect(() => {
    if (!authReady || !user?.uid) return;

    const userRef = getUserRef();
    const unsubUser = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUserData(prev => ({ 
          ...prev, 
          ...data,
          points: Number(data.points) || 0,
          favorites: Array.isArray(data.favorites) ? data.favorites : [],
          following: Array.isArray(data.following) ? data.following : [],
          hacksCount: Number(data.hacksCount) || 0,
          totalSavings: Number(data.totalSavings) || 0
        }));
      } else {
        setDoc(userRef, { 
          points: 50, isPro: false, isVerified: false, 
          username: 'Foodie', avatar: '👤', favorites: [], 
          following: [], hacksCount: 0, totalSavings: 0 
        });
      }
    }, (err) => console.error("Permission error (Profile):", err));

    const hacksRef = collection(db, 'artifacts', appId, 'public', 'data', 'hacks');
    const unsubHacks = onSnapshot(hacksRef, (snap) => {
      if (!snap.empty) {
        setHacks(snap.docs.map(d => {
          const data = d.data();
          return {
            ...data,
            id: d.id,
            savings: Number(data.savings) || 0,
            votes: Number(data.votes) || 0
          };
        }));
      }
    }, (err) => console.error("Permission error (Hacks):", err));

    return () => { 
      unsubUser(); 
      unsubHacks(); 
    };
  }, [authReady, user]);

  const userTier = useMemo(() => TIERS.find(t => (userData.points || 0) >= t.minPoints) || TIERS[TIERS.length - 1], [userData.points]);

  const showToastMessage = (msg) => { 
    if (typeof msg !== 'string') return;
    setToast(msg); 
    setTimeout(() => setToast(''), 3000); 
  };
  
  // Version 2 Simple OTP Verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const userRef = getUserRef();
    if (!userRef) return;

    if (otpInput === '1234') {
      await setDoc(userRef, { 
        isVerified: true, 
        points: increment(100)
      }, { merge: true });
      setShowVerifyModal(false);
      setOtpInput('');
      showToastMessage("Successfully verified! +100 Points");
    } else {
      showToastMessage("Invalid OTP. Hint: Use 1234");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const userRef = getUserRef();
    if (!userRef) return;
    await setDoc(userRef, { username: editForm.username, avatar: editForm.avatar }, { merge: true });
    setShowEditProfileModal(false);
    showToastMessage("Profile updated successfully!");
  };

  const handleUpgradePro = async (method) => {
    const userRef = getUserRef();
    if (!userRef) return;
    if (method === 'points' && userData.points < 1000) return showToastMessage("Not enough points!");
    const updates = { isPro: true, points: method === 'points' ? increment(-1000) : userData.points };
    await setDoc(userRef, updates, { merge: true });
    showToastMessage("Welcome to PRO! All hacks unlocked.");
  };

  const handleToggleFavorite = async (hackId) => {
    const userRef = getUserRef();
    if (!userRef) return;
    const isFavorited = userData.favorites?.includes(hackId);
    await updateDoc(userRef, { favorites: isFavorited ? arrayRemove(hackId) : arrayUnion(hackId) });
  };

  const handleToggleFollow = async (authorName) => {
    const userRef = getUserRef();
    if (!userRef) return;
    const isFollowing = userData.following?.includes(authorName);
    await updateDoc(userRef, { following: isFollowing ? arrayRemove(authorName) : arrayUnion(authorName) });
  };

  const submitHack = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!userData.isVerified) return setShowVerifyModal(true);
    const formData = new FormData(e.target);
    const savings = Number(formData.get('savings'));
    
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'hacks'), {
      resId: selectedRes.id, title: formData.get('title'), desc: formData.get('desc'),
      savings: savings, votes: 1, user: userData.username,
      avatar: userData.avatar, createdAt: serverTimestamp(), authorId: user.uid
    });

    await setDoc(getUserRef(), { 
      points: increment(50),
      hacksCount: increment(1),
      totalSavings: increment(savings)
    }, { merge: true });
    
    setShowAddHackModal(false);
    showToastMessage("Hack submitted! +50 Points");
  };

  const openNav = (type, lat, lng) => {
    const urls = {
      google: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      apple: `http://maps.apple.com/?daddr=${lat},${lng}`,
      waze: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`
    };
    window.open(urls[type]);
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
      {/* Version 2 Mock Map Style */}
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

  const renderSpots = () => {
    const filtered = restaurants.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" placeholder="Search restaurants..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 py-3.5 pl-12 pr-4 rounded-2xl font-medium focus:ring-2 focus:ring-orange-500 shadow-sm transition-all" />
        </div>
        <h3 className="font-bold text-slate-800 mb-4 px-1">All Spots</h3>
        <div className="space-y-3">
          {filtered.map(res => (
            <div key={res.id} onClick={() => { setSelectedRes(res); setActiveView('restaurant'); }} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:border-orange-200 transition-colors">
              <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-3xl border border-orange-100">{res.img}</div>
              <div className="flex-1"><h4 className="font-bold text-slate-800 text-lg">{res.name}</h4><p className="text-sm text-slate-500">{res.category}</p></div>
              <ChevronRight className="text-slate-300" size={20} />
            </div>
          ))}
        </div>
      </div>
    );
  };

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
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border"><div className="text-slate-400 mb-1"><Share2 size={24} /></div><div className="text-2xl font-black">{userData.hacksCount}</div><div className="text-xs font-bold text-slate-500">Hacks Posted</div></div>
        <div className="bg-white p-5 rounded-3xl border"><div className="text-green-500 mb-1 font-black text-2xl">₱</div><div className="text-2xl font-black">{userData.totalSavings}</div><div className="text-xs font-bold text-slate-500">Total Savings</div></div>
      </div>
    </div>
  );

  const renderPro = () => (
    <div className="flex-1 overflow-y-auto bg-slate-900 text-white p-6 relative overflow-hidden">
      <div className="pt-8 mb-10"><h2 className="text-4xl font-black mb-4">Unlock <span className="text-orange-400">PRO</span></h2><p className="text-slate-400">Get lifetime access to every secret hack.</p></div>
      {userData.isPro ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-3xl p-6 text-center"><CheckCircle size={48} className="text-green-400 mx-auto mb-4" /><h3 className="text-xl font-black">You are PRO!</h3></div>
      ) : (
        <div className="space-y-4 relative z-10">
          <button onClick={() => handleUpgradePro('pay')} className="w-full bg-white text-slate-900 p-5 rounded-3xl font-black text-lg flex justify-between items-center shadow-lg"><span>Pay Once</span><span className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm">₱35.00</span></button>
          <button onClick={() => handleUpgradePro('points')} disabled={userData.points < 1000} className={`w-full p-5 rounded-3xl font-black text-lg flex justify-between items-center border-2 ${userData.points >= 1000 ? 'bg-orange-500 border-orange-400 shadow-orange-500/20 shadow-xl' : 'bg-slate-800 border-slate-700 text-slate-500'}`}><span>Redeem Points</span><span className="text-sm">1,000 pts</span></button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 max-w-md mx-auto relative overflow-hidden font-sans">
      {isDummyConfig && (
        <div className="bg-red-600 text-white p-4 text-center text-xs font-bold z-[999] shadow-md">
          ⚠️ URGENT: The app is using placeholder Firebase keys. Please open src/App.jsx on your computer and paste your REAL keys from the Firebase Console to fix the permission errors.
        </div>
      )}
      {activeView === 'main' && renderHeader()}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {activeView === 'restaurant' && renderRestaurant()}
        {activeView === 'main' && (
          <>{currentTab === 'map' && renderMap()}{currentTab === 'spots' && renderSpots()}{currentTab === 'profile' && renderProfile()}{currentTab === 'pro' && renderPro()}</>
        )}
      </main>
      {activeView === 'main' && renderTabBar()}
      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-5 py-2.5 rounded-full shadow-2xl z-[200] flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4"><Info size={16} className="text-orange-400" /><p className="font-bold text-sm">{toast}</p></div>}
      
      {/* Version 2 Simple Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative">
            <button onClick={() => setShowVerifyModal(false)} className="absolute top-6 right-6 p-2 rounded-full"><X size={20} /></button>
            <h3 className="text-2xl font-black text-center mb-8">Verify Account</h3>
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <input type="text" maxLength={4} value={otpInput} onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))} className="w-full text-center text-3xl tracking-[1em] font-black bg-slate-50 py-4 rounded-2xl outline-none border focus:ring-4 focus:ring-blue-500/10" placeholder="••••" />
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg">Confirm OTP</button>
              <p className="text-center text-xs font-bold text-slate-400">Hint: Use code 1234</p>
            </form>
          </div>
        </div>
      )}
      
      {showAddHackModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in"><div className="bg-white w-full max-w-md sm:rounded-[32px] rounded-t-[32px] p-6 pt-8 shadow-2xl relative max-h-[90vh] flex flex-col animate-in slide-in-from-bottom"><button onClick={() => setShowAddHackModal(false)} className="absolute top-6 right-6 p-2 rounded-full"><X size={20} /></button><h3 className="text-2xl font-black mb-6">Share a Hack</h3><form onSubmit={submitHack} className="space-y-4"><div><label className="text-xs font-bold text-slate-500 uppercase">Title</label><input required name="title" className="w-full bg-slate-50 px-4 py-3.5 rounded-2xl font-bold border" /></div><div><label className="text-xs font-bold text-slate-500 uppercase">Description</label><textarea required name="desc" rows={3} className="w-full bg-slate-50 px-4 py-3.5 rounded-2xl border"></textarea></div><div><label className="text-xs font-bold text-slate-500 uppercase">Savings (₱)</label><input required name="savings" type="number" className="w-full bg-slate-50 px-4 py-3.5 rounded-2xl font-black border" /></div><button type="submit" className="w-full py-4 bg-orange-500 text-white font-black rounded-xl shadow-lg">Submit & Earn +50 Pts</button></form></div></div>
      )}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in"><div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative animate-in zoom-in-95"><button onClick={() => setShowEditProfileModal(false)} className="absolute top-6 right-6 p-2 rounded-full"><X size={20} /></button><h3 className="text-2xl font-black mb-6">Edit Profile</h3><form onSubmit={handleUpdateProfile} className="space-y-4"><div><label className="text-xs font-bold text-slate-500 uppercase">Username</label><input required value={editForm.username} onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))} className="w-full bg-slate-50 px-4 py-3.5 rounded-2xl font-bold border" /></div><div className="grid grid-cols-5 gap-2">{['👤', '🍔', '🍕', '🍗', '🍟', '🧋', '☕', '🍩', '🌮', '🍦'].map(emoji => (<button key={emoji} type="button" onClick={() => setEditForm(prev => ({ ...prev, avatar: emoji }))} className={`text-2xl p-2 rounded-xl border transition-all ${editForm.avatar === emoji ? 'bg-orange-100 border-orange-500 scale-110' : 'bg-slate-50'}`}>{emoji}</button>))}</div><button type="submit" className="w-full py-4 bg-orange-500 text-white font-black rounded-xl">Save Changes</button></form></div></div>
      )}
    </div>
  );
}
