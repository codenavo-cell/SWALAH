import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Shield, Users, User, Star, ChevronRight, TrendingUp, Edit2, Check, X, UserCheck } from 'lucide-react';
import { Student, Team } from '../types';

interface TeamsSectionProps {
  teams: Team[];
  setTeams?: React.Dispatch<React.SetStateAction<Team[]>>;
  students: Student[];
  onSelectStudent: (student: Student) => void;
  activeDutyTeamId: number;
  isAdmin?: boolean;
}

export default function TeamsSection({
  teams,
  setTeams,
  students,
  onSelectStudent,
  activeDutyTeamId,
  isAdmin
}: TeamsSectionProps) {
  
  // State for editing a team
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editCaptainId, setEditCaptainId] = useState<number>(0);
  const [editAssistantId, setEditAssistantId] = useState<number>(0);
  const [editScore, setEditScore] = useState<number>(0);
  const [editDuties, setEditDuties] = useState<number>(0);
  const [editMemberIdsText, setEditMemberIdsText] = useState('');

  // Custom colors for teams visual identity
  const COLORS = ['#FFA726', '#FF8C00', '#FFB74D'];

  // format teams data for Recharts
  const chartData = teams.map(t => ({
    name: t.name,
    Score: t.score,
    Duties: t.dutiesCompleted
  }));

  const startEditing = (team: Team) => {
    setEditingTeamId(team.id);
    setEditName(team.name);
    setEditCaptainId(team.captainId);
    setEditAssistantId(team.assistantId);
    setEditScore(team.score);
    setEditDuties(team.dutiesCompleted);
    setEditMemberIdsText(team.memberIds.join(', '));
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setTeams) return;

    // Parse member IDs from text
    const parsedMemberIds = editMemberIdsText
      .split(',')
      .map(idStr => Number(idStr.trim()))
      .filter(idNum => !isNaN(idNum) && idNum > 0);

    setTeams(prev => prev.map(t => {
      if (t.id === editingTeamId) {
        return {
          ...t,
          name: editName,
          captainId: Number(editCaptainId),
          assistantId: Number(editAssistantId),
          score: Number(editScore),
          dutiesCompleted: Number(editDuties),
          memberIds: parsedMemberIds
        };
      }
      return t;
    }));

    setEditingTeamId(null);
  };

  return (
    <div className="space-y-12 animate-fade-in font-sans">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-[10px] font-bold tracking-widest uppercase">
          <Users size={12} />
          Team Standings
        </div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Active Team Leagues</h2>
        <p className="text-stone-400 text-xs max-w-xl mx-auto leading-relaxed">
          Comparing points, performance metrics, and duties completed by class blocks. Clicking any cell opens student analytics.
        </p>
      </div>

      {/* Grid: Standings list & Recharts Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recharts Bar chart (1 Col) */}
        <div className="lg:col-span-1 p-6 glass-panel rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp size={14} className="text-gold" />
              League Scores Standings
            </h3>
            <p className="text-[11px] text-stone-400">Comparing current accumulated scores based on program participations.</p>
          </div>

          <div className="h-56 mt-4 text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#685c57" />
                <YAxis stroke="#685c57" />
                <Tooltip contentStyle={{ backgroundColor: '#180f0a', borderColor: '#FFA726' }} />
                <Bar dataKey="Score" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={2000} animationEasing="ease-out">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-stone-900/60 rounded-xl border border-white/5 text-[10px] text-stone-400 font-sans italic text-center">
            Scores are audited live against class registrars on every monthly program completions.
          </div>
        </div>

        {/* Detailed Standings Cards (2 Col) */}
        <div className="lg:col-span-2 space-y-6">
          {teams.map((team, idx) => {
            const isThisEditing = editingTeamId === team.id;
            const captain = students.find(s => s.admissionNumber === team.captainId);
            const assistant = students.find(s => s.admissionNumber === team.assistantId);
            const memberStudents = students.filter(s => team.memberIds.includes(s.admissionNumber));
            const isActiveDuty = team.id === activeDutyTeamId;

            return (
              <div 
                key={team.id}
                className={`p-6 glass-panel rounded-2xl border transition-all relative ${
                  isActiveDuty 
                    ? 'border-gold/35 shadow-[0_0_20px_rgba(255,167,38,0.1)]' 
                    : 'border-white/5 hover:border-gold/20'
                }`}
              >
                {/* Admin edit toggle button */}
                {isAdmin && !isThisEditing && (
                  <button
                    onClick={() => startEditing(team)}
                    className="absolute top-4 right-4 p-1 rounded bg-stone-900 hover:bg-gold/15 text-stone-400 hover:text-gold border border-white/5 transition-colors cursor-pointer text-[10px] font-bold font-mono uppercase px-2 py-1 flex items-center gap-1"
                  >
                    <Edit2 size={10} /> Edit Team Info
                  </button>
                )}

                {isThisEditing ? (
                  // Inline Team Editor
                  <form onSubmit={handleSaveTeam} className="space-y-4">
                    <div className="border-b border-gold/20 pb-2">
                      <h4 className="text-sm font-bold uppercase text-white font-mono">Edit {team.name}</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Team Name</label>
                        <input
                          type="text"
                          className="w-full bg-[#120a06] border border-gold/25 rounded-lg px-3 py-1.5 text-white outline-none"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">League Score (PTS)</label>
                        <input
                          type="number"
                          className="w-full bg-[#120a06] border border-gold/25 rounded-lg px-3 py-1.5 text-white font-mono outline-none"
                          value={editScore}
                          onChange={(e) => setEditScore(Number(e.target.value))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Captain AD.NO</label>
                        <select
                          className="w-full bg-[#120a06] border border-gold/25 rounded-lg px-2 py-1.5 text-white outline-none font-sans"
                          value={editCaptainId}
                          onChange={(e) => setEditCaptainId(Number(e.target.value))}
                        >
                          {students.map(s => (
                            <option key={s.admissionNumber} value={s.admissionNumber}>
                              #{s.admissionNumber} - {s.fullName.slice(0, 16)}...
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Assistant AD.NO</label>
                        <select
                          className="w-full bg-[#120a06] border border-gold/25 rounded-lg px-2 py-1.5 text-white outline-none font-sans"
                          value={editAssistantId}
                          onChange={(e) => setEditAssistantId(Number(e.target.value))}
                        >
                          {students.map(s => (
                            <option key={s.admissionNumber} value={s.admissionNumber}>
                              #{s.admissionNumber} - {s.fullName.slice(0, 16)}...
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Duties Logged</label>
                        <input
                          type="number"
                          className="w-full bg-[#120a06] border border-gold/25 rounded-lg px-3 py-1.5 text-white font-mono outline-none"
                          value={editDuties}
                          onChange={(e) => setEditDuties(Number(e.target.value))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Member AD.NOs (Comma Separated)</label>
                      <input
                        type="text"
                        className="w-full bg-[#120a06] border border-gold/25 rounded-lg px-3 py-1.5 text-white font-mono outline-none"
                        value={editMemberIdsText}
                        placeholder="e.g. 288, 289, 305"
                        onChange={(e) => setEditMemberIdsText(e.target.value)}
                      />
                      <p className="text-[9px] text-stone-550 mt-1 font-mono">Admission numbers must map to existing students.</p>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingTeamId(null)}
                        className="px-3 py-1.5 bg-stone-900 text-stone-400 font-bold text-xs rounded-lg cursor-pointer hover:bg-stone-850"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-gradient-to-r from-orange-highlight to-gold text-black font-mono font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1 hover:brightness-110 cursor-pointer"
                      >
                        <Check size={12} /> Save Team
                      </button>
                    </div>
                  </form>
                ) : (
                  // Default Card view
                  <div>
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                          <Trophy size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-extrabold text-white uppercase">{team.name}</h4>
                            {isActiveDuty && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                                Active Duty
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 font-mono">
                            Rank: <strong className="text-white">#{team.rank}</strong> • Duties Logged: <strong className="text-white">{team.dutiesCompleted}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="text-right pr-22">
                        <span className="text-[10px] text-stone-500 block font-mono uppercase">League Points</span>
                        <span className="text-xl font-mono font-black text-gold">{team.score} PTS</span>
                      </div>
                    </div>

                    {/* Captains & Assistants */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {captain && (
                        <div 
                          onClick={() => onSelectStudent(captain)}
                          className="p-3 bg-stone-900/40 hover:bg-stone-800/40 border border-white/5 rounded-xl cursor-pointer transition-colors flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2">
                            <div className="p-1 rounded bg-gold/10 text-gold text-xs font-bold">C</div>
                            <div>
                              <p className="text-xs font-bold text-stone-300 group-hover:text-gold">{captain.fullName}</p>
                              <p className="text-[9px] text-stone-500 font-mono">AD #{captain.admissionNumber}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-stone-550 group-hover:text-gold transition-colors">Captain</span>
                        </div>
                      )}

                      {assistant && (
                        <div 
                          onClick={() => onSelectStudent(assistant)}
                          className="p-3 bg-stone-900/40 hover:bg-stone-800/40 border border-white/5 rounded-xl cursor-pointer transition-colors flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2">
                            <div className="p-1 rounded bg-amber-500/10 text-amber-400 text-xs font-bold">AC</div>
                            <div>
                              <p className="text-xs font-bold text-stone-300 group-hover:text-gold">{assistant.fullName}</p>
                              <p className="text-[9px] text-stone-500 font-mono">AD #{assistant.admissionNumber}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-stone-550 group-hover:text-gold transition-colors">Assistant</span>
                        </div>
                      )}
                    </div>

                    {/* Team roster lists */}
                    <div className="mt-4 space-y-2">
                      <h5 className="text-[10px] uppercase font-mono tracking-wider text-stone-500">Roster Members</h5>
                      <div className="flex flex-wrap gap-2">
                        {memberStudents.map((mb) => (
                          <button
                            key={mb.admissionNumber}
                            onClick={() => onSelectStudent(mb)}
                            className="px-3 py-1.5 bg-stone-950 hover:bg-gold/10 hover:text-gold border border-white/5 hover:border-gold/25 rounded-lg text-[11px] text-stone-300 transition-all font-sans cursor-pointer text-left flex items-center gap-1"
                          >
                            <User size={10} className="opacity-60" />
                            <span>{mb.fullName.split(' ').filter(n => n && n !== 'MOHAMMAD' && n !== 'MUHAMMAD' && n !== 'AHMED')[0] || mb.fullName[0]}</span>
                            <span className="text-[9px] text-stone-550 ml-1">#{mb.admissionNumber}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
