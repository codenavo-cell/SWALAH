import React, { useState } from 'react';
import { Search, Filter, Calendar, MapPin, Users, Ticket, Check, X, AlertCircle, Plus, Edit2, Trash2 } from 'lucide-react';
import { Program, Student } from '../types';

interface ProgramsSectionProps {
  programs: Program[];
  setPrograms: React.Dispatch<React.SetStateAction<Program[]>>;
  students: Student[];
  isAdmin?: boolean;
}

export default function ProgramsSection({ programs, setPrograms, students, isAdmin }: ProgramsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWing, setSelectedWing] = useState<string>('All');
  
  // Registration popup states
  const [selectedRegProg, setSelectedRegProg] = useState<Program | null>(null);
  const [regAdNo, setRegAdNo] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Admin Manage forms
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formVenue, setFormVenue] = useState('');
  const [formCategory, setFormCategory] = useState<string>('General');
  const [formTeamId, setFormTeamId] = useState<string>('');
  const [formStatus, setFormStatus] = useState<string>('Upcoming');

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtering logic
  const filteredPrograms = programs.filter(prog => {
    const matchesSearch = prog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prog.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWing = selectedWing === 'All' || prog.category === selectedWing;
    return matchesSearch && matchesWing;
  });

  const wingsList = ['All', 'Arabic', 'English', 'Urdu', 'Kannada', 'General'];

  const handleOpenRegistration = (prog: Program) => {
    setSelectedRegProg(prog);
    setRegAdNo('');
    setRegError('');
    setRegSuccess('');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRegProg) return;

    const adNoNum = Number(regAdNo);
    const matchedStudent = students.find(s => s.admissionNumber === adNoNum);

    if (!matchedStudent) {
      setRegError(`Verification failed: Student AD #{${regAdNo}} does not exist in the class database.`);
      return;
    }

    // Check if copy has already registered
    const alreadyRegistered = selectedRegProg.registeredUsers?.includes(adNoNum);
    if (alreadyRegistered) {
      setRegError(`Notification: ${matchedStudent.fullName} is already registered for this program!`);
      return;
    }

    // append user to programs state
    setPrograms(prev => prev.map(p => {
      if (p.id === selectedRegProg.id) {
        return {
          ...p,
          registeredUsers: [...(p.registeredUsers || []), adNoNum]
        };
      }
      return p;
    }));

    setRegError('');
    setRegSuccess(`Congratulations! ${matchedStudent.fullName} has been successfully registered for "${selectedRegProg.title}".`);
    
    // Quick refresh of popup copy
    setSelectedRegProg(prev => prev ? {
      ...prev,
      registeredUsers: [...(prev.registeredUsers || []), adNoNum]
    } : null);
  };

  // Admin logic
  const openAddProgram = () => {
    setEditingProgram(null);
    setFormTitle('');
    setFormDesc('');
    setFormDate(new Date().toISOString().substring(0, 10));
    setFormVenue('Campus Center Hall');
    setFormCategory('General');
    setFormTeamId('1');
    setFormStatus('Registration Open');
    setIsFormOpen(true);
  };

  const openEditProgram = (prog: Program) => {
    setEditingProgram(prog);
    setFormTitle(prog.title);
    setFormDesc(prog.description);
    setFormDate(prog.date);
    setFormVenue(prog.venue || '');
    setFormCategory(prog.category);
    setFormTeamId(prog.assignedTeamId ? prog.assignedTeamId.toString() : '');
    setFormStatus(prog.status);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProgram) {
      // Edit
      setPrograms(prev => prev.map(p => p.id === editingProgram.id ? {
        ...p,
        title: formTitle,
        description: formDesc,
        date: formDate,
        venue: formVenue,
        category: formCategory as any,
        assignedTeamId: formTeamId ? Number(formTeamId) : undefined,
        status: formStatus as any
      } : p));
    } else {
      // Create
      const newProg: Program = {
        id: `prog-${Date.now()}`,
        title: formTitle,
        description: formDesc,
        date: formDate,
        venue: formVenue,
        category: formCategory as any,
        assignedTeamId: formTeamId ? Number(formTeamId) : undefined,
        status: formStatus as any,
        registeredUsers: []
      };
      setPrograms(prev => [newProg, ...prev]);
    }
    setIsFormOpen(false);
  };

  const handleDeleteProgram = (id: string) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 glass-panel rounded-2xl border border-white/5">
        {/* Search Bar + Add New */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#160d09] border border-gold/20 rounded-xl py-2 pl-9 pr-4 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-gold"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-stone-500" />
          </div>

          {isAdmin && (
            <button
              onClick={openAddProgram}
              className="px-4 py-2 bg-gradient-to-r from-orange-highlight to-gold text-black rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 hover:brightness-110 cursor-pointer"
            >
              <Plus size={14} /> Add Program
            </button>
          )}
        </div>

        {/* Categories togglers */}
        <div className="flex flex-wrap gap-1 w-full md:w-auto justify-start md:justify-end">
          {wingsList.map((wing) => (
            <button
              key={wing}
              onClick={() => setSelectedWing(wing)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedWing === wing 
                  ? 'bg-gold/15 text-gold border border-gold/40' 
                  : 'text-stone-400 bg-stone-900/30 hover:text-stone-200 border border-transparent'
              }`}
            >
              {wing}
            </button>
          ))}
        </div>
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPrograms.map((prog) => (
          <div 
            key={prog.id}
            className={`p-6 glass-panel rounded-2xl border flex flex-col justify-between space-y-4 relative ${
              prog.status === 'Registration Open' ? 'border-[#FF8C00]/30' : 'border-white/5'
            }`}
          >
            {/* Quick Edit overlays for admins */}
            {isAdmin && (
              <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
                <button
                  onClick={() => openEditProgram(prog)}
                  className="p-1 px-1.5 rounded-lg bg-stone-900/80 hover:bg-gold/15 text-stone-300 hover:text-gold border border-white/5 transition-colors cursor-pointer"
                  title="Edit Program Details"
                >
                  <Edit2 size={11} />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(prog.id)}
                  className="p-1 px-1.5 rounded-lg bg-stone-900/80 hover:bg-red-500/10 text-stone-300 hover:text-red-400 border border-white/5 transition-colors cursor-pointer"
                  title="Delete Program"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            )}

            <div className="space-y-3">
              {/* Category, Status tags */}
              <div className="flex items-center justify-between pr-14">
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-gold/15 text-gold border border-gold/25">
                  {prog.category} Wing
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  prog.status === 'Registration Open' ? 'bg-orange-highlight/15 text-orange-highlight border border-orange-highlight/25' :
                  prog.status === 'Completed' ? 'bg-[#555]/10 text-stone-400 border border-stone-800' :
                  'bg-gold/10 text-gold border border-gold/20'
                }`}>
                  {prog.status}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white leading-snug">{prog.title}</h3>
                <p className="text-stone-300 text-xs leading-relaxed">{prog.description}</p>
              </div>

              {/* Time Location details */}
              <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-stone-500 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar size={12} className="text-gold" />
                  {prog.date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-gold" />
                  {prog.venue || 'TBD'}
                </span>
                {prog.assignedTeamId && (
                  <span className="flex items-center gap-1">
                    <Users size={12} className="text-gold" />
                    Duty: Team {prog.assignedTeamId}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Row: Register/Show stats */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              
              <div className="text-[10px] text-stone-500 font-mono">
                {prog.registeredUsers ? (
                  <span>Registered: <strong className="text-white">{prog.registeredUsers.length}</strong> students</span>
                ) : (
                  <span>General session attendance</span>
                )}
              </div>

              {prog.status === 'Registration Open' ? (
                <button
                  onClick={() => handleOpenRegistration(prog)}
                  className="px-4 py-2 bg-[#FF8C00] hover:bg-gold text-black rounded-xl text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors"
                >
                  Register Now
                </button>
              ) : (
                <span className="text-[10px] text-stone-600 font-bold uppercase">{prog.status === 'Completed' ? 'Completed' : 'Closed'}</span>
              )}

            </div>
          </div>
        ))}
      </div>

      {/* Online registration popup */}
      {selectedRegProg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="absolute inset-0" onClick={() => setSelectedRegProg(null)} />
          
          <div className="w-full max-w-md bg-[#180f0a] border border-gold/30 rounded-2xl p-6 md:p-8 relative z-10 space-y-6">
            <button 
              onClick={() => setSelectedRegProg(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono font-bold text-gold bg-gold/10 px-2 py-0.5 rounded">
                PROGRAM REGISTRATION SYSTEM
              </span>
              <h3 className="text-lg font-display font-bold text-white mt-1.5">{selectedRegProg.title}</h3>
              <p className="text-xs text-stone-400">Validate class credentials and book seat immediately.</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-stone-400 mb-1">Enter your Admission Number (AD.NO)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="E.g., 288"
                    value={regAdNo}
                    onChange={(e) => setRegAdNo(e.target.value)}
                    className="flex-1 bg-[#120a06] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white shadow-inner focus:outline-none focus:border-gold"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gold hover:bg-[#FF8C00] text-black font-bold uppercase tracking-wide text-xs px-5 rounded-xl cursor-pointer"
                  >
                    Register
                  </button>
                </div>
              </div>
            </form>

            {regError && (
              <div className="p-3 bg-red-950/20 border border-red-500/15 rounded-xl text-xs text-red-400 flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{regError}</span>
              </div>
            )}

            {regSuccess && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/15 rounded-xl text-xs text-emerald-400 flex items-start gap-2">
                <Check size={15} className="shrink-0 mt-0.5" />
                <span>{regSuccess}</span>
              </div>
            )}

            {/* List of currently registered names */}
            <div className="space-y-2">
              <h4 className="text-[10px] uppercase font-mono text-stone-500">Live Participant List ({selectedRegProg.registeredUsers?.length || 0})</h4>
              <div className="max-h-32 overflow-y-auto pr-1 space-y-1 text-xs">
                {selectedRegProg.registeredUsers && selectedRegProg.registeredUsers.length > 0 ? (
                  selectedRegProg.registeredUsers.map((id) => {
                    const student = students.find(s => s.admissionNumber === id);
                    return (
                      <div key={id} className="flex items-center justify-between p-2 bg-stone-900/60 rounded border border-white/5 font-mono">
                        <span className="text-stone-300 font-semibold">{student?.fullName || `AD.NO ${id}`}</span>
                        <span className="text-[9px] font-mono text-stone-500">AD #{id}</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-stone-600 italic">No registrations booked yet. Be the first one!</p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Admin Add/Edit Form Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="absolute inset-0" onClick={() => setIsFormOpen(false)} />
          
          <form onSubmit={handleFormSubmit} className="w-full max-w-lg bg-[#1a0f0a] border border-gold/30 rounded-2xl p-6 md:p-8 relative z-10 space-y-4">
            <button 
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div>
              <span className="text-[9px] uppercase font-mono font-bold text-gold bg-gold/10 px-2 py-0.5 rounded">
                {editingProgram ? 'Edit Program Details' : 'Create New Class Program'}
              </span>
              <h3 className="text-lg font-display font-extrabold text-white mt-1.5">UNION PROGRAM BUILDER</h3>
            </div>

            <div className="space-y-3 font-sans">
              <div>
                <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Program Title *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Arabic Debating Championship"
                  className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Brief Description *</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Summarize objectives, judges list, constraints etc."
                  className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white h-20 focus:border-gold outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Calendar Date *</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Venue Location *</label>
                  <input
                    type="text"
                    value={formVenue}
                    onChange={(e) => setFormVenue(e.target.value)}
                    placeholder="e.g. Auditorium B"
                    className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Language Wing *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2.5 text-xs text-white focus:border-gold outline-none font-sans"
                  >
                    <option value="Arabic">Arabic</option>
                    <option value="English">English</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Kannada">Kannada</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Assigned Team Duty</label>
                  <select
                    value={formTeamId}
                    onChange={(e) => setFormTeamId(e.target.value)}
                    className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2.5 text-xs text-white focus:border-gold outline-none font-sans"
                  >
                    <option value="">None</option>
                    <option value="1">Team 1 (Golden Aces)</option>
                    <option value="2">Team 2 (Orange Hawks)</option>
                    <option value="3">Team 3 (Yellow Stars)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Status *</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2.5 text-xs text-white focus:border-gold outline-none font-sans"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Registration Open">Registration Open</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-highlight to-gold text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:brightness-110 cursor-pointer transition-all mt-4 font-mono text-center"
            >
              {editingProgram ? 'Save Changes' : 'Publish Program'}
            </button>
          </form>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#180f0a] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold text-base font-display">Confirm Deletion</h4>
              <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                Are you sure you want to delete this program? All current reservations and registration stats will be lost.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 bg-stone-900 text-stone-400 rounded-xl text-xs font-semibold hover:bg-stone-800 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProgram(deleteConfirmId)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
