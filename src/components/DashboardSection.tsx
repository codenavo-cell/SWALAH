import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell, Legend } from 'recharts';
import { DollarSign, Users, Calendar, Activity, Gift, ChevronRight, Download, Award, Shield, FileText, Plus, Check, Heart, Smile } from 'lucide-react';
import { Student, Team, Program, Transaction, Winner } from '../types';

interface DashboardSectionProps {
  students: Student[];
  teams: Team[];
  programs: Program[];
  transactions: Transaction[];
  onSelectStudent: (s: Student) => void;
  activeDutyTeamId: number;
  winners?: Winner[];
  setActiveTab?: (tab: string) => void;
}

export default function DashboardSection({
  students,
  teams,
  programs,
  transactions,
  onSelectStudent,
  activeDutyTeamId,
  winners = [],
  setActiveTab
}: DashboardSectionProps) {
  const [selectedWishStudent, setSelectedWishStudent] = useState<Student | null>(null);
  const [customWishText, setCustomWishText] = useState('Wishing you a super prosperous ahead with countless accomplishments!');
  const [wishCardSent, setWishCardSent] = useState(false);

  // Compute stats
  const totalStudents = students.length;
  const totalTeams = teams.length;
  const activeMembers = students.filter(s => s.role && s.role !== 'student' && s.role !== 'Student Representative').length;
  
  const completedPrograms = programs.filter(p => p.status === 'Completed').length;
  const upcomingPrograms = programs.filter(p => p.status !== 'Completed').length;
  
  const avgAttendance = Math.round(
    students.reduce((acc, curr) => acc + curr.attendancePercentage, 0) / (totalStudents || 1)
  );

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const currentBalance = totalIncome - totalExpense;

  // Find Active Duty Team
  const activeDutyTeam = teams.find(t => t.id === activeDutyTeamId) || teams[0];
  const dutyTeamCaptain = students.find(s => s.admissionNumber === activeDutyTeam?.captainId);
  const dutyTeamAssistant = students.find(s => s.admissionNumber === activeDutyTeam?.assistantId);
  const dutyTeamMembersList = students.filter(s => s.teamId === activeDutyTeam?.id && s.admissionNumber !== activeDutyTeam?.captainId && s.admissionNumber !== activeDutyTeam?.assistantId);

  // Birthdays for current simulation month (June / July)
  const celebrationStudents = students.slice(4, 9); // mock selection for simulation

  // Chart data formatting
  const chartData = transactions.slice().reverse().map(t => ({
    date: t.date.substring(5), // MM-DD
    amount: t.amount,
    type: t.type === 'income' ? 'Income' : 'Expense',
    cumulativeBalance: 0
  }));

  // Create standard timeline details
  let runningBalance = currentBalance - totalIncome + totalExpense;
  const areaChartData = transactions.slice().reverse().map((t, idx) => {
    if (t.type === 'income') runningBalance += t.amount;
    else runningBalance -= t.amount;
    return {
      name: t.date.substring(5),
      income: t.type === 'income' ? t.amount : 0,
      expense: t.type === 'expense' ? t.amount : 0,
      Balance: runningBalance
    };
  });

  const downloadPDFReport = () => {
    const reportData = {
      title: "Swalah Union Q2 Statement",
      balance: currentBalance,
      income: totalIncome,
      expenses: totalExpense,
      timestamp: new Date().toLocaleDateString()
    };
    alert(`Generating budget report: \n\n${JSON.stringify(reportData, null, 2)}\n\nInvoice PDF successfully downloaded in backgrounds!`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. SEVEN TOP STATISTICS CARDS */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        
        {/* Total Students */}
        <div className="p-4 bg-stone-900/40 border border-white/5 rounded-2xl flex flex-col justify-between space-y-1 hover:border-gold/30 transition-all">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Students</span>
            <Users size={14} className="text-gold" />
          </div>
          <div>
            <span className="text-2xl font-display font-bold font-mono text-white">{totalStudents}</span>
            <span className="text-[9px] text-stone-500 block">ENROLLED RAILS</span>
          </div>
        </div>

        {/* Total Teams */}
        <div className="p-4 bg-stone-900/40 border border-white/5 rounded-2xl flex flex-col justify-between space-y-1 hover:border-gold/30 transition-all">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Teams</span>
            <Users size={14} className="text-gold" />
          </div>
          <div>
            <span className="text-2xl font-display font-bold font-mono text-white">{totalTeams}</span>
            <span className="text-[9px] text-emerald-400 block">3 ACTIVE LEAGUES</span>
          </div>
        </div>

        {/* Active Members */}
        <div className="p-4 bg-stone-900/40 border border-white/5 rounded-2xl flex flex-col justify-between space-y-1 hover:border-gold/30 transition-all">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Officers</span>
            <Award size={14} className="text-gold" />
          </div>
          <div>
            <span className="text-2xl font-display font-bold font-mono text-white">{activeMembers}</span>
            <span className="text-[9px] text-stone-500 block">COMMITTEE WINGS</span>
          </div>
        </div>

        {/* Conducted Programs */}
        <div className="p-4 bg-stone-900/40 border border-white/5 rounded-2xl flex flex-col justify-between space-y-1 hover:border-gold/30 transition-all">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Conducted</span>
            <Activity size={14} className="text-orange-highlight" />
          </div>
          <div>
            <span className="text-2xl font-display font-bold font-mono text-white">{completedPrograms}</span>
            <span className="text-[9px] text-amber-500 block">COMPLETED SESSIONS</span>
          </div>
        </div>

        {/* Upcoming Programs */}
        <div className="p-4 bg-stone-900/40 border border-white/5 rounded-2xl flex flex-col justify-between space-y-1 hover:border-gold/30 transition-all">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Upcoming</span>
            <Calendar size={14} className="text-gold" />
          </div>
          <div>
            <span className="text-2xl font-display font-bold font-mono text-white">{upcomingPrograms}</span>
            <span className="text-[9px] text-gold block">NEXT EVENTS SCHEDULED</span>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="p-4 bg-stone-900/40 border border-white/5 rounded-2xl flex flex-col justify-between space-y-1 hover:border-gold/30 transition-all">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Attendance Status</span>
            <Activity size={14} className="text-emerald-400" />
          </div>
          <div>
            <span className="text-2xl font-display font-bold font-mono text-emerald-400">{avgAttendance}%</span>
            <span className="text-[9px] text-stone-500 block">AVG CLASS LOG</span>
          </div>
        </div>

        {/* Current Balance */}
        <div className="p-4 bg-stone-900/40 border border-[#FFA726]/15 rounded-2xl flex flex-col justify-between space-y-1 hover:border-gold/30 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-4 w-4 bg-gold/15 rotate-45 group-hover:scale-155 transition-transform" />
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Fund Balance</span>
            <DollarSign size={14} className="text-gold" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-display font-bold font-mono text-gold truncate">{currentBalance.toLocaleString()} <span className="text-[9px]">INR</span></span>
            <span className="text-[9px] text-stone-500 block">UNION TREASURY</span>
          </div>
        </div>

      </section>

      {/* Grid: Active Duty Team & Upcoming Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. CURRENT DUTY TEAM */}
        <div className="p-6 glass-panel rounded-2xl border border-gold/15 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#FFA726] block">ACTIVE ASSIGNMENT</span>
              <h3 className="text-lg font-display font-bold text-white uppercase">{activeDutyTeam?.name || 'Team 1'} (Active Duty Team)</h3>
            </div>
            <span className="px-2.5 py-1 bg-gold/15 text-gold border border-gold/40 text-[10px] font-bold rounded-lg uppercase tracking-wider font-mono">
              ON DUTY WEEKLY
            </span>
          </div>

          {/* Captain & Assistant Details */}
          <div className="grid grid-cols-2 gap-4">
            {dutyTeamCaptain && (
              <div 
                onClick={() => onSelectStudent(dutyTeamCaptain)}
                className="p-3 bg-stone-950/60 rounded-xl border border-white/5 hover:border-gold/30 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center font-display font-bold text-gold text-xs">C</div>
                  <div>
                    <h5 className="text-xs font-bold text-white truncate group-hover:text-gold">{dutyTeamCaptain.fullName}</h5>
                    <p className="text-[10px] text-stone-500 font-mono">CAPTAIN • #{dutyTeamCaptain.admissionNumber}</p>
                  </div>
                </div>
              </div>
            )}

            {dutyTeamAssistant && (
              <div 
                onClick={() => onSelectStudent(dutyTeamAssistant)}
                className="p-3 bg-stone-950/60 rounded-xl border border-white/5 hover:border-gold/30 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center font-display font-bold text-amber-300 text-xs">AC</div>
                  <div>
                    <h5 className="text-xs font-bold text-white truncate group-hover:text-gold">{dutyTeamAssistant.fullName}</h5>
                    <p className="text-[10px] text-stone-500 font-mono">ASSISTANT • #{dutyTeamAssistant.admissionNumber}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Members List */}
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase tracking-wider font-mono text-stone-400">Team Roster Members</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {dutyTeamMembersList.map((member) => (
                <div 
                  key={member.admissionNumber}
                  onClick={() => onSelectStudent(member)}
                  className="p-2 py-2.5 bg-white/5 hover:bg-gold/10 hover:border-gold/20 border border-white/5 rounded-lg text-left transition-colors cursor-pointer text-xs"
                >
                  <p className="text-stone-200 truncate font-semibold">{member.fullName.split(' ').filter(n => n !== 'MOHAMMAD' && n !== 'MUHAMMAD')[0] || member.fullName}</p>
                  <p className="text-[10px] text-stone-500 font-mono">AD #{member.admissionNumber}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. UPCOMING PROGRAMS */}
        <div className="p-6 glass-panel rounded-2xl border border-white/5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h3 className="text-base font-display font-bold text-white uppercase tracking-wide">Upcoming Academic Events & Programs</h3>
            <span className="text-[10px] text-stone-500 font-mono">CALENDAR OUTLINES</span>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {programs.filter(p => p.status !== 'Completed').map((prog) => (
              <div key={prog.id} className="p-3.5 bg-stone-900/40 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-gold/10 text-gold font-mono font-bold uppercase">{prog.category}</span>
                  <h4 className="text-sm font-extrabold text-white mt-1">{prog.title}</h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">Date: {prog.date} • Venue: {prog.venue || 'TBD'}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider bg-orange-highlight/10 text-orange-highlight border border-orange-highlight/20">
                    {prog.status}
                  </span>
                  <p className="text-[10px] text-stone-500 font-mono mt-1">Duty ID: Team {prog.assignedTeamId || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid: Finance Visualizers & Celebration Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 4. FINANCIAL LEDGER CHART */}
        <div className="p-6 glass-panel rounded-2xl border border-white/5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div>
              <span className="text-[10px] font-mono font-bold text-gold uppercase block">UNION CONTROLLERS</span>
              <h3 className="text-base font-display font-bold text-white">Finance Tracking & Monthly Budgets</h3>
            </div>
            <button 
              onClick={downloadPDFReport}
              className="p-1 px-3 border border-stone-800 text-stone-400 hover:text-white rounded-lg text-xs"
            >
              Report Invoice
            </button>
          </div>

          {/* Recharts Area Graphic */}
          <div className="h-56 w-full text-xs">
            {areaChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaChartData}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFA726" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FFA726" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#685c57" />
                  <YAxis stroke="#685c57" />
                  <Tooltip contentStyle={{ backgroundColor: '#180f0a', borderColor: '#FFA726' }} />
                  <Area type="monotone" dataKey="Balance" stroke="#FFA726" fillOpacity={1} fill="url(#colorBalance)" isAnimationActive={true} animationDuration={2500} animationEasing="ease-in-out" />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-stone-500 italic">No transactions mapped.</div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center text-xs">
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/15 rounded-xl">
              <span className="text-[10px] text-stone-400 uppercase">Class Revenue</span>
              <p className="text-sm font-semibold text-emerald-400 font-mono">+{totalIncome.toLocaleString()} INR</p>
            </div>
            <div className="p-3 bg-red-950/20 border border-red-500/15 rounded-xl">
              <span className="text-[10px] text-stone-400 uppercase">Class Disbursals</span>
              <p className="text-sm font-semibold text-red-400 font-mono">-{totalExpense.toLocaleString()} INR</p>
            </div>
          </div>
        </div>

        {/* 5. CELEBRATION HUB (Birthday & Wishes Center) */}
        <div className="p-6 glass-panel rounded-2xl border border-gold/15 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div>
              <span className="text-[10px] font-mono font-bold text-gold uppercase block">CELEBRATION HUB</span>
              <h3 className="text-base font-display font-bold text-white uppercase">Birthday & Wishes Center</h3>
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono font-bold">
              🎈 LIVE TODAY
            </span>
          </div>

          <p className="text-xs text-stone-300">Congratulate classmates celebrating anniversaries or high ratings this month!</p>

          {/* Birthday Reminders Slider */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] uppercase font-mono text-stone-400 tracking-wider">Celebrating Classmates</h4>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {celebrationStudents.map((st) => (
                <div key={st.admissionNumber} className="p-3 bg-stone-900/60 rounded-xl flex items-center justify-between border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎂</span>
                    <div>
                      <h5 className="text-xs font-bold text-stone-200">{st.fullName}</h5>
                      <p className="text-[10px] text-stone-500 font-mono">AD #{st.admissionNumber} • Celebrating this month</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedWishStudent(st);
                      setWishCardSent(false);
                    }}
                    className="px-2.5 py-1 bg-gold/15 hover:bg-gold/30 text-gold rounded text-[10px] font-bold uppercase transition-colors"
                  >
                    Send wishes
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Wish overlay / popup */}
          {selectedWishStudent && (
            <div className="p-4 bg-stone-950/70 border border-gold/40 rounded-xl space-y-3">
              <h5 className="text-xs font-extrabold text-white flex items-center justify-between">
                <span>Personal Greeting: {selectedWishStudent.fullName}</span>
                <button onClick={() => setSelectedWishStudent(null)} className="text-stone-500 hover:text-white font-bold font-mono">X</button>
              </h5>
              <textarea
                value={customWishText}
                onChange={(e) => setCustomWishText(e.target.value)}
                className="w-full bg-[#1e110a] border border-gold/20 text-xs text-stone-300 p-2.5 rounded-lg h-16 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => {
                    setWishCardSent(true);
                    setTimeout(() => setSelectedWishStudent(null), 3000);
                  }}
                  className="px-3 py-1.5 bg-gold text-black rounded text-[10px] font-bold uppercase cursor-pointer"
                >
                  Confirm Card Dispatch
                </button>
              </div>
              {wishCardSent && (
                <p className="text-emerald-400 text-[10px] font-mono">✨ Digital greeting card dispatched successfully!</p>
              )}
            </div>
          )}
        </div>

      </div>

      {/* 🏆 DASHBOARD RECENT WINNERS WIDGET */}
      <div className="p-6 glass-panel rounded-2xl border border-gold/15 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Award className="text-gold" size={18} />
            <div>
              <span className="text-[10px] font-mono font-bold text-gold uppercase block">SWALAH HONORS BOARD</span>
              <h3 className="text-base font-display font-bold text-white uppercase">Recent Competition Winners</h3>
            </div>
          </div>
          {setActiveTab && (
            <button 
              onClick={() => setActiveTab('champions')}
              className="text-xs text-gold hover:text-orange-highlight font-bold flex items-center gap-1 uppercase tracking-wider font-mono cursor-pointer transition-colors"
            >
              <span>View Honors Board</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        <p className="text-xs text-stone-400">
          Celebrating the newly registered student achievers who excelled in recent activities and championships.
        </p>

        {winners.length === 0 ? (
          <div className="text-center py-6 text-stone-500 text-xs italic">
            No achievement records uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="dashboard-recent-winners-grid">
            {winners.slice(0, 3).map((w) => {
              const isFirst = w.position === 'First';
              const isSecond = w.position === 'Second';
              
              const borderCol = isFirst 
                ? 'border-gold/30 bg-gradient-to-br from-gold/5 to-transparent' 
                : isSecond 
                  ? 'border-slate-500/20 bg-gradient-to-br from-slate-400/5 to-transparent' 
                  : 'border-amber-800/20 bg-gradient-to-br from-amber-700/5 to-transparent';

              const rankTag = isFirst 
                ? '🥇 First Place' 
                : isSecond 
                  ? '🥈 Second Place' 
                  : '🥉 Third Place';

              return (
                <div 
                  key={w.id} 
                  className={`p-4 rounded-xl border ${borderCol} flex flex-col justify-between space-y-3 hover:border-gold/30 transition-all`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-tight truncate max-w-[150px]">
                        {w.studentName}
                      </h4>
                      <p className="text-[9px] text-stone-500 font-mono">AD #{w.admissionNumber}</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-stone-400 font-mono font-bold uppercase">
                      {w.category.split(' ')[0]}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-stone-400 truncate font-semibold" title={w.competitionName}>
                      {w.competitionName}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gold uppercase">{rankTag}</span>
                      <span className="text-[9px] text-stone-500 font-mono">{w.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
