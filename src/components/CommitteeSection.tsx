import React, { useState } from 'react';
import { Award, ShieldAlert, ChevronRight, Users, MessageSquare, Briefcase, Plus, Edit2, Trash2, X, AlertCircle, Check } from 'lucide-react';
import { Student } from '../types';

interface CommitteeMemberItem {
  roleName: string;
  studentAdNo: number;
  description: string;
  vision: string;
}

interface CommitteeSectionProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  committeeStructure?: CommitteeMemberItem[];
  setCommitteeStructure?: React.Dispatch<React.SetStateAction<CommitteeMemberItem[]>>;
  isAdmin?: boolean;
}

export default function CommitteeSection({ 
  students, 
  onSelectStudent, 
  committeeStructure = [], 
  setCommitteeStructure, 
  isAdmin 
}: CommitteeSectionProps) {
  
  // Local or passed committee roster
  const fallbackStructure: CommitteeMemberItem[] = [
    {
      roleName: "President",
      studentAdNo: 288,
      description: "Directs general body activities, coordinates study panels, and represents academic interests.",
      vision: "Empowering classmates through digital archives and multi-lingual programs."
    },
    {
      roleName: "Vice President",
      studentAdNo: 289,
      description: "Co-directs operations, guides student wings, and administers classes schedules.",
      vision: "Establishing robust collaborative team networks."
    },
    {
      roleName: "Secretary",
      studentAdNo: 287,
      description: "Maintains files registers, handles notices, and schedules campus program boards.",
      vision: "Absolute transparency and efficient student records storage."
    }
  ];

  const currentStructure = committeeStructure.length > 0 ? committeeStructure : fallbackStructure;

  // Manage committee form modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formRole, setFormRole] = useState('');
  const [formAdNo, setFormAdNo] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formVision, setFormVision] = useState('');
  const [formError, setFormError] = useState('');

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const openAddMember = () => {
    setEditingIndex(null);
    setFormRole('');
    setFormAdNo('');
    setFormDesc('');
    setFormVision('');
    setFormError('');
    setIsFormOpen(true);
  };

  const openEditMember = (idx: number, member: CommitteeMemberItem) => {
    setEditingIndex(idx);
    setFormRole(member.roleName);
    setFormAdNo(member.studentAdNo.toString());
    setFormDesc(member.description);
    setFormVision(member.vision);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setCommitteeStructure) return;

    const adNoNum = Number(formAdNo);
    const matchedProfile = students.find(s => s.admissionNumber === adNoNum);

    if (!matchedProfile) {
      setFormError(`Warning: AD.NO #${formAdNo} does not exist in the active class roster.`);
      return;
    }

    const newObj: CommitteeMemberItem = {
      roleName: formRole,
      studentAdNo: adNoNum,
      description: formDesc,
      vision: formVision
    };

    if (editingIndex !== null) {
      // Edit
      setCommitteeStructure(prev => {
        const copy = [...prev];
        copy[editingIndex] = newObj;
        return copy;
      });
    } else {
      // Create
      setCommitteeStructure(prev => [...prev, newObj]);
    }

    setIsFormOpen(false);
  };

  const handleDeleteMember = (idx: number) => {
    if (!setCommitteeStructure) return;
    setCommitteeStructure(prev => prev.filter((_, i) => i !== idx));
    setDeleteIndex(null);
  };

  return (
    <div className="space-y-12 animate-fade-in font-sans">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-[10px] font-bold tracking-widest uppercase">
          <Award size={12} />
          Executive Committee
        </div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight text-center">Main Board of Officers</h2>
        <p className="text-stone-400 text-xs max-w-xl mx-auto leading-relaxed text-center">
          The elected administrative board guiding Swalah Union projects, team rotation metrics, and resource disbursements for 2026.
        </p>

        {isAdmin && (
          <div className="pt-3">
            <button
              onClick={openAddMember}
              className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-orange-highlight to-gold text-black rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all hover:scale-105"
            >
              <Plus size={14} /> Add Committee Member
            </button>
          </div>
        )}
      </div>

      {/* Main Grid display list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentStructure.map((member, idx) => {
          const studentProfile = students.find(s => s.admissionNumber === member.studentAdNo);
          
          return (
            <div 
              key={idx}
              onClick={() => studentProfile && onSelectStudent(studentProfile)}
              className="p-6 glass-panel rounded-2xl border border-gold/10 hover:border-gold/35 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300 group cursor-pointer flex flex-col justify-between space-y-6 relative"
            >
              {/* Admin Actions Overlay */}
              {isAdmin && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); openEditMember(idx, member); }}
                    className="p-1 px-1.5 rounded-lg bg-stone-950/80 hover:bg-gold/15 text-stone-400 hover:text-gold border border-white/5 transition-colors cursor-pointer"
                    title="Edit Committee Officer Parameters"
                  >
                    <Edit2 size={10} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setDeleteIndex(idx); }}
                    className="p-1 px-1.5 rounded-lg bg-stone-950/80 hover:bg-red-500/10 text-stone-400 hover:text-red-400 border border-white/5 transition-colors cursor-pointer"
                    title="Remove Officer Node"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              )}

              <div className="space-y-4">
                
                {/* Avatar with golden floating ring */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-gold to-[#FF8C00] border-2 border-gold shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,167,38,0.3)]">
                    <span className="font-display font-black text-white text-lg">
                      {studentProfile?.fullName.split(' ').filter(n => n !== 'MOHAMMAD' && n !== 'MUHAMMAD')[0]?.[0] || 'O'}
                    </span>
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 py-0.5 text-center text-[8px] font-mono font-bold text-gold">
                      #{member.studentAdNo}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-gold tracking-widest pr-10 block truncate">{member.roleName}</span>
                    <h4 className="text-sm font-bold text-white group-hover:text-gold transition-colors">{studentProfile?.fullName || 'Active Officer'}</h4>
                    <p className="text-[10px] text-stone-500 font-mono">AD #{member.studentAdNo}</p>
                  </div>
                </div>

                <p className="text-stone-300 text-xs leading-relaxed italic">
                  "{member.description}"
                </p>

                <div className="pt-2 border-t border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-stone-500 tracking-wider">Vision Statement</span>
                  <p className="text-[11px] text-stone-400 font-sans">{member.vision}</p>
                </div>

              </div>

              {/* Interaction Details */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] text-stone-500 uppercase font-mono tracking-wider">Tap to open bio</span>
                <span className="text-gold text-xs font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  View Profile
                  <ChevronRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Class Advisors / Mentor Board Panel */}
      <section className="p-6 glass-panel rounded-2xl border border-white/5 space-y-4">
        <h3 className="text-sm font-display font-bold text-amber-400 uppercase tracking-wider">Union Advisory Board</h3>
        <p className="text-xs text-stone-300 leading-relaxed max-w-3xl">
          The Swalah Union operates under the academic guidance of senior faculty advisors, ensuring class initiatives blend with high scholastic excellence and peer mentorship guidelines fests.
        </p>
      </section>

      {/* Admin Form Modals Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="absolute inset-0" onClick={() => setIsFormOpen(false)} />
          <form onSubmit={handleFormSubmit} className="w-full max-w-sm bg-[#1a0f0a] border border-gold/30 rounded-2xl p-6 relative z-10 space-y-4">
            <button type="button" onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 text-stone-400 hover:text-white">
              <X size={16} />
            </button>
            <div>
              <span className="text-[9px] uppercase font-mono bg-gold/15 text-gold px-2 py-0.5 rounded">
                Officer Link Manager
              </span>
              <h3 className="text-base font-display font-extrabold text-white mt-1">COMMITTEE BOARD</h3>
            </div>

            {formError && (
              <p className="p-2 px-3 bg-red-950/20 border border-red-500/15 text-red-400 text-xs flex items-center gap-1 font-mono">
                <AlertCircle size={13} /> {formError}
              </p>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-stone-400 mb-0.5">Official Role Title *</label>
                <input 
                  type="text" 
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  placeholder="e.g. Media Representative"
                  className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-xs text-white focus:border-gold outline-none" 
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono text-stone-400 mb-0.5">Officer AD.NO *</label>
                <input 
                  type="number" 
                  value={formAdNo}
                  onChange={(e) => setFormAdNo(e.target.value)}
                  placeholder="e.g. 288"
                  className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-xs text-white focus:border-gold outline-none font-mono" 
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono text-stone-400 mb-0.5">Responsibility Description *</label>
                <textarea 
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Schedules wings activities, coordinates ledger lists etc."
                  className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-xs text-white h-20 focus:border-gold outline-none" 
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono text-stone-400 mb-0.5">Officer's Vision Statement *</label>
                <input 
                  type="text" 
                  value={formVision}
                  onChange={(e) => setFormVision(e.target.value)}
                  placeholder="e.g. Building transparent study channels fests."
                  className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-xs text-white focus:border-gold outline-none" 
                  required
                />
              </div>
            </div>
            <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-orange-highlight to-gold hover:brightness-110 text-black font-mono font-bold uppercase tracking-wider text-xs rounded-xl transition-all">
              {editingIndex !== null ? 'Save Node changes' : 'Publish Committee Link'}
            </button>
          </form>
        </div>
      )}

      {/* Delete Confirmation Overlay */}
      {deleteIndex !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#180f0a] border border-red-500/20 rounded-2xl p-5 max-w-xs w-full text-center space-y-4">
            <div className="mx-auto h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertCircle size={20} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Dismiss Member Node</h4>
              <p className="text-stone-400 text-[11px] leading-relaxed mt-1">Verify deletion from Committee list. This is irreversible.</p>
            </div>
            <div className="flex gap-2 font-mono">
              <button onClick={() => setDeleteIndex(null)} className="flex-1 py-1.5 bg-stone-900 text-stone-450 text-xs rounded-lg hover:bg-stone-850">Cancel</button>
              <button onClick={() => handleDeleteMember(deleteIndex)} className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg pb-2">Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
