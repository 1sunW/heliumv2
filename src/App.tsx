import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MOVIES, ANIME_DATA, TV_SHOWS, PROXY_GROUPS, BOOKS, MANGA, WINDOWS_APPS, GIMKIT_HACKS, PARTNERS, type ContentItem, type ProxyGroup, type Partner } from './data';
import { 
  Coffee, 
  Search, 
  Menu, 
  Play, 
  Info, 
  X, 
  Heart, 
  Star,
  Clock,
  ChevronRight,
  Sparkles,
  Gamepad2,
  Tv,
  Music as MusicIcon,
  BookOpen,
  Zap,
  Layers,
  Home as HomeIcon,
  Ghost,
  Shield,
  ExternalLink,
  Globe,
  Check,
  CheckCircle2,
  MessageSquare,
  Wind,
  Activity,
  Maximize2,
  Minimize2
} from 'lucide-react';
import GamesEmbed from './components/GamesEmbed';
import airChatHtml from './components/AirChat.html?raw';
import hydrogenChatHtml from './components/HydrogenChat.html?raw';
import eaglercraftHtml from './components/Eaglercraft.html?raw';

type CategoryType = 'Home' | 'Movies' | 'Games' | 'Anime' | 'Proxies' | 'Music' | 'TV Shows' | 'Books' | 'Hacks' | 'Extra';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('Home');
  const [selectedMovie, setSelectedMovie] = useState<ContentItem | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<'discovery' | 'watchlist' | 'library'>('discovery');
  const [libraryIds, setLibraryIds] = useState<string[]>([]);
  const [watchedIds, setWatchedIds] = useState<string[]>([]);
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnimeGroupsExpanded, setIsAnimeGroupsExpanded] = useState(false);
  const [isAirChatOpen, setIsAirChatOpen] = useState(false);
  const [isAirChatFullscreen, setIsAirChatFullscreen] = useState(false);
  const [isHydrogenChatOpen, setIsHydrogenChatOpen] = useState(false);
  const [isHydrogenChatFullscreen, setIsHydrogenChatFullscreen] = useState(false);
  const [isEaglercraftOpen, setIsEaglercraftOpen] = useState(false);
  const [isEaglercraftFullscreen, setIsEaglercraftFullscreen] = useState(false);

  // Laptop Apps state
  const [laptopSection, setLaptopSection] = useState<'working' | 'pending' | 'info' | 'methods'>('working');
  const [activeMethod, setActiveMethod] = useState<{ title: string, steps: string[] } | null>(null);
  const [activeExtra, setActiveExtra] = useState<{ title: string, content?: string, list?: string[], subtext?: string, partners?: Partner[] } | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const LAPTOP_METHODS = [
    { 
      title: "Starting Method", 
      steps: [
        "1. Open Terminal.", 
        "2. Click the Down Arrow at the top of the screen.", 
        "3. Click 'Command Prompt'.", 
        "4. Type the following commands: 'cd C:/Windows/Temp' and 'mkdir secret'",
        "5. Open File Explorer.",
        "6. At the top path bar, type: 'C:/Windows/Temp/secret'",
        "7. Click the 3 dots and click 'Pin to Quick Access'.",
        "8. Drag any executable file or game into the folder to run it."
      ] 
    },
    { 
      title: "Backup Method", 
      steps: [
        "1. Open the noadmin.bat link from the library (Search for it or check Google Drive).",
        "2. Drag and drop any file and it will run as admin (Must be in secret folder).", 
      ] 
    }
  ];

  const handleCategorySelect = (category: CategoryType) => {
    setActiveCategory(category);
    if ((activeView === 'library' || activeView === 'watchlist') && category !== 'Movies' && category !== 'Anime' && category !== 'TV Shows' && category !== 'Books' && category !== 'Hacks') {
      setActiveView('discovery');
    }
  };


  const featuredMovie = MOVIES[0];

  const handleWatch = (movie: ContentItem) => {
    setClickCounts(prev => ({
      ...prev,
      [movie.id]: (prev[movie.id] || 0) + 1
    }));
    
    // Open the drive link if it exists, otherwise fallback to a search
    const link = movie.driveLink || `https://www.google.com/search?q=${encodeURIComponent(movie.title)}+google+drive+link`;
    window.open(link, '_blank');
    console.log(`Opening ${movie.title} link...`);
  };

  const toggleLibrary = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLibraryIds(prev => 
      prev.includes(id) ? prev.filter(libId => libId !== id) : [...prev, id]
    );
  };

  const toggleWatched = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWatchedIds(prev => 
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  const normalizedAnime = ANIME_DATA.map(item => ({
    id: item.id || '',
    title: item.title || 'Unknown',
    description: item.description,
    year: item.year,
    rating: item.rating,
    duration: item.duration,
    genre: item.genre || [],
    image: item.image || (item as any).imageUrl || '',
    mood: item.mood,
    type: 'anime',
    driveLink: item.driveLink || (item as any).link || '',
    links: item.links
  }));

  const allItems = [...MOVIES, ...normalizedAnime, ...TV_SHOWS, ...BOOKS, ...MANGA, ...WINDOWS_APPS, ...GIMKIT_HACKS];

  const displayedItems = activeView === 'watchlist' 
    ? allItems.filter(m => libraryIds.includes(m.id))
    : activeView === 'library'
      ? allItems.filter(m => watchedIds.includes(m.id))
      : activeCategory === 'Movies' 
        ? allItems.filter(item => item.type === 'movie')
        : activeCategory === 'Anime' 
          ? allItems.filter(item => item.type === 'anime')
          : activeCategory === 'TV Shows'
            ? allItems.filter(item => item.type === 'tv')
            : activeCategory === 'Books'
              ? [...BOOKS, ...MANGA]
              : activeCategory === 'Hacks'
                ? [...WINDOWS_APPS, ...GIMKIT_HACKS]
                : [];

  const filteredItems = displayedItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories: CategoryType[] = ['Home', 'Movies', 'Games', 'Anime', 'TV Shows', 'Proxies', 'Music', 'Books', 'Hacks', 'Extra'];

  const ANIME_REQUIRED_GROUPS = [
    { name: "Group 1", url: "https://www.google.com/url?q=https%3A%2F%2Ftinyurl.com%2F9yh733xs&sa=D&sntz=1&usg=AOvVaw2_LO0xJ384oc9NVIw5zKBc" },
    { name: "Group 2", url: "https://groups.google.com/g/itskayoanime/c/1-5fT7wPz58" },
    { name: "Group 3", url: "https://groups.google.com/g/kayoanime-detective/c/O9AE3S1zY34" },
    { name: "Group 4", url: "https://groups.google.com/g/kayoanimemyheroacademia/c/vYYRJh528Yo" },
    { name: "Group 5", url: "https://groups.google.com/g/kayoanimemembers/c/NJchOgztO1w" },
    { name: "Group 6", url: "https://groups.google.com/g/itskayoanime/c/1-5fT7wPz58" },
    { name: "Group 7", url: "https://groups.google.com/g/kayoanimemembers/c/NJchOgztO1w" },
  ];

  const renderMovieCard = (item: ContentItem | any, index: number) => (
    <motion.div
      key={item.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => {
        setSelectedMovie(item.type ? item : {
          ...item,
          image: item.image || (item as any).imageUrl || '',
          driveLink: item.driveLink || (item as any).link || '',
          rating: item.rating && item.rating !== 'N/A' ? item.rating : undefined,
          duration: item.duration && item.duration !== 'N/A' ? item.duration : undefined,
          year: item.year && item.year !== 'N/A' ? item.year : undefined,
          genre: item.genre || [],
          description: item.description || '',
          mood: item.mood || 'N/A',
          type: 'anime' as const
        });
      }}
      className="group cursor-pointer"
    >
      <div className="aspect-[3/4] rounded-2xl bg-imm-card border border-imm-border mb-3 overflow-hidden relative movie-card-hover">
        <img src={item.image || item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex items-end justify-between p-4 transition-opacity ${libraryIds.includes(item.id) || watchedIds.includes(item.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="flex flex-col gap-1 text-white">
            <div className="flex items-center gap-2 text-xs font-bold">
              {item.rating && item.rating !== 'N/A' && (
                <>
                  <Star className="w-3 h-3 text-imm-accent fill-current" /> {item.rating} Rating
                </>
              )}
            </div>
            {clickCounts[item.id] > 0 && (
              <div className="text-[10px] opacity-70 underline decoration-imm-accent/40">{clickCounts[item.id]} focus visits</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button 
              title={libraryIds.includes(item.id) ? "Remove from Watchlist" : "Add to Watchlist"}
              onClick={(e) => toggleLibrary(item.id, e)}
              className={`p-2 rounded-full ${libraryIds.includes(item.id) ? 'bg-imm-accent text-black' : 'bg-black/60 text-white hover:bg-imm-accent hover:text-black'} backdrop-blur-md transition-colors border border-white/10`}
            >
              <Heart className={`w-4 h-4 ${libraryIds.includes(item.id) ? 'fill-current' : ''}`} />
            </button>
            {(activeView === 'library' || activeView === 'watchlist') && (
              <button
                title={watchedIds.includes(item.id) ? "Mark as Unwatched" : "Mark as Watched"}
                onClick={(e) => toggleWatched(item.id, e)}
                className={`p-2 rounded-full ${watchedIds.includes(item.id) ? 'bg-green-500/90 text-white' : 'bg-black/60 text-white hover:bg-green-500 hover:text-white'} backdrop-blur-md transition-colors border border-white/10`}
              >
                {watchedIds.includes(item.id) ? <CheckCircle2 className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="text-sm font-semibold group-hover:text-imm-accent transition-colors flex items-center justify-between">
        <span className="truncate pr-2">{item.title}</span>
        {watchedIds.includes(item.id) && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
      </div>
      <div className="text-xs opacity-50 mt-0.5">
        {[item.duration, item.year].filter(v => v && v !== 'N/A').join(' • ')}
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col h-screen w-screen border-imm-border border-8 box-border overflow-hidden selection:bg-imm-accent/30 bg-imm-bg">
      {/* Top Category Bar */}
      <div className={`bg-imm-sidebar border-b border-imm-border shrink-0 flex items-center px-6 overflow-x-auto no-scrollbar py-3 gap-8 z-50 transition-opacity duration-300 ${selectedMovie || activeMethod || activeExtra ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="mr-6 shrink-0">
          <img src="https://raw.githubusercontent.com/1sunW/ICONS-FOR-LINKS/refs/heads/main/Helium-Logo.png" alt="Helium" className="h-12 w-auto" />
        </div>
        <div className="flex items-center gap-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap px-1 py-1 border-b-2 ${activeCategory === cat ? 'text-imm-accent border-imm-accent font-bold' : 'text-imm-text/40 border-transparent hover:text-imm-text/80'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Navigation (Context Sensitive) */}
        {(activeCategory === 'Movies' || activeCategory === 'Anime' || activeCategory === 'TV Shows' || activeCategory === 'Books' || activeCategory === 'Hacks') && (
          <aside className="hidden lg:flex w-64 bg-imm-sidebar border-r border-imm-border flex-col p-8 z-20">
            <div className="flex items-center gap-3 mb-10">
              <span className="text-[10px] uppercase tracking-widest text-imm-accent/60 font-bold">Navigation</span>
            </div>
            
            <nav className="flex-1 space-y-8 text-xs uppercase tracking-[0.2em] text-imm-text/60">
              <ul className="space-y-4">
                <li 
                  className={`cursor-pointer transition-colors flex items-center gap-3 ${activeView === 'discovery' ? 'text-imm-accent font-semibold' : 'hover:text-imm-text'}`}
                  onClick={() => setActiveView('discovery')}
                >
                  <HomeIcon className="w-4 h-4" /> Discovery
                </li>
                <li 
                  className={`cursor-pointer transition-colors flex items-center gap-3 ${activeView === 'watchlist' ? 'text-imm-accent font-semibold' : 'hover:text-imm-text'}`}
                  onClick={() => setActiveView('watchlist')}
                >
                  <Heart className="w-4 h-4" /> My Watchlist ({libraryIds.length})
                </li>
                <li 
                  className={`cursor-pointer transition-colors flex items-center gap-3 ${activeView === 'library' ? 'text-imm-accent font-semibold' : 'hover:text-imm-text'}`}
                  onClick={() => setActiveView('library')}
                >
                  <CheckCircle2 className="w-4 h-4" /> My Library ({watchedIds.length})
                </li>
              </ul>
              
              <div className="h-px bg-imm-border w-full"></div>
              
              <ul className="space-y-4">
              </ul>
            </nav>

            <div className="mt-auto p-4 rounded-2xl bg-imm-card border border-imm-border">
              <div className="text-[10px] text-imm-accent uppercase tracking-widest mb-1 font-bold">System Status</div>
              <div className="text-[10px] text-imm-text/60 tracking-wider">All systems operational</div>
            </div>
          </aside>
        )}

        <main className="flex-1 flex flex-col relative overflow-y-auto bg-imm-bg">
          {/* Amber Glow background effect */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-imm-accent/10 rounded-full blur-[150px] pointer-events-none"></div>

          {/* Air Chat Modal */}
          {isAirChatOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 ${isAirChatFullscreen ? "!p-0" : ""}`}
              onClick={() => { setIsAirChatOpen(false); setIsAirChatFullscreen(false); }}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                onClick={e => e.stopPropagation()}
                className={`bg-imm-bg border border-imm-border rounded-3xl overflow-hidden shadow-2xl relative ${isAirChatFullscreen ? "!rounded-none !w-screen !h-screen" : "w-[90vw] max-w-4xl h-[80vh] max-h-[700px]"}`}
              >
                <button 
                  className="absolute top-4 right-4 z-50 bg-imm-sidebar text-imm-text p-2 rounded-full border border-imm-border hover:bg-imm-accent hover:text-black transition-all"
                  onClick={() => setIsAirChatFullscreen(!isAirChatFullscreen)}
                >
                  {isAirChatFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                  <iframe 
                    srcDoc={airChatHtml}
                    className="w-full h-full border-none"
                    title="Air Chat"
                  />
              </motion.div>
            </motion.div>
          )}

          {/* Hydrogen Chat Modal */}
          {isHydrogenChatOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 ${isHydrogenChatFullscreen ? "!p-0" : ""}`}
              onClick={() => { setIsHydrogenChatOpen(false); setIsHydrogenChatFullscreen(false); }}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                onClick={e => e.stopPropagation()}
                className={`bg-imm-bg border border-imm-border rounded-3xl overflow-hidden shadow-2xl relative ${isHydrogenChatFullscreen ? "!rounded-none !w-screen !h-screen" : "w-[90vw] max-w-4xl h-[80vh] max-h-[700px]"}`}
              >
                <button 
                  className="absolute top-4 right-4 z-50 bg-imm-sidebar text-imm-text p-2 rounded-full border border-imm-border hover:bg-imm-accent hover:text-black transition-all"
                  onClick={() => setIsHydrogenChatFullscreen(!isHydrogenChatFullscreen)}
                >
                  {isHydrogenChatFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                  <iframe 
                    srcDoc={hydrogenChatHtml}
                    className="w-full h-full border-none"
                    title="Hydrogen Chat"
                  />
              </motion.div>
            </motion.div>
          )}

          {/* Eaglercraft Modal */}
          {isEaglercraftOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 ${isEaglercraftFullscreen ? "!p-0" : ""}`}
              onClick={() => { setIsEaglercraftOpen(false); setIsEaglercraftFullscreen(false); }}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                onClick={e => e.stopPropagation()}
                className={`bg-imm-bg border border-imm-border rounded-3xl overflow-hidden shadow-2xl relative ${isEaglercraftFullscreen ? "!rounded-none !w-screen !h-screen" : "w-[90vw] max-w-4xl h-[80vh] max-h-[700px]"}`}
              >
                <button 
                  className="absolute top-4 right-4 z-50 bg-imm-sidebar text-imm-text p-2 rounded-full border border-imm-border hover:bg-imm-accent hover:text-black transition-all"
                  onClick={() => setIsEaglercraftFullscreen(!isEaglercraftFullscreen)}
                >
                  {isEaglercraftFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                  <iframe 
                    srcDoc={eaglercraftHtml}
                    className="w-full h-full border-none"
                    title="Eaglercraft"
                  />
              </motion.div>
            </motion.div>
          )}

          {/* Header */}
          <header className={`h-20 shrink-0 px-6 lg:px-10 flex items-center justify-between border-b border-imm-border z-[100] sticky top-0 bg-imm-bg/95 backdrop-blur-md shadow-sm transition-opacity duration-300 ${selectedMovie || activeMethod || activeExtra ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex items-center gap-4">
              <h2 className="serif text-xl tracking-wide">{activeCategory} View</h2>
              
            {activeCategory === 'Movies' && (
                <div className="flex items-center gap-3 ml-4">
                  <select 
                    value={activeView} 
                    onChange={(e) => setActiveView(e.target.value as 'discovery' | 'watchlist' | 'library')}
                    className="bg-imm-card border border-imm-border text-imm-text text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg focus:outline-none focus:border-imm-accent"
                  >
                    <option value="discovery">Discovery</option>
                    <option value="watchlist">Watchlist</option>
                    <option value="library">Library</option>
                  </select>
                </div>
              )}
            </div>

            <div className="relative flex-1 max-w-md mx-6">
              <Search className="absolute inset-y-0 left-0 pl-3 flex items-center h-full w-4 h-4 text-imm-text/40 pointer-events-none" />
              <input 
                type="text" 
                placeholder={`Search ${activeCategory === 'Home' ? 'everything' : activeCategory.toLowerCase()}...`} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-imm-card border border-imm-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-imm-accent transition-colors text-imm-text"
              />
            </div>

            <div className="flex items-center gap-4">
              <a 
                href="https://discord.gg/3KDAKzBDg4"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border-2 border-[#5865F2]/50 p-0.5 flex items-center justify-center bg-gradient-to-br from-[#5865F2] to-[#4c1d95] hover:scale-105 hover:border-[#5865F2] transition-all cursor-pointer"
                aria-label="Join Discord Server"
              >
                <i className="fa-brands fa-discord text-white text-lg"></i>
              </a>
            </div>
          </header>

          <div className={`flex-1 flex flex-col gap-10 ${activeCategory === 'Games' ? '' : 'p-6 lg:p-10'}`}>
            {activeCategory === 'Home' && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* Welcome Card */}
                <div className="col-span-full bg-imm-card border border-imm-border p-12 rounded-[2.5rem] relative overflow-hidden glow-amber mb-4">
                  <div className="relative z-10 max-w-2xl">
                    <h1 className="serif text-6xl mb-6 text-white italic tracking-tight">Helium Awaits.</h1>
                    <p className="text-imm-text/70 text-lg font-light leading-relaxed mb-8">
                      Welcome to Helium, everything for everyone.
                    </p>
                    <button 
                      onClick={() => handleCategorySelect('Movies')}
                      className="bg-imm-accent text-black px-10 py-4 rounded-full font-bold text-sm hover:bg-imm-accent-hover transition-all"
                    >
                      Start Exploring
                    </button>
                  </div>
                  <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Zap className="w-64 h-64" />
                  </div>
                </div>

                {/* Sub-Category Cards */}
                {[
                  { name: 'Movies', icon: Play, count: MOVIES.length, desc: 'Watch amazing films.' },
                  { name: 'Games', icon: Gamepad2, count: 0, desc: 'Explore different perspectives.' },
                  { name: 'Anime', icon: Sparkles, count: ANIME_DATA.length, desc: 'Watch your favorite animated films.' },
                  { name: 'Proxies', icon: Layers, count: 0, desc: 'Surf the web securly.' },
                  { name: 'Music', icon: MusicIcon, count: 0, desc: 'Listen to your favorite jams.' },
                  { name: 'TV Shows', icon: Tv, count: TV_SHOWS.length, desc: 'View episodic adventures.' },
                  { name: 'Extra', icon: Ghost, count: 0, desc: 'Portals to different worlds.' }
                ].map((item) => (
                  <div 
                    key={item.name}
                    onClick={() => handleCategorySelect(item.name as CategoryType)}
                    className="group bg-imm-sidebar border border-imm-border p-8 rounded-[2rem] hover:border-imm-accent transition-all cursor-pointer"
                  >
                    <item.icon className="w-8 h-8 text-imm-accent mb-6 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <h3 className="serif text-2xl mb-2 text-white">{item.name}</h3>
                    <p className="text-xs text-imm-text/40 italic">{item.desc}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {(activeCategory === 'Movies' || activeCategory === 'Anime' || activeCategory === 'TV Shows' || (activeCategory === 'Books' && activeView !== 'discovery')) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-10">
                {/* Anime Required Groups */}
                {activeCategory === 'Anime' && activeView === 'discovery' && (
                  <section>
                    <button 
                      onClick={() => setIsAnimeGroupsExpanded(!isAnimeGroupsExpanded)}
                      className="w-full flex items-center justify-between p-6 bg-imm-card border border-imm-border rounded-2xl hover:border-imm-accent transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-imm-accent/10 rounded-xl group-hover:bg-imm-accent group-hover:text-black transition-colors">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <h3 className="serif text-xl italic font-bold text-white group-hover:text-imm-accent transition-colors">REQUIRED FOR ANIME</h3>
                          <p className="text-[10px] uppercase tracking-widest text-imm-text/40">Join these groups to bypass access restrictions</p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isAnimeGroupsExpanded ? 180 : 0 }}
                        className="text-imm-text/40"
                      >
                        <ChevronRight className="w-5 h-5 transform -rotate-90" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isAnimeGroupsExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-6">
                            {ANIME_REQUIRED_GROUPS.map((group, idx) => (
                              <motion.a
                                key={idx}
                                href={group.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center justify-between p-4 bg-imm-sidebar border border-imm-border rounded-xl hover:border-imm-accent hover:bg-imm-card transition-all group/btn"
                              >
                                <span className="text-xs font-bold uppercase tracking-wider text-imm-text/60 group-hover/btn:text-imm-accent">{group.name}</span>
                                <ExternalLink className="w-4 h-4 text-imm-text/20 group-hover/btn:text-imm-accent" />
                              </motion.a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>
                )}

                {/* Featured Spotlight (Only if Discovery) */}
                {activeView === 'discovery' && activeCategory === 'Movies' && (
                  <section className="relative h-72 shrink-0 rounded-3xl overflow-hidden border border-white/5 glow-amber">
                    <div className="absolute inset-0 bg-gradient-to-r from-imm-sidebar via-imm-sidebar/80 to-transparent z-10"></div>
                    <div className="absolute inset-0">
                      <img src={featuredMovie.image} alt={featuredMovie.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="relative z-20 h-full flex flex-col justify-center px-8 lg:px-12 max-w-xl">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-imm-accent mb-2 font-semibold flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> Featured Spotlight
                      </div>
                      <h1 className="serif text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white">{featuredMovie.title}</h1>
                      <p className="text-sm text-imm-text/70 mb-6 line-clamp-2 leading-relaxed font-light italic">{featuredMovie.description}</p>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => { handleWatch(featuredMovie); setSelectedMovie(featuredMovie); }}
                          className="bg-imm-accent text-black px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-imm-accent-hover transition-colors"
                        >
                          <Play className="h-4 w-4 fill-current" /> Open in Google Drive
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                {/* Watchlist Header */}
                {activeView === 'watchlist' && (
                  <section className="relative h-64 shrink-0 rounded-3xl overflow-hidden border border-white/5 bg-imm-sidebar flex items-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-imm-accent/10 to-transparent"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-gradient-to-l from-imm-card to-transparent opacity-50"></div>
                    <div className="relative z-20 px-8 lg:px-12 max-w-2xl">
                      <div className="flex items-center gap-4 mb-4">
                        <Heart className="w-8 h-8 text-imm-accent fill-current drop-shadow-lg" />
                        <h1 className="serif text-4xl lg:text-5xl font-bold text-white drop-shadow-md">My Watchlist</h1>
                      </div>
                      <p className="text-sm lg:text-base text-imm-text/80 leading-relaxed font-light italic mt-4 max-w-xl">
                        Your curated collection of cinematic universes, animated dreams, and episodic journeys you want to explore.
                      </p>
                      <div className="mt-8 flex gap-4">
                        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-imm-border text-xs text-white font-bold tracking-widest shadow-inner">
                          {libraryIds.length} {libraryIds.length === 1 ? 'TITLE' : 'TITLES'} SAVED
                        </div>
                      </div>
                    </div>
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 blur-xl pointer-events-none">
                      <Heart className="w-96 h-96 fill-current text-imm-accent" />
                    </div>
                  </section>
                )}

                {/* Library Header */}
                {activeView === 'library' && (
                  <section className="relative h-64 shrink-0 rounded-3xl overflow-hidden border border-white/5 bg-imm-sidebar flex items-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 to-transparent"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-gradient-to-l from-imm-card to-transparent opacity-50"></div>
                    <div className="relative z-20 px-8 lg:px-12 max-w-2xl">
                      <div className="flex items-center gap-4 mb-4">
                        <CheckCircle2 className="w-8 h-8 text-[#10b981] drop-shadow-lg" />
                        <h1 className="serif text-4xl lg:text-5xl font-bold text-white drop-shadow-md">My Library</h1>
                      </div>
                      <p className="text-sm lg:text-base text-imm-text/80 leading-relaxed font-light italic mt-4 max-w-xl">
                        A retrospective of everything you've watched. Keep track of your completed cinematic journeys here.
                      </p>
                      <div className="mt-8 flex gap-4">
                        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-imm-border text-xs text-white font-bold tracking-widest shadow-inner">
                          {watchedIds.length} {watchedIds.length === 1 ? 'TITLE' : 'TITLES'} FINISHED
                        </div>
                      </div>
                    </div>
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 blur-xl pointer-events-none">
                      <CheckCircle2 className="w-96 h-96 text-[#10b981]" />
                    </div>
                  </section>
                )}

                {(activeCategory === 'Movies' || activeCategory === 'Anime' || activeCategory === 'TV Shows' || activeCategory === 'Books' || activeCategory === 'Hacks') && (
                  <section className="pb-10">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="serif text-2xl font-semibold">
                        {activeView === 'watchlist' ? 'Saved Titles' : activeView === 'library' ? 'Completed Titles' : activeCategory === 'Anime' ? 'Trending Anime' : activeCategory === 'TV Shows' ? 'Episodic Journeys' : activeCategory === 'Books' ? 'Library' : activeCategory === 'Hacks' ? 'Hacker Resources' : 'Curated Cozy Classics'}
                      </h2>
                    </div>
                    
                    {(activeView === 'library' || activeView === 'watchlist') ? (
                      filteredItems.length === 0 ? (
                        <div className="col-span-full py-20 text-center border border-dashed border-imm-border rounded-3xl opacity-40">
                          {activeView === 'watchlist' ? (
                            <>
                              <Heart className="w-8 h-8 mx-auto mb-4 opacity-50" />
                              <p className="font-serif italic text-lg">Your watchlist is currently empty...</p>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-8 h-8 mx-auto mb-4 opacity-50" />
                              <p className="font-serif italic text-lg">You haven't marked any titles as watched yet...</p>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-10">
                          {['movie', 'tv', 'anime', 'book', 'manga'].map(type => {
                            const typeItems = filteredItems.filter(item => item.type === type);
                            if (typeItems.length === 0) return null;
                            const typeName = type === 'movie' ? 'Movies' : type === 'tv' ? 'TV Shows' : type === 'anime' ? 'Anime' : type === 'book' ? 'Books' : 'Manga';
                            return (
                              <div key={type}>
                                <h3 className="serif text-xl font-medium mb-4 text-white/80 border-b border-imm-border pb-2">{typeName}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                  {typeItems.map((item, index) => renderMovieCard(item, index))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.length === 0 ? (
                          <div className="col-span-full py-20 text-center border border-dashed border-imm-border rounded-3xl opacity-40">
                            <Coffee className="w-8 h-8 mx-auto mb-4" />
                            <p className="font-serif italic text-lg">No results found...</p>
                          </div>
                        ) : (
                          filteredItems.map((item, index) => renderMovieCard(item, index))
                        )}
                      </div>
                    )}
                  </section>
                )}
              </motion.div>
            )}

            {activeCategory === 'Proxies' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex-1"
              >
                <div className="mb-12">
                  <h2 className="serif text-5xl italic mb-4">Proxy Portals</h2>
                  <p className="text-imm-text/40 font-light max-w-xl italic text-lg leading-relaxed">
                    A collection of secure gateways designed for seamless, unrestricted access. Select a group to explore available mirrors.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {PROXY_GROUPS.map((group, index) => (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y:0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-imm-sidebar p-8 rounded-[2.5rem] border border-imm-border hover:border-imm-accent transition-all relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Shield className="w-12 h-12 text-imm-accent" />
                      </div>
                      <div className="relative z-10">
                        <div className="w-12 h-12 bg-imm-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-imm-accent group-hover:text-black transition-all">
                          <Globe className="w-6 h-6" />
                        </div>
                        <h3 className="serif text-2xl mb-2">{group.name}</h3>
                        <p className="text-sm text-imm-text/40 mb-6 font-light">{group.description}</p>
                        
                        <div className="space-y-2">
                          {group.links.length > 0 ? (
                            group.links.map(link => (
                              <a 
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-xs hover:bg-imm-accent hover:text-black transition-all group/link"
                              >
                                <span>{link.name}</span>
                                <ExternalLink className="w-3 h-3 opacity-40 group-hover/link:opacity-100" />
                              </a>
                            ))
                          ) : (
                            <div className="p-3 border border-dashed border-imm-border rounded-xl text-[10px] text-imm-text/20 uppercase tracking-widest text-center">
                              Coming Soon
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeCategory === 'Music' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 w-full h-full rounded-3xl overflow-hidden border border-imm-border bg-imm-sidebar min-h-[600px]">
                <iframe src="https://monochrome.tf" title="monochrome.tf" className="w-full h-full border-0" allowFullScreen></iframe>
              </motion.div>
            )}

            {activeCategory === 'Books' && activeView === 'discovery' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-10">
                <section className="pb-10">
                  <div className="flex flex-col gap-10">
                    <div>
                      <h3 className="serif text-xl font-medium mb-4 text-white/80 border-b border-imm-border pb-2">Books</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.filter(item => item.type === 'book').length > 0 ? (
                          filteredItems.filter(item => item.type === 'book').map((item, index) => renderMovieCard(item, index))
                        ) : (
                          <div className="col-span-full py-10 text-center opacity-40 border border-dashed border-imm-border rounded-3xl">
                            <p className="font-serif italic text-lg py-10">No books found...</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="serif text-xl font-medium mb-4 text-white/80 border-b border-imm-border pb-2">Manga</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.filter(item => item.type === 'manga').length > 0 ? (
                          filteredItems.filter(item => item.type === 'manga').map((item, index) => renderMovieCard(item, index))
                        ) : (
                          <div className="col-span-full py-10 text-center opacity-40 border border-dashed border-imm-border rounded-3xl">
                            <p className="font-serif italic text-lg py-10">No manga found...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {activeCategory === 'Hacks' && activeView === 'discovery' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-10">
                <section className="pb-10">
                  <div className="flex flex-col gap-10">
                    <div>
                      <h3 className="serif text-xl font-medium mb-4 text-white/80 border-b border-imm-border pb-2">Apps for your Windows Laptop</h3>
                      
                      <div className="bg-imm-card rounded-3xl border border-imm-border overflow-hidden mb-10">
                        <div className="flex bg-black/20 border-b border-imm-border p-2 gap-2">
                          {(['working', 'pending', 'info', 'methods'] as const).map(section => (
                            <button
                              key={section}
                              onClick={() => setLaptopSection(section)}
                              className={`px-6 py-2 rounded-2xl text-[10px] uppercase font-bold tracking-widest transition-all ${laptopSection === section ? 'bg-imm-accent text-black' : 'text-imm-text/40 hover:text-imm-text/80'}`}
                            >
                              {section}
                            </button>
                          ))}
                        </div>

                        <div className="p-8">
                          {laptopSection === 'working' && (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-sm">
                                <thead>
                                  <tr className="border-b border-imm-border text-imm-text/40 uppercase text-[10px] tracking-widest">
                                    <th className="pb-4 pt-2 px-4">App Name</th>
                                    <th className="pb-4 pt-2 px-4">Status</th>
                                    <th className="pb-4 pt-2 px-4">Performance</th>
                                    <th className="pb-4 pt-2 px-4 text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {WINDOWS_APPS.filter(app => app.title.toLowerCase().includes(searchQuery.toLowerCase())).map(app => (
                                    <tr key={app.id} className="border-b border-imm-border/50 hover:bg-white/5 transition-colors group">
                                      <td className="py-4 px-4 font-medium">{app.title}</td>
                                      <td className="py-4 px-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${app.mood.includes('Admin') ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'}`}>
                                          {app.mood.split(' / ')[0]}
                                        </span>
                                      </td>
                                      <td className="py-4 px-4 text-imm-text/60">{app.mood.split(' / ')[1] || 'N/A'}</td>
                                      <td className="py-4 px-4 text-right">
                                        <button 
                                          onClick={() => setSelectedMovie(app)}
                                          className="p-2 rounded-full hover:bg-imm-accent hover:text-black transition-all text-imm-text/20 group-hover:text-imm-text"
                                        >
                                          <ExternalLink className="w-4 h-4" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {laptopSection === 'pending' && (
                            <div className="py-20 text-center opacity-40">
                              <Clock className="w-12 h-12 mx-auto mb-4" />
                              <p className="font-serif italic text-lg">No pending tasks. System stable.</p>
                            </div>
                          )}

                          {laptopSection === 'info' && (
                            <div className="space-y-8 max-w-2xl">
                              <div>
                                <h4 className="text-imm-accent font-bold uppercase tracking-widest text-[10px] mb-4">System Version</h4>
                                <p className="text-3xl serif italic">v1.0.5</p>
                              </div>
                              <div className="grid grid-cols-2 gap-8">
                                <div>
                                  <h4 className="text-imm-text/40 font-bold uppercase tracking-widest text-[10px] mb-4">Status Key</h4>
                                  <ul className="space-y-2 text-sm text-imm-text/60">
                                    <li>• Working</li>
                                    <li>• Requires Extra</li>
                                    <li>• Requires Admin</li>
                                    <li>• Dysfunctional</li>
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="text-imm-text/40 font-bold uppercase tracking-widest text-[10px] mb-4">Performance Key</h4>
                                  <ul className="space-y-2 text-sm text-imm-text/60">
                                    <li>• Good</li>
                                    <li>• Special Settings</li>
                                    <li>• Low FPS / Very Low FPS</li>
                                    <li>• HORRIBLE FPS</li>
                                    <li>• Lag Spikes</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}

                          {laptopSection === 'methods' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {LAPTOP_METHODS.map((method, i) => (
                                <button
                                  key={method.title}
                                  onClick={() => {
                                    setActiveMethod(method);
                                    setCurrentStepIndex(0);
                                  }}
                                  className="p-6 bg-imm-sidebar rounded-2xl border border-imm-border text-left hover:border-imm-accent transition-all group"
                                >
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-imm-accent/10 rounded-xl group-hover:bg-imm-accent group-hover:text-black transition-colors">
                                      <Play className="w-5 h-5 fill-current" />
                                    </div>
                                    <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                  </div>
                                  <h4 className="font-serif text-xl italic mb-2">{method.title}</h4>
                                  <p className="text-xs text-imm-text/40">{method.steps.length} Steps to Success</p>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* We keep the grid below or hide it depending on preference, but for now let's keep it as secondary view or remove it to match the "EMBED THIS" request */}
                    </div>
                    <div>
                      <h3 className="serif text-xl font-medium mb-4 text-white/80 border-b border-imm-border pb-2">Gimkit Hacks</h3>
                      <div className="bg-imm-card rounded-3xl border border-imm-border overflow-hidden">
                        <div className="p-8 overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead>
                              <tr className="border-b border-imm-border text-imm-text/40 uppercase text-[10px] tracking-widest">
                                <th className="pb-4 pt-2 px-4">Hack Name</th>
                                <th className="pb-4 pt-2 px-4">Category</th>
                                <th className="pb-4 pt-2 px-4 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {GIMKIT_HACKS.filter(hack => hack.title.toLowerCase().includes(searchQuery.toLowerCase())).map(hack => (
                                <tr key={hack.id} className="border-b border-imm-border/50 hover:bg-white/5 transition-colors group">
                                  <td className="py-4 px-4 font-medium">{hack.title}</td>
                                  <td className="py-4 px-4">
                                    <span className="px-2 py-1 rounded text-[10px] font-bold bg-imm-accent/10 text-imm-accent border border-imm-accent/20">
                                      {hack.genre[0] || 'Hack'}
                                    </span>
                                  </td>
                                  <td className="py-4 px-4 text-right">
                                    <button 
                                      onClick={() => setSelectedMovie(hack)}
                                      className="p-2 rounded-full hover:bg-imm-accent hover:text-black transition-all text-imm-text/20 group-hover:text-imm-text"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {activeCategory === 'Extra' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col gap-10"
              >
                <div className="bg-imm-card border border-imm-border p-12 rounded-[2.5rem] relative overflow-hidden glow-amber">
                  <div className="relative z-10">
                    <h1 className="serif text-5xl mb-6 text-white italic tracking-tight">Helium Extra</h1>
                    <p className="text-imm-text/70 text-lg font-light leading-relaxed mb-10 max-w-xl">
                      Community resources, developer credits, and experimental portals. Explore the outer reaches of the Helium ecosystem.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { title: 'Our Staff', icon: Shield, action: () => setActiveExtra({ title: 'Our Staff', content: 'Ace', subtext: 'Owner' }) },
                        { title: 'Partners', icon: Globe, action: () => setActiveExtra({ title: 'Partners', partners: PARTNERS }) },
                        { title: 'Requests', icon: MessageSquare, action: () => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfa3NfgBDgXeHHOugtGK9ilhmxeBUtKGowdGwMf8-p4I-huEg/viewform?usp=sharing&ouid=109958091358583321640', '_blank') },
                        { title: 'Info', icon: Info, action: () => setActiveExtra({ title: 'System Status', content: 'We are hearing about a rumor that you can\'t access the movies. "The number of allowed playback" or something like that. New method: Exit the tab, wait for 2 minutes, and come back on to the movie.' }) },
                        { title: 'Leaks', icon: Zap, action: () => setActiveExtra({ title: 'Deep Leaks', content: 'New theme?' }) },
                        { title: 'Credits', icon: Sparkles, action: () => setActiveExtra({ title: 'Helium Credits', content: 'Thank you P-Stream, Chill Zone, M3T4L, Ultimate Game Stash (UGS), and Chill Kirb Central.' }) },
                        { title: 'Air', icon: Wind, action: () => setIsAirChatOpen(true) },
                        { title: 'Hydrogen', icon: Activity, action: () => setIsHydrogenChatOpen(true) },
                        { title: 'Eaglercraft', icon: Gamepad2, action: () => setIsEaglercraftOpen(true) }
                      ].map((btn) => (
                        <button
                          key={btn.title}
                          onClick={btn.action}
                          className="flex items-center gap-4 p-6 bg-imm-sidebar/50 border border-imm-border rounded-2xl hover:border-imm-accent hover:bg-imm-card transition-all group text-left"
                        >
                          <div className="p-3 bg-imm-accent/10 rounded-xl group-hover:bg-imm-accent/20 transition-colors">
                            {btn.icon ? <btn.icon className="w-5 h-5 text-imm-accent" /> : <Layers className="w-5 h-5 text-imm-accent" />}
                          </div>
                          <span className="font-semibold text-imm-text group-hover:text-white transition-colors">{btn.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-12 opacity-5">
                    <Sparkles className="w-64 h-64" />
                  </div>
                </div>
              </motion.div>
            )}

            {activeCategory === 'Games' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 w-full h-full relative"
              >
                <GamesEmbed />
              </motion.div>
            )}

            {activeCategory !== 'Home' && activeCategory !== 'Movies' && activeCategory !== 'Anime' && activeCategory !== 'TV Shows' && activeCategory !== 'Proxies' && activeCategory !== 'Music' && activeCategory !== 'Books' && activeCategory !== 'Hacks' && activeCategory !== 'Games' && activeCategory !== 'Extra' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center py-20 bg-imm-sidebar/30 rounded-[3rem] border border-dashed border-imm-border"
              >
                <div className="p-8 bg-imm-accent/10 rounded-full mb-8">
                  <Ghost className="w-16 h-16 text-imm-accent opacity-40 animate-pulse" />
                </div>
                <h2 className="serif text-4xl mb-4 italic">The {activeCategory} archives are coming...</h2>
                <p className="text-imm-text/40 max-w-sm font-light">We are curating the finest, most immersive selections for this category. Stay centered.</p>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Laptop Methods Modal */}
      <AnimatePresence>
        {activeMethod && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveMethod(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-imm-card border border-imm-border rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="serif text-3xl italic">{activeMethod.title}</h3>
                  <button onClick={() => setActiveMethod(null)} className="p-2 hover:bg-white/5 rounded-full text-imm-text/40 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="min-h-[160px] flex items-center justify-center text-center p-6 bg-black/20 rounded-3xl border border-imm-border/50 mb-8">
                  <motion.p
                    key={currentStepIndex}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-lg font-light leading-relaxed"
                  >
                    {activeMethod.steps[currentStepIndex]}
                  </motion.p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentStepIndex === 0}
                    className="flex-1 py-4 bg-imm-sidebar text-imm-text rounded-2xl border border-imm-border disabled:opacity-20 hover:bg-white/5 transition-all text-xs uppercase font-bold tracking-widest"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setCurrentStepIndex(prev => Math.min(activeMethod.steps.length - 1, prev + 1))}
                    disabled={currentStepIndex === activeMethod.steps.length - 1}
                    className="flex-1 py-4 bg-imm-accent text-black rounded-2xl disabled:opacity-20 hover:brightness-110 transition-all text-xs uppercase font-bold tracking-widest"
                  >
                    Next
                  </button>
                </div>
                
                <div className="mt-6 flex justify-center gap-1">
                  {activeMethod.steps.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all ${i === currentStepIndex ? 'w-4 bg-imm-accent' : 'w-1 bg-white/10'}`} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Extra Info Modal */}
      <AnimatePresence>
        {activeExtra && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveExtra(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative w-full ${activeExtra.partners ? 'max-w-2xl' : 'max-w-sm'} bg-imm-card border border-imm-border rounded-[2.5rem] overflow-hidden shadow-2xl`}
            >
              <div className="p-10 flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-8">
                  <h3 className="serif text-xs uppercase tracking-[0.3em] text-imm-accent font-bold opacity-60">Archive Detail</h3>
                  <button onClick={() => setActiveExtra(null)} className="p-2 hover:bg-white/5 rounded-full text-imm-text/40 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8 w-full">
                   <h2 className={`serif text-4xl italic mb-6 text-center ${activeExtra.title === 'Partners' ? 'text-purple-400 font-bold not-italic' : ''}`}>{activeExtra.title}</h2>
                   
                   {activeExtra.content && (
                     <p className="text-lg font-light leading-relaxed text-imm-text/80 italic text-center">
                       {activeExtra.content}
                     </p>
                   )}

                   {activeExtra.subtext && (
                     <p className="mt-2 text-[10px] uppercase tracking-[0.2em] font-bold text-imm-accent text-center">
                       {activeExtra.subtext}
                     </p>
                   )}

                   {activeExtra.list && (
                     <div className="flex flex-col gap-3 mt-4 text-center">
                       {activeExtra.list.map((item, i) => (
                         <div key={i} className="serif text-xl opacity-60 hover:opacity-100 transition-opacity">
                           {item}
                         </div>
                       ))}
                     </div>
                   )}

                   {activeExtra.partners && (
                     <div className="flex flex-col gap-4 mt-6 max-h-[50vh] overflow-y-auto no-scrollbar pr-2">
                       {activeExtra.partners.map((partner) => (
                         <div 
                          key={partner.id} 
                          onClick={() => partner.link !== '#' && window.open(partner.link, '_blank')}
                          className={`flex items-center gap-6 p-6 rounded-[1.5rem] bg-[#16162a] border border-white/5 hover:border-purple-500/30 transition-all ${partner.link !== '#' ? 'cursor-pointer hover:bg-[#1c1c35] translate-hover shadow-xl' : ''}`}
                         >
                           <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-purple-500/20">
                             <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex flex-col gap-1 text-left">
                             <h4 className="serif text-2xl text-purple-400 tracking-wide font-bold">{partner.name}</h4>
                             <div className="text-[10px] uppercase tracking-widest text-[#5de4ff] font-bold">
                               Owned by: <span className="opacity-80 font-medium">{partner.owner}</span>
                             </div>
                             <p className="text-sm text-imm-text/60 mt-1 line-clamp-1 italic font-light">
                               {partner.description}
                             </p>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                </div>

                <button 
                  onClick={() => setActiveExtra(null)}
                  className="w-full py-4 bg-imm-accent text-black rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] hover:brightness-110 transition-all mt-4"
                >
                  Close Archive
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Movie Detail Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedMovie(null)} />
            <motion.div layoutId={selectedMovie.id} className="relative w-full max-w-5xl bg-imm-sidebar rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] border border-imm-border">
              <button onClick={() => setSelectedMovie(null)} className="absolute top-6 right-6 z-10 p-2 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition-all">
                <X className="w-5 h-5 text-imm-text" />
              </button>
              {selectedMovie.type !== 'hack' && (
                <div className="w-full md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                  <img src={selectedMovie.image} alt={selectedMovie.title} className="w-full h-full object-cover scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-imm-sidebar via-transparent to-transparent md:bg-gradient-to-r" />
                </div>
              )}
              <div className={`w-full ${selectedMovie.type === 'hack' ? 'md:w-full' : 'md:w-1/2'} p-8 lg:p-12 overflow-y-auto`}>
                <div className="flex items-center space-x-2 text-imm-accent mb-4">
                  {selectedMovie.rating && selectedMovie.rating !== 'N/A' && (
                    <>
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold tracking-wider">{selectedMovie.rating} Rating</span>
                      <span className="text-imm-text/20">•</span>
                    </>
                  )}
                  <span className="text-[10px] font-bold text-imm-text/40 uppercase tracking-[0.2em]">{selectedMovie.mood || 'N/A'}</span>
                </div>
                <h2 className="serif text-4xl lg:text-5xl text-white mb-4 leading-tight">{selectedMovie.title}</h2>
                <div className="flex items-center space-x-4 mb-8 text-xs text-imm-text/60">
                  {selectedMovie.year && selectedMovie.year !== 'N/A' && (
                    <span className="px-3 py-1 bg-imm-card rounded-full border border-imm-border">{selectedMovie.year}</span>
                  )}
                  {selectedMovie.duration && selectedMovie.duration !== 'N/A' && (
                    <span>{selectedMovie.duration}</span>
                  )}
                  {clickCounts[selectedMovie.id] > 0 && (
                    <span className="text-imm-accent underline decoration-imm-accent/20">Visited {clickCounts[selectedMovie.id]} times</span>
                  )}
                </div>
                {selectedMovie.description && (
                  <p className="text-base lg:text-lg text-imm-text/80 leading-relaxed font-light italic mb-10">"{selectedMovie.description}"</p>
                )}
                <div className="flex flex-col gap-3">
                  {selectedMovie.links ? (
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedMovie.links.map((link, idx) => (
                          <button 
                            key={idx}
                            onClick={() => {
                              setClickCounts(prev => ({ ...prev, [selectedMovie.id]: (prev[selectedMovie.id] || 0) + 1 }));
                              window.open(link.url, '_blank');
                            }} 
                            className="bg-imm-card border border-imm-border text-imm-text py-3 px-4 rounded-xl font-medium hover:bg-imm-accent hover:text-black transition-all flex items-center justify-between group"
                          >
                            <span>{link.part}</span>
                            <Play className="w-4 h-4 opacity-40 group-hover:opacity-100 fill-current" />
                          </button>
                        ))}
                      </div>
                      <div className="flex space-x-3 mt-2">
                        <button 
                          onClick={() => toggleLibrary(selectedMovie.id)}
                          title={libraryIds.includes(selectedMovie.id) ? "Remove from Watchlist" : "Add to Watchlist"}
                          className={`flex-1 py-3 rounded-xl border border-imm-border hover:bg-black/40 transition-all flex items-center justify-center space-x-2
                            ${libraryIds.includes(selectedMovie.id) ? 'bg-imm-accent/20 text-imm-accent' : 'bg-imm-card text-imm-text'}`}
                        >
                          <Heart className={`w-4 h-4 ${libraryIds.includes(selectedMovie.id) ? 'fill-current' : ''}`} />
                          <span className="text-xs font-semibold uppercase tracking-widest">{libraryIds.includes(selectedMovie.id) ? 'Watchlisted' : 'Watchlist'}</span>
                        </button>
                        <button 
                          onClick={() => toggleWatched(selectedMovie.id)}
                          title={watchedIds.includes(selectedMovie.id) ? "Remove from Library" : "Add to Completed Library"}
                          className={`flex-1 py-3 rounded-xl border border-imm-border hover:bg-black/40 transition-all flex items-center justify-center space-x-2
                            ${watchedIds.includes(selectedMovie.id) ? 'bg-green-500/20 text-green-500' : 'bg-imm-card text-imm-text'}`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase tracking-widest">{watchedIds.includes(selectedMovie.id) ? 'Finished' : 'Mark Finished'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex space-x-3">
                      {selectedMovie.driveLink ? (
                        <button 
                          onClick={() => {
                            setClickCounts(prev => ({ ...prev, [selectedMovie.id]: (prev[selectedMovie.id] || 0) + 1 }));
                            window.open(selectedMovie.driveLink, '_blank');
                          }} 
                          className="flex-1 bg-imm-accent text-black py-4 rounded-full font-bold hover:bg-imm-accent-hover transition-all flex items-center justify-center space-x-3"
                        >
                          {selectedMovie.type === 'book' || selectedMovie.type === 'manga' ? <BookOpen className="w-5 h-5 fill-current" /> : selectedMovie.type === 'hack' ? <Zap className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                          <span>Open in Google Drive</span>
                        </button>
                      ) : (
                        <button onClick={() => handleWatch(selectedMovie)} className="flex-1 bg-imm-accent text-black py-4 rounded-full font-bold hover:bg-imm-accent-hover transition-all flex items-center justify-center space-x-3">
                          <Play className="w-5 h-5 fill-current" />
                          <span>Open in Google Drive</span>
                        </button>
                      )}
                      <button 
                        onClick={() => toggleLibrary(selectedMovie.id)}
                        title={libraryIds.includes(selectedMovie.id) ? "Remove from Watchlist" : "Add to Watchlist"}
                        className={`px-6 rounded-full border border-imm-border hover:bg-black/40 transition-all flex items-center justify-center
                          ${libraryIds.includes(selectedMovie.id) ? 'bg-imm-accent/20 text-imm-accent' : 'bg-imm-card text-imm-text'}`}
                      >
                        <Heart className={`w-5 h-5 ${libraryIds.includes(selectedMovie.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => toggleWatched(selectedMovie.id)}
                        title={watchedIds.includes(selectedMovie.id) ? "Remove from Library" : "Add to Completed Library"}
                        className={`px-6 rounded-full border border-imm-border hover:bg-black/40 transition-all flex items-center justify-center
                          ${watchedIds.includes(selectedMovie.id) ? 'bg-green-500/20 text-green-500' : 'bg-imm-card text-imm-text'}`}
                      >
                        <CheckCircle2 className={`w-5 h-5 ${watchedIds.includes(selectedMovie.id) ? '' : ''}`} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
