import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_ARTICLES } from './constants';
import { Article, Category, SiteConfig, ThemeConfig } from './types';
import ArticleCard from './components/ArticleCard';
import SplitView from './components/SplitView';
import ArticleEditorModal from './components/ArticleEditorModal';

const ADMIN_KEY = 'admin123';

const DEFAULT_CONFIG: SiteConfig = {
  heroTitle: "Architecting the",
  heroHighlight: "Intelligent Future.",
  heroSubtitle: "A curated archive of breakthroughs in AI, large language models, and high-performance engineering systems.",
  authorName: "BrainCare Lead",
  authorRole: "Senior AI Researcher",
  avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=braincare",
  theme: {
    primaryColor: "#14b8a6",
    accentColor: "#3b82f6",
    backgroundColor: "#030712",
    surfaceColor: "#0b1120",
    headingFont: "'Inter', sans-serif",
    bodyFont: "'Inter', sans-serif",
    borderRadius: "1.5rem",
    gridColumns: 2,
    heroAlignment: 'left',
    glassEffect: true
  }
};

const App: React.FC = () => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    const savedArticles = localStorage.getItem('bc_articles_v5');
    if (savedArticles) {
      try { setArticles(JSON.parse(savedArticles)); } 
      catch (e) { setArticles(MOCK_ARTICLES); }
    } else {
      setArticles(MOCK_ARTICLES);
      localStorage.setItem('bc_articles_v5', JSON.stringify(MOCK_ARTICLES));
    }

    const savedConfig = localStorage.getItem('bc_config_v3');
    if (savedConfig) {
      try { setConfig(JSON.parse(savedConfig)); } 
      catch (e) { setConfig(DEFAULT_CONFIG); }
    }

    const savedAdmin = sessionStorage.getItem('bc_admin_active');
    if (savedAdmin === 'true') setIsAdmin(true);
    
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', config.theme.primaryColor);
    root.style.setProperty('--accent-color', config.theme.accentColor);
    root.style.setProperty('--bg-color', config.theme.backgroundColor);
    root.style.setProperty('--surface-color', config.theme.surfaceColor);
    root.style.setProperty('--heading-font', config.theme.headingFont);
    root.style.setProperty('--body-font', config.theme.bodyFont);
    root.style.setProperty('--border-radius', config.theme.borderRadius);
  }, [config.theme]);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [articles, activeCategory, searchQuery]);

  const selectedArticle = useMemo(() => 
    articles.find(a => a.id === selectedArticleId), 
    [articles, selectedArticleId]
  );

  const handleSaveArticle = (article: Article) => {
    let updated = articles.find(a => a.id === article.id) 
      ? articles.map(a => a.id === article.id ? article : a)
      : [article, ...articles];
    setArticles(updated);
    localStorage.setItem('bc_articles_v5', JSON.stringify(updated));
    setIsEditorOpen(false);
    setEditingArticle(null);
  };

  const handleUpdateTheme = (updates: Partial<ThemeConfig>) => {
    const newConfig = { ...config, theme: { ...config.theme, ...updates } };
    setConfig(newConfig);
    localStorage.setItem('bc_config_v3', JSON.stringify(newConfig));
  };

  const handleEditConfig = (key: keyof Omit<SiteConfig, 'theme'>) => {
    if (!isAdmin) return;
    const val = prompt(`Edit ${key}:`, config[key] as string);
    if (val !== null) {
      const newConfig = { ...config, [key]: val };
      setConfig(newConfig);
      localStorage.setItem('bc_config_v3', JSON.stringify(newConfig));
    }
  };

  const toggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
      setIsThemeEditorOpen(false);
      sessionStorage.removeItem('bc_admin_active');
    } else {
      const pass = prompt("Access Key Required:");
      if (pass === ADMIN_KEY) {
        setIsAdmin(true);
        sessionStorage.setItem('bc_admin_active', 'true');
      } else if (pass !== null) alert("Unauthorized.");
    }
  };

  if (selectedArticleId && selectedArticle) {
    return (
      <SplitView 
        article={selectedArticle} 
        isAdmin={isAdmin}
        theme={config.theme}
        onBack={() => setSelectedArticleId(null)} 
        onEdit={() => { setEditingArticle(selectedArticle); setIsEditorOpen(true); }}
        onDelete={() => {
            if (!window.confirm("Permanent deletion?")) return;
            const updated = articles.filter(a => a.id !== selectedArticleId);
            setArticles(updated);
            localStorage.setItem('bc_articles_v5', JSON.stringify(updated));
            setSelectedArticleId(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ backgroundColor: 'var(--bg-color)', color: 'white', fontFamily: 'var(--body-font)' }}>
      <ArticleEditorModal 
        isOpen={isEditorOpen} 
        initialData={editingArticle}
        onClose={() => { setIsEditorOpen(false); setEditingArticle(null); }} 
        onSave={handleSaveArticle} 
      />

      {isAdmin && isThemeEditorOpen && (
        <div className="fixed inset-y-0 right-0 z-[100] w-80 bg-slate-900 border-l border-white/10 p-6 overflow-y-auto custom-scrollbar shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black tracking-widest uppercase text-teal-400">Theme Engine</h3>
            <button onClick={() => setIsThemeEditorOpen(false)}><i className="fa-solid fa-xmark text-gray-500"></i></button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Primary Color</label>
              <input type="color" value={config.theme.primaryColor} onChange={(e) => handleUpdateTheme({ primaryColor: e.target.value })} className="w-full h-10 rounded cursor-pointer" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Surface Color</label>
              <input type="color" value={config.theme.surfaceColor} onChange={(e) => handleUpdateTheme({ surfaceColor: e.target.value })} className="w-full h-10 rounded cursor-pointer" />
            </div>
            <button onClick={() => handleEditConfig('heroTitle')} className="w-full text-left p-2 text-xs text-gray-400 hover:text-white">Edit Hero Title</button>
            <button onClick={() => handleEditConfig('authorName')} className="w-full text-left p-2 text-xs text-gray-400 hover:text-white">Edit Author Name</button>
          </div>
        </div>
      )}

      <aside className={`${isSidebarOpen ? 'w-80' : 'w-0'} bg-black/40 border-r border-white/5 transition-all duration-300 flex flex-col overflow-hidden backdrop-blur-xl z-50`}>
        <div className="p-10 flex flex-col h-full min-w-[320px]">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-brain text-black text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter">BRAINCARE</h1>
              <p className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.4em]">Tech Archive</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4 px-4">Navigation</p>
            <button onClick={() => setActiveCategory('All')} className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-4 ${activeCategory === 'All' ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]' : 'text-gray-500 hover:text-white'}`}>
              <i className="fa-solid fa-border-all text-xs"></i> All Insights
            </button>
            {Object.values(Category).map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-4 ${activeCategory === cat ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]' : 'text-gray-500 hover:text-white'}`}>
                <i className={`fa-solid ${cat === Category.LLM ? 'fa-microchip' : cat === Category.AGENT ? 'fa-robot' : cat === Category.CODE ? 'fa-code' : 'fa-folder'} text-xs`}></i> {cat}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-10">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 mb-6">
              <img src={config.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-xl bg-gray-800" />
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{config.authorName}</p>
                <p className="text-[9px] text-gray-500 truncate">{config.authorRole}</p>
              </div>
            </div>
            <button onClick={toggleAdmin} className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border ${isAdmin ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-teal-500/10 border-teal-500/20 text-teal-500'}`}>
              {isAdmin ? 'Logout' : 'Admin Login'}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="px-10 py-6 flex items-center justify-between border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:text-white transition-colors">
              <i className={`fa-solid ${isSidebarOpen ? 'fa-indent' : 'fa-outdent'} text-lg`}></i>
            </button>
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs"></i>
              <input 
                type="text" 
                placeholder="Search archive..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/5 rounded-full pl-12 pr-6 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary-color)]/50 w-64 lg:w-96"
              />
            </div>
          </div>
          {isAdmin && (
            <div className="flex gap-4">
              <button onClick={() => setIsThemeEditorOpen(true)} className="p-3 bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"><i className="fa-solid fa-palette"></i></button>
              <button onClick={() => setIsEditorOpen(true)} className="px-6 py-2.5 bg-[var(--primary-color)] text-black font-black text-[10px] uppercase rounded-full tracking-widest">New Entry</button>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
          <div className="max-w-7xl mx-auto mb-20">
            <h2 className="text-6xl lg:text-8xl font-black mb-8 leading-tight tracking-tighter">
              {config.heroTitle} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)]">{config.heroHighlight}</span>
            </h2>
            <p className="text-xl text-gray-500 font-light max-w-2xl leading-relaxed">{config.heroSubtitle}</p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 pb-20">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} theme={config.theme} onClick={(id) => setSelectedArticleId(id)} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;