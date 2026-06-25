import React, { useState } from 'react';
import { Download, FileText, Award, FolderOpen, Calendar, Search, Plus, Check, Lock } from 'lucide-react';
import { ResourceItem } from '../types';

interface ResourcesSectionProps {
  resources: ResourceItem[];
  setResources: React.Dispatch<React.SetStateAction<ResourceItem[]>>;
  isAdmin: boolean;
}

export default function ResourcesSection({ resources, setResources, isAdmin }: ResourcesSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Add state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Study Material' | 'Form' | 'Report' | 'Certificate'>('Study Material');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = ["All", "Study Material", "Form", "Report", "Certificate"];

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'All' || res.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newItem: ResourceItem = {
      id: `res-${Date.now()}`,
      title,
      category,
      date: new Date().toISOString().split('T')[0],
      description,
      downloadUrl: "#"
    };

    setResources(prev => [newItem, ...prev]);
    setTitle('');
    setDescription('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  const triggerDownload = (item: ResourceItem) => {
    alert(`Downloading "${item.title}" successfully in background! Category: [${item.category}]`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-[10px] font-bold tracking-widest uppercase">
          <FolderOpen size={12} />
          Resource Center
        </div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Swalah Union repository</h2>
        <p className="text-stone-400 text-xs max-w-xl mx-auto leading-relaxed">
          Download PDF curriculum notes, weekly attendance forms, verified completion templates, and budget reports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Search & Listing (2 Col) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between p-4 bg-[#140b07] border border-white/5 rounded-2xl">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1e110a] border border-gold/20 rounded-xl py-2 pl-9 pr-4 text-xs text-white"
              />
              <Search size={14} className="absolute left-3 top-2.5 text-stone-500" />
            </div>

            <div className="flex flex-wrap gap-1.5 justify-start sm:justify-end w-full sm:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    filterCategory === cat ? 'bg-gold/15 text-gold border border-gold/30' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredResources.map((res) => (
              <div key={res.id} className="p-5 bg-stone-900/40 border border-white/5 hover:border-gold/25 rounded-2xl transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-stone-850 text-gold border border-stone-880">
                      {res.category}
                    </span>
                    <span className="text-[10px] text-stone-550 font-mono flex items-center gap-1">
                      <Calendar size={11} /> {res.date}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-100">{res.title}</h4>
                  <p className="text-[11px] text-stone-400 leading-relaxed">{res.description}</p>
                </div>

                <button
                  onClick={() => triggerDownload(res)}
                  className="w-full py-2 bg-[#1c0f0a] border border-[#FFA726]/20 text-[#FFA726] hover:bg-[#FFA726]/10 text-xs font-semibold uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download size={13} />
                  Download File
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Form (1 Col - visible or mocked) */}
        <div className="lg:col-span-1 p-6 glass-panel rounded-2xl border border-gold/15 space-y-4 h-fit">
          {isAdmin ? (
            <>
              <div className="space-y-1">
                <h3 className="text-base font-display font-bold text-white uppercase tracking-wider">Upload Reference Document</h3>
                <p className="text-[11px] text-stone-400">Administration panels to populate study materials or forms.</p>
              </div>

              <form onSubmit={handleAddResource} className="space-y-4">
                <div>
                  <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Document Title</label>
                  <input 
                    type="text"
                    placeholder="E.g., Sanskrit & Kannada Dialect Sheets"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#120a06] border border-gold/20 text-xs text-white rounded-xl px-4 py-2.5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Category Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#120a06] border border-gold/20 text-xs text-stone-400 rounded-xl px-4 py-2.5"
                  >
                    <option value="Study Material">Study Material</option>
                    <option value="Form">Form / Spreadsheet</option>
                    <option value="Report">Union Report</option>
                    <option value="Certificate">Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Details description</label>
                  <textarea 
                    placeholder="File content definitions..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#120a06] border border-gold/20 text-xs text-white rounded-xl px-4 py-2.5 h-20"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-gold text-black font-bold uppercase tracking-wide text-xs rounded-xl cursor-pointer"
                >
                  Confirm File Upload
                </button>
              </form>

              {success && (
                <div className="p-2 bg-emerald-950/20 border border-emerald-500/15 rounded-xl text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <Check size={14} />
                  <span>Record added to reference index successfully!</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <Lock className="mx-auto text-gold/60 h-10 w-10 animate-pulse" />
              <div className="space-y-1.5">
                <p className="text-xs text-white font-bold font-display">Owner Restricted Space</p>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Only the verified Swalah Union Owner can distribute official study notes, reference registries, and certificates.
                </p>
              </div>
              <p className="text-[9px] text-stone-500 font-mono uppercase tracking-wider bg-[#1c110a] px-3 py-1.5 rounded-xl border border-white/5 w-fit mx-auto">
                READ-ONLY DIRECTORY
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
