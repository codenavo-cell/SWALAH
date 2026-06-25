import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, CheckCircle, Users, BadgeCheck, FileText, Instagram, Linkedin, Github, Shield, TrendingUp, Edit3, Trash2, Check, AlertCircle } from 'lucide-react';
import { Student, Team } from '../types';
import { CircularProgressRing } from './PremiumEffects';

interface StudentProfileModalProps {
  student: Student | null;
  onClose: () => void;
  teams: Team[];
  isAdmin?: boolean;
  onUpdateStudent?: (updated: Student) => void;
  onDeleteStudent?: (admissionNumber: number) => void;
}

export default function StudentProfileModal({ 
  student, 
  onClose, 
  teams, 
  isAdmin, 
  onUpdateStudent, 
  onDeleteStudent 
}: StudentProfileModalProps) {
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editTeamId, setEditTeamId] = useState<number>(0);
  const [editAttendance, setEditAttendance] = useState<number>(90);
  const [editBio, setEditBio] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [editAchievements, setEditAchievements] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync state whenever student changes
  useEffect(() => {
    if (student) {
      setEditName(student.fullName);
      setEditRole(student.role || 'representative');
      setEditTeamId(student.teamId || 0);
      setEditAttendance(student.attendancePercentage);
      setEditBio(student.bio || '');
      setEditSkills((student.skills || []).join(', '));
      setEditAchievements((student.achievements || []).join(', '));
      setIsEditing(false);
      setShowDeleteConfirm(false);
    }
  }, [student]);

  if (!student) return null;

  const studentTeam = teams.find(t => t.id === student.teamId);

  // Derive a gorgeous color gradient based on student team
  const getTeamGradient = (tId: number) => {
    switch (tId) {
      case 1:
        return 'from-amber-600 to-amber-900 border-amber-500/40 text-amber-300';
      case 2:
        return 'from-orange-600 to-amber-950 border-orange-500/40 text-orange-300';
      case 3:
        return 'from-yellow-600 to-yellow-950 border-yellow-500/40 text-yellow-300';
      default:
        return 'from-zinc-700 to-zinc-900 border-zinc-500/30 text-zinc-300';
    }
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateStudent) return;

    const updatedStudent: Student = {
      ...student,
      fullName: editName,
      role: editRole,
      teamId: editTeamId,
      attendancePercentage: Number(editAttendance),
      bio: editBio,
      skills: editSkills.split(',').map(s => s.trim()).filter(Boolean),
      achievements: editAchievements.split(',').map(a => a.trim()).filter(Boolean)
    };

    onUpdateStudent(updatedStudent);
    setIsEditing(false);
  };

  const handleDeleteTrigger = () => {
    if (onDeleteStudent) {
      onDeleteStudent(student.admissionNumber);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        {/* Backdrop click */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0" 
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="w-full max-w-2xl overflow-hidden glass-panel rounded-2xl border border-gold/30 relative z-10 font-sans"
        >
          {/* Header background glow */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gold/10 to-transparent pointer-events-none" />

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-gold/20 text-stone-300 hover:text-gold transition-colors z-20 cursor-pointer"
            id={`close-student-profile-${student.admissionNumber}`}
          >
            <X size={18} />
          </button>

          {/* Edit Switch Button for Admins */}
          {isAdmin && !showDeleteConfirm && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="absolute top-4 right-14 px-3 py-1.5 rounded-lg bg-stone-900 border border-gold/30 text-xs font-semibold uppercase font-mono tracking-wider text-[#ffa726] hover:bg-gold hover:text-black transition-colors z-25 cursor-pointer flex items-center gap-1"
            >
              <Edit3 size={12} />
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          )}

          <div className="p-6 md:p-8 relative">
            
            {!isEditing ? (
              // Display View Mode
              <div>
                {/* Main Header Row */}
                <div className="flex flex-col md:flex-row md:items-center gap-6 mt-4 pb-6 border-b border-white/5">
                  {/* Profile Avatar with Team Gradient */}
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 bg-gradient-to-br ${getTeamGradient(student.teamId)} shadow-lg shrink-0 relative overflow-hidden group`}>
                    <span className="font-display text-3xl font-extrabold text-white">
                      {student.fullName.split(' ').filter(n => n && n !== 'MOHAMMAD' && n !== 'MUHAMMAD' && n !== 'AHMED')[0]?.[0] || student.fullName[0]}
                    </span>
                    {/* ID Tag */}
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 py-0.5 text-center text-[10px] uppercase tracking-wider font-mono text-gold font-bold">
                      #{student.admissionNumber}
                    </div>
                  </div>

                  {/* Identity details */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-display font-bold text-white tracking-tight">
                        {student.fullName}
                      </h3>
                      {student.role && student.role !== 'student' && student.role !== 'Student Representative' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold/20 text-gold border border-gold/40 flex items-center gap-1">
                          <Shield size={12} />
                          {student.role}
                        </span>
                      )}
                    </div>

                    <div className="text-stone-400 text-sm flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1.5">
                        <Users size={14} className="text-gold" />
                        Team: <strong className="text-white">{studentTeam?.name || 'Unassigned'}</strong>
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-600 hidden md:inline" />
                      <span>AD.NO: <strong className="text-gold font-mono">{student.admissionNumber}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Profile Statistics & Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Left Column: Analytics & Bio */}
                  <div className="space-y-6">
                    {/* Attendance Gauge */}
                    <div className="p-4 rounded-xl bg-stone-900/60 border border-white/5 flex items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <span className="text-stone-400 flex items-center gap-1.5 font-mono text-xs">
                          <TrendingUp size={14} className="text-orange-highlight" />
                          Attendance Metric
                        </span>
                        <p className="text-[11px] text-stone-300 leading-normal">
                          {student.attendancePercentage >= 90 
                            ? 'Consistently meeting classroom union academic standards and active duty.' 
                            : 'Nearing review boundaries. Active contribution required in upcoming wing sessions.'}
                        </p>
                      </div>
                      <div className="shrink-0 flex flex-col items-center gap-1">
                        <CircularProgressRing percentage={student.attendancePercentage} size={64} strokeWidth={6} />
                        <span className={`font-mono text-xs font-bold ${student.attendancePercentage >= 90 ? 'text-emerald-400' : 'text-gold'}`}>
                          {student.attendancePercentage}% Ratio
                        </span>
                      </div>
                    </div>

                    {/* Bio & Skills if available */}
                    <div className="space-y-2">
                      <h4 className="text-[#ffa726] text-xs font-semibold uppercase tracking-wider font-mono">About student</h4>
                      <p className="text-stone-300 text-xs leading-relaxed italic">
                        "{student.bio || 'Class union member committed to linguistic preservation, dynamic team program structures, and academic engagement.'}"
                      </p>
                    </div>

                    {student.skills && student.skills.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[#ffa726] text-xs font-semibold uppercase tracking-wider font-mono">Acquired Competencies</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {student.skills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-stone-800 text-stone-300 border border-stone-700 font-mono">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Participations & Awards */}
                  <div className="space-y-6">
                    {/* Participated programs list */}
                    <div className="space-y-2.5">
                      <h4 className="text-[#ffa726] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 font-mono">
                        <CheckCircle size={14} /> Played & Registered Programs
                      </h4>
                      {student.programsParticipated.length > 0 ? (
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-2 font-mono">
                          {student.programsParticipated.map((prog, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-stone-300 text-[10px] py-1.5 px-2.5 bg-white/5 rounded-lg border border-white/5 font-sans">
                              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                              <span>{prog}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-stone-500 text-xs italic">No documented completions of monthly programs yet.</p>
                      )}
                    </div>

                    {/* Achievements List */}
                    <div className="space-y-2.5">
                      <h4 className="text-[#ffa726] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 font-mono">
                        <Award size={14} /> Union Achievements
                      </h4>
                      {student.achievements && student.achievements.length > 0 ? (
                        <div className="space-y-1.5">
                          {student.achievements.map((ach, idx) => (
                            <div key={idx} className="flex items-center gap-2.5 text-[11px] text-stone-200 py-1.5 px-3 rounded-lg bg-gold/10 border border-gold/20 font-sans">
                              <BadgeCheck size={14} className="text-gold shrink-0" />
                              <span className="font-medium">{ach}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-stone-500 text-xs italic">Student currently tracking towards Class Merit Badge eligibility.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Display Administration Edit Mode Form
              <form onSubmit={handleSaveChanges} className="space-y-4 pt-8">
                <div className="border-b border-gold/20 pb-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                    <Shield size={16} className="text-gold" />
                    Modify Student Credentials
                  </h4>
                  <p className="text-stone-500 text-[11px]">Administrator updates are immediately synced for class fests.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Full Name *</label>
                    <input 
                      type="text"
                      className="w-full bg-[#120a06] border border-gold/25 rounded-lg px-3 py-2 text-white font-semibold outline-none focus:border-gold"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Committee Role / Title</label>
                    <input 
                      type="text"
                      placeholder="e.g. Joint Secretary or General Member"
                      className="w-full bg-[#120a06] border border-gold/25 rounded-lg px-3 py-2 text-white outline-none focus:border-gold"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">AD.NO (Permanent)</label>
                    <div className="w-full bg-[#1e110a] border border-stone-800 rounded-lg px-3 py-2 text-stone-500 font-mono font-bold">
                      {student.admissionNumber}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Attendance Percentage (%)</label>
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      className="w-full bg-[#120a06] border border-gold/25 rounded-lg px-3 py-2 text-white font-mono outline-none focus:border-gold"
                      value={editAttendance}
                      onChange={(e) => setEditAttendance(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">League Team</label>
                    <select
                      className="w-full bg-[#120a06] border border-gold/25 rounded-lg px-2 py-2 text-white focus:outline-none focus:border-gold font-sans"
                      value={editTeamId}
                      onChange={(e) => setEditTeamId(Number(e.target.value))}
                    >
                      <option value={0}>None / Independent</option>
                      <option value={1}>Team 1 (Golden Aces)</option>
                      <option value={2}>Team 2 (Orange Hawks)</option>
                      <option value={3}>Team 3 (Yellow Stars)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Biography</label>
                  <textarea 
                    className="w-full bg-[#120a06] border border-gold/25 rounded-lg px-3 py-2 text-white h-16 outline-none focus:border-gold text-xs leading-relaxed"
                    value={editBio}
                    placeholder="Short bio regarding student's linguistic fests, capabilities and presence."
                    onChange={(e) => setEditBio(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Linguistic Competencies (Comma Separated)</label>
                    <input 
                      type="text"
                      className="w-full bg-[#120a06] border border-gold/25 rounded-lg px-3 py-2 text-white outline-none focus:border-gold"
                      placeholder="e.g. Arabic Debating, Public Oratory, Creative Prose"
                      value={editSkills}
                      onChange={(e) => setEditSkills(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Key Awards / Merits (Comma Separated)</label>
                    <input 
                      type="text"
                      className="w-full bg-[#120a06] border border-gold/25 rounded-lg px-3 py-2 text-white outline-none focus:border-gold"
                      placeholder="e.g. Best Speaker Q1, Urdu Quiz Winner"
                      value={editAchievements}
                      onChange={(e) => setEditAchievements(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-white/5 justify-between">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={13} />
                    Delete Student Link
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2.5 bg-stone-900 text-stone-400 font-bold text-xs rounded-lg hover:bg-stone-850 cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-orange-highlight to-gold text-black font-mono font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1 hover:brightness-110 cursor-pointer"
                    >
                      <Check size={13} />
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Social Links if any */}
            {!isEditing && (
              <div className="mt-8 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                <span className="text-[11px] text-stone-500 font-mono">SWALAH CLASS UNION DATA CORE // ID {student.admissionNumber}</span>
                <div className="flex items-center gap-3">
                  <a href="#instagram" className="text-stone-400 hover:text-gold transition-colors p-1 hover:bg-white/5 rounded">
                    <Instagram size={15} />
                  </a>
                  <a href="#linkedin" className="text-stone-400 hover:text-gold transition-colors p-1 hover:bg-white/5 rounded">
                    <Linkedin size={15} />
                  </a>
                  <a href="#github" className="text-stone-400 hover:text-gold transition-colors p-1 hover:bg-white/5 rounded">
                    <Github size={15} />
                  </a>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal Layer */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-[#180f0a] border border-red-500/25 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="mx-auto h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 animate-pulse font-mono">
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold text-base font-display">Verify Student Dismissal</h4>
              <p className="text-stone-400 text-xs mt-1.5 leading-relaxed">
                Dismiss student <strong className="text-white font-sans">{student.fullName}</strong> from the Swalah database? All attendance records, roles, and program participations will be deleted.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 bg-stone-900 text-stone-400 rounded-xl text-xs font-semibold hover:bg-stone-850 cursor-pointer"
              >
                Retain Student
              </button>
              <button
                type="button"
                onClick={handleDeleteTrigger}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold cursor-pointer"
              >
                Dismiss Student
              </button>
            </div>
          </div>
        </div>
      )}

    </AnimatePresence>
  );
}
