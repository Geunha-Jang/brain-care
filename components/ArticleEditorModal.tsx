
import React, { useState, useEffect } from 'react';
import { Category, Article } from '../types';
import { getAIExplanation } from '../services/geminiService';

interface ArticleEditorModalProps {
  isOpen: boolean;
  initialData: Article | null;
  onClose: () => void;
  onSave: (article: Article) => void;
}

const ArticleEditorModal: React.FC<ArticleEditorModalProps> = ({ isOpen, initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    code: '',
    category: Category.LLM,
    tags: '',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800'
  });
  const [isPolishing, setIsPolishing] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        excerpt: initialData.excerpt,
        content: initialData.content,
        code: initialData.code || '',
        category: initialData.category,
        tags: initialData.tags.join(', '),
        image: initialData.image
      });
    } else {
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        code: '',
        category: Category.LLM,
        tags: '',
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const article: Article = {
      ...formData,
      id: initialData ? initialData.id : Date.now().toString(),
      author: initialData ? initialData.author : 'Admin',
      date: initialData ? initialData.date : new Date().toISOString().split('T')[0],
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      language: 'typescript'
    };
    onSave(article);
  };

  const handleAIPolish = async () => {
    if (!formData.content) return;
    setIsPolishing(true);
    const polished = await getAIExplanation(formData.code, `Rewrite this article to be more professional, visionary, and technical. Keep it concise but impactful: ${formData.content}`);
    setFormData(prev => ({ ...prev, content: polished }));
    setIsPolishing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[2rem] shadow-2xl flex flex-col">
        <div className="px-8 py-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 backdrop-blur">
          <h2 className="text-xl font-black text-white flex items-center gap-3">
            <i className="fa-solid fa-cube text-teal-500"></i>
            {initialData ? 'Update Insight' : 'Create New Insight'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Article Title</label>
              <input 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Enter title..."
                className="w-full bg-black border border-gray-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Category})}
                className="w-full bg-black border border-gray-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-teal-500/50 appearance-none"
              >
                {Object.values(Category).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Hero Image URL</label>
            <input 
              value={formData.image}
              onChange={e => setFormData({...formData, image: e.target.value})}
              placeholder="Unsplash URL..."
              className="w-full bg-black border border-gray-800 rounded-2xl px-5 py-4 text-xs text-gray-400 focus:outline-none focus:border-teal-500/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Brief Excerpt</label>
            <input 
              value={formData.excerpt}
              onChange={e => setFormData({...formData, excerpt: e.target.value})}
              placeholder="One-line summary for the card..."
              className="w-full bg-black border border-gray-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-teal-500/50"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Full Narrative</label>
              <button 
                onClick={handleAIPolish}
                disabled={isPolishing}
                className="text-[10px] bg-teal-500/10 text-teal-400 px-4 py-1.5 rounded-full border border-teal-500/20 hover:bg-teal-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isPolishing ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                {isPolishing ? 'Refining...' : 'AI Refine'}
              </button>
            </div>
            <textarea 
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              rows={10}
              placeholder="Tell the story of this project or insight..."
              className="w-full bg-black border border-gray-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-teal-500/50 resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Implementation Code</label>
            <textarea 
              value={formData.code}
              onChange={e => setFormData({...formData, code: e.target.value})}
              rows={8}
              placeholder="// Insert your technical snippet..."
              className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-5 py-4 text-xs text-teal-100/70 mono focus:outline-none focus:border-teal-500/50 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Tags (Comma Separated)</label>
            <input 
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
              placeholder="AI, Code, Logic"
              className="w-full bg-black border border-gray-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-teal-500/50"
            />
          </div>
        </div>

        <div className="p-8 bg-black/40 border-t border-gray-800 flex justify-end gap-4 shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-white transition-colors"
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            disabled={!formData.title || !formData.content}
            className="px-10 py-3 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black rounded-2xl text-xs transition-all shadow-xl shadow-teal-500/10 uppercase tracking-widest"
          >
            {initialData ? 'Save Changes' : 'Deploy Insight'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditorModal;
