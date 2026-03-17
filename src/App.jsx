import React, { useState, useMemo } from 'react';
import { 
  Utensils, User, Lock, Search, Plus, ArrowUpCircle, 
  X, List, ShieldCheck, Star, Zap, CheckCircle, 
  ChevronRight, Share2, Info, Heart, Edit,
  MapPin, Map as MapIcon, Navigation2, Car
} from 'lucide-react';

// --- Mock Data ---
const MOCK_RESTAURANTS = [
  { id: '1', name: 'Jollibee', category: 'Fast Food', rating: 4.8, address: 'BGC, Taguig', lat: 14.5547, lng: 121.0244, img: '🐝', verified: true },
  { id: '2', name: "McDonald's", category: 'Fast Food', rating: 4.5, address: 'Makati Ave', lat: 14.56, lng: 121.03, img: '🍔', verified: true },
  { id: '3', name: 'Mang Inasal', category: 'Fast Food', rating: 4.7, address: 'Quezon City', lat: 14.65, lng: 121.03, img: '🍗', verified: true },
  { id: '4', name: 'Greenwich', category: 'Pizza', rating: 4.3, address: 'Ortigas Center', lat: 14.58, lng: 121.06, img: '🍕', verified: true },
  { id: '5', name: 'Starbucks', category: 'Coffee', rating: 4.6, address: 'Eastwood', lat: 14.60, lng: 121.08, img: '☕', verified: false }
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
  const [appState, setAppState] = useState('login'); // 'login', 'register', 'main'
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // App State (In-Memory)
  const [userData, setUserData] = useState({ 
    points: 50, isPro: false, isVerified: false, username: 'Foodie', avatar: '👤', favorites: [], following: [], hacksCount: 0, totalSavings: 0
  });
  const [restaurants] = useState(MOCK_RESTAURANTS);
  const [hacks, setHacks] = useState(MOCK_HACKS);
  const [promos] = useState(MOCK_PROMOS);
  
  // Navigation & UI State
  const [currentTab, setCurrentTab] = useState('spots');
  const [activeView, setActiveView] = useState('main');
  const [selectedRes, setSelectedRes] = useState(null);
  
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showAddHackModal, setShowAddHackModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  
  const [otpInput, setOtpInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editForm, setEditForm] = useState({ username: '', avatar: '' });
  const [toast, setToast] = useState('');

  const userTier = useMemo(() => TIERS.find(t => (userData.points || 0) >= t.minPoints) || TIERS[TIERS.length - 1], [userData.points]);

  const showToastMessage = (msg) => { 
    if (typeof msg !== 'string') return;
    setToast(msg); 
    setTimeout(() => setToast(''), 3000); 
  };

  // --- Handlers (Local State Only) ---
  const handleGuestLogin = () => {
    setAppState('main');
    showToastMessage("Welcome, Guest!");
  };

  const handleEmailAuth = (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    
    // Simulate network request
    setTimeout(() => {
      setAuthLoading(false);
      setAppState('main');
      showToastMessage(appState === 'login' ? "Logged in successfully!" : "Account created successfully!");
    }, 800);
  };
  
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otpInput === '1234') {
      setUserData(prev => ({ 
        ...prev, 
        isVerified: true, 
        points: prev.points + 100 
      }));
      setShowVerifyModal(false);
      setOtpInput('');
      showToastMessage("Successfully verified! +100 Points");
    } else {
      showToastMessage("Invalid OTP. Hint: Use 1234");
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setUserData(prev => ({ 
      ...prev, 
      username: editForm.username, 
      avatar: editForm.avatar 
    }));
    setShowEditProfileModal(false);
    showToastMessage("Profile updated successfully!");
  };

  const handleUpgradePro = (method) => {
    if (method === 'points' && userData.points < 1000) return showToastMessage("Not enough points!");
    
    setUserData(prev => ({ 
      ...prev, 
      isPro: true, 
      points: method === 'points' ? prev.points - 1000 : prev.points 
    }));
    showToastMessage("Welcome to PRO! All hacks unlocked.");
  };

  const handleToggleFavorite = (hackId) => {
    setUserData(prev => {
      const isFavorited = prev.favorites.includes(hackId);
      return {
        ...prev,
        favorites: isFavorited ? prev.favorites.filter(id => id !== hackId) : [...prev.favorites, hackId]
      };
    });
  };

  const handleToggleFollow = (authorName) => {
    setUserData(prev => {
      const isFollowing = prev.following.includes(authorName);
      return {
        ...prev,
        following: isFollowing ? prev.following.filter(name => name !== authorName) : [...prev.following, authorName]
      };
    });
  };

  const submitHack = (e) => {
    e.preventDefault();
    if (!userData.isVerified) return setShowVerifyModal(true);
    
    const formData = new FormData(e.target);
    const savings = Number(formData.get('savings'));
    
    const newHack = {
      id: Math.random().toString(36).substr(2, 9),
      resId: selectedRes.id, 
      title: formData.get('title'), 
      desc: formData.get('desc'),
      savings: savings, 
      votes: 1, 
      user: userData.username,
      avatar: userData.avatar, 
    };

    setHacks(prev => [newHack, ...prev]);
    setUserData(prev => ({ 
      ...prev,
      points: prev.points + 50,
      hacksCount: prev.hacksCount + 1,
      totalSavings: prev.totalSavings + savings
    }));
    
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
  if (appState === 'login' || appState === 'register') {
    return (
      <div className="flex flex-col h-screen w-full bg-slate-50 max-w-md mx-auto relative overflow-hidden font-sans">
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white relative">
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
          
          <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center text-5xl shadow-2xl shadow-orange-900/20 mb-6 z-10 transform rotate-[-10deg]">
            🍔
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter mb-2 z-10">Tipid Menu</h1>
          <p className="text-orange-100 font-medium mb-10 z-10 text-center">Smart Savings for the Filipino Foodie.</p>

          <form onSubmit={handleEmailAuth} className="w-full bg-white p-8 rounded-[32px] shadow-2xl z-10 text-slate-800 flex flex-col gap-4 animate-in slide-in-from-bottom-8">
            <h2 className="text-2xl font-black mb-2 text-center">{appState === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            
            {authError && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-3 rounded-xl text-center">
                {authError}
              </div>
            )}
            
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Email Address</label>
              <input 
                required 
                type="email" 
                value={authForm.email} 
                onChange={e => setAuthForm({...authForm, email: e.target.value})} 
                className="w-full bg-slate-50 px-5 py-4 rounded-2xl font-bold text-slate-900 border-none shadow-inner outline-none focus:ring-2 focus:ring-orange-500/20 mt-1 transition-all" 
                placeholder="juan@example.com" 
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Password</label>
              <input 
                required 
                type="password" 
                value={authForm.password} 
                onChange={e => setAuthForm({...authForm, password: e.target.value})} 
                className="w-full bg-slate-50 px-5 py-4 rounded-2xl font-bold text-slate-900 border-none shadow-inner outline-none focus:ring-2 focus:ring-orange-500/20 mt-1 transition-all" 
                placeholder="••••••••" 
              />
            </div>

            <button disabled={authLoading} type="submit" className="w-full py-4 mt-2 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-600/20 uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
              {authLoading ? 'Please wait...' : (appState === 'login' ? 'Sign In' : 'Sign Up')}
            </button>

            <div className="text-center mt-1">
              <button type="button" onClick={() => { setAppState(appState === 'login' ? 'register' : 'login'); setAuthError(''); }} className="text-xs font-bold text-slate-400 hover:text-orange-500 transition-colors">
                {appState === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>

            <div className="flex items-center gap-4 my-2">
              <div className="h-px bg-slate-100 flex-1"></div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">OR</span>
              <div className="h-px bg-slate-100 flex-1"></div>
            </div>

            <button type="button" onClick={handleGuestLogin} className="w-full py-4 bg-slate-50 text-slate-600 font-black rounded-2xl border border-slate-200 uppercase text-xs tracking-widest hover:bg-slate-100 active:scale-95 transition-all">
              Continue as Guest
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderHeader = () => (
    <header className="bg-white px-5 py-4 shadow-sm z-20 flex justify-between items-center sticky top-0">
      <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 italic uppercase tracking-tighter">Tipid Menu</h1>
      <button onClick={() => setCurrentTab('profile')} className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 active:scale-95 transition-transform">
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-orange-700">{userData.points} pts</span>
          <span className="text-[10px] font-semibold text-orange-500">{userTier.icon} {userTier.name}</span>
        </div>
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg border border-orange-200">{userData.avatar}</div>
      </button>
    </header>
  );

  const renderTabBar = () => (
    <nav className="bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-3 flex justify-between items-center sticky bottom-0 z-30 pb-safe">
      <button onClick={() => setCurrentTab('spots')} className={`flex flex-col items-center gap-1.5 transition-colors ${currentTab === 'spots' ? 'text-orange-600' : 'text-slate-300'}`}><List size={22} /><span className="text-[10px] font-black uppercase tracking-widest">Spots</span></button>
      <button onClick={() => { if(selectedRes) setShowAddHackModal(true); else setCurrentTab('spots'); }} className="bg-gradient-to-br from-orange-500 to-amber-500 p-4 rounded-full text-white shadow-xl shadow-orange-500/30 transform -translate-y-6 hover:scale-110 active:scale-95 transition-all"><Plus size={24}/></button>
      <button onClick={() => setCurrentTab('pro')} className={`flex flex-col items-center gap-1.5 transition-colors ${currentTab === 'pro' ? 'text-orange-600' : 'text-slate-300'}`}><Zap size={22} className={currentTab === 'pro' ? 'fill-orange-50' : ''}/><span className="text-[10px] font-black uppercase tracking-widest">PRO</span></button>
      <button onClick={() => setCurrentTab('profile')} className={`flex flex-col items-center gap-1.5 transition-colors ${currentTab === 'profile' ? 'text-orange-600' : 'text-slate-300'}`}><User size={22} className={currentTab === 'profile' ? 'fill-orange-50' : ''}/><span className="text-[10px] font-black uppercase tracking-widest">Me</span></button>
    </nav>
  );

  const renderSpots = () => {
    const filtered = restaurants.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50 p-5 pb-24">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search restaurants, brands..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full bg-white border border-slate-200 py-3.5 pl-12 pr-4 rounded-2xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm transition-all" 
          />
        </div>
        <h3 className="font-black text-slate-800 mb-6 uppercase tracking-widest text-sm flex items-center gap-2"><List size={18} className="text-orange-500" /> Discover Spots</h3>
        <div className="space-y-3">
          {filtered.map(res => (
            <div key={res.id} onClick={() => { setSelectedRes(res); setActiveView('restaurant'); }} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:border-orange-200 transition-colors group active:scale-[0.98]">
              <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-3xl border border-orange-100">{res.img}</div>
              <div className="flex-1"><h4 className="font-black text-slate-800 group-hover:text-orange-600 transition-colors">{res.name}</h4><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{res.category}</p></div>
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
        <div className="bg-white px-5 pt-4 pb-6 shadow-sm sticky top-0 z-10 flex flex-col gap-4">
          <button onClick={() => setActiveView('main')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800"><X size={20} /> Back</button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl border border-orange-100 shadow-inner">{selectedRes.img}</div>
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
                    <div key={hack.id} className="bg-white border border-slate-100 rounded-2xl p-4 relative overflow-hidden shadow-sm">
                      {isLocked && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center"><Lock size={24} className="text-slate-400 mb-2"/><button onClick={() => { setActiveView('main'); setCurrentTab('pro'); }} className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md">Unlock PRO</button></div>}
                      <h4 className="font-bold text-slate-800 mb-1 leading-tight">{hack.title}</h4>
                      <p className="text-sm text-slate-500 mb-3">{hack.desc}</p>
                      <div className="flex justify-between items-center border-t pt-3">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">{hack.avatar} {hack.user}</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleToggleFavorite(hack.id)} className="hover:scale-110 transition-transform"><Heart size={18} className={userData.favorites?.includes(hack.id) ? "fill-red-500 text-red-500" : "text-slate-300"}/></button>
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-black">₱{hack.savings} Save</span>
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
          <button onClick={() => { setEditForm({ username: userData.username, avatar: userData.avatar }); setShowEditProfileModal(true); }} className="absolute bottom-0 right-0 p-2 bg-orange-500 text-white rounded-full border-2 border-white shadow-lg active:scale-110 transition-transform"><Edit size={14} /></button>
        </div>
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">{userData.username} {userData.isVerified && <CheckCircle size={20} className="text-blue-500" />}</h3>
        <div className={`mt-4 px-5 py-2 rounded-full border flex items-center gap-2 font-black text-xs uppercase tracking-widest ${userTier.bg} ${userTier.color} ${userTier.border}`}>{userTier.icon} {userTier.name} • {userData.points} pts</div>
      </div>
      {!userData.isVerified && (
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-[32px] p-6 text-white mb-6 shadow-xl shadow-orange-500/20"><h4 className="font-black text-xl mb-2">Verify & Post</h4><p className="text-white/80 text-sm font-medium mb-4">Complete your verification to share hacks and unlock +100 Bonus Points.</p><button onClick={() => setShowVerifyModal(true)} className="w-full py-3.5 bg-white text-orange-600 font-black rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all">Start Verification</button></div>
      )}
      <div className="grid grid-cols-2 gap-4"><div className="bg-white p-6 rounded-3xl border border-slate-100 text-center shadow-sm"><Share2 size={24} className="mx-auto mb-2 text-slate-300"/><div className="text-2xl font-black text-slate-800">{userData.hacksCount}</div><div className="text-[10px] font-black uppercase text-slate-400">Hacks Shared</div></div><div className="bg-white p-6 rounded-3xl border border-slate-100 text-center shadow-sm"><div className="text-2xl font-black text-green-500 mb-2">₱</div><div className="text-2xl font-black text-slate-800">{userData.totalSavings}</div><div className="text-[10px] font-black uppercase text-slate-400">Total Savings Shared</div></div></div>
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
    <div className="flex flex-col h-screen w-full bg-slate-100 max-w-md mx-auto relative overflow-hidden font-sans">
      {activeView === 'main' && renderHeader()}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {activeView === 'restaurant' && renderRestaurant()}
        {activeView === 'main' && (
          <>{currentTab === 'spots' ? renderSpots() : currentTab === 'profile' ? renderProfile() : currentTab === 'pro' ? renderPro() : null}</>
        )}
      </main>
      {activeView === 'main' && renderTabBar()}
      
      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-5 py-2.5 rounded-full shadow-2xl z-[200] border border-slate-700 animate-in fade-in slide-in-from-top-4 flex items-center gap-2"><Info size={16} className="text-orange-400" /><p className="font-bold text-sm">{toast}</p></div>}

      {/* Modals */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
            <button onClick={() => setShowVerifyModal(false)} className="absolute top-8 right-8 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 active:scale-90 transition-all"><X size={18} /></button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-inner"><ShieldCheck size={32} /></div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Verification</h3>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mt-1">Enter 4-Digit Code</p>
            </div>
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <input type="text" maxLength={4} value={otpInput} onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))} className="w-full text-center text-4xl tracking-[0.8em] font-black text-slate-900 bg-slate-50 border-none py-6 rounded-[28px] shadow-inner outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="••••" />
              <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl uppercase text-xs tracking-widest active:scale-95 transition-all">Confirm & Verify</button>
            </form>
          </div>
        </div>
      )}

      {showAddHackModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md sm:rounded-[40px] rounded-t-[40px] p-8 pt-10 shadow-2xl relative max-h-[90vh] flex flex-col animate-in slide-in-from-bottom">
            <button onClick={() => setShowAddHackModal(false)} className="absolute top-8 right-8 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 active:scale-90 transition-all"><X size={18} /></button>
            <h3 className="text-2xl font-black mb-2 flex items-center gap-2 tracking-tight text-slate-800">Share Hack</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">{selectedRes?.name}</p>
            <form onSubmit={submitHack} className="space-y-5 overflow-y-auto no-scrollbar pb-6">
              <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Hack Title</label><input required name="title" className="w-full bg-slate-50 px-5 py-4 rounded-2xl font-black text-slate-900 border-none shadow-inner mt-1 outline-none focus:ring-2 focus:ring-orange-500/10" placeholder="e.g. Solo Gravy Hack" /></div>
              <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Instructions</label><textarea required name="desc" rows={3} className="w-full bg-slate-50 px-5 py-4 rounded-2xl font-medium text-slate-900 border-none shadow-inner mt-1 resize-none outline-none focus:ring-2 focus:ring-orange-500/10" placeholder="How do we do it?"></textarea></div>
              <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Savings (₱)</label><input required name="savings" type="number" className="w-full bg-slate-50 px-5 py-4 rounded-2xl font-black text-slate-900 border-none shadow-inner mt-1 outline-none focus:ring-2 focus:ring-orange-500/10" placeholder="0" /></div>
              <button type="submit" className="w-full py-5 bg-orange-600 text-white font-black rounded-[24px] shadow-xl shadow-orange-600/20 uppercase text-xs tracking-[0.2em] mt-4 hover:scale-[1.02] active:scale-95 transition-all">Post & Earn +50 pts</button>
            </form>
          </div>
        </div>
      )}

      {showEditProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative">
            <button onClick={() => setShowEditProfileModal(false)} className="absolute top-8 right-8 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 active:scale-90 transition-all"><X size={18} /></button>
            <h3 className="text-2xl font-black mb-8 text-center uppercase tracking-widest text-sm text-slate-400">Update Profile</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Username</label><input required value={editForm.username} onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))} className="w-full bg-slate-50 px-5 py-4 rounded-2xl font-black text-slate-900 border-none shadow-inner mt-1 outline-none focus:ring-2 focus:ring-orange-500/10" /></div>
              <div className="grid grid-cols-5 gap-3">
                {['👤', '🍔', '🍕', '🍗', '🍟', '🧋', '☕', '🍩', '🌮', '🍦'].map(emoji => (
                  <button key={emoji} type="button" onClick={() => setEditForm(prev => ({ ...prev, avatar: emoji }))} className={`text-2xl p-3 rounded-2xl border-2 transition-all ${editForm.avatar === emoji ? 'bg-orange-50 border-orange-500 scale-110 shadow-lg' : 'bg-slate-50 border-transparent shadow-inner opacity-60 hover:opacity-100'}`}>{emoji}</button>
                ))}
              </div>
              <button type="submit" className="w-full py-4 bg-orange-500 text-white font-black rounded-2xl shadow-xl uppercase text-xs tracking-widest active:scale-95 transition-all">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
