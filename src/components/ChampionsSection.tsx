import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Award, 
  Medal, 
  Search, 
  Plus, 
  Trash2, 
  Download, 
  X, 
  Sparkles, 
  Filter, 
  Calendar, 
  Flame, 
  ShieldCheck, 
  CheckCircle2, 
  Printer, 
  Star,
  Users,
  Eye,
  TrendingUp,
  Image,
  UserCheck
} from 'lucide-react';
import { Student, Winner, Team } from '../types';

interface ChampionsSectionProps {
  winners: Winner[];
  setWinners: React.Dispatch<React.SetStateAction<Winner[]>>;
  students: Student[];
  teams: Team[];
  isAdmin: boolean;
}

export default function ChampionsSection({
  winners,
  setWinners,
  students,
  teams,
  isAdmin
}: ChampionsSectionProps) {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedPosition, setSelectedPosition] = useState<string>('All');

  // Certificate Modal State
  const [viewingCertificateWinner, setViewingCertificateWinner] = useState<Winner | null>(null);

  // Administrative Add/Edit State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWinner, setNewWinner] = useState({
    studentName: '',
    admissionNumber: '',
    competitionName: '',
    position: 'First' as 'First' | 'Second' | 'Third',
    date: new Date().toISOString().split('T')[0],
    category: 'Quiz Competition' as Winner['category'],
    year: '2026',
    photoUrl: '',
    certificateUrl: ''
  });
  const [addFormError, setAddFormError] = useState('');

  // Categories list as specified
  const categories: Winner['category'][] = [
    'Quiz Competition',
    'Speech Competition',
    'Essay Writing',
    'Poetry Competition',
    'Arabic Symposium',
    'Creative Canvas',
    'Swalah Talent',
    'Sports Events'
  ];

  // Derive Team Name based on student admission number or teamId
  const getStudentTeamName = (winner: Winner) => {
    // 1. Try to find student in main student list to get team ID
    const student = students.find(s => s.admissionNumber === winner.admissionNumber);
    const teamId = student?.teamId || winner.teamId;
    if (teamId) {
      const team = teams.find(t => t.id === teamId);
      return team ? team.name : `Team ${teamId}`;
    }
    return 'General Participant';
  };

  // Filter & Search Winners logic
  const filteredWinners = useMemo(() => {
    return winners.filter(w => {
      const matchQuery = 
        w.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.admissionNumber.toString().includes(searchQuery) ||
        w.competitionName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory = selectedCategory === 'All' || w.category === selectedCategory;
      const matchYear = selectedYear === 'All' || w.year === selectedYear;
      const matchPosition = selectedPosition === 'All' || w.position === selectedPosition;

      return matchQuery && matchCategory && matchYear && matchPosition;
    });
  }, [winners, searchQuery, selectedCategory, selectedYear, selectedPosition]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredWinners.length;
    const gold = filteredWinners.filter(w => w.position === 'First').length;
    const silver = filteredWinners.filter(w => w.position === 'Second').length;
    const bronze = filteredWinners.filter(w => w.position === 'Third').length;
    return { total, gold, silver, bronze };
  }, [filteredWinners]);

  // Handle Registering Winner
  const handleAddWinnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddFormError('');

    if (!newWinner.studentName.trim() || !newWinner.admissionNumber || !newWinner.competitionName.trim()) {
      setAddFormError('Please complete all required fields.');
      return;
    }

    const adNum = parseInt(newWinner.admissionNumber);
    if (isNaN(adNum)) {
      setAddFormError('Admission number must be a valid integer.');
      return;
    }

    // Try to auto-resolve teamId from student database if matching AD.NO is found
    const existingStudent = students.find(s => s.admissionNumber === adNum);
    const resolvedTeamId = existingStudent?.teamId || 1;

    const winnerEntry: Winner = {
      id: `win-${Date.now()}`,
      studentName: newWinner.studentName.toUpperCase(),
      admissionNumber: adNum,
      teamId: resolvedTeamId,
      competitionName: newWinner.competitionName,
      position: newWinner.position,
      date: newWinner.date,
      category: newWinner.category,
      year: newWinner.year,
      photoUrl: newWinner.photoUrl.trim() || undefined,
      certificateUrl: newWinner.certificateUrl.trim() || undefined
    };

    setWinners(prev => [winnerEntry, ...prev]);
    
    // Reset form
    setNewWinner({
      studentName: '',
      admissionNumber: '',
      competitionName: '',
      position: 'First',
      date: new Date().toISOString().split('T')[0],
      category: 'Quiz Competition',
      year: '2026',
      photoUrl: '',
      certificateUrl: ''
    });
    setShowAddForm(false);
  };

  // Track winner ID pending delete confirmation (iframe-friendly, no window.confirm)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Handle deleting a winner
  const handleDeleteWinner = (id: string) => {
    setWinners(prev => prev.filter(w => w.id !== id));
    setDeleteConfirmId(null);
  };

  // Helper to get initials if student doesn't have an avatar photo
  const getInitials = (name: string) => {
    return name.split(' ').filter(n => n && n !== 'MOHAMMAD' && n !== 'MUHAMMAD' && n !== 'AHMED')[0]?.[0] || name[0];
  };

  // Year list helper
  const years = ['2026', '2025'];

  return (
    <div className="space-y-10 animate-fade-in" id="champions-section-root">
      
      {/* 1. HERO HEADER AREA */}
      <div className="relative overflow-hidden glass-panel border border-gold/15 rounded-3xl p-8 md:p-12 text-center space-y-4">
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-orange-highlight/10 blur-3xl pointer-events-none" />
        
        <div className="relative inline-flex items-center justify-center p-3.5 bg-gold/10 rounded-2xl border border-gold/25 text-gold mb-2 shadow-[0_0_20px_rgba(218,165,32,0.15)]">
          <Trophy size={36} className="animate-pulse" />
          <motion.div 
            className="absolute -inset-1 bg-gradient-to-r from-gold/30 to-amber-500/30 rounded-2xl blur opacity-35"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white uppercase">
          SWALAH <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-orange-highlight">CHAMPIONS</span>
        </h1>
        <p className="text-sm md:text-base text-stone-400 font-medium max-w-xl mx-auto">
          Celebrating excellence, talent, and achievement. Honors board for outstanding performers of Swalah Union.
        </p>

        {/* Counts statistics widget */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-white/5 mt-6 font-mono">
          <div className="bg-black/30 border border-white/5 rounded-xl p-3 text-center">
            <span className="block text-[10px] text-stone-500 uppercase tracking-widest">Total Honors</span>
            <strong className="text-lg text-white font-bold">{stats.total} Winners</strong>
          </div>
          <div className="bg-gold/5 border border-gold/15 rounded-xl p-3 text-center">
            <span className="block text-[10px] text-gold/80 uppercase tracking-widest">🥇 Gold Place</span>
            <strong className="text-lg text-gold font-bold">{stats.gold} Records</strong>
          </div>
          <div className="bg-slate-400/5 border border-slate-500/15 rounded-xl p-3 text-center">
            <span className="block text-[10px] text-stone-400 uppercase tracking-widest">🥈 Silver Place</span>
            <strong className="text-lg text-stone-300 font-bold">{stats.silver} Records</strong>
          </div>
          <div className="bg-amber-800/5 border border-amber-700/15 rounded-xl p-3 text-center">
            <span className="block text-[10px] text-amber-500 uppercase tracking-widest">🥉 Bronze Place</span>
            <strong className="text-lg text-amber-600 font-bold">{stats.bronze} Records</strong>
          </div>
        </div>
      </div>

      {/* 2. ADMIN CREATION PANEL BUTTON */}
      {isAdmin && (
        <div className="flex justify-end" id="admin-winner-trigger-container">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-highlight text-black font-semibold text-xs uppercase tracking-wide transition-all shadow-[0_4px_20px_rgba(218,165,32,0.25)] cursor-pointer"
          >
            {showAddForm ? <X size={15} /> : <Plus size={15} />}
            <span>{showAddForm ? 'Cancel Add Form' : 'Register New Winner'}</span>
          </button>
        </div>
      )}

      {/* ADMINISTRATIVE NEW WINNER FORM */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="glass-panel border-2 border-gold/20 rounded-2xl p-6 space-y-6"
            id="winner-registration-form-container"
          >
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <UserCheck className="text-gold" size={18} />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Register Champion Achievement</h3>
                <p className="text-[10px] text-stone-400">Add a student winner to the public Swalah Honors Hall of Fame</p>
              </div>
            </div>

            {addFormError && (
              <div className="p-3 bg-red-950/30 border border-red-500/20 rounded-xl text-red-400 text-xs">
                {addFormError}
              </div>
            )}

            <form onSubmit={handleAddWinnerSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              <div>
                <label className="block text-[10px] text-stone-400 uppercase font-mono tracking-wider mb-1.5">Full Name of Student</label>
                <input
                  type="text"
                  placeholder="E.g., AHMED NABEEL"
                  value={newWinner.studentName}
                  onChange={(e) => setNewWinner({ ...newWinner, studentName: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-stone-400 uppercase font-mono tracking-wider mb-1.5">Admission Number</label>
                <input
                  type="number"
                  placeholder="E.g., 288"
                  value={newWinner.admissionNumber}
                  onChange={(e) => setNewWinner({ ...newWinner, admissionNumber: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-stone-400 uppercase font-mono tracking-wider mb-1.5">Competition Name</label>
                <input
                  type="text"
                  placeholder="E.g., Annual Islamic Quiz Bowl"
                  value={newWinner.competitionName}
                  onChange={(e) => setNewWinner({ ...newWinner, competitionName: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-stone-400 uppercase font-mono tracking-wider mb-1.5">Award Position</label>
                <select
                  value={newWinner.position}
                  onChange={(e) => setNewWinner({ ...newWinner, position: e.target.value as any })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                >
                  <option value="First">🥇 First Place (Gold Medal)</option>
                  <option value="Second">🥈 Second Place (Silver Medal)</option>
                  <option value="Third">🥉 Third Place (Bronze Medal)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-stone-400 uppercase font-mono tracking-wider mb-1.5">Category System</label>
                <select
                  value={newWinner.category}
                  onChange={(e) => setNewWinner({ ...newWinner, category: e.target.value as any })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-stone-400 uppercase font-mono tracking-wider mb-1.5">Achievement Date</label>
                <input
                  type="date"
                  value={newWinner.date}
                  onChange={(e) => setNewWinner({ ...newWinner, date: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-stone-400 uppercase font-mono tracking-wider mb-1.5">Academic Year</label>
                <select
                  value={newWinner.year}
                  onChange={(e) => setNewWinner({ ...newWinner, year: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                >
                  <option value="2026">2026 (Current Academic Session)</option>
                  <option value="2025">2025 (Previous Session)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-stone-400 uppercase font-mono tracking-wider mb-1.5">Custom Photo URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newWinner.photoUrl}
                  onChange={(e) => setNewWinner({ ...newWinner, photoUrl: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] text-stone-400 uppercase font-mono tracking-wider mb-1.5">Certificate Download URL (Optional)</label>
                <input
                  type="text"
                  placeholder="Optional Google Drive link"
                  value={newWinner.certificateUrl}
                  onChange={(e) => setNewWinner({ ...newWinner, certificateUrl: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="md:col-span-3 pt-3 flex justify-end">
                <button
                  type="submit"
                  className="bg-gold text-black hover:bg-gold-highlight px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(218,165,32,0.15)] cursor-pointer"
                >
                  Verify and Register Winner
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. SEARCH & FILTERS BOX */}
      <div className="p-6 bg-stone-950/60 border border-white/5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search winner name, AD.NO, competition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#140b07] border border-gold/15 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
          />
          <Search className="absolute left-3 top-2.5 text-stone-500" size={14} />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-stone-500 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters select block */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
          {/* Program / Category */}
          <div className="flex items-center gap-1.5 bg-stone-900 border border-white/10 px-2.5 py-1 rounded-xl">
            <Filter size={11} className="text-gold" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent border-none text-[11px] text-stone-200 outline-none pr-1.5"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Position */}
          <div className="flex items-center gap-1.5 bg-stone-900 border border-white/10 px-2.5 py-1 rounded-xl">
            <Award size={11} className="text-gold" />
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="bg-transparent border-none text-[11px] text-stone-200 outline-none pr-1.5"
            >
              <option value="All">All Positions</option>
              <option value="First">🥇 First Place</option>
              <option value="Second">🥈 Second Place</option>
              <option value="Third">🥉 Third Place</option>
            </select>
          </div>

          {/* Year */}
          <div className="flex items-center gap-1.5 bg-stone-900 border border-white/10 px-2.5 py-1 rounded-xl">
            <Calendar size={11} className="text-gold" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent border-none text-[11px] text-stone-200 outline-none pr-1.5"
            >
              <option value="All">All Years</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. CHAMPIONS DISPLAY GRID */}
      {filteredWinners.length === 0 ? (
        <div className="text-center py-20 bg-stone-950/25 border border-white/5 rounded-3xl space-y-4">
          <Trophy size={48} className="mx-auto text-stone-600 opacity-30" />
          <h3 className="text-base font-bold text-stone-400 uppercase tracking-wider">No achievement archives found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your category search filters or select a different academic session year.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="champions-grid">
          {filteredWinners.map((w, index) => {
            const isFirst = w.position === 'First';
            const isSecond = w.position === 'Second';
            const isThird = w.position === 'Third';

            // Get background themes based on position
            const cardTheme = isFirst 
              ? 'border-gold/30 bg-gradient-to-b from-[#1c1209] to-[#0f0a05] shadow-[0_4px_30px_rgba(218,165,32,0.08)] hover:shadow-[0_4px_30px_rgba(218,165,32,0.18)] hover:border-gold/60' 
              : isSecond 
                ? 'border-slate-500/20 bg-gradient-to-b from-[#131317] to-[#0b0c0e] shadow-[0_4px_30px_rgba(148,163,184,0.04)] hover:shadow-[0_4px_30px_rgba(148,163,184,0.12)] hover:border-slate-500/40' 
                : 'border-amber-800/20 bg-gradient-to-b from-[#150f0d] to-[#0d0908] shadow-[0_4px_30px_rgba(217,119,6,0.03)] hover:shadow-[0_4px_30px_rgba(217,119,6,0.08)] hover:border-amber-700/40';

            const tagTheme = isFirst
              ? 'bg-gold/15 text-gold border-gold/25'
              : isSecond
                ? 'bg-slate-500/15 text-slate-300 border-slate-500/25'
                : 'bg-amber-800/15 text-amber-500 border-amber-800/25';

            const spotlightGradient = isFirst
              ? 'from-gold/5 via-gold/0 to-transparent'
              : isSecond
                ? 'from-slate-400/5 via-slate-400/0 to-transparent'
                : 'from-amber-600/5 via-amber-600/0 to-transparent';

            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.4) }}
                className={`relative overflow-hidden border rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between h-full group ${cardTheme}`}
              >
                {/* Spotlight Shine effect */}
                <div className={`absolute top-0 inset-x-0 h-40 bg-gradient-to-b ${spotlightGradient} pointer-events-none`} />

                {/* Confetti or Trophy Shine particles effect (First place only) */}
                {isFirst && (
                  <div className="absolute top-2 right-2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity flex gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
                    <span className="w-1 h-1 rounded-full bg-orange-highlight animate-pulse" />
                  </div>
                )}

                <div>
                  {/* Top Badge header row */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/5 relative z-10">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">{w.category}</span>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${tagTheme}`}>
                      {isFirst ? '🥇 GOLD CARD' : isSecond ? '🥈 SILVER CARD' : '🥉 BRONZE CARD'}
                    </span>
                  </div>

                  {/* Winner card identity core block */}
                  <div className="flex items-center gap-4 py-5 relative z-10">
                    {/* Student Photo or Initials Badge */}
                    {w.photoUrl ? (
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shrink-0 relative shadow-md">
                        <img 
                          src={w.photoUrl} 
                          alt={w.studentName} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                    ) : (
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border text-white font-display text-xl font-black shrink-0 relative overflow-hidden group shadow-md bg-gradient-to-br ${
                        w.teamId === 1 
                          ? 'from-amber-600 to-amber-900 border-amber-500/30' 
                          : w.teamId === 2 
                            ? 'from-orange-600 to-amber-950 border-orange-500/30' 
                            : 'from-yellow-600 to-yellow-950 border-yellow-500/30'
                      }`}>
                        <span>{getInitials(w.studentName)}</span>
                        {/* ID Tag */}
                        <div className="absolute bottom-0 inset-x-0 bg-black/50 py-0.5 text-center text-[8px] tracking-wider font-mono text-gold font-bold">
                          #{w.admissionNumber}
                        </div>
                      </div>
                    )}

                    {/* Text Details */}
                    <div className="space-y-1 truncate">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-white tracking-tight truncate uppercase" title={w.studentName}>
                          {w.studentName}
                        </h3>
                        {isFirst && <Sparkles size={11} className="text-gold shrink-0 animate-bounce" />}
                      </div>
                      
                      <p className="text-[11px] text-stone-400 font-medium">
                        Ad. No: <span className="font-mono text-white text-xs font-semibold">#{w.admissionNumber}</span>
                      </p>
                      
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                        <Users size={10} className="text-stone-600" />
                        <span>{getStudentTeamName(w)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Achievement Specific Details with Custom Spotlight Icon */}
                  <div className="p-4 bg-black/25 border border-white/5 rounded-2xl space-y-2 relative z-10">
                    <div className="flex items-center gap-2 text-xs font-semibold text-stone-200">
                      {isFirst ? (
                        <Trophy size={14} className="text-gold shrink-0" />
                      ) : isSecond ? (
                        <Medal size={14} className="text-slate-400 shrink-0" />
                      ) : (
                        <Award size={14} className="text-amber-600 shrink-0" />
                      )}
                      <span className={isFirst ? 'text-gold' : isSecond ? 'text-slate-300' : 'text-amber-500'}>
                        {w.position.toUpperCase()} PLACE WINNER
                      </span>
                    </div>

                    <p className="text-xs text-white font-medium leading-snug font-sans">
                      {w.competitionName}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono pt-1.5 border-t border-white/5">
                      <span>Date: {w.date}</span>
                      <span className="text-gold">Session {w.year}</span>
                    </div>
                  </div>
                </div>

                {/* Footer buttons row */}
                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/5 relative z-10">
                  {/* Certificate generator trigger */}
                  <button
                    onClick={() => setViewingCertificateWinner(w)}
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-3.5 py-2 rounded-xl bg-white/5 hover:bg-gold/10 hover:text-gold border border-white/5 hover:border-gold/20 text-stone-300 transition-all cursor-pointer"
                  >
                    <Download size={11} />
                    <span>Get Certificate</span>
                  </button>

                  {/* Admin actions */}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5">
                      {deleteConfirmId === w.id ? (
                        <div className="flex items-center gap-1 bg-red-950/40 border border-red-500/30 rounded-xl p-1 pr-2">
                          <button
                            onClick={() => handleDeleteWinner(w.id)}
                            className="text-[9px] font-bold uppercase text-red-400 hover:text-red-300 px-2 py-1 bg-red-500/10 rounded-lg cursor-pointer transition-all animate-pulse"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-[9px] font-bold uppercase text-stone-400 hover:text-white px-1.5 py-1 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(w.id)}
                          className="p-2 rounded-xl border border-stone-800 text-stone-400 hover:text-red-400 hover:border-red-500/20 hover:bg-red-950/20 transition-all cursor-pointer"
                          title="Delete achievement"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 5. HALL OF FAME LEGENDARY BOARD */}
      <div className="glass-panel border border-gold/15 rounded-3xl p-8 space-y-6 relative overflow-hidden" id="hall-of-fame-panel">
        <div className="absolute top-0 right-0 p-6 text-gold/10 select-none">
          <Star size={100} className="stroke-[1]" />
        </div>
        
        <div className="space-y-2 relative z-10">
          <h2 className="text-xl font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="text-gold" size={18} />
            <span>SPECIAL HALL OF FAME</span>
          </h2>
          <p className="text-xs text-stone-400 max-w-xl">
            Commemorating legacy record-breakers and major contest series winners. These achievers reflect Swalah Union's commitment to leadership, values, and scholarship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 relative z-10">
          {/* Hall of fame card 1 */}
          <div className="p-4 bg-stone-900/40 border border-gold/15 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center text-gold">
                <Trophy size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase font-mono">Grand Debater of Swalah</h4>
                <p className="text-[10px] text-stone-400">Class of 2026</p>
              </div>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed italic">
              "Awarded to Ahmed Nabeel for constant leadership across Arabic and bilingual study debates."
            </p>
          </div>

          {/* Hall of fame card 2 */}
          <div className="p-4 bg-stone-900/40 border border-gold/15 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center text-gold">
                <Flame size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase font-mono">Swalah Brainiac Champion</h4>
                <p className="text-[10px] text-stone-400">Class of 2026</p>
              </div>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed italic">
              "Awarded to Ahmed Nazim for achieving absolute clean sweeps across local and wing trivia rounds."
            </p>
          </div>

          {/* Hall of fame card 3 */}
          <div className="p-4 bg-stone-900/40 border border-gold/15 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center text-gold">
                <Star size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase font-mono">Aesthetic Master of Canvas</h4>
                <p className="text-[10px] text-stone-400">Class of 2026</p>
              </div>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed italic">
              "Awarded to Mohammad Hasan Shanid for outstanding digital and acrylic canvas layout conceptualizations."
            </p>
          </div>
        </div>
      </div>

      {/* 6. DYNAMIC CERTIFICATE GENERATOR OVERLAY MODAL */}
      <AnimatePresence>
        {viewingCertificateWinner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-3xl overflow-hidden glass-panel border border-gold/30 rounded-2xl relative z-10 font-sans p-6 space-y-6 bg-stone-950 shadow-[0_0_50px_rgba(218,165,32,0.15)]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setViewingCertificateWinner(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-gold/20 text-stone-300 hover:text-gold transition-colors z-20 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="text-center">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Swalah Verification Core</h3>
                <p className="text-[10px] text-stone-400 font-mono">Real-time certificate visualizer & download manager</p>
              </div>

              {/* Certificate Template Container */}
              <div 
                id="printable-certificate-body"
                className="relative bg-[#faf7f2] text-[#2c1d11] p-8 md:p-12 rounded-xl border-4 border-[#c5a880] shadow-inner text-center space-y-6 min-h-[420px] select-none mx-auto max-w-2xl overflow-hidden"
                style={{ backgroundImage: 'radial-gradient(#f0e9dd 1px, transparent 1px)', backgroundSize: '20px 20px' }}
              >
                {/* Border line ornament */}
                <div className="absolute inset-2 border border-[#d6c4a8] pointer-events-none" />
                <div className="absolute inset-3 border-2 border-[#c5a880] pointer-events-none" />

                {/* Corner Ornaments */}
                <div className="absolute top-4 left-4 text-[#c5a880] font-black text-xs">◆</div>
                <div className="absolute top-4 right-4 text-[#c5a880] font-black text-xs">◆</div>
                <div className="absolute bottom-4 left-4 text-[#c5a880] font-black text-xs">◆</div>
                <div className="absolute bottom-4 right-4 text-[#c5a880] font-black text-xs">◆</div>

                {/* Heading */}
                <div className="space-y-1 relative z-10">
                  <div className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#8c6d3e]">
                    SWALAH UNION ACADEMIC COUNCIL
                  </div>
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-[#44301d] tracking-wide uppercase">
                    Certificate of Achievement
                  </h2>
                  <div className="w-24 h-0.5 bg-[#c5a880] mx-auto mt-2" />
                </div>

                {/* Subtitle wording */}
                <p className="text-xs italic text-[#6e5841] font-serif">
                  This document is officially registered to certify and celebrate that
                </p>

                {/* Recipient */}
                <div className="space-y-1 relative z-10">
                  <h3 className="text-lg md:text-xl font-sans font-black tracking-tight text-[#1c1006] uppercase underline decoration-[#c5a880] decoration-2 underline-offset-4">
                    {viewingCertificateWinner.studentName}
                  </h3>
                  <p className="text-[10px] font-mono font-bold text-[#8c6d3e]">
                    ADMISSION NO. #{viewingCertificateWinner.admissionNumber} • {getStudentTeamName(viewingCertificateWinner)}
                  </p>
                </div>

                {/* Body Details */}
                <div className="space-y-3 max-w-lg mx-auto relative z-10 text-xs text-[#523e2b] leading-relaxed">
                  <p>
                    has successfully achieved the distinction of <strong className="text-[#96723b] uppercase font-bold">{viewingCertificateWinner.position} Place</strong> in the competitive event
                  </p>
                  <p className="font-serif font-bold text-sm text-[#3b2715] italic">
                    "{viewingCertificateWinner.competitionName}"
                  </p>
                  <p>
                    conducted under the auspices of Swalah Union on <strong className="text-[#3b2715]">{viewingCertificateWinner.date}</strong>.
                  </p>
                </div>

                {/* Signatures & Seal stamp */}
                <div className="grid grid-cols-3 items-end pt-6 gap-2 text-[9px] font-mono uppercase tracking-wider text-[#6e5841] relative z-10">
                  
                  {/* Authorized Sign 1 */}
                  <div className="space-y-1 text-center">
                    <span className="font-serif italic text-xs block text-[#3b2715] select-none font-bold">Ahmed Nabeel</span>
                    <div className="border-t border-[#c5a880] pt-1 text-[8px]">
                      President, Swalah
                    </div>
                  </div>

                  {/* Stamp Seal */}
                  <div className="flex justify-center select-none">
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#b68a4e] flex items-center justify-center text-[#b68a4e] rotate-12 text-[8px] font-bold tracking-tight bg-white/20">
                      <div className="text-center font-serif leading-none">
                        SWALAH<br/>
                        <span className="text-[6px]">SEAL</span>
                      </div>
                    </div>
                  </div>

                  {/* Authorized Sign 2 */}
                  <div className="space-y-1 text-center">
                    <span className="font-serif italic text-xs block text-[#3b2715] select-none font-bold">Altahf Rahman</span>
                    <div className="border-t border-[#c5a880] pt-1 text-[8px]">
                      Secretary, Swalah
                    </div>
                  </div>
                </div>
              </div>

              {/* PDF & Printer trigger button */}
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const printContents = document.getElementById('printable-certificate-body')?.outerHTML;
                    if (!printContents) return;
                    
                    const win = window.open('', '_blank');
                    if (win) {
                      win.document.write(`
                        <html>
                          <head>
                            <title>Certificate - ${viewingCertificateWinner.studentName}</title>
                            <script src="https://cdn.tailwindcss.com"></script>
                            <style>
                              @media print {
                                body { margin: 0; padding: 20px; }
                                .no-print { display: none; }
                              }
                            </style>
                          </head>
                          <body class="bg-white flex items-center justify-center min-h-screen">
                            <div class="scale-110">
                              ${printContents}
                            </div>
                            <script>
                              window.onload = function() {
                                window.print();
                                setTimeout(function() { window.close(); }, 500);
                              };
                            </script>
                          </body>
                        </html>
                      `);
                      win.document.close();
                    } else {
                      alert("Please allow popups to print the certificate directly.");
                    }
                  }}
                  className="flex items-center gap-2 bg-gold text-black hover:bg-[#FF8C00] px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print Certificate</span>
                </button>
                <button
                  onClick={() => setViewingCertificateWinner(null)}
                  className="px-5 py-2.5 bg-stone-900 border border-white/10 hover:bg-stone-800 rounded-xl text-xs font-semibold uppercase tracking-wide text-white transition-all cursor-pointer"
                >
                  Close Visualizer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
