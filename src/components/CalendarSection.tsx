import React, { useState } from 'react';
import { Calendar, Clock, Filter, MapPin, Tag, Plus, Check, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { EventCalendarItem } from '../types';

interface CalendarSectionProps {
  events: EventCalendarItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventCalendarItem[]>>;
  isAdmin?: boolean;
}

export default function CalendarSection({ events, setEvents, isAdmin }: CalendarSectionProps) {
  const [filterWing, setFilterWing] = useState('All');
  
  // Admin form modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventCalendarItem | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formCategory, setFormCategory] = useState('General');
  const [formVenue, setFormVenue] = useState('');
  const [formAssignedTeam, setFormAssignedTeam] = useState('');

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const categories = ["All", "Arabic", "English", "Urdu", "Kannada", "General", "Committee"];

  const filteredEvents = filterWing === 'All'
    ? events
    : events.filter(e => e.category === filterWing);

  // Form operations
  const openAddEvent = () => {
    setEditingEvent(null);
    setFormTitle('');
    setFormDate(new Date().toISOString().substring(0, 10));
    setFormCategory('General');
    setFormVenue('Campus Center Auditorium');
    setFormAssignedTeam('Team 1');
    setIsFormOpen(true);
  };

  const openEditEvent = (ev: EventCalendarItem) => {
    setEditingEvent(ev);
    setFormTitle(ev.title);
    setFormDate(ev.date);
    setFormCategory(ev.category);
    setFormVenue(ev.venue || '');
    setFormAssignedTeam(ev.assignedTeam || '');
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      // Edit
      setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? {
        ...ev,
        title: formTitle,
        date: formDate,
        category: formCategory,
        venue: formVenue,
        assignedTeam: formAssignedTeam
      } : ev));
    } else {
      // Create
      const newEv: EventCalendarItem = {
        id: `cal-${Date.now()}`,
        title: formTitle,
        date: formDate,
        category: formCategory,
        venue: formVenue,
        assignedTeam: formAssignedTeam
      };
      setEvents(prev => [newEv, ...prev]);
    }
    setIsFormOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(ev => ev.id !== id));
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-[10px] font-bold tracking-widest uppercase">
          <Calendar size={12} />
          Swalah Calendar
        </div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Timeline & Academic Scheduler</h2>
        <p className="text-stone-400 text-xs max-w-xl mx-auto leading-relaxed">
          Stay organized and never miss an event. Visualizing wing programs, board sessions, and attendance rosters declarations dates.
        </p>

        {isAdmin && (
          <div className="pt-2">
            <button
              onClick={openAddEvent}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-highlight to-gold text-black rounded-xl text-xs font-bold uppercase tracking-wider hover:brightness-115 cursor-pointer shadow-lg"
            >
              <Plus size={14} /> Add New Event
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-1.5 p-1 bg-[#100a06] border border-stone-850 rounded-2xl max-w-2xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilterWing(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              filterWing === cat 
                ? 'bg-gold/15 text-gold border border-gold/30 shadow-md' 
                : 'text-stone-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Timeline view */}
      <section className="relative max-w-3xl mx-auto pl-6 md:pl-8 border-l border-gold/25 space-y-8 py-4">
        {filteredEvents.map((ev, index) => (
          <div key={ev.id} className="relative group">
            
            {/* Timeline node */}
            <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-gold border-[3px] border-[#0d0704] flex items-center justify-center shadow-[0_0_10px_rgba(255,167,38,0.5)] group-hover:scale-125 transition-transform" />

            <div className="p-5 bg-stone-900/45 hover:bg-[#19100a]/60 border border-white/5 hover:border-gold/30 rounded-2xl transition-all space-y-3 relative">
              
              {/* Event Actions overlay for Admin */}
              {isAdmin && (
                <div className="absolute top-4 right-4 flex items-center gap-1 z-10 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditEvent(ev)}
                    className="p-1 px-1.5 rounded bg-stone-950 border border-white/5 hover:bg-gold/10 text-stone-400 hover:text-gold transition-colors cursor-pointer"
                    title="Edit Event"
                  >
                    <Edit2 size={11} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(ev.id)}
                    className="p-1 px-1.5 rounded bg-stone-950 border border-white/5 hover:bg-red-500/10 text-stone-400 hover:text-red-450 transition-colors cursor-pointer"
                    title="Delete Event"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between flex-wrap gap-2 pr-16">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/25">
                    {ev.category} Wing
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono flex items-center gap-1">
                    <Clock size={11} /> {ev.date}
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">Assigned: {ev.assignedTeam || 'None'}</span>
              </div>

              <h4 className="text-sm font-extrabold text-white group-hover:text-gold transition-colors">{ev.title}</h4>
              <p className="text-[11px] text-stone-400 flex items-center gap-1 font-mono">
                <MapPin size={11} className="text-gold" /> Venue Point: <strong className="text-stone-300 font-medium font-sans">{ev.venue || 'Campus Central Block'}</strong>
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Admin Add/Edit Form Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="absolute inset-0" onClick={() => setIsFormOpen(false)} />
          
          <form onSubmit={handleFormSubmit} className="w-full max-w-md bg-[#1a0f0a] border border-gold/30 rounded-2xl p-6 md:p-8 relative z-10 space-y-4 font-sans">
            <button 
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div>
              <span className="text-[9px] uppercase font-mono font-bold text-gold bg-gold/10 px-2 py-0.5 rounded">
                {editingEvent ? 'Modifier Event Node' : 'Register New Calendar Event'}
              </span>
              <h3 className="text-lg font-display font-extrabold text-white mt-1.5">TIMELINE BUILDER</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Event Target Title *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Swalah General Assembly"
                  className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Date scheduled *</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Category Head *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-3 py-2.5 text-xs text-white focus:border-gold outline-none font-sans"
                  >
                    <option value="Arabic">Arabic</option>
                    <option value="English">English</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Kannada">Kannada</option>
                    <option value="General">General</option>
                    <option value="Committee">Committee</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Venue Hall Point *</label>
                <input
                  type="text"
                  value={formVenue}
                  onChange={(e) => setFormVenue(e.target.value)}
                  placeholder="e.g. Main Auditorium Foyer"
                  className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Nominated Duty Team</label>
                <input
                  type="text"
                  value={formAssignedTeam}
                  onChange={(e) => setFormAssignedTeam(e.target.value)}
                  placeholder="e.g. Team 1 or Committee Broad"
                  className="w-full bg-[#120a06] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-highlight to-gold text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:brightness-110 cursor-pointer transition-all mt-4 font-mono text-center"
            >
              {editingEvent ? 'Update Calendar Schedule' : 'Broaden Event Notification'}
            </button>
          </form>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-[#180f0a] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 font-mono">
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold text-base font-display">Confirm Deletion</h4>
              <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                Are you sure you want to delete this scheduled event? All notifications relating to this timeline node will cease.
              </p>
            </div>
            <div className="flex gap-2 font-display">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 bg-stone-900 text-stone-400 rounded-xl text-xs font-semibold hover:bg-stone-800 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteEvent(deleteConfirmId)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Remove Nodes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
