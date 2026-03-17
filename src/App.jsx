import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Utensils, User, Lock, Search, Plus, ArrowUpCircle, 
  X, List, ShieldCheck, Star, Zap, CheckCircle, 
  ChevronRight, Share2, Info, Heart, Edit,
  MapPin, Map as MapIcon, Navigation2, Car, Shield, Check, Trash2, Ban,
  AlertTriangle, BarChart3, Settings, MessageSquare, Pin, Megaphone,
  TrendingUp, EyeOff, AlertOctagon, Bell, Users, Activity,
  FileSpreadsheet, FileCode2, Store, LogOut, Trophy,
  Smartphone, Instagram, Link as LinkIcon, Compass, MapPin as MapPinIcon
} from 'lucide-react';

// --- Default Location: Tayuman, Tondo, Manila ---
const DEFAULT_LOC = { lat: 14.6116, lng: 120.9780 };

// --- Mock Data ---
const MOCK_RESTAURANTS = [
  { id: '1', name: 'Jollibee SM San Lazaro', category: 'Fast Food', rating: 4.8, address: 'Tayuman St', lat: 14.6125, lng: 120.9790, img: '🐝', verified: true },
  { id: '2', name: "McDonald's Tayuman", category: 'Fast Food', rating: 4.5, address: 'Tayuman cor Rizal Ave', lat: 14.6110, lng: 120.9770, img: '🍔', verified: true },
  { id: '3', name: 'Mang Inasal', category: 'Fast Food', rating: 4.7, address: 'SM City San Lazaro', lat: 14.6130, lng: 120.9760, img: '🍗', verified: true },
  { id: '4', name: 'Greenwich', category: 'Pizza', rating: 4.3, address: 'Tayuman Center', lat: 14.6105, lng: 120.9795, img: '🍕', verified: true },
  { id: '5', name: 'Starbucks', category: 'Coffee', rating: 4.6, address: 'SM San Lazaro', lat: 14.6140, lng: 120.9800, img: '☕', verified: false }
];

const MOCK_PROMOS = [
  { id: 'p1', resId: '1', title: 'Payday Deal: 50% OFF Buckets', source: 'Official FB', verified: true },
];

const MOCK_HACKS = [
  { id: 'h1', resId: '1', title: 'Chickenjoy Unli-Gravy Trick', desc: 'Ask for a "Solo" gravy cup, then request a refill right after they pour it. They give double!', savings: 15, votes: 342, user: 'PinoyEater', avatar: '🍗', status: 'approved', isPinned: true },
  { id: 'h2', resId: '1', title: 'Ala Carte + Rice Combo', desc: 'Buying Ala Carte Chicken + Extra Rice is ₱5 cheaper than the meal if you have your own water.', savings: 5, votes: 89, user: 'HackMaster', avatar: '🧠', status: 'approved', isPinned: false },
  { id: 'h3', resId: '2', title: 'Fresh Fries Hack', desc: 'Order fries with "No Salt". They have to cook a fresh batch. Ask for salt packets on the side.', savings: 0, votes: 512, user: 'FryGuy', avatar: '🍟', status: 'approved', isPinned: false },
  { id: 'h4', resId: '3', title: 'Free Soup Refill', desc: 'Always ask for extra sinigang soup before they serve your meal.', savings: 10, votes: 45, user: 'SpamBot99', avatar: '🤖', status: 'pending', isPinned: false },
];

const TIERS = [
  { name: 'Tipid Legend', icon: '💎', minPoints: 2500, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' },
  { name: 'Hack Master', icon: '🥇', minPoints: 1000, color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
  { name: 'Deal Hunter', icon: '🥈', minPoints: 500, color: 'text-slate-600', bg: 'bg-slate-200', border: 'border-slate-300' },
  { name: 'Smart Spender', icon: '🥉', minPoints: 200, color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-200' },
  { name: 'Newbie Saver', icon: '🥚', minPoints: 0, color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' }
];

// --- Robust Leaflet Map Component ---
const LeafletMap = ({ center, markers = [], onMarkerClick, onMapClick, userLocation, onRecenter, mini = false }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // 1. Initialize Map & Click Handlers
  useEffect(() => {
    if (!window.L || !mapRef.current) return;

    if (!mapInstance.current) {
      const map = window.L.map(mapRef.current, { 
        zoomControl: !mini,
        dragging: !mini,
        touchZoom: !mini,
        scrollWheelZoom: !mini,
        doubleClickZoom: !mini,
        keyboard: !mini
      }).setView([center.lat, center.lng], mini ? 16 : 15);
      
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: mini ? '' : '&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      mapInstance.current = map;
    }

    const map = mapInstance.current;
    map.off('click'); // Clear stale handlers
    if (onMapClick) {
      map.on('click', (e) => onMapClick(e.latlng));
    }
  }, [mini, onMapClick, center.lat, center.lng]);

  // 2. Manage View, Markers, and User Location
  useEffect(() => {
    if (!mapInstance.current || !window.L) return;
    const map = mapInstance.current;
    
    // Smoothly pan to new center
    map.setView([center.lat, center.lng]);

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof window.L.Marker) {
        layer.remove();
      }
    });

    // Render Data Markers
    markers.forEach(m => {
      const isUser = m.type === 'user';
      const isPromoted = m.isPromoted;
      const borderColor = isUser ? 'border-blue-500' : isPromoted ? 'border-amber-400' : 'border-orange-500';
      const bgColor = isPromoted ? 'bg-gradient-to-br from-amber-200 to-yellow-400' : 'bg-white';
      const glow = isPromoted ? 'shadow-[0_0_15px_rgba(251,191,36,0.8)]' : 'shadow-lg';
      
      const iconHtml = `<div class="w-10 h-10 ${bgColor} rounded-full flex items-center justify-center ${glow} border-2 ${borderColor} text-xl relative">
        ${m.img || '📍'}
        ${isPromoted ? '<div class="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] px-1 rounded font-black border border-white">AD</div>' : ''}
      </div>`;
      
      const icon = window.L.divIcon({
        className: 'bg-transparent',
        html: iconHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });

      const marker = window.L.marker([m.lat, m.lng], { icon }).addTo(map);
      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(m));
      }
    });

    // Render User/Admin Location Marker
    if (userLocation) {
      const userIconHtml = `<div class="relative w-6 h-6"><div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div><div class="relative w-6 h-6 bg-blue-600 border-4 border-white rounded-full shadow-lg"></div></div>`;
      const userIcon = window.L.divIcon({
        className: 'bg-transparent',
        html: userIconHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      window.L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
    }
  }, [center, markers, userLocation, onMarkerClick]);

  // 3. Cleanup on Unmount
  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-full z-0 ${mini ? 'pointer-events-none' : ''}`}>
      <div ref={mapRef} className="w-full h-full" style={{ zIndex: 0 }} />
      {onRecenter && !mini && (
        <button 
          onClick={onRecenter}
          className="absolute bottom-6 right-4 z-[400] bg-white p-3 rounded-full shadow-xl border border-slate-200 text-blue-600 hover:bg-blue-50 active:scale-95 transition-all"
          title="My Location"
        >
          <Compass size={24} />
        </button>
      )}
    </div>
  );
};

export default function App() {
  const [appState, setAppState] = useState('login'); 
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const [leafletReady, setLeafletReady] = useState(false);
  const [mapCenter, setMapCenter] = useState(DEFAULT_LOC);
  const [userLoc, setUserLoc] = useState(DEFAULT_LOC);

  const [userData, setUserData] = useState({ 
    points: 50, isPro: false, isVerified: false, username: 'Foodie', fullName: '', email: 'foodie@example.com', dob: '', whatsapp: '', messenger: '', instagram: '', avatar: '👤', favorites: [], following: [], hacksCount: 0, totalSavings: 0, isAdmin: false
  });
  
  const [restaurants, setRestaurants] = useState(MOCK_RESTAURANTS);
  const [hacks, setHacks] = useState(MOCK_HACKS);
  const [promos, setPromos] = useState(MOCK_PROMOS);
  const [globalAnnouncement, setGlobalAnnouncement] = useState('');
  
  const [usersList, setUsersList] = useState([
    { id: '001', username: 'PinoyEater', email: 'pinoy@eater.com', isVerified: true, status: 'active', joined: '2023-10-12', points: 1200, warnings: 0, posts: 12, lastLogin: '2026-03-17', lat: 14.6120, lng: 120.9785, img: '👤' },
    { id: '002', username: 'HackMaster', email: 'master@hack.com', isVerified: true, status: 'active', joined: '2023-11-05', points: 300, warnings: 1, posts: 5, lastLogin: '2026-03-16', lat: 14.6100, lng: 120.9765, img: '🧠' },
    { id: '003', username: 'SpamBot99', email: 'spam@bot.com', isVerified: false, status: 'shadowbanned', joined: '2024-01-20', points: 0, warnings: 3, posts: 0, lastLogin: '2026-02-10', lat: 14.6135, lng: 120.9775, img: '🤖' },
  ]);
  const [businessRequests, setBusinessRequests] = useState([]);
  const [activeBusinesses, setActiveBusinesses] = useState([]);
  const [reportsList, setReportsList] = useState([]);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [appSettings, setAppSettings] = useState({ autoApproveHacks: false, requireOTP: true });

  const [adminTab, setAdminTab] = useState('dashboard');
  const [adminSearch, setAdminSearch] = useState('');
  const [adminSelectedMarker, setAdminSelectedMarker] = useState(null);

  const [currentTab, setCurrentTab] = useState('spots');
  const [activeView, setActiveView] = useState('main'); 
  const [selectedRes, setSelectedRes] = useState(null);
  
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showAddHackModal, setShowAddHackModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  
  const [otpInput, setOtpInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editForm, setEditForm] = useState({ username: '', fullName: '', email: '', password: '', dob: '', whatsapp: '', messenger: '', instagram: '', avatar: '' });
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [broadcastInput, setBroadcastInput] = useState('');
  const [toast, setToast] = useState('');

  // States for adding new restaurants
  const [isAddingNewRes, setIsAddingNewRes] = useState(false);
  const [newResForm, setNewResForm] = useState({ name: '', address: '', category: 'Fast Food', img: '📍', lat: DEFAULT_LOC.lat, lng: DEFAULT_LOC.lng });

  // States for Business Owner Claim/Add
  const [ownerTab, setOwnerTab] = useState('claim'); // 'claim' | 'new'
  const [promoteListing, setPromoteListing] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const logoTapCount = useRef(0);
  const logoTapTimeout = useRef(null);

  const userTier = useMemo(() => TIERS.find(t => (userData.points || 0) >= t.minPoints) || TIERS[TIERS.length - 1], [userData.points]);

  useEffect(() => {
    if (window.L) {
      setLeafletReady(true);
      return;
    }
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(style);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => setLeafletReady(true);
    document.head.appendChild(script);
  }, []);

  const showToastMessage = (msg) => { 
    if (typeof msg !== 'string') return;
    setToast(msg); 
    setTimeout(() => setToast(''), 3000); 
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLoc(newLoc);
        setMapCenter(newLoc);
        showToastMessage("Location updated!");
      }, () => {
        showToastMessage("Location access denied. Using default.");
        setMapCenter(DEFAULT_LOC);
      });
    }
  };

  const handleLogoTap = () => {
    logoTapCount.current += 1;
    if (logoTapTimeout.current) clearTimeout(logoTapTimeout.current);

    if (logoTapCount.current >= 10) {
      logoTapCount.current = 0;
      setShowAdminAuthModal(true);
    } else {
      logoTapTimeout.current = setTimeout(() => {
        logoTapCount.current = 0;
      }, 1000);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasswordInput === 'foodhacks101') {
      setShowAdminAuthModal(false);
      setAdminPasswordInput('');
      setUserData(prev => ({ ...prev, isAdmin: true }));
      setActiveView('admin');
      showToastMessage("Super Admin Access Granted.");
    } else {
      setAdminPasswordInput('');
      showToastMessage("Incorrect admin password.");
    }
  };

  const handleAdminLogout = () => {
    if (window.confirm("Are you sure you want to log out of the Admin Panel?")) {
      setUserData(prev => ({ ...prev, isAdmin: false }));
      setActiveView('main');
      showToastMessage("Logged out of Admin Panel.");
    }
  };

  const handleGuestLogin = () => {
    setAppState('main');
    showToastMessage("Welcome, Guest!");
  };

  const handleEmailAuth = (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setAppState('main');
      showToastMessage(appState === 'login' ? "Logged in successfully!" : "Account created successfully!");
    }, 800);
  };
  
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otpInput === '1234') {
      setUserData(prev => ({ ...prev, isVerified: true, points: prev.points + 100 }));
      setShowVerifyModal(false);
      setOtpInput('');
      showToastMessage("Verified! +100 Points");
    } else showToastMessage("Invalid OTP. Hint: Use 1234");
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setUserData(prev => ({ ...prev, username: editForm.username, avatar: editForm.avatar, fullName: editForm.fullName, email: editForm.email, dob: editForm.dob, whatsapp: editForm.whatsapp, messenger: editForm.messenger, instagram: editForm.instagram }));
    setShowEditProfileModal(false);
    showToastMessage("Profile & Settings updated!");
  };

  const saveNewRestaurant = () => {
    if (!newResForm.name || !newResForm.address) return showToastMessage("Please fill in Name and Address.");
    const newRes = {
      id: Math.random().toString(36).substr(2, 9),
      name: newResForm.name,
      category: newResForm.category,
      address: newResForm.address,
      lat: newResForm.lat,
      lng: newResForm.lng,
      rating: 0,
      img: newResForm.img,
      verified: false
    };
    setRestaurants(prev => [newRes, ...prev]);
    setSelectedRes(newRes);
    setIsAddingNewRes(false);
    showToastMessage("Restaurant added successfully!");
  };

  const submitHack = (e) => {
    e.preventDefault();
    if (!userData.isVerified && appSettings.requireOTP) {
      setShowAddHackModal(false);
      return setShowVerifyModal(true);
    }
    
    if (!selectedRes) return showToastMessage("Please select a restaurant first.");

    const formData = new FormData(e.target);
    const newHack = {
      id: Math.random().toString(36).substr(2, 9),
      resId: selectedRes.id, 
      title: formData.get('title'), 
      desc: formData.get('desc'),
      savings: Number(formData.get('savings')), 
      votes: 1, 
      user: userData.username,
      avatar: userData.avatar, 
      status: appSettings.autoApproveHacks ? 'approved' : 'pending',
      isPinned: false
    };

    setHacks(prev => [newHack, ...prev]);
    setUserData(prev => ({ ...prev, points: prev.points + 50, hacksCount: prev.hacksCount + 1, totalSavings: prev.totalSavings + Number(formData.get('savings')) }));
    setShowAddHackModal(false);
    showToastMessage(appSettings.autoApproveHacks ? "Hack published! +50 Points" : "Hack submitted for review! +50 Points");
  };

  const submitBusinessFlow = (e) => {
    e.preventDefault();
    if (ownerTab === 'claim') {
      const newReq = { id: Math.random().toString(36).substr(2, 9), restaurant: selectedRes?.name || 'Unknown', user: userData.username, email: 'business@owner.com', status: 'pending', date: new Date().toISOString().split('T')[0] };
      setBusinessRequests(prev => [newReq, ...prev]);
      setShowBusinessModal(false);
      showToastMessage("Claim requested! Our team will verify soon.");
    } else {
      if (promoteListing) {
        setProcessingPayment(true);
        setTimeout(() => {
          setProcessingPayment(false);
          finalizeBusinessAdd();
        }, 1500);
      } else {
        finalizeBusinessAdd();
      }
    }
  };

  const finalizeBusinessAdd = () => {
    const newRes = {
      id: Math.random().toString(36).substr(2, 9),
      name: newResForm.name,
      category: newResForm.category,
      address: newResForm.address,
      lat: newResForm.lat,
      lng: newResForm.lng,
      rating: 0,
      img: newResForm.img,
      verified: true,
      isPromoted: promoteListing
    };
    setRestaurants(prev => [newRes, ...prev]);
    setActiveBusinesses(prev => [{ id: newRes.id, restaurant: newRes.name, email: userData.email, views: 0, promosActive: 0 }, ...prev]);
    setShowBusinessModal(false);
    showToastMessage(promoteListing ? "Payment Success! Promoted listing added." : "Business listed successfully.");
  };

  const openNav = (type, lat, lng) => {
    const urls = { google: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, apple: `http://maps.apple.com/?daddr=${lat},${lng}`, waze: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes` };
    window.open(urls[type]);
  };

  // --- Views ---
  if (appState === 'login' || appState === 'register') {
    return (
      <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-900 max-w-md mx-auto relative overflow-hidden font-sans">
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white relative">
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
          <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center text-5xl shadow-2xl shadow-orange-900/20 mb-6 z-10 transform rotate-[-10deg]">🍔</div>
          <h1 className="text-4xl font-black italic tracking-tighter mb-2 z-10">Tipid Menu</h1>
          <p className="text-orange-100 font-medium mb-10 z-10 text-center">Smart Savings for the Filipino Foodie.</p>

          <form onSubmit={handleEmailAuth} className="w-full bg-white p-8 rounded-[32px] shadow-2xl z-10 text-slate-800 flex flex-col gap-4 animate-in slide-in-from-bottom-8">
            <h2 className="text-2xl font-black mb-2 text-center text-slate-900">{appState === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            
            {authError && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-3 rounded-xl text-center">
                {authError}
              </div>
            )}
            
            <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Email Address</label><input required type="email" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} className="w-full bg-slate-50 px-5 py-4 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none focus:ring-2 focus:ring-orange-500/20 mt-1 transition-all" placeholder="juan@example.com" /></div>
            <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Password</label><input required type="password" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} className="w-full bg-slate-50 px-5 py-4 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none focus:ring-2 focus:ring-orange-500/20 mt-1 transition-all" placeholder="••••••••" /></div>

            <button disabled={authLoading} type="submit" className="w-full py-4 mt-2 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-600/20 uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
              {authLoading ? 'Please wait...' : (appState === 'login' ? 'Sign In' : 'Sign Up')}
            </button>
            <div className="text-center mt-1"><button type="button" onClick={() => setAppState(appState === 'login' ? 'register' : 'login')} className="text-xs font-bold text-slate-400 hover:text-orange-500 transition-colors">{appState === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}</button></div>
            <div className="flex items-center gap-4 my-2"><div className="h-px bg-slate-100 flex-1"></div><span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">OR</span><div className="h-px bg-slate-100 flex-1"></div></div>
            <button type="button" onClick={handleGuestLogin} className="relative z-20 w-full py-4 bg-slate-900/5 hover:bg-slate-900/10 text-slate-700 font-black rounded-2xl border border-slate-200 uppercase text-xs tracking-widest active:scale-95 transition-all shadow-sm">Continue as Guest</button>
          </form>
        </div>
      </div>
    );
  }

  const renderAdmin = () => {
    const adminNavTabs = [
      { id: 'dashboard', icon: Activity, label: 'Overview' },
      { id: 'map', icon: MapIcon, label: 'Map View' },
      { id: 'users', icon: Users, label: 'Users' }
    ];

    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 animate-in slide-in-from-bottom duration-300 z-50 fixed inset-0 max-w-md mx-auto">
        <div className="bg-slate-900 pt-10 pb-4 shadow-xl z-20 flex-shrink-0">
          <div className="flex justify-between items-center text-white px-5 mb-6">
            <h2 className="text-xl font-black flex items-center gap-2"><Shield size={24} className="text-orange-500"/> Command Center</h2>
            <div className="flex gap-2">
              <button onClick={() => setActiveView('main')} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors" title="Back to App"><X size={20}/></button>
              <button onClick={handleAdminLogout} className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors" title="Sign Out of Admin"><LogOut size={20}/></button>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-2">
            {adminNavTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setAdminTab(tab.id)} className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all ${adminTab === tab.id ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                  <Icon size={14}/> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-100 flex flex-col">
          {adminTab === 'dashboard' && (
            <div className="p-5 space-y-4 animate-in fade-in">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-2">Community Overview</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200"><div className="text-slate-400 mb-1"><Users size={20}/></div><div className="text-2xl font-black text-slate-800">{usersList.length}</div><div className="text-[10px] font-bold text-slate-500 uppercase">Total Users</div></div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200"><div className="text-orange-500 mb-1"><Utensils size={20}/></div><div className="text-2xl font-black text-slate-800">{hacks.length}</div><div className="text-[10px] font-bold text-slate-500 uppercase">Total Hacks</div></div>
              </div>
            </div>
          )}
          {adminTab === 'map' && (
            <div className="flex-1 relative animate-in fade-in flex flex-col min-h-[60vh] p-4">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-2">Location Radar</h3>
              <div className="flex-1 rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative bg-slate-200">
                {leafletReady && (
                  <LeafletMap 
                    center={mapCenter} 
                    userLocation={userLoc}
                    markers={[
                      ...restaurants.map(r => ({...r, type: 'business'})),
                      ...usersList.filter(u => u.lat && u.lng).map(u => ({...u, type: 'user'}))
                    ]}
                    onMarkerClick={(m) => setAdminSelectedMarker(m)}
                    onRecenter={handleGetLocation}
                  />
                )}
                {adminSelectedMarker && (
                  <div className="absolute bottom-4 left-4 right-4 z-[400] bg-white p-4 rounded-xl shadow-2xl border border-slate-200 flex justify-between items-center animate-in slide-in-from-bottom">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 ${adminSelectedMarker.type === 'user' ? 'border-blue-500 bg-blue-50' : 'border-orange-500 bg-orange-50'}`}>{adminSelectedMarker.img}</div>
                      <div>
                        <h4 className="font-black text-slate-800 leading-tight">{adminSelectedMarker.name || adminSelectedMarker.username}</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{adminSelectedMarker.type}</p>
                      </div>
                    </div>
                    <button onClick={() => setAdminSelectedMarker(null)} className="p-2 bg-slate-100 rounded-full text-slate-500"><X size={16}/></button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderHeader = () => (
    <header className="bg-white px-5 py-4 shadow-sm z-20 flex justify-between items-center sticky top-0">
      <h1 onClick={handleLogoTap} className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 italic uppercase tracking-tighter select-none cursor-pointer">
        Tipid Menu
      </h1>
      <div className="flex items-center gap-3">
        {userData.isAdmin && (
          <button onClick={() => setActiveView('admin')} className="w-10 h-10 bg-slate-900 text-orange-400 rounded-full flex items-center justify-center shadow-md hover:bg-slate-800 transition-colors active:scale-95 border border-slate-700 shrink-0" title="Command Center">
            <Shield size={20} />
          </button>
        )}
        <button onClick={() => setCurrentTab('profile')} className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 active:scale-95 transition-transform h-10">
          <div className="flex flex-col items-end justify-center">
            <span className="text-[11px] font-black text-orange-700 leading-none mb-0.5">{userData.points} pts</span>
            <span className="text-[9px] font-bold text-orange-500 leading-none">{userTier.name}</span>
          </div>
          <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-sm border border-orange-200">{userData.avatar}</div>
        </button>
      </div>
    </header>
  );

  const renderTabBar = () => (
    <nav className="bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-3 flex justify-between items-center sticky bottom-0 z-30 pb-safe">
      <button onClick={() => setCurrentTab('map')} className={`flex flex-col items-center gap-1.5 transition-colors ${currentTab === 'map' ? 'text-orange-600' : 'text-slate-300'}`}><MapPinIcon size={22} /><span className="text-[10px] font-black uppercase tracking-widest">Near</span></button>
      <button onClick={() => setCurrentTab('spots')} className={`flex flex-col items-center gap-1.5 transition-colors ${currentTab === 'spots' ? 'text-orange-600' : 'text-slate-300'}`}><List size={22} /><span className="text-[10px] font-black uppercase tracking-widest">Spots</span></button>
      <button onClick={() => { if(selectedRes) setShowAddHackModal(true); else setCurrentTab('spots'); }} className="bg-gradient-to-br from-orange-500 to-amber-500 p-4 rounded-full text-white shadow-xl shadow-orange-500/30 transform -translate-y-6 hover:scale-110 active:scale-95 transition-all"><Plus size={24}/></button>
      <button onClick={() => setCurrentTab('pro')} className={`flex flex-col items-center gap-1.5 transition-colors ${currentTab === 'pro' ? 'text-orange-600' : 'text-slate-300'}`}><Zap size={22} className={currentTab === 'pro' ? 'fill-orange-50' : ''}/><span className="text-[10px] font-black uppercase tracking-widest">PRO</span></button>
      <button onClick={() => setCurrentTab('profile')} className={`flex flex-col items-center gap-1.5 transition-colors ${currentTab === 'profile' ? 'text-orange-600' : 'text-slate-300'}`}><User size={22} className={currentTab === 'profile' ? 'fill-orange-50' : ''}/><span className="text-[10px] font-black uppercase tracking-widest">Me</span></button>
    </nav>
  );

  const renderMap = () => (
    <div className="flex-1 relative bg-[#E2E8F0] overflow-hidden">
      {leafletReady ? (
        <LeafletMap 
          center={mapCenter} 
          userLocation={userLoc}
          markers={restaurants.map(r => ({...r, type: 'business'}))}
          onMarkerClick={(m) => { setSelectedRes(m); setActiveView('restaurant'); }}
          onRecenter={handleGetLocation}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-100"><p className="font-bold text-slate-500 animate-pulse">Loading Map Engine...</p></div>
      )}
    </div>
  );

  const renderSpots = () => {
    const filtered = restaurants.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50 p-5 pb-24">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" placeholder="Search restaurants, brands..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 py-3.5 pl-12 pr-4 rounded-2xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm transition-all" />
        </div>
        <h3 className="font-black text-slate-800 mb-6 uppercase tracking-widest text-sm flex items-center gap-2"><List size={18} className="text-orange-500" /> Discover Spots</h3>
        <div className="space-y-3">
          {filtered.map(res => (
            <div key={res.id} onClick={() => { setSelectedRes(res); setActiveView('restaurant'); }} className={`bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer transition-colors group active:scale-[0.98] ${res.isPromoted ? 'border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.15)] bg-amber-50/20' : 'border-slate-100 hover:border-orange-200'}`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl border ${res.isPromoted ? 'bg-gradient-to-br from-amber-100 to-yellow-200 border-amber-300' : 'bg-orange-50 border-orange-100'}`}>{res.img}</div>
              <div className="flex-1">
                <h4 className="font-black text-slate-800 group-hover:text-orange-600 transition-colors flex items-center gap-2">
                  {res.name}
                  {res.isPromoted && <span className="bg-amber-500 text-white text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest">AD</span>}
                </h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{res.category}</p>
              </div>
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
    const resHacks = hacks.filter(h => h.resId === selectedRes.id && h.status === 'approved').sort((a,b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.votes - a.votes;
    });
    
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50 pb-8 animate-in slide-in-from-right duration-300">
        <div className="bg-white px-5 pt-4 pb-6 shadow-sm sticky top-0 z-10 flex flex-col gap-4">
          <button onClick={() => setActiveView('main')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 w-fit"><X size={20} /> Back</button>
          
          {/* Mini-Map Preview */}
          <div className="h-32 w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative bg-slate-100 z-0">
            {leafletReady && (
              <LeafletMap 
                center={{ lat: selectedRes.lat, lng: selectedRes.lng }}
                markers={[{...selectedRes, type: 'business'}]}
                mini={true}
              />
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border shadow-sm ${selectedRes.isPromoted ? 'bg-gradient-to-br from-amber-100 to-yellow-200 border-amber-300' : 'bg-orange-50 border-orange-100'}`}>{selectedRes.img}</div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">{selectedRes.name}</h2>
              <div className="flex items-center gap-2 mt-1"><span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{selectedRes.category} • ⭐ {selectedRes.rating}</span></div>
            </div>
          </div>
        </div>
        
        <div className="p-5 space-y-6">
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => openNav('google', selectedRes.lat, selectedRes.lng)} className="flex flex-col items-center gap-1 p-3 bg-white border border-slate-200 rounded-xl hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 text-slate-600 transition-colors shadow-sm"><MapIcon size={18}/><span className="font-black text-[9px] uppercase tracking-tighter">Google</span></button>
            <button onClick={() => openNav('apple', selectedRes.lat, selectedRes.lng)} className="flex flex-col items-center gap-1 p-3 bg-white border border-slate-200 rounded-xl hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 text-slate-600 transition-colors shadow-sm"><Navigation2 size={18}/><span className="font-black text-[9px] uppercase tracking-tighter">Apple</span></button>
            <button onClick={() => openNav('waze', selectedRes.lat, selectedRes.lng)} className="flex flex-col items-center gap-1 p-3 bg-white border border-slate-200 rounded-xl hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 text-slate-600 transition-colors shadow-sm"><Car size={18}/><span className="font-black text-[9px] uppercase tracking-tighter">Waze</span></button>
          </div>

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
            <div className="flex justify-between items-end mb-4"><h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><Utensils size={20} className="text-orange-500" /> Secret Hacks</h3></div>
            <div className="space-y-4">
              {resHacks.length > 0 ? (
                resHacks.map((hack, idx) => {
                  const isLocked = idx > 0 && !userData.isPro;
                  return (
                    <div key={hack.id} className={`bg-white border rounded-2xl p-4 relative overflow-hidden shadow-sm ${hack.isPinned ? 'border-orange-300 shadow-orange-500/10' : 'border-slate-100'}`}>
                      {isLocked && <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px] z-10 flex flex-col items-center justify-center p-4 text-center"><Lock size={32} className="text-slate-400 mb-2"/><p className="font-bold text-slate-700 mb-3 text-xs">Unlock PRO to see more hacks</p><button onClick={() => { setActiveView('main'); setCurrentTab('pro'); }} className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-xl font-bold text-xs shadow-md">View PRO</button></div>}
                      
                      {hack.isPinned && <div className="absolute top-0 right-0 bg-gradient-to-bl from-orange-500 to-amber-500 text-white px-3 py-1 rounded-bl-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-1"><Pin size={10} className="fill-white"/> Pinned by Admin</div>}

                      <h4 className="font-bold text-slate-800 mb-1.5 leading-tight pr-12 text-lg">{hack.title}</h4>
                      <p className="text-sm text-slate-600 mb-4">{hack.desc}</p>
                      
                      <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs border border-slate-200">{hack.avatar}</div>
                          <span className="text-xs font-bold text-slate-500">{hack.user}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleToggleFavorite(hack.id)} className="hover:scale-110 transition-transform"><Heart size={18} className={userData.favorites?.includes(hack.id) ? "fill-red-500 text-red-500" : "text-slate-300"}/></button>
                          <span className="bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded-md text-xs font-black">Save ₱{hack.savings}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 bg-slate-100 rounded-2xl border border-dashed border-slate-300"><p className="text-slate-400 font-bold mb-3">No hacks yet!</p><button onClick={() => setShowAddHackModal(true)} className="bg-white px-4 py-2 rounded-xl text-xs font-black text-orange-600 shadow-sm border border-orange-100">+ Share First Hack</button></div>
              )}
            </div>
          </section>

        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-5 pb-24">
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center mb-6">
        <div className="w-28 h-28 bg-orange-50 rounded-full flex items-center justify-center text-6xl mb-4 border-4 border-white shadow-xl shadow-orange-500/10 relative group">
          {userData.avatar}
          <button onClick={handleOpenEditProfile} className="absolute bottom-0 right-0 p-2 bg-orange-500 text-white rounded-full border-2 border-white shadow-lg active:scale-110 transition-transform"><Edit size={14} /></button>
        </div>
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          {userData.username} {userData.isVerified && <CheckCircle size={20} className="text-blue-500" />}
        </h3>
        <div className={`mt-4 px-5 py-2 rounded-full border flex items-center gap-2 font-black text-xs uppercase tracking-widest ${userTier.bg} ${userTier.color} ${userTier.border}`}>
          {userTier.icon} {userTier.name} • {userData.points} pts
        </div>
      </div>

      {!userData.isVerified && (
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-[32px] p-6 text-white mb-6 shadow-xl shadow-orange-500/20"><h4 className="font-black text-xl mb-2">Verify Account</h4><p className="text-white/80 text-sm font-medium mb-4">Complete your verification to post hacks and unlock +100 Bonus Points.</p><button onClick={() => setShowVerifyModal(true)} className="w-full py-3.5 bg-white text-orange-600 font-black rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all">Start Verification</button></div>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-6"><div className="bg-white p-6 rounded-3xl border border-slate-100 text-center shadow-sm"><Share2 size={24} className="mx-auto mb-2 text-slate-300"/><div className="text-2xl font-black text-slate-800">{userData.hacksCount}</div><div className="text-[10px] font-black uppercase text-slate-400">Hacks Shared</div></div><div className="bg-white p-6 rounded-3xl border border-slate-100 text-center shadow-sm"><div className="text-2xl font-black text-green-500 mb-2">₱</div><div className="text-2xl font-black text-slate-800">{userData.totalSavings}</div><div className="text-[10px] font-black uppercase text-slate-400">Total Savings Shared</div></div></div>

      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex flex-col mb-6">
        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4">For Owners</h4>
        <button onClick={() => { setOwnerTab('new'); setShowBusinessModal(true); }} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg active:scale-95">
          <Store size={18} className="text-orange-400"/> Add My Restaurant
        </button>
      </div>
    </div>
  );

  const renderPro = () => (
    <div className="flex-1 overflow-y-auto bg-slate-900 text-white p-6 pb-24 relative overflow-hidden">
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]"></div>
      <div className="pt-12 mb-10 relative z-10"><div className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 font-black rounded-lg mb-4 uppercase tracking-[0.2em] text-[10px] border border-orange-500/30">Membership</div><h2 className="text-4xl font-black mb-4">Unlock <span className="text-orange-400">PRO</span></h2><p className="text-slate-400 font-medium text-lg">Get lifetime access to every secret hack and exclusive promo codes.</p></div>
      {userData.isPro ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-[32px] p-8 text-center relative z-10"><CheckCircle size={64} className="text-green-400 mx-auto mb-4" /><h3 className="text-2xl font-black text-green-400">PRO Active</h3><p className="text-green-400/60 mt-2 font-medium">Enjoy unlimited savings!</p></div>
      ) : (
        <div className="space-y-4 relative z-10"><button onClick={() => handleUpgradePro('pay')} className="w-full bg-white text-slate-900 p-5 rounded-3xl font-black text-lg flex justify-between items-center shadow-xl active:scale-95 transition-all"><span>Pay Once</span><span className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm">₱35.00</span></button><button onClick={() => handleUpgradePro('points')} disabled={userData.points < 1000} className={`w-full p-5 rounded-3xl font-black text-lg flex justify-between items-center border-2 transition-all ${userData.points >= 1000 ? 'bg-orange-500 border-orange-400 shadow-orange-500/20' : 'bg-slate-800 border-slate-700 text-slate-500'}`}><span>Redeem Points</span><span className="text-sm">1,000 pts</span></button></div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 text-slate-900 max-w-md mx-auto relative overflow-hidden font-sans">
      {appState === 'main' && activeView !== 'admin' && renderHeader()}
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {activeView === 'restaurant' && renderRestaurant()}
        {activeView === 'admin' && renderAdmin()}
        {activeView === 'main' && (
          <>
            {currentTab === 'map' && renderMap()}
            {currentTab === 'spots' && renderSpots()}
            {currentTab === 'profile' && renderProfile()}
            {currentTab === 'pro' && renderPro()}
          </>
        )}
      </main>
      
      {activeView === 'main' && renderTabBar()}
      
      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-5 py-2.5 rounded-full shadow-2xl z-[200] border border-slate-700 animate-in fade-in slide-in-from-top-4 flex items-center gap-2"><Info size={16} className="text-orange-400" /><p className="font-bold text-sm whitespace-nowrap">{toast}</p></div>}

      {/* Secret Admin Modal */}
      {showAdminAuthModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
            <button onClick={() => setShowAdminAuthModal(false)} className="absolute top-8 right-8 p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 active:scale-90 transition-all"><X size={18} /></button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/20"><Shield size={32} /></div>
              <h3 className="text-2xl font-black text-white tracking-tight">Admin Access</h3>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <input type="password" value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} className="w-full text-center text-2xl font-black text-white bg-slate-800 border border-slate-700 py-4 rounded-[28px] outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="••••••••" />
              <button type="submit" className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl uppercase text-xs tracking-widest active:scale-95 transition-all hover:bg-orange-500">Login</button>
            </form>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
            <button onClick={() => setShowVerifyModal(false)} className="absolute top-8 right-8 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 active:scale-90 transition-all"><X size={18} /></button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-inner"><ShieldCheck size={32} /></div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Verification</h3>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mt-1">Enter 4-Digit Code</p>
            </div>
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <input type="text" maxLength={4} value={otpInput} onChange={handleOtpChange} className="w-full text-center text-4xl tracking-[0.8em] font-black text-slate-900 bg-white border border-slate-200 py-6 rounded-[28px] shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all" placeholder="••••" />
              <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl uppercase text-xs tracking-widest active:scale-95 transition-all">Confirm & Verify</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Hack Modal (Updated to support creating new restaurant) */}
      {showAddHackModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md sm:rounded-[40px] rounded-t-[40px] p-8 pt-10 shadow-2xl relative max-h-[90vh] flex flex-col animate-in slide-in-from-bottom">
            <button onClick={() => { setShowAddHackModal(false); setIsAddingNewRes(false); }} className="absolute top-8 right-8 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 active:scale-90 transition-all z-10"><X size={18} /></button>
            
            {isAddingNewRes ? (
              <div className="flex-1 overflow-y-auto no-scrollbar pb-6 space-y-4">
                <div className="mb-6 flex items-center gap-2">
                  <button onClick={() => setIsAddingNewRes(false)} className="p-1 bg-slate-100 rounded-full text-slate-500 mr-1"><ChevronRight size={16} className="rotate-180" /></button>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Add Missing Spot</h3>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-0.5">Help the community grow!</p>
                  </div>
                </div>
                
                <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Restaurant Name</label><input required value={newResForm.name} onChange={e => setNewResForm({...newResForm, name: e.target.value})} className="w-full bg-white px-5 py-4 rounded-2xl font-black text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" placeholder="e.g. KFC Tayuman" /></div>
                <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Address / Branch</label><input required value={newResForm.address} onChange={e => setNewResForm({...newResForm, address: e.target.value})} className="w-full bg-white px-5 py-4 rounded-2xl font-medium text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" placeholder="SM City San Lazaro" /></div>
                
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex justify-between items-center mb-1">
                    Pin Location <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">Interactive</span>
                  </label>
                  <div className="h-40 w-full rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100 z-0">
                    {leafletReady && (
                      <LeafletMap 
                        center={{lat: newResForm.lat, lng: newResForm.lng}} 
                        markers={[{lat: newResForm.lat, lng: newResForm.lng, img: '📍', type: 'business'}]}
                        onMapClick={(latlng) => setNewResForm(prev => ({...prev, lat: latlng.lat, lng: latlng.lng}))}
                      />
                    )}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[400] bg-slate-900/80 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-sm pointer-events-none whitespace-nowrap">Tap map to move pin</div>
                  </div>
                </div>

                <button onClick={saveNewRestaurant} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl uppercase text-xs tracking-widest mt-2 hover:scale-[1.02] active:scale-95 transition-all">Save & Continue</button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="mb-6 flex-shrink-0">
                  <h3 className="text-2xl font-black mb-1 flex items-center gap-2 tracking-tight text-slate-800"><Plus size={24} className="text-orange-500"/> Share Hack</h3>
                  {selectedRes ? (
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><MapPinIcon size={12} className="text-orange-400"/> {selectedRes.name}</p>
                  ) : (
                    <div className="mt-3 relative z-10">
                      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl mb-3">
                        <Info size={16} className="text-blue-500 shrink-0"/>
                        <p className="text-[10px] font-bold text-blue-700 leading-snug">Select a restaurant from the map first, or add a missing spot below.</p>
                      </div>
                      <button onClick={() => setIsAddingNewRes(true)} className="w-full py-3 bg-white border border-dashed border-slate-300 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-50 transition-colors">+ Add Missing Restaurant</button>
                    </div>
                  )}
                </div>

                {selectedRes && (
                  <form onSubmit={submitHack} className="flex-1 overflow-y-auto no-scrollbar pb-6 space-y-4">
                    <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Hack Title</label><input required name="title" className="w-full bg-white px-5 py-4 rounded-2xl font-black text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" placeholder="e.g. Solo Gravy Hack" /></div>
                    <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Instructions</label><textarea required name="desc" rows={3} className="w-full bg-white px-5 py-4 rounded-2xl font-medium text-slate-900 border border-slate-200 shadow-sm mt-1 resize-none outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" placeholder="How do we do it?"></textarea></div>
                    <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Savings (₱)</label><input required name="savings" type="number" min="0" className="w-full bg-white px-5 py-4 rounded-2xl font-black text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" placeholder="0" /></div>
                    <button type="submit" className="w-full py-5 bg-orange-600 text-white font-black rounded-[24px] shadow-xl shadow-orange-600/20 uppercase text-xs tracking-[0.2em] mt-4 hover:scale-[1.02] active:scale-95 transition-all">Submit for Review</button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expanded Profile Settings Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-md sm:rounded-[40px] rounded-t-[40px] p-8 pt-10 shadow-2xl relative max-h-[90vh] flex flex-col animate-in slide-in-from-bottom">
            <button onClick={() => setShowEditProfileModal(false)} className="absolute top-8 right-8 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 active:scale-90 transition-all z-10"><X size={18} /></button>
            <div className="mb-6 flex-shrink-0">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Settings</h3>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Manage your profile</p>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="flex-1 overflow-y-auto no-scrollbar pb-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2"><User size={16} className="text-orange-500"/><h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Basic Info</h4></div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Avatar Emoji</label>
                  <div className="grid grid-cols-5 gap-2 mt-1">
                    {['👤', '🍔', '🍕', '🍗', '🍟', '🧋', '☕', '🍩', '🌮', '🍦'].map(emoji => (
                      <button key={emoji} type="button" onClick={() => setEditForm(prev => ({ ...prev, avatar: emoji }))} className={`text-2xl p-2 rounded-xl border-2 transition-all ${editForm.avatar === emoji ? 'bg-orange-50 border-orange-500 scale-110 shadow-sm' : 'bg-white border-slate-200 shadow-sm opacity-60 hover:opacity-100'}`}>{emoji}</button>
                    ))}
                  </div>
                </div>
                <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Username</label><input required value={editForm.username} onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))} className="w-full bg-white px-5 py-4 rounded-2xl font-black text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" /></div>
                <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Full Name</label><input value={editForm.fullName} onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))} className="w-full bg-white px-5 py-4 rounded-2xl font-bold text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" /></div>
                <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Date of Birth</label><input type="date" value={editForm.dob} onChange={(e) => setEditForm(prev => ({ ...prev, dob: e.target.value }))} className="w-full bg-white px-5 py-4 rounded-2xl font-bold text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" /></div>
              </div>
              <div className="pt-4 sticky bottom-0 bg-white border-t border-slate-50">
                <button type="submit" className="w-full py-5 bg-orange-600 text-white font-black rounded-[24px] shadow-xl shadow-orange-600/20 uppercase text-xs tracking-widest active:scale-95 transition-all">Save All Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Business Modal (Claim or Add) */}
      {showBusinessModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md sm:rounded-[40px] rounded-t-[40px] p-8 pt-10 shadow-2xl relative max-h-[90vh] flex flex-col">
            <button onClick={() => setShowBusinessModal(false)} className="absolute top-8 right-8 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 active:scale-90 transition-all z-10"><X size={18} /></button>
            <div className="mb-6 flex-shrink-0">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2"><Store size={24} className="text-orange-500"/> Business Portal</h3>
            </div>
            
            <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-xl flex-shrink-0">
              <button onClick={() => setOwnerTab('claim')} className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${ownerTab === 'claim' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Claim Existing</button>
              <button onClick={() => setOwnerTab('new')} className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${ownerTab === 'new' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Add New</button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
              {ownerTab === 'claim' ? (
                <form onSubmit={submitBusinessFlow} className="space-y-5">
                  {selectedRes ? (
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl mb-4">
                      <p className="text-[10px] font-black uppercase text-orange-400 tracking-widest mb-1">Selected Location</p>
                      <p className="font-black text-orange-900">{selectedRes.name}</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl mb-4 text-center">
                      <p className="text-xs font-bold text-slate-500">Please select a restaurant from the map first to claim it.</p>
                    </div>
                  )}
                  <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Business Email</label><input required type="email" placeholder="manager@restaurant.com" className="w-full bg-white px-5 py-4 rounded-2xl font-black text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" /></div>
                  <button disabled={!selectedRes} type="submit" className={`w-full py-4 text-white font-black rounded-2xl shadow-xl uppercase text-xs tracking-widest transition-all ${selectedRes ? 'bg-slate-900 hover:bg-slate-800 active:scale-95' : 'bg-slate-300'}`}>Submit Claim Request</button>
                </form>
              ) : (
                <form onSubmit={submitBusinessFlow} className="space-y-5">
                  <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 p-3 rounded-xl mb-2">
                    <Info size={16} className="text-blue-500 shrink-0 mt-0.5"/>
                    <p className="text-[10px] font-bold text-blue-700 leading-snug">Owners: Get more foot traffic by adding your spot. Pin your exact location below.</p>
                  </div>

                  <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Restaurant Name</label><input required value={newResForm.name} onChange={e => setNewResForm({...newResForm, name: e.target.value})} className="w-full bg-white px-5 py-3.5 rounded-2xl font-black text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20" placeholder="e.g. My Cafe" /></div>
                  <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Address</label><input required value={newResForm.address} onChange={e => setNewResForm({...newResForm, address: e.target.value})} className="w-full bg-white px-5 py-3.5 rounded-2xl font-medium text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20" placeholder="Street, City" /></div>
                  
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex justify-between items-center mb-1">
                      Set Location <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">Interactive</span>
                    </label>
                    <div className="h-40 w-full rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100 z-0">
                      {leafletReady && (
                        <LeafletMap 
                          center={{lat: newResForm.lat, lng: newResForm.lng}} 
                          markers={[{lat: newResForm.lat, lng: newResForm.lng, img: '📍', type: 'business'}]}
                          onMapClick={(latlng) => setNewResForm(prev => ({...prev, lat: latlng.lat, lng: latlng.lng}))}
                        />
                      )}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[400] bg-slate-900/80 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-sm pointer-events-none whitespace-nowrap">Tap map to move pin</div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border-2 transition-all ${promoteListing ? 'bg-amber-50 border-amber-400' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Star size={16} className={promoteListing ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}/>
                        <h4 className="font-black text-sm text-slate-800">Promoted Listing</h4>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={promoteListing} onChange={() => setPromoteListing(!promoteListing)} />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 leading-snug">Stand out on the Near Me map with a glowing gold pin and "AD" badge. ₱500/month.</p>
                  </div>

                  <button disabled={processingPayment} type="submit" className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl shadow-xl uppercase text-xs tracking-widest mt-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70">
                    {processingPayment ? 'Processing...' : promoteListing ? 'Pay ₱500 & Publish' : 'List Restaurant Free'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
