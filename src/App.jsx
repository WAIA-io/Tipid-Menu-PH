import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Utensils, User, Lock, Search, Plus, ArrowUpCircle, 
  X, List, ShieldCheck, Star, Zap, CheckCircle, 
  ChevronRight, Share2, Info, Heart, Edit,
  MapPin, Map as MapIcon, Navigation2, Car, Shield, Check, Trash2, Ban,
  AlertTriangle, BarChart3, Settings, MessageSquare, Pin, Megaphone,
  TrendingUp, EyeOff, AlertOctagon, Bell, Users, Activity,
  FileSpreadsheet, FileCode2, Store, LogOut, Trophy,
  Smartphone, Instagram, Link as LinkIcon, Compass, Facebook, Mail, Phone, Crown
} from 'lucide-react';

// --- Firebase Integration ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Initialize Firebase with your exact credentials
const firebaseConfig = {
  apiKey: "AIzaSyD_94cFdfFoIy6YgdMhKYuS9M2vjRJN8LU",
  authDomain: "tipid-menu-ph.firebaseapp.com",
  projectId: "tipid-menu-ph",
  storageBucket: "tipid-menu-ph.firebasestorage.app",
  messagingSenderId: "617709691995",
  appId: "1:617709691995:web:42813eb870c1d98135cb7e"
};

let app, auth, db, fbProvider;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  fbProvider = new FacebookAuthProvider();
} catch (e) {
  console.error("Firebase init error:", e);
}

// Use a string constant for the app ID in the database paths
const APP_ID_DB_KEY = 'tipid-menu-ph';

// --- Default Location & Mock Data Fallbacks ---
const DEFAULT_LOC = { lat: 14.6116, lng: 120.9780 };

const MOCK_RESTAURANTS = [
  { id: '1', name: 'Jollibee SM San Lazaro', category: 'Fast Food', rating: 4.8, address: 'Tayuman St', lat: 14.6125, lng: 120.9790, img: '🐝', verified: true, desc: 'The classic Filipino fast-food chain serving world-famous Chickenjoy, sweet style spaghetti, and Peach Mango Pie.' },
  { id: '2', name: "McDonald's Tayuman", category: 'Fast Food', rating: 4.5, address: 'Tayuman cor Rizal Ave', lat: 14.6110, lng: 120.9770, img: '🍔', verified: true, desc: 'Famous for its world-class fries, Big Mac, and affordable localized menu items like McSpaghetti.' },
  { id: '3', name: 'Mang Inasal', category: 'Fast Food', rating: 4.7, address: 'SM City San Lazaro', lat: 14.6130, lng: 120.9760, img: '🍗', verified: true, desc: 'Your go-to spot for unlimited rice, authentic grilled chicken inasal, and creamy halo-halo.' },
  { id: '4', name: 'Greenwich', category: 'Pizza', rating: 4.3, address: 'Tayuman Center', lat: 14.6105, lng: 120.9795, img: '🍕', verified: true, desc: 'Serving Filipino-style pizza and pasta favorites perfect for sharing with the barkada.' },
  { id: '5', name: 'Starbucks', category: 'Coffee', rating: 4.6, address: 'SM San Lazaro', lat: 14.6140, lng: 120.9800, img: '☕', verified: false, desc: 'Premium coffee, cozy ambiance, and a great place for casual meetings or studying.' },
  { id: '6', name: 'Chowking', category: 'Fast Food', rating: 4.4, address: 'LRT Tayuman Station', lat: 14.6160, lng: 120.9810, img: '🥡', verified: true, desc: 'Chinese fast food favorites blending traditional flavors with local tastes like Chao Fan and Siomai.' },
  { id: '7', name: 'KFC', category: 'Fast Food', rating: 4.5, address: 'SM City San Lazaro', lat: 14.6135, lng: 120.9765, img: '🍗', verified: true, desc: 'Finger lickin\' good fried chicken with their signature secret recipe of 11 herbs and spices.' },
  { id: '8', name: 'Burger King', category: 'Fast Food', rating: 4.6, address: 'Espana Blvd', lat: 14.6080, lng: 120.9820, img: '🍔', verified: true, desc: 'Home of the Whopper, flame-grilled beef patties, and thick-cut onion rings.' }
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

// --- Leaflet Map Component ---
const LeafletMap = ({ center, markers = [], onMarkerClick, onMapClick, userLocation, onRecenter, mini = false }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!window.L || !mapRef.current) return;
    if (!mapInstance.current) {
      const map = window.L.map(mapRef.current, { 
        zoomControl: !mini, dragging: !mini, touchZoom: !mini, scrollWheelZoom: !mini, doubleClickZoom: !mini, keyboard: !mini
      }).setView([center.lat, center.lng], mini ? 16 : 15);
      
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: mini ? '' : '&copy; <a href="https://carto.com/attributions">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', 
        subdomains: 'abcd', 
        maxZoom: 20
      }).addTo(map);
      mapInstance.current = map;
    }

    const map = mapInstance.current;
    map.off('click');
    if (onMapClick) {
      map.on('click', (e) => onMapClick(e.latlng));
    }
  }, [mini, onMapClick, center.lat, center.lng]);

  useEffect(() => {
    if (!mapInstance.current || !window.L) return;
    const map = mapInstance.current;
    map.setView([center.lat, center.lng]);
    map.eachLayer((layer) => { 
      if (layer instanceof window.L.Marker) {
        layer.remove(); 
      }
    });

    markers.forEach(m => {
      const isUser = m.type === 'user';
      const isPromoted = m.isPromoted;
      const isLocked = m.isLocked; 
      
      const borderColor = isLocked ? 'border-slate-300' : isUser ? 'border-blue-500' : isPromoted ? 'border-amber-400' : 'border-orange-500';
      const bgColor = isLocked ? 'bg-slate-200 opacity-90' : isPromoted ? 'bg-gradient-to-br from-amber-200 to-yellow-400' : 'bg-white';
      const glow = isPromoted ? 'shadow-[0_0_15px_rgba(251,191,36,0.8)]' : 'shadow-lg';
      const badgeHtml = isPromoted && !isLocked ? '<div class="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] px-1 rounded font-black border border-white">AD</div>' : '';
      const iconHtml = `<div class="w-10 h-10 ${bgColor} rounded-full flex items-center justify-center ${glow} border-2 ${borderColor} text-xl relative">${m.img || '📍'}${badgeHtml}</div>`;
      
      const icon = window.L.divIcon({ className: 'bg-transparent', html: iconHtml, iconSize: [40, 40], iconAnchor: [20, 40] });
      const marker = window.L.marker([m.lat, m.lng], { icon }).addTo(map);
      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(m));
      }
    });

    if (userLocation) {
      const userIconHtml = `<div class="relative w-6 h-6"><div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div><div class="relative w-6 h-6 bg-blue-600 border-4 border-white rounded-full shadow-lg"></div></div>`;
      const userIcon = window.L.divIcon({ className: 'bg-transparent', html: userIconHtml, iconSize: [24, 24], iconAnchor: [12, 12] });
      window.L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
    }
  }, [center, markers, userLocation, onMarkerClick]);

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
        <button onClick={onRecenter} className="absolute bottom-6 right-4 z-[400] bg-white p-3 rounded-full shadow-xl border border-slate-200 text-blue-600 hover:bg-blue-50 active:scale-95 transition-all" title="My Location">
          <Compass size={24} />
        </button>
      )}
    </div>
  );
};

export default function App() {
  const [appState, setAppState] = useState('login'); 
  const [authMethod, setAuthMethod] = useState('email'); 
  const [authForm, setAuthForm] = useState({ email: '', password: '', mobile: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [firebaseUser, setFirebaseUser] = useState(null);
  
  const [leafletReady, setLeafletReady] = useState(false);
  const [mapCenter, setMapCenter] = useState(DEFAULT_LOC);
  const [userLoc, setUserLoc] = useState(DEFAULT_LOC);

  const [userData, setUserData] = useState({ 
    points: 50, isPro: false, isVerified: false, fbVerified: false, authProvider: 'guest',
    username: 'Foodie', fullName: '', email: '', mobile: '', dob: '', whatsapp: '', messenger: '', instagram: '', avatar: '👤', photoURL: '',
    favorites: [], following: [], hacksCount: 0, totalSavings: 0, isAdmin: false
  });
  
  const [restaurants, setRestaurants] = useState(MOCK_RESTAURANTS);
  const [hacks, setHacks] = useState(MOCK_HACKS);
  const [promos, setPromos] = useState(MOCK_PROMOS);
  const [globalAnnouncement, setGlobalAnnouncement] = useState('');
  
  // Advanced Admin State
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
  
  // Modals & Inputs
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showAddHackModal, setShowAddHackModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  
  const [otpInput, setOtpInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editForm, setEditForm] = useState({ username: '', fullName: '', email: '', mobile: '', password: '', dob: '', whatsapp: '', messenger: '', instagram: '', avatar: '' });
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [broadcastInput, setBroadcastInput] = useState('');
  const [toast, setToast] = useState('');

  const [isAddingNewRes, setIsAddingNewRes] = useState(false);
  const [newResForm, setNewResForm] = useState({ name: '', address: '', category: 'Fast Food', img: '📍', lat: DEFAULT_LOC.lat, lng: DEFAULT_LOC.lng });

  const [ownerTab, setOwnerTab] = useState('claim'); 
  const [promoteListing, setPromoteListing] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const logoTapCount = useRef(0);
  const logoTapTimeout = useRef(null);

  const userTier = useMemo(() => TIERS.find(t => (userData.points || 0) >= t.minPoints) || TIERS[TIERS.length - 1], [userData.points]);

  // --- FIREBASE INITIALIZATION & SYNC ---
  useEffect(() => {
    if (!auth) return;
    
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Auth init failed:", err);
      }
    };
    
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!firebaseUser || !db) return;
    
    // Connect to the Live Hacks Database
    const hacksRef = collection(db, 'artifacts', APP_ID_DB_KEY, 'public', 'data', 'hacks');
    
    const unsubscribeHacks = onSnapshot(hacksRef, (snapshot) => {
      if (snapshot.empty) {
        // Seed the database with mock data initially so the UI is fully populated
        MOCK_HACKS.forEach(async (hack) => {
          try {
            await setDoc(doc(hacksRef, hack.id), hack);
          } catch (e) {
            console.error("Error seeding data:", e);
          }
        });
      } else {
        const liveHacks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHacks(liveHacks);
      }
    }, (error) => {
      console.error("Hacks listener error:", error);
    });

    return () => unsubscribeHacks();
  }, [firebaseUser]);

  // --- MAP ENGINE LOAD ---
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
    if (logoTapTimeout.current) {
      clearTimeout(logoTapTimeout.current);
    }
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

  // --- Auth Flows ---
  const handleGuestLogin = () => {
    setAppState('main');
    setUserData(prev => ({ ...prev, authProvider: 'guest' }));
    showToastMessage("Welcome, Guest!");
  };

  const handleStandardAuth = (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setTimeout(() => {
      setAuthLoading(false);
      setAppState('main');
      setUserData(prev => ({ 
        ...prev, 
        authProvider: authMethod, 
        email: authMethod === 'email' ? authForm.email : prev.email,
        mobile: authMethod === 'mobile' ? authForm.mobile : prev.mobile
      }));
      showToastMessage(appState === 'login' ? "Logged in successfully!" : "Account created successfully!");
    }, 800);
  };

  const handleFacebookAuth = async () => {
    setAuthLoading(true);
    try {
      if (auth && fbProvider) {
        const result = await signInWithPopup(auth, fbProvider);
        const fbUser = result.user;
        
        setUserData(prev => ({
          ...prev,
          username: fbUser.displayName || 'FB_Foodie23',
          fullName: fbUser.displayName || 'Juan Dela Cruz',
          email: fbUser.email || 'juan.fb@example.com',
          photoURL: fbUser.photoURL || 'https://i.pravatar.cc/150?img=11',
          isVerified: true, 
          fbVerified: true,
          authProvider: 'facebook'
        }));
      } else {
        throw new Error("Auth not initialized");
      }
    } catch (e) {
      console.warn("Real FB Auth failed, using mock payload for preview:", e);
      setUserData(prev => ({
        ...prev,
        username: 'FB_Foodie23',
        fullName: 'Juan Dela Cruz',
        email: 'juan.fb@example.com',
        dob: '1995-08-12',
        photoURL: 'https://i.pravatar.cc/150?img=11',
        isVerified: true, 
        fbVerified: true,
        authProvider: 'facebook'
      }));
    } finally {
      setAuthLoading(false);
      setAppState('main');
      showToastMessage("Connected with Facebook!");
    }
  };
  
  const handleOtpChange = (e) => { 
    setOtpInput(e.target.value.replace(/[^0-9]/g, '')); 
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otpInput === '1234') {
      setUserData(prev => ({ ...prev, isVerified: true, points: prev.points + 100 }));
      setShowVerifyModal(false); 
      setOtpInput(''); 
      showToastMessage("Verified! +100 Points");
    } else {
      showToastMessage("Invalid OTP. Hint: Use 1234");
    }
  };

  const handleOpenEditProfile = () => {
    setEditForm({
      username: userData.username || '', 
      fullName: userData.fullName || '', 
      email: userData.email || '', 
      mobile: userData.mobile || '',
      password: '', 
      dob: userData.dob || '', 
      whatsapp: userData.whatsapp || '', 
      messenger: userData.messenger || '', 
      instagram: userData.instagram || '', 
      avatar: userData.avatar || '👤'
    });
    setShowEditProfileModal(true);
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setUserData(prev => ({ 
      ...prev, 
      username: editForm.username, 
      fullName: editForm.fullName, 
      email: editForm.email, 
      mobile: editForm.mobile,
      dob: editForm.dob, 
      whatsapp: editForm.whatsapp, 
      messenger: editForm.messenger, 
      instagram: editForm.instagram, 
      avatar: editForm.avatar 
    }));
    setShowEditProfileModal(false);
    showToastMessage("Profile & Settings updated!");
  };

  const saveNewRestaurant = () => {
    if (!newResForm.name || !newResForm.address) {
      showToastMessage("Please fill in Name and Address.");
      return;
    }
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

  const submitHack = async (e) => {
    e.preventDefault();
    if (!userData.isVerified && appSettings.requireOTP) {
      setShowAddHackModal(false); 
      setShowVerifyModal(true);
      return;
    }
    
    const formData = new FormData(e.target);
    const savings = Number(formData.get('savings'));
    const newHackId = Math.random().toString(36).substr(2, 9);
    
    const newHack = {
      id: newHackId, 
      resId: selectedRes.id, 
      title: formData.get('title'), 
      desc: formData.get('desc'),
      savings: savings, 
      votes: 1, 
      user: userData.username,
      avatar: userData.avatar, 
      status: appSettings.autoApproveHacks ? 'approved' : 'pending',
      isPinned: false
    };

    // Firebase Write
    if (firebaseUser && db) {
      try {
        const hackRef = doc(collection(db, 'artifacts', APP_ID_DB_KEY, 'public', 'data', 'hacks'), newHackId);
        await setDoc(hackRef, newHack);
      } catch (err) {
        console.error("Error writing to Firebase:", err);
      }
    } else {
      setHacks(prev => [newHack, ...prev]);
    }

    setUserData(prev => ({ ...prev, points: prev.points + 50, hacksCount: prev.hacksCount + 1, totalSavings: prev.totalSavings + savings }));
    setShowAddHackModal(false);
    showToastMessage(appSettings.autoApproveHacks ? "Hack published! +50 Points" : "Hack submitted for review! +50 Points");
  };

  const handleUpgradePro = (method) => {
    if (method === 'points' && userData.points < 1000) {
      showToastMessage("Not enough points!");
      return;
    }
    setUserData(prev => ({ ...prev, isPro: true, points: method === 'points' ? prev.points - 1000 : prev.points }));
    showToastMessage("Welcome to PRO! All hacks unlocked.");
  };

  const handleToggleFavorite = (hackId) => {
    setUserData(prev => {
      const isFavorited = prev.favorites.includes(hackId);
      return { ...prev, favorites: isFavorited ? prev.favorites.filter(id => id !== hackId) : [...prev.favorites, hackId] };
    });
  };

  const openNav = (type, lat, lng) => {
    const urls = { 
      google: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, 
      apple: `http://maps.apple.com/?daddr=${lat},${lng}`, 
      waze: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes` 
    };
    window.open(urls[type]);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Status', 'Verified', 'Posts', 'Last Login'];
    const rows = usersList.map(u => [ 
      u.id, 
      u.username, 
      u.email, 
      u.status, 
      String(u.isVerified).toUpperCase(), 
      u.posts || 0, 
      u.lastLogin || u.joined 
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\n";
    rows.forEach(row => {
      csvContent += row.join(',') + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a"); 
    link.setAttribute("href", encodedUri); 
    link.setAttribute("download", `user_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link); 
    link.click(); 
    document.body.removeChild(link); 
    showToastMessage("Excel (CSV) exported successfully!");
  };

  const exportXML = () => {
    let xmlStr = '<?xml version="1.0" encoding="UTF-8"?>\n<users>\n';
    usersList.forEach(u => {
      xmlStr += '  <user id="' + u.id + '">\n';
      xmlStr += '    <name>' + u.username + '</name>\n';
      xmlStr += '    <email>' + u.email + '</email>\n';
      xmlStr += '    <status>' + u.status + '</status>\n';
      xmlStr += '    <verified>' + String(u.isVerified) + '</verified>\n';
      xmlStr += '    <posts>' + (u.posts || 0) + '</posts>\n';
      xmlStr += '    <lastLogin>' + (u.lastLogin || u.joined) + '</lastLogin>\n';
      xmlStr += '  </user>\n';
    });
    xmlStr += '</users>';
    const blob = new Blob([xmlStr], { type: 'text/xml' }); 
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); 
    link.setAttribute("href", url); 
    link.setAttribute("download", "data.xml");
    document.body.appendChild(link); 
    link.click(); 
    document.body.removeChild(link); 
    showToastMessage("XML data structure exported successfully!");
  };

  // --- Advanced Admin Handlers (With Firebase Updates) ---
  const adminTogglePin = async (id) => { 
    const hack = hacks.find(h => h.id === id);
    if (hack && firebaseUser && db) {
      await updateDoc(doc(db, 'artifacts', APP_ID_DB_KEY, 'public', 'data', 'hacks', id), { isPinned: !hack.isPinned });
    } else {
      setHacks(prev => prev.map(h => h.id === id ? { ...h, isPinned: !h.isPinned } : h)); 
    }
    showToastMessage("Pin status updated."); 
  };
  const adminAdjustUserPoints = (id, amount) => { 
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, points: u.points + amount } : u)); 
    showToastMessage("Added points to user."); 
  };
  const adminWarnUser = (id) => { 
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, warnings: u.warnings + 1 } : u)); 
    showToastMessage("Warning sent to user."); 
  };
  const adminChangeUserStatus = (id, status) => { 
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, status } : u)); 
    showToastMessage("User status changed to " + status + "."); 
  };
  const adminResolveReport = (id, action) => { 
    setReportsList(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r)); 
    if (action === 'delete') {
      showToastMessage("Content deleted and report resolved."); 
    } else {
      showToastMessage("Report dismissed."); 
    }
  };
  const sendBroadcast = (e) => { 
    e.preventDefault(); 
    setGlobalAnnouncement(broadcastInput); 
    setBroadcastInput(''); 
    showToastMessage("Broadcast sent to all users!"); 
  };
  const toggleSetting = (key) => { 
    setAppSettings(prev => ({ ...prev, [key]: !prev[key] })); 
    showToastMessage("Setting updated."); 
  };
  const updateSettingValue = (key, value) => { 
    setAppSettings(prev => ({ ...prev, [key]: value })); 
  };
  const adminApproveHack = async (id) => { 
    if (firebaseUser && db) {
      await updateDoc(doc(db, 'artifacts', APP_ID_DB_KEY, 'public', 'data', 'hacks', id), { status: 'approved' });
    } else {
      setHacks(prev => prev.map(h => h.id === id ? { ...h, status: 'approved' } : h)); 
    }
    showToastMessage("Hack Approved & Published!"); 
  };
  const adminRejectHack = async (id) => { 
    if (firebaseUser && db) {
      await deleteDoc(doc(db, 'artifacts', APP_ID_DB_KEY, 'public', 'data', 'hacks', id));
    } else {
      setHacks(prev => prev.filter(h => h.id !== id)); 
    }
    showToastMessage("Hack Rejected and Deleted."); 
  };
  const adminVerifyUser = (id) => { 
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, isVerified: true } : u)); 
    showToastMessage("User Verified!"); 
  };
  const adminBlockUser = (id) => { 
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'blocked' ? 'active' : 'blocked' } : u)); 
    showToastMessage("User Status Changed!"); 
  };
  const adminDeleteUser = (id) => { 
    setUsersList(prev => prev.filter(u => u.id !== id)); 
    showToastMessage("User Account Deleted."); 
  };
  const adminApproveBusiness = (req) => { 
    setBusinessRequests(prev => prev.filter(b => b.id !== req.id)); 
    setActiveBusinesses(prev => [...prev, { id: req.id, restaurant: req.restaurant, email: req.email, views: 0, promosActive: 0 }]); 
    showToastMessage("Business Claim Approved!"); 
  };
  const adminRejectBusiness = (id) => { 
    setBusinessRequests(prev => prev.map(b => b.id === id ? { ...b, status: 'rejected' } : b)); 
    showToastMessage("Business Claim Rejected."); 
  };

  const submitBusinessFlow = (e) => {
    e.preventDefault();
    if (ownerTab === 'claim') {
      const newReq = { 
        id: Math.random().toString(36).substr(2, 9), 
        restaurant: selectedRes?.name || 'Unknown', 
        user: userData.username, 
        email: 'business@owner.com', 
        status: 'pending', 
        date: new Date().toISOString().split('T')[0] 
      };
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
      isPromoted: promoteListing,
      desc: 'A new spot submitted by a business owner.'
    };
    setRestaurants(prev => [newRes, ...prev]);
    setActiveBusinesses(prev => [{ id: newRes.id, restaurant: newRes.name, email: userData.email, views: 0, promosActive: 0 }, ...prev]);
    setShowBusinessModal(false); 
    showToastMessage(promoteListing ? "Payment Success! Promoted listing added." : "Business listed successfully.");
  };

  // --- Views ---
  if (appState === 'login' || appState === 'register') {
    return (
      <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-900 max-w-md mx-auto relative overflow-hidden font-sans">
        <div className="flex-1 flex flex-col items-center justify-center p-5 bg-gradient-to-br from-orange-500 to-amber-500 text-white relative">
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
          
          <h1 className="text-4xl font-black italic tracking-tighter mb-1 z-10">Tipid Menu</h1>
          <p className="text-orange-100 font-medium mb-8 z-10 text-center text-sm px-6">Smart Savings for the Filipino Foodie.</p>

          <div className="w-full bg-white p-6 sm:p-8 rounded-[32px] shadow-2xl z-10 text-slate-800 flex flex-col gap-4 animate-in slide-in-from-bottom-8">
            <h2 className="text-2xl font-black mb-1 text-center text-slate-900">{appState === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            
            {/* Auth Method Toggles */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-full mb-2">
              <button onClick={() => { setAuthMethod('email'); setAuthError(''); }} className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${authMethod === 'email' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                <Mail size={14}/> Email
              </button>
              <button onClick={() => { setAuthMethod('mobile'); setAuthError(''); }} className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${authMethod === 'mobile' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                <Phone size={14}/> Mobile
              </button>
            </div>

            {authError && <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-3 rounded-xl text-center">{authError}</div>}
            
            <form onSubmit={handleStandardAuth} className="flex flex-col gap-3">
              {authMethod === 'email' ? (
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Email Address</label>
                  <input required type="email" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} className="w-full bg-slate-50 px-5 py-3.5 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none focus:ring-2 focus:ring-orange-500/20 mt-1 transition-all" placeholder="juan@example.com" />
                </div>
              ) : (
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Mobile Number</label>
                  <div className="flex gap-2 mt-1">
                    <span className="bg-slate-100 px-4 py-3.5 rounded-2xl font-bold text-slate-500 border border-slate-100 flex items-center">+63</span>
                    <input required type="tel" value={authForm.mobile} onChange={e => setAuthForm({...authForm, mobile: e.target.value.replace(new RegExp('[^0-9]', 'g'), '')})} maxLength={10} className="flex-1 bg-slate-50 px-5 py-3.5 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none focus:ring-2 focus:ring-orange-500/20 transition-all" placeholder="912 345 6789" />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Password</label>
                <input required type="password" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} className="w-full bg-slate-50 px-5 py-3.5 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none focus:ring-2 focus:ring-orange-500/20 mt-1 transition-all" placeholder="••••••••" />
              </div>

              <button disabled={authLoading} type="submit" className="w-full py-4 mt-2 bg-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-600/20 uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                {authLoading ? 'Please wait...' : (appState === 'login' ? 'Sign In' : 'Sign Up')}
              </button>
            </form>

            <div className="text-center">
              <button type="button" onClick={() => setAppState(appState === 'login' ? 'register' : 'login')} className="text-xs font-bold text-slate-400 hover:text-orange-500 transition-colors">
                {appState === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
            
            <div className="flex items-center gap-4 my-1"><div className="h-px bg-slate-100 flex-1"></div><span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">OR</span><div className="h-px bg-slate-100 flex-1"></div></div>
            
            {/* Facebook Auth Button */}
            <button onClick={handleFacebookAuth} disabled={authLoading} type="button" className="relative z-20 w-full py-3.5 bg-[#1877F2] hover:bg-[#166FE5] text-white font-black rounded-2xl flex justify-center items-center gap-2 uppercase text-xs tracking-widest active:scale-95 transition-all shadow-md">
              <Facebook size={18} className="fill-white" /> Continue with Facebook
            </button>

            <button type="button" onClick={handleGuestLogin} className="relative z-20 w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-black rounded-2xl border border-slate-200 uppercase text-xs tracking-widest active:scale-95 transition-all shadow-sm">
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderAdmin = () => {
    const filteredUsers = usersList.filter(u => u.username.toLowerCase().includes(adminSearch.toLowerCase()) || u.email.toLowerCase().includes(adminSearch.toLowerCase()));
    const filteredHacks = hacks.filter(h => h.title.toLowerCase().includes(adminSearch.toLowerCase()) || h.user.toLowerCase().includes(adminSearch.toLowerCase()));

    const pendingHacksCount = hacks.filter(h => h.status === 'pending').length;
    const pendingReportsCount = reportsList.filter(r => r.status === 'pending').length;
    const pendingBusinessCount = businessRequests.filter(b => b.status === 'pending').length;
    const activeUsersCount = usersList.filter(u => u.status === 'active').length;
    const inactiveUsersCount = usersList.filter(u => u.status === 'inactive').length;

    const adminNavTabs = [
      { id: 'dashboard', icon: Activity, label: 'Dashboard' },
      { id: 'map', icon: MapIcon, label: 'Map View' },
      { id: 'users', icon: Users, label: 'Users' },
      { id: 'hacks', icon: Utensils, label: `Hacks (${pendingHacksCount})` },
      { id: 'reports', icon: AlertTriangle, label: `Reports (${pendingReportsCount})` },
      { id: 'business', icon: Store, label: `Business (${pendingBusinessCount})` },
      { id: 'messages', icon: MessageSquare, label: 'Messages' },
      { id: 'analytics', icon: BarChart3, label: 'Analytics' },
      { id: 'settings', icon: Settings, label: 'Settings' }
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
            <div className="w-1 shrink-0"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-100 flex flex-col">
          {adminTab === 'dashboard' && (
            <div className="p-5 space-y-4 animate-in fade-in">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-2">Community Overview</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200"><div className="text-slate-400 mb-1"><Users size={20}/></div><div className="text-2xl font-black text-slate-800">{usersList.length}</div><div className="text-[10px] font-bold text-slate-500 uppercase">Total Users</div></div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200"><div className="text-green-500 mb-1"><Activity size={20}/></div><div className="text-2xl font-black text-slate-800">{activeUsersCount} / {inactiveUsersCount}</div><div className="text-[10px] font-bold text-slate-500 uppercase">Active / Inactive</div></div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200"><div className="text-orange-500 mb-1"><Utensils size={20}/></div><div className="text-2xl font-black text-slate-800">{hacks.length}</div><div className="text-[10px] font-bold text-slate-500 uppercase">Total Hacks Posted</div></div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200"><div className="text-amber-500 mb-1"><Store size={20}/></div><div className="text-2xl font-black text-slate-800">{pendingBusinessCount}</div><div className="text-[10px] font-bold text-slate-500 uppercase">Pending Business</div></div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center mt-4">
                <div>
                  <h4 className="font-bold text-red-600 flex items-center gap-2"><AlertTriangle size={18}/> Verification Queue</h4>
                  <p className="text-[10px] font-medium text-slate-500">Users waiting for approval.</p>
                </div>
                <div className="text-xl font-black text-slate-800">{usersList.filter(u => !u.isVerified).length}</div>
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

          {adminTab === 'users' && (
            <div className="p-5 space-y-4 animate-in fade-in">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Search users by name or email..." value={adminSearch} onChange={(e) => setAdminSearch(e.target.value)} className="w-full bg-white border border-slate-200 py-3 pl-10 pr-4 rounded-xl font-medium text-sm focus:outline-none focus:border-orange-500 text-slate-900" />
                </div>
                <button onClick={exportCSV} className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors border border-green-200 shadow-sm" title="Export to Excel (CSV)"><FileSpreadsheet size={20} /></button>
                <button onClick={exportXML} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors border border-blue-200 shadow-sm" title="Export XML"><FileCode2 size={20} /></button>
              </div>

              {filteredUsers.map(u => (
                <div key={u.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-slate-800 text-base flex items-center gap-1">{u.username} {u.isVerified && <CheckCircle size={14} className="text-blue-500"/>}</h4>
                      <p className="text-[10px] font-bold text-slate-400">{u.email} • {u.points} pts • {u.warnings} Warns</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${u.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : u.status === 'shadowbanned' ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-red-50 text-red-700 border-red-200'}`}>{u.status}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {!u.isVerified && <button onClick={() => adminVerifyUser(u.id)} className="bg-blue-50 text-blue-600 border border-blue-200 font-bold py-1.5 px-3 rounded-lg text-xs hover:bg-blue-100">Verify</button>}
                    <button onClick={() => adminWarnUser(u.id)} className="bg-amber-50 text-amber-600 border border-amber-200 font-bold py-1.5 px-3 rounded-lg text-xs hover:bg-amber-100">Warn</button>
                    <button onClick={() => adminChangeUserStatus(u.id, u.status === 'shadowbanned' ? 'active' : 'shadowbanned')} className="bg-slate-100 text-slate-600 border border-slate-300 font-bold py-1.5 px-3 rounded-lg text-xs hover:bg-slate-200"><EyeOff size={12} className="inline mr-1 mb-0.5"/>{u.status === 'shadowbanned' ? 'Un-Shadowban' : 'Shadowban'}</button>
                    <button onClick={() => adminChangeUserStatus(u.id, u.status === 'banned' ? 'active' : 'banned')} className="bg-red-50 text-red-600 border border-red-200 font-bold py-1.5 px-3 rounded-lg text-xs hover:bg-red-100"><Ban size={12} className="inline mr-1 mb-0.5"/>{u.status === 'banned' ? 'Unban' : 'Ban'}</button>
                    <button onClick={() => adminDeleteUser(u.id)} className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 ml-auto"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {adminTab === 'hacks' && (
            <div className="p-5 space-y-4 animate-in fade-in">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search hacks..." value={adminSearch} onChange={(e) => setAdminSearch(e.target.value)} className="w-full bg-white border border-slate-200 py-3 pl-10 pr-4 rounded-xl font-medium text-sm focus:outline-none focus:border-orange-500 text-slate-900" />
              </div>
              {filteredHacks.map(hack => (
                <div key={hack.id} className={`bg-white p-4 rounded-2xl shadow-sm border ${hack.status === 'pending' ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-black text-slate-800 flex items-center gap-2">{hack.title} {hack.isPinned && <Pin size={14} className="text-orange-500 fill-orange-500"/>}</h4>
                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${hack.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{hack.status}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{hack.desc}</p>
                  <p className="text-xs font-bold text-slate-400 mb-4">By: {hack.user} • Saves ₱{hack.savings}</p>
                  
                  <div className="flex gap-2 flex-wrap">
                    {hack.status === 'pending' && <button onClick={() => adminApproveHack(hack.id)} className="flex-1 bg-green-500 text-white font-bold py-2 px-3 rounded-lg text-xs hover:bg-green-600">Approve</button>}
                    <button onClick={() => adminTogglePin(hack.id)} className="bg-slate-100 text-slate-700 font-bold py-2 px-3 rounded-lg text-xs hover:bg-slate-200 border border-slate-200">{hack.isPinned ? 'Unpin' : 'Pin to Top'}</button>
                    <button onClick={() => adminRejectHack(hack.id)} className="bg-red-50 text-red-600 font-bold py-2 px-3 rounded-lg text-xs hover:bg-red-100 border border-red-100">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {adminTab === 'reports' && (
            <div className="p-5 space-y-4 animate-in fade-in">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-2">Moderation Queue</h3>
              {reportsList.filter(r => r.status === 'pending').length === 0 ? (
                <p className="text-center text-slate-400 font-bold py-8 bg-white rounded-2xl border border-slate-200 border-dashed">Queue is clear.</p>
              ) : (
                reportsList.filter(r => r.status === 'pending').map(rep => (
                  <div key={rep.id} className="bg-white p-4 rounded-2xl shadow-sm border border-red-200 border-l-4 border-l-red-500">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black uppercase text-red-500 tracking-widest flex items-center gap-1"><AlertOctagon size={12}/> {rep.type} Report</span>
                      <span className="text-[10px] text-slate-400 font-bold">By: {rep.reportedBy}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 mb-3">"{rep.reason}"</p>
                    <div className="flex gap-2">
                      <button onClick={() => adminResolveReport(rep.id, 'delete')} className="flex-1 bg-red-50 text-red-600 font-bold py-2 rounded-xl text-xs border border-red-200 hover:bg-red-100">Remove Content</button>
                      <button onClick={() => adminWarnUser(rep.targetId)} className="flex-1 bg-amber-50 text-amber-600 font-bold py-2 rounded-xl text-xs border border-amber-200 hover:bg-amber-100">Warn User</button>
                      <button onClick={() => adminResolveReport(rep.id, 'ignore')} className="flex-1 bg-slate-100 text-slate-600 font-bold py-2 rounded-xl text-xs hover:bg-slate-200">Dismiss</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {adminTab === 'business' && (
            <div className="p-5 space-y-6 animate-in fade-in">
              <div>
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-3">Pending Requests</h3>
                {businessRequests.filter(b => b.status === 'pending').length === 0 ? (
                  <p className="text-center text-slate-400 font-bold py-4 bg-white rounded-2xl border border-slate-200 border-dashed">No pending business requests.</p>
                ) : (
                  businessRequests.filter(b => b.status === 'pending').map(req => (
                    <div key={req.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-3">
                      <h4 className="font-black text-slate-800">{req.restaurant} Claim</h4>
                      <p className="text-sm text-slate-600 mt-1 mb-3">Requested by: <span className="font-bold text-slate-800">{req.user}</span> ({req.email})</p>
                      <p className="text-xs font-bold text-slate-400 mb-4">Submitted: {req.date}</p>
                      <div className="flex gap-2">
                        <button onClick={() => adminApproveBusiness(req)} className="flex-1 bg-green-500 text-white font-bold py-2 rounded-xl flex justify-center items-center gap-1 hover:bg-green-600"><Check size={16}/> Approve</button>
                        <button onClick={() => adminRejectBusiness(req.id)} className="flex-1 bg-red-100 text-red-600 font-bold py-2 rounded-xl flex justify-center items-center gap-1 hover:bg-red-200"><X size={16}/> Reject</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div>
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-3">Active Business Profiles</h3>
                {activeBusinesses.map(bus => (
                  <div key={bus.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-slate-800 text-base flex items-center gap-1">{bus.restaurant} <CheckCircle size={14} className="text-blue-500"/></h4>
                        <p className="text-[10px] font-bold text-slate-400">{bus.email}</p>
                      </div>
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] font-black uppercase border border-blue-200">Verified</span>
                    </div>
                    <div className="flex gap-4 mt-3 pt-3 border-t border-slate-100">
                      <div className="text-center"><p className="text-[10px] font-bold text-slate-400 uppercase">Profile Views</p><p className="font-black text-slate-800">{bus.views}</p></div>
                      <div className="text-center"><p className="text-[10px] font-bold text-slate-400 uppercase">Active Promos</p><p className="font-black text-slate-800">{bus.promosActive}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'messages' && (
            <div className="p-5 space-y-6 animate-in fade-in">
              <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-5 rounded-2xl shadow-lg text-white">
                <h4 className="font-black flex items-center gap-2 mb-3"><Megaphone size={18}/> Broadcast Announcement</h4>
                <form onSubmit={sendBroadcast}>
                  <textarea required value={broadcastInput} onChange={e => setBroadcastInput(e.target.value)} rows={2} placeholder="Write a message to all users..." className="w-full bg-white/10 border border-white/20 px-4 py-3 rounded-xl text-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 resize-none mb-3"></textarea>
                  <button type="submit" className="w-full bg-white text-blue-600 font-black py-3 rounded-xl shadow-md hover:scale-[1.02] active:scale-95 transition-transform text-xs uppercase tracking-widest">Push Notification</button>
                </form>
              </div>

              <div>
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-3">Admin Inbox</h3>
                <div className="space-y-3">
                  {inboxMessages.map(msg => (
                    <div key={msg.id} className={`bg-white p-4 rounded-2xl shadow-sm border ${msg.isRead ? 'border-slate-200 opacity-70' : 'border-blue-200 border-l-4 border-l-blue-500'}`}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-800 text-sm">{msg.subject}</h4>
                        <span className="text-[10px] font-bold text-slate-400">{msg.date}</span>
                      </div>
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-2">From: {msg.from}</p>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-3">{msg.body}</p>
                      <button className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">Reply Direct</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {adminTab === 'analytics' && (
            <div className="p-5 space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <h4 className="font-black text-slate-800 flex items-center gap-2 mb-4"><TrendingUp size={18} className="text-green-500"/> User Growth (7 Days)</h4>
                <div className="flex items-end gap-2 h-32 border-b border-slate-100 pb-2">
                  {[40, 60, 45, 80, 55, 90, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-orange-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
                <div className="flex justify-between text-[8px] font-black uppercase text-slate-400 mt-2">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <h4 className="font-black text-slate-800 flex items-center gap-2 mb-4"><Trophy size={18} className="text-yellow-500"/> Top Contributors</h4>
                <div className="space-y-3">
                  {usersList.slice().sort((a,b) => b.points - a.points).slice(0, 3).map((u, i) => (
                    <div key={u.id} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="font-black text-slate-300 w-4">{i + 1}</div>
                        <div><p className="font-bold text-slate-800 text-sm">{u.username}</p><p className="text-[10px] font-bold text-slate-400 uppercase">{u.posts} Posts</p></div>
                      </div>
                      <div className="text-orange-600 font-black text-sm">{u.points} pts</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {adminTab === 'settings' && (
            <div className="p-5 space-y-6 animate-in fade-in">
              
              <div>
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-3">Admin Profile (Me)</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-2xl text-white border-2 border-orange-500 shadow-lg">👑</div>
                    <div>
                      <h4 className="font-black text-slate-800 text-xl">SuperAdmin</h4>
                      <p className="text-xs font-bold text-slate-500">admin@tipidmenu.ph</p>
                      <span className="inline-block mt-1 bg-red-100 text-red-700 px-2 py-0.5 rounded text-[9px] font-black uppercase border border-red-200">Role: Root Admin</span>
                    </div>
                  </div>
                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <p className="text-xs font-bold text-slate-500 flex justify-between"><span>Last Login:</span> <span className="text-slate-800">{new Date().toLocaleString()}</span></p>
                    <p className="text-xs font-bold text-slate-500 flex justify-between"><span>2FA Status:</span> <span className="text-green-600">Enabled</span></p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-3">App Configuration</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-800">Auto-Approve Hacks</h4>
                      <p className="text-[10px] font-medium text-slate-500">Skip the moderation queue for new posts.</p>
                    </div>
                    <button onClick={() => toggleSetting('autoApproveHacks')} className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${appSettings.autoApproveHacks ? 'bg-green-500' : 'bg-slate-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${appSettings.autoApproveHacks ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-800">Require Verification to Post</h4>
                      <p className="text-[10px] font-medium text-slate-500">Users must verify OTP to post hacks.</p>
                    </div>
                    <button onClick={() => toggleSetting('requireOTP')} className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${appSettings.requireOTP ? 'bg-green-500' : 'bg-slate-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${appSettings.requireOTP ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                  
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-800">Daily Post Limit</h4>
                      <p className="text-[10px] font-medium text-slate-500">Max hacks a user can post per day.</p>
                    </div>
                    <input type="number" value={appSettings.dailyPostLimit} onChange={(e) => updateSettingValue('dailyPostLimit', e.target.value)} className="w-16 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-sm py-1 outline-none focus:border-orange-500"/>
                  </div>
                  
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-800">Reward Point Multiplier</h4>
                      <p className="text-[10px] font-medium text-slate-500">Adjust points given (e.g. 2x for events).</p>
                    </div>
                    <input type="number" step="0.1" value={appSettings.rewardMultiplier} onChange={(e) => updateSettingValue('rewardMultiplier', e.target.value)} className="w-16 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-sm py-1 outline-none focus:border-orange-500"/>
                  </div>

                  <div className="p-4 flex justify-between items-center bg-red-50/50">
                    <div>
                      <h4 className="font-bold text-red-600">Maintenance Mode</h4>
                      <p className="text-[10px] font-medium text-red-500/70">Block access to non-admin users.</p>
                    </div>
                    <button onClick={() => toggleSetting('maintenanceMode')} className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${appSettings.maintenanceMode ? 'bg-red-500' : 'bg-slate-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${appSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    );
  };

  const renderHeader = () => (
    <header className="bg-white px-5 py-4 shadow-sm z-20 flex justify-between items-center sticky top-0">
      <h1 
        onClick={handleLogoTap} 
        className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 italic uppercase tracking-tighter select-none cursor-pointer"
      >
        Tipid Menu
      </h1>
      <div className="flex items-center gap-3">
        {/* Properly Sized & Aligned Admin Command Center Button */}
        {userData.isAdmin && (
          <button 
            onClick={() => setActiveView('admin')} 
            className="w-10 h-10 bg-slate-900 text-orange-400 rounded-full flex items-center justify-center shadow-md hover:bg-slate-800 transition-colors active:scale-95 border border-slate-700 shrink-0"
            title="Command Center"
          >
            <Shield size={20} />
          </button>
        )}
        <button onClick={() => setCurrentTab('profile')} className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 active:scale-95 transition-transform h-10">
          <div className="flex flex-col items-end justify-center">
            <span className="text-[11px] font-black text-orange-700 leading-none mb-0.5">{userData.points} pts</span>
            <span className="text-[9px] font-bold text-orange-500 leading-none">{userTier.name}</span>
          </div>
          {userData.photoURL ? (
            <img src={userData.photoURL} alt="Avatar" className="w-7 h-7 rounded-full border border-orange-200 object-cover" />
          ) : (
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-sm border border-orange-200">{userData.avatar}</div>
          )}
        </button>
      </div>
    </header>
  );

  const renderTabBar = () => (
    <nav className="bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-3 flex justify-between items-center sticky bottom-0 z-30 pb-safe">
      <button onClick={() => setCurrentTab('map')} className={`flex flex-col items-center gap-1.5 transition-colors ${currentTab === 'map' ? 'text-orange-600' : 'text-slate-300'}`}><MapPin size={22} /><span className="text-[10px] font-black uppercase tracking-widest">Near</span></button>
      <button onClick={() => setCurrentTab('spots')} className={`flex flex-col items-center gap-1.5 transition-colors ${currentTab === 'spots' ? 'text-orange-600' : 'text-slate-300'}`}><List size={22} /><span className="text-[10px] font-black uppercase tracking-widest">Spots</span></button>
      <button onClick={() => { if(selectedRes) { setShowAddHackModal(true); } else { setCurrentTab('spots'); } }} className="bg-gradient-to-br from-orange-500 to-amber-500 p-4 rounded-full text-white shadow-xl shadow-orange-500/30 transform -translate-y-6 hover:scale-110 active:scale-95 transition-all"><Plus size={24}/></button>
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
          markers={restaurants.map((r, index) => ({...r, type: 'business', isLocked: !userData.isPro && index >= 5, img: (!userData.isPro && index >= 5) ? '🔒' : r.img}))}
          onMarkerClick={(m) => { 
            if (m.isLocked) {
              setCurrentTab('pro');
              showToastMessage("Unlock PRO to view premium spots!");
            } else {
              setSelectedRes(m); 
              setActiveView('restaurant'); 
            }
          }}
          onRecenter={handleGetLocation}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-100"><p className="font-bold text-slate-500 animate-pulse">Loading Map Engine...</p></div>
      )}
    </div>
  );

  const renderSpots = () => {
    const filtered = restaurants.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Determine spots to display
    const displayedSpots = userData.isPro ? filtered : filtered.slice(0, 5);
    const lockedCount = filtered.length - displayedSpots.length;

    return (
      <div className="flex-1 overflow-y-auto bg-slate-50 p-5 pb-24">
        {globalAnnouncement && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-2xl shadow-lg mb-6 flex gap-3 items-start animate-in slide-in-from-top">
            <Bell size={20} className="shrink-0 mt-0.5"/>
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest mb-1 opacity-80">Announcement</h4>
              <p className="font-bold text-sm">{globalAnnouncement}</p>
            </div>
            <button onClick={() => setGlobalAnnouncement('')} className="shrink-0 text-white/50 hover:text-white"><X size={16}/></button>
          </div>
        )}

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" placeholder="Search restaurants, brands..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 py-3.5 pl-12 pr-4 rounded-2xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm transition-all" />
        </div>
        
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm flex items-center gap-2"><List size={18} className="text-orange-500" /> Discover Spots</h3>
          {!userData.isPro && <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-200 px-2 py-1 rounded-lg">Free Plan (5/5)</span>}
        </div>

        <div className="space-y-3 mb-6">
          {displayedSpots.map(res => (
            <div key={res.id} onClick={() => { setSelectedRes(res); setActiveView('restaurant'); }} className={`bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer transition-colors group active:scale-[0.98] ${res.isPromoted ? 'border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.15)] bg-amber-50/20' : 'border-slate-100 hover:border-orange-200'}`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl border shrink-0 ${res.isPromoted ? 'bg-gradient-to-br from-amber-100 to-yellow-200 border-amber-300' : 'bg-orange-50 border-orange-100'}`}>{res.img}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-slate-800 group-hover:text-orange-600 transition-colors flex items-center gap-2 truncate">
                  {res.name}
                  {res.isPromoted && <span className="bg-amber-500 text-white text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest shrink-0">AD</span>}
                </h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate">{res.category}</p>
                {res.desc && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{res.desc}</p>}
              </div>
              <ChevronRight className="text-slate-300 shrink-0" size={20} />
            </div>
          ))}

          {/* Locked Spots Placeholder */}
          {!userData.isPro && filtered.length > 5 && filtered.slice(5, 7).map((res) => (
             <div key={res.id} onClick={() => setCurrentTab('pro')} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer relative overflow-hidden group">
                <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-[2px] z-10 flex items-center justify-between px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500"><Lock size={18}/></div>
                    <div>
                      <h4 className="font-black text-slate-700">Premium Spot</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Unlock with PRO</p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-orange-100 text-orange-600 rounded-lg text-xs font-black uppercase tracking-widest">Unlock</button>
                </div>
                {/* Blurred Background Content */}
                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-3xl blur-[2px] opacity-50 shrink-0">{res.img}</div>
                <div className="flex-1 blur-[2px] opacity-50 min-w-0">
                  <h4 className="font-black text-slate-800 truncate">{res.name}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate">{res.category}</p>
                </div>
             </div>
          ))}
        </div>

        {/* Upgrade Banner */}
        {!userData.isPro && lockedCount > 0 && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-center shadow-xl border border-slate-700 relative overflow-hidden">
            <Crown size={60} className="absolute -top-4 -right-4 text-white/5" />
            <h4 className="text-lg font-black text-white mb-2">Want to see {lockedCount} more spots?</h4>
            <p className="text-xs text-slate-300 font-medium mb-4">You've hit the limit for the free version. Upgrade to PRO for unrestricted access to all secret locations.</p>
            <button onClick={() => setCurrentTab('pro')} className="bg-orange-500 hover:bg-orange-600 text-white w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              Unlock All Spots
            </button>
          </div>
        )}
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
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border shadow-sm shrink-0 ${selectedRes.isPromoted ? 'bg-gradient-to-br from-amber-100 to-yellow-200 border-amber-300' : 'bg-orange-50 border-orange-100'}`}>{selectedRes.img}</div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-black text-slate-800 leading-tight mb-1">{selectedRes.name}</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded-md">{selectedRes.category}</span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Star size={14} className="fill-orange-400 text-orange-400"/> {selectedRes.rating}</span>
              </div>
            </div>
          </div>
          {selectedRes.desc && <p className="text-sm text-slate-600 leading-snug">{selectedRes.desc}</p>}
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

          <div className="mt-8 pt-6 border-t border-slate-200">
            <button onClick={() => setShowBusinessModal(true)} className="w-full bg-white text-slate-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors border border-slate-200 text-sm shadow-sm">
              <Info size={18} /> Are you the manager? Claim Spot
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-5 pb-24">
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center mb-6">
        <div className="w-28 h-28 bg-orange-50 rounded-full flex items-center justify-center text-6xl mb-4 border-4 border-white shadow-xl shadow-orange-500/10 relative group">
          {userData.photoURL ? (
            <img src={userData.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            userData.avatar
          )}
          <button onClick={handleOpenEditProfile} className="absolute bottom-0 right-0 p-2 bg-orange-500 text-white rounded-full border-2 border-white shadow-lg active:scale-110 transition-transform"><Edit size={14} /></button>
        </div>
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          {userData.username} 
          {userData.fbVerified ? (
            <Facebook size={18} className="fill-[#1877F2] text-[#1877F2] ml-1" />
          ) : userData.isVerified ? (
            <CheckCircle size={20} className="text-blue-500 ml-1" />
          ) : null}
        </h3>
        <div className={`mt-4 px-5 py-2 rounded-full border flex items-center gap-2 font-black text-xs uppercase tracking-widest ${userTier.bg} ${userTier.color} ${userTier.border}`}>
          {userTier.icon} {userTier.name} • {userData.points} pts
        </div>
      </div>

      {!userData.isVerified && !userData.fbVerified && userData.authProvider !== 'guest' && (
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-[32px] p-6 text-white mb-6 shadow-xl shadow-orange-500/20"><h4 className="font-black text-xl mb-2">Verify Account</h4><p className="text-white/80 text-sm font-medium mb-4">Complete your verification to post hacks and unlock +100 Bonus Points.</p><button onClick={() => setShowVerifyModal(true)} className="w-full py-3.5 bg-white text-orange-600 font-black rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all">Start Verification</button></div>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center shadow-sm"><Share2 size={24} className="mx-auto mb-2 text-slate-300"/><div className="text-2xl font-black text-slate-800">{userData.hacksCount}</div><div className="text-[10px] font-black uppercase text-slate-400">Hacks Shared</div></div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center shadow-sm"><div className="text-2xl font-black text-green-500 mb-2">₱</div><div className="text-2xl font-black text-slate-800">{userData.totalSavings}</div><div className="text-[10px] font-black uppercase text-slate-400">Total Savings Shared</div></div>
      </div>

      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex flex-col mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">Personal Details</h4>
          <button onClick={handleOpenEditProfile} className="text-orange-500 hover:text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors">Edit</button>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
            {userData.fbVerified ? <span className="text-xs font-black text-[#1877F2] bg-blue-50 px-2 py-1 rounded border border-blue-200 flex items-center gap-1"><Facebook size={12}/> FB Verified</span> : userData.isVerified ? <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200 flex items-center gap-1"><Check size={12}/> Verified</span> : <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">Pending</span>}
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-xs font-bold text-slate-400 uppercase">Full Name</span>
            <span className="text-sm font-bold text-slate-800">{userData.fullName || 'Not set'}</span>
          </div>
          {(userData.authProvider === 'email' || userData.authProvider === 'facebook') && (
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-xs font-bold text-slate-400 uppercase">Email</span>
              <span className="text-sm font-bold text-slate-800">{userData.email || 'Not set'}</span>
            </div>
          )}
          {userData.authProvider === 'mobile' && (
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-xs font-bold text-slate-400 uppercase">Mobile</span>
              <span className="text-sm font-bold text-slate-800">{userData.mobile ? `+63 ${userData.mobile}` : 'Not set'}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-2">
            <span className="text-xs font-bold text-slate-400 uppercase">DOB</span>
            <span className="text-sm font-bold text-slate-800">{userData.dob || 'Not set'}</span>
          </div>
        </div>
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
          <>{currentTab === 'map' ? renderMap() : currentTab === 'spots' ? renderSpots() : currentTab === 'profile' ? renderProfile() : currentTab === 'pro' ? renderPro() : null}</>
        )}
      </main>
      
      {activeView === 'main' && renderTabBar()}
      
      {/* Toast */}
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
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><MapPin size={12} className="text-orange-400"/> {selectedRes.name}</p>
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
                <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Full Name</label><input value={editForm.fullName} readOnly={userData.fbVerified} onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))} className={`w-full px-5 py-4 rounded-2xl font-bold text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 ${userData.fbVerified ? 'bg-slate-100 cursor-not-allowed text-slate-500' : 'bg-white'}`} placeholder="Juan Dela Cruz" /></div>
                <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Date of Birth</label><input type="date" value={editForm.dob} onChange={(e) => setEditForm(prev => ({ ...prev, dob: e.target.value }))} className="w-full bg-white px-5 py-4 rounded-2xl font-bold text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" /></div>
              </div>

              <div className="h-px bg-slate-100 w-full"></div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2"><Lock size={16} className="text-orange-500"/><h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Account Security</h4></div>
                {(userData.authProvider === 'email' || userData.authProvider === 'facebook' || !userData.authProvider) && (
                  <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Email Address {userData.fbVerified && "(Facebook)"}</label><input type="email" required={userData.authProvider === 'email'} readOnly={userData.fbVerified} value={editForm.email} onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))} className={`w-full px-5 py-4 rounded-2xl font-bold text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 ${userData.fbVerified ? 'bg-slate-100 cursor-not-allowed text-slate-500' : 'bg-white'}`} placeholder="juan@example.com" /></div>
                )}
                {userData.authProvider === 'mobile' && (
                  <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Mobile Number</label><input type="tel" required value={editForm.mobile} onChange={(e) => setEditForm(prev => ({ ...prev, mobile: e.target.value.replace(new RegExp('[^0-9]', 'g'), '') }))} className="w-full bg-white px-5 py-4 rounded-2xl font-bold text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" placeholder="912 345 6789" /></div>
                )}
                {userData.authProvider !== 'facebook' && (
                  <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Password</label><input type="password" value={editForm.password} onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))} className="w-full bg-white px-5 py-4 rounded-2xl font-bold text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 placeholder:text-slate-300" placeholder="Leave blank to keep current" /></div>
                )}
              </div>

              <div className="h-px bg-slate-100 w-full"></div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2"><LinkIcon size={16} className="text-orange-500"/><h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Social Links</h4></div>
                <p className="text-xs font-medium text-slate-500 ml-1">Allow others to message you directly.</p>
                <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">WhatsApp Number</label><input type="tel" value={editForm.whatsapp} onChange={(e) => setEditForm(prev => ({ ...prev, whatsapp: e.target.value }))} className="w-full bg-white px-5 py-4 rounded-2xl font-bold text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" placeholder="+639..." /></div>
                <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Messenger Username</label><input type="text" value={editForm.messenger} onChange={(e) => setEditForm(prev => ({ ...prev, messenger: e.target.value }))} className="w-full bg-white px-5 py-4 rounded-2xl font-bold text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" placeholder="m.me/yourusername" /></div>
                <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Instagram Handle</label><input type="text" value={editForm.instagram} onChange={(e) => setEditForm(prev => ({ ...prev, instagram: e.target.value.replace('@','') }))} className="w-full bg-white px-5 py-4 rounded-2xl font-bold text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" placeholder="without the @" /></div>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative max-h-[90vh] flex flex-col">
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
