import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Megaphone, ThumbsUp, Sparkles, BookOpen, Clock, Heart, Award, Send, Check, Image as ImageIcon, MessageSquare, Download, Share2, HelpCircle, Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { Notice, GalleryItem, Idea, Memory, MagazineArticle, Student } from '../types';
import { 
  TypewriterSplitHeading, 
  LightSweepWrapper, 
  FloatingHeroBackground, 
  ZoomInEntrance, 
  PremiumCard, 
  FloatingCardWrapper, 
  AnimatedCounter, 
  GoldenSparks 
} from './PremiumEffects';

interface HomeSectionProps {
  notices: Notice[];
  setNotices?: React.Dispatch<React.SetStateAction<Notice[]>>;
  gallery: GalleryItem[];
  setGallery?: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  ideas: Idea[];
  setIdeas: React.Dispatch<React.SetStateAction<Idea[]>>;
  memories: Memory[];
  setMemories: React.Dispatch<React.SetStateAction<Memory[]>>;
  magazine: MagazineArticle[];
  setActiveTab: (tab: string) => void;
  students: Student[];
  onSelectStudent: (s: Student) => void;
  isAdmin?: boolean;
}

export default function HomeSection({
  notices,
  setNotices,
  gallery,
  setGallery,
  ideas,
  setIdeas,
  memories,
  setMemories,
  magazine,
  setActiveTab,
  students,
  onSelectStudent,
  isAdmin
}: HomeSectionProps) {
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  
  // Custom Dynamic Semester Plans
  const [semPlans, setSemPlans] = useState(() => {
    const saved = localStorage.getItem('swalah_sem_plans');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'plan-1',
        title: 'Swalah Talent',
        category: 'Talent Competitions',
        description: 'Singing, speech, quiz, arts, and creative expressions celebrating classmate heritage standard.',
        phase: 'Phase 1 Launch',
        status: 'Active Roster',
        iconName: 'Sparkles'
      },
      {
        id: 'plan-2',
        title: 'Campus Buzz',
        category: 'Campus News & Updates',
        description: 'Student activities, announcements, daily bulletin updates, and core union briefings.',
        phase: 'Updated Daily',
        status: 'Live Board',
        iconName: 'Megaphone'
      },
      {
        id: 'plan-3',
        title: 'Vision Atelier',
        category: 'Innovation & Leadership',
        description: 'Innovation projects, leadership development workshops, and creative brainstorming sessions.',
        phase: 'Monthly Meet',
        status: 'Incubator',
        iconName: 'Award'
      },
      {
        id: 'plan-4',
        title: 'Creative Canvas',
        category: 'Arts & Calligraphy',
        description: 'Drawing, professional calligraphy meets, digital design, and inter-collegiate contests.',
        phase: 'Fortnightly',
        status: 'Exhibition',
        iconName: 'ImageIcon'
      },
      {
        id: 'plan-5',
        title: 'Ink & Quill',
        category: 'Writing Club & Journal',
        description: 'Essays, regular poetry fests, modern journalism articles, and newsletter publications.',
        phase: 'Bi-weekly',
        status: 'Publishing',
        iconName: 'BookOpen'
      }
    ];
  });

  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [isSemPlansModalOpen, setIsSemPlansModalOpen] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanCategory, setNewPlanCategory] = useState('');
  const [newPlanDesc, setNewPlanDesc] = useState('');
  const [newPlanPhase, setNewPlanPhase] = useState('');
  const [newPlanStatus, setNewPlanStatus] = useState('');
  const [newPlanIcon, setNewPlanIcon] = useState('Sparkles');

  const renderPlanIcon = (name: string) => {
    switch (name) {
      case 'Sparkles': return <Sparkles size={18} className="text-gold" />;
      case 'Megaphone': return <Megaphone size={18} className="text-gold" />;
      case 'Award': return <Award size={18} className="text-gold animate-pulse" />;
      case 'ImageIcon': return <ImageIcon size={18} className="text-gold" />;
      case 'BookOpen': return <BookOpen size={18} className="text-gold" />;
      case 'Clock': return <Clock size={18} className="text-gold" />;
      case 'Heart': return <Heart size={18} className="text-gold" />;
      default: return <Sparkles size={18} className="text-gold" />;
    }
  };

  // AI Advisor States
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState('');

  const handleAiBrainstorm = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    setAiResult("");
    try {
      const response = await fetch("/api/gemini/brainstorm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      const data = await response.json();
      if (data.error) {
        setAiResult(`Error: ${data.error}`);
      } else {
        setAiResult(data.text);
      }
    } catch (err: any) {
      setAiResult(`Error: ${err.message || "Failed to communicate with AI Advisor"}`);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Idea Box form
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaDesc, setNewIdeaDesc] = useState('');
  const [newIdeaAuthor, setNewIdeaAuthor] = useState('');
  const [ideaSubmitSuccess, setIdeaSubmitSuccess] = useState(false);

  // Memory Wall form
  const [newMemMessage, setNewMemMessage] = useState('');
  const [newMemAuthor, setNewMemAuthor] = useState('');
  const [newMemUrl, setNewMemUrl] = useState('');
  const [memSuccess, setMemSuccess] = useState(false);

  // Contact Form
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Admin Notices management
  const [isNoticeFormOpen, setIsNoticeFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeType, setNoticeType] = useState<'general' | 'meeting' | 'exam' | 'scholarship'>('general');
  const [deleteNoticeId, setDeleteNoticeId] = useState<string | null>(null);

  // Admin Gallery management
  const [isGalleryFormOpen, setIsGalleryFormOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [galTitle, setGalTitle] = useState('');
  const [galImage, setGalImage] = useState('');
  const [galCategory, setGalCategory] = useState('Swalah Talent');
  const [galDesc, setGalDesc] = useState('');
  const [deleteGalleryId, setDeleteGalleryId] = useState<string | null>(null);

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAuthor = newIdeaAuthor.trim() || 'Anonymous Student';
    const newIdeaObj: Idea = {
      id: `idea-${Date.now()}`,
      title: newIdeaTitle,
      description: newIdeaDesc,
      author: cleanAuthor,
      votes: 1,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending'
    };
    setIdeas(prev => [newIdeaObj, ...prev]);
    setNewIdeaTitle('');
    setNewIdeaDesc('');
    setNewIdeaAuthor('');
    setIdeaSubmitSuccess(true);
    setTimeout(() => {
      setIdeaSubmitSuccess(false);
    }, 4000);
  };

  const handleUpvoteIdea = (id: string) => {
    setIdeas(prev => prev.map(item => item.id === id ? { ...item, votes: item.votes + 1 } : item));
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = newMemUrl.trim() || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80';
    const newMsg: Memory = {
      id: `mem-${Date.now()}`,
      author: newMemAuthor,
      message: newMemMessage,
      imageUrl: cleanUrl,
      date: new Date().toLocaleDateString()
    };
    setMemories(prev => [newMsg, ...prev]);
    setNewMemAuthor('');
    setNewMemMessage('');
    setNewMemUrl('');
    setMemSuccess(true);
    setTimeout(() => {
      setMemSuccess(false);
    }, 3000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    // Persist as dispatched mail simulations inside App context (automatically saved to localStorage if tracked there)
    const saved = localStorage.getItem('swalah_sent_emails');
    const existing = saved ? JSON.parse(saved) : [];
    const outgoingReceipt = {
      id: `mail-${Date.now()}`,
      sender: contactEmail,
      recipientType: 'Contact Form Inquiry',
      subject: contactSubject || 'Direct Inquiry from Website Representative',
      content: `Inquiry from: ${contactName} (${contactEmail})\n\nSubject: ${contactSubject}\n\nMessage:\n${contactMessage}`,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Delivered',
      openRate: '100%',
      priority: 'Normal'
    };
    localStorage.setItem('swalah_sent_emails', JSON.stringify([outgoingReceipt, ...existing]));

    setContactName('');
    setContactEmail('');
    setContactSubject('');
    setContactMessage('');
    setTimeout(() => {
      setContactSuccess(false);
    }, 5050);
  };

  // Admin Notice Operations
  const openAddNotice = () => {
    setEditingNotice(null);
    setNoticeTitle('');
    setNoticeContent('');
    setNoticeType('general');
    setIsNoticeFormOpen(true);
  };

  const openEditNotice = (n: Notice) => {
    setEditingNotice(n);
    setNoticeTitle(n.title);
    setNoticeContent(n.content);
    setNoticeType(n.type);
    setIsNoticeFormOpen(true);
  };

  const handleNoticeFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setNotices) return;

    if (editingNotice) {
      setNotices(prev => prev.map(not => not.id === editingNotice.id ? {
        ...not,
        title: noticeTitle,
        content: noticeContent,
        type: noticeType
      } : not));
    } else {
      const newNot: Notice = {
        id: `notice-${Date.now()}`,
        title: noticeTitle,
        content: noticeContent,
        type: noticeType,
        date: new Date().toISOString().substring(0, 10)
      };
      setNotices(prev => [newNot, ...prev]);
    }
    setIsNoticeFormOpen(false);
  };

  const handleDeleteNotice = (id: string) => {
    if (!setNotices) return;
    setNotices(prev => prev.filter(not => not.id !== id));
    setDeleteNoticeId(null);
  };

  // Admin Gallery Operations
  const openAddGallery = () => {
    setEditingGallery(null);
    setGalTitle('');
    setGalImage('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80');
    setGalCategory('Swalah Talent');
    setGalDesc('');
    setIsGalleryFormOpen(true);
  };

  const openEditGallery = (g: GalleryItem) => {
    setEditingGallery(g);
    setGalTitle(g.title);
    setGalImage(g.imageUrl);
    setGalCategory(g.category);
    setGalDesc(g.description || '');
    setIsGalleryFormOpen(true);
  };

  const handleGalleryFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setGallery) return;

    if (editingGallery) {
      setGallery(prev => prev.map(gal => gal.id === editingGallery.id ? {
        ...gal,
        title: galTitle,
        imageUrl: galImage,
        category: galCategory,
        description: galDesc
      } : gal));
    } else {
      const newGal: GalleryItem = {
        id: `gal-${Date.now()}`,
        title: galTitle,
        imageUrl: galImage,
        category: galCategory,
        description: galDesc,
        date: new Date().toISOString().substring(0, 10)
      };
      setGallery(prev => [newGal, ...prev]);
    }
    setIsGalleryFormOpen(false);
  };

  const handleDeleteGallery = (id: string) => {
    if (!setGallery) return;
    setGallery(prev => prev.filter(g => g.id !== id));
    setDeleteGalleryId(null);
  };

  return (
    <div className="space-y-16 animate-fade-in font-sans">
      
      {/* 1. HERO SECTION */}
      <ZoomInEntrance>
        <section className="relative text-center space-y-6 py-12 md:py-24 overflow-hidden rounded-3xl bg-gradient-to-b from-black via-[#140b07] to-[#25130b] border border-gold/15 shadow-[0_0_50px_rgba(255,167,38,0.02)]">
          
          {/* Floating Hero Background Vector Shapes */}
          <FloatingHeroBackground />

          {/* Absolute Background Ambient Light */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,167,38,0.1),transparent_70%)] pointer-events-none" />

          {/* Golden Spark Particles in Hero Box */}
          <GoldenSparks count={15} />

          <div className="relative space-y-4 max-w-3xl mx-auto px-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/15 text-gold text-[10px] font-mono font-bold uppercase tracking-widest border border-gold/30">
              <Sparkles size={11} className="animate-pulse text-gold-glow" />
              EST. 2026 — SWALAH UNION
            </span>

            {/* Typewriter + Split Text Animation */}
            <div className="text-center">
              <TypewriterSplitHeading text="SWALAH UNION WEB" />
            </div>

            <p className="text-stone-300 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
              A unified platform for all language wings, committees, teams, and student programs. Aligning performance tracks, registrations, and class activities.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <LightSweepWrapper className="rounded-full">
                <button 
                  onClick={() => setIsSemPlansModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-orange-highlight to-gold text-black uppercase tracking-wider font-extrabold text-xs rounded-full hover:scale-105 active:scale-95 cursor-pointer hover:shadow-[0_0_20px_rgba(255,140,0,0.45)] transition-all duration-300"
                >
                  Explore Our Plans
                </button>
              </LightSweepWrapper>
              
              <LightSweepWrapper className="rounded-full">
                <button 
                  onClick={() => setActiveTab('committee')}
                  className="px-6 py-3 bg-[#1e1009]/80 text-[#ffa726] border border-gold/30 hover:border-gold rounded-full uppercase tracking-wider font-bold text-xs hover:bg-[#2c170d]/80 cursor-pointer transition-all duration-300"
                >
                  Meet The Team
                </button>
              </LightSweepWrapper>
            </div>
          </div>

        </section>
      </ZoomInEntrance>

      {/* 2. STATISTICS SECTION */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <FloatingCardWrapper delay={0}>
          <PremiumCard className="p-6 bg-stone-900/40 border border-gold/10 hover:border-gold/30 rounded-2xl text-center space-y-2 group">
            <span className="text-3xl font-display font-black text-white font-mono bg-gradient-to-b from-white to-stone-400 bg-clip-text text-transparent group-hover:text-gold transition-colors">
              <AnimatedCounter value={31} suffix="+" />
            </span>
            <h4 className="text-xs uppercase tracking-wider font-mono text-[#ffa726] font-bold">Students Enrolled</h4>
            <p className="text-[11px] text-stone-500">Representing diverse academic divisions and regional wings fests logs.</p>
          </PremiumCard>
        </FloatingCardWrapper>

        <FloatingCardWrapper delay={0.2}>
          <PremiumCard className="p-6 bg-stone-900/40 border border-gold/10 hover:border-gold/30 rounded-2xl text-center space-y-2 group">
            <span className="text-3xl font-display font-black text-white font-mono bg-gradient-to-b from-white to-stone-400 bg-clip-text text-transparent group-hover:text-gold transition-colors">
              <AnimatedCounter value={26} suffix="+" />
            </span>
            <h4 className="text-xs uppercase tracking-wider font-mono text-[#ffa726] font-bold">Active Members</h4>
            <p className="text-[11px] text-stone-500">Engaging in student representations, daily attendance fests, and programs.</p>
          </PremiumCard>
        </FloatingCardWrapper>

        <FloatingCardWrapper delay={0.4}>
          <PremiumCard className="p-6 bg-stone-900/40 border border-gold/10 hover:border-gold/30 rounded-2xl text-center space-y-2 group">
            <span className="text-3xl font-display font-black text-white font-mono bg-gradient-to-b from-white to-stone-400 bg-clip-text text-transparent group-hover:text-gold transition-colors">
              <AnimatedCounter value={30} suffix="+" />
            </span>
            <h4 className="text-xs uppercase tracking-wider font-mono text-[#ffa726] font-bold">Monthly Programs</h4>
            <p className="text-[11px] text-stone-500">Arabic seminars, English challenge debates, Urdu Mushairas and Kannada body meets.</p>
          </PremiumCard>
        </FloatingCardWrapper>
      </section>

      {/* 2B. COMMITTEE PLANS MODAL (sem Plans Pop-up) */}
      <AnimatePresence>
        {isSemPlansModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur effect */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSemPlansModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-br from-[#1b0d07] via-black to-[#130905] border border-gold/30 shadow-[0_0_60px_rgba(255,167,38,0.25)] p-6 md:p-10 space-y-8 z-10 scrollbar-thin scrollbar-thumb-gold/20"
            >
              <FloatingHeroBackground />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,167,38,0.1),transparent_75%)] pointer-events-none" />
              <GoldenSparks count={12} />

              {/* Close Button */}
              <button 
                onClick={() => setIsSemPlansModalOpen(false)}
                className="absolute top-6 right-6 text-stone-400 hover:text-white bg-stone-900/80 hover:bg-stone-800 p-2 rounded-full border border-gold/20 hover:border-gold transition-all z-20 cursor-pointer"
                title="Close plans popup"
              >
                <X size={18} />
              </button>

              <div className="relative text-center space-y-2 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-[10px] font-mono font-bold uppercase tracking-widest border border-gold/30">
                  <Sparkles size={11} className="animate-pulse text-gold-glow" />
                  ANNUAL TIMELINE
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight">sem Plans</h2>
                <p className="text-stone-300 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
                  Five signature programs defining this year's journey.
                </p>
              </div>

              {/* Cards Grid */}
              <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
                {semPlans.map((plan: any, index: number) => (
                  <div key={plan.id || index} className="h-full flex flex-col">
                    <PremiumCard className="p-6 bg-[#160d09]/75 border border-gold/10 hover:border-gold/30 rounded-2xl flex flex-col justify-between space-y-4 group relative h-full">
                      
                      {/* Delete button for custom user-created plans */}
                      {plan.id !== 'plan-1' && plan.id !== 'plan-2' && plan.id !== 'plan-3' && plan.id !== 'plan-4' && plan.id !== 'plan-5' && (
                        <button 
                          onClick={() => {
                            const updated = semPlans.filter((p: any) => p.id !== plan.id);
                            setSemPlans(updated);
                            localStorage.setItem('swalah_sem_plans', JSON.stringify(updated));
                          }}
                          className="absolute top-3 right-3 text-stone-500 hover:text-red-500 cursor-pointer transition-colors z-20"
                          title="Delete custom plan"
                        >
                          <X size={14} />
                        </button>
                      )}

                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center text-gold group-hover:bg-gold/20 transition-all shadow-[0_0_10px_rgba(255,167,38,0.1)]">
                          {renderPlanIcon(plan.iconName)}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-white group-hover:text-gold transition-colors font-display">
                            {index + 1}. {plan.title}
                          </h4>
                          <p className="text-[11px] text-stone-400 font-medium font-mono uppercase tracking-wider text-orange-highlight">
                            {plan.category}
                          </p>
                          <p className="text-xs text-stone-300 leading-relaxed pt-1">
                            {plan.description}
                          </p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/5 text-[10px] text-stone-500 font-mono flex justify-between items-center">
                        <span>{plan.phase}</span>
                        <span className="text-gold font-bold">{plan.status}</span>
                      </div>
                    </PremiumCard>
                  </div>
                ))}

                {/* "Create Plan" Dynamic Form / Button Box */}
                {!isCreatingPlan ? (
                  <button
                    onClick={() => setIsCreatingPlan(true)}
                    className="p-6 border-2 border-dashed border-gold/20 hover:border-gold/40 hover:bg-gold/5 rounded-2xl flex flex-col items-center justify-center space-y-3 text-stone-400 hover:text-gold transition-all duration-300 min-h-[220px] cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full border border-dashed border-gold/30 flex items-center justify-center bg-gold/5">
                      <Plus size={20} className="text-gold animate-pulse" />
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-bold uppercase tracking-wider font-mono block">Create Sem Plan</span>
                      <p className="text-[10px] text-stone-500 mt-1 max-w-[200px]">Add a new custom semester plan dynamically to this list.</p>
                    </div>
                  </button>
                ) : (
                  <PremiumCard className="p-6 bg-gradient-to-b from-[#22130c]/90 to-black border border-gold/35 rounded-2xl flex flex-col justify-between space-y-4 shadow-[0_0_20px_rgba(255,167,38,0.15)]">
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center pb-1 border-b border-white/10">
                        <span className="text-xs font-bold text-gold uppercase tracking-wider font-mono">New Semester Plan</span>
                        <button 
                          onClick={() => setIsCreatingPlan(false)}
                          className="text-stone-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <input
                          type="text"
                          placeholder="Plan Title (e.g. Swalah Debate)"
                          value={newPlanTitle}
                          onChange={(e) => setNewPlanTitle(e.target.value)}
                          className="w-full bg-stone-950 border border-gold/20 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-gold"
                        />
                        <input
                          type="text"
                          placeholder="Category (e.g. English challenge debates)"
                          value={newPlanCategory}
                          onChange={(e) => setNewPlanCategory(e.target.value)}
                          className="w-full bg-stone-950 border border-gold/20 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-gold"
                        />
                        <textarea
                          placeholder="Short description of the plan..."
                          value={newPlanDesc}
                          onChange={(e) => setNewPlanDesc(e.target.value)}
                          rows={2}
                          className="w-full bg-stone-950 border border-gold/20 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-gold resize-none"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Phase (e.g. Bi-weekly)"
                            value={newPlanPhase}
                            onChange={(e) => setNewPlanPhase(e.target.value)}
                            className="w-full bg-stone-950 border border-gold/20 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-gold"
                          />
                          <input
                            type="text"
                            placeholder="Status (e.g. Active)"
                            value={newPlanStatus}
                            onChange={(e) => setNewPlanStatus(e.target.value)}
                            className="w-full bg-stone-950 border border-gold/20 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-mono font-bold text-[#ffa726] tracking-wider block">Select Icon:</label>
                          <div className="flex flex-wrap gap-1.5">
                            {['Sparkles', 'Megaphone', 'Award', 'ImageIcon', 'BookOpen', 'Clock', 'Heart'].map((icon) => (
                              <button
                                key={icon}
                                type="button"
                                onClick={() => setNewPlanIcon(icon)}
                                className={`p-1.5 rounded-md border text-xs transition-all cursor-pointer ${
                                  newPlanIcon === icon 
                                    ? 'bg-gold/25 border-gold text-white' 
                                    : 'bg-stone-950 border-stone-800 text-stone-500 hover:text-stone-300'
                                }`}
                                title={icon}
                              >
                                {icon === 'Sparkles' && <Sparkles size={12} />}
                                {icon === 'Megaphone' && <Megaphone size={12} />}
                                {icon === 'Award' && <Award size={12} />}
                                {icon === 'ImageIcon' && <ImageIcon size={12} />}
                                {icon === 'BookOpen' && <BookOpen size={12} />}
                                {icon === 'Clock' && <Clock size={12} />}
                                {icon === 'Heart' && <Heart size={12} />}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setIsCreatingPlan(false)}
                        className="flex-1 py-1.5 bg-stone-900 hover:bg-stone-800 border border-white/5 text-stone-300 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (!newPlanTitle.trim()) return;
                          const newPlanObj = {
                            id: `plan-${Date.now()}`,
                            title: newPlanTitle,
                            category: newPlanCategory || 'General Program',
                            description: newPlanDesc || 'No description provided.',
                            phase: newPlanPhase || 'Soon',
                            status: newPlanStatus || 'Planning',
                            iconName: newPlanIcon
                          };
                          const updated = [...semPlans, newPlanObj];
                          setSemPlans(updated);
                          localStorage.setItem('swalah_sem_plans', JSON.stringify(updated));

                          // Reset form
                          setNewPlanTitle('');
                          setNewPlanCategory('');
                          setNewPlanDesc('');
                          setNewPlanPhase('');
                          setNewPlanStatus('');
                          setNewPlanIcon('Sparkles');
                          setIsCreatingPlan(false);
                        }}
                        className="flex-1 py-1.5 bg-gradient-to-r from-orange-highlight to-gold text-black text-[10px] uppercase font-bold tracking-wider rounded-lg hover:scale-[1.02] transition-all"
                      >
                        Save Plan
                      </button>
                    </div>
                  </PremiumCard>
                )}

                {/* AI Advisor Prompt Box Card */}
                <div className="p-6 bg-gradient-to-b from-[#1b1009]/80 to-black border border-orange-highlight/20 hover:border-orange-highlight/40 transition-all duration-300 rounded-2xl flex flex-col justify-between space-y-4 shadow-[0_0_15px_rgba(255,140,0,0.05)]">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-orange-highlight tracking-widest block">Union AI Advisor</span>
                    <h4 className="text-xs font-bold text-white uppercase">Brainstorm with AI</h4>
                    <p className="text-[11px] text-stone-400 leading-relaxed">
                      Enter a quick prompt to design activities or suggest customized topics for any plan wing!
                    </p>
                    <div className="space-y-2 pt-1">
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g. Suggest a debate theme..."
                        className="w-full bg-stone-950/90 border border-gold/20 rounded-lg px-3 py-1.5 text-[11px] text-stone-200 placeholder-stone-600 focus:outline-none focus:border-gold outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAiBrainstorm}
                        disabled={isAiGenerating || !aiPrompt.trim()}
                        className="w-full py-1.5 bg-gradient-to-r from-orange-highlight to-gold disabled:opacity-50 text-black text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all hover:scale-[1.02] cursor-pointer"
                      >
                        {isAiGenerating ? 'Generating...' : 'Ask AI Advisor'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Result Area */}
              <AnimatePresence>
                {aiResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="relative bg-stone-950/70 border border-gold/20 rounded-2xl p-5 md:p-6 space-y-3 z-10"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-gold animate-spin" />
                        <span className="text-xs font-bold text-white font-mono uppercase">AI Advisor Brainstorm Output</span>
                      </div>
                      <button
                        onClick={() => setAiResult("")}
                        className="text-stone-500 hover:text-white text-xs px-2 py-0.5 rounded border border-white/5 hover:bg-white/5 cursor-pointer font-mono"
                      >
                        Clear Output
                      </button>
                    </div>
                    <div className="text-stone-300 text-xs whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto pr-1">
                      {aiResult}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. QUICK LINKS DASHBOARD */}
      <section className="space-y-4">
        <h3 className="text-base uppercase tracking-widest font-mono font-black text-stone-400 text-center">FAST ROUTING PANEL</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => setActiveTab('dashboard')} className="p-4 bg-stone-900/60 hover:bg-gold/10 border border-stone-800/60 hover:border-gold/30 rounded-xl text-stone-300 hover:text-gold text-xs font-semibold text-center transition-all cursor-pointer">
            Leaderboard Dashboard
          </button>
          <button onClick={() => setActiveTab('programs')} className="p-4 bg-stone-900/60 hover:bg-gold/10 border border-stone-800/60 hover:border-gold/30 rounded-xl text-stone-300 hover:text-gold text-xs font-semibold text-center transition-all cursor-pointer">
            Wing Programs
          </button>
          <button onClick={() => setActiveTab('calendar')} className="p-4 bg-stone-900/60 hover:bg-gold/10 border border-stone-800/60 hover:border-gold/30 rounded-xl text-stone-300 hover:text-gold text-xs font-semibold text-center transition-all cursor-pointer">
            Calendar Scheduler
          </button>
          <button onClick={() => {
            const contactSection = document.getElementById('contact-element-section');
            contactSection?.scrollIntoView({ behavior: 'smooth' });
          }} className="p-4 bg-stone-900/60 hover:bg-gold/10 border border-stone-800/60 hover:border-gold/30 rounded-xl text-stone-300 hover:text-gold text-xs font-semibold text-center transition-all cursor-pointer">
            Contact Committee
          </button>
        </div>
      </section>

      {/* Grid Layout: Notice Board & Recent Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 4. NOTICE BOARD (Left 2 Col) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-extrabold text-white flex items-center gap-2">
              <Megaphone size={18} className="text-gold" />
              Class Notice Board
            </h3>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  type="button"
                  onClick={openAddNotice}
                  className="px-3 py-1.5 bg-gradient-to-r from-orange-highlight to-gold text-black rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:brightness-110 cursor-pointer"
                >
                  <Plus size={12} /> Add Notice
                </button>
              )}
              <span className="text-stone-500 text-xs font-mono">UPDATED DAILY</span>
            </div>
          </div>

          <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-2">
            <AnimatePresence initial={false}>
              {notices.map((notice, idx) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <PremiumCard
                    className="p-5 bg-[#160d09]/60 hover:bg-[#1f120c]/70 rounded-2xl border border-gold/10 hover:border-gold/30 transition-all flex items-start gap-4 relative group"
                  >
                    {/* Admin options on hover / look */}
                    {isAdmin && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity z-20">
                        <button
                          type="button"
                          onClick={() => openEditNotice(notice)}
                          className="p-1 rounded bg-stone-950 hover:bg-gold/15 text-stone-400 hover:text-gold transition-colors cursor-pointer border border-white/5"
                        >
                          <Edit2 size={10} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteNoticeId(notice.id)}
                          className="p-1 rounded bg-stone-950 hover:bg-red-500/15 text-stone-400 hover:text-red-400 transition-colors cursor-pointer border border-white/5"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    )}

                    <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
                      notice.type === 'meeting' ? 'bg-amber-500/10 text-amber-400 border-amber-500/35' :
                      notice.type === 'exam' ? 'bg-red-500/10 text-red-400 border-red-500/35' :
                      notice.type === 'scholarship' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/35' :
                      'bg-orange-500/10 text-orange-400 border-orange-500/35'
                    }`}>
                      <Megaphone size={15} />
                    </div>
                    <div className="space-y-1 pr-16">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h4 className="text-sm font-bold text-white transition-colors">{notice.title}</h4>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-white/5 text-stone-400 border border-white/5">{notice.type}</span>
                      </div>
                      <p className="text-stone-300 text-xs leading-relaxed">{notice.content}</p>
                      <span className="text-[10px] text-stone-500 block font-mono">{notice.date}</span>
                    </div>
                  </PremiumCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* 5. ACHIEVEMENTS SYSTEM SECTION (Right 1 Col) */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xl font-display font-extrabold text-white flex items-center gap-2">
            <Award size={18} className="text-gold animate-bounce" />
            Class Achievements
          </h3>

          <div className="p-5 glass-panel rounded-2xl border border-gold/15 space-y-4">
            <div className="pb-3 border-b border-white/5 flex items-center justify-between">
              <span className="text-xs text-stone-400 font-semibold tracking-wider font-mono">Q1 UNION AWARDS</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-orange-highlight/15 text-orange-highlight font-mono font-bold rounded animate-pulse">TAP CARD TO FLIP</span>
            </div>

            <div className="space-y-4">
              {/* Achievement Card 1 */}
              <PremiumCard 
                isFlipable={true} 
                className="p-3 bg-stone-900/30 rounded-xl hover:bg-stone-900/50"
                backContent={
                  <div className="text-center space-y-1.5 p-1 font-sans h-full flex flex-col justify-center">
                    <span className="text-[9px] text-[#ffa726] uppercase font-mono tracking-widest block">Award Evaluation</span>
                    <h5 className="text-xs font-bold text-white">Score: 94/100 Standard</h5>
                    <p className="text-[10px] text-stone-400 leading-tight">Voted unanimously by Union Senate Board for organizing magnificent assemblies.</p>
                  </div>
                }
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-yellow-500 to-amber-700 font-display flex items-center justify-center text-white shrink-0 shadow-md">
                    🏆
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase">Best Wing Award</h5>
                    <p className="text-[10px] text-stone-400 font-medium">Urdu Wing (Fazil & Raza)</p>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed">Conducted highly interactive Mushaira and peer dialect logs.</p>
                  </div>
                </div>
              </PremiumCard>

              {/* Achievement Card 2 */}
              <PremiumCard 
                isFlipable={true} 
                className="p-3 bg-stone-900/30 rounded-xl hover:bg-stone-900/50"
                backContent={
                  <div className="text-center space-y-1.5 p-1 font-sans h-full flex flex-col justify-center">
                    <span className="text-[9px] text-[#ffa726] uppercase font-mono tracking-widest block">Stats Metrics</span>
                    <h5 className="text-xs font-bold text-white">840 Track Points</h5>
                    <p className="text-[10px] text-stone-400 leading-tight">Flawless execution of leadership routines, campus cleaning duties & host logs.</p>
                  </div>
                }
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-yellow-500 to-amber-700 font-display flex items-center justify-center text-white shrink-0 shadow-md">
                    🥇
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase">Best Team Award</h5>
                    <p className="text-[10px] text-stone-400 font-medium">Team 1 (Mikdad & Fazil)</p>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed">Leader board points standard: 840. Highest active attendance.</p>
                  </div>
                </div>
              </PremiumCard>

              {/* Achievement Card 3 */}
              <PremiumCard 
                isFlipable={true} 
                className="p-3 bg-stone-900/30 rounded-xl hover:bg-stone-900/50"
                backContent={
                  <div className="text-center space-y-1.5 p-1 font-sans h-full flex flex-col justify-center">
                    <span className="text-[9px] text-[#ffa726] uppercase font-mono tracking-widest block">Student Bio Profile</span>
                    <h5 className="text-xs font-bold text-[#FFA726]">Nabeel - AD #288</h5>
                    <p className="text-[10px] text-stone-400 leading-tight">Top scorer in multi-university debates with 96% session logs maintained.</p>
                  </div>
                }
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-yellow-500 to-amber-700 font-display flex items-center justify-center text-white shrink-0 shadow-md">
                    ⭐
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase">Student of the Month</h5>
                    <p className="text-[10px] text-emerald-400 font-medium font-mono">AD #288 - AHMED NABEEL</p>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed">Outstanding leadership, public debate champion, and 96% session logs.</p>
                  </div>
                </div>
              </PremiumCard>
            </div>
          </div>
        </div>

      </div>

      {/* 6. SWALAH STORY (Masonry Gallery with Lightbox) */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-2xl font-display font-extrabold text-white tracking-tight">Swalah Union storybook</h3>
          <p className="text-stone-400 text-xs max-w-lg mx-auto">
            Interactive snapshots commemorating milestone meetings, student festivals, and heritage programs.
          </p>

          {isAdmin && (
            <div className="pt-3">
              <button
                type="button"
                onClick={openAddGallery}
                className="inline-flex items-center gap-1 px-4 py-2 bg-[#ff8c00] hover:bg-gold text-black rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all hover:scale-105"
              >
                <Plus size={14} /> Add Gallery Photo
              </button>
            </div>
          )}
        </div>

        {/* Grid Masonry with real Unsplash images */}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {gallery.map((item) => (
            <div 
              key={item.id} 
              className="break-inside-avoid glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-gold/30 transition-all duration-300 relative group hover:scale-[1.012]"
            >
              {/* Gallery Admin Overlays */}
              {isAdmin && (
                <div className="absolute top-3 right-3 flex items-center gap-1 z-20">
                  <button
                    type="button"
                    onClick={() => openEditGallery(item)}
                    className="p-1 px-1.5 rounded-lg bg-stone-950/80 hover:bg-gold/10 text-stone-400 hover:text-gold border border-white/5 transition-colors cursor-pointer"
                  >
                    <Edit2 size={10} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteGalleryId(item.id)}
                    className="p-1 px-1.5 rounded-lg bg-stone-950/80 hover:bg-red-500/10 text-stone-400 hover:text-red-400 border border-white/5 transition-colors cursor-pointer"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              )}

              <div className="relative overflow-hidden cursor-pointer" onClick={() => setSelectedGalleryItem(item)}>
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120a06]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-stone-300 text-[10px] font-mono leading-none">CLICK TO PREVIEW LIGHTBOX</span>
                </div>
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[9px] uppercase font-bold tracking-wider text-orange-highlight font-mono">{item.category}</span>
                <h4 className="text-xs font-bold text-white group-hover:text-gold transition-colors">{item.title}</h4>
                {item.description && <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">{item.description}</p>}
                <span className="text-[10px] text-stone-500 font-mono block pt-1">{item.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedGalleryItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0" 
                onClick={() => setSelectedGalleryItem(null)}
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="max-w-4xl w-full bg-[#180f0a] border border-gold/30 rounded-2xl overflow-hidden relative z-10"
              >
                <img 
                  src={selectedGalleryItem.imageUrl} 
                  alt="" 
                  className="w-full max-h-[70vh] object-contain bg-black"
                  referrerPolicy="no-referrer"
                />
                <div className="p-6 space-y-2 bg-[#120a06] border-t border-white/5">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="px-2.5 py-0.5 rounded text-[10px] text-gold bg-gold/10 font-bold uppercase font-mono border border-gold/20">
                        {selectedGalleryItem.category}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5">{selectedGalleryItem.title}</h3>
                    </div>
                    <button 
                      onClick={() => setSelectedGalleryItem(null)}
                      className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-white text-xs cursor-pointer focus:outline-none"
                    >
                      Close View
                    </button>
                  </div>
                  <p className="text-stone-300 text-xs leading-relaxed">{selectedGalleryItem.description || 'Swalah student gallery archives.'}</p>
                  <span className="text-[10px] text-stone-500 font-mono block">Documented: {selectedGalleryItem.date}</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* 7. DIGITAL MAGAZINE */}
      <section className="p-6 glass-panel rounded-2xl border border-white/5 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div className="space-y-1">
            <h3 className="text-xl font-display font-bold text-white uppercase flex items-center gap-2">
              <BookOpen size={18} className="text-gold" />
              SWALAH MAGAZINE
            </h3>
            <p className="text-xs text-stone-400">Poetry, academic essays, and elite leader exchanges published by classmates.</p>
          </div>
          <button className="px-4 py-2 bg-gold/10 text-gold border border-gold/30 rounded-xl text-xs font-semibold hover:bg-gold/20 flex items-center gap-1.5 transition-all cursor-pointer">
            <Download size={13} />
            Download PDF Edition
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {magazine.map((art) => (
            <div key={art.id} className="p-5 bg-stone-900/50 hover:bg-[#1c110a] rounded-xl border border-white/5 hover:border-gold/20 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-orange-highlight bg-orange-highlight/10 px-2 py-0.5 rounded border border-orange-highlight/15">
                  {art.category}
                </span>
                <h4 className="text-sm font-bold text-white line-clamp-1">{art.title}</h4>
                <p className="text-stone-300 text-xs lines-clamp-3 leading-relaxed">{art.excerpt}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-stone-500 font-mono">
                <span>By {art.author}</span>
                <span>{art.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. IDEA BOX & SUGGESTIONS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Suggestion Form */}
        <div className="p-6 glass-panel rounded-2xl border border-gold/15 space-y-4 h-fit">
          <div className="space-y-1">
            <h3 className="text-lg font-display font-extrabold text-white flex items-center gap-2">
              <HelpCircle size={18} className="text-gold" />
              SHARE YOUR IDEA
            </h3>
            <p className="text-xs text-stone-400">Propose creative enhancements, class projects, or event designs. Vote on classmate ideas below.</p>
          </div>

          <form onSubmit={handleAddIdea} className="space-y-3.5">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-mono text-stone-400 mb-1">Concept Title</label>
              <input
                type="text"
                placeholder="E.g., Class Study Archives Portal"
                value={newIdeaTitle}
                onChange={(e) => setNewIdeaTitle(e.target.value)}
                className="w-full bg-[#1e110a] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-gold"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-mono text-stone-400 mb-1">Detailed suggestion</label>
              <textarea
                placeholder="Explicate your strategy..."
                value={newIdeaDesc}
                onChange={(e) => setNewIdeaDesc(e.target.value)}
                className="w-full bg-[#1e110a] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-600 h-24 focus:outline-none focus:border-gold"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-mono text-stone-400 mb-1">Author Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Anonymous"
                  value={newIdeaAuthor}
                  onChange={(e) => setNewIdeaAuthor(e.target.value)}
                  className="w-full bg-[#1e110a] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-gold"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-gold text-black hover:bg-[#FF8C00] py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wide cursor-pointer transition-colors"
                >
                  Post Proposal
                </button>
              </div>
            </div>
          </form>

          {ideaSubmitSuccess && (
            <div className="p-2 px-3 bg-emerald-950/40 rounded-xl border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-1.5 font-mono">
              <Check size={14} />
              <span>Suggestion submitted successfully! Live review board updated.</span>
            </div>
          )}
        </div>

        {/* Votes listing */}
        <div className="p-6 glass-panel rounded-2xl border border-white/5 space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-300 font-display">Idea Review Board ({ideas.length})</h4>
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {notices.length === 0 ? (
              <p className="text-xs text-stone-600 italic">No proposals submitted yet.</p>
            ) : (
              ideas.map((item) => (
                <div key={item.id} className="p-4 bg-stone-900/40 border border-white/5 rounded-xl flex items-start justify-between gap-4 font-mono">
                  <div className="space-y-1.5 flex-1 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-white/5 text-stone-400 border border-white/5">
                        {item.author}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-white leading-normal">{item.title}</h5>
                    <p className="text-stone-300 text-[11px] leading-relaxed">{item.description}</p>
                  </div>
                  <button 
                    onClick={() => handleUpvoteIdea(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 hover:bg-gold/25 text-gold border border-gold/20 transition-all cursor-pointer hover:scale-105"
                  >
                    <ThumbsUp size={13} className="text-gold" />
                    <span className="font-mono text-[10px] font-bold text-white">{item.votes}</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </section>

      {/* 9. MEMORIES OF SWALAH */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-2xl font-display font-extrabold text-white tracking-tight">MEMORIES OF SWALAH</h3>
          <p className="text-stone-400 text-xs max-w-lg mx-auto">
            A combined class memory board. Drop student cards, congratulations messages, and graduation wishes!
          </p>
        </div>

        {/* Input bar */}
        <div className="p-5 glass-panel rounded-2xl border border-gold/10">
          <form onSubmit={handleAddMemory} className="flex flex-col md:flex-row gap-3 font-sans">
            <input 
              type="text"
              placeholder="Your Name (e.g. Shammas)*"
              value={newMemAuthor}
              onChange={(e) => setNewMemAuthor(e.target.value)}
              className="bg-stone-900/60 border border-gold/20 text-xs text-white rounded-xl px-4 py-2.5 md:w-1/4 outline-none focus:border-gold"
              required
            />
            <input 
              type="text"
              placeholder="Short Message (e.g., Best times at campus study center!)*"
              value={newMemMessage}
              onChange={(e) => setNewMemMessage(e.target.value)}
              className="bg-stone-900/60 border border-gold/20 text-xs text-white rounded-xl px-4 py-2.5 flex-1 outline-none focus:border-gold"
              required
            />
            <input 
              type="url"
              placeholder="Photo URL (Optional)"
              value={newMemUrl}
              onChange={(e) => setNewMemUrl(e.target.value)}
              className="bg-stone-900/60 border border-gold/20 text-xs text-white rounded-xl px-4 py-2.5 md:w-1/4 outline-none focus:border-gold"
            />
            <button 
              type="submit"
              className="bg-gradient-to-r from-orange-highlight to-gold text-black px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer hover:bg-gold transition-colors shrink-0 font-mono"
            >
              Post Message
            </button>
          </form>
          {memSuccess && (
            <p className="text-emerald-400 text-[11px] mt-2 font-mono">✓ Memory updated on the wall!</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((mem) => (
            <div key={mem.id} className="p-4 bg-stone-900/40 border border-white/5 rounded-2xl flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <img src={mem.imageUrl} alt="" className="w-full h-36 rounded-xl object-cover" referrerPolicy="no-referrer" />
                <p className="text-stone-300 text-xs italic">"{mem.message}"</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-stone-500 font-mono">
                <span>— {mem.author}</span>
                <span>{mem.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. CONTACT SECTION */}
      <section id="contact-element-section" className="p-6 glass-panel rounded-2xl border border-gold/15 space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-2xl font-display font-extrabold text-white text-gold-glow">CONNECT WITH THE COMMITTEE</h3>
          <p className="text-stone-400 text-xs">Reach out directly to officers for administrative reports or scholarship queries.</p>
        </div>

        <form onSubmit={handleContactSubmit} className="max-w-2xl mx-auto space-y-4 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Your Name</label>
              <input 
                type="text"
                placeholder="E.g., Shammas"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-[#120a06] border border-gold/20 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gold"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Your Email</label>
              <input 
                type="email"
                placeholder="name@gmail.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-[#120a06] border border-gold/20 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Subject</label>
            <input 
              type="text"
              placeholder="Query regarding Arabic Wing event..."
              value={contactSubject}
              onChange={(e) => setContactSubject(e.target.value)}
              className="w-full bg-[#120a06] border border-gold/20 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs text-stone-400 uppercase font-mono mb-1">Message</label>
            <textarea 
              placeholder="Your complete description..."
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              className="w-full bg-[#120a06] border border-gold/20 text-xs text-white rounded-xl px-4 py-3 h-28 focus:outline-none focus:border-gold"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-highlight to-gold text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gold cursor-pointer transition-colors font-mono"
          >
            Send Message
          </button>

          {contactSuccess && (
            <div className="p-3 bg-emerald-950/45 border border-emerald-500/20 text-emerald-400 rounded-xl text-center text-xs font-semibold font-mono">
              ✓ Message delivered! The Executive Committee will reach out via email shortly.
            </div>
          )}
        </form>
      </section>

      {/* Admin Notices Modals */}
      {isNoticeFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="absolute inset-0" onClick={() => setIsNoticeFormOpen(false)} />
          <form onSubmit={handleNoticeFormSubmit} className="w-full max-w-sm bg-[#1a0f0a] border border-gold/30 rounded-2xl p-6 relative z-10 space-y-4 font-sans">
            <button type="button" onClick={() => setIsNoticeFormOpen(false)} className="absolute top-4 right-4 text-stone-400 hover:text-white">
              <X size={16} />
            </button>
            <div>
              <span className="text-[9px] uppercase font-mono bg-gold/15 text-gold px-2 py-0.5 rounded">
                Notice Core Editor
              </span>
              <h3 className="text-base font-display font-extrabold text-white mt-1">CLASS ANNOUNCEMENT</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-stone-400 mb-0.5">Title Notice *</label>
                <input 
                  type="text" 
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Arabic Exam Schedules"
                  className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-xs text-white focus:border-gold outline-none" 
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono text-stone-400 mb-0.5">Content Description *</label>
                <textarea 
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Provide precise hours, venues and directions."
                  className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-xs text-white h-24 focus:border-gold outline-none" 
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono text-stone-400 mb-0.5">Type *</label>
                <select 
                  value={noticeType}
                  onChange={(e) => setNoticeType(e.target.value as any)}
                  className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-2 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="general">General</option>
                  <option value="meeting">Meeting</option>
                  <option value="exam">Exam</option>
                  <option value="scholarship">Scholarship</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-orange-highlight to-gold hover:brightness-110 text-black font-mono font-bold uppercase tracking-wider text-xs rounded-xl transition-all">
              {editingNotice ? 'Update Notice' : 'Post Notice'}
            </button>
          </form>
        </div>
      )}

      {deleteNoticeId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#180f0a] border border-red-500/20 rounded-2xl p-5 max-w-xs w-full text-center space-y-4 font-sans">
            <div className="mx-auto h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertCircle size={20} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Remove Notice</h4>
              <p className="text-stone-400 text-[11px] leading-relaxed mt-1">Verify deletion. This is irreversible.</p>
            </div>
            <div className="flex gap-2 font-mono">
              <button onClick={() => setDeleteNoticeId(null)} className="flex-1 py-1.5 bg-stone-900 text-stone-450 text-xs rounded-lg hover:bg-stone-850">Cancel</button>
              <button onClick={() => handleDeleteNotice(deleteNoticeId)} className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg pb-2">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Gallery Modals */}
      {isGalleryFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="absolute inset-0" onClick={() => setIsGalleryFormOpen(false)} />
          <form onSubmit={handleGalleryFormSubmit} className="w-full max-w-sm bg-[#1a0f0a] border border-gold/30 rounded-2xl p-6 relative z-10 space-y-4 font-sans">
            <button type="button" onClick={() => setIsGalleryFormOpen(false)} className="absolute top-4 right-4 text-stone-400 hover:text-white">
              <X size={16} />
            </button>
            <div>
              <span className="text-[9px] uppercase font-mono bg-gold/15 text-gold px-2 py-0.5 rounded">
                Media Core Editor
              </span>
              <h3 className="text-base font-display font-bold text-white mt-1">CLASS STORY PHOTO</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-stone-400 mb-0.5">Asset Title *</label>
                <input 
                  type="text" 
                  value={galTitle}
                  onChange={(e) => setGalTitle(e.target.value)}
                  placeholder="e.g. Creative Calligraphy Exhibition"
                  className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-xs text-white focus:border-gold outline-none" 
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono text-stone-400 mb-0.5">Photo URL *</label>
                <input 
                  type="url" 
                  value={galImage}
                  onChange={(e) => setGalImage(e.target.value)}
                  className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-xs text-white focus:border-gold outline-none" 
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono text-stone-400 mb-0.5">Category *</label>
                <input 
                  type="text" 
                  value={galCategory}
                  onChange={(e) => setGalCategory(e.target.value)}
                  placeholder="e.g. Swalah Talent or Anniversary"
                  className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-xs text-white focus:border-gold outline-none" 
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono text-stone-400 mb-0.5">Interactive Description</label>
                <textarea 
                  value={galDesc}
                  onChange={(e) => setGalDesc(e.target.value)}
                  placeholder="Detail context, students pictured and events highlights."
                  className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2 text-xs text-white h-20 focus:border-gold outline-none" 
                />
              </div>
            </div>
            <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-orange-highlight to-gold hover:brightness-110 text-black font-mono font-bold uppercase tracking-wider text-xs rounded-xl transition-all">
              {editingGallery ? 'Save Frame' : 'Publish Photograph'}
            </button>
          </form>
        </div>
      )}

      {deleteGalleryId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#180f0a] border border-red-500/20 rounded-2xl p-5 max-w-xs w-full text-center space-y-4 font-sans">
            <div className="mx-auto h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertCircle size={20} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Remove Photograph</h4>
              <p className="text-stone-400 text-[11px] leading-relaxed mt-1">Verify deletion. Photographical memories cease.</p>
            </div>
            <div className="flex gap-2 font-mono">
              <button onClick={() => setDeleteGalleryId(null)} className="flex-1 py-1.5 bg-stone-900 text-stone-450 text-xs rounded-lg hover:bg-stone-850">Cancel</button>
              <button onClick={() => handleDeleteGallery(deleteGalleryId)} className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg pb-2">Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
