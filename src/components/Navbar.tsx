import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, X, ShieldAlert, Globe, GraduationCap, ChevronDown, Check, UserCheck, LayoutDashboard } from 'lucide-react';
import { Student } from '../types';

interface NavbarProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  onAdminToggle: () => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
}

export default function Navbar({
  students,
  onSelectStudent,
  activeTab,
  setActiveTab,
  isAdmin,
  onAdminToggle,
  selectedLanguage,
  setSelectedLanguage
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  // Filter student matching both AD.NO and name
  const filteredSuggestions = searchQuery.trim() === ''
    ? []
    : students.filter(student => {
        const query = searchQuery.toLowerCase();
        return (
          student.admissionNumber.toString().includes(query) ||
          student.fullName.toLowerCase().includes(query)
        );
      }).slice(0, 6);

  const handleSelectSuggestion = (student: Student) => {
    onSelectStudent(student);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'committee', label: 'Committee' },
    { id: 'teams', label: 'Teams' },
    { id: 'wings', label: 'Wings' },
    { id: 'programs', label: 'Programs' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'champions', label: 'Champions' }
  ];

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'AR', name: 'العربية (Arabic)' },
    { code: 'UR', name: 'اردو (Urdu)' },
    { code: 'KN', name: 'ಕನ್ನಡ (Kannada)' }
  ];

  const currentLangLabel = languages.find(l => l.code === selectedLanguage)?.name || 'English';

  return (
    <nav className="sticky top-0 z-40 bg-[#120a06]/85 backdrop-blur-md border-b border-gold/15 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setActiveTab('home')}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-highlight to-gold flex items-center justify-center shadow-[0_0_15px_rgba(255,140,0,0.4)] border border-white/20">
              <span className="font-display font-extrabold text-white text-base">SW</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-display font-bold tracking-wider leading-none text-sm">SWALAH</span>
              <span className="text-[10px] text-gold tracking-widest font-mono font-bold">EST. 2026</span>
            </div>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 outline-none ${
                  activeTab === item.id
                    ? 'text-gold bg-gold/10 border-b-2 border-gold font-bold shadow-[inset_0_-4px_10px_rgba(255,167,38,0.1)]'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/40'
                }`}
                id={`nav-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop Right Panel: Search, Lang, Admin Panel */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Smart Search Bar */}
            <div ref={searchRef} className="relative w-48 xl:w-60">
              <div className="relative">
                <input
                  type="text"
                  placeholder="AD.NO or student name..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-[#180f0a] border border-gold/25 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
                <Search className="absolute left-2.5 top-2 text-stone-500" size={14} />
              </div>

              {/* Suggestions dropdown */}
              {showSuggestions && searchQuery.trim() !== '' && (
                <div className="absolute right-0 top-11 w-64 bg-[#140b07] border border-gold/30 rounded-xl overflow-hidden shadow-2xl z-50">
                  <div className="px-3 py-1.5 bg-[#1e110a] text-[10px] font-mono text-gold/80 border-b border-white/5 uppercase">
                    Auto-suggestions
                  </div>
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((s) => (
                      <button
                        key={s.admissionNumber}
                        onClick={() => handleSelectSuggestion(s)}
                        className="w-full text-left px-3 py-2.5 hover:bg-[#25150d] border-b border-white/5 last:border-0 flex items-center justify-between transition-colors group"
                      >
                        <div className="flex flex-col">
                          <span className="text-white text-xs font-semibold group-hover:text-gold transition-colors">
                            {s.fullName}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            AD: <strong className="text-gold font-bold">{s.admissionNumber}</strong> • {s.role || 'Member'}
                          </span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold/10 text-gold font-mono uppercase group-hover:bg-gold/20">
                          Profile
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-xs text-stone-500 italic">
                      Student Not Found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Language Dropdown */}
            <div ref={languageRef} className="relative">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#180f0a] border border-stone-800 hover:border-gold/30 rounded-xl text-stone-300 hover:text-white text-xs transition-all"
              >
                <Globe size={13} className="text-gold" />
                <span className="font-mono">{selectedLanguage}</span>
                <ChevronDown size={12} className="text-stone-500" />
              </button>

              {languageMenuOpen && (
                <div className="absolute right-0 top-10 w-44 bg-[#140b07] border border-gold/25 rounded-xl shadow-2xl overflow-hidden z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setSelectedLanguage(l.code);
                        setLanguageMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-stone-300 hover:text-white hover:bg-[#20110a] flex items-center justify-between"
                    >
                      <span>{l.name}</span>
                      {selectedLanguage === l.code && <Check size={12} className="text-gold" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Menu Button (Always visible) */}
            <button
              onClick={onAdminToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isAdmin 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                  : 'bg-gold/10 text-gold border-gold/30 hover:bg-gold/20 shadow-[0_0_15px_rgba(218,165,32,0.1)]'
              }`}
              id="admin-login-button"
            >
              <span>{isAdmin ? 'Admin Terminal' : 'Admin Login'}</span>
            </button>

          </div>

          {/* Mobile Menu Icon */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onAdminToggle}
              className={`p-1.5 px-2.5 rounded-lg border text-xs font-bold transition-all ${
                isAdmin
                  ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5 animate-pulse'
                  : 'text-gold border-gold/30 bg-gold/5 hover:bg-gold/15'
              }`}
            >
              <span>{isAdmin ? 'Admin' : 'Login'}</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg border border-gold/20 text-stone-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Options */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#160d08]/95 border-b border-gold/15 px-4 py-4 space-y-4">
          
          {/* Mobile Smart Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search AD.NO or Name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-[#1e110a] border border-gold/20 rounded-xl py-2 pl-9 pr-3 text-xs text-white"
            />
            <Search className="absolute left-3 top-2.5 text-stone-500" size={13} />

            {searchQuery.trim() !== '' && (
              <div className="absolute left-0 right-0 top-11 bg-[#140b07] border border-gold/30 rounded-xl shadow-2xl z-50">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((s) => (
                    <button
                      key={s.admissionNumber}
                      onClick={() => {
                        handleSelectSuggestion(s);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 bg-[#1c0f0a] hover:bg-[#25150d] border-b border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="text-white font-medium">{s.fullName}</p>
                        <p className="text-[10px] text-stone-500 font-mono">AD #{s.admissionNumber}</p>
                      </div>
                      <span className="text-[10px] text-gold uppercase text-semibold">View</span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-3 text-center text-xs text-stone-500 italic">
                    Student Not Found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 rounded-lg text-xs font-medium text-left transition-all ${
                  activeTab === item.id
                    ? 'bg-gold/10 text-gold border-l-2 border-gold font-bold'
                    : 'text-stone-300 bg-stone-900/30'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Language / Admin Toggles */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
            <div className="flex gap-1.5">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setSelectedLanguage(l.code)}
                  className={`px-2 py-1 rounded font-mono ${
                    selectedLanguage === l.code ? 'bg-gold/10 text-gold font-bold' : 'text-stone-500'
                  }`}
                >
                  {l.code}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                onAdminToggle();
                setMobileMenuOpen(false);
              }}
              className={`font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all ${
                isAdmin
                  ? 'text-emerald-400 hover:text-emerald-350 bg-emerald-500/10 border-emerald-500/20'
                  : 'text-gold hover:text-amber-400 bg-gold/10 border-gold/20'
              }`}
            >
              <span>{isAdmin ? 'Admin Terminal' : 'Admin Portal'}</span>
              <ShieldAlert size={12} className={isAdmin ? 'text-emerald-400' : 'text-gold'} />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
