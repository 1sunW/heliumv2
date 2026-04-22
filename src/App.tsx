import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MOVIES, ANIME_DATA, TV_SHOWS, type ContentItem } from './data';
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
  Ghost
} from 'lucide-react';

type CategoryType = 'Home' | 'Movies' | 'Games' | 'Anime' | 'Proxies' | 'Music' | 'TV Shows' | 'Books' | 'Hacks' | 'Extra';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('Home');
  const [selectedMovie, setSelectedMovie] = useState<ContentItem | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<'discovery' | 'library'>('discovery');
  const [libraryIds, setLibraryIds] = useState<string[]>([]);
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const featuredMovie = MOVIES[0];

  const handleWatch = (movie: ContentItem) => {
    setClickCounts(prev => ({
      ...prev,
      [movie.id]: (prev[movie.id] || 0) + 1
    }));
    if (!libraryIds.includes(movie.id)) {
      setLibraryIds(prev => [...prev, movie.id]);
    }
    console.log(`Opening ${movie.title} in Google Drive...`);
  };

  const allItems = [...MOVIES, ...ANIME_DATA, ...TV_SHOWS];

  const displayedItems = activeView === 'library' 
    ? allItems.filter(m => libraryIds.includes(m.id))
    : activeCategory === 'Movies' 
      ? MOVIES 
      : activeCategory === 'Anime' 
        ? ANIME_DATA 
        : activeCategory === 'TV Shows'
          ? TV_SHOWS
          : [];

  const filteredItems = displayedItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories: CategoryType[] = ['Home', 'Movies', 'Games', 'Anime', 'Proxies', 'Music', 'TV Shows', 'Books', 'Hacks', 'Extra'];

  return (
    <div className="flex flex-col h-screen w-screen border-imm-border border-8 box-border overflow-hidden selection:bg-imm-accent/30 bg-imm-bg">
      {/* Top Category Bar */}
      <div className="bg-imm-sidebar border-b border-imm-border shrink-0 flex items-center px-6 overflow-x-auto no-scrollbar py-3 gap-8 z-30">
        <div className="flex items-center gap-2 mr-4 shrink-0">
          <Play className="w-5 h-5 text-imm-accent fill-current" />
          <span className="serif text-xl font-bold text-imm-accent">Helium</span>
        </div>
        <div className="flex items-center gap-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap px-1 py-1 border-b-2 ${activeCategory === cat ? 'text-imm-accent border-imm-accent font-bold' : 'text-imm-text/40 border-transparent hover:text-imm-text/80'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Navigation (Context Sensitive) */}
        {(activeCategory === 'Movies' || activeCategory === 'Home') && (
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
                  className={`cursor-pointer transition-colors flex items-center gap-3 ${activeView === 'library' ? 'text-imm-accent font-semibold' : 'hover:text-imm-text'}`}
                  onClick={() => setActiveView('library')}
                >
                  <Heart className="w-4 h-4" /> My Library ({libraryIds.length})
                </li>
              </ul>
              
              <div className="h-px bg-imm-border w-full"></div>
              
              <ul className="space-y-4">
                <li className="hover:text-imm-text cursor-pointer transition-colors">Recent</li>
                <li className="hover:text-imm-text cursor-pointer transition-colors">Trending</li>
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

          {/* Header */}
          <header className="h-20 shrink-0 px-6 lg:px-10 flex items-center justify-between border-b border-imm-border z-10 sticky top-0 bg-imm-bg/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <h2 className="serif text-xl tracking-wide">{activeCategory} View</h2>
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
              <div className="w-10 h-10 rounded-full border-2 border-imm-accent/30 p-0.5">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-imm-accent to-[#4c1d95]"></div>
              </div>
            </div>
          </header>

          <div className="flex-1 p-6 lg:p-10 flex flex-col gap-10">
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
                      Welcome to your personal hub. Explore cinema, discover hacks, browse anime, or just stay immersive. Everything you need, unified in one serene interface.
                    </p>
                    <button 
                      onClick={() => setActiveCategory('Movies')}
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
                  { name: 'Movies', icon: Play, count: MOVIES.length, desc: 'Cinematic journeys.' },
                  { name: 'Games', icon: Gamepad2, count: 0, desc: 'Interactive worlds.' },
                  { name: 'Anime', icon: Sparkles, count: ANIME_DATA.length, desc: 'Hand-drawn dreams.' },
                  { name: 'Proxies', icon: Layers, count: 0, desc: 'Secure pathways.' },
                  { name: 'Music', icon: MusicIcon, count: 0, desc: 'Rhythmic escapes.' },
                  { name: 'TV Shows', icon: Tv, count: TV_SHOWS.length, desc: 'Episodic comfort.' }
                ].map((item) => (
                  <div 
                    key={item.name}
                    onClick={() => setActiveCategory(item.name as CategoryType)}
                    className="group bg-imm-sidebar border border-imm-border p-8 rounded-[2rem] hover:border-imm-accent transition-all cursor-pointer"
                  >
                    <item.icon className="w-8 h-8 text-imm-accent mb-6 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <h3 className="serif text-2xl mb-2 text-white">{item.name}</h3>
                    <p className="text-xs text-imm-text/40 italic">{item.desc}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {(activeCategory === 'Movies' || activeCategory === 'Anime' || activeCategory === 'TV Shows' || activeView === 'library') && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-10">
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

                <section className="pb-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="serif text-2xl font-semibold">
                      {activeView === 'library' ? 'My Library' : activeCategory === 'Anime' ? 'Trending Anime' : activeCategory === 'TV Shows' ? 'Episodic Journeys' : 'Curated Cozy Classics'}
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.length === 0 ? (
                      <div className="col-span-full py-20 text-center border border-dashed border-imm-border rounded-3xl opacity-40">
                        <Coffee className="w-8 h-8 mx-auto mb-4" />
                        <p className="font-serif italic text-lg">No results found...</p>
                      </div>
                    ) : (
                      filteredItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => {
                            setClickCounts(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
                            setSelectedMovie(item);
                          }}
                          className="group cursor-pointer"
                        >
                          <div className="aspect-[3/4] rounded-2xl bg-imm-card border border-imm-border mb-3 overflow-hidden relative movie-card-hover">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                              <div className="flex flex-col gap-1 text-white">
                                <div className="flex items-center gap-2 text-xs font-bold">
                                  <Star className="w-3 h-3 text-imm-accent fill-current" /> {item.rating} Rating
                                </div>
                                {clickCounts[item.id] > 0 && (
                                  <div className="text-[10px] opacity-70 underline decoration-imm-accent/40">{clickCounts[item.id]} focus visits</div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm font-semibold group-hover:text-imm-accent transition-colors">{item.title}</div>
                          <div className="text-xs opacity-50 mt-0.5">{item.duration} • {item.year}</div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </section>
              </motion.div>
            )}

            {activeCategory !== 'Home' && activeCategory !== 'Movies' && activeCategory !== 'Anime' && (
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

      {/* Movie Detail Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedMovie(null)} />
            <motion.div layoutId={selectedMovie.id} className="relative w-full max-w-5xl bg-imm-sidebar rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] border border-imm-border">
              <button onClick={() => setSelectedMovie(null)} className="absolute top-6 right-6 z-10 p-2 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition-all">
                <X className="w-5 h-5 text-imm-text" />
              </button>
              <div className="w-full md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                <img src={selectedMovie.image} alt={selectedMovie.title} className="w-full h-full object-cover scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-imm-sidebar via-transparent to-transparent md:bg-gradient-to-r" />
              </div>
              <div className="w-full md:w-1/2 p-8 lg:p-12 overflow-y-auto">
                <div className="flex items-center space-x-2 text-imm-accent mb-4">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold tracking-wider">{selectedMovie.rating} Rating</span>
                  <span className="text-imm-text/20">•</span>
                  <span className="text-[10px] font-bold text-imm-text/40 uppercase tracking-[0.2em]">{selectedMovie.mood}</span>
                </div>
                <h2 className="serif text-4xl lg:text-5xl text-white mb-4 leading-tight">{selectedMovie.title}</h2>
                <div className="flex items-center space-x-4 mb-8 text-xs text-imm-text/60">
                  <span className="px-3 py-1 bg-imm-card rounded-full border border-imm-border">{selectedMovie.year}</span>
                  <span>{selectedMovie.duration}</span>
                  {clickCounts[selectedMovie.id] > 0 && (
                    <span className="text-imm-accent underline decoration-imm-accent/20">Visited {clickCounts[selectedMovie.id]} times</span>
                  )}
                </div>
                <p className="text-base lg:text-lg text-imm-text/80 leading-relaxed font-light italic mb-10">"{selectedMovie.description}"</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-imm-bg rounded-2xl border border-imm-border text-center">
                    <div className="text-[10px] text-imm-text/40 uppercase tracking-widest mb-1">Director</div>
                    <div className="text-imm-text font-medium">Studio Ghibli</div>
                  </div>
                  <div className="p-4 bg-imm-bg rounded-2xl border border-imm-border text-center">
                    <div className="text-[10px] text-imm-text/40 uppercase tracking-widest mb-1">Atmosphere Score</div>
                    <div className="text-imm-accent font-bold">98%</div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => handleWatch(selectedMovie)} className="flex-1 bg-imm-accent text-black py-4 rounded-full font-bold hover:bg-imm-accent-hover transition-all flex items-center justify-center space-x-3">
                    <Play className="w-5 h-5 fill-current" />
                    <span>Open in Google Drive</span>
                  </button>
                  <button className="px-6 bg-imm-card text-imm-text rounded-full border border-imm-border hover:bg-black/40 transition-all">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
