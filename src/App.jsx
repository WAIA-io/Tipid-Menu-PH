import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Utensils, User, Lock, Search, Plus, ArrowUpCircle, 
  X, List, ShieldCheck, Star, Zap, CheckCircle, 
  ChevronRight, Share2, Info, Heart, Edit,
  MapPin, Map as MapIcon, Navigation2, Car, Shield, Check, Trash2, Ban,
  AlertTriangle, BarChart3, Settings, MessageSquare, Pin, Megaphone,
  TrendingUp, EyeOff, AlertOctagon, Bell, Users, Activity,
  FileSpreadsheet, FileCode2
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

export default function App() {
  // Authentication & App State
  const [appState, setAppState] = useState('login'); 
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // User Data State (In-Memory)
  const [userData, setUserData] = useState({ 
    points: 50, isPro: false, isVerified: false, username: 'Foodie', avatar: '👤', favorites: [], following: [], hacksCount: 0, totalSavings: 0, isAdmin: true
  });
  
  // App Data State
  const [restaurants] = useState(MOCK_RESTAURANTS);
  const [hacks, setHacks] = useState(MOCK_HACKS);
  const [promos] = useState(MOCK_PROMOS);
  const [globalAnnouncement, setGlobalAnnouncement] = useState('');
  
  // Advanced Admin State
  const [usersList, setUsersList] = useState([
    { id: '001', username: 'PinoyEater', email: 'pinoy@eater.com', isVerified: true, status: 'active', joined: '2023-10-12', points: 1200, warnings: 0, posts: 12, lastLogin: '2026-03-17' },
    { id: '002', username: 'HackMaster', email: 'master@hack.com', isVerified: true, status: 'active', joined: '2023-11-05', points: 300, warnings: 1, posts: 5, lastLogin: '2026-03-16' },
    { id: '003', username: 'SpamBot99', email: 'spam@bot.com', isVerified: false, status: 'shadowbanned', joined: '2024-01-20', points: 0, warnings: 3, posts: 0, lastLogin: '2026-02-10' },
  ]);
  const [businessRequests, setBusinessRequests] = useState([
    { id: 'b1', restaurant: 'Jollibee BGC', user: 'Jollibee_Admin', email: 'admin@jfc.com', status: 'pending', date: '2024-02-15' }
  ]);
  const [reportsList, setReportsList] = useState([
    { id: 'r1', targetId: 'h2', type: 'Hack', reason: "Misleading info, doesn't work anymore.", reportedBy: 'AngryUser12', status: 'pending' },
    { id: 'r2', targetId: 'u3', type: 'User', reason: 'Spamming referral codes in descriptions.', reportedBy: 'PinoyEater', status: 'pending' },
  ]);
  const [inboxMessages, setInboxMessages] = useState([
    { id: 'm1', from: 'KFC Marketing', subject: 'Partnership Inquiry', body: 'We want to post official promos on your app.', date: 'Today', isRead: false },
    { id: 'm2', from: 'User123', subject: 'Bug Report', body: 'The map isn\'t loading on my iPhone.', date: 'Yesterday', isRead: true },
  ]);
  const [appSettings, setAppSettings] = useState({
    autoApproveHacks: false,
    maintenanceMode: false,
    requireOTP: true,
  });

  const [adminTab, setAdminTab] = useState('overview');
  const [adminSearch, setAdminSearch] = useState('');

  // Navigation & UI State
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
  const [editForm, setEditForm] = useState({ username: '', avatar: '' });
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [broadcastInput, setBroadcastInput] = useState('');
  const [toast, setToast] = useState('');

  // Refs for Secret Admin Access
  const logoTapCount = useRef(0);
  const logoTapTimeout = useRef(null);

  const userTier = useMemo(() => TIERS.find(t => (userData.points || 0) >= t.minPoints) || TIERS[TIERS.length - 1], [userData.points]);

  const showToastMessage = (msg) => { 
    if (typeof msg !== 'string') return;
    setToast(msg); 
    setTimeout(() => setToast(''), 3000); 
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Status', 'Verified', 'Posts', 'Last Login'];
    const rows = usersList.map(u => [
      u.id, u.username, u.email, u.status, String(u.isVerified).toUpperCase(), u.posts || 0, u.lastLogin || u.joined
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n' 
      + rows.map(e => e.join(',')).join('\n');
    
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
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<users>\n';
    usersList.forEach(u => {
      xml += `  <user id="${u.id}">\n`;
      xml += `    <name>${u.username}</name>\n`;
      xml += `    <email>${u.email}</email>\n`;
      xml += `    <status>${u.status}</status>\n`;
      xml += `    <verified>${u.isVerified}</verified>\n`;
      xml += `    <posts>${u.posts || 0}</posts>\n`;
      xml += `    <lastLogin>${u.lastLogin || u.joined}</lastLogin>\n`;
      xml += `  </user>\n`;
    });
    xml += '</users>';
    
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "data.xml");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToastMessage("XML data structure exported successfully!");
  };

  const handleLogoTap = () => {
    logoTapCount.current += 1;
    if (logoTapTimeout.current) clearTimeout(logoTapTimeout.current);

    if (logoTapCount.current >= 5) {
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
      setActiveView('admin');
      showToastMessage("Super Admin Access Granted.");
    } else {
      setAdminPasswordInput('');
      showToastMessage("Incorrect admin password.");
    }
  };

  const handleGuestLogin = () => {
    setAppState('main');
    showToastMessage("Welcome, Guest!");
  };

  const handleEmailAuth = (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setTimeout(() => {
      setAuthLoading(false);
      setAppState('main');
      showToastMessage(appState === 'login' ? "Logged in successfully!" : "Account created successfully!");
    }, 800);
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

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setUserData(prev => ({ ...prev, username: editForm.username, avatar: editForm.avatar }));
    setShowEditProfileModal(false);
    showToastMessage("Profile updated!");
  };

  const submitHack = (e) => {
    e.preventDefault();
    if (!userData.isVerified && appSettings.requireOTP) {
      setShowAddHackModal(false);
      setShowVerifyModal(true);
      return;
    }
    
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
      status: appSettings.autoApproveHacks ? 'approved' : 'pending',
      isPinned: false
    };

    setHacks(prev => [newHack, ...prev]);
    setUserData(prev => ({ ...prev, points: prev.points + 50, hacksCount: prev.hacksCount + 1, totalSavings: prev.totalSavings + savings }));
    setShowAddHackModal(false);
    showToastMessage(appSettings.autoApproveHacks ? "Hack published! +50 Points" : "Hack submitted for review! +50 Points");
  };

  const adminTogglePin = (id) => {
    setHacks(prev => prev.map(h => h.id === id ? { ...h, isPinned: !h.isPinned } : h));
    showToastMessage("Pin status updated.");
  };

  const adminAdjustUserPoints = (id, amount) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, points: u.points + amount } : u));
    showToastMessage(`Added ${amount} points to user.`);
  };

  const adminWarnUser = (id) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, warnings: u.warnings + 1 } : u));
    showToastMessage("Warning sent to user.");
  };

  const adminChangeUserStatus = (id, status) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    showToastMessage(`User status changed to ${status}.`);
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

  const openNav = (type, lat, lng) => {
    const urls = { 
      google: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, 
      apple: `http://maps.apple.com/?daddr=${lat},${lng}`, 
      waze: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes` 
    };
    window.open(urls[type]);
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

  const submitBusinessClaim = (e) => {
    e.preventDefault();
    const newReq = {
      id: Math.random().toString(36).substr(2, 9),
      restaurant: selectedRes?.name,
      user: userData.username,
      email: 'business@owner.com',
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    setBusinessRequests(prev => [newReq, ...prev]);
    setShowBusinessModal(false);
    showToastMessage("Claim requested! Our team will verify soon.");
  };

  const adminApproveHack = (id) => {
    setHacks(prev => prev.map(h => h.id === id ? { ...h, status: 'approved' } : h));
    showToastMessage("Hack Approved & Published!");
  };

  const adminRejectHack = (id) => {
    setHacks(prev => prev.filter(h => h.id !== id));
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

  const adminApproveBusiness = (id) => {
    setBusinessRequests(prev => prev.map(b => b.id === id ? { ...b, status: 'approved' } : b));
    showToastMessage("Business Claim Approved!");
  };

  const adminRejectBusiness = (id) => {
    setBusinessRequests(prev => prev.map(b => b.id === id ? { ...b, status: 'rejected' } : b));
    showToastMessage("Business Claim Rejected.");
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
            
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Email Address</label>
              <input required type="email" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} className="w-full bg-slate-50 px-5 py-4 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none focus:ring-2 focus:ring-orange-500/20 mt-1 transition-all" placeholder="juan@example.com" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Password</label>
              <input required type="password" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} className="w-full bg-slate-50 px-5 py-4 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none focus:ring-2 focus:ring-orange-500/20 mt-1 transition-all" placeholder="••••••••" />
            </div>

            <button disabled={authLoading} type="submit" className="w-full py-4 mt-2 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-600/20 uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
              {authLoading ? 'Please wait...' : (appState === 'login' ? 'Sign In' : 'Sign Up')}
            </button>

            <div className="text-center mt-1">
              <button type="button" onClick={() => setAppState(appState === 'login' ? 'register' : 'login')} className="text-xs font-bold text-slate-400 hover:text-orange-500 transition-colors">
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

  const renderAdmin = () => {
    const filteredUsers = usersList.filter(u => u.username.toLowerCase().includes(adminSearch.toLowerCase()) || u.email.toLowerCase().includes(adminSearch.toLowerCase()));
    const filteredHacks = hacks.filter(h => h.title.toLowerCase().includes(adminSearch.toLowerCase()) || h.user.toLowerCase().includes(adminSearch.toLowerCase()));

    const pendingHacksCount = hacks.filter(h => h.status === 'pending').length;
    const pendingReportsCount = reportsList.filter(r => r.status === 'pending').length;

    const adminNavTabs = [
      { id: 'overview', icon: Activity, label: 'Overview' },
      { id: 'hacks', icon: Utensils, label: `Hacks (${pendingHacksCount})` },
      { id: 'users', icon: Users, label: 'Users' },
      { id: 'reports', icon: AlertTriangle, label: `Reports (${pendingReportsCount})` },
      { id: 'messages', icon: MessageSquare, label: 'Messages' },
      { id: 'analytics', icon: BarChart3, label: 'Analytics' },
      { id: 'settings', icon: Settings, label: 'Settings' }
    ];

    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 animate-in slide-in-from-bottom duration-300 z-50 fixed inset-0 max-w-md mx-auto">
        <div className="bg-slate-900 pt-10 pb-4 shadow-xl z-20 flex-shrink-0">
          <div className="flex justify-between items-center text-white px-5 mb-6">
            <h2 className="text-xl font-black flex items-center gap-2"><Shield size={24} className="text-orange-500"/> Command Center</h2>
            <button onClick={() => setActiveView('main')} className="p-2 bg-slate-800 rounded-full hover:bg-red-500 hover:text-white transition-colors"><X size={20}/></button>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-2">
            {adminNavTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setAdminTab(tab.id)} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all ${adminTab === tab.id ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                  <Icon size={14}/> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-100">
          {adminTab === 'overview' && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-2">System Status</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200"><div className="text-slate-400 mb-1"><Users size={20}/></div><div className="text-2xl font-black text-slate-800">4,289</div><div className="text-[10px] font-bold text-slate-500 uppercase">Total Users</div></div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200"><div className="text-orange-500 mb-1"><Utensils size={20}/></div><div className="text-2xl font-black text-slate-800">842</div><div className="text-[10px] font-bold text-slate-500 uppercase">Active Hacks</div></div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200"><div className="text-red-500 mb-1"><AlertTriangle size={20}/></div><div className="text-2xl font-black text-slate-800">{pendingReportsCount}</div><div className="text-[10px] font-bold text-slate-500 uppercase">Pending Reports</div></div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200"><div className="text-green-500 mb-1 font-black text-lg">₱</div><div className="text-2xl font-black text-slate-800">1.2M</div><div className="text-[10px] font-bold text-slate-500 uppercase">Saved by Comm.</div></div>
              </div>
            </div>
          )}

          {adminTab === 'hacks' && (
            <div className="space-y-4 animate-in fade-in">
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

          {adminTab === 'users' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Search users by name or email..." value={adminSearch} onChange={(e) => setAdminSearch(e.target.value)} className="w-full bg-white border border-slate-200 py-3 pl-10 pr-4 rounded-xl font-medium text-sm focus:outline-none focus:border-orange-500 text-slate-900" />
                </div>
                <button onClick={exportCSV} className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors border border-green-200 shadow-sm" title="Export to Excel (CSV)">
                  <FileSpreadsheet size={20} />
                </button>
                <button onClick={exportXML} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors border border-blue-200 shadow-sm" title="Export XML">
                  <FileCode2 size={20} />
                </button>
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
                    <button onClick={() => adminAdjustUserPoints(u.id, 100)} className="bg-orange-50 text-orange-600 border border-orange-200 font-bold py-1.5 px-3 rounded-lg text-xs hover:bg-orange-100">+100 Pts</button>
                    <button onClick={() => adminWarnUser(u.id)} className="bg-amber-50 text-amber-600 border border-amber-200 font-bold py-1.5 px-3 rounded-lg text-xs hover:bg-amber-100">Warn</button>
                    <button onClick={() => adminChangeUserStatus(u.id, u.status === 'shadowbanned' ? 'active' : 'shadowbanned')} className="bg-slate-100 text-slate-600 border border-slate-300 font-bold py-1.5 px-3 rounded-lg text-xs hover:bg-slate-200"><EyeOff size={12} className="inline mr-1 mb-0.5"/>{u.status === 'shadowbanned' ? 'Un-Shadowban' : 'Shadowban'}</button>
                    <button onClick={() => adminChangeUserStatus(u.id, u.status === 'banned' ? 'active' : 'banned')} className="bg-red-50 text-red-600 border border-red-200 font-bold py-1.5 px-3 rounded-lg text-xs hover:bg-red-100"><Ban size={12} className="inline mr-1 mb-0.5"/>{u.status === 'banned' ? 'Unban' : 'Ban'}</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {adminTab === 'reports' && (
            <div className="space-y-4 animate-in fade-in">
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
                      <button onClick={() => adminResolveReport(rep.id, 'delete')} className="flex-1 bg-red-50 text-red-600 font-bold py-2 rounded-xl text-xs border border-red-200 hover:bg-red-100">Delete Content</button>
                      <button onClick={() => adminResolveReport(rep.id, 'ignore')} className="flex-1 bg-slate-100 text-slate-600 font-bold py-2 rounded-xl text-xs hover:bg-slate-200">Dismiss</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {adminTab === 'messages' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-5 rounded-2xl shadow-lg text-white">
                <h4 className="font-black flex items-center gap-2 mb-3"><Megaphone size={18}/> Broadcast Announcement</h4>
                <form onSubmit={sendBroadcast}>
                  <textarea required value={broadcastInput} onChange={e => setBroadcastInput(e.target.value)} rows={2} placeholder="Write a message to all users..." className="w-full bg-white/10 border border-white/20 px-4 py-3 rounded-xl text-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 resize-none mb-3"></textarea>
                  <button type="submit" className="w-full bg-white text-blue-600 font-black py-3 rounded-xl shadow-md hover:scale-[1.02] active:scale-95 transition-transform text-xs uppercase tracking-widest">Push Notification</button>
                </form>
              </div>

              <div>
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-3">Inbox</h3>
                <div className="space-y-3">
                  {inboxMessages.map(msg => (
                    <div key={msg.id} className={`bg-white p-4 rounded-2xl shadow-sm border ${msg.isRead ? 'border-slate-200 opacity-70' : 'border-blue-200 border-l-4 border-l-blue-500'}`}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-800 text-sm">{msg.subject}</h4>
                        <span className="text-[10px] font-bold text-slate-400">{msg.date}</span>
                      </div>
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-2">From: {msg.from}</p>
                      <p className="text-xs text-slate-600 line-clamp-2">{msg.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {adminTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in">
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
                <h4 className="font-black text-slate-800 flex items-center gap-2 mb-4"><Star size={18} className="text-amber-500"/> Top Categories</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Fast Food Hacks</span><span>65%</span></div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className="bg-amber-500 h-full w-[65%]"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Coffee Customizations</span><span>20%</span></div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className="bg-amber-500 h-full w-[20%]"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Convenience Store Promos</span><span>15%</span></div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className="bg-amber-500 h-full w-[15%]"></div></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'settings' && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-2">App Configuration</h3>
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
                    <h4 className="font-bold text-slate-800">Require OTP Verification</h4>
                    <p className="text-[10px] font-medium text-slate-500">Users must verify to post hacks.</p>
                  </div>
                  <button onClick={() => toggleSetting('requireOTP')} className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${appSettings.requireOTP ? 'bg-green-500' : 'bg-slate-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${appSettings.requireOTP ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-red-600">Maintenance Mode</h4>
                    <p className="text-[10px] font-medium text-slate-500">Show maintenance screen to non-admins.</p>
                  </div>
                  <button onClick={() => toggleSetting('maintenanceMode')} className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${appSettings.maintenanceMode ? 'bg-red-500' : 'bg-slate-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${appSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
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
        {userData.isAdmin && (
          <button 
            onClick={() => setActiveView('admin')} 
            className="w-10 h-10 bg-slate-900 text-orange-400 rounded-full flex items-center justify-center shadow-md hover:bg-slate-800 transition-colors active:scale-95"
            title="Command Center"
          >
            <Shield size={20} />
          </button>
        )}
        <button onClick={() => setCurrentTab('profile')} className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 active:scale-95 transition-transform">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-orange-700">{userData.points} pts</span>
            <span className="text-[10px] font-semibold text-orange-500">{userTier.icon} {userTier.name}</span>
          </div>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg border border-orange-200">{userData.avatar}</div>
        </button>
      </div>
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
    const resHacks = hacks.filter(h => h.resId === selectedRes.id && h.status === 'approved').sort((a,b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.votes - a.votes;
    });
    
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
          {userData.avatar}
          <button onClick={() => { setEditForm({ username: userData.username, avatar: userData.avatar }); setShowEditProfileModal(true); }} className="absolute bottom-0 right-0 p-2 bg-orange-500 text-white rounded-full border-2 border-white shadow-lg active:scale-110 transition-transform"><Edit size={14} /></button>
        </div>
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">{userData.username} {userData.isVerified && <CheckCircle size={20} className="text-blue-500" />}</h3>
        <div className={`mt-4 px-5 py-2 rounded-full border flex items-center gap-2 font-black text-xs uppercase tracking-widest ${userTier.bg} ${userTier.color} ${userTier.border}`}>{userTier.icon} {userTier.name} • {userData.points} pts</div>
      </div>
      
      {!userData.isVerified && (
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-[32px] p-6 text-white mb-6 shadow-xl shadow-orange-500/20"><h4 className="font-black text-xl mb-2">Verify Account</h4><p className="text-white/80 text-sm font-medium mb-4">Complete your verification to post hacks and unlock +100 Bonus Points.</p><button onClick={() => setShowVerifyModal(true)} className="w-full py-3.5 bg-white text-orange-600 font-black rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all">Start Verification</button></div>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center shadow-sm">
          <Share2 size={24} className="mx-auto mb-2 text-slate-300"/>
          <div className="text-2xl font-black text-slate-800">{userData.hacksCount}</div>
          <div className="text-[10px] font-black uppercase text-slate-400">Hacks Shared</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center shadow-sm">
          <div className="text-2xl font-black text-green-500 mb-2">₱</div>
          <div className="text-2xl font-black text-slate-800">{userData.totalSavings}</div>
          <div className="text-[10px] font-black uppercase text-slate-400">Total Savings Shared</div>
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
          <>{currentTab === 'spots' ? renderSpots() : currentTab === 'profile' ? renderProfile() : currentTab === 'pro' ? renderPro() : null}</>
        )}
      </main>
      
      {activeView === 'main' && renderTabBar()}
      
      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-5 py-2.5 rounded-full shadow-2xl z-[200] border border-slate-700 animate-in fade-in slide-in-from-top-4 flex items-center gap-2"><Info size={16} className="text-orange-400" /><p className="font-bold text-sm whitespace-nowrap">{toast}</p></div>}

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

      {showAddHackModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md sm:rounded-[40px] rounded-t-[40px] p-8 pt-10 shadow-2xl relative max-h-[90vh] flex flex-col animate-in slide-in-from-bottom">
            <button onClick={() => setShowAddHackModal(false)} className="absolute top-8 right-8 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 active:scale-90 transition-all"><X size={18} /></button>
            <h3 className="text-2xl font-black mb-2 flex items-center gap-2 tracking-tight text-slate-800">Share Hack</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">{selectedRes?.name}</p>
            <form onSubmit={submitHack} className="space-y-5 overflow-y-auto no-scrollbar pb-6">
              <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Hack Title</label><input required name="title" className="w-full bg-white px-5 py-4 rounded-2xl font-black text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" placeholder="e.g. Solo Gravy Hack" /></div>
              <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Instructions</label><textarea required name="desc" rows={3} className="w-full bg-white px-5 py-4 rounded-2xl font-medium text-slate-900 border border-slate-200 shadow-sm mt-1 resize-none outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" placeholder="How do we do it?"></textarea></div>
              <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Savings (₱)</label><input required name="savings" type="number" className="w-full bg-white px-5 py-4 rounded-2xl font-black text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" placeholder="0" /></div>
              <button type="submit" className="w-full py-5 bg-orange-600 text-white font-black rounded-[24px] shadow-xl shadow-orange-600/20 uppercase text-xs tracking-[0.2em] mt-4 hover:scale-[1.02] active:scale-95 transition-all">Submit for Review</button>
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
              <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Username</label><input required value={editForm.username} onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))} className="w-full bg-white px-5 py-4 rounded-2xl font-black text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" /></div>
              <div className="grid grid-cols-5 gap-3">
                {['👤', '🍔', '🍕', '🍗', '🍟', '🧋', '☕', '🍩', '🌮', '🍦'].map(emoji => (
                  <button key={emoji} type="button" onClick={() => setEditForm(prev => ({ ...prev, avatar: emoji }))} className={`text-2xl p-3 rounded-2xl border-2 transition-all ${editForm.avatar === emoji ? 'bg-orange-50 border-orange-500 scale-110 shadow-lg' : 'bg-white border-slate-200 shadow-sm opacity-60 hover:opacity-100'}`}>{emoji}</button>
                ))}
              </div>
              <button type="submit" className="w-full py-4 bg-orange-500 text-white font-black rounded-2xl shadow-xl uppercase text-xs tracking-widest active:scale-95 transition-all">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {showBusinessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative">
            <button onClick={() => setShowBusinessModal(false)} className="absolute top-8 right-8 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 active:scale-90 transition-all"><X size={18} /></button>
            <h3 className="text-2xl font-black mb-2 text-slate-800">Claim Spot</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{selectedRes?.name}</p>
            <form onSubmit={submitBusinessClaim} className="space-y-6">
              <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Business Email</label><input required type="email" placeholder="manager@restaurant.com" className="w-full bg-white px-5 py-4 rounded-2xl font-black text-slate-900 border border-slate-200 shadow-sm mt-1 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" /></div>
              <button type="submit" className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl uppercase text-xs tracking-widest active:scale-95 transition-all hover:bg-slate-800">Submit Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
