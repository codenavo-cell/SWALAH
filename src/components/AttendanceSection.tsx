import React, { useState } from 'react';
import { CheckSquare, Calendar, FileSpreadsheet, Check, Download, Users, PlusCircle, AlertCircle, TrendingUp, Lock, Edit3, Trash2, X } from 'lucide-react';
import { Student, Program, AttendanceRecord } from '../types';

interface AttendanceSectionProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  programs: Program[];
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  isAdmin?: boolean;
}

export default function AttendanceSection({
  students,
  setStudents,
  programs,
  attendance,
  setAttendance,
  isAdmin = false
}: AttendanceSectionProps) {
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [presentAdNos, setPresentAdNos] = useState<number[]>([]);
  const [logSuccess, setLogSuccess] = useState('');
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleTogglePresent = (adNo: number) => {
    setPresentAdNos(prev => 
      prev.includes(adNo) ? prev.filter(id => id !== adNo) : [...prev, adNo]
    );
  };

  const handleSelectAll = () => {
    setPresentAdNos(students.map(s => s.admissionNumber));
  };

  const handleSelectNone = () => {
    setPresentAdNos([]);
  };

  const recalculateAllAverages = (updatedAttendance: AttendanceRecord[]) => {
    setStudents(prevStudents => prevStudents.map(st => {
      const timesPresent = updatedAttendance.filter(log => log.presentAdNos.includes(st.admissionNumber)).length;
      const totalRecordedLogs = updatedAttendance.length;
      const newPercentage = totalRecordedLogs > 0 
        ? Math.round((timesPresent / totalRecordedLogs) * 100) 
        : 0;

      // Rebuild programsParticipated from the attendance logs
      const loggedPrograms = updatedAttendance
        .filter(log => log.presentAdNos.includes(st.admissionNumber))
        .map(log => log.programTitle);
      
      const uniquePrograms = Array.from(new Set(loggedPrograms));

      return {
        ...st,
        attendancePercentage: newPercentage,
        programsParticipated: uniquePrograms
      };
    }));
  };

  const handleSubmitAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgramId) {
      alert('Please select a program first.');
      return;
    }

    const matchedProg = programs.find(p => p.id === selectedProgramId);
    if (!matchedProg) return;

    let updatedAttendance: AttendanceRecord[] = [];

    if (editingRecord) {
      // Edit mode
      updatedAttendance = attendance.map(rec => {
        if (rec.id === editingRecord.id) {
          return {
            ...rec,
            date: attendanceDate,
            programId: selectedProgramId,
            programTitle: matchedProg.title,
            presentAdNos: presentAdNos
          };
        }
        return rec;
      });
      setLogSuccess(`✓ Attendance record for "${matchedProg.title}" updated successfully! Student averages and logs re-calculated.`);
    } else {
      // Create mode
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        date: attendanceDate,
        programId: selectedProgramId,
        programTitle: matchedProg.title,
        presentAdNos: presentAdNos
      };
      updatedAttendance = [newRecord, ...attendance];
      setLogSuccess(`✓ Attendance ledger compiled successfully for "${matchedProg.title}". All enrollment files and dashboard percentages synced!`);
    }

    setAttendance(updatedAttendance);
    recalculateAllAverages(updatedAttendance);

    // Reset markers and states
    setSelectedProgramId('');
    setPresentAdNos([]);
    setEditingRecord(null);
    setAttendanceDate(new Date().toISOString().split('T')[0]);
    setTimeout(() => setLogSuccess(''), 5000);
  };

  const handleEditClick = (log: AttendanceRecord) => {
    setEditingRecord(log);
    setSelectedProgramId(log.programId);
    setAttendanceDate(log.date);
    setPresentAdNos(log.presentAdNos);
    
    // Smoothly scroll up to the compiler form
    const formElement = document.getElementById('attendance-compiler-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setSelectedProgramId('');
    setAttendanceDate(new Date().toISOString().split('T')[0]);
    setPresentAdNos([]);
  };

  const handleDeleteClick = (recordId: string) => {
    const updatedAttendance = attendance.filter(log => log.id !== recordId);
    setAttendance(updatedAttendance);
    recalculateAllAverages(updatedAttendance);
    
    setLogSuccess(`✓ Attendance record deleted successfully. Student averages and registries updated.`);
    setDeletingId(null);
    
    if (editingRecord && editingRecord.id === recordId) {
      handleCancelEdit();
    }
    
    setTimeout(() => setLogSuccess(''), 5000);
  };

  // Compile and trigger CSV file download of attendance report
  const downloadReportsCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Admission Number,Full Name,Attendance Percentage,Programs Participated\n";
    
    students.forEach(st => {
      const progsConcat = st.programsParticipated.join('; ');
      csvContent += `${st.admissionNumber},"${st.fullName}",${st.attendancePercentage}%,"${progsConcat}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `swalah_union_attendance_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-white">Attendance Management system</h2>
          <p className="text-stone-400 text-xs">Verify class participation registers, log weekly sessions, and review auto-calculated rosters.</p>
        </div>
        <button 
          onClick={downloadReportsCSV}
          className="px-4 py-2 bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <Download size={13} />
          Export CSV Ledger
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. MARK NEW ATTENDANCE (2 Col Grid) */}
        <div 
          id="attendance-compiler-card" 
          className={`lg:col-span-2 p-6 glass-panel rounded-2xl border transition-all space-y-4 ${
            editingRecord 
              ? 'border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.08)] bg-gradient-to-br from-amber-950/10 to-transparent' 
              : 'border-gold/15 shadow-[0_0_50px_rgba(255,167,38,0.02)]'
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-base font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckSquare size={16} className={editingRecord ? "text-amber-500 animate-pulse" : "text-gold"} />
              {editingRecord ? 'Edit Class Session Attendance' : 'Compile Class Session Attendance'}
            </h3>
            {editingRecord && (
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className="px-2.5 py-1 bg-stone-900 border border-white/10 hover:border-white/25 hover:text-white rounded-lg text-[10px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
              >
                <X size={10} />
                Cancel Edit
              </button>
            )}
          </div>

          {isAdmin ? (
            <form onSubmit={handleSubmitAttendance} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Select Program Event</label>
                  <select
                    value={selectedProgramId}
                    onChange={(e) => setSelectedProgramId(e.target.value)}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                    required
                  >
                    <option value="">Choose program...</option>
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.title} ({p.category})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Session Log Date</label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                    required
                  />
                </div>
              </div>

              {/* Checkbox Grid mapping all 30 students */}
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-[#150d09] p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">STUDENTS DIRECT ROSTER RAILS</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleSelectAll} className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gold text-[10px] font-bold uppercase rounded cursor-pointer">
                      Check All (Present)
                    </button>
                    <button type="button" onClick={handleSelectNone} className="px-2 py-1 bg-white/5 hover:bg-white/10 text-stone-400 text-[10px] font-bold uppercase rounded cursor-pointer">
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Responsive Checkbox list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
                  {students.map((st) => {
                    const isChecked = presentAdNos.includes(st.admissionNumber);
                    return (
                      <div 
                        key={st.admissionNumber}
                        onClick={() => handleTogglePresent(st.admissionNumber)}
                        className={`p-2 px-3 rounded-lg border flex items-center justify-between text-xs transition-colors cursor-pointer select-none ${
                          isChecked 
                            ? 'bg-gold/10 border-gold/30 text-white' 
                            : 'bg-stone-900/40 border-white/5 text-stone-400 hover:bg-stone-800/40'
                        }`}
                      >
                        <div className="flex flex-col truncate pr-2">
                          <span className="truncate font-semibold">{st.fullName.split(' ').filter(n => n !== 'MOHAMMAD' && n !== 'MUHAMMAD')[0] || st.fullName}</span>
                          <span className="text-[10px] text-stone-500 font-mono">AD #{st.admissionNumber} • {st.attendancePercentage}%</span>
                        </div>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-gold border-gold text-black' : 'border-stone-750'
                        }`}>
                          {isChecked && <Check size={12} className="stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button 
                type="submit"
                className={`w-full py-3 bg-gradient-to-r font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all ${
                  editingRecord 
                    ? 'from-amber-500 to-yellow-500 hover:from-yellow-500 hover:to-amber-600 text-black shadow-[0_4px_20px_rgba(245,158,11,0.2)]' 
                    : 'from-orange-highlight to-gold hover:from-gold hover:to-[#FF8C00] text-black'
                }`}
              >
                {editingRecord ? 'Save Attendance Changes & Recalculate' : 'Log Attendance Sheet & Recalculate'}
              </button>
            </form>
          ) : (
            <div className="p-8 text-center bg-[#150d09]/40 rounded-2xl border border-white/5 space-y-4">
              <Lock className="mx-auto text-gold/60 h-10 w-10 animate-pulse" />
              <div className="space-y-1.5">
                <p className="text-xs text-white font-bold font-display">Owner Authorization Required</p>
                <p className="text-[11px] text-stone-400 max-w-sm mx-auto leading-relaxed">
                  Only the Swalah Union Owner has permission to update attendance scores and record student session registers.
                </p>
              </div>
              <p className="text-[9px] text-stone-500 font-mono uppercase tracking-wider bg-[#1c110a] px-3 py-1.5 rounded-xl border border-white/5 w-fit mx-auto">
                VISITOR READ-ONLY VIEW
              </p>
            </div>
          )}

          {logSuccess && (
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/15 rounded-xl text-xs text-emerald-400 flex items-start gap-2 animate-fade-in">
              <CheckSquare size={16} className="shrink-0 mt-0.5" />
              <span>{logSuccess}</span>
            </div>
          )}
        </div>

        {/* 2. ATTENDANCE HISTORICAL RECORDS (1 Col Grid) */}
        <div className="lg:col-span-1 p-6 glass-panel rounded-2xl border border-white/5 space-y-4">
          <h3 className="text-base font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Users size={15} className="text-gold" />
            Class Session History
          </h3>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {attendance.map((log) => {
              const isDeleting = deletingId === log.id;
              const isCurrentlyEditing = editingRecord?.id === log.id;
              return (
                <div 
                  key={log.id} 
                  className={`p-4 rounded-xl space-y-2 transition-all relative overflow-hidden ${
                    isCurrentlyEditing 
                      ? 'bg-amber-500/10 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.04)]' 
                      : 'bg-stone-900/50 border border-white/5'
                  }`}
                >
                  {isDeleting ? (
                    <div className="p-1 text-center space-y-2.5 animate-fade-in relative z-10">
                      <p className="text-[11px] text-amber-400 font-medium flex items-center justify-center gap-1">
                        <AlertCircle size={13} />
                        Delete this session's ledger?
                      </p>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleDeleteClick(log.id)}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[9px] uppercase rounded-md tracking-wider transition-colors cursor-pointer"
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-stone-400 font-bold text-[9px] uppercase rounded-md tracking-wider transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-stone-500 font-mono">{log.date}</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FFA726]/10 text-[#FFA726] font-mono">
                          {log.presentAdNos.length} / 30 PRESENT
                        </span>
                      </div>
                      <h4 className="text-xs font-extrabold text-white">{log.programTitle}</h4>
                      <p className="text-[10px] text-stone-400 leading-relaxed truncate">
                        Logs included: {log.presentAdNos.join(', ')}
                      </p>
                      
                      {isAdmin && (
                        <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-white/5 mt-2">
                          <button
                            onClick={() => handleEditClick(log)}
                            title="Edit this record"
                            className={`p-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              isCurrentlyEditing 
                                ? 'bg-amber-500 text-black border-amber-500'
                                : 'bg-white/5 text-stone-300 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/10'
                            }`}
                          >
                            <Edit3 size={11} />
                            {isCurrentlyEditing ? 'Editing' : 'Edit'}
                          </button>
                          <button
                            onClick={() => setDeletingId(log.id)}
                            title="Delete this record"
                            className="p-1.5 bg-red-950/20 text-red-400 border border-red-500/10 hover:bg-red-900/30 hover:border-red-500/20 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Trash2 size={11} />
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
