
import React, { useState, useEffect } from 'react';
import { Article, ThemeConfig } from '../types';
import { getAIExplanation } from '../services/geminiService';

interface SplitViewProps {
  article: Article;
  isAdmin: boolean;
  theme: ThemeConfig;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const SplitView: React.FC<SplitViewProps> = ({ article, isAdmin, theme, onBack, onEdit, onDelete }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  useEffect(() => {
    if (article.code) {
      handleGenerateInsight();
    }
  }, [article.id, article.code, article.content]);

  const handleGenerateInsight = async () => {
    setIsLoadingInsight(true);
    const result = await getAIExplanation(article.code || "", article.content);
    setAiInsight(result);
    setIsLoadingInsight(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-color)', color: 'white' }}>
      <header className="flex items-center justify-between px-6 py-4 bg-black/40 border-b border-white/5 shrink-0 z-20 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-100" style={{ fontFamily: 'var(--heading-font)' }}>{article.title}</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">{article.category} • {article.date}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <button onClick={onEdit} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[var(--primary-color)] rounded-lg text-xs font-bold border border-[var(--primary-color)]/20 transition-all">
                Edit
              </button>
              <button onClick={onDelete} className="px-4 py-2 bg-red-900/10 hover:bg-red-900/20 text-red-500 rounded-lg text-xs font-bold border border-red-500/20 transition-all">
                Delete
              </button>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <section className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 border-r border-white/5">
          <div className="max-w-3xl mx-auto">
            <div className="mb-10 group relative">
              <img src={article.image} alt={article.title} className="w-full h-80 object-cover mb-12 border border-white/5 shadow-2xl transition-transform" style={{ borderRadius: 'var(--border-radius)' }} />
              <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-6">
                {article.content.split('\n\n').map((para, i) => (
                  <p key={i} className="text-lg font-light leading-relaxed">{para}</p>
                ))}
              </div>
            </div>

            <div className={`border border-[var(--primary-color)]/20 rounded-2xl p-8 mt-16 relative overflow-hidden ${theme.glassEffect ? 'bg-[var(--primary-color)]/[0.03] backdrop-blur-sm' : 'bg-white/5'}`}>
              <div className="absolute top-0 right-0 p-4 opacity-10"><i className="fa-solid fa-brain text-6xl text-[var(--primary-color)]"></i></div>
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-wand-magic-sparkles text-[var(--primary-color)]"></i>
                <h4 className="text-[10px] font-black text-[var(--primary-color)] uppercase tracking-widest">Neural Agent Insight</h4>
              </div>
              {isLoadingInsight ? (
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[var(--primary-color)] border-t-transparent"></div>
                  <p className="text-sm font-mono">Synthesizing patterns...</p>
                </div>
              ) : (
                <p className="text-gray-300 text-sm italic font-light leading-loose border-l-2 border-[var(--primary-color)]/30 pl-4">{aiInsight}</p>
              )}
            </div>
          </div>
        </section>

        <section className="flex-1 bg-black/40 flex flex-col border-t md:border-t-0 border-white/5">
          <div className="flex items-center justify-between px-6 py-4 bg-black/20 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[var(--primary-color)] animate-pulse"></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Source Buffer</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar p-8">
            <pre className="mono text-xs text-blue-100/70 whitespace-pre-wrap leading-relaxed">
              <code>{article.code}</code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SplitView;
