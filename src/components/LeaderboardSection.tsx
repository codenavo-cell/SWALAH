import React, { useState } from 'react';
import { Trophy, Award, Flame, User, Check, Sparkles, Star, Zap, ChevronRight, Plus, X, Shield, Edit2, Trash2, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';
import { Student, Team } from '../types';

interface LeaderboardSectionProps {
  students: Student[];
  setStudents?: React.Dispatch<React.SetStateAction<Student[]>>;
  teams: Team[];
  setTeams?: React.Dispatch<React.SetStateAction<Team[]>>;
  onSelectStudent: (student: Student) => void;
  isAdmin?: boolean;
}

export default function LeaderboardSection({ 
  students, 
  setStudents, 
  teams, 
  setTeams, 
  onSelectStudent, 
  isAdmin 
}: LeaderboardSectionProps) {
  const [boardMode, setBoardMode] = useState<'members' | 'teams'>('members');

  // Modal controls
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [isEditTeamOpen, setIsEditTeamOpen] = useState<Team | null>(null);

  // Student form state
  const [addName, setAddName] = useState('');
  const [addAdNo, setAddAdNo] = useState('');
  const [addRole, setAddRole] = useState('representative');
  const [addTeamId, setAddTeamId] = useState<number>(0);
  const [addAttendance, setAddAttendance] = useState<number>(90);
  const [addBio, setAddBio] = useState('');
  const [addSkills, setAddSkills] = useState('');
  const [addAchievements, setAddAchievements] = useState('');
  const [studentError, setStudentError] = useState('');

  // Team form state
  const [addTeamName, setAddTeamName] = useState('');
  const [addTeamScore, setAddTeamScore] = useState<number>(400);
  const [addTeamDuties, setAddTeamDuties] = useState<number>(10);

  // Compute Leaderboard rosters
  const sortedStudentsByAttendance = students.slice().sort((a, b) => b.attendancePercentage - a.attendancePercentage);
  const sortedStudentsByPrograms = students.slice().sort((a, b) => b.programsParticipated.length - a.programsParticipated.length);
  const topTeams = teams.slice().sort((a, b) => b.score - a.score);

  // Elite Standout Champions to display in hero highlights
  const bestTeam = topTeams[0];
  const bestMember = students.find(s => s.admissionNumber === 288) || students[0]; // Fallback if deleted
  const mostActiveMember = students.find(s => s.admissionNumber === 305) || students[1];
  const highestAttendanceMember = sortedStudentsByAttendance[0];

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setStudents) return;

    const adNoNum = Number(addAdNo);
    if (!adNoNum) {
      setStudentError('Please specify a valid numeric admission number.');
      return;
    }

    const collision = students.some(s => s.admissionNumber === adNoNum);
    if (collision) {
      setStudentError(`Verification warning: Admission number #${adNoNum} is already occupied by a classmate.`);
      return;
    }

    const newStudent: Student = {
      fullName: addName,
      admissionNumber: adNoNum,
      teamId: addTeamId || undefined,
      attendancePercentage: Number(addAttendance),
      role: addRole || 'representative',
      bio: addBio || '',
      skills: addSkills.split(',').map(s => s.trim()).filter(Boolean),
      achievements: addAchievements.split(',').map(a => a.trim()).filter(Boolean),
      programsParticipated: []
    };

    setStudents(prev => [...prev, newStudent]);
    setIsAddStudentOpen(false);
    setAddName('');
    setAddAdNo('');
    setAddRole('representative');
    setAddTeamId(0);
    setAddAttendance(90);
    setAddBio('');
    setAddSkills('');
    setAddAchievements('');
    setStudentError('');
  };

  const handleAddTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setTeams) return;

    const newTeam: Team = {
      id: teams.length + 1,
      name: addTeamName,
      captainId: 0,
      assistantId: 0,
      memberIds: [],
      score: Number(addTeamScore),
      rank: teams.length + 1,
      dutiesCompleted: Number(addTeamDuties)
    };

    setTeams(prev => [...prev, newTeam]);
    setIsAddTeamOpen(false);
    setAddTeamName('');
    setAddTeamScore(400);
    setAddTeamDuties(10);
  };

  const handleUpdateTeamPoints = (teamId: number, amt: number) => {
    if (!setTeams) return;
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, score: Math.max(0, t.score + amt) } : t));
  };

  const handleUpdateTeamDuties = (teamId: number, amt: number) => {
    if (!setTeams) return;
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, dutiesCompleted: Math.max(0, t.dutiesCompleted + amt) } : t));
  };

  const handleDeleteTeam = (teamId: number) => {
    if (!setTeams) return;
    setTeams(prev => prev.filter(t => t.id !== teamId));
  };

  return (
    <div className="space-y-12 animate-fade-in font-sans">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-[10px] font-bold tracking-widest uppercase animate-bounce">
          <Trophy size={12} />
          Champions Board
        </div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Swalah Leaderboard</h2>
        <p className="text-stone-400 text-xs max-w-xl mx-auto leading-relaxed">
          Evaluating points, active roles logs, seminar achievements, and attendance rankings.
        </p>

        {isAdmin && (
          <div className="pt-3 flex justify-center gap-3">
            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-orange-highlight to-gold text-black rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all shadow-lg"
            >
              <Plus size={14} /> Add Student Profile
            </button>
            <button
              onClick={() => setIsAddTeamOpen(true)}
              className="px-4 py-2 bg-[#2c170d] border border-gold/40 text-gold rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all shadow-lg"
            >
              <Plus size={14} /> Add League Team
            </button>
          </div>
        )}
      </div>

      {/* Hero Showcase cards side-by-side */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Best Team */}
        {bestTeam && (
          <div className="p-6 glass-panel rounded-2xl border-2 border-gold/35 relative overflow-hidden flex flex-col justify-between text-center space-y-4 group min-h-[220px]">
            <div className="absolute top-0 right-0 p-1 text-[8px] bg-gold/20 text-gold font-mono font-bold uppercase tracking-wider rounded-bl">WINNER</div>
            <div className="mx-auto h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center text-gold shadow-[0_0_15px_rgba(255,167,38,0.4)] relative">
              <Trophy size={20} className="animate-spin" style={{ animationDuration: '6s' }} />
              <Sparkles size={11} className="absolute top-0 right-0 text-gold animate-ping" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-stone-400">Best League Team</span>
              <h4 className="text-lg font-black text-white uppercase">{bestTeam.name}</h4>
              <p className="text-[11px] text-gold font-mono font-bold mt-1">{bestTeam.score} PTS累積</p>
            </div>
            <p className="text-[10px] text-stone-500">Highest scores recorded in regional Arabic and English wings fests.</p>
          </div>
        )}

        {/* Best Member */}
        {bestMember && (
          <div 
            onClick={() => onSelectStudent(bestMember)}
            className="p-6 glass-panel rounded-2xl border border-gold/15 hover:border-gold/35 transition-all relative flex flex-col justify-between text-center space-y-4 group cursor-pointer min-h-[220px]"
          >
            <div className="mx-auto h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center text-gold shadow-md">
              <Award size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-stone-400">Best Student Member</span>
              <h4 className="text-base font-extrabold text-white truncate group-hover:text-gold transition-colors">{bestMember.fullName}</h4>
              <p className="text-[11px] text-stone-500 mt-1">{bestMember.role}</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase font-mono font-bold bg-gold/10 text-gold inline-block w-fit mx-auto">
              Leader of Year
            </span>
          </div>
        )}

        {/* Most Active Member */}
        {mostActiveMember && (
          <div 
            onClick={() => onSelectStudent(mostActiveMember)}
            className="p-6 glass-panel rounded-2xl border border-gold/15 hover:border-gold/35 transition-all relative flex flex-col justify-between text-center space-y-4 group cursor-pointer min-h-[220px]"
          >
            <div className="mx-auto h-12 w-12 rounded-full bg-orange-highlight/10 flex items-center justify-center text-orange-highlight shadow-md">
              <Flame size={20} className="animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-stone-400">Most Active Member</span>
              <h4 className="text-base font-extrabold text-white truncate group-hover:text-gold transition-colors">{mostActiveMember.fullName}</h4>
              <p className="text-[11px] text-stone-500 mt-1">{mostActiveMember.role || 'Urdu Lead'}</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase font-mono font-bold bg-orange-highlight/10 text-orange-highlight inline-block w-fit mx-auto">
              Active Contributor
            </span>
          </div>
        )}

        {/* Highest Attendance */}
        {highestAttendanceMember && (
          <div 
            onClick={() => onSelectStudent(highestAttendanceMember)}
            className="p-6 glass-panel rounded-2xl border border-gold/15 hover:border-gold/35 transition-all relative flex flex-col justify-between text-center space-y-4 group cursor-pointer min-h-[220px]"
          >
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-md">
              <Zap size={20} className="animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-stone-400">Highest Attendance</span>
              <h4 className="text-base font-extrabold text-white truncate group-hover:text-gold transition-colors">{highestAttendanceMember.fullName}</h4>
              <p className="text-[11px] text-stone-500 mt-1 font-mono">AD #{highestAttendanceMember.admissionNumber}</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase font-mono font-bold bg-emerald-500/10 text-emerald-400 inline-block w-fit mx-auto font-mono">
              {highestAttendanceMember.attendancePercentage}% Perfect Log
            </span>
          </div>
        )}

      </section>

      {/* Switch Category Roster */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-[#150d09] border border-stone-800 rounded-xl font-mono text-xs">
          <button
            onClick={() => setBoardMode('members')}
            className={`px-6 py-2.5 rounded-lg font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              boardMode === 'members' ? 'bg-gold/10 text-gold font-bold shadow-md' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            Class Member Standings
          </button>
          <button
            onClick={() => setBoardMode('teams')}
            className={`px-6 py-2.5 rounded-lg font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              boardMode === 'teams' ? 'bg-gold/10 text-gold font-bold shadow-md' : 'text-stone-550 hover:text-stone-300'
            }`}
          >
            Union Teams Standings
          </button>
        </div>
      </div>

      {/* Standings table lists */}
      <div className="p-6 glass-panel rounded-2xl border border-white/5 space-y-4">
        
        {boardMode === 'members' ? (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-300 font-display">Roster sorted by participations</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-stone-500 font-mono pb-2">
                    <th className="py-2.5">POS</th>
                    <th>STUDENT NAME</th>
                    <th>ADMISSION #</th>
                    <th>COMMITTEE ROLE</th>
                    <th className="text-center">PROGRAMS PLAYED</th>
                    <th className="text-right">ATTENDANCE LOG</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStudentsByPrograms.map((st, index) => (
                    <tr 
                      key={st.admissionNumber} 
                      onClick={() => onSelectStudent(st)}
                      className="border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer group"
                    >
                      <td className="py-3 font-mono font-bold text-stone-400">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </td>
                      <td className="font-bold text-stone-100 group-hover:text-gold transition-colors">{st.fullName}</td>
                      <td className="font-mono text-stone-400">AD #{st.admissionNumber}</td>
                      <td className="text-stone-400 text-[11px] font-semibold">{st.role || 'representative'}</td>
                      <td className="text-center font-mono text-amber-300 font-bold">{st.programsParticipated.length} SESSIONS</td>
                      <td className="text-right font-mono text-stone-300 font-bold">{st.attendancePercentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-300 font-display">League standings sorted by PTS</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-stone-500 font-mono pb-2">
                    <th className="py-2.5">POS</th>
                    <th>LEAGUE TEAM</th>
                    <th>DUTIES COMPLETED</th>
                    <th className="text-right">PTS METRIC</th>
                    {isAdmin && <th className="text-center font-sans">ADMIN CONTROL</th>}
                  </tr>
                </thead>
                <tbody>
                  {topTeams.map((team, index) => (
                    <tr key={team.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                      <td className="py-4 font-mono font-bold text-stone-400">
                        {index === 0 ? '🏆' : `#${index + 1}`}
                      </td>
                      <td className="font-bold text-white uppercase text-sm tracking-wide">{team.name}</td>
                      <td className="font-mono text-stone-400">
                        {isAdmin ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleUpdateTeamDuties(team.id, -1); }}
                              className="p-1 rounded bg-stone-900 text-stone-400 hover:text-white cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-1 text-white">{team.dutiesCompleted} DUTIES</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleUpdateTeamDuties(team.id, 1); }}
                              className="p-1 rounded bg-stone-900 text-stone-400 hover:text-white cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span>{team.dutiesCompleted} DUTIES COMPLETED</span>
                        )}
                      </td>
                      <td className="text-right font-mono font-extrabold text-gold text-base">
                        {isAdmin ? (
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleUpdateTeamPoints(team.id, -20); }}
                              className="p-1 rounded bg-stone-900 text-red-400 hover:text-red-300 cursor-pointer"
                              title="Subtract 20 PTS"
                            >
                              <ArrowDown size={11} />
                            </button>
                            <span className="px-1">{team.score} PTS</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleUpdateTeamPoints(team.id, 20); }}
                              className="p-1 rounded bg-stone-900 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                              title="Add 20 PTS"
                            >
                              <ArrowUp size={11} />
                            </button>
                          </div>
                        ) : (
                          <span>{team.score} PTS</span>
                        )}
                      </td>
                      {isAdmin && (
                        <td className="text-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteTeam(team.id); }}
                            className="p-1.5 rounded-lg bg-red-600/15 text-red-400 hover:bg-red-600 hover:text-white transition-colors cursor-pointer text-[10px] font-bold font-mono"
                          >
                            DISBAND
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Add Student Overlay Modal */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans">
          <div className="absolute inset-0" onClick={() => setIsAddStudentOpen(false)} />
          <form onSubmit={handleAddStudentSubmit} className="w-full max-w-lg bg-[#1a0f0a] border border-gold/30 rounded-2xl p-6 md:p-8 relative z-10 space-y-4">
            <button type="button" onClick={() => setIsAddStudentOpen(false)} className="absolute top-4 right-4 text-stone-400 hover:text-white">
              <X size={18} />
            </button>
            <div>
              <span className="text-[9px] uppercase font-mono bg-gold/15 text-gold px-2 py-0.5 rounded">
                Admin Core Link
              </span>
              <h3 className="text-lg font-display font-extrabold text-white mt-1">ADD STUDENT PROFILE</h3>
            </div>

            {studentError && (
              <p className="p-2 px-3 bg-red-950/25 border border-red-500/20 text-red-400 text-xs flex items-center gap-1 font-mono">
                <AlertCircle size={13} /> {studentError}
              </p>
            )}

            <div className="space-y-3 text-xs text-stone-300">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Full Student Name *</label>
                  <input
                    type="text"
                    required
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder="e.g. Shammas Bin Ahmed"
                    className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-white focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Admission Number (AD.NO) *</label>
                  <input
                    type="number"
                    required
                    value={addAdNo}
                    onChange={(e) => setAddAdNo(e.target.value)}
                    placeholder="e.g. 293"
                    className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-white focus:border-gold outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Att. Percentage (%) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={addAttendance}
                    onChange={(e) => setAddAttendance(Number(e.target.value))}
                    className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-white focus:border-gold outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Committee Role</label>
                  <input
                    type="text"
                    value={addRole}
                    placeholder="General Representative"
                    onChange={(e) => setAddRole(e.target.value)}
                    className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-white focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Assigned Team</label>
                  <select
                    value={addTeamId}
                    onChange={(e) => setAddTeamId(Number(e.target.value))}
                    className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-gold font-sans"
                  >
                    <option value={0}>None</option>
                    <option value={1}>Team 1 (Golden Aces)</option>
                    <option value={2}>Team 2 (Orange Hawks)</option>
                    <option value={3}>Team 3 (Yellow Stars)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Interactive Biography</label>
                <textarea
                  value={addBio}
                  onChange={(e) => setAddBio(e.target.value)}
                  placeholder="Loves debating leagues fests, public logs presence and calligraphy etc."
                  className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-white h-16 focus:border-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Linguistic Competencies (Comma Split)</label>
                  <input
                    type="text"
                    value={addSkills}
                    placeholder="Arabic public speaking, Urdu prose fests"
                    onChange={(e) => setAddSkills(e.target.value)}
                    className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-white focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Merit / Awards Achievements (Comma Split)</label>
                  <input
                    type="text"
                    value={addAchievements}
                    placeholder="Q1 Urdu Elocution Champion"
                    onChange={(e) => setAddAchievements(e.target.value)}
                    className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-white focus:border-gold outline-none"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-gradient-to-r from-orange-highlight to-gold hover:brightness-110 text-black font-mono font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer">
              Install Student Record
            </button>
          </form>
        </div>
      )}

      {/* Add League Team Overlay Modal */}
      {isAddTeamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans">
          <div className="absolute inset-0" onClick={() => setIsAddTeamOpen(false)} />
          <form onSubmit={handleAddTeamSubmit} className="w-full max-w-sm bg-[#1a0f0a] border border-gold/30 rounded-2xl p-6 relative z-10 space-y-4">
            <button type="button" onClick={() => setIsAddTeamOpen(false)} className="absolute top-4 right-4 text-stone-400 hover:text-white">
              <X size={18} />
            </button>
            <div>
              <span className="text-[9px] uppercase font-mono bg-gold/15 text-gold px-2 py-0.5 rounded">
                League Board Core
              </span>
              <h3 className="text-lg font-display font-extrabold text-white mt-1">ADD UNION LEAGUE TEAM</h3>
            </div>

            <div className="space-y-3 text-xs text-stone-300">
              <div>
                <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">League Team Name *</label>
                <input
                  type="text"
                  required
                  value={addTeamName}
                  onChange={(e) => setAddTeamName(e.target.value)}
                  placeholder="e.g. Red Warriors"
                  className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-white focus:border-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Starting PTS Metric *</label>
                  <input
                    type="number"
                    required
                    value={addTeamScore}
                    onChange={(e) => setAddTeamScore(Number(e.target.value))}
                    className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-white focus:border-gold outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Starting Duties Completed *</label>
                  <input
                    type="number"
                    required
                    value={addTeamDuties}
                    onChange={(e) => setAddTeamDuties(Number(e.target.value))}
                    className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-white focus:border-gold outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-gradient-to-r from-orange-highlight to-gold hover:brightness-110 text-black font-mono font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer">
              Deploy League Team
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
