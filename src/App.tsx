import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import StudentProfileModal from './components/StudentProfileModal';
import { MouseSpotlight } from './components/PremiumEffects';

// Components list
import HomeSection from './components/HomeSection';
import DashboardSection from './components/DashboardSection';
import CommitteeSection from './components/CommitteeSection';
import TeamsSection from './components/TeamsSection';
import WingsSection from './components/WingsSection';
import ProgramsSection from './components/ProgramsSection';
import AttendanceSection from './components/AttendanceSection';
import LeaderboardSection from './components/LeaderboardSection';
import ChampionsSection from './components/ChampionsSection';
import AdminPanel from './components/AdminPanel';
import CalendarSection from './components/CalendarSection';
import ResourcesSection from './components/ResourcesSection';

// Mock Payload data
import {
  INITIAL_STUDENTS,
  INITIAL_TEAMS,
  INITIAL_PROGRAMS,
  INITIAL_NOTICES,
  INITIAL_GALLERY,
  INITIAL_TRANSACTIONS,
  INITIAL_ATTENDANCE,
  INITIAL_RESOURCES,
  INITIAL_IDEAS,
  INITIAL_MEMORIES,
  INITIAL_MAGAZINE,
  INITIAL_WINNERS
} from './data/initialData';

import { Student, Team, Program, Notice, GalleryItem, Transaction, AttendanceRecord, ResourceItem, Idea, Memory, MagazineArticle, EventCalendarItem, Winner } from './types';
import { Calendar, Folder, Megaphone, Shield, Award, Sparkles, SlidersHorizontal, Sun, Moon, Plus, Minus } from 'lucide-react';
import DisplaySettings from './components/DisplaySettings';

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('home');
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeDutyTeamId, setActiveDutyTeamId] = useState(1);

  // Brightness and Display Settings
  const [brightness, setBrightness] = useState<number>(() => {
    const saved = localStorage.getItem('swalah_brightness');
    return saved ? parseInt(saved, 10) : 75; // Default is 75% as per spec (Normal Mode)
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    const saved = localStorage.getItem('swalah_highContrast');
    return saved === 'true';
  });
  const [isDisplaySettingsOpen, setIsDisplaySettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('swalah_brightness', brightness.toString());
  }, [brightness]);

  useEffect(() => {
    localStorage.setItem('swalah_highContrast', highContrast.toString());
  }, [highContrast]);

  // Synchronized States with LocalStorage caching
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('swalah_students');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Student[];
        let updated = false;
        const verified = parsed.map(st => {
          if (st.admissionNumber === 289 && st.fullName !== 'YASEEN') {
            st.fullName = 'YASEEN';
            updated = true;
          }
          if (st.admissionNumber === 287 && st.fullName !== 'ALTHAF') {
            st.fullName = 'ALTHAF';
            updated = true;
          }
          return st;
        });
        return verified;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_STUDENTS;
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('swalah_teams');
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });

  const [programs, setPrograms] = useState<Program[]>(() => {
    const saved = localStorage.getItem('swalah_programs');
    return saved ? JSON.parse(saved) : INITIAL_PROGRAMS;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('swalah_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('swalah_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('swalah_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('swalah_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [resources, setResources] = useState<ResourceItem[]>(() => {
    const saved = localStorage.getItem('swalah_resources');
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  const [ideas, setIdeas] = useState<Idea[]>(() => {
    const saved = localStorage.getItem('swalah_ideas');
    return saved ? JSON.parse(saved) : INITIAL_IDEAS;
  });

  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem('swalah_memories');
    return saved ? JSON.parse(saved) : INITIAL_MEMORIES;
  });

  const [calendarEvents, setCalendarEvents] = useState<EventCalendarItem[]>(() => {
    const saved = localStorage.getItem('swalah_calendar_events');
    return saved ? JSON.parse(saved) : [
      { id: "cal-1", title: "Essay Writing (Arabic)", date: "2026-01-18", category: "Arabic", venue: "Main Hall A", assignedTeam: "Team 1" },
      { id: "cal-2", title: "Public Speaking Challenge", date: "2026-02-02", category: "English", venue: "Auditorium B", assignedTeam: "Team 2" },
      { id: "cal-3", title: "Mushaira Night", date: "2026-02-14", category: "Urdu", venue: "Seminar Room 1", assignedTeam: "Team 3" },
      { id: "cal-4", title: "Kannada Drama Rehearsal", date: "2026-03-05", category: "Kannada", venue: "Cultural Amphitheater", assignedTeam: "Team 1" },
      { id: "cal-5", title: "Swalah Talent Hunt 2026", date: "2026-07-15", category: "General", venue: "Main Campus Center", assignedTeam: "Team 3" },
      { id: "cal-6", title: "Creative Canvas Art Contest", date: "2026-07-28", category: "General", venue: "Art Block Gallery", assignedTeam: "Team 2" },
      { id: "cal-7", title: "Vision & Action Summit", date: "2026-08-10", category: "General", venue: "Executive Boardroom", assignedTeam: "Team 1" },
      { id: "cal-8", title: "Core Officers Executive Brainstorm", date: "2026-06-25", category: "Committee", venue: "Central Classroom Boardroom", assignedTeam: "Main Board" }
    ];
  });

  const [committeeStructure, setCommitteeStructure] = useState<{ roleName: string; studentAdNo: number; description: string; vision: string }[]>(() => {
    const saved = localStorage.getItem('swalah_committee');
    return saved ? JSON.parse(saved) : [
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
      },
      {
        roleName: "Vice Secretary",
        studentAdNo: 265,
        description: "Supports administrative tasks and keeps minutes of regular class bodies meetings.",
        vision: "Meticulous planning and team alignment."
      },
      {
        roleName: "Treasurer",
        studentAdNo: 276,
        description: "Monitors union funds ledger, reviews invoices, and publishes budget statements.",
        vision: "Frugal resource spending and alumni allocations."
      },
      {
        roleName: "PR Officer",
        studentAdNo: 290,
        description: "Administers communication lines, updates digital media handles, and coordinates external programs.",
        vision: "Extending Swalah's offline standard footprint across state boards."
      }
    ];
  });

  const [magazine, setMagazine] = useState<MagazineArticle[]>(INITIAL_MAGAZINE);

  const [winners, setWinners] = useState<Winner[]>(() => {
    const saved = localStorage.getItem('swalah_winners');
    return saved ? JSON.parse(saved) : INITIAL_WINNERS;
  });

  // Sync to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('swalah_calendar_events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('swalah_committee', JSON.stringify(committeeStructure));
  }, [committeeStructure]);
  useEffect(() => {
    localStorage.setItem('swalah_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('swalah_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('swalah_programs', JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem('swalah_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('swalah_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('swalah_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('swalah_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('swalah_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('swalah_ideas', JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem('swalah_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('swalah_winners', JSON.stringify(winners));
  }, [winners]);

  // Scroll Progress and cursor glow effects listeners
  useEffect(() => {
    const handleScroll = () => {
      const progressBar = document.getElementById('progress-bar');
      if (progressBar) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = (window.scrollY / (totalHeight || 1)) * 100;
        progressBar.style.width = `${percentage}%`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulated path routing for /admin path interception
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setActiveTab('admin');
    }
  }, []);

  // Keep browser URL synchronized with Admin tab state
  useEffect(() => {
    if (activeTab === 'admin') {
      if (window.location.pathname !== '/admin') {
        window.history.pushState(null, '', '/admin');
      }
    } else {
      if (window.location.pathname === '/admin') {
        window.history.pushState(null, '', '/');
      }
    }
  }, [activeTab]);

  // Duty Rotation triggering: iterates to next team 1 -> 2 -> 3 -> 1
  const triggerDutyRotation = () => {
    setActiveDutyTeamId(prev => {
      const nextId = prev === 3 ? 1 : prev + 1;
      
      // Update duties completed score counters in teams state
      setTeams(prevTeams => prevTeams.map(t => {
        if (t.id === nextId) {
          return {
            ...t,
            dutiesCompleted: t.dutiesCompleted + 1,
            score: t.score + 15 // award 15 points for completing duty cycle
          };
        }
        return t;
      }));

      return nextId;
    });
  };

  // Select Student Handler: updates selected student for modal opening, handles tab routing safely
  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleAdminToggle = () => {
    if (isAdmin) {
      // already authenticated, lock
      setIsAdmin(false);
      setActiveTab('home');
    } else {
      setActiveTab('admin');
    }
  };

  return (
    <div 
      className="relative min-h-screen flex flex-col justify-between overflow-x-hidden"
      style={{ 
        filter: `brightness(${brightness}%) ${highContrast ? 'contrast(125%) saturate(115%)' : ''}`, 
        transition: 'filter 0.3s ease-in-out' 
      }}
    >
      
      {/* Scroll Progress Bar */}
      <div id="progress-bar" />

      {/* Floating Animated Golden Particles & Grid */}
      <ParticleBackground />

      {/* Global Interactive Mouse Spotlight */}
      <MouseSpotlight />

      {/* Header element */}
      <Navbar
        students={students}
        onSelectStudent={handleSelectStudent}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
        onAdminToggle={handleAdminToggle}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />

      {/* Middle Tab-dependent View layouts wraps */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {activeTab === 'home' && (
          <HomeSection 
            notices={notices}
            setNotices={setNotices}
            gallery={gallery}
            setGallery={setGallery}
            ideas={ideas}
            setIdeas={setIdeas}
            memories={memories}
            setMemories={setMemories}
            magazine={magazine}
            setActiveTab={setActiveTab}
            students={students}
            onSelectStudent={handleSelectStudent}
            isAdmin={isAdmin}
            brightness={brightness}
            setBrightness={setBrightness}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardSection 
            students={students}
            teams={teams}
            programs={programs}
            transactions={transactions}
            onSelectStudent={handleSelectStudent}
            activeDutyTeamId={activeDutyTeamId}
            winners={winners}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'committee' && (
          <CommitteeSection 
            students={students}
            onSelectStudent={handleSelectStudent}
            committeeStructure={committeeStructure}
            setCommitteeStructure={setCommitteeStructure}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'teams' && (
          <TeamsSection 
            teams={teams}
            setTeams={setTeams}
            students={students}
            onSelectStudent={handleSelectStudent}
            activeDutyTeamId={activeDutyTeamId}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'wings' && (
          <WingsSection 
            students={students}
            onSelectStudent={handleSelectStudent}
          />
        )}

        {activeTab === 'programs' && (
          <ProgramsSection 
            programs={programs}
            setPrograms={setPrograms}
            students={students}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceSection 
            students={students}
            setStudents={setStudents}
            programs={programs}
            attendance={attendance}
            setAttendance={setAttendance}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardSection 
            students={students}
            setStudents={setStudents}
            teams={teams}
            setTeams={setTeams}
            onSelectStudent={handleSelectStudent}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'champions' && (
          <ChampionsSection 
            winners={winners}
            setWinners={setWinners}
            students={students}
            teams={teams}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel 
            students={students}
            setStudents={setStudents}
            programs={programs}
            setPrograms={setPrograms}
            teams={teams}
            setTeams={setTeams}
            notices={notices}
            setNotices={setNotices}
            gallery={gallery}
            setGallery={setGallery}
            transactions={transactions}
            setTransactions={setTransactions}
            attendance={attendance}
            setAttendance={setAttendance}
            isAdmin={isAdmin}
            onLoginSuccess={() => setIsAdmin(true)}
            onLogout={() => {
              setIsAdmin(false);
              setActiveTab('home');
            }}
            triggerDutyRotation={triggerDutyRotation}
          />
        )}

        {/* Extra helpful sub-panels (accessible by Home tabs click) */}
        {activeTab === 'calendar' && (
          <CalendarSection 
            events={calendarEvents}
            setEvents={setCalendarEvents}
            isAdmin={isAdmin}
          />
        )}
        {activeTab === 'resources' && (
          <ResourcesSection 
            resources={resources}
            setResources={setResources}
            isAdmin={isAdmin}
          />
        )}

        {/* Floating Utility shortcuts panel for quick sub routing */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
          {/* Detailed Settings Toggle Button */}
          <button 
            onClick={() => setIsDisplaySettingsOpen(!isDisplaySettingsOpen)}
            className={`h-11 w-11 rounded-full bg-stone-900 border border-gold/30 flex items-center justify-center text-gold shadow-lg hover:bg-gold/15 cursor-pointer transition-all ${
              isDisplaySettingsOpen 
                ? 'bg-gold text-[#140b07] border-gold shadow-[0_0_15px_rgba(218,165,32,0.3)] font-bold' 
                : ''
            }`}
            title="Open Detailed Display Settings Panel"
            aria-label="Toggle Detailed Display Settings"
          >
            <SlidersHorizontal size={18} />
          </button>
          
          {/* Calendar bubble router */}
          <button 
            onClick={() => setActiveTab(activeTab === 'calendar' ? 'home' : 'calendar')}
            className="h-11 w-11 rounded-full bg-stone-900 border border-gold/30 flex items-center justify-center text-gold shadow-lg hover:bg-gold/15 cursor-pointer transition-all"
            title="Open Swalah Calendar Schedule"
          >
            <Calendar size={18} />
          </button>
          {/* Certificate/Resource Center router */}
          <button 
            onClick={() => setActiveTab(activeTab === 'resources' ? 'home' : 'resources')}
            className="h-11 w-11 rounded-full bg-stone-900 border border-gold/30 flex items-center justify-center text-gold shadow-lg hover:bg-gold/15 cursor-pointer transition-all"
            title="Open Resource Center"
          >
            <Folder size={18} />
          </button>
        </div>

      </main>

      {/* Unified student profile details lightbox overlay */}
      <StudentProfileModal 
        student={selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
        teams={teams}
        isAdmin={isAdmin}
        onUpdateStudent={(updated) => {
          setStudents(prev => prev.map(s => s.admissionNumber === updated.admissionNumber ? updated : s));
          setSelectedStudent(updated);
        }}
        onDeleteStudent={(admissionNumber) => {
          setStudents(prev => prev.filter(s => s.admissionNumber !== admissionNumber));
          setSelectedStudent(null);
        }}
      />

      {/* Modern, glassmorphic Display Settings (Brightness and Contrast) */}
      <DisplaySettings
        isOpen={isDisplaySettingsOpen}
        onClose={() => setIsDisplaySettingsOpen(false)}
        brightness={brightness}
        setBrightness={setBrightness}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />

      {/* 11. IMMACULATE COMPLIANT FOOTER */}
      <footer className="relative bg-[#0b0604] border-t border-gold/15 pt-12 pb-6 z-10 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand block */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-highlight to-gold flex items-center justify-center text-white text-xs font-bold">
                SW
              </div>
              <span className="text-white font-display font-black tracking-widest uppercase">SWALAH</span>
            </div>
            <p className="leading-relaxed">
              A unified platform for all language wings, committees, teams, and student programs. Aligning performance tracks, registrations, and class activities under premium digital rails.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-white font-display font-bold uppercase tracking-wider text-[11px]">Quick links</h4>
            <div className="flex flex-col space-y-1.5 font-medium">
              <button onClick={() => setActiveTab('home')} className="text-left hover:text-gold transition-colors">Home</button>
              <button onClick={() => setActiveTab('committee')} className="text-left hover:text-gold transition-colors">Committee Members</button>
              <button onClick={() => setActiveTab('teams')} className="text-left hover:text-gold transition-colors">Union Teams</button>
              <button onClick={() => setActiveTab('wings')} className="text-left hover:text-gold transition-colors">Language Wings</button>
              <button onClick={() => setActiveTab('programs')} className="text-left hover:text-gold transition-colors">Programs</button>
              <button onClick={() => setActiveTab('calendar')} className="text-left hover:text-gold transition-colors">Calendar</button>
            </div>
          </div>

          {/* Language Wings Column */}
          <div className="space-y-3">
            <h4 className="text-white font-display font-bold uppercase tracking-wider text-[11px]">Language Wings</h4>
            <div className="flex flex-col space-y-1.5 font-medium">
              <button onClick={() => setActiveTab('wings')} className="text-left hover:text-emerald-400 transition-colors">Arabic Wing</button>
              <button onClick={() => setActiveTab('wings')} className="text-left hover:text-blue-400 transition-colors">English Wing</button>
              <button onClick={() => setActiveTab('wings')} className="text-left hover:text-pink-400 transition-colors">Urdu Wing</button>
              <button onClick={() => setActiveTab('wings')} className="text-left hover:text-yellow-400 transition-colors">Kannada Wing</button>
              <button onClick={() => setActiveTab('wings')} className="text-left hover:text-purple-400 transition-colors">General Wing</button>
            </div>
          </div>

          {/* Follow Us & Social Handles */}
          <div className="space-y-3">
            <h4 className="text-white font-display font-bold uppercase tracking-wider text-[11px]">Follow us</h4>
            <p className="leading-relaxed text-[11px]">Keep updated with live Swalah announcements on social platforms.</p>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <a href="#facebook" className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded hover:text-white transition-colors">Facebook</a>
              <a href="https://instagram.com/swalahofficial" target="_blank" rel="noreferrer" className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded hover:text-white text-orange-highlight transition-colors">Instagram</a>
              <a href="#linkedin" className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded hover:text-white transition-colors">LinkedIn</a>
              <a href="#x" className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded hover:text-white transition-colors">X</a>
            </div>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-mono">
          <span>© 2026 Swalah Union. All Rights Reserved.</span>
          <span>Crafted with Passion by Swalah Union.</span>
        </div>
      </footer>

    </div>
  );
}
