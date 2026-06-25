import React from 'react';
import { BookOpen, Award, Users, ChevronRight } from 'lucide-react';
import { Student } from '../types';

interface WingsSectionProps {
  students: Student[];
  onSelectStudent: (st: Student) => void;
}

export default function WingsSection({ students, onSelectStudent }: WingsSectionProps) {
  
  const wingsStructure = [
    {
      id: "arabic",
      name: "Arabic Wing",
      chairmanAdNo: 285, // Thajudeen
      convenerAdNo: 286, // Shahim
      description: "Nurturing linguistic, literary, and semantic mastery of Classical and Modern Standard Arabic.",
      recentActivity: "Essay Writing (Arabic) completed on Jan 18th.",
      color: "border-emerald-500/30 text-emerald-300 bg-emerald-500/5",
      badgeColor: "bg-emerald-500/10 text-emerald-400"
    },
    {
      id: "english",
      name: "English Wing",
      chairmanAdNo: 269, // Shammas
      convenerAdNo: 279, // Samiq
      description: "Honing debate capacities, creative speech essays, and general spelling competitions.",
      recentActivity: "Public Speaking session on Feb 2nd.",
      color: "border-blue-500/30 text-blue-300 bg-blue-500/5",
      badgeColor: "bg-blue-500/10 text-blue-400"
    },
    {
      id: "urdu",
      name: "Urdu Wing",
      chairmanAdNo: 305, // Fazil CM
      convenerAdNo: 300, // Raza Hamza
      description: "Commemorating historical Shayari heritage, ghazals, Mushaira culture, and critical translation skills.",
      recentActivity: "Mushaira Night celebrated on Feb 14th.",
      color: "border-pink-500/30 text-pink-300 bg-pink-500/5",
      badgeColor: "bg-pink-500/10 text-pink-400"
    },
    {
      id: "kannada",
      name: "Kannada Wing",
      chairmanAdNo: 291, // Arshad
      convenerAdNo: 261, // Razeen
      description: "Highlighting Karnataka historical folklore, drama enactments, and community literature circles.",
      recentActivity: "Kannada Drama Rehearsal logged on Mar 5th.",
      color: "border-yellow-500/30 text-yellow-300 bg-yellow-500/5",
      badgeColor: "bg-yellow-500/10 text-yellow-400"
    },
    {
      id: "general",
      name: "General Wing",
      chairmanAdNo: 266, // Bishir
      convenerAdNo: 270, // Nafi
      description: "Managing non-linguistic talent hunts, sports arrays, inter-class quizzes, and board games.",
      recentActivity: "Swalah Talent Hunt upcoming on Jul 15th.",
      color: "border-purple-500/30 text-purple-300 bg-purple-500/5",
      badgeColor: "bg-purple-500/10 text-purple-400"
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-[10px] font-bold tracking-widest uppercase">
          <BookOpen size={12} />
          Language Wings
        </div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Linguistic & Cultural wings</h2>
        <p className="text-stone-400 text-xs max-w-xl mx-auto leading-relaxed">
          The core linguistic bureaus of Swalah Union driving active student participation, literature competitions, and periodic cultural festivals.
        </p>
      </div>

      {/* Grid displays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {wingsStructure.map((wing) => {
          const chairman = students.find(s => s.admissionNumber === wing.chairmanAdNo);
          const convener = students.find(s => s.admissionNumber === wing.convenerAdNo);

          return (
            <div 
              key={wing.id}
              className={`p-6 glass-panel rounded-2xl border ${wing.color} flex flex-col justify-between space-y-6 group hover:translate-y-[-2px] transition-all duration-300`}
            >
              <div className="space-y-4">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <h4 className="text-base font-extrabold text-white uppercase tracking-tight">{wing.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${wing.badgeColor}`}>
                    ACTIVE WING
                  </span>
                </div>

                <p className="text-stone-300 text-xs leading-relaxed">
                  {wing.description}
                </p>

                {/* Chair and Convener blocks */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] uppercase font-mono text-stone-550 block">Wing Leadership</span>
                  
                  {/* Chairman */}
                  {chairman && (
                    <div 
                      onClick={() => onSelectStudent(chairman)}
                      className="p-2.5 bg-black/20 hover:bg-black/30 border border-white/5 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 group/sub"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                        <span className="text-xs font-bold text-stone-300 group-hover/sub:text-gold truncate">{chairman.fullName}</span>
                      </div>
                      <span className="text-[9px] font-mono text-stone-500 shrink-0">Chairman</span>
                    </div>
                  )}

                  {/* Convener */}
                  {convener && (
                    <div 
                      onClick={() => onSelectStudent(convener)}
                      className="p-2.5 bg-black/20 hover:bg-black/30 border border-white/5 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 group/sub"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-highlight" />
                        <span className="text-xs font-bold text-stone-300 group-hover/sub:text-gold truncate">{convener.fullName}</span>
                      </div>
                      <span className="text-[9px] font-mono text-stone-500 shrink-0">Convener</span>
                    </div>
                  )}

                </div>

              </div>

              {/* Status details */}
              <div className="pt-4 border-t border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-mono text-stone-500 block">Recent Milestone Event</span>
                <p className="text-stone-400 text-xs">{wing.recentActivity}</p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
