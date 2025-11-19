import React, { useState, useEffect } from 'react';
import { JournalEntry, Quote, SortOption, FilterOption, HIERARCHY_ORDER, HierarchyLevel } from '../types';
import { QUOTE_GENRES } from '../constants';
import { Plus, Trash2, Save, X, Filter, ArrowUpDown, Quote as QuoteIcon, Tag } from 'lucide-react';

interface Props {
  initialQuote?: Quote | null;
  onClearInitialQuote: () => void;
}

export const Journey: React.FC<Props> = ({ initialQuote, onClearInitialQuote }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit State
  const [editId, setEditId] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [showPostSaveModal, setShowPostSaveModal] = useState(false);
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // List View State
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mindset_journal');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) { console.error("Failed to load journal", e); }
    }
  }, []);

  // Effect to handle incoming quote for new entry
  useEffect(() => {
    if (initialQuote) {
      startNewEntry();
      setCurrentQuote(initialQuote);
      onClearInitialQuote();
    }
  }, [initialQuote, onClearInitialQuote]);

  const startNewEntry = () => {
    setEditId(null);
    setCurrentTitle('');
    setCurrentContent('');
    setCurrentQuote(null);
    setSelectedTags([]);
    setIsEditing(true);
  };

  const openEntry = (entry: JournalEntry) => {
    setEditId(entry.id);
    setCurrentTitle(entry.title);
    setCurrentContent(entry.content);
    setCurrentQuote(entry.linkedQuote || null);
    setSelectedTags(entry.tags || []);
    setIsEditing(true);
  };

  const saveEntry = () => {
    if (!currentContent.trim() && !currentTitle.trim()) return;

    const timestamp = Date.now();
    const entryId = editId || timestamp.toString();

    const newEntry: JournalEntry = {
      id: entryId,
      title: currentTitle.trim() || "Untitled Thought",
      content: currentContent,
      timestamp: editId ? entries.find(e => e.id === editId)?.timestamp || timestamp : timestamp,
      linkedQuote: currentQuote || undefined,
      tags: selectedTags, // Persist existing tags if any
    };

    let updated;
    if (editId) {
      updated = entries.map(e => e.id === editId ? newEntry : e);
    } else {
      updated = [newEntry, ...entries];
    }

    setEntries(updated);
    localStorage.setItem('mindset_journal', JSON.stringify(updated));
    
    // If new entry or we want to re-tag, show modal. 
    // For simplicity, always show tagging on save if it's open.
    setSavedEntryId(entryId);
    setShowPostSaveModal(true);
  };

  const updateTags = (tags: string[]) => {
    if (!savedEntryId) return;
    const updated = entries.map(e => 
      e.id === savedEntryId ? { ...e, tags } : e
    );
    setEntries(updated);
    localStorage.setItem('mindset_journal', JSON.stringify(updated));
    setShowPostSaveModal(false);
    setIsEditing(false);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('mindset_journal', JSON.stringify(updated));
  };

  const getSortedAndFilteredEntries = () => {
    let result = [...entries];

    // Filter
    if (filterBy !== 'all') {
      result = result.filter(e => e.tags?.includes(filterBy));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date_desc') return b.timestamp - a.timestamp;
      if (sortBy === 'date_asc') return a.timestamp - b.timestamp;
      if (sortBy === 'genre') return (a.tags?.[0] || '').localeCompare(b.tags?.[0] || '');
      return 0;
    });

    return result;
  };

  const filteredEntries = getSortedAndFilteredEntries();

  // --- EDIT MODE ---
  if (isEditing) {
    return (
      <div className="fixed inset-0 z-50 bg-mindset-bg flex flex-col h-full animate-in slide-in-from-bottom-10 duration-300">
        {/* Editor Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/5 bg-mindset-bg">
          <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/5 rounded-full text-mindset-muted transition-colors">
            <X size={24} />
          </button>
          <h2 className="text-lg font-medium text-white">{editId ? 'Edit Entry' : 'New Entry'}</h2>
          <button onClick={saveEntry} className="p-2 bg-mindset-accent text-mindset-bg rounded-full shadow-lg hover:scale-105 transition-transform">
            <Save size={20} />
          </button>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <input
            type="text"
            placeholder="Title..."
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            className="w-full bg-transparent text-2xl font-bold text-white placeholder-mindset-muted/40 border-none focus:ring-0 p-0 mb-6"
          />

          {currentQuote && (
            <div className="bg-mindset-card/50 border border-mindset-accent/20 p-4 rounded-xl mb-6 flex gap-3 items-start">
               <QuoteIcon className="text-mindset-accent shrink-0 mt-1" size={18} />
               <div>
                 <p className="text-white italic font-light">"{currentQuote.text}"</p>
                 <p className="text-sm text-mindset-muted mt-1">— {currentQuote.author}</p>
               </div>
               <button onClick={() => setCurrentQuote(null)} className="ml-auto text-mindset-muted/50 hover:text-red-400">
                 <X size={16} />
               </button>
            </div>
          )}

          <textarea
            placeholder="Start writing..."
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
            className="w-full h-[calc(100%-150px)] bg-transparent text-lg text-mindset-text/90 placeholder-mindset-muted/20 resize-none border-none focus:ring-0 p-0 leading-relaxed"
            autoFocus
          />
        </div>

        {/* Post-Save Tagging Modal */}
        {showPostSaveModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="bg-mindset-card border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2">Tag your memory</h3>
              <p className="text-mindset-muted text-sm mb-4">Select topics to categorize this entry.</p>
              
              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto mb-6">
                 {QUOTE_GENRES.slice(0, 15).map(genre => (
                   <button
                    key={genre}
                    onClick={() => {
                      if(selectedTags.includes(genre)) setSelectedTags(selectedTags.filter(t => t !== genre));
                      else setSelectedTags([...selectedTags, genre]);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      selectedTags.includes(genre) 
                        ? 'bg-mindset-accent text-mindset-bg border-mindset-accent' 
                        : 'border-white/10 text-mindset-muted hover:border-white/30'
                    }`}
                   >
                     {genre}
                   </button>
                 ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => updateTags(selectedTags)} className="flex-1 py-3 bg-mindset-accent text-mindset-bg font-bold rounded-xl">
                  Done
                </button>
                <button onClick={() => updateTags(selectedTags)} className="px-4 py-3 text-mindset-muted font-medium">
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- LIST MODE ---
  return (
    <div className="p-4 pb-24 min-h-full">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Journal</h2>
          <p className="text-mindset-muted text-sm mt-1">{entries.length} entries</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-full transition-colors ${showFilters ? 'bg-mindset-card text-white' : 'bg-transparent text-mindset-muted hover:bg-mindset-card'}`}
          >
            <Filter size={20} />
          </button>
          <button
            onClick={startNewEntry}
            className="bg-mindset-accent text-mindset-bg p-3 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Filters Drawer */}
      {showFilters && (
        <div className="mb-6 p-4 bg-mindset-card rounded-xl border border-white/5 animate-in slide-in-from-top-2">
           <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-mindset-muted uppercase tracking-wider">Sort By</span>
              <button 
                onClick={() => setSortBy(prev => prev === 'date_desc' ? 'date_asc' : 'date_desc')}
                className="text-xs flex items-center gap-1 text-mindset-accent"
              >
                <ArrowUpDown size={12} /> {sortBy === 'date_desc' ? 'Newest First' : 'Oldest First'}
              </button>
           </div>
           
           <span className="text-xs font-bold text-mindset-muted uppercase tracking-wider block mb-2">Filter Tag</span>
           <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
             <button 
               onClick={() => setFilterBy('all')}
               className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${filterBy === 'all' ? 'bg-mindset-accent text-mindset-bg' : 'bg-white/5 text-mindset-muted'}`}
             >
               All
             </button>
             {Array.from(new Set(entries.flatMap(e => e.tags || []))).map(tag => (
               <button 
                 key={tag}
                 onClick={() => setFilterBy(tag)}
                 className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${filterBy === tag ? 'bg-mindset-accent text-mindset-bg' : 'bg-white/5 text-mindset-muted'}`}
               >
                 {tag}
               </button>
             ))}
           </div>
        </div>
      )}

      {filteredEntries.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          <p className="text-mindset-muted mb-4">Your journal is empty.</p>
          <button onClick={startNewEntry} className="text-mindset-accent underline font-medium">Start writing</button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map(entry => (
            <div 
              key={entry.id} 
              onClick={() => openEntry(entry)}
              className="bg-mindset-card p-5 rounded-xl border border-white/5 hover:border-mindset-accent/30 transition-all group cursor-pointer active:scale-[0.99]"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 pr-4">
                   <h3 className="font-bold text-white text-lg line-clamp-1">{entry.title}</h3>
                   <span className="text-xs text-mindset-muted/50 font-mono">
                     {new Date(entry.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                   </span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }}
                  className="p-2 text-mindset-muted/30 hover:text-red-400 hover:bg-white/5 rounded-full transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {entry.linkedQuote && (
                <div className="mb-3 pl-3 border-l-2 border-mindset-accent/30">
                  <p className="text-xs text-mindset-muted italic line-clamp-1">"{entry.linkedQuote.text}"</p>
                </div>
              )}

              <p className="text-mindset-text/80 text-sm line-clamp-3 mb-3 whitespace-pre-wrap leading-relaxed">
                {entry.content}
              </p>

              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
                  {entry.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-[10px] bg-mindset-bg/50 text-mindset-muted px-2 py-1 rounded">
                      <Tag size={10} /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
