{\rtf1\ansi\ansicpg1252\cocoartf2868
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Menlo-Regular;\f1\fnil\fcharset0 AppleColorEmoji;}
{\colortbl;\red255\green255\blue255;\red183\green111\blue247;\red23\green24\blue24;\red202\green202\blue202;
\red54\green192\blue160;\red212\green212\blue212;\red113\green192\blue131;\red109\green115\blue120;\red163\green79\blue131;
\red246\green124\blue48;\red238\green46\blue56;}
{\*\expandedcolortbl;;\cssrgb\c77255\c54118\c97647;\cssrgb\c11765\c12157\c12549;\cssrgb\c83137\c83137\c83137;
\cssrgb\c23922\c78824\c69020;\cssrgb\c86275\c86275\c86275;\cssrgb\c50588\c78824\c58431;\cssrgb\c50196\c52549\c54510;\cssrgb\c70588\c40000\c58431;
\cssrgb\c98039\c56471\c24314;\cssrgb\c95686\c27843\c27843;}
\paperw11900\paperh16840\margl1440\margr1440\vieww36980\viewh24880\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs28 \cf2 \cb3 \expnd0\expndtw0\kerning0
import\cf4 \cb3  \cf5 \cb3 React\cf6 \cb3 ,\cf4  \cf6 \{\cf4  useState\cf6 ,\cf4  useEffect\cf6 ,\cf4  useMemo\cf6 ,\cf4  useRef \cf6 \}\cf4  \cf2 \cb3 from\cf4 \cb3  \cf7 \cb3 'react'\cf6 \cb3 ;\cf4 \cb1 \
\cf2 \cb3 import\cf4 \cb3  \cf6 \{\cf4  initializeApp \cf6 \}\cf4  \cf2 \cb3 from\cf4 \cb3  \cf7 \cb3 'firebase/app'\cf6 \cb3 ;\cf4 \cb1 \
\cf2 \cb3 import\cf4 \cb3  \cf6 \{\cf4  \cb1 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3   getFirestore\cf6 ,\cf4  collection\cf6 ,\cf4  doc\cf6 ,\cf4  setDoc\cf6 ,\cf4  onSnapshot\cf6 ,\cf4  addDoc\cf6 ,\cf4  updateDoc\cf6 ,\cf4  increment\cf6 ,\cf4  arrayUnion\cf6 ,\cf4  arrayRemove \cb1 \
\cf6 \cb3 \}\cf4  \cf2 \cb3 from\cf4 \cb3  \cf7 \cb3 'firebase/firestore'\cf6 \cb3 ;\cf4 \cb1 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 import\cf4 \cb3  \cf6 \{\cf4  \cb1 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3   getAuth\cf6 ,\cf4  signInAnonymously\cf6 ,\cf4  signInWithCustomToken\cf6 ,\cf4  onAuthStateChanged \cb1 \
\cf6 \cb3 \}\cf4  \cf2 \cb3 from\cf4 \cb3  \cf7 \cb3 'firebase/auth'\cf6 \cb3 ;\cf4 \cb1 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 import\cf4 \cb3  \cf6 \{\cf4  \cb1 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3   \cf5 \cb3 MapPin\cf6 \cb3 ,\cf4  \cf5 \cb3 Utensils\cf6 \cb3 ,\cf4  \cf5 \cb3 User\cf6 \cb3 ,\cf4  \cf5 \cb3 Lock\cf6 \cb3 ,\cf4  \cf5 \cb3 Search\cf6 \cb3 ,\cf4  \cf5 \cb3 Plus\cf6 \cb3 ,\cf4  \cf5 \cb3 ArrowUpCircle\cf6 \cb3 ,\cf4  \cb1 \
\cb3   \cf5 \cb3 Coffee\cf6 \cb3 ,\cf4  \cf5 \cb3 Pizza\cf6 \cb3 ,\cf4  \cf5 \cb3 X\cf6 \cb3 ,\cf4  \cf5 \cb3 Navigation2\cf6 \cb3 ,\cf4  \cf5 \cb3 Map\cf4 \cb3  \cf2 \cb3 as\cf4 \cb3  \cf5 \cb3 MapIcon\cf6 \cb3 ,\cf4  \cf5 \cb3 Car\cf6 \cb3 ,\cf4  \cf5 \cb3 List\cf6 \cb3 ,\cf4  \cb1 \
\cb3   \cf5 \cb3 ShieldCheck\cf6 \cb3 ,\cf4  \cf5 \cb3 Star\cf6 \cb3 ,\cf4  \cf5 \cb3 Zap\cf6 \cb3 ,\cf4  \cf5 \cb3 Award\cf6 \cb3 ,\cf4  \cf5 \cb3 CheckCircle\cf6 \cb3 ,\cf4  \cf5 \cb3 ChevronRight\cf6 \cb3 ,\cf4  \cf5 \cb3 Share2\cf6 \cb3 ,\cf4  \cf5 \cb3 Info\cf6 \cb3 ,\cf4  \cf5 \cb3 Heart\cf6 \cb3 ,\cf4  \cf5 \cb3 Edit\cf6 \cb3 ,\cf4  \cf5 \cb3 Crown\cf4 \cb1 \
\cf6 \cb3 \}\cf4  \cf2 \cb3 from\cf4 \cb3  \cf7 \cb3 'lucide-react'\cf6 \cb3 ;\cf4 \cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf8 \cb3 // --- Firebase Configuration ---\cf4 \cb1 \
\cf2 \cb3 const getFirebaseConfig = () => \{\
  return \{\
    apiKey: "AIzaSy...",\
    authDomain: "tipid-menu.firebaseapp.com",\
    projectId: "tipid-menu",\
    storageBucket: "tipid-menu.firebasestorage.app",\
    messagingSenderId: "73228...",\
    appId: "1:73228329..."\
  \};\
\};\cf4 \cb1 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3   \cf2 \cb3 try\cf4 \cb3  \cf6 \{\cf4  \cf2 \cb3 return\cf4 \cb3  \cf2 \cb3 typeof\cf4 \cb3  __firebase_config \cf6 ===\cf4  \cf7 \cb3 'string'\cf4 \cb3  \cf6 ?\cf4  \cf5 \cb3 JSON\cf6 \cb3 .\cf4 parse\cf6 (\cf4 __firebase_config\cf6 )\cf4  \cf6 :\cf4  __firebase_config\cf6 ;\cf4  \cf6 \}\cf4  \cb1 \
\cb3   \cf2 \cb3 catch\cf4 \cb3  \cf6 (\cf4 e\cf6 )\cf4  \cf6 \{\cf4  \cf2 \cb3 return\cf4 \cb3  \cf2 \cb3 null\cf6 \cb3 ;\cf4  \cf6 \}\cf4 \cb1 \
\cf6 \cb3 \};\cf4 \cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 const\cf4 \cb3  firebaseConfig \cf6 =\cf4  getFirebaseConfig\cf6 ();\cf4 \cb1 \
\cf2 \cb3 const\cf4 \cb3  app \cf6 =\cf4  initializeApp\cf6 (\cf4 firebaseConfig\cf6 );\cf4 \cb1 \
\cf2 \cb3 const\cf4 \cb3  auth \cf6 =\cf4  getAuth\cf6 (\cf4 app\cf6 );\cf4 \cb1 \
\cf2 \cb3 const\cf4 \cb3  db \cf6 =\cf4  getFirestore\cf6 (\cf4 app\cf6 );\cf4 \cb1 \
\
\cf8 \cb3 // RULE 1: Sanitize appId to prevent path segment count errors in Firestore\cf4 \cb1 \
\cf2 \cb3 const\cf4 \cb3  rawAppId \cf6 =\cf4  \cf2 \cb3 typeof\cf4 \cb3  __app_id \cf6 !==\cf4  \cf7 \cb3 'undefined'\cf4 \cb3  \cf6 ?\cf4  __app_id \cf6 :\cf4  \cf7 \cb3 'tipid-menu-default'\cf6 \cb3 ;\cf4 \cb1 \
\cf2 \cb3 const\cf4 \cb3  appId \cf6 =\cf4  rawAppId\cf6 .\cf4 replace\cf6 (\cf9 \cb3 /\\//\cf2 g\cf6 \cb3 ,\cf4  \cf7 \cb3 '_'\cf6 \cb3 );\cf4 \cb1 \
\
\cf8 \cb3 // --- Mock Data ---\cf4 \cb1 \
\cf2 \cb3 const\cf4 \cb3  \cf5 \cb3 MOCK_RESTAURANTS\cf4 \cb3  \cf6 =\cf4  \cf6 [\cf4 \cb1 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3   \cf6 \{\cf4  id\cf6 :\cf4  \cf7 \cb3 '1'\cf6 \cb3 ,\cf4  name\cf6 :\cf4  \cf7 \cb3 'Jollibee'\cf6 \cb3 ,\cf4  category\cf6 :\cf4  \cf7 \cb3 'Fast Food'\cf6 \cb3 ,\cf4  rating\cf6 :\cf4  \cf10 \cb3 4.8\cf6 \cb3 ,\cf4  address\cf6 :\cf4  \cf7 \cb3 'BGC, Taguig'\cf6 \cb3 ,\cf4  lat\cf6 :\cf4  \cf10 \cb3 14.5547\cf6 \cb3 ,\cf4  lng\cf6 :\cf4  \cf10 \cb3 121.0244\cf6 \cb3 ,\cf4  top\cf6 :\cf4  \cf7 \cb3 '40%'\cf6 \cb3 ,\cf4  left\cf6 :\cf4  \cf7 \cb3 '50%'\cf6 \cb3 ,\cf4  img\cf6 :\cf4  \cf7 \cb3 '
\f1 \uc0\u55357 \u56349 
\f0 '\cf6 \cb3 ,\cf4  verified\cf6 :\cf4  \cf2 \cb3 true\cf4 \cb3  \cf6 \},\cf4 \cb1 \
\cb3   \cf6 \{\cf4  id\cf6 :\cf4  \cf7 \cb3 '2'\cf6 \cb3 ,\cf4  name\cf6 :\cf4  \cf7 \cb3 "McDonald's"\cf6 \cb3 ,\cf4  category\cf6 :\cf4  \cf7 \cb3 'Fast Food'\cf6 \cb3 ,\cf4  rating\cf6 :\cf4  \cf10 \cb3 4.5\cf6 \cb3 ,\cf4  address\cf6 :\cf4  \cf7 \cb3 'Makati Ave'\cf6 \cb3 ,\cf4  lat\cf6 :\cf4  \cf10 \cb3 14.56\cf6 \cb3 ,\cf4  lng\cf6 :\cf4  \cf10 \cb3 121.03\cf6 \cb3 ,\cf4  top\cf6 :\cf4  \cf7 \cb3 '60%'\cf6 \cb3 ,\cf4  left\cf6 :\cf4  \cf7 \cb3 '30%'\cf6 \cb3 ,\cf4  img\cf6 :\cf4  \cf7 \cb3 '
\f1 \uc0\u55356 \u57172 
\f0 '\cf6 \cb3 ,\cf4  verified\cf6 :\cf4  \cf2 \cb3 true\cf4 \cb3  \cf6 \},\cf4 \cb1 \
\cb3   \cf6 \{\cf4  id\cf6 :\cf4  \cf7 \cb3 '3'\cf6 \cb3 ,\cf4  name\cf6 :\cf4  \cf7 \cb3 'Mang Inasal'\cf6 \cb3 ,\cf4  category\cf6 :\cf4  \cf7 \cb3 'Fast Food'\cf6 \cb3 ,\cf4  rating\cf6 :\cf4  \cf10 \cb3 4.7\cf6 \cb3 ,\cf4  address\cf6 :\cf4  \cf7 \cb3 'Quezon City'\cf6 \cb3 ,\cf4  lat\cf6 :\cf4  \cf10 \cb3 14.65\cf6 \cb3 ,\cf4  lng\cf6 :\cf4  \cf10 \cb3 121.03\cf6 \cb3 ,\cf4  top\cf6 :\cf4  \cf7 \cb3 '20%'\cf6 \cb3 ,\cf4  left\cf6 :\cf4  \cf7 \cb3 '70%'\cf6 \cb3 ,\cf4  img\cf6 :\cf4  \cf7 \cb3 '
\f1 \uc0\u55356 \u57175 
\f0 '\cf6 \cb3 ,\cf4  verified\cf6 :\cf4  \cf2 \cb3 true\cf4 \cb3  \cf6 \},\cf4 \cb1 \
\cb3   \cf6 \{\cf4  id\cf6 :\cf4  \cf7 \cb3 '4'\cf6 \cb3 ,\cf4  name\cf6 :\cf4  \cf7 \cb3 'Greenwich'\cf6 \cb3 ,\cf4  category\cf6 :\cf4  \cf7 \cb3 'Pizza'\cf6 \cb3 ,\cf4  rating\cf6 :\cf4  \cf10 \cb3 4.3\cf6 \cb3 ,\cf4  address\cf6 :\cf4  \cf7 \cb3 'Ortigas Center'\cf6 \cb3 ,\cf4  lat\cf6 :\cf4  \cf10 \cb3 14.58\cf6 \cb3 ,\cf4  lng\cf6 :\cf4  \cf10 \cb3 121.06\cf6 \cb3 ,\cf4  top\cf6 :\cf4  \cf7 \cb3 '45%'\cf6 \cb3 ,\cf4  left\cf6 :\cf4  \cf7 \cb3 '80%'\cf6 \cb3 ,\cf4  img\cf6 :\cf4  \cf7 \cb3 '
\f1 \uc0\u55356 \u57173 
\f0 '\cf6 \cb3 ,\cf4  verified\cf6 :\cf4  \cf2 \cb3 true\cf4 \cb3  \cf6 \},\cf4 \cb1 \
\cb3   \cf6 \{\cf4  id\cf6 :\cf4  \cf7 \cb3 '5'\cf6 \cb3 ,\cf4  name\cf6 :\cf4  \cf7 \cb3 'Starbucks'\cf6 \cb3 ,\cf4  category\cf6 :\cf4  \cf7 \cb3 'Coffee'\cf6 \cb3 ,\cf4  rating\cf6 :\cf4  \cf10 \cb3 4.6\cf6 \cb3 ,\cf4  address\cf6 :\cf4  \cf7 \cb3 'Eastwood'\cf6 \cb3 ,\cf4  lat\cf6 :\cf4  \cf10 \cb3 14.60\cf6 \cb3 ,\cf4  lng\cf6 :\cf4  \cf10 \cb3 121.08\cf6 \cb3 ,\cf4  top\cf6 :\cf4  \cf7 \cb3 '75%'\cf6 \cb3 ,\cf4  left\cf6 :\cf4  \cf7 \cb3 '60%'\cf6 \cb3 ,\cf4  img\cf6 :\cf4  \cf7 \cb3 '\uc0\u9749 '\cf6 \cb3 ,\cf4  verified\cf6 :\cf4  \cf2 \cb3 false\cf4 \cb3  \cf6 \}\cf4 \cb1 \
\cf6 \cb3 ];\cf4 \cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 const\cf4 \cb3  \cf5 \cb3 MOCK_PROMOS\cf4 \cb3  \cf6 =\cf4  \cf6 [\cf4 \cb1 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3   \cf6 \{\cf4  id\cf6 :\cf4  \cf7 \cb3 'p1'\cf6 \cb3 ,\cf4  resId\cf6 :\cf4  \cf7 \cb3 '1'\cf6 \cb3 ,\cf4  title\cf6 :\cf4  \cf7 \cb3 'Payday Deal: 50% OFF Buckets'\cf6 \cb3 ,\cf4  source\cf6 :\cf4  \cf7 \cb3 'Official FB'\cf6 \cb3 ,\cf4  verified\cf6 :\cf4  \cf2 \cb3 true\cf4 \cb3  \cf6 \},\cf4 \cb1 \
\cb3   \cf6 \{\cf4  id\cf6 :\cf4  \cf7 \cb3 'p2'\cf6 \cb3 ,\cf4  resId\cf6 :\cf4  \cf7 \cb3 '2'\cf6 \cb3 ,\cf4  title\cf6 :\cf4  \cf7 \cb3 'Free Fries Friday (App Only)'\cf6 \cb3 ,\cf4  source\cf6 :\cf4  \cf7 \cb3 'McDo App'\cf6 \cb3 ,\cf4  verified\cf6 :\cf4  \cf2 \cb3 true\cf4 \cb3  \cf6 \},\cf4 \cb1 \
\cf6 \cb3 ];\cf4 \cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 const\cf4 \cb3  \cf5 \cb3 MOCK_HACKS\cf4 \cb3  \cf6 =\cf4  \cf6 [\cf4 \cb1 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3   \cf6 \{\cf4  id\cf6 :\cf4  \cf7 \cb3 'h1'\cf6 \cb3 ,\cf4  resId\cf6 :\cf4  \cf7 \cb3 '1'\cf6 \cb3 ,\cf4  title\cf6 :\cf4  \cf7 \cb3 'Chickenjoy Unli-Gravy Trick'\cf6 \cb3 ,\cf4  desc\cf6 :\cf4  \cf7 \cb3 'Ask for a "Solo" gravy cup, then request a refill right after they pour it. They give double!'\cf6 \cb3 ,\cf4  savings\cf6 :\cf4  \cf10 \cb3 15\cf6 \cb3 ,\cf4  votes\cf6 :\cf4  \cf10 \cb3 342\cf6 \cb3 ,\cf4  user\cf6 :\cf4  \cf7 \cb3 'PinoyEater'\cf6 \cb3 ,\cf4  avatar\cf6 :\cf4  \cf7 \cb3 '
\f1 \uc0\u55356 \u57175 
\f0 '\cf4 \cb3  \cf6 \},\cf4 \cb1 \
\cb3   \cf6 \{\cf4  id\cf6 :\cf4  \cf7 \cb3 'h2'\cf6 \cb3 ,\cf4  resId\cf6 :\cf4  \cf7 \cb3 '1'\cf6 \cb3 ,\cf4  title\cf6 :\cf4  \cf7 \cb3 'Ala Carte + Rice Combo'\cf6 \cb3 ,\cf4  desc\cf6 :\cf4  \cf7 \cb3 'Buying Ala Carte Chicken + Extra Rice is \uc0\u8369 5 cheaper than the meal if you have your own water.'\cf6 \cb3 ,\cf4  savings\cf6 :\cf4  \cf10 \cb3 5\cf6 \cb3 ,\cf4  votes\cf6 :\cf4  \cf10 \cb3 89\cf6 \cb3 ,\cf4  user\cf6 :\cf4  \cf7 \cb3 'HackMaster'\cf6 \cb3 ,\cf4  avatar\cf6 :\cf4  \cf7 \cb3 '
\f1 \uc0\u55358 \u56800 
\f0 '\cf4 \cb3  \cf6 \},\cf4 \cb1 \
\cb3   \cf6 \{\cf4  id\cf6 :\cf4  \cf7 \cb3 'h3'\cf6 \cb3 ,\cf4  resId\cf6 :\cf4  \cf7 \cb3 '2'\cf6 \cb3 ,\cf4  title\cf6 :\cf4  \cf7 \cb3 'Fresh Fries Hack'\cf6 \cb3 ,\cf4  desc\cf6 :\cf4  \cf7 \cb3 'Order fries with "No Salt". They have to cook a fresh batch. Ask for salt packets on the side.'\cf6 \cb3 ,\cf4  savings\cf6 :\cf4  \cf10 \cb3 0\cf6 \cb3 ,\cf4  votes\cf6 :\cf4  \cf10 \cb3 512\cf6 \cb3 ,\cf4  user\cf6 :\cf4  \cf7 \cb3 'FryGuy'\cf6 \cb3 ,\cf4  avatar\cf6 :\cf4  \cf7 \cb3 '
\f1 \uc0\u55356 \u57183 
\f0 '\cf4 \cb3  \cf6 \},\cf4 \cb1 \
\cf6 \cb3 ];\cf4 \cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 const\cf4 \cb3  \cf5 \cb3 TIERS\cf4 \cb3  \cf6 =\cf4  \cf6 [\cf4 \cb1 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3   \cf6 \{\cf4  name\cf6 :\cf4  \cf7 \cb3 'Tipid Legend'\cf6 \cb3 ,\cf4  icon\cf6 :\cf4  \cf7 \cb3 '
\f1 \uc0\u55357 \u56462 
\f0 '\cf6 \cb3 ,\cf4  minPoints\cf6 :\cf4  \cf10 \cb3 2500\cf6 \cb3 ,\cf4  color\cf6 :\cf4  \cf7 \cb3 'text-purple-600'\cf6 \cb3 ,\cf4  bg\cf6 :\cf4  \cf7 \cb3 'bg-purple-100'\cf6 \cb3 ,\cf4  border\cf6 :\cf4  \cf7 \cb3 'border-purple-200'\cf4 \cb3  \cf6 \},\cf4 \cb1 \
\cb3   \cf6 \{\cf4  name\cf6 :\cf4  \cf7 \cb3 'Hack Master'\cf6 \cb3 ,\cf4  icon\cf6 :\cf4  \cf7 \cb3 '
\f1 \uc0\u55358 \u56647 
\f0 '\cf6 \cb3 ,\cf4  minPoints\cf6 :\cf4  \cf10 \cb3 1000\cf6 \cb3 ,\cf4  color\cf6 :\cf4  \cf7 \cb3 'text-yellow-600'\cf6 \cb3 ,\cf4  bg\cf6 :\cf4  \cf7 \cb3 'bg-yellow-100'\cf6 \cb3 ,\cf4  border\cf6 :\cf4  \cf7 \cb3 'border-yellow-200'\cf4 \cb3  \cf6 \},\cf4 \cb1 \
\cb3   \cf6 \{\cf4  name\cf6 :\cf4  \cf7 \cb3 'Deal Hunter'\cf6 \cb3 ,\cf4  icon\cf6 :\cf4  \cf7 \cb3 '
\f1 \uc0\u55358 \u56648 
\f0 '\cf6 \cb3 ,\cf4  minPoints\cf6 :\cf4  \cf10 \cb3 500\cf6 \cb3 ,\cf4  color\cf6 :\cf4  \cf7 \cb3 'text-slate-600'\cf6 \cb3 ,\cf4  bg\cf6 :\cf4  \cf7 \cb3 'bg-slate-200'\cf6 \cb3 ,\cf4  border\cf6 :\cf4  \cf7 \cb3 'border-slate-300'\cf4 \cb3  \cf6 \},\cf4 \cb1 \
\cb3   \cf6 \{\cf4  name\cf6 :\cf4  \cf7 \cb3 'Smart Spender'\cf6 \cb3 ,\cf4  icon\cf6 :\cf4  \cf7 \cb3 '
\f1 \uc0\u55358 \u56649 
\f0 '\cf6 \cb3 ,\cf4  minPoints\cf6 :\cf4  \cf10 \cb3 200\cf6 \cb3 ,\cf4  color\cf6 :\cf4  \cf7 \cb3 'text-amber-700'\cf6 \cb3 ,\cf4  bg\cf6 :\cf4  \cf7 \cb3 'bg-amber-100'\cf6 \cb3 ,\cf4  border\cf6 :\cf4  \cf7 \cb3 'border-amber-200'\cf4 \cb3  \cf6 \},\cf4 \cb1 \
\cb3   \cf6 \{\cf4  name\cf6 :\cf4  \cf7 \cb3 'Newbie Saver'\cf6 \cb3 ,\cf4  icon\cf6 :\cf4  \cf7 \cb3 '
\f1 \uc0\u55358 \u56666 
\f0 '\cf6 \cb3 ,\cf4  minPoints\cf6 :\cf4  \cf10 \cb3 0\cf6 \cb3 ,\cf4  color\cf6 :\cf4  \cf7 \cb3 'text-green-600'\cf6 \cb3 ,\cf4  bg\cf6 :\cf4  \cf7 \cb3 'bg-green-100'\cf6 \cb3 ,\cf4  border\cf6 :\cf4  \cf7 \cb3 'border-green-200'\cf4 \cb3  \cf6 \}\cf4 \cb1 \
\cf6 \cb3 ];\cf4 \cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 export\cf4 \cb3  \cf2 \cb3 default\cf4 \cb3  \cf2 \cb3 function\cf4 \cb3  \cf5 \cb3 App\cf6 \cb3 ()\cf4  \cf6 \{\cf4 \cb1 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3   \cf2 \cb3 const\cf4 \cb3  \cf6 [\cf4 user\cf6 ,\cf4  setUser\cf6 ]\cf4  \cf6 =\cf4  useState\cf6 (\cf2 \cb3 null\cf6 \cb3 );\cf4 \cb1 \
\cb3   \cf2 \cb3 const\cf4 \cb3  \cf6 [\cf4 userData\cf6 ,\cf4  setUserData\cf6 ]\cf4  \cf6 =\cf4  useState\cf6 (\{\cf4  \cb1 \
\cb3     points\cf6 :\cf4  \cf10 \cb3 50\cf6 \cb3 ,\cf4  isPro\cf6 :\cf4  \cf2 \cb3 false\cf6 \cb3 ,\cf4  isVerified\cf6 :\cf4  \cf2 \cb3 false\cf6 \cb3 ,\cf4  username\cf6 :\cf4  \cf7 \cb3 'Foodie'\cf6 \cb3 ,\cf4  avatar\cf6 :\cf4  \cf7 \cb3 '
\f1 \uc0\u55357 \u56420 
\f0 '\cf6 \cb3 ,\cf4  favorites\cf6 :\cf4  \cf6 [],\cf4  following\cf6 :\cf4  \cf6 []\cf4 \cb1 \
\cb3   \cf6 \});\cf4 \cb1 \
\cb3   \cf2 \cb3 const\cf4 \cb3  \cf6 [\cf4 restaurants\cf6 ,\cf4  setRestaurants\cf6 ]\cf4  \cf6 =\cf4  useState\cf6 (\cf5 \cb3 MOCK_RESTAURANTS\cf6 \cb3 );\cf4 \cb1 \
\cb3   \cf2 \cb3 const\cf4 \cb3  \cf6 [\cf4 hacks\cf6 ,\cf4  setHacks\cf6 ]\cf4  \cf6 =\cf4  useState\cf6 (\cf5 \cb3 MOCK_HACKS\cf6 \cb3 );\cf4 \cb1 \
\cb3   \cf2 \cb3 const\cf4 \cb3  \cf6 [\cf4 promos\cf6 ,\cf4  setPromos\cf6 ]\cf4  \cf6 =\cf4  useState\cf6 (\cf5 \cb3 MOCK_PROMOS\cf6 \cb3 );\cf4 \cb1 \
\cb3   \cb1 \
\cb3   \cf2 \cb3 const\cf4 \cb3  \cf6 [\cf4 currentTab\cf6 ,\cf4  setCurrentTab\cf6 ]\cf4  \cf6 =\cf4  useState\cf6 (\cf7 \cb3 'map'\cf6 \cb3 );\cf4 \cb1 \
\cb3   \cf2 \cb3 const\cf4 \cb3  \cf6 [\cf4 activeView\cf6 ,\cf4  setActiveView\cf6 ]\cf4  \cf6 =\cf4  useState\cf6 (\cf7 \cb3 'main'\cf6 \cb3 );\cf4 \cb1 \
\cb3   \cf2 \cb3 const\cf4 \cb3  \cf6 [\cf4 selectedRes\cf6 ,\cf4  setSelectedRes\cf6 ]\cf4  \cf6 =\cf4  useState\cf6 (\cf2 \cb3 null\cf6 \cb3 );\cf4 \cb1 \
\cb3   \cf2 \cb3 const\cf4 \cb3  \cf6 [\cf4 showVerifyModal\cf6 ,\cf4  setShowVerifyModal\cf6 ]\cf4  \cf6 =\cf4  useState\cf6 (\cf2 \cb3 false\cf6 \cb3 );\cf4 \cb1 \
\cb3   \cf2 \cb3 const\cf4 \cb3  \cf6 [\cf4 showAddHackModal\cf6 ,\cf4  setShowAddHackModal\cf6 ]\cf4  \cf6 =\cf4  useState\cf6 (\cf2 \cb3 false\cf6 \cb3 );\cf4 \cb1 \
\cb3   \cf2 \cb3 const\cf4 \cb3  \cf6 [\cf4 showEditProfileModal\cf6 ,\cf4  setShowEditProfileModal\cf6 ]\cf4  \cf6 =\cf4  useState\cf6 (\cf2 \cb3 false\cf6 \cb3 );\cf4 \cb1 \
\cb3   \cf2 \cb3 const\cf4 \cb3  \cf6 [\cf4 otpInput\cf6 ,\cf4  setOtpInput\cf6 ]\cf4  \cf6 =\cf4  useState\cf6 (\cf7 \cb3 ''\cf6 \cb3 );\cf4 \cb1 \
\cb3   \cf2 \cb3 const\cf4 \cb3  \cf6 [\cf4 searchQuery\cf6 ,\cf4  setSearchQuery\cf6 ]\cf4  \cf6 =\cf4  useState\cf6 (\cf7 \cb3 ''\cf6 \cb3 );\cf4 \cb1 \
\cb3   \cf2 \cb3 const\cf4 \cb3  \cf6 [\cf4 editForm\cf6 ,\cf4  setEditForm\cf6 ]\cf4  \cf6 =\cf4  useState\cf6 (\{\cf4  username\cf6 :\cf4  \cf7 \cb3 ''\cf6 \cb3 ,\cf4  avatar\cf6 :\cf4  \cf7 \cb3 ''\cf4 \cb3  \cf6 \});\cf4 \cb1 \
\cb3   \cf2 \cb3 const\cf4 \cb3  \cf6 [\cf4 toast\cf6 ,\cf4  setToast\cf6 ]\cf4  \cf6 =\cf4  useState\cf6 (\cf7 \cb3 ''\cf6 \cb3 );\cf4 \cb1 \
\
\cb3   \cf8 \cb3 // RULE 3: Auth Before Queries\cf4 \cb1 \
\cb3   useEffect\cf6 (()\cf4  \cf6 =>\cf4  \cf6 \{\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  initAuth \cf6 =\cf4  \cf2 \cb3 async\cf4 \cb3  \cf6 ()\cf4  \cf6 =>\cf4  \cf6 \{\cf4 \cb1 \
\cb3       \cf2 \cb3 try\cf4 \cb3  \cf6 \{\cf4 \cb1 \
\cb3         \cf2 \cb3 if\cf4 \cb3  \cf6 (\cf2 \cb3 typeof\cf4 \cb3  __initial_auth_token \cf6 !==\cf4  \cf7 \cb3 'undefined'\cf4 \cb3  \cf6 &&\cf4  __initial_auth_token\cf6 )\cf4  \cf6 \{\cf4 \cb1 \
\cb3           \cf2 \cb3 await\cf4 \cb3  signInWithCustomToken\cf6 (\cf4 auth\cf6 ,\cf4  __initial_auth_token\cf6 );\cf4 \cb1 \
\cb3         \cf6 \}\cf4  \cf2 \cb3 else\cf4 \cb3  \cf6 \{\cf4 \cb1 \
\cb3           \cf2 \cb3 await\cf4 \cb3  signInAnonymously\cf6 (\cf4 auth\cf6 );\cf4 \cb1 \
\cb3         \cf6 \}\cf4 \cb1 \
\cb3       \cf6 \}\cf4  \cf2 \cb3 catch\cf4 \cb3  \cf6 (\cf4 err\cf6 )\cf4  \cf6 \{\cf4 \cb1 \
\cb3         console\cf6 .\cf4 error\cf6 (\cf7 \cb3 "Authentication failed"\cf6 \cb3 ,\cf4  err\cf6 );\cf4 \cb1 \
\cb3       \cf6 \}\cf4 \cb1 \
\cb3     \cf6 \};\cf4 \cb1 \
\cb3     initAuth\cf6 ();\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  unsubscribe \cf6 =\cf4  onAuthStateChanged\cf6 (\cf4 auth\cf6 ,\cf4  setUser\cf6 );\cf4 \cb1 \
\cb3     \cf2 \cb3 return\cf4 \cb3  \cf6 ()\cf4  \cf6 =>\cf4  unsubscribe\cf6 ();\cf4 \cb1 \
\cb3   \cf6 \},\cf4  \cf6 []);\cf4 \cb1 \
\
\cb3   \cf8 \cb3 // RULE 3 & Critical Req: Sync data with error callbacks and auth checks\cf4 \cb1 \
\cb3   useEffect\cf6 (()\cf4  \cf6 =>\cf4  \cf6 \{\cf4 \cb1 \
\cb3     \cf2 \cb3 if\cf4 \cb3  \cf6 (!\cf4 user \cf6 ||\cf4  \cf6 !\cf4 db\cf6 )\cf4  \cf2 \cb3 return\cf6 \cb3 ;\cf4 \cb1 \
\
\cb3     \cf8 \cb3 // RULE 1: Sync Profile Path\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  userRef \cf6 =\cf4  doc\cf6 (\cf4 db\cf6 ,\cf4  \cf7 \cb3 'artifacts'\cf6 \cb3 ,\cf4  appId\cf6 ,\cf4  \cf7 \cb3 'users'\cf6 \cb3 ,\cf4  user\cf6 .\cf4 uid\cf6 ,\cf4  \cf7 \cb3 'profile'\cf6 \cb3 ,\cf4  \cf7 \cb3 'data'\cf6 \cb3 );\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  unsubUser \cf6 =\cf4  onSnapshot\cf6 (\cf4 userRef\cf6 ,\cf4  \cf6 (\cf4 snap\cf6 )\cf4  \cf6 =>\cf4  \cf6 \{\cf4 \cb1 \
\cb3       \cf2 \cb3 if\cf4 \cb3  \cf6 (\cf4 snap\cf6 .\cf4 exists\cf6 ())\cf4  \cf6 \{\cf4 \cb1 \
\cb3         \cf2 \cb3 const\cf4 \cb3  data \cf6 =\cf4  snap\cf6 .\cf4 data\cf6 ();\cf4 \cb1 \
\cb3         \cf8 \cb3 // Prevent object-as-child errors by ensuring data types are clean\cf4 \cb1 \
\cb3         setUserData\cf6 (\cf4 prev \cf6 =>\cf4  \cf6 (\{\cf4  \cb1 \
\cb3           \cf6 ...\cf4 prev\cf6 ,\cf4  \cb1 \
\cb3           \cf6 ...\cf4 data\cf6 ,\cf4 \cb1 \
\cb3           favorites\cf6 :\cf4  \cf5 \cb3 Array\cf6 \cb3 .\cf4 isArray\cf6 (\cf4 data\cf6 .\cf4 favorites\cf6 )\cf4  \cf6 ?\cf4  data\cf6 .\cf4 favorites \cf6 :\cf4  \cf6 [],\cf4 \cb1 \
\cb3           following\cf6 :\cf4  \cf5 \cb3 Array\cf6 \cb3 .\cf4 isArray\cf6 (\cf4 data\cf6 .\cf4 following\cf6 )\cf4  \cf6 ?\cf4  data\cf6 .\cf4 following \cf6 :\cf4  \cf6 []\cf4 \cb1 \
\cb3         \cf6 \}));\cf4 \cb1 \
\cb3       \cf6 \}\cf4  \cf2 \cb3 else\cf4 \cb3  \cf6 \{\cf4 \cb1 \
\cb3         setDoc\cf6 (\cf4 userRef\cf6 ,\cf4  \cf6 \{\cf4  points\cf6 :\cf4  \cf10 \cb3 50\cf6 \cb3 ,\cf4  isPro\cf6 :\cf4  \cf2 \cb3 false\cf6 \cb3 ,\cf4  isVerified\cf6 :\cf4  \cf2 \cb3 false\cf6 \cb3 ,\cf4  username\cf6 :\cf4  \cf7 \cb3 'Foodie'\cf6 \cb3 ,\cf4  avatar\cf6 :\cf4  \cf7 \cb3 '
\f1 \uc0\u55357 \u56420 
\f0 '\cf6 \cb3 ,\cf4  favorites\cf6 :\cf4  \cf6 [],\cf4  following\cf6 :\cf4  \cf6 []\cf4  \cf6 \});\cf4 \cb1 \
\cb3       \cf6 \}\cf4 \cb1 \
\cb3     \cf6 \},\cf4  \cf6 (\cf4 err\cf6 )\cf4  \cf6 =>\cf4  console\cf6 .\cf4 error\cf6 (\cf7 \cb3 "Profile sync error:"\cf6 \cb3 ,\cf4  err\cf6 ));\cf4 \cb1 \
\
\cb3     \cf8 \cb3 // RULE 1: Sync Public Hacks Path\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  hacksRef \cf6 =\cf4  collection\cf6 (\cf4 db\cf6 ,\cf4  \cf7 \cb3 'artifacts'\cf6 \cb3 ,\cf4  appId\cf6 ,\cf4  \cf7 \cb3 'public'\cf6 \cb3 ,\cf4  \cf7 \cb3 'data'\cf6 \cb3 ,\cf4  \cf7 \cb3 'hacks'\cf6 \cb3 );\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  unsubHacks \cf6 =\cf4  onSnapshot\cf6 (\cf4 hacksRef\cf6 ,\cf4  \cf6 (\cf4 snap\cf6 )\cf4  \cf6 =>\cf4  \cf6 \{\cf4 \cb1 \
\cb3       \cf2 \cb3 if\cf4 \cb3  \cf6 (!\cf4 snap\cf6 .\cf4 empty\cf6 )\cf4  \cf6 \{\cf4 \cb1 \
\cb3         setHacks\cf6 (\cf4 snap\cf6 .\cf4 docs\cf6 .\cf4 map\cf6 (\cf4 d \cf6 =>\cf4  \cf6 (\{\cf4  \cf6 ...\cf4 d\cf6 .\cf4 data\cf6 (),\cf4  id\cf6 :\cf4  d\cf6 .\cf4 id \cf6 \})));\cf4 \cb1 \
\cb3       \cf6 \}\cf4 \cb1 \
\cb3     \cf6 \},\cf4  \cf6 (\cf4 err\cf6 )\cf4  \cf6 =>\cf4  console\cf6 .\cf4 error\cf6 (\cf7 \cb3 "Hacks sync error:"\cf6 \cb3 ,\cf4  err\cf6 ));\cf4 \cb1 \
\
\cb3     \cf2 \cb3 return\cf4 \cb3  \cf6 ()\cf4  \cf6 =>\cf4  \cf6 \{\cf4  \cb1 \
\cb3       unsubUser\cf6 ();\cf4  \cb1 \
\cb3       unsubHacks\cf6 ();\cf4  \cb1 \
\cb3     \cf6 \};\cf4 \cb1 \
\cb3   \cf6 \},\cf4  \cf6 [\cf4 user\cf6 ]);\cf4 \cb1 \
\
\cb3   \cf2 \cb3 const\cf4 \cb3  userTier \cf6 =\cf4  \cf5 \cb3 TIERS\cf6 \cb3 .\cf4 find\cf6 (\cf4 t \cf6 =>\cf4  userData\cf6 .\cf4 points \cf6 >=\cf4  t\cf6 .\cf4 minPoints\cf6 )\cf4  \cf6 ||\cf4  \cf5 \cb3 TIERS\cf6 \cb3 [\cf5 \cb3 TIERS\cf6 \cb3 .\cf4 length \cf6 -\cf4  \cf10 \cb3 1\cf6 \cb3 ];\cf4 \cb1 \
\cb3   \cf2 \cb3 const\cf4 \cb3  showToastMessage \cf6 =\cf4  \cf6 (\cf4 msg\cf6 )\cf4  \cf6 =>\cf4  \cf6 \{\cf4  \cb1 \
\cb3     \cf2 \cb3 if\cf4 \cb3  \cf6 (\cf2 \cb3 typeof\cf4 \cb3  msg \cf6 !==\cf4  \cf7 \cb3 'string'\cf6 \cb3 )\cf4  \cf2 \cb3 return\cf6 \cb3 ;\cf4 \cb1 \
\cb3     setToast\cf6 (\cf4 msg\cf6 );\cf4  \cb1 \
\cb3     setTimeout\cf6 (()\cf4  \cf6 =>\cf4  setToast\cf6 (\cf7 \cb3 ''\cf6 \cb3 ),\cf4  \cf10 \cb3 3000\cf6 \cb3 );\cf4  \cb1 \
\cb3   \cf6 \};\cf4 \cb1 \
\cb3   \cb1 \
\cb3   \cf2 \cb3 const\cf4 \cb3  handleVerifyOTP \cf6 =\cf4  \cf2 \cb3 async\cf4 \cb3  \cf6 (\cf4 e\cf6 )\cf4  \cf6 =>\cf4  \cf6 \{\cf4 \cb1 \
\cb3     e\cf6 .\cf4 preventDefault\cf6 ();\cf4 \cb1 \
\cb3     \cf2 \cb3 if\cf4 \cb3  \cf6 (!\cf4 user\cf6 )\cf4  \cf2 \cb3 return\cf6 \cb3 ;\cf4 \cb1 \
\cb3     \cf2 \cb3 if\cf4 \cb3  \cf6 (\cf4 otpInput \cf6 ===\cf4  \cf7 \cb3 '1234'\cf6 \cb3 )\cf4  \cf6 \{\cf4 \cb1 \
\cb3       \cf2 \cb3 const\cf4 \cb3  updates \cf6 =\cf4  \cf6 \{\cf4  isVerified\cf6 :\cf4  \cf2 \cb3 true\cf6 \cb3 ,\cf4  points\cf6 :\cf4  userData\cf6 .\cf4 points \cf6 +\cf4  \cf10 \cb3 100\cf4 \cb3  \cf6 \};\cf4 \cb1 \
\cb3       setUserData\cf6 (\cf4 prev \cf6 =>\cf4  \cf6 (\{\cf4  \cf6 ...\cf4 prev\cf6 ,\cf4  \cf6 ...\cf4 updates \cf6 \}));\cf4 \cb1 \
\cb3       \cf2 \cb3 const\cf4 \cb3  userRef \cf6 =\cf4  doc\cf6 (\cf4 db\cf6 ,\cf4  \cf7 \cb3 'artifacts'\cf6 \cb3 ,\cf4  appId\cf6 ,\cf4  \cf7 \cb3 'users'\cf6 \cb3 ,\cf4  user\cf6 .\cf4 uid\cf6 ,\cf4  \cf7 \cb3 'profile'\cf6 \cb3 ,\cf4  \cf7 \cb3 'data'\cf6 \cb3 );\cf4 \cb1 \
\cb3       \cf2 \cb3 await\cf4 \cb3  setDoc\cf6 (\cf4 userRef\cf6 ,\cf4  updates\cf6 ,\cf4  \cf6 \{\cf4  merge\cf6 :\cf4  \cf2 \cb3 true\cf4 \cb3  \cf6 \});\cf4 \cb1 \
\cb3       setShowVerifyModal\cf6 (\cf2 \cb3 false\cf6 \cb3 );\cf4 \cb1 \
\cb3       showToastMessage\cf6 (\cf7 \cb3 "Successfully verified! +100 Points"\cf6 \cb3 );\cf4 \cb1 \
\cb3     \cf6 \}\cf4  \cf2 \cb3 else\cf4 \cb3  \cf6 \{\cf4 \cb1 \
\cb3       showToastMessage\cf6 (\cf7 \cb3 "Invalid OTP. Hint: Use 1234"\cf6 \cb3 );\cf4 \cb1 \
\cb3     \cf6 \}\cf4 \cb1 \
\cb3   \cf6 \};\cf4 \cb1 \
\
\cb3   \cf2 \cb3 const\cf4 \cb3  handleUpdateProfile \cf6 =\cf4  \cf2 \cb3 async\cf4 \cb3  \cf6 (\cf4 e\cf6 )\cf4  \cf6 =>\cf4  \cf6 \{\cf4 \cb1 \
\cb3     e\cf6 .\cf4 preventDefault\cf6 ();\cf4 \cb1 \
\cb3     \cf2 \cb3 if\cf4 \cb3  \cf6 (!\cf4 user\cf6 )\cf4  \cf2 \cb3 return\cf6 \cb3 ;\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  updates \cf6 =\cf4  \cf6 \{\cf4  username\cf6 :\cf4  editForm\cf6 .\cf4 username\cf6 ,\cf4  avatar\cf6 :\cf4  editForm\cf6 .\cf4 avatar \cf6 \};\cf4 \cb1 \
\cb3     setUserData\cf6 (\cf4 prev \cf6 =>\cf4  \cf6 (\{\cf4  \cf6 ...\cf4 prev\cf6 ,\cf4  \cf6 ...\cf4 updates \cf6 \}));\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  userRef \cf6 =\cf4  doc\cf6 (\cf4 db\cf6 ,\cf4  \cf7 \cb3 'artifacts'\cf6 \cb3 ,\cf4  appId\cf6 ,\cf4  \cf7 \cb3 'users'\cf6 \cb3 ,\cf4  user\cf6 .\cf4 uid\cf6 ,\cf4  \cf7 \cb3 'profile'\cf6 \cb3 ,\cf4  \cf7 \cb3 'data'\cf6 \cb3 );\cf4 \cb1 \
\cb3     \cf2 \cb3 await\cf4 \cb3  setDoc\cf6 (\cf4 userRef\cf6 ,\cf4  updates\cf6 ,\cf4  \cf6 \{\cf4  merge\cf6 :\cf4  \cf2 \cb3 true\cf4 \cb3  \cf6 \});\cf4 \cb1 \
\cb3     setShowEditProfileModal\cf6 (\cf2 \cb3 false\cf6 \cb3 );\cf4 \cb1 \
\cb3     showToastMessage\cf6 (\cf7 \cb3 "Profile updated successfully!"\cf6 \cb3 );\cf4 \cb1 \
\cb3   \cf6 \};\cf4 \cb1 \
\
\cb3   \cf2 \cb3 const\cf4 \cb3  handleUpgradePro \cf6 =\cf4  \cf2 \cb3 async\cf4 \cb3  \cf6 (\cf4 method\cf6 )\cf4  \cf6 =>\cf4  \cf6 \{\cf4 \cb1 \
\cb3     \cf2 \cb3 if\cf4 \cb3  \cf6 (!\cf4 user\cf6 )\cf4  \cf2 \cb3 return\cf6 \cb3 ;\cf4 \cb1 \
\cb3     \cf2 \cb3 if\cf4 \cb3  \cf6 (\cf4 method \cf6 ===\cf4  \cf7 \cb3 'points'\cf4 \cb3  \cf6 &&\cf4  userData\cf6 .\cf4 points \cf6 <\cf4  \cf10 \cb3 1000\cf6 \cb3 )\cf4  \cf2 \cb3 return\cf4 \cb3  showToastMessage\cf6 (\cf7 \cb3 "Not enough points!"\cf6 \cb3 );\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  updates \cf6 =\cf4  \cf6 \{\cf4  isPro\cf6 :\cf4  \cf2 \cb3 true\cf6 \cb3 ,\cf4  points\cf6 :\cf4  method \cf6 ===\cf4  \cf7 \cb3 'points'\cf4 \cb3  \cf6 ?\cf4  userData\cf6 .\cf4 points \cf6 -\cf4  \cf10 \cb3 1000\cf4 \cb3  \cf6 :\cf4  userData\cf6 .\cf4 points \cf6 \};\cf4 \cb1 \
\cb3     setUserData\cf6 (\cf4 prev \cf6 =>\cf4  \cf6 (\{\cf4  \cf6 ...\cf4 prev\cf6 ,\cf4  \cf6 ...\cf4 updates \cf6 \}));\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  userRef \cf6 =\cf4  doc\cf6 (\cf4 db\cf6 ,\cf4  \cf7 \cb3 'artifacts'\cf6 \cb3 ,\cf4  appId\cf6 ,\cf4  \cf7 \cb3 'users'\cf6 \cb3 ,\cf4  user\cf6 .\cf4 uid\cf6 ,\cf4  \cf7 \cb3 'profile'\cf6 \cb3 ,\cf4  \cf7 \cb3 'data'\cf6 \cb3 );\cf4 \cb1 \
\cb3     \cf2 \cb3 await\cf4 \cb3  setDoc\cf6 (\cf4 userRef\cf6 ,\cf4  updates\cf6 ,\cf4  \cf6 \{\cf4  merge\cf6 :\cf4  \cf2 \cb3 true\cf4 \cb3  \cf6 \});\cf4 \cb1 \
\cb3     showToastMessage\cf6 (\cf7 \cb3 "Welcome to PRO! All hacks unlocked."\cf6 \cb3 );\cf4 \cb1 \
\cb3   \cf6 \};\cf4 \cb1 \
\
\cb3   \cf2 \cb3 const\cf4 \cb3  handleToggleFavorite \cf6 =\cf4  \cf2 \cb3 async\cf4 \cb3  \cf6 (\cf4 hackId\cf6 )\cf4  \cf6 =>\cf4  \cf6 \{\cf4 \cb1 \
\cb3     \cf2 \cb3 if\cf4 \cb3  \cf6 (!\cf4 user\cf6 )\cf4  \cf2 \cb3 return\cf6 \cb3 ;\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  isFavorited \cf6 =\cf4  userData\cf6 .\cf4 favorites\cf6 ?.\cf4 includes\cf6 (\cf4 hackId\cf6 );\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  updates \cf6 =\cf4  \cf6 \{\cf4  favorites\cf6 :\cf4  isFavorited \cf6 ?\cf4  arrayRemove\cf6 (\cf4 hackId\cf6 )\cf4  \cf6 :\cf4  arrayUnion\cf6 (\cf4 hackId\cf6 )\cf4  \cf6 \};\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  userRef \cf6 =\cf4  doc\cf6 (\cf4 db\cf6 ,\cf4  \cf7 \cb3 'artifacts'\cf6 \cb3 ,\cf4  appId\cf6 ,\cf4  \cf7 \cb3 'users'\cf6 \cb3 ,\cf4  user\cf6 .\cf4 uid\cf6 ,\cf4  \cf7 \cb3 'profile'\cf6 \cb3 ,\cf4  \cf7 \cb3 'data'\cf6 \cb3 );\cf4 \cb1 \
\cb3     \cf2 \cb3 await\cf4 \cb3  updateDoc\cf6 (\cf4 userRef\cf6 ,\cf4  updates\cf6 );\cf4 \cb1 \
\cb3   \cf6 \};\cf4 \cb1 \
\
\cb3   \cf2 \cb3 const\cf4 \cb3  handleToggleFollow \cf6 =\cf4  \cf2 \cb3 async\cf4 \cb3  \cf6 (\cf4 authorName\cf6 )\cf4  \cf6 =>\cf4  \cf6 \{\cf4 \cb1 \
\cb3     \cf2 \cb3 if\cf4 \cb3  \cf6 (!\cf4 user\cf6 )\cf4  \cf2 \cb3 return\cf6 \cb3 ;\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  isFollowing \cf6 =\cf4  userData\cf6 .\cf4 following\cf6 ?.\cf4 includes\cf6 (\cf4 authorName\cf6 );\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  updates \cf6 =\cf4  \cf6 \{\cf4  following\cf6 :\cf4  isFollowing \cf6 ?\cf4  arrayRemove\cf6 (\cf4 authorName\cf6 )\cf4  \cf6 :\cf4  arrayUnion\cf6 (\cf4 authorName\cf6 )\cf4  \cf6 \};\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  userRef \cf6 =\cf4  doc\cf6 (\cf4 db\cf6 ,\cf4  \cf7 \cb3 'artifacts'\cf6 \cb3 ,\cf4  appId\cf6 ,\cf4  \cf7 \cb3 'users'\cf6 \cb3 ,\cf4  user\cf6 .\cf4 uid\cf6 ,\cf4  \cf7 \cb3 'profile'\cf6 \cb3 ,\cf4  \cf7 \cb3 'data'\cf6 \cb3 );\cf4 \cb1 \
\cb3     \cf2 \cb3 await\cf4 \cb3  updateDoc\cf6 (\cf4 userRef\cf6 ,\cf4  updates\cf6 );\cf4 \cb1 \
\cb3   \cf6 \};\cf4 \cb1 \
\
\cb3   \cf2 \cb3 const\cf4 \cb3  submitHack \cf6 =\cf4  \cf2 \cb3 async\cf4 \cb3  \cf6 (\cf4 e\cf6 )\cf4  \cf6 =>\cf4  \cf6 \{\cf4 \cb1 \
\cb3     e\cf6 .\cf4 preventDefault\cf6 ();\cf4 \cb1 \
\cb3     \cf2 \cb3 if\cf4 \cb3  \cf6 (!\cf4 user\cf6 )\cf4  \cf2 \cb3 return\cf6 \cb3 ;\cf4 \cb1 \
\cb3     \cf2 \cb3 if\cf4 \cb3  \cf6 (!\cf4 userData\cf6 .\cf4 isVerified\cf6 )\cf4  \cf2 \cb3 return\cf4 \cb3  setShowVerifyModal\cf6 (\cf2 \cb3 true\cf6 \cb3 );\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  formData \cf6 =\cf4  \cf2 \cb3 new\cf4 \cb3  \cf5 \cb3 FormData\cf6 \cb3 (\cf4 e\cf6 .\cf4 target\cf6 );\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  newHack \cf6 =\cf4  \cf6 \{\cf4 \cb1 \
\cb3       resId\cf6 :\cf4  selectedRes\cf6 .\cf4 id\cf6 ,\cf4  \cb1 \
\cb3       title\cf6 :\cf4  formData\cf6 .\cf2 \cb3 get\cf6 \cb3 (\cf7 \cb3 'title'\cf6 \cb3 ),\cf4  \cb1 \
\cb3       desc\cf6 :\cf4  formData\cf6 .\cf2 \cb3 get\cf6 \cb3 (\cf7 \cb3 'desc'\cf6 \cb3 ),\cf4 \cb1 \
\cb3       savings\cf6 :\cf4  \cf5 \cb3 Number\cf6 \cb3 (\cf4 formData\cf6 .\cf2 \cb3 get\cf6 \cb3 (\cf7 \cb3 'savings'\cf6 \cb3 )),\cf4  \cb1 \
\cb3       votes\cf6 :\cf4  \cf10 \cb3 1\cf6 \cb3 ,\cf4  \cb1 \
\cb3       user\cf6 :\cf4  userData\cf6 .\cf4 username\cf6 ,\cf4 \cb1 \
\cb3       avatar\cf6 :\cf4  userData\cf6 .\cf4 avatar\cf6 ,\cf4  \cb1 \
\cb3       createdAt\cf6 :\cf4  \cf2 \cb3 new\cf4 \cb3  \cf5 \cb3 Date\cf6 \cb3 ().\cf4 toISOString\cf6 ()\cf4 \cb1 \
\cb3     \cf6 \};\cf4 \cb1 \
\
\cb3     \cf2 \cb3 const\cf4 \cb3  hacksRef \cf6 =\cf4  collection\cf6 (\cf4 db\cf6 ,\cf4  \cf7 \cb3 'artifacts'\cf6 \cb3 ,\cf4  appId\cf6 ,\cf4  \cf7 \cb3 'public'\cf6 \cb3 ,\cf4  \cf7 \cb3 'data'\cf6 \cb3 ,\cf4  \cf7 \cb3 'hacks'\cf6 \cb3 );\cf4 \cb1 \
\cb3     \cf2 \cb3 await\cf4 \cb3  addDoc\cf6 (\cf4 hacksRef\cf6 ,\cf4  newHack\cf6 );\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  userRef \cf6 =\cf4  doc\cf6 (\cf4 db\cf6 ,\cf4  \cf7 \cb3 'artifacts'\cf6 \cb3 ,\cf4  appId\cf6 ,\cf4  \cf7 \cb3 'users'\cf6 \cb3 ,\cf4  user\cf6 .\cf4 uid\cf6 ,\cf4  \cf7 \cb3 'profile'\cf6 \cb3 ,\cf4  \cf7 \cb3 'data'\cf6 \cb3 );\cf4 \cb1 \
\cb3     \cf2 \cb3 await\cf4 \cb3  setDoc\cf6 (\cf4 userRef\cf6 ,\cf4  \cf6 \{\cf4  points\cf6 :\cf4  increment\cf6 (\cf10 \cb3 50\cf6 \cb3 )\cf4  \cf6 \},\cf4  \cf6 \{\cf4  merge\cf6 :\cf4  \cf2 \cb3 true\cf4 \cb3  \cf6 \});\cf4 \cb1 \
\
\cb3     setShowAddHackModal\cf6 (\cf2 \cb3 false\cf6 \cb3 );\cf4 \cb1 \
\cb3     showToastMessage\cf6 (\cf7 \cb3 "Hack submitted! +50 Points"\cf6 \cb3 );\cf4 \cb1 \
\cb3   \cf6 \};\cf4 \cb1 \
\
\cb3   \cf2 \cb3 const\cf4 \cb3  openNav \cf6 =\cf4  \cf6 (\cf4 appType\cf6 ,\cf4  lat\cf6 ,\cf4  lng\cf6 )\cf4  \cf6 =>\cf4  \cf6 \{\cf4 \cb1 \
\cb3     \cf2 \cb3 if\cf4 \cb3  \cf6 (\cf4 appType \cf6 ===\cf4  \cf7 \cb3 'google'\cf6 \cb3 )\cf4  window\cf6 .\cf4 open\cf6 (\cf7 \cb3 `https://www.google.com/maps/dir/?api=1&destination=\cf6 \cb3 $\{\cf4 lat\cf6 \}\cf7 \cb3 ,\cf6 \cb3 $\{\cf4 lng\cf6 \}\cf7 \cb3 `\cf6 \cb3 );\cf4 \cb1 \
\cb3     \cf2 \cb3 if\cf4 \cb3  \cf6 (\cf4 appType \cf6 ===\cf4  \cf7 \cb3 'apple'\cf6 \cb3 )\cf4  window\cf6 .\cf4 open\cf6 (\cf7 \cb3 `http://maps.apple.com/?daddr=\cf6 \cb3 $\{\cf4 lat\cf6 \}\cf7 \cb3 ,\cf6 \cb3 $\{\cf4 lng\cf6 \}\cf7 \cb3 `\cf6 \cb3 );\cf4 \cb1 \
\cb3     \cf2 \cb3 if\cf4 \cb3  \cf6 (\cf4 appType \cf6 ===\cf4  \cf7 \cb3 'waze'\cf6 \cb3 )\cf4  window\cf6 .\cf4 open\cf6 (\cf7 \cb3 `https://waze.com/ul?ll=\cf6 \cb3 $\{\cf4 lat\cf6 \}\cf7 \cb3 ,\cf6 \cb3 $\{\cf4 lng\cf6 \}\cf7 \cb3 &navigate=yes`\cf6 \cb3 );\cf4 \cb1 \
\cb3   \cf6 \};\cf4 \cb1 \
\
\cb3   \cf2 \cb3 const\cf4 \cb3  renderHeader \cf6 =\cf4  \cf6 ()\cf4  \cf6 =>\cf4  \cf6 (\cf4 \cb1 \
\cb3     \cf6 <\cf4 header className\cf6 =\cf7 \cb3 "bg-white px-5 py-4 shadow-sm z-20 flex justify-between items-center sticky top-0"\cf6 \cb3 >\cf4 \cb1 \
\cb3       \cf6 <\cf4 h1 className\cf6 =\cf7 \cb3 "text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 italic"\cf6 \cb3 >\cf5 \cb3 Tipid\cf4 \cb3  \cf5 \cb3 Menu\cf6 \cb3 </\cf4 h1\cf6 >\cf4 \cb1 \
\cb3       \cf6 <\cf4 button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  setCurrentTab\cf6 (\cf7 \cb3 'profile'\cf6 \cb3 )\}\cf4  className\cf6 =\cf7 \cb3 "flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 hover:bg-orange-100 transition-colors"\cf6 \cb3 >\cf4 \cb1 \
\cb3         \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "flex flex-col items-end"\cf6 \cb3 >\cf4 \cb1 \
\cb3           \cf6 <\cf4 span className\cf6 =\cf7 \cb3 "text-xs font-bold text-orange-700"\cf6 \cb3 >\{\cf4 userData\cf6 .\cf4 points\cf6 \}\cf4  pts\cf6 </\cf4 span\cf6 >\cf4 \cb1 \
\cb3           \cf6 <\cf4 span className\cf6 =\cf7 \cb3 "text-[10px] font-semibold text-orange-500 flex items-center"\cf6 \cb3 >\{\cf4 userTier\cf6 .\cf4 icon\cf6 \}\cf4  \cf6 \{\cf4 userTier\cf6 .\cf4 name\cf6 \}</\cf4 span\cf6 >\cf4 \cb1 \
\cb3         \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3         \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg shadow-sm border border-orange-200"\cf6 \cb3 >\{\cf4 userData\cf6 .\cf4 avatar\cf6 \}</\cf4 div\cf6 >\cf4 \cb1 \
\cb3       \cf6 </\cf4 button\cf6 >\cf4 \cb1 \
\cb3     \cf6 </\cf4 header\cf6 >\cf4 \cb1 \
\cb3   \cf6 );\cf4 \cb1 \
\
\cb3   \cf2 \cb3 const\cf4 \cb3  renderTabBar \cf6 =\cf4  \cf6 ()\cf4  \cf6 =>\cf4  \cf6 (\cf4 \cb1 \
\cb3     \cf6 <\cf4 nav className\cf6 =\cf7 \cb3 "bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center sticky bottom-0 z-20 pb-safe"\cf6 \cb3 >\cf4 \cb1 \
\cb3       \cf6 <\cf4 button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  setCurrentTab\cf6 (\cf7 \cb3 'map'\cf6 \cb3 )\}\cf4  className\cf6 =\{\cf7 \cb3 `flex flex-col items-center gap-1 \cf6 \cb3 $\{\cf4 currentTab \cf6 ===\cf4  \cf7 \cb3 'map'\cf4 \cb3  \cf6 ?\cf4  \cf7 \cb3 'text-orange-600'\cf4 \cb3  \cf6 :\cf4  \cf7 \cb3 'text-slate-400'\cf6 \cb3 \}\cf7 \cb3 `\cf6 \cb3 \}>\cf4 \cb1 \
\cb3         \cf6 <\cf5 \cb3 MapPin\cf4 \cb3  size\cf6 =\{\cf10 \cb3 24\cf6 \cb3 \}\cf4  className\cf6 =\{\cf4 currentTab \cf6 ===\cf4  \cf7 \cb3 'map'\cf4 \cb3  \cf6 ?\cf4  \cf7 \cb3 'fill-orange-100'\cf4 \cb3  \cf6 :\cf4  \cf7 \cb3 ''\cf6 \cb3 \}\cf4  /><span className\cf6 =\cf7 \cb3 "text-[10px] font-bold"\cf6 \cb3 >\cf5 \cb3 Near\cf4 \cb3  \cf5 \cb3 Me\cf6 \cb3 </\cf4 span\cf6 >\cf4 \cb1 \
\cb3       \cf6 </\cf4 button\cf6 >\cf4 \cb1 \
\cb3       \cf6 <\cf4 button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  setCurrentTab\cf6 (\cf7 \cb3 'spots'\cf6 \cb3 )\}\cf4  className\cf6 =\{\cf7 \cb3 `flex flex-col items-center gap-1 \cf6 \cb3 $\{\cf4 currentTab \cf6 ===\cf4  \cf7 \cb3 'spots'\cf4 \cb3  \cf6 ?\cf4  \cf7 \cb3 'text-orange-600'\cf4 \cb3  \cf6 :\cf4  \cf7 \cb3 'text-slate-400'\cf6 \cb3 \}\cf7 \cb3 `\cf6 \cb3 \}>\cf4 \cb1 \
\cb3         \cf6 <\cf5 \cb3 List\cf4 \cb3  size\cf6 =\{\cf10 \cb3 24\cf6 \cb3 \}\cf4  /><span className\cf6 =\cf7 \cb3 "text-[10px] font-bold"\cf6 \cb3 >\cf5 \cb3 Spots\cf6 \cb3 </\cf4 span\cf6 >\cf4 \cb1 \
\cb3       \cf6 </\cf4 button\cf6 >\cf4 \cb1 \
\cb3       \cf6 <\cf4 button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  \cf6 \{\cf4  \cf2 \cb3 if\cf6 \cb3 (\cf4 selectedRes\cf6 )\cf4  setShowAddHackModal\cf6 (\cf2 \cb3 true\cf6 \cb3 );\cf4  \cf2 \cb3 else\cf4 \cb3  setCurrentTab\cf6 (\cf7 \cb3 'spots'\cf6 \cb3 );\cf4  \cf6 \}\}\cf4  className\cf6 =\cf7 \cb3 "bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-full text-white shadow-lg shadow-orange-500/30 transform -translate-y-4 hover:scale-105 transition-transform"\cf4 \cb3 ><\cf5 \cb3 Plus\cf4 \cb3  size\cf6 =\{\cf10 \cb3 24\cf6 \cb3 \}\cf4  /></button\cf6 >\cf4 \cb1 \
\cb3       \cf6 <\cf4 button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  setCurrentTab\cf6 (\cf7 \cb3 'pro'\cf6 \cb3 )\}\cf4  className\cf6 =\{\cf7 \cb3 `flex flex-col items-center gap-1 \cf6 \cb3 $\{\cf4 currentTab \cf6 ===\cf4  \cf7 \cb3 'pro'\cf4 \cb3  \cf6 ?\cf4  \cf7 \cb3 'text-orange-600'\cf4 \cb3  \cf6 :\cf4  \cf7 \cb3 'text-slate-400'\cf6 \cb3 \}\cf7 \cb3 `\cf6 \cb3 \}>\cf4 \cb1 \
\cb3         \cf6 <\cf5 \cb3 Zap\cf4 \cb3  size\cf6 =\{\cf10 \cb3 24\cf6 \cb3 \}\cf4  className\cf6 =\{\cf4 currentTab \cf6 ===\cf4  \cf7 \cb3 'pro'\cf4 \cb3  \cf6 ?\cf4  \cf7 \cb3 'fill-orange-100'\cf4 \cb3  \cf6 :\cf4  \cf7 \cb3 ''\cf6 \cb3 \}\cf4  /><span className\cf6 =\cf7 \cb3 "text-[10px] font-bold"\cf6 \cb3 >\cf5 \cb3 PRO\cf6 \cb3 </\cf4 span\cf6 >\cf4 \cb1 \
\cb3       \cf6 </\cf4 button\cf6 >\cf4 \cb1 \
\cb3       \cf6 <\cf4 button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  setCurrentTab\cf6 (\cf7 \cb3 'profile'\cf6 \cb3 )\}\cf4  className\cf6 =\{\cf7 \cb3 `flex flex-col items-center gap-1 \cf6 \cb3 $\{\cf4 currentTab \cf6 ===\cf4  \cf7 \cb3 'profile'\cf4 \cb3  \cf6 ?\cf4  \cf7 \cb3 'text-orange-600'\cf4 \cb3  \cf6 :\cf4  \cf7 \cb3 'text-slate-400'\cf6 \cb3 \}\cf7 \cb3 `\cf6 \cb3 \}>\cf4 \cb1 \
\cb3         \cf6 <\cf5 \cb3 User\cf4 \cb3  size\cf6 =\{\cf10 \cb3 24\cf6 \cb3 \}\cf4  className\cf6 =\{\cf4 currentTab \cf6 ===\cf4  \cf7 \cb3 'profile'\cf4 \cb3  \cf6 ?\cf4  \cf7 \cb3 'fill-orange-100'\cf4 \cb3  \cf6 :\cf4  \cf7 \cb3 ''\cf6 \cb3 \}\cf4  /><span className\cf6 =\cf7 \cb3 "text-[10px] font-bold"\cf6 \cb3 >\cf5 \cb3 Profile\cf6 \cb3 </\cf4 span\cf6 >\cf4 \cb1 \
\cb3       \cf6 </\cf4 button\cf6 >\cf4 \cb1 \
\cb3     \cf6 </\cf4 nav\cf6 >\cf4 \cb1 \
\cb3   \cf6 );\cf4 \cb1 \
\
\cb3   \cf2 \cb3 const\cf4 \cb3  renderMap \cf6 =\cf4  \cf6 ()\cf4  \cf6 =>\cf4  \cf6 (\cf4 \cb1 \
\cb3     \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "flex-1 relative bg-[#E2E8F0] overflow-hidden"\cf6 \cb3 >\cf4 \cb1 \
\cb3       \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-50 mix-blend-multiply"\cf4 \cb3 ></div\cf6 >\cf4 \cb1 \
\cb3       \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"\cf4 \cb3 ></div\cf6 >\cf4 \cb1 \
\cb3       \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"\cf6 \cb3 >\cf4 \cb1 \
\cb3         \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "w-16 h-16 bg-blue-500/20 rounded-full animate-ping absolute"\cf4 \cb3 ></div\cf6 >\cf4 \cb1 \
\cb3         \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg z-10"\cf4 \cb3 ></div\cf6 >\cf4 \cb1 \
\cb3       \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3       \cf6 \{\cf4 restaurants\cf6 .\cf4 map\cf6 (\cf4 res \cf6 =>\cf4  \cf6 (\cf4 \cb1 \
\cb3         \cf6 <\cf4 button key\cf6 =\{\cf4 res\cf6 .\cf4 id\cf6 \}\cf4  onClick\cf6 =\{()\cf4  \cf6 =>\cf4  setSelectedRes\cf6 (\cf4 res\cf6 )\}\cf4  className\cf6 =\cf7 \cb3 "absolute flex flex-col items-center group -translate-x-1/2 -translate-y-full z-10 hover:z-20 transition-all duration-300"\cf4 \cb3  style\cf6 =\{\{\cf4  top\cf6 :\cf4  res\cf6 .\cf4 top\cf6 ,\cf4  left\cf6 :\cf4  res\cf6 .\cf4 left \cf6 \}\}>\cf4 \cb1 \
\cb3           \cf6 <\cf4 div className\cf6 =\{\cf7 \cb3 `p-2 rounded-2xl shadow-xl transition-transform \cf6 \cb3 $\{\cf4 selectedRes\cf6 ?.\cf4 id \cf6 ===\cf4  res\cf6 .\cf4 id \cf6 ?\cf4  \cf7 \cb3 'bg-orange-600 text-white scale-110'\cf4 \cb3  \cf6 :\cf4  \cf7 \cb3 'bg-white text-orange-600 hover:scale-110 border border-slate-200'\cf6 \cb3 \}\cf7 \cb3 `\cf6 \cb3 \}\cf4 ><span className\cf6 =\cf7 \cb3 "text-xl"\cf6 \cb3 >\{\cf4 res\cf6 .\cf4 img\cf6 \}</\cf4 span></div\cf6 >\cf4 \cb1 \
\cb3           \cf6 <\cf4 span className\cf6 =\{\cf7 \cb3 `mt-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-xs font-bold rounded-lg shadow-sm border border-slate-100 transition-opacity whitespace-nowrap \cf6 \cb3 $\{\cf4 selectedRes\cf6 ?.\cf4 id \cf6 ===\cf4  res\cf6 .\cf4 id \cf6 ?\cf4  \cf7 \cb3 'opacity-100 text-orange-700'\cf4 \cb3  \cf6 :\cf4  \cf7 \cb3 'opacity-0 group-hover:opacity-100 text-slate-700'\cf6 \cb3 \}\cf7 \cb3 `\cf6 \cb3 \}>\{\cf4 res\cf6 .\cf4 name\cf6 \}</\cf4 span\cf6 >\cf4 \cb1 \
\cb3         \cf6 </\cf4 button\cf6 >\cf4 \cb1 \
\cb3       \cf6 ))\}\cf4 \cb1 \
\cb3       \cf6 \{\cf4 selectedRes \cf6 &&\cf4  \cf6 (\cf4 \cb1 \
\cb3         \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "absolute bottom-4 left-4 right-4 bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-5 z-20 animate-in slide-in-from-bottom border border-slate-100"\cf6 \cb3 >\cf4 \cb1 \
\cb3           \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "flex justify-between items-start mb-4"\cf6 \cb3 >\cf4 \cb1 \
\cb3             \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "flex gap-3 items-center"\cf6 \cb3 >\cf4 \cb1 \
\cb3               \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl border border-orange-100"\cf6 \cb3 >\{\cf4 selectedRes\cf6 .\cf4 img\cf6 \}</\cf4 div\cf6 >\cf4 \cb1 \
\cb3               \cf6 <\cf4 div\cf6 >\cf4 \cb1 \
\cb3                 \cf6 <\cf4 h2 className\cf6 =\cf7 \cb3 "text-xl font-black text-slate-800 leading-tight"\cf6 \cb3 >\{\cf4 selectedRes\cf6 .\cf4 name\cf6 \}</\cf4 h2\cf6 >\cf4 \cb1 \
\cb3                 \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "flex items-center gap-1 mt-0.5"\cf4 \cb3 ><\cf5 \cb3 Star\cf4 \cb3  size\cf6 =\{\cf10 \cb3 12\cf6 \cb3 \}\cf4  className\cf6 =\cf7 \cb3 "fill-orange-400 text-orange-400"\cf4 \cb3  /><span className\cf6 =\cf7 \cb3 "text-xs font-bold text-slate-600"\cf6 \cb3 >\{\cf4 selectedRes\cf6 .\cf4 rating\cf6 \}</\cf4 span><span className\cf6 =\cf7 \cb3 "text-xs text-slate-400"\cf6 \cb3 >\cf11 \cb3 \'95\cf4 \cb3  \cf6 \{\cf4 selectedRes\cf6 .\cf4 category\cf6 \}</\cf4 span></div\cf6 >\cf4 \cb1 \
\cb3               \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3             \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3             \cf6 <\cf4 button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  setSelectedRes\cf6 (\cf2 \cb3 null\cf6 \cb3 )\}\cf4  className\cf6 =\cf7 \cb3 "p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100"\cf4 \cb3 ><\cf5 \cb3 X\cf4 \cb3  size\cf6 =\{\cf10 \cb3 18\cf6 \cb3 \}\cf4  /></button\cf6 >\cf4 \cb1 \
\cb3           \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3           \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "grid grid-cols-3 gap-2 mb-4"\cf6 \cb3 >\cf4 \cb1 \
\cb3             \cf6 <\cf4 button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  openNav\cf6 (\cf7 \cb3 'google'\cf6 \cb3 ,\cf4  selectedRes\cf6 .\cf4 lat\cf6 ,\cf4  selectedRes\cf6 .\cf4 lng\cf6 )\}\cf4  className\cf6 =\cf7 \cb3 "flex flex-col items-center gap-1.5 p-2 bg-slate-50 rounded-xl hover:bg-orange-50 hover:text-orange-600 text-slate-600 transition-colors"\cf4 \cb3 ><\cf5 \cb3 MapIcon\cf4 \cb3  size\cf6 =\{\cf10 \cb3 20\cf6 \cb3 \}\cf4  /><span className\cf6 =\cf7 \cb3 "text-[10px] font-bold"\cf6 \cb3 >\cf5 \cb3 G\cf6 \cb3 -\cf5 \cb3 Maps\cf6 \cb3 </\cf4 span></button\cf6 >\cf4 \cb1 \
\cb3             \cf6 <\cf4 button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  openNav\cf6 (\cf7 \cb3 'apple'\cf6 \cb3 ,\cf4  selectedRes\cf6 .\cf4 lat\cf6 ,\cf4  selectedRes\cf6 .\cf4 lng\cf6 )\}\cf4  className\cf6 =\cf7 \cb3 "flex flex-col items-center gap-1.5 p-2 bg-slate-50 rounded-xl hover:bg-orange-50 hover:text-orange-600 text-slate-600 transition-colors"\cf4 \cb3 ><\cf5 \cb3 Navigation2\cf4 \cb3  size\cf6 =\{\cf10 \cb3 20\cf6 \cb3 \}\cf4  /><span className\cf6 =\cf7 \cb3 "text-[10px] font-bold"\cf6 \cb3 >\cf5 \cb3 Apple\cf6 \cb3 </\cf4 span></button\cf6 >\cf4 \cb1 \
\cb3             \cf6 <\cf4 button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  openNav\cf6 (\cf7 \cb3 'waze'\cf6 \cb3 ,\cf4  selectedRes\cf6 .\cf4 lat\cf6 ,\cf4  selectedRes\cf6 .\cf4 lng\cf6 )\}\cf4  className\cf6 =\cf7 \cb3 "flex flex-col items-center gap-1.5 p-2 bg-slate-50 rounded-xl hover:bg-orange-50 hover:text-orange-600 text-slate-600 transition-colors"\cf4 \cb3 ><\cf5 \cb3 Car\cf4 \cb3  size\cf6 =\{\cf10 \cb3 20\cf6 \cb3 \}\cf4  /><span className\cf6 =\cf7 \cb3 "text-[10px] font-bold"\cf6 \cb3 >\cf5 \cb3 Waze\cf6 \cb3 </\cf4 span></button\cf6 >\cf4 \cb1 \
\cb3           \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3           \cf6 <\cf4 button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  setActiveView\cf6 (\cf7 \cb3 'restaurant'\cf6 \cb3 )\}\cf4  className\cf6 =\cf7 \cb3 "w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"\cf6 \cb3 >\cf5 \cb3 View\cf4 \cb3  \cf5 \cb3 Hacks\cf4 \cb3  \cf6 &\cf4  \cf5 \cb3 Promos\cf4 \cb3  \cf6 <\cf5 \cb3 ChevronRight\cf4 \cb3  size\cf6 =\{\cf10 \cb3 18\cf6 \cb3 \}\cf4  /></button\cf6 >\cf4 \cb1 \
\cb3         \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3       \cf6 )\}\cf4 \cb1 \
\cb3     \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3   \cf6 );\cf4 \cb1 \
\
\cb3   \cf2 \cb3 const\cf4 \cb3  renderSpots \cf6 =\cf4  \cf6 ()\cf4  \cf6 =>\cf4  \cf6 \{\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  filtered \cf6 =\cf4  restaurants\cf6 .\cf4 filter\cf6 (\cf4 r \cf6 =>\cf4  r\cf6 .\cf4 name\cf6 .\cf4 toLowerCase\cf6 ().\cf4 includes\cf6 (\cf4 searchQuery\cf6 .\cf4 toLowerCase\cf6 ()));\cf4 \cb1 \
\cb3     \cf2 \cb3 return\cf4 \cb3  \cf6 (\cf4 \cb1 \
\cb3       \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "flex-1 overflow-y-auto bg-slate-50 p-4"\cf6 \cb3 >\cf4 \cb1 \
\cb3         \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "relative mb-6"\cf6 \cb3 >\cf4 \cb1 \
\cb3           \cf6 <\cf5 \cb3 Search\cf4 \cb3  className\cf6 =\cf7 \cb3 "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"\cf4 \cb3  size\cf6 =\{\cf10 \cb3 20\cf6 \cb3 \}\cf4  />\cb1 \
\cb3           \cf6 <\cf4 input \cf2 \cb3 type\cf6 \cb3 =\cf7 \cb3 "text"\cf4 \cb3  placeholder\cf6 =\cf7 \cb3 "Search restaurants..."\cf4 \cb3  value\cf6 =\{\cf4 searchQuery\cf6 \}\cf4  onChange\cf6 =\{(\cf4 e\cf6 )\cf4  \cf6 =>\cf4  setSearchQuery\cf6 (\cf4 e\cf6 .\cf4 target\cf6 .\cf4 value\cf6 )\}\cf4  className\cf6 =\cf7 \cb3 "w-full bg-white border border-slate-200 py-3.5 pl-12 pr-4 rounded-2xl font-medium focus:ring-2 focus:ring-orange-500 shadow-sm transition-all"\cf4 \cb3  />\cb1 \
\cb3         \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3         \cf6 <\cf4 h3 className\cf6 =\cf7 \cb3 "font-bold text-slate-800 mb-4 px-1"\cf6 \cb3 >\cf5 \cb3 All\cf4 \cb3  \cf5 \cb3 Spots\cf6 \cb3 </\cf4 h3\cf6 >\cf4 \cb1 \
\cb3         \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "space-y-3"\cf6 \cb3 >\cf4 \cb1 \
\cb3           \cf6 \{\cf4 filtered\cf6 .\cf4 map\cf6 (\cf4 res \cf6 =>\cf4  \cf6 (\cf4 \cb1 \
\cb3             \cf6 <\cf4 div key\cf6 =\{\cf4 res\cf6 .\cf4 id\cf6 \}\cf4  onClick\cf6 =\{()\cf4  \cf6 =>\cf4  \cf6 \{\cf4  setSelectedRes\cf6 (\cf4 res\cf6 );\cf4  setActiveView\cf6 (\cf7 \cb3 'restaurant'\cf6 \cb3 );\cf4  \cf6 \}\}\cf4  className\cf6 =\cf7 \cb3 "bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:border-orange-200 transition-colors"\cf6 \cb3 >\cf4 \cb1 \
\cb3               \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-3xl border border-orange-100"\cf6 \cb3 >\{\cf4 res\cf6 .\cf4 img\cf6 \}</\cf4 div\cf6 >\cf4 \cb1 \
\cb3               \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "flex-1"\cf4 \cb3 ><h4 className\cf6 =\cf7 \cb3 "font-bold text-slate-800 text-lg"\cf6 \cb3 >\{\cf4 res\cf6 .\cf4 name\cf6 \}</\cf4 h4><p className\cf6 =\cf7 \cb3 "text-sm text-slate-500"\cf6 \cb3 >\{\cf4 res\cf6 .\cf4 category\cf6 \}</\cf4 p></div\cf6 >\cf4 \cb1 \
\cb3               \cf6 <\cf5 \cb3 ChevronRight\cf4 \cb3  className\cf6 =\cf7 \cb3 "text-slate-300"\cf4 \cb3  size\cf6 =\{\cf10 \cb3 20\cf6 \cb3 \}\cf4  />\cb1 \
\cb3             \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3           \cf6 ))\}\cf4 \cb1 \
\cb3         \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3       \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3     \cf6 );\cf4 \cb1 \
\cb3   \cf6 \};\cf4 \cb1 \
\
\cb3   \cf2 \cb3 const\cf4 \cb3  renderRestaurant \cf6 =\cf4  \cf6 ()\cf4  \cf6 =>\cf4  \cf6 \{\cf4 \cb1 \
\cb3     \cf2 \cb3 if\cf4 \cb3  \cf6 (!\cf4 selectedRes\cf6 )\cf4  \cf2 \cb3 return\cf4 \cb3  \cf2 \cb3 null\cf6 \cb3 ;\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  resPromos \cf6 =\cf4  promos\cf6 .\cf4 filter\cf6 (\cf4 p \cf6 =>\cf4  p\cf6 .\cf4 resId \cf6 ===\cf4  selectedRes\cf6 .\cf4 id\cf6 );\cf4 \cb1 \
\cb3     \cf2 \cb3 const\cf4 \cb3  resHacks \cf6 =\cf4  hacks\cf6 .\cf4 filter\cf6 (\cf4 h \cf6 =>\cf4  h\cf6 .\cf4 resId \cf6 ===\cf4  selectedRes\cf6 .\cf4 id\cf6 ).\cf4 sort\cf6 ((\cf4 a\cf6 ,\cf4 b\cf6 )\cf4  \cf6 =>\cf4  b\cf6 .\cf4 votes \cf6 -\cf4  a\cf6 .\cf4 votes\cf6 );\cf4 \cb1 \
\cb3     \cf2 \cb3 return\cf4 \cb3  \cf6 (\cf4 \cb1 \
\cb3       \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "flex-1 overflow-y-auto bg-slate-50 pb-8 animate-in slide-in-from-right duration-300"\cf6 \cb3 >\cf4 \cb1 \
\cb3         \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "bg-white px-5 pt-4 pb-6 shadow-sm sticky top-0 z-10"\cf6 \cb3 >\cf4 \cb1 \
\cb3           \cf6 <\cf4 button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  setActiveView\cf6 (\cf7 \cb3 'main'\cf6 \cb3 )\}\cf4  className\cf6 =\cf7 \cb3 "flex items-center gap-2 text-slate-500 font-bold mb-4 hover:text-slate-800"\cf4 \cb3 ><\cf5 \cb3 X\cf4 \cb3  size\cf6 =\{\cf10 \cb3 20\cf6 \cb3 \}\cf4  /> \cf5 \cb3 Back\cf4 \cb3  to \cf5 \cb3 Map\cf6 \cb3 </\cf4 button\cf6 >\cf4 \cb1 \
\cb3           \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "flex items-center gap-4"\cf6 \cb3 >\cf4 \cb1 \
\cb3             \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl border border-orange-100"\cf6 \cb3 >\{\cf4 selectedRes\cf6 .\cf4 img\cf6 \}</\cf4 div\cf6 >\cf4 \cb1 \
\cb3             \cf6 <\cf4 div\cf6 >\cf4 \cb1 \
\cb3               \cf6 <\cf4 h2 className\cf6 =\cf7 \cb3 "text-3xl font-black text-slate-800"\cf6 \cb3 >\{\cf4 selectedRes\cf6 .\cf4 name\cf6 \}</\cf4 h2\cf6 >\cf4 \cb1 \
\cb3               \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "flex items-center gap-2 mt-1"\cf4 \cb3 ><span className\cf6 =\cf7 \cb3 "bg-slate-100 px-2 py-0.5 rounded text-xs font-bold text-slate-600"\cf6 \cb3 >\{\cf4 selectedRes\cf6 .\cf4 category\cf6 \}</\cf4 span><span className\cf6 =\cf7 \cb3 "text-sm font-bold text-slate-500 flex items-center gap-1"\cf4 \cb3 ><\cf5 \cb3 Star\cf4 \cb3  size\cf6 =\{\cf10 \cb3 14\cf6 \cb3 \}\cf4  className\cf6 =\cf7 \cb3 "fill-orange-400 text-orange-400"\cf4 \cb3 /> \cf6 \{\cf4 selectedRes\cf6 .\cf4 rating\cf6 \}</\cf4 span></div\cf6 >\cf4 \cb1 \
\cb3             \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3           \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3         \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3         \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "p-5 space-y-6"\cf6 \cb3 >\cf4 \cb1 \
\cb3           \cf6 \{\cf4 resPromos\cf6 .\cf4 length \cf6 >\cf4  \cf10 \cb3 0\cf4 \cb3  \cf6 &&\cf4  \cf6 (\cf4 \cb1 \
\cb3             \cf6 <\cf4 section\cf6 >\cf4 \cb1 \
\cb3               \cf6 <\cf4 h3 className\cf6 =\cf7 \cb3 "text-lg font-black text-slate-800 mb-3 flex items-center gap-2"\cf4 \cb3 ><\cf5 \cb3 ShieldCheck\cf4 \cb3  size\cf6 =\{\cf10 \cb3 20\cf6 \cb3 \}\cf4  className\cf6 =\cf7 \cb3 "text-blue-500"\cf4 \cb3  /> \cf5 \cb3 Official\cf4 \cb3  \cf5 \cb3 Promos\cf6 \cb3 </\cf4 h3\cf6 >\cf4 \cb1 \
\cb3               \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "space-y-3"\cf6 \cb3 >\{\cf4 resPromos\cf6 .\cf4 map\cf6 (\cf4 p \cf6 =>\cf4  \cf6 (\cf4 \cb1 \
\cb3                 \cf6 <\cf4 div key\cf6 =\{\cf4 p\cf6 .\cf4 id\cf6 \}\cf4  className\cf6 =\cf7 \cb3 "bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3"\cf6 \cb3 >\cf4 \cb1 \
\cb3                   \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "bg-blue-100 p-2 rounded-xl h-fit"\cf4 \cb3 ><\cf5 \cb3 Zap\cf4 \cb3  size\cf6 =\{\cf10 \cb3 20\cf6 \cb3 \}\cf4  className\cf6 =\cf7 \cb3 "text-blue-600"\cf4 \cb3  /></div\cf6 >\cf4 \cb1 \
\cb3                   \cf6 <\cf4 div><h4 className\cf6 =\cf7 \cb3 "font-bold text-slate-800"\cf6 \cb3 >\{\cf4 p\cf6 .\cf4 title\cf6 \}</\cf4 h4><p className\cf6 =\cf7 \cb3 "text-xs font-semibold text-blue-600 mt-1"\cf6 \cb3 >\cf5 \cb3 Verified\cf4 \cb3  via \cf6 \{\cf4 p\cf6 .\cf4 source\cf6 \}</\cf4 p></div\cf6 >\cf4 \cb1 \
\cb3                 \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3               \cf6 ))\}</\cf4 div\cf6 >\cf4 \cb1 \
\cb3             \cf6 </\cf4 section\cf6 >\cf4 \cb1 \
\cb3           \cf6 )\}\cf4 \cb1 \
\cb3           \cf6 <\cf4 section\cf6 >\cf4 \cb1 \
\cb3             \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "flex justify-between items-end mb-3"\cf4 \cb3 ><h3 className\cf6 =\cf7 \cb3 "text-lg font-black text-slate-800 flex items-center gap-2"\cf4 \cb3 ><\cf5 \cb3 Utensils\cf4 \cb3  size\cf6 =\{\cf10 \cb3 20\cf6 \cb3 \}\cf4  className\cf6 =\cf7 \cb3 "text-orange-500"\cf4 \cb3  /> \cf5 \cb3 Secret\cf4 \cb3  \cf5 \cb3 Hacks\cf6 \cb3 </\cf4 h3><span className\cf6 =\cf7 \cb3 "text-xs font-bold text-slate-500"\cf6 \cb3 >\{\cf4 resHacks\cf6 .\cf4 length\cf6 \}\cf4  \cf5 \cb3 Hacks\cf6 \cb3 </\cf4 span></div\cf6 >\cf4 \cb1 \
\cb3             \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "space-y-4"\cf6 \cb3 >\{\cf4 resHacks\cf6 .\cf4 map\cf6 ((\cf4 hack\cf6 ,\cf4  idx\cf6 )\cf4  \cf6 =>\cf4  \cf6 \{\cf4 \cb1 \
\cb3               \cf2 \cb3 const\cf4 \cb3  isLocked \cf6 =\cf4  idx \cf6 >\cf4  \cf10 \cb3 0\cf4 \cb3  \cf6 &&\cf4  \cf6 !\cf4 userData\cf6 .\cf4 isPro\cf6 ;\cf4 \cb1 \
\cb3               \cf2 \cb3 return\cf4 \cb3  \cf6 (\cf4 \cb1 \
\cb3                 \cf6 <\cf4 div key\cf6 =\{\cf4 hack\cf6 .\cf4 id\cf6 \}\cf4  className\cf6 =\{\cf7 \cb3 `bg-white border rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all \cf6 \cb3 $\{\cf4 isLocked \cf6 ?\cf4  \cf7 \cb3 'border-slate-200'\cf4 \cb3  \cf6 :\cf4  \cf7 \cb3 'border-orange-100'\cf6 \cb3 \}\cf7 \cb3 `\cf6 \cb3 \}>\cf4 \cb1 \
\cb3                   \cf6 \{\cf4 isLocked \cf6 &&\cf4  \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "absolute inset-0 bg-white/60 backdrop-blur-[4px] z-10 flex flex-col items-center justify-center p-4 text-center"\cf4 \cb3 ><\cf5 \cb3 Lock\cf4 \cb3  size\cf6 =\{\cf10 \cb3 32\cf6 \cb3 \}\cf4  className\cf6 =\cf7 \cb3 "text-slate-400 mb-2"\cf4 \cb3  /><p className\cf6 =\cf7 \cb3 "font-bold text-slate-700 mb-3 text-xs"\cf6 \cb3 >\cf5 \cb3 Unlock\cf4 \cb3  \cf5 \cb3 PRO\cf4 \cb3  to see more hacks\cf6 </\cf4 p><button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  \cf6 \{\cf4  setActiveView\cf6 (\cf7 \cb3 'main'\cf6 \cb3 );\cf4  setCurrentTab\cf6 (\cf7 \cb3 'pro'\cf6 \cb3 );\cf4  \cf6 \}\}\cf4  className\cf6 =\cf7 \cb3 "bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-xl font-bold text-xs shadow-md"\cf6 \cb3 >\cf5 \cb3 View\cf4 \cb3  \cf5 \cb3 PRO\cf6 \cb3 </\cf4 button></div\cf6 >\}\cf4 \cb1 \
\cb3                   \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "flex justify-between items-start mb-2"\cf4 \cb3 ><h4 className\cf6 =\cf7 \cb3 "font-bold text-slate-800 text-lg leading-tight pr-4"\cf6 \cb3 >\{\cf4 hack\cf6 .\cf4 title\cf6 \}</\cf4 h4><button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  handleToggleFavorite\cf6 (\cf4 hack\cf6 .\cf4 id\cf6 )\}\cf4  className\cf6 =\cf7 \cb3 "text-slate-300 hover:text-red-500 transition-colors"\cf4 \cb3 ><\cf5 \cb3 Heart\cf4 \cb3  size\cf6 =\{\cf10 \cb3 20\cf6 \cb3 \}\cf4  className\cf6 =\{\cf4 userData\cf6 .\cf4 favorites\cf6 ?.\cf4 includes\cf6 (\cf4 hack\cf6 .\cf4 id\cf6 )\cf4  \cf6 ?\cf4  \cf7 \cb3 "fill-red-500 text-red-500"\cf4 \cb3  \cf6 :\cf4  \cf7 \cb3 ""\cf6 \cb3 \}\cf4  /></button></div\cf6 >\cf4 \cb1 \
\cb3                   \cf6 <\cf4 p className\cf6 =\cf7 \cb3 "text-sm text-slate-600 mb-4"\cf6 \cb3 >\{\cf4 hack\cf6 .\cf4 desc\cf6 \}</\cf4 p\cf6 >\cf4 \cb1 \
\cb3                   \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "flex justify-between items-center pt-3 border-t border-slate-100"\cf6 \cb3 >\cf4 \cb1 \
\cb3                     \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "flex items-center gap-2"\cf4 \cb3 ><div className\cf6 =\cf7 \cb3 "w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs"\cf6 \cb3 >\{\cf4 hack\cf6 .\cf4 avatar\cf6 \}</\cf4 div><span className\cf6 =\cf7 \cb3 "text-xs font-bold text-slate-500"\cf6 \cb3 >\{\cf4 hack\cf6 .\cf4 user\cf6 \}</\cf4 span\cf6 >\{\cf4 hack\cf6 .\cf4 user \cf6 !==\cf4  userData\cf6 .\cf4 username \cf6 &&\cf4  \cf6 <\cf4 button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  handleToggleFollow\cf6 (\cf4 hack\cf6 .\cf4 user\cf6 )\}\cf4  className\cf6 =\{\cf7 \cb3 `ml-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border \cf6 \cb3 $\{\cf4 userData\cf6 .\cf4 following\cf6 ?.\cf4 includes\cf6 (\cf4 hack\cf6 .\cf4 user\cf6 )\cf4  \cf6 ?\cf4  \cf7 \cb3 'bg-slate-100'\cf4 \cb3  \cf6 :\cf4  \cf7 \cb3 'bg-orange-50 text-orange-600'\cf6 \cb3 \}\cf7 \cb3 `\cf6 \cb3 \}>\{\cf4 userData\cf6 .\cf4 following\cf6 ?.\cf4 includes\cf6 (\cf4 hack\cf6 .\cf4 user\cf6 )\cf4  \cf6 ?\cf4  \cf7 \cb3 'Following'\cf4 \cb3  \cf6 :\cf4  \cf7 \cb3 'Follow'\cf6 \cb3 \}</\cf4 button\cf6 >\}</\cf4 div\cf6 >\cf4 \cb1 \
\cb3                     \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "flex items-center gap-3"\cf4 \cb3 ><span className\cf6 =\cf7 \cb3 "flex items-center gap-1 text-xs font-bold text-slate-400"\cf4 \cb3 ><\cf5 \cb3 ArrowUpCircle\cf4 \cb3  size\cf6 =\{\cf10 \cb3 16\cf6 \cb3 \}\cf4 /> \cf6 \{\cf4 hack\cf6 .\cf4 votes\cf6 \}</\cf4 span><div className\cf6 =\cf7 \cb3 "bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-black"\cf6 \cb3 >\cf11 \cb3 \uc0\u8369 \cf6 \cb3 \{\cf4 hack\cf6 .\cf4 savings\cf6 \}</\cf4 div></div\cf6 >\cf4 \cb1 \
\cb3                   \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3                 \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3               \cf6 );\cf4 \cb1 \
\cb3             \cf6 \})\}</\cf4 div\cf6 >\cf4 \cb1 \
\cb3           \cf6 </\cf4 section\cf6 >\cf4 \cb1 \
\cb3         \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3       \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3     \cf6 );\cf4 \cb1 \
\cb3   \cf6 \};\cf4 \cb1 \
\
\cb3   \cf2 \cb3 const\cf4 \cb3  renderProfile \cf6 =\cf4  \cf6 ()\cf4  \cf6 =>\cf4  \cf6 (\cf4 \cb1 \
\cb3     \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "flex-1 overflow-y-auto bg-slate-50 p-5"\cf6 \cb3 >\cf4 \cb1 \
\cb3       \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "bg-white rounded-3xl p-6 shadow-sm border flex flex-col items-center text-center mb-6"\cf6 \cb3 >\cf4 \cb1 \
\cb3         \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-5xl mb-4 border-4 border-white shadow-lg relative group"\cf6 \cb3 >\{\cf4 userData\cf6 .\cf4 avatar\cf6 \}<\cf4 button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  \cf6 \{\cf4  setEditForm\cf6 (\{\cf4  username\cf6 :\cf4  userData\cf6 .\cf4 username\cf6 ,\cf4  avatar\cf6 :\cf4  userData\cf6 .\cf4 avatar \cf6 \});\cf4  setShowEditProfileModal\cf6 (\cf2 \cb3 true\cf6 \cb3 );\cf4  \cf6 \}\}\cf4  className\cf6 =\cf7 \cb3 "absolute bottom-0 right-0 p-1.5 bg-orange-500 text-white rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"\cf4 \cb3 ><\cf5 \cb3 Edit\cf4 \cb3  size\cf6 =\{\cf10 \cb3 12\cf6 \cb3 \}\cf4  /></button></div\cf6 >\cf4 \cb1 \
\cb3         \cf6 <\cf4 h3 className\cf6 =\cf7 \cb3 "text-2xl font-black text-slate-800 flex items-center gap-2"\cf6 \cb3 >\{\cf4 userData\cf6 .\cf4 username\cf6 \}\cf4  \cf6 \{\cf4 userData\cf6 .\cf4 isVerified \cf6 &&\cf4  \cf6 <\cf5 \cb3 CheckCircle\cf4 \cb3  size\cf6 =\{\cf10 \cb3 20\cf6 \cb3 \}\cf4  className\cf6 =\cf7 \cb3 "text-blue-500"\cf4 \cb3  />\cf6 \}</\cf4 h3\cf6 >\cf4 \cb1 \
\cb3         \cf6 <\cf4 div className\cf6 =\{\cf7 \cb3 `mt-3 px-4 py-1.5 rounded-full border flex items-center gap-2 font-bold text-sm \cf6 \cb3 $\{\cf4 userTier\cf6 .\cf4 bg\cf6 \}\cf7 \cb3  \cf6 \cb3 $\{\cf4 userTier\cf6 .\cf4 color\cf6 \}\cf7 \cb3  \cf6 \cb3 $\{\cf4 userTier\cf6 .\cf4 border\cf6 \}\cf7 \cb3 `\cf6 \cb3 \}>\{\cf4 userTier\cf6 .\cf4 icon\cf6 \}\cf4  \cf6 \{\cf4 userTier\cf6 .\cf4 name\cf6 \}\cf4  \cf11 \cb3 \'95\cf4 \cb3  \cf6 \{\cf4 userData\cf6 .\cf4 points\cf6 \}\cf4  pts\cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3       \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3       \cf6 \{!\cf4 userData\cf6 .\cf4 isVerified \cf6 &&\cf4  \cf6 (\cf4 \cb1 \
\cb3         \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "bg-amber-50 rounded-3xl p-6 border border-amber-100 mb-6 flex flex-col"\cf4 \cb3 ><h4 className\cf6 =\cf7 \cb3 "font-black text-amber-900 text-lg mb-2"\cf6 \cb3 >\cf5 \cb3 Verify\cf4 \cb3  \cf5 \cb3 Account\cf6 \cb3 </\cf4 h4><p className\cf6 =\cf7 \cb3 "text-sm text-amber-800/80 mb-4"\cf6 \cb3 >\cf5 \cb3 Earn\cf4 \cb3  \cf6 +\cf10 \cb3 100\cf4 \cb3  \cf5 \cb3 Points\cf4 \cb3  instantly\cf6 .</\cf4 p><button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  setShowVerifyModal\cf6 (\cf2 \cb3 true\cf6 \cb3 )\}\cf4  className\cf6 =\cf7 \cb3 "py-3 bg-amber-500 text-white font-bold rounded-xl shadow-lg"\cf6 \cb3 >\cf5 \cb3 Verify\cf4 \cb3  \cf2 \cb3 with\cf4 \cb3  \cf5 \cb3 OTP\cf6 \cb3 </\cf4 button></div\cf6 >\cf4 \cb1 \
\cb3       \cf6 )\}\cf4 \cb1 \
\cb3       \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "grid grid-cols-2 gap-4"\cf4 \cb3 ><div className\cf6 =\cf7 \cb3 "bg-white p-5 rounded-3xl border"\cf4 \cb3 ><div className\cf6 =\cf7 \cb3 "text-slate-400 mb-1"\cf4 \cb3 ><\cf5 \cb3 Share2\cf4 \cb3  size\cf6 =\{\cf10 \cb3 24\cf6 \cb3 \}\cf4  /></div><div className\cf6 =\cf7 \cb3 "text-2xl font-black"\cf6 \cb3 >\{\cf4 userData\cf6 .\cf4 hacksCount \cf6 ||\cf4  \cf10 \cb3 0\cf6 \cb3 \}</\cf4 div><div className\cf6 =\cf7 \cb3 "text-xs font-bold text-slate-500"\cf6 \cb3 >\cf5 \cb3 Hacks\cf4 \cb3  \cf5 \cb3 Posted\cf6 \cb3 </\cf4 div></div><div className\cf6 =\cf7 \cb3 "bg-white p-5 rounded-3xl border"\cf4 \cb3 ><div className\cf6 =\cf7 \cb3 "text-green-500 mb-1 font-black text-2xl"\cf6 \cb3 >\cf11 \cb3 \uc0\u8369 \cf6 \cb3 </\cf4 div><div className\cf6 =\cf7 \cb3 "text-2xl font-black"\cf6 \cb3 >\cf10 \cb3 0\cf6 \cb3 </\cf4 div><div className\cf6 =\cf7 \cb3 "text-xs font-bold text-slate-500"\cf6 \cb3 >\cf5 \cb3 Total\cf4 \cb3  \cf5 \cb3 Savings\cf6 \cb3 </\cf4 div></div></div\cf6 >\cf4 \cb1 \
\cb3     \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3   \cf6 );\cf4 \cb1 \
\
\cb3   \cf2 \cb3 const\cf4 \cb3  renderPro \cf6 =\cf4  \cf6 ()\cf4  \cf6 =>\cf4  \cf6 (\cf4 \cb1 \
\cb3     \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "flex-1 overflow-y-auto bg-slate-900 text-white p-6 relative overflow-hidden"\cf6 \cb3 >\cf4 \cb1 \
\cb3       \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "pt-8 mb-10"\cf4 \cb3 ><h2 className\cf6 =\cf7 \cb3 "text-4xl font-black mb-4"\cf6 \cb3 >\cf5 \cb3 Unlock\cf4 \cb3  \cf6 <\cf4 span className\cf6 =\cf7 \cb3 "text-orange-400"\cf6 \cb3 >\cf5 \cb3 PRO\cf6 \cb3 </\cf4 span></h2><p className\cf6 =\cf7 \cb3 "text-slate-400"\cf6 \cb3 >\cf5 \cb3 Get\cf4 \cb3  lifetime access to every secret hack\cf6 .</\cf4 p></div\cf6 >\cf4 \cb1 \
\cb3       \cf6 \{\cf4 userData\cf6 .\cf4 isPro \cf6 ?\cf4  \cf6 (\cf4 \cb1 \
\cb3         \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "bg-green-500/10 border border-green-500/30 rounded-3xl p-6 text-center"\cf4 \cb3 ><\cf5 \cb3 CheckCircle\cf4 \cb3  size\cf6 =\{\cf10 \cb3 48\cf6 \cb3 \}\cf4  className\cf6 =\cf7 \cb3 "text-green-400 mx-auto mb-4"\cf4 \cb3  /><h3 className\cf6 =\cf7 \cb3 "text-xl font-black"\cf6 \cb3 >\cf5 \cb3 You\cf4 \cb3  are \cf5 \cb3 PRO\cf6 \cb3 !</\cf4 h3></div\cf6 >\cf4 \cb1 \
\cb3       \cf6 )\cf4  \cf6 :\cf4  \cf6 (\cf4 \cb1 \
\cb3         \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "space-y-4 relative z-10"\cf6 \cb3 >\cf4 \cb1 \
\cb3           \cf6 <\cf4 button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  handleUpgradePro\cf6 (\cf7 \cb3 'pay'\cf6 \cb3 )\}\cf4  className\cf6 =\cf7 \cb3 "w-full bg-white text-slate-900 p-5 rounded-3xl font-black text-lg flex justify-between items-center shadow-lg"\cf4 \cb3 ><span\cf6 >\cf5 \cb3 Pay\cf4 \cb3  \cf5 \cb3 Once\cf6 \cb3 </\cf4 span><span className\cf6 =\cf7 \cb3 "bg-slate-900 text-white px-4 py-2 rounded-xl text-sm"\cf6 \cb3 >\cf11 \cb3 \uc0\u8369 \cf10 35.00\cf6 \cb3 </\cf4 span></button\cf6 >\cf4 \cb1 \
\cb3           \cf6 <\cf4 button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  handleUpgradePro\cf6 (\cf7 \cb3 'points'\cf6 \cb3 )\}\cf4  disabled\cf6 =\{\cf4 userData\cf6 .\cf4 points \cf6 <\cf4  \cf10 \cb3 1000\cf6 \cb3 \}\cf4  className\cf6 =\{\cf7 \cb3 `w-full p-5 rounded-3xl font-black text-lg flex justify-between items-center border-2 \cf6 \cb3 $\{\cf4 userData\cf6 .\cf4 points \cf6 >=\cf4  \cf10 \cb3 1000\cf4 \cb3  \cf6 ?\cf4  \cf7 \cb3 'bg-orange-500 border-orange-400 shadow-orange-500/20 shadow-xl'\cf4 \cb3  \cf6 :\cf4  \cf7 \cb3 'bg-slate-800 border-slate-700 text-slate-500'\cf6 \cb3 \}\cf7 \cb3 `\cf6 \cb3 \}\cf4 ><span\cf6 >\cf5 \cb3 Redeem\cf4 \cb3  \cf5 \cb3 Points\cf6 \cb3 </\cf4 span><span className\cf6 =\cf7 \cb3 "text-sm"\cf6 \cb3 >\cf10 \cb3 1\cf6 \cb3 ,\cf10 \cb3 000\cf4 \cb3  pts\cf6 </\cf4 span></button\cf6 >\cf4 \cb1 \
\cb3         \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3       \cf6 )\}\cf4 \cb1 \
\cb3     \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3   \cf6 );\cf4 \cb1 \
\
\cb3   \cf2 \cb3 return\cf4 \cb3  \cf6 (\cf4 \cb1 \
\cb3     \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "flex flex-col h-screen w-full bg-slate-100 max-w-md mx-auto relative overflow-hidden font-sans"\cf6 \cb3 >\cf4 \cb1 \
\cb3       \cf6 \{\cf4 activeView \cf6 ===\cf4  \cf7 \cb3 'main'\cf4 \cb3  \cf6 &&\cf4  renderHeader\cf6 ()\}\cf4 \cb1 \
\cb3       \cf6 <\cf4 main className\cf6 =\cf7 \cb3 "flex-1 flex flex-col relative overflow-hidden"\cf6 \cb3 >\cf4 \cb1 \
\cb3         \cf6 \{\cf4 activeView \cf6 ===\cf4  \cf7 \cb3 'restaurant'\cf4 \cb3  \cf6 &&\cf4  renderRestaurant\cf6 ()\}\cf4 \cb1 \
\cb3         \cf6 \{\cf4 activeView \cf6 ===\cf4  \cf7 \cb3 'main'\cf4 \cb3  \cf6 &&\cf4  \cf6 (\cf4 \cb1 \
\cb3           <>\cf6 \{\cf4 currentTab \cf6 ===\cf4  \cf7 \cb3 'map'\cf4 \cb3  \cf6 &&\cf4  renderMap\cf6 ()\}\{\cf4 currentTab \cf6 ===\cf4  \cf7 \cb3 'spots'\cf4 \cb3  \cf6 &&\cf4  renderSpots\cf6 ()\}\{\cf4 currentTab \cf6 ===\cf4  \cf7 \cb3 'profile'\cf4 \cb3  \cf6 &&\cf4  renderProfile\cf6 ()\}\{\cf4 currentTab \cf6 ===\cf4  \cf7 \cb3 'pro'\cf4 \cb3  \cf6 &&\cf4  renderPro\cf6 ()\}\cf4 </>\cb1 \
\cb3         \cf6 )\}\cf4 \cb1 \
\cb3       \cf6 </\cf4 main\cf6 >\cf4 \cb1 \
\cb3       \cf6 \{\cf4 activeView \cf6 ===\cf4  \cf7 \cb3 'main'\cf4 \cb3  \cf6 &&\cf4  renderTabBar\cf6 ()\}\cf4 \cb1 \
\cb3       \cf6 \{\cf4 toast \cf6 &&\cf4  \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "fixed top-20 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-5 py-2.5 rounded-full shadow-2xl z-[200] flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4"\cf4 \cb3 ><\cf5 \cb3 Info\cf4 \cb3  size\cf6 =\{\cf10 \cb3 16\cf6 \cb3 \}\cf4  className\cf6 =\cf7 \cb3 "text-orange-400"\cf4 \cb3  /><p className\cf6 =\cf7 \cb3 "font-bold text-sm"\cf6 \cb3 >\{\cf4 toast\cf6 \}</\cf4 p></div\cf6 >\}\cf4 \cb1 \
\cb3       \cf6 \{\cf4 showVerifyModal \cf6 &&\cf4  \cf6 (\cf4 \cb1 \
\cb3         \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in"\cf4 \cb3 ><div className\cf6 =\cf7 \cb3 "bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative"\cf4 \cb3 ><button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  setShowVerifyModal\cf6 (\cf2 \cb3 false\cf6 \cb3 )\}\cf4  className\cf6 =\cf7 \cb3 "absolute top-6 right-6 p-2 rounded-full"\cf4 \cb3 ><\cf5 \cb3 X\cf4 \cb3  size\cf6 =\{\cf10 \cb3 20\cf6 \cb3 \}\cf4  /></button><h3 className\cf6 =\cf7 \cb3 "text-2xl font-black text-center mb-8"\cf6 \cb3 >\cf5 \cb3 Verify\cf4 \cb3  \cf5 \cb3 Account\cf6 \cb3 </\cf4 h3><form onSubmit\cf6 =\{\cf4 handleVerifyOTP\cf6 \}\cf4  className\cf6 =\cf7 \cb3 "space-y-6"\cf4 \cb3 ><input \cf2 \cb3 type\cf6 \cb3 =\cf7 \cb3 "text"\cf4 \cb3  maxLength\cf6 =\{\cf10 \cb3 4\cf6 \cb3 \}\cf4  value\cf6 =\{\cf4 otpInput\cf6 \}\cf4  onChange\cf6 =\{(\cf4 e\cf6 )\cf4  \cf6 =>\cf4  setOtpInput\cf6 (\cf4 e\cf6 .\cf4 target\cf6 .\cf4 value\cf6 .\cf4 replace\cf6 (\cf9 \cb3 /\\D/\cf2 g\cf6 \cb3 ,\cf4  \cf7 \cb3 ''\cf6 \cb3 ))\}\cf4  className\cf6 =\cf7 \cb3 "w-full text-center text-3xl tracking-[1em] font-black bg-slate-50 py-4 rounded-2xl outline-none border focus:ring-4 focus:ring-blue-500/10"\cf4 \cb3  placeholder\cf6 =\cf7 \cb3 "\'95\'95\'95\'95"\cf4 \cb3  /><button \cf2 \cb3 type\cf6 \cb3 =\cf7 \cb3 "submit"\cf4 \cb3  className\cf6 =\cf7 \cb3 "w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg"\cf6 \cb3 >\cf5 \cb3 Confirm\cf4 \cb3  \cf5 \cb3 OTP\cf6 \cb3 </\cf4 button><p className\cf6 =\cf7 \cb3 "text-center text-xs font-bold text-slate-400"\cf6 \cb3 >\cf5 \cb3 Hint\cf6 \cb3 :\cf4  \cf5 \cb3 Use\cf4 \cb3  code \cf10 \cb3 1234\cf6 \cb3 </\cf4 p></form></div></div\cf6 >\cf4 \cb1 \
\cb3       \cf6 )\}\cf4 \cb1 \
\cb3       \cf6 \{\cf4 showAddHackModal \cf6 &&\cf4  \cf6 (\cf4 \cb1 \
\cb3         \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in"\cf4 \cb3 ><div className\cf6 =\cf7 \cb3 "bg-white w-full max-w-md sm:rounded-[32px] rounded-t-[32px] p-6 pt-8 shadow-2xl relative max-h-[90vh] flex flex-col animate-in slide-in-from-bottom"\cf4 \cb3 ><button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  setShowAddHackModal\cf6 (\cf2 \cb3 false\cf6 \cb3 )\}\cf4  className\cf6 =\cf7 \cb3 "absolute top-6 right-6 p-2 rounded-full"\cf4 \cb3 ><\cf5 \cb3 X\cf4 \cb3  size\cf6 =\{\cf10 \cb3 20\cf6 \cb3 \}\cf4  /></button><h3 className\cf6 =\cf7 \cb3 "text-2xl font-black mb-6"\cf6 \cb3 >\cf5 \cb3 Share\cf4 \cb3  a \cf5 \cb3 Hack\cf6 \cb3 </\cf4 h3><form onSubmit\cf6 =\{\cf4 submitHack\cf6 \}\cf4  className\cf6 =\cf7 \cb3 "space-y-4"\cf4 \cb3 ><div><label className\cf6 =\cf7 \cb3 "text-xs font-bold text-slate-500 uppercase"\cf6 \cb3 >\cf5 \cb3 Title\cf6 \cb3 </\cf4 label><input required name\cf6 =\cf7 \cb3 "title"\cf4 \cb3  className\cf6 =\cf7 \cb3 "w-full bg-slate-50 px-4 py-3.5 rounded-2xl font-bold border"\cf4 \cb3  /></div><div><label className\cf6 =\cf7 \cb3 "text-xs font-bold text-slate-500 uppercase"\cf6 \cb3 >\cf5 \cb3 Description\cf6 \cb3 </\cf4 label><textarea required name\cf6 =\cf7 \cb3 "desc"\cf4 \cb3  rows\cf6 =\{\cf10 \cb3 3\cf6 \cb3 \}\cf4  className\cf6 =\cf7 \cb3 "w-full bg-slate-50 px-4 py-3.5 rounded-2xl border"\cf4 \cb3 ></textarea></div><div><label className\cf6 =\cf7 \cb3 "text-xs font-bold text-slate-500 uppercase"\cf6 \cb3 >\cf5 \cb3 Savings\cf4 \cb3  \cf6 (\cf11 \cb3 \uc0\u8369 \cf6 \cb3 )</\cf4 label><input required name\cf6 =\cf7 \cb3 "savings"\cf4 \cb3  \cf2 \cb3 type\cf6 \cb3 =\cf7 \cb3 "number"\cf4 \cb3  className\cf6 =\cf7 \cb3 "w-full bg-slate-50 px-4 py-3.5 rounded-2xl font-black border"\cf4 \cb3  /></div><button \cf2 \cb3 type\cf6 \cb3 =\cf7 \cb3 "submit"\cf4 \cb3  className\cf6 =\cf7 \cb3 "w-full py-4 bg-orange-500 text-white font-black rounded-xl shadow-lg"\cf6 \cb3 >\cf5 \cb3 Submit\cf4 \cb3  \cf6 &\cf4  \cf5 \cb3 Earn\cf4 \cb3  \cf6 +\cf10 \cb3 50\cf4 \cb3  \cf5 \cb3 Pts\cf6 \cb3 </\cf4 button></form></div></div\cf6 >\cf4 \cb1 \
\cb3       \cf6 )\}\cf4 \cb1 \
\cb3       \cf6 \{\cf4 showEditProfileModal \cf6 &&\cf4  \cf6 (\cf4 \cb1 \
\cb3         \cf6 <\cf4 div className\cf6 =\cf7 \cb3 "fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in"\cf4 \cb3 ><div className\cf6 =\cf7 \cb3 "bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative animate-in zoom-in-95"\cf4 \cb3 ><button onClick\cf6 =\{()\cf4  \cf6 =>\cf4  setShowEditProfileModal\cf6 (\cf2 \cb3 false\cf6 \cb3 )\}\cf4  className\cf6 =\cf7 \cb3 "absolute top-6 right-6 p-2 rounded-full"\cf4 \cb3 ><\cf5 \cb3 X\cf4 \cb3  size\cf6 =\{\cf10 \cb3 20\cf6 \cb3 \}\cf4  /></button><h3 className\cf6 =\cf7 \cb3 "text-2xl font-black mb-6"\cf6 \cb3 >\cf5 \cb3 Edit\cf4 \cb3  \cf5 \cb3 Profile\cf6 \cb3 </\cf4 h3><form onSubmit\cf6 =\{\cf4 handleUpdateProfile\cf6 \}\cf4  className\cf6 =\cf7 \cb3 "space-y-4"\cf4 \cb3 ><div><label className\cf6 =\cf7 \cb3 "text-xs font-bold text-slate-500 uppercase"\cf6 \cb3 >\cf5 \cb3 Username\cf6 \cb3 </\cf4 label><input required value\cf6 =\{\cf4 editForm\cf6 .\cf4 username\cf6 \}\cf4  onChange\cf6 =\{(\cf4 e\cf6 )\cf4  \cf6 =>\cf4  setEditForm\cf6 (\cf4 prev \cf6 =>\cf4  \cf6 (\{\cf4  \cf6 ...\cf4 prev\cf6 ,\cf4  username\cf6 :\cf4  e\cf6 .\cf4 target\cf6 .\cf4 value \cf6 \}))\}\cf4  className\cf6 =\cf7 \cb3 "w-full bg-slate-50 px-4 py-3.5 rounded-2xl font-bold border"\cf4 \cb3  /></div><div className\cf6 =\cf7 \cb3 "grid grid-cols-5 gap-2"\cf6 \cb3 >\{[\cf7 \cb3 '
\f1 \uc0\u55357 \u56420 
\f0 '\cf6 \cb3 ,\cf4  \cf7 \cb3 '
\f1 \uc0\u55356 \u57172 
\f0 '\cf6 \cb3 ,\cf4  \cf7 \cb3 '
\f1 \uc0\u55356 \u57173 
\f0 '\cf6 \cb3 ,\cf4  \cf7 \cb3 '
\f1 \uc0\u55356 \u57175 
\f0 '\cf6 \cb3 ,\cf4  \cf7 \cb3 '
\f1 \uc0\u55356 \u57183 
\f0 '\cf6 \cb3 ,\cf4  \cf7 \cb3 '
\f1 \uc0\u55358 \u56779 
\f0 '\cf6 \cb3 ,\cf4  \cf7 \cb3 '\uc0\u9749 '\cf6 \cb3 ,\cf4  \cf7 \cb3 '
\f1 \uc0\u55356 \u57193 
\f0 '\cf6 \cb3 ,\cf4  \cf7 \cb3 '
\f1 \uc0\u55356 \u57134 
\f0 '\cf6 \cb3 ,\cf4  \cf7 \cb3 '
\f1 \uc0\u55356 \u57190 
\f0 '\cf6 \cb3 ].\cf4 map\cf6 (\cf4 emoji \cf6 =>\cf4  \cf6 (<\cf4 button key\cf6 =\{\cf4 emoji\cf6 \}\cf4  \cf2 \cb3 type\cf6 \cb3 =\cf7 \cb3 "button"\cf4 \cb3  onClick\cf6 =\{()\cf4  \cf6 =>\cf4  setEditForm\cf6 (\cf4 prev \cf6 =>\cf4  \cf6 (\{\cf4  \cf6 ...\cf4 prev\cf6 ,\cf4  avatar\cf6 :\cf4  emoji \cf6 \}))\}\cf4  className\cf6 =\{\cf7 \cb3 `text-2xl p-2 rounded-xl border transition-all \cf6 \cb3 $\{\cf4 editForm\cf6 .\cf4 avatar \cf6 ===\cf4  emoji \cf6 ?\cf4  \cf7 \cb3 'bg-orange-100 border-orange-500 scale-110'\cf4 \cb3  \cf6 :\cf4  \cf7 \cb3 'bg-slate-50'\cf6 \cb3 \}\cf7 \cb3 `\cf6 \cb3 \}>\{\cf4 emoji\cf6 \}</\cf4 button\cf6 >))\}</\cf4 div><button \cf2 \cb3 type\cf6 \cb3 =\cf7 \cb3 "submit"\cf4 \cb3  className\cf6 =\cf7 \cb3 "w-full py-4 bg-orange-500 text-white font-black rounded-xl"\cf6 \cb3 >\cf5 \cb3 Save\cf4 \cb3  \cf5 \cb3 Changes\cf6 \cb3 </\cf4 button></form></div></div\cf6 >\cf4 \cb1 \
\cb3       \cf6 )\}\cf4 \cb1 \
\cb3     \cf6 </\cf4 div\cf6 >\cf4 \cb1 \
\cb3   \cf6 );\cf4 \cb1 \
\cf6 \cb3 \}\cf4 \cb1 \
\pard\pardeftab720\partightenfactor0
\cf8 \cb3 /** @type \{import('tailwindcss').Config\} */\cf4 \cb1 \
\cf2 \cb3 export\cf4 \cb3  \cf2 \cb3 default\cf4 \cb3  \cf6 \cb3 \{\cf4 \cb1 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3   content\cf6 \cb3 :\cf4 \cb3  \cf6 \cb3 [\cf4 \cb1 \
\cb3     \cf7 \cb3 "./index.html"\cf6 ,\cf4 \cb1 \
\cb3     \cf7 \cb3 "./src/**/*.\{js,ts,jsx,tsx\}"\cf6 ,\cf4 \cb1 \
\cb3   \cf6 \cb3 ],\cf4 \cb1 \
\cb3   theme\cf6 \cb3 :\cf4 \cb3  \cf6 \cb3 \{\cf4 \cb1 \
\cb3     extend\cf6 \cb3 :\cf4 \cb3  \cf6 \cb3 \{\},\cf4 \cb1 \
\cb3   \cf6 \cb3 \},\cf4 \cb1 \
\cb3   plugins\cf6 \cb3 :\cf4 \cb3  \cf6 \cb3 [],\cf4 \cb1 \
\pard\pardeftab720\partightenfactor0
\cf6 \cb3 \}\cf4 \cb1 \
}