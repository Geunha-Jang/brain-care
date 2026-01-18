
import React from 'react';
import { Article, ThemeConfig } from '../types';

interface ArticleCardProps {
  article: Article;
  onClick: (id: string) => void;
  theme: ThemeConfig;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick, theme }) => {
  return (
    <div 
      onClick={() => onClick(article.id)}
      className={`group relative border border-white/5 overflow-hidden cursor-pointer transition-all duration-500 shadow-2xl ${theme.glassEffect ? 'backdrop-blur-sm bg-white/[0.02]' : ''}`}
      style={{ 
        backgroundColor: 'var(--surface-color)', 
        borderRadius: 'var(--border-radius)',
        borderColor: 'rgba(255,255,255,0.05)'
      }}
    >
      <div className="relative h-64 w-full overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
        <div className="absolute bottom-6 left-6 flex items-center gap-3">
          <div className="px-3 py-1 bg-[var(--primary-color)]/10 backdrop-blur-md border border-[var(--primary-color)]/20 text-[9px] font-black text-[var(--primary-color)] uppercase tracking-[0.2em] rounded-full">
            {article.category}
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex items-center gap-3 text-[10px] font-bold text-gray-600 mb-4 uppercase tracking-[0.1em]">
          <span>{article.date}</span>
          <span className="w-1 h-1 rounded-full bg-gray-800"></span>
          <span>{article.author}</span>
        </div>
        <h3 className="text-2xl font-black text-white group-hover:text-[var(--primary-color)] transition-colors mb-4 tracking-tight leading-tight" style={{ fontFamily: 'var(--heading-font)' }}>
          {article.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed font-light mb-6">
          {article.excerpt}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {article.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[9px] font-mono text-gray-600 group-hover:text-[var(--primary-color)]/60 transition-colors uppercase">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
