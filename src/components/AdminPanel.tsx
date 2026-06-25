import React, { useState, useEffect } from 'react';
import { Lock, Plus, Trash2, Edit2, Download, AlertTriangle, Key, ArrowRight, CheckCircle2, RefreshCw, BarChart2, Users, Calendar, Megaphone, DollarSign, Image, FileText, Settings, ShieldAlert, Mail, Send, Sparkles, Check, Shield, Activity, UserPlus, Eye, EyeOff, LockOpen } from 'lucide-react';
import { Student, Program, Team, Notice, GalleryItem, Transaction, AttendanceRecord, LanguageWing } from '../types';

interface AdminAccount {
  email: string;
  name: string;
  password?: string;
  role: 'Owner' | 'Admin';
}

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

interface AdminPanelProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  programs: Program[];
  setPrograms: React.Dispatch<React.SetStateAction<Program[]>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  gallery: GalleryItem[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  isAdmin: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
  triggerDutyRotation: () => void;
}

export default function AdminPanel({
  students,
  setStudents,
  programs,
  setPrograms,
  teams,
  setTeams,
  notices,
  setNotices,
  gallery,
  setGallery,
  transactions,
  setTransactions,
  attendance,
  setAttendance,
  isAdmin,
  onLoginSuccess,
  onLogout,
  triggerDutyRotation
}: AdminPanelProps) {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(isAdmin);
  const [authError, setAuthError] = useState('');
  const [adminTab, setAdminTab] = useState<'students' | 'programs' | 'notices' | 'gallery' | 'finance' | 'email' | 'logs' | 'admins'>('students');

  // Sync if global Admin state changes
  useEffect(() => {
    setIsAuthenticated(isAdmin);
  }, [isAdmin]);

  // Secure dual auth via Email/Password/PIN
  const [authMethod, setAuthMethod] = useState<'email' | 'pin'>('email');
  const [adminEmail, setAdminEmail] = useState('codenavo@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [use2FA, setUse2FA] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [systemLogs, setSystemLogs] = useState<string[]>([]);

  // Persistent Admin accounts list
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>(() => {
    const saved = localStorage.getItem('swalah_admin_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((acc: any) => {
            if (acc.email === 'codenavo@gmail.com' && acc.password === 'ownerpassword') {
              return { ...acc, password: '301THWALHA' };
            }
            return acc;
          });
        }
      } catch (e) {
        // Fallback
      }
      return JSON.parse(saved);
    }
    return [
      { email: 'codenavo@gmail.com', password: '301THWALHA', role: 'Owner' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('swalah_admin_accounts', JSON.stringify(adminAccounts));
  }, [adminAccounts]);

  // Persistent Activity logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('swalah_admin_logs');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'log-1', user: 'codenavo@gmail.com', action: 'Security Framework Initialized', timestamp: '2026-06-23 18:50' },
      { id: 'log-2', user: 'codenavo@gmail.com', action: 'Website Owner access activated', timestamp: '2026-06-23 18:52' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('swalah_admin_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Persistent currently logged-in account
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(() => {
    const saved = localStorage.getItem('swalah_current_admin');
    if (saved) return JSON.parse(saved);
    return null;
  });

  useEffect(() => {
    if (currentAdmin) {
      localStorage.setItem('swalah_current_admin', JSON.stringify(currentAdmin));
    } else {
      localStorage.removeItem('swalah_current_admin');
    }
  }, [currentAdmin]);

  const addActivityLog = (action: string, userEmail: string = currentAdmin?.email || 'codenavo@gmail.com') => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      user: userEmail,
      action,
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Email state persistence
  const [sentEmails, setSentEmails] = useState<{
    id: string;
    sender: string;
    recipientType: string;
    recipientName?: string;
    subject: string;
    content: string;
    date: string;
    status: 'Delivered' | 'Pending' | 'Bounced';
    openRate: string;
    priority: 'Normal' | 'High' | 'Announcement';
  }[]>(() => {
    const saved = localStorage.getItem('swalah_sent_emails');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'mail-1',
        sender: 'codenavo@gmail.com',
        recipientType: 'All Students',
        subject: 'Welcome to Swalah Digital Class Union',
        content: `Peace be upon you,\n\nWe are delighted to welcome everyone to Swalah Union's secure web presence. Use the primary hub dashboard to inspect progress indices, program rosters, weekly assembly tracks, and your language wings.\n\nWarm regards,\nSwalah Administration Committee`,
        date: '2026-06-21 11:30 AM',
        status: 'Delivered',
        openRate: '100%',
        priority: 'Announcement'
      },
      {
        id: 'mail-2',
        sender: 'codenavo@gmail.com',
        recipientType: 'Team 1',
        subject: 'Attention Required: Active Duty Cycle Reminder',
        content: `Dear Team Members,\n\nThis is a notification reminding you that Team 1 is presently nominated for the active weekly rotational routine. Please coordinate with your captain to organize seating and student programs.\n\nBest of luck,\nAdmin Council`,
        date: '2026-06-20 04:15 PM',
        status: 'Delivered',
        openRate: '92%',
        priority: 'High'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('swalah_sent_emails', JSON.stringify(sentEmails));
  }, [sentEmails]);

  // Email form states
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailRecipientType, setEmailRecipientType] = useState<string>('All Students');
  const [selectedIndividualStudentAdNo, setSelectedIndividualStudentAdNo] = useState<string>('');
  const [emailPriority, setEmailPriority] = useState<'Normal' | 'High' | 'Announcement'>('Normal');
  const [smtpStatus, setSmtpStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleComposeEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailBody.trim()) {
      alert('Subject line and message body content are required.');
      return;
    }

    setSmtpStatus('sending');

    // Simulate standard SMTP server lag
    setTimeout(() => {
      let recipientLabel = emailRecipientType;
      if (emailRecipientType === 'Individual Representative' && selectedIndividualStudentAdNo) {
        const student = students.find(s => s.admissionNumber === Number(selectedIndividualStudentAdNo));
        recipientLabel = student ? `${student.fullName} (AD: ${student.admissionNumber})` : `Representative Student AD No: ${selectedIndividualStudentAdNo}`;
      }

      const newMail = {
        id: `mail-${Date.now()}`,
        sender: 'codenavo@gmail.com',
        recipientType: recipientLabel,
        subject: emailSubject,
        content: emailBody,
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Delivered' as const,
        openRate: '100%',
        priority: emailPriority
      };

      setSentEmails(prev => [newMail, ...prev]);
      setSmtpStatus('success');
      addActivityLog(`Relayed email communiqué: "${newMail.subject}" to recipients [${newMail.recipientType}]`);

      // Add to system simulation logs
      const timestamp = new Date().toLocaleTimeString();
      setSystemLogs(prev => [
        `[${timestamp}] SMTP DELIVERED - Mail sequence #${newMail.id} relayed successfully`,
        `[${timestamp}] TARGET VERIFIED - Dispatched packets to ${recipientLabel}`,
        ...prev
      ]);

      // Reset
      setEmailSubject('');
      setEmailBody('');
      
      setTimeout(() => {
        setSmtpStatus('idle');
      }, 1500);

    }, 1200);
  };

  const handleDeleteSentEmail = (id: string) => {
    if (confirm('Are you sure you want to delete this email log receipt? This is irreversible.')) {
      const mail = sentEmails.find(m => m.id === id);
      setSentEmails(prev => prev.filter(m => m.id !== id));
      addActivityLog(`Deleted email receipt log: "${mail?.subject || 'No Subject'}"`);
    }
  };

  // Edit / Add Item States
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [studentForm, setStudentForm] = useState<Partial<Student>>({
    admissionNumber: 0,
    fullName: '',
    role: '',
    teamId: undefined,
    attendancePercentage: 90,
    programsParticipated: [],
    achievements: [],
    bio: '',
    skills: []
  });

  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [programForm, setProgramForm] = useState<Partial<Program>>({
    id: '',
    title: '',
    date: '',
    venue: '',
    category: 'General',
    assignedTeamId: undefined,
    status: 'Upcoming',
    description: ''
  });

  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [noticeForm, setNoticeForm] = useState<Partial<Notice>>({
    id: '',
    title: '',
    date: '',
    content: '',
    type: 'general'
  });

  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({
    id: '',
    title: '',
    imageUrl: '',
    category: 'Swalah Talent',
    description: '',
    date: ''
  });

  const [transactionForm, setTransactionForm] = useState<Partial<Transaction>>({
    id: '',
    type: 'income',
    amount: 0,
    category: 'Sponsorship',
    date: '',
    description: ''
  });

  // Manage Admins form states
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'Owner' | 'Admin'>('Admin');
  const [editingAdminEmail, setEditingAdminEmail] = useState<string | null>(null);

  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminName || (!editingAdminEmail && !newAdminPassword)) {
      alert('Email, Name, and Password are required.');
      return;
    }

    if (editingAdminEmail) {
      // Edit
      setAdminAccounts(prev => prev.map(acc => {
        if (acc.email.toLowerCase() === editingAdminEmail.toLowerCase()) {
          return {
            ...acc,
            name: newAdminName,
            role: newAdminRole,
            ...(newAdminPassword ? { password: newAdminPassword } : {})
          };
        }
        return acc;
      }));
      addActivityLog(`Modified administrator profile: ${newAdminName} (${newAdminEmail}) as ${newAdminRole}`);
      setEditingAdminEmail(null);
    } else {
      // Create
      const exists = adminAccounts.some(acc => acc.email.toLowerCase() === newAdminEmail.toLowerCase());
      if (exists) {
        alert('An administrator with this email ID already exists.');
        return;
      }
      const newAcc: AdminAccount = {
        email: newAdminEmail,
        name: newAdminName,
        password: newAdminPassword,
        role: newAdminRole
      };
      setAdminAccounts(prev => [...prev, newAcc]);
      addActivityLog(`Registered new administrator profile: ${newAdminName} (${newAdminEmail}) as ${newAdminRole}`);
    }

    // Reset Form
    setNewAdminEmail('');
    setNewAdminName('');
    setNewAdminPassword('');
    setNewAdminRole('Admin');
  };

  const handleDeleteAdmin = (email: string) => {
    if (email.toLowerCase() === currentAdmin?.email.toLowerCase()) {
      alert('Security violation: You cannot delete your own active administrator profile.');
      return;
    }
    const adminToDelete = adminAccounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());
    if (confirm(`Are you sure you want to revoke privileges and delete administrator account "${adminToDelete?.name}" (${email})?`)) {
      setAdminAccounts(prev => prev.filter(acc => acc.email.toLowerCase() !== email.toLowerCase()));
      addActivityLog(`Revoked privileges and deleted administrator account: ${adminToDelete?.name} (${email})`);
    }
  };

  const handleEditAdminSelect = (acc: AdminAccount) => {
    setEditingAdminEmail(acc.email);
    setNewAdminEmail(acc.email);
    setNewAdminName(acc.name);
    setNewAdminPassword('');
    setNewAdminRole(acc.role);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (authMethod === 'pin') {
      if (pin === '2026') {
        const ownerAcc = adminAccounts.find(a => a.email === 'codenavo@gmail.com') || { email: 'codenavo@gmail.com', password: '301THWALHA', role: 'Owner' };
        setCurrentAdmin(ownerAcc);
        setIsAuthenticated(true);
        onLoginSuccess();
        addActivityLog('Logged in via System PIN Code', 'codenavo@gmail.com');
      } else {
        setAuthError('Incorrect Administration PIN. Please check the default simulation PIN (2026).');
      }
      return;
    }

    // Email verify check
    const matched = adminAccounts.find(a => a.email.trim().toLowerCase() === adminEmail.trim().toLowerCase());
    if (!matched) {
      setAuthError('Unauthorized Administrator Email. No credential records matched.');
      return;
    }

    if (matched.password !== adminPassword) {
      setAuthError('Incorrect administrator password. Please retry.');
      return;
    }

    if (use2FA) {
      if (!otpSent) {
        // Trigger 2FA code generation
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(code);
        setOtpSent(true);
        
        // Save simulated smtp log
        const timestamp = new Date().toLocaleTimeString();
        setSystemLogs(prev => [
          `[${timestamp}] SMTP RELAY - Dispatching 2FA Code to ${adminEmail}`,
          `[${timestamp}] 2FA CONTAINER - Created token key #${code}`,
          ...prev
        ]);
      } else {
        if (enteredOtp === generatedOtp && generatedOtp !== '') {
          setCurrentAdmin(matched);
          setIsAuthenticated(true);
          onLoginSuccess();
          addActivityLog('Logged in via Email/Password with 2FA complete', matched.email);
        } else {
          setAuthError('Invalid 2FA code. Please check the simulated mailbox code and re-enter.');
        }
      }
    } else {
      // Instant login without 2FA
      setCurrentAdmin(matched);
      setIsAuthenticated(true);
      onLoginSuccess();
      addActivityLog('Logged in via Email/Password (2FA bypassed)', matched.email);
    }
  };

  const handleRequestOtp = () => {
    const matched = adminAccounts.find(a => a.email.trim().toLowerCase() === adminEmail.trim().toLowerCase());
    if (!matched) {
      setAuthError('Unauthorized Administrator Email. Access OTPs are only served to registered admins.');
      return;
    }
    // Generate lovely randomized numeric OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setAuthError('');
    // Save to simulated logs
    const timestamp = new Date().toLocaleTimeString();
    setSystemLogs(prev => [
      `[${timestamp}] SMTP RELAY - Outgoing 2FA Key to ${adminEmail}`,
      `[${timestamp}] ACCESS GRANTED - Created verification token #${code}`,
      ...prev
    ]);
  };

  // Student Actions
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.admissionNumber || !studentForm.fullName) {
      alert('Admission number and full name are required.');
      return;
    }

    if (editingStudentId !== null) {
      // Editing
      setStudents(prev => prev.map(s => s.admissionNumber === editingStudentId ? { ...s, ...studentForm as Student } : s));
      addActivityLog(`Modified student profile: ${studentForm.fullName} (AD No. ${studentForm.admissionNumber})`);
      setEditingStudentId(null);
    } else {
      // New
      const exists = students.some(s => s.admissionNumber === studentForm.admissionNumber);
      if (exists) {
        alert('Student with this admission number already exists.');
        return;
      }
      setStudents(prev => [...prev, studentForm as Student]);
      addActivityLog(`Created new student profile: ${studentForm.fullName} (AD No. ${studentForm.admissionNumber})`);
    }

    // Reset Form
    setStudentForm({
      admissionNumber: 0,
      fullName: '',
      role: '',
      teamId: undefined,
      attendancePercentage: 90,
      programsParticipated: [],
      achievements: [],
      bio: '',
      skills: []
    });
  };

  const handleDeleteStudent = (adNo: number) => {
    if (confirm(`Are you sure you want to delete student AD.NO ${adNo}?`)) {
      const student = students.find(s => s.admissionNumber === adNo);
      setStudents(prev => prev.filter(s => s.admissionNumber !== adNo));
      addActivityLog(`Deleted student profile: ${student?.fullName || 'Unknown'} (AD No. ${adNo})`);
    }
  };

  const handleEditStudentSelect = (student: Student) => {
    setEditingStudentId(student.admissionNumber);
    setStudentForm(student);
  };

  // Program Actions
  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!programForm.title || !programForm.date) {
      alert('Title and Event Date are required.');
      return;
    }

    if (editingProgramId !== null) {
      setPrograms(prev => prev.map(p => p.id === editingProgramId ? { ...p, ...programForm as Program } : p));
      addActivityLog(`Modified program event: ${programForm.title}`);
      setEditingProgramId(null);
    } else {
      const newProg: Program = {
        ...programForm as Program,
        id: `prog-${Date.now()}`,
        status: programForm.status || 'Upcoming'
      };
      setPrograms(prev => [...prev, newProg]);
      addActivityLog(`Added program event: ${programForm.title}`);
    }

    setProgramForm({
      id: '',
      title: '',
      date: '',
      venue: '',
      category: 'General',
      assignedTeamId: undefined,
      status: 'Upcoming',
      description: ''
    });
  };

  const handleDeleteProgram = (id: string) => {
    if (confirm('Delete this program? It will remove it from all connected pages.')) {
      const prog = programs.find(p => p.id === id);
      setPrograms(prev => prev.filter(p => p.id !== id));
      addActivityLog(`Deleted program event: ${prog?.title || 'Unknown'} (ID: ${id})`);
    }
  };

  // Notice Actions
  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.content) {
      alert('Title and notice content are required.');
      return;
    }

    if (editingNoticeId !== null) {
      setNotices(prev => prev.map(n => n.id === editingNoticeId ? { ...n, ...noticeForm as Notice } : n));
      addActivityLog(`Modified notice bulletin: ${noticeForm.title}`);
      setEditingNoticeId(null);
    } else {
      const newNotice: Notice = {
        ...noticeForm as Notice,
        id: `not-${Date.now()}`,
        date: noticeForm.date || new Date().toISOString().split('T')[0]
      };
      setNotices(prev => [...prev, newNotice]);
      addActivityLog(`Published new notice bulletin: ${noticeForm.title}`);
    }

    setNoticeForm({
      id: '',
      title: '',
      date: '',
      content: '',
      type: 'general'
    });
  };

  const handleDeleteNotice = (id: string) => {
    if (confirm('Delete this notice announcement?')) {
      const notice = notices.find(n => n.id === id);
      setNotices(prev => prev.filter(n => n.id !== id));
      addActivityLog(`Removed notice bulletin: ${notice?.title || 'Unknown'} (ID: ${id})`);
    }
  };

  // Gallery actions
  const handleAddGalleryImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.imageUrl || !galleryForm.title) {
      alert('Title and Image URL are required.');
      return;
    }
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: galleryForm.title || 'Inauguration photo',
      imageUrl: galleryForm.imageUrl || '',
      category: galleryForm.category || 'Swalah Talent',
      description: galleryForm.description || '',
      date: galleryForm.date || new Date().toISOString().split('T')[0]
    };
    setGallery(prev => [newItem, ...prev]);
    addActivityLog(`Uploaded gallery photo: ${galleryForm.title}`);
    setGalleryForm({ id: '', title: '', imageUrl: '', category: 'Swalah Talent', description: '', date: '' });
  };

  const handleDeleteGallery = (id: string) => {
    if (confirm('Delete this gallery item?')) {
      const item = gallery.find(g => g.id === id);
      setGallery(prev => prev.filter(g => g.id !== id));
      addActivityLog(`Deleted gallery photo: ${item?.title || 'Unknown'} (ID: ${id})`);
    }
  };

  // Transactions actions
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionForm.amount || !transactionForm.description) {
      alert('Amount and Description are required.');
      return;
    }
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: transactionForm.type || 'expense',
      amount: Number(transactionForm.amount),
      category: transactionForm.category || 'Sponsorship',
      date: transactionForm.date || new Date().toISOString().split('T')[0],
      description: transactionForm.description || ''
    };
    setTransactions(prev => [newTx, ...prev]);
    addActivityLog(`Added transaction receipt: [${newTx.type.toUpperCase()}] ${newTx.description} (${newTx.amount} INR)`);
    setTransactionForm({ id: '', type: 'income', amount: 0, category: 'Sponsorship', date: '', description: '' });
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Delete this transaction receipt?')) {
      const tx = transactions.find(t => t.id === id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      addActivityLog(`Deleted transaction receipt: [${tx?.type.toUpperCase() || 'Expense'}] ${tx?.description || 'Unknown'} (${tx?.amount || 0} INR)`);
    }
  };

  // Export JSON Backup
  const exportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      students,
      programs,
      teams,
      notices,
      gallery,
      transactions,
      attendance
    }, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `swalah_union_backup_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-300">
        <div className="max-w-md w-full space-y-6 p-8 bg-[#160d08]/90 backdrop-blur-md rounded-2xl border border-gold/35 shadow-[0_0_50px_rgba(255,167,38,0.15)] relative">
          <div className="absolute top-3 right-4 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest text-gold bg-gold/10 border border-gold/20">
            SECURE PORTAL
          </div>
          
          <div className="text-center space-y-2 pt-4">
            <h2 className="text-center text-3xl font-display font-extrabold text-white tracking-tight">
              Swalah Admin Hub
            </h2>
            <p className="text-stone-400 text-xs">
              Authorized admin dashboard verification center
            </p>
          </div>

          {/* Authentication Method Selection Tab */}
          <div className="grid grid-cols-2 p-1 bg-black/60 rounded-xl border border-white/5 text-xs text-stone-400">
            <button
              onClick={() => {
                setAuthMethod('email');
                setAuthError('');
                setOtpSent(false);
              }}
              className={`py-2 rounded-lg font-semibold transition-all ${
                authMethod === 'email'
                  ? 'bg-gold text-black font-extrabold shadow-md'
                  : 'hover:text-stone-200'
              }`}
            >
              Primary Email Auth
            </button>
            <button
              onClick={() => {
                setAuthMethod('pin');
                setAuthError('');
              }}
              className={`py-2 rounded-lg font-semibold transition-all ${
                authMethod === 'pin'
                  ? 'bg-gold text-black font-extrabold shadow-md'
                  : 'hover:text-stone-300'
              }`}
            >
              System PIN Code
            </button>
          </div>

          <form className="mt-4 space-y-5" onSubmit={handleLogin}>
            {authMethod === 'email' ? (
              <div className="space-y-4">
                {/* Email Address */}
                <div>
                  <label className="block text-xs uppercase font-mono text-gold mb-1.5 tracking-wider">Admin Email ID</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="codenavo@gmail.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="appearance-none rounded-xl relative block w-full pl-10 pr-4 py-3 bg-stone-950 border border-gold/20 placeholder-stone-600 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-xs font-semibold"
                      required
                    />
                    <Mail size={14} className="absolute left-3.5 top-3.5 text-stone-500" />
                  </div>
                </div>

                {/* Password (if OTP not yet sent) */}
                {!otpSent && (
                  <div>
                    <label className="block text-xs uppercase font-mono text-gold mb-1.5 tracking-wider">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="appearance-none rounded-xl relative block w-full pl-10 pr-10 py-3 bg-stone-950 border border-gold/20 placeholder-stone-600 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-xs font-semibold"
                        required
                      />
                      <Key size={14} className="absolute left-3.5 top-3.5 text-stone-500" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-stone-500 hover:text-stone-300"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* 2FA toggle switch (if OTP not yet sent) */}
                {!otpSent && (
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-gold" />
                      <div className="text-left">
                        <p className="text-xs text-stone-200 font-semibold font-sans">Two-Factor Authentication (2FA)</p>
                        <p className="text-[10px] text-stone-500">Require secure one-time passcode verification</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={use2FA}
                        onChange={(e) => setUse2FA(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-stone-300 after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold animate-none"></div>
                    </label>
                  </div>
                )}

                {/* Request OTP dispatch button / OTP verify field */}
                {otpSent && (
                  <div className="space-y-3.5 animate-fade-in p-3 bg-gold/5 border border-gold/25 rounded-xl">
                    <div className="flex items-center justify-between text-xs text-gold">
                      <span className="font-semibold flex items-center gap-1">
                        <Check size={12} /> 2FA Verification Key Dispatched!
                      </span>
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        className="text-[10px] underline text-stone-400 hover:text-white"
                      >
                        Resend Code
                      </button>
                    </div>

                    {/* Secure generated simulated OTP mailbox alert notification */}
                    <div className="p-2.5 bg-black/60 rounded border border-white/5 text-[11px] space-y-1 text-left">
                      <p className="font-mono text-stone-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        [Simulated Inbox: <strong>{adminEmail}</strong>]
                      </p>
                      <p className="text-white mt-0.5">
                        Your Swalah Admin OTP login code is: <strong className="text-gold text-xs font-mono select-all bg-gold/15 px-1.5 py-0.5 rounded border border-gold/20 tracking-wider">{generatedOtp}</strong>
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Enter 6-Digit OTP Key</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="••••••"
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-black border border-gold/20 rounded-xl py-2 px-3 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-gold"
                        />
                        <button
                          type="button"
                          onClick={() => setEnteredOtp(generatedOtp)}
                          className="px-3 bg-stone-900 border border-stone-800 hover:bg-stone-800 text-[10px] text-stone-300 rounded-xl uppercase font-bold cursor-pointer"
                          title="Instant autofill key for faster development testing"
                        >
                          Autofill
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-md space-y-2">
                <div>
                  <label className="block text-xs uppercase font-mono text-gold mb-1">Enter Secret PIN</label>
                  <input
                    type="password"
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 bg-[#160d08] border border-gold/25 placeholder-stone-600 text-white focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold focus:z-10 text-center text-2xl font-mono tracking-widest"
                    maxLength={6}
                  />
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-stone-500 font-mono">HINT: DEFAULT SIMULATION PIN IS <strong className="text-gold">2026</strong></p>
                </div>
              </div>
            )}

            {authError && (
              <div className="text-red-400 text-xs flex items-center gap-1.5 p-2 px-3 bg-red-950/40 rounded-lg border border-red-500/20">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-black bg-gold hover:bg-[#FF8C00] font-display transition-all duration-200 shadow-md hover:shadow-gold/25 cursor-pointer"
              >
                {!otpSent && authMethod === 'email' && use2FA ? 'Request Secure 2FA' : 'Verify Authorization'}
              </button>
            </div>
          </form>

          {/* System logs view inside login form container for premium backend simulation */}
          {systemLogs.length > 0 && (
            <div className="pt-2 border-t border-white/5 font-mono text-[9px] text-stone-500 overflow-hidden text-left">
              <span className="text-stone-400 font-semibold text-[10px] uppercase block mb-1">SECURE SMTP LOGS:</span>
              <div className="max-h-16 overflow-y-auto space-y-0.5 pr-1">
                {systemLogs.slice(0, 3).map((log, lIdx) => (
                  <p key={lIdx} className="truncate select-none">{log}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Controls Board */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 glass-panel rounded-2xl border border-gold/20">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Lock size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-display font-extrabold text-white text-gold-glow">
              {currentAdmin?.role === 'Owner' ? 'Welcome, Website Owner' : 'Welcome, Class Administrator'}
            </h2>
            <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
              <CheckCircle2 size={12} /> SECURE TERMINAL ACTIVE • {currentAdmin?.email || 'codenavo@gmail.com'} ({currentAdmin?.role || 'Owner'})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Duty Rotation */}
          <button
            onClick={() => {
              triggerDutyRotation();
              addActivityLog('Rotated weekly active duty team roster manually');
              alert('Automated Weekly Duty Rotation complete! Active team index rotated and duties completed updated everywhere.');
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20 flex items-center gap-1 transition-all"
            title="Automatically updates current duty team to the next"
          >
            <RefreshCw size={14} />
            Rotate Duty Team
          </button>

          {/* Backup Database */}
          <button
            onClick={() => {
              exportBackup();
              addActivityLog('Downloaded local database JSON backup record');
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#1e140d] text-stone-300 border border-stone-800 hover:border-gold/30 flex items-center gap-1 transition-all"
          >
            <Download size={14} />
            Database Backup
          </button>

          <button
            onClick={() => {
              addActivityLog('Logged out and locked administrative terminal');
              onLogout();
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-red-950/20 text-red-400 border border-red-500/20 hover:bg-red-950/40 transition-colors"
          >
            Lock Terminal
          </button>
        </div>
      </div>

      {/* Database Category Select Bar */}
      <div className="flex flex-wrap gap-1 p-1 bg-[#100906] border border-stone-800 rounded-xl">
        <button
          onClick={() => setAdminTab('students')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            adminTab === 'students' ? 'text-gold bg-gold/10' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Users size={14} /> Students ({students.length})
        </button>
        <button
          onClick={() => setAdminTab('programs')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            adminTab === 'programs' ? 'text-gold bg-gold/10' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Calendar size={14} /> Programs ({programs.length})
        </button>
        <button
          onClick={() => setAdminTab('notices')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            adminTab === 'notices' ? 'text-gold bg-gold/10' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Megaphone size={14} /> Notices ({notices.length})
        </button>
        <button
          onClick={() => setAdminTab('gallery')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            adminTab === 'gallery' ? 'text-gold bg-gold/10' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Image size={14} /> Gallery ({gallery.length})
        </button>
        <button
          onClick={() => setAdminTab('finance')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            adminTab === 'finance' ? 'text-gold bg-gold/10' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <DollarSign size={14} /> Finances ({transactions.length})
        </button>
        <button
          onClick={() => setAdminTab('email')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            adminTab === 'email' ? 'text-gold bg-gold/10' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Mail size={14} /> Send Emails ({sentEmails.length})
        </button>
        <button
          onClick={() => setAdminTab('logs')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            adminTab === 'logs' ? 'text-gold bg-gold/10' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Activity size={14} /> Security Logs ({activityLogs.length})
        </button>
        <button
          onClick={() => setAdminTab('admins')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            adminTab === 'admins' ? 'text-gold bg-gold/10' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Shield size={14} /> Manage Admins ({adminAccounts.length})
        </button>
      </div>

      {/* Tab Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Input/Edit Panel Form */}
        <div className="lg:col-span-1 p-6 glass-panel rounded-2xl border border-gold/15 space-y-5 h-fit">
          <h3 className="text-base font-display font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0 border border-black" />
            {editingStudentId || editingProgramId || editingNoticeId || editingAdminEmail ? 'Modify Entry' : adminTab === 'logs' ? 'Security Operations' : 'Add New Entry'}
          </h3>

          {/* Student Form */}
          {adminTab === 'students' && (
            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Admission Number</label>
                <input
                  type="number"
                  placeholder="288"
                  disabled={editingStudentId !== null}
                  value={studentForm.admissionNumber || ''}
                  onChange={(e) => setStudentForm({ ...studentForm, admissionNumber: Number(e.target.value) })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="MOHAMMAD NABEEL"
                  value={studentForm.fullName || ''}
                  onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value.toUpperCase() })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Committee Position / Role</label>
                <input
                  type="text"
                  placeholder="President / Student Representative"
                  value={studentForm.role || ''}
                  onChange={(e) => setStudentForm({ ...studentForm, role: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Team Assignment</label>
                  <select
                    value={studentForm.teamId || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, teamId: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  >
                    <option value="">Unassigned</option>
                    <option value="1">Team 1</option>
                    <option value="2">Team 2</option>
                    <option value="3">Team 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Attendance %</label>
                  <input
                    type="number"
                    value={studentForm.attendancePercentage || 90}
                    onChange={(e) => setStudentForm({ ...studentForm, attendancePercentage: Math.min(100, Math.max(0, Number(e.target.value))) })}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Student bio</label>
                <textarea
                  placeholder="Short introduction..."
                  value={studentForm.bio || ''}
                  onChange={(e) => setStudentForm({ ...studentForm, bio: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white h-20"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gold text-black hover:bg-[#FF8C00] py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer"
              >
                {editingStudentId ? 'Update Student Record' : 'Add Student Account'}
              </button>
            </form>
          )}

          {/* Program Form */}
          {adminTab === 'programs' && (
            <form onSubmit={handleSaveProgram} className="space-y-4">
              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Program Title</label>
                <input
                  type="text"
                  placeholder="E.g., Mushaira Night"
                  value={programForm.title || ''}
                  onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Category / Wing</label>
                  <select
                    value={programForm.category || 'General'}
                    onChange={(e) => setProgramForm({ ...programForm, category: e.target.value as any })}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  >
                    <option value="Arabic">Arabic</option>
                    <option value="English">English</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Kannada">Kannada</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Duty Team ID</label>
                  <select
                    value={programForm.assignedTeamId || ''}
                    onChange={(e) => setProgramForm({ ...programForm, assignedTeamId: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  >
                    <option value="">None Assigned</option>
                    <option value="1">Team 1</option>
                    <option value="2">Team 2</option>
                    <option value="3">Team 3</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Event Date</label>
                  <input
                    type="date"
                    value={programForm.date || ''}
                    onChange={(e) => setProgramForm({ ...programForm, date: e.target.value })}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Program Status</label>
                  <select
                    value={programForm.status || 'Upcoming'}
                    onChange={(e) => setProgramForm({ ...programForm, status: e.target.value as any })}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Registration Open">Registration Open</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Venue</label>
                <input
                  type="text"
                  placeholder="Main Hall B"
                  value={programForm.venue || ''}
                  onChange={(e) => setProgramForm({ ...programForm, venue: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Program Description</label>
                <textarea
                  placeholder="Event itinerary and details..."
                  value={programForm.description || ''}
                  onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white h-24"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gold text-black hover:bg-[#FF8C00] py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer"
              >
                {editingProgramId ? 'Update Program' : 'Declare Program Event'}
              </button>
            </form>
          )}

          {/* Notice Form */}
          {adminTab === 'notices' && (
            <form onSubmit={handleSaveNotice} className="space-y-4">
              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Notice Title</label>
                <input
                  type="text"
                  placeholder="Important updates..."
                  value={noticeForm.title || ''}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Notice Category</label>
                  <select
                    value={noticeForm.type || 'general'}
                    onChange={(e) => setNoticeForm({ ...noticeForm, type: e.target.value as any })}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                  >
                    <option value="general">General</option>
                    <option value="meeting">Union Meeting</option>
                    <option value="exam">Academic Exam</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Posting Date</label>
                  <input
                    type="date"
                    value={noticeForm.date || ''}
                    onChange={(e) => setNoticeForm({ ...noticeForm, date: e.target.value })}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Notice Body / Content</label>
                <textarea
                  placeholder="Detailed instructions for student peers..."
                  value={noticeForm.content || ''}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white h-32"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gold text-black hover:bg-[#FF8C00] py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer"
              >
                {editingNoticeId ? 'Update Notice' : 'Post Announcement'}
              </button>
            </form>
          )}

          {/* Gallery Form */}
          {adminTab === 'gallery' && (
            <form onSubmit={handleAddGalleryImage} className="space-y-4">
              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Photo Moment Title</label>
                <input
                  type="text"
                  placeholder="E.g., Anniversary Ceremony"
                  value={galleryForm.title || ''}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Category Event Theme</label>
                <select
                  value={galleryForm.category || 'Swalah Talent'}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                >
                  <option value="anniversary 2026">anniversary 2026</option>
                  <option value="Quiz Finals">Quiz Finals</option>
                  <option value="Swalah Talent">Swalah Talent</option>
                  <option value="Creative Canvas">Creative Canvas</option>
                  <option value="Vision & Action">Vision & Action</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Unsplash/Direct Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={galleryForm.imageUrl || ''}
                  onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="Highlights of the winner..."
                  value={galleryForm.description || ''}
                  onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gold text-black hover:bg-[#FF8C00] py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer"
              >
                Upload Photo Item
              </button>
            </form>
          )}

          {/* Finance form */}
          {adminTab === 'finance' && (
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Transaction Category</label>
                <select
                  value={transactionForm.type || 'expense'}
                  onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value as any })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                >
                  <option value="income">Income (Deposit)</option>
                  <option value="expense">Expense (Disbursal)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Amount (INR)</label>
                <input
                  type="number"
                  placeholder="5000"
                  value={transactionForm.amount || ''}
                  onChange={(e) => setTransactionForm({ ...transactionForm, amount: Number(e.target.value) })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Source / Category Group</label>
                <select
                  value={transactionForm.category || 'Sponsorship'}
                  onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                >
                  <option value="Sponsorship">Sponsorship</option>
                  <option value="Member contribution">Union Fees</option>
                  <option value="Programs">Programs Expense</option>
                  <option value="Refreshments">Refreshments</option>
                  <option value="Certificates & Medals">Prizes & Certs</option>
                  <option value="Administrative">Stationery</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Sponsorship for Kannada drama kit..."
                  value={transactionForm.description || ''}
                  onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gold text-black hover:bg-[#FF8C00] py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer"
              >
                Log Transaction
              </button>
            </form>
          )}

          {/* Email dispatch composer form */}
          {adminTab === 'email' && (
            <form onSubmit={handleComposeEmail} className="space-y-4 animate-fade-in">
              {/* Sender Details (Fixed for Secure Auth) */}
              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1.5">SMTP Sender Node</label>
                <div className="bg-stone-950 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-stone-300 font-mono select-all">
                  codenavo@gmail.com
                </div>
              </div>

              {/* Recipient types selector dropdown */}
              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1.5">Recipient Target Group</label>
                <select
                  value={emailRecipientType}
                  onChange={(e) => {
                    setEmailRecipientType(e.target.value);
                    if (e.target.value === 'Individual Representative' && students.length > 0 && !selectedIndividualStudentAdNo) {
                      setSelectedIndividualStudentAdNo(students[0].admissionNumber.toString());
                    }
                  }}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                >
                  <option value="All Students">All Students (31+ members)</option>
                  <option value="Committee Members">Union Committee Members</option>
                  <option value="Team 1">Union Duty Team 1</option>
                  <option value="Team 2">Union Duty Team 2</option>
                  <option value="Team 3">Union Duty Team 3</option>
                  <option value="Individual Representative">Specific Class Representative</option>
                </select>
              </div>

              {/* Individual Student Picker if selected */}
              {emailRecipientType === 'Individual Representative' && (
                <div className="animate-fade-in">
                  <label className="block text-xs text-stone-400 uppercase font-mono mb-1.5">Select Student</label>
                  <select
                    value={selectedIndividualStudentAdNo}
                    onChange={(e) => setSelectedIndividualStudentAdNo(e.target.value)}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  >
                    {students.map((st) => (
                      <option key={st.admissionNumber} value={st.admissionNumber}>
                        {st.fullName} (AD No: {st.admissionNumber})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quick Preset Buttons */}
              <div>
                <label className="block text:[10px] text-stone-500 uppercase font-mono mb-1 tracking-wider text-[10px]">Union Email Presets</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEmailSubject('Reminder: Core Union Duty Rotation Cycle Active');
                      setEmailBody(`Peace be upon you,\n\nThis is an administrative email reminding your team of the active rotational cycle requirements.\n\nPlease communicate with your captain to organize venue entries and assist with seating plans before programs.\n\nWarm regards,\nSwalah Administration`);
                    }}
                    className="p-1 px-2 text-left bg-stone-950 hover:bg-white/5 border border-white/5 rounded text-[10px] text-stone-400 font-semibold truncate hover:text-white transition-colors"
                  >
                    📢 Duty Rotation call
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailSubject('Warning: Academic Attendance Record Status Alert');
                      setEmailBody(`Assalamu Alaikum,\n\nThis is a standard review notification indicating that your program attendance record has dropped below the threshold.\n\nPlease complete your attendance checkboxes during programs to raise your profile stats.\n\nWarm regards,\nSwalah Union Convener`);
                    }}
                    className="p-1 px-2 text-left bg-stone-950 hover:bg-white/5 border border-white/5 rounded text-[10px] text-stone-400 font-semibold truncate hover:text-white transition-colors"
                  >
                    ⚠️ Attendance Low
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailSubject('Invitation: Swalah Union Special General Assembly Meeting');
                      setEmailBody(`Dear Student,\n\nYou are cordially invited to attend the Swalah General Assembly. Agenda includes student talent presentations, and announcement of leaderboard winners.\n\nTime: 4:30 PM\nVenue: Swalah Student Lounge\n\nSee you there!`);
                    }}
                    className="p-1 px-2 text-left bg-stone-950 hover:bg-white/5 border border-white/5 rounded text-[10px] text-stone-400 font-semibold truncate hover:text-white transition-colors"
                  >
                    🤝 Assembly Meet
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailSubject('');
                      setEmailBody('');
                    }}
                    className="p-1 px-2 text-left bg-stone-950 hover:bg-white/5 border border-white/5 rounded text-[10px] text-stone-500 truncate hover:text-white transition-colors border-dashed"
                  >
                    ✏️ Clear Draft
                  </button>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Subject Line</label>
                <input
                  type="text"
                  placeholder="Subject of the email is..."
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  required
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Message Body</label>
                <textarea
                  placeholder="Body content of the email announcement..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white h-32"
                  required
                />
              </div>

              {/* Priority & Submit */}
              <div className="grid grid-cols-2 gap-3 pb-1">
                <div>
                  <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Priority Tags</label>
                  <select
                    value={emailPriority}
                    onChange={(e) => setEmailPriority(e.target.value as any)}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">⚠️ High Priority</option>
                    <option value="Announcement">📢 Announcement</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={smtpStatus === 'sending'}
                    className={`w-full h-[38px] flex items-center justify-center gap-1.5 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer ${
                      smtpStatus === 'sending'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/35 animate-pulse'
                        : smtpStatus === 'success'
                        ? 'bg-emerald-505 bg-emerald-500 text-black font-semibold'
                        : 'bg-gold text-black hover:bg-[#FF8C00]'
                    }`}
                  >
                    <Send size={13} />
                    <span>
                      {smtpStatus === 'sending'
                        ? 'Relaying...'
                        : smtpStatus === 'success'
                        ? 'Sent!'
                        : 'Send Email'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Admin accounts Form */}
          {adminTab === 'admins' && (
            currentAdmin?.role === 'Owner' ? (
              <form onSubmit={handleSaveAdmin} className="space-y-4 animate-fade-in text-left">
                <div>
                  <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Administrator Name</label>
                  <input
                    type="text"
                    placeholder="E.g., Aisha Ibrahim"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Email ID Handle</label>
                  <input
                    type="email"
                    placeholder="E.g., admin_aisha@gmail.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                    disabled={editingAdminEmail !== null}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 uppercase font-mono mb-1">
                    {editingAdminEmail ? 'New Password (Leave blank to keep same)' : 'Login Password'}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                    required={!editingAdminEmail}
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Terminal Privilege Role</label>
                  <select
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value as any)}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                  >
                    <option value="Admin">Administrator (Standard permissions)</option>
                    <option value="Owner">Owner (Full administrative rights)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold text-black hover:bg-[#FF8C00] py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer"
                >
                  {editingAdminEmail ? 'Apply Modifications' : 'Create Admin Account'}
                </button>
              </form>
            ) : (
              <div className="p-4 bg-red-950/20 border border-red-500/15 rounded-xl text-center space-y-2 text-xs text-red-400 font-medium">
                <Shield size={28} className="mx-auto text-red-400 opacity-80" />
                <p>Owner privilege tier required to create, update, or revoke admin accounts.</p>
              </div>
            )
          )}

          {/* Logs Category Quick View / Operations */}
          {adminTab === 'logs' && (
            <div className="space-y-4 animate-fade-in text-left">
              <div className="p-4 bg-stone-900/60 border border-white/5 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>INTEGRITY VERIFIED</span>
                </div>
                <p className="text-stone-400 leading-relaxed text-[11px] font-sans">
                  Chronological activity logs persist in local browser storage to monitor administrative audits.
                </p>
                <div className="pt-2 border-t border-white/5 space-y-1.5 font-mono text-[11px] text-stone-300">
                  <div className="flex justify-between">
                    <span>Audit Events:</span>
                    <strong className="text-gold">{activityLogs.length}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Session Operator:</span>
                    <strong className="text-white truncate max-w-[120px]" title={currentAdmin?.name}>{currentAdmin?.name}</strong>
                  </div>
                </div>
              </div>

              {currentAdmin?.role === 'Owner' && (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to permanently clear the activity log archives? This is irreversible.')) {
                      setActivityLogs([{
                        id: `log-${Date.now()}`,
                        user: currentAdmin?.email || 'codenavo@gmail.com',
                        action: 'Cleared activity log archives permanently',
                        timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }]);
                      alert('Archives cleared successfully.');
                    }
                  }}
                  className="w-full bg-red-950/20 text-red-400 border border-red-500/15 hover:bg-red-950/40 py-2 rounded-xl text-xs font-semibold uppercase transition-colors cursor-pointer"
                >
                  Clear Log Archives
                </button>
              )}
            </div>
          )}

          {/* Active Edit reset button */}
          {(editingStudentId || editingProgramId || editingNoticeId || editingAdminEmail) && (
            <button
              onClick={() => {
                setEditingStudentId(null);
                setEditingProgramId(null);
                setEditingNoticeId(null);
                setEditingAdminEmail(null);
                setNewAdminEmail('');
                setNewAdminName('');
                setNewAdminPassword('');
                setNewAdminRole('Admin');
                setStudentForm({ admissionNumber: 0, fullName: '', role: '', teamId: undefined, attendancePercentage: 90, programsParticipated: [], achievements: [], bio: '', skills: [] });
                setProgramForm({ id: '', title: '', date: '', venue: '', category: 'General', assignedTeamId: undefined, status: 'Upcoming', description: '' });
                setNoticeForm({ id: '', title: '', date: '', content: '', type: 'general' });
              }}
              className="w-full mt-2 bg-stone-850 hover:bg-stone-800 text-stone-400 py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Cancel Editing
            </button>
          )}
        </div>

        {/* Database List Display Panel */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Student Account Management database lists */}
          {adminTab === 'students' && (
            <div className="p-6 glass-panel rounded-2xl border border-white/5 space-y-4">
              <h4 className="text-sm font-semibold text-stone-200">Class Student Registry ({students.length})</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-stone-400 pb-2">
                      <th className="py-2.5">AD #</th>
                      <th>Student Name</th>
                      <th>Position</th>
                      <th>Team ID</th>
                      <th className="text-right">Attendance</th>
                      <th className="text-right">Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((st) => (
                      <tr key={st.admissionNumber} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                        <td className="py-3 font-mono font-bold text-gold">{st.admissionNumber}</td>
                        <td className="font-semibold text-white">{st.fullName}</td>
                        <td className="text-stone-400 text-[11px]">{st.role || 'Member'}</td>
                        <td className="text-stone-300">
                          {st.teamId ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[10px]">
                              Team {st.teamId}
                            </span>
                          ) : (
                            <span className="text-stone-500 text-[10px]">NONE</span>
                          )}
                        </td>
                        <td className="text-right font-mono text-stone-300">{st.attendancePercentage}%</td>
                        <td className="text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => handleEditStudentSelect(st)}
                              className="p-1 text-stone-400 hover:text-gold hover:bg-white/5 rounded"
                              title="Edit"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(st.admissionNumber)}
                              className="p-1 text-stone-400 hover:text-red-400 hover:bg-white/5 rounded"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Program list */}
          {adminTab === 'programs' && (
            <div className="p-6 glass-panel rounded-2xl border border-white/5 space-y-3">
              <h4 className="text-sm font-semibold text-stone-200">Declared Programs ({programs.length})</h4>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {programs.map((p) => (
                  <div key={p.id} className="p-4 bg-stone-900/40 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider rounded uppercase bg-gold/15 text-gold border border-gold/20">
                        {p.category} Wing
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{p.title}</h4>
                      <p className="text-[11px] text-stone-400">
                        Date: {p.date} • Venue: {p.venue} • Status:{' '}
                        <strong className="text-amber-400">{p.status}</strong>
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingProgramId(p.id);
                          setProgramForm(p);
                        }}
                        className="p-1 px-2 rounded border border-stone-800 text-stone-400 hover:text-gold"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteProgram(p.id)}
                        className="p-1 px-2 rounded border border-stone-800 text-stone-400 hover:text-red-400"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notice List */}
          {adminTab === 'notices' && (
            <div className="p-6 glass-panel rounded-2xl border border-white/5 space-y-3">
              <h4 className="text-sm font-semibold text-stone-200">Announced Notice Cards ({notices.length})</h4>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {notices.map((n) => (
                  <div key={n.id} className="p-4 bg-stone-900/40 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono font-bold text-gold bg-gold/10 px-2 py-0.5 rounded">
                          {n.type}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">{n.date}</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white">{n.title}</h4>
                      <p className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed">{n.content}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingNoticeId(n.id);
                          setNoticeForm(n);
                        }}
                        className="p-1.5 rounded border border-stone-800 text-stone-400 hover:text-gold"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteNotice(n.id)}
                        className="p-1.5 rounded border border-stone-800 text-stone-400 hover:text-red-400"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery categories and images */}
          {adminTab === 'gallery' && (
            <div className="p-6 glass-panel rounded-2xl border border-white/5 space-y-4">
              <h4 className="text-sm font-semibold text-stone-200">Gallery Media Ledger ({gallery.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                {gallery.map((g) => (
                  <div key={g.id} className="p-2 bg-stone-900/30 border border-white/5 rounded-xl flex gap-3 relative">
                    <img src={g.imageUrl} alt="" className="w-16 h-16 rounded object-cover shrink-0" referrerPolicy="no-referrer" />
                    <div className="text-xs overflow-hidden">
                      <span className="text-[9px] text-gold font-bold uppercase font-mono block mb-0.5">{g.category}</span>
                      <h5 className="font-bold text-white truncate">{g.title}</h5>
                      <span className="text-[10px] text-stone-500 block">{g.date}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteGallery(g.id)}
                      className="absolute top-2 right-2 p-1 text-stone-400 hover:text-red-400"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Finances transaction summaries */}
          {adminTab === 'finance' && (
            <div className="p-6 glass-panel rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <h4 className="text-sm font-semibold text-stone-200">Union Transaction Logs ({transactions.length})</h4>
                <div className="text-right">
                  <span className="text-xs text-stone-500 block font-mono">Current Balance</span>
                  <span className="text-lg font-mono font-bold text-gold">
                    {transactions.reduce((acc, curr) => curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0).toLocaleString()} INR
                  </span>
                </div>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-3 bg-stone-900/50 border border-white/5 rounded-xl flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <span className={`text-[9px] uppercase font-bold font-mono px-1.5 py-0.5 rounded ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {tx.type} • {tx.category}
                      </span>
                      <h4 className="text-white font-semibold">{tx.description}</h4>
                      <p className="text-[10px] text-stone-500 font-mono">{tx.date}</p>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <strong className={tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}>
                        {tx.type === 'income' ? '+' : '-'}{tx.amount} INR
                      </strong>
                      <button
                        onClick={() => handleDeleteTransaction(tx.id)}
                        className="p-1 text-stone-500 hover:text-red-400 bg-black/20 rounded"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Received/dispatched emails tracking archive */}
          {adminTab === 'email' && (
            <div className="p-6 glass-panel rounded-2xl border border-white/5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                <div>
                  <h4 className="text-sm font-bold text-stone-200">Dispatched Communiqués Registry</h4>
                  <p className="text-[10px] text-stone-400">SMTP Relays relayed on behalf of admin nodes</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-500 block font-mono">Simulated Channels</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                    ● STABLE SMTP RELAY
                  </span>
                </div>
              </div>

              {sentEmails.length === 0 ? (
                <div className="py-12 text-center text-stone-600 bg-black/20 rounded-xl space-y-2">
                  <Mail size={32} className="mx-auto opacity-20" />
                  <p className="text-xs italic font-medium">No active emails dispatched in this session.</p>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
                  {sentEmails.map((mail) => (
                    <div key={mail.id} className="p-4 bg-stone-900/60 border border-white/5 rounded-xl space-y-3 relative hover:border-gold/25 transition-all">
                      {/* Meta Information Row */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-white/5 pb-2 text-[10px] font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-stone-950 border border-white/10 text-stone-400 font-bold font-mono">
                            TO: {mail.recipientType}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold font-mono ${
                            mail.priority === 'High' 
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                              : mail.priority === 'Announcement' 
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                              : 'bg-stone-850 text-stone-300'
                          }`}>
                            {mail.priority}
                          </span>
                        </div>

                        <div className="text-stone-500 flex items-center gap-2 font-mono">
                          <span>{mail.date}</span>
                          <span className="text-emerald-400 flex items-center gap-0.5 font-mono">
                            <Check size={10} /> {mail.status}
                          </span>
                        </div>
                      </div>

                      {/* Subject and Body */}
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-extrabold text-[#FFA726] tracking-tight">
                          {mail.subject || '(No Subject Line Provided)'}
                        </h4>
                        <div className="bg-[#100906] p-2.5 rounded border border-white/5">
                          <p className="text-xs text-stone-300 whitespace-pre-wrap font-sans leading-relaxed text-[11px]">
                            {mail.content}
                          </p>
                        </div>
                      </div>

                      {/* Stats & Deletion controls */}
                      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-stone-400 font-mono">
                        <span className="flex items-center gap-1 font-mono">
                          Simulated Open-Rate: <strong className="text-gold font-bold">{mail.openRate || '100%'}</strong>
                        </span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-[9px] text-stone-600">Sender: {mail.sender}</span>
                          <button
                            onClick={() => handleDeleteSentEmail(mail.id)}
                            className="p-1 px-2 bg-red-950/20 text-red-400 border border-red-500/15 rounded hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="Remove copy from storage logs"
                          >
                            Delete Receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Audit Logs list */}
          {adminTab === 'logs' && (
            <div className="p-6 glass-panel rounded-2xl border border-white/5 space-y-4 animate-fade-in text-left">
              <div>
                <h4 className="text-sm font-bold text-stone-200">Chronological Security Audit Log</h4>
                <p className="text-[11px] text-stone-500">System operations, CRUD events and login verification audits</p>
              </div>

              {activityLogs.length === 0 ? (
                <div className="py-12 text-center text-stone-600 bg-black/20 rounded-xl space-y-2">
                  <Activity size={32} className="mx-auto opacity-20" />
                  <p className="text-xs italic font-medium">No audit events logged in this session.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="p-3.5 bg-stone-900/40 border border-white/5 rounded-xl flex items-start justify-between gap-4 text-xs font-mono">
                      <div className="space-y-1">
                        <p className="text-white font-sans text-xs">{log.action}</p>
                        <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono">
                          <span className="text-gold font-semibold">{log.user}</span>
                          <span>•</span>
                          <span>ID: {log.id}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono shrink-0 whitespace-nowrap bg-stone-950 border border-white/5 px-2 py-0.5 rounded">
                        {log.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Manage Admins List */}
          {adminTab === 'admins' && (
            <div className="p-6 glass-panel rounded-2xl border border-white/5 space-y-4 animate-fade-in text-left">
              <div>
                <h4 className="text-sm font-bold text-stone-200">Registered Administrator Accounts</h4>
                <p className="text-[11px] text-stone-500">Authorized personnel with terminal dashboard access privileges</p>
              </div>

              <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2">
                {adminAccounts.map((acc) => (
                  <div key={acc.email} className="p-4 bg-stone-900/40 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center text-gold">
                        <Shield size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-bold text-white">{acc.name}</h5>
                          <span className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded ${
                            acc.role === 'Owner' 
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {acc.role}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 font-mono mt-0.5">{acc.email}</p>
                      </div>
                    </div>

                    {currentAdmin?.role === 'Owner' && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditAdminSelect(acc)}
                          className="p-1.5 rounded border border-stone-800 text-stone-400 hover:text-gold hover:border-gold/30 transition-all cursor-pointer"
                          title="Edit administrator credentials"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(acc.email)}
                          className="p-1.5 rounded border border-stone-800 text-stone-400 hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer"
                          disabled={acc.email.toLowerCase() === currentAdmin?.email.toLowerCase()}
                          title={acc.email.toLowerCase() === currentAdmin?.email.toLowerCase() ? 'Cannot delete logged-in account' : 'Revoke administrative privileges'}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
