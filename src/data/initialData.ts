import { Student, Team, Program, Notice, GalleryItem, Transaction, ResourceItem, MagazineArticle, Idea, Memory, AttendanceRecord, Winner } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    admissionNumber: 288,
    fullName: "AHMED NABEEL",
    role: "President",
    teamId: 1,
    attendancePercentage: 96,
    programsParticipated: ["Public Speaking", "Essay Writing (Arabic)", "Mushaira Night"],
    achievements: ["Leader of the Year", "First Place in Debate"],
    bio: "Passionate leader, dedicated to the welfare of Swalah union students. Specializes in project coordination and public affairs.",
    skills: ["Leadership", "Public Speaking", "Public Relations"],
    certificates: ["Strategic Management Cert", "Youth Leadership Diploma"]
  },
  {
    admissionNumber: 289,
    fullName: "MOHAMMAD NASHWAN",
    role: "Vice President",
    teamId: 2,
    attendancePercentage: 94,
    programsParticipated: ["Public Speaking", "Mushaira Night", "Vision & Action"],
    achievements: ["Active Organizer Award"],
    bio: "Committed to supporting student-focused community programs and building high-performance student wings.",
    skills: ["Event Management", "Negotiation", "Crisis Resolution"],
    certificates: []
  },
  {
    admissionNumber: 287,
    fullName: "ALTAHF RAHMAN",
    role: "Secretary",
    teamId: 3,
    attendancePercentage: 93,
    programsParticipated: ["Mushaira Night", "Kannada Drama", "Public Speaking"],
    achievements: ["Excellent Documentation Award"],
    bio: "Managing administrative procedures, class communications, and keeping student modules perfectly aligned.",
    skills: ["Documentation", "Technical Writing", "Office Management"],
    certificates: ["Professional Administrative Coordinator"]
  },
  {
    admissionNumber: 265,
    fullName: "MOHAMMAD UNAIS",
    role: "Vice Secretary",
    teamId: 1,
    attendancePercentage: 91,
    programsParticipated: ["Essay Writing (Arabic)", "Kannada Drama"],
    achievements: ["Dedicated Service Award"],
    bio: "Helping coordinate program operations, agendas, and keeping general registers updated.",
    skills: ["Coordination", "Spreadsheets", "Planning"],
    certificates: []
  },
  {
    admissionNumber: 276,
    fullName: "AHMED NAZIM",
    role: "Treasurer",
    teamId: 2,
    attendancePercentage: 95,
    programsParticipated: ["Vision & Action", "Public Speaking", "Mushaira Night"],
    achievements: ["Financial Integrity Award"],
    bio: "Meticulous general ledger management, budget tracking, and ensuring transparency for union contributions.",
    skills: ["Accounting", "Financial Analysis", "Budgeting"]
  },
  {
    admissionNumber: 253,
    fullName: "AHMED NAZIM",
    role: "Assistant Treasurer",
    teamId: 3,
    attendancePercentage: 88,
    programsParticipated: ["Mushaira Night", "Kannada Drama"],
    achievements: []
  },
  {
    admissionNumber: 290,
    fullName: "MOHAMMAD HASAN SHANID",
    role: "PR Officer",
    teamId: 3,
    attendancePercentage: 92,
    programsParticipated: ["Public Speaking", "Mushaira Night", "Creative Canvas"],
    achievements: ["Best Communicator 2026"],
    bio: "Expanding Swalah's digital footprint and external relationship with other institutions.",
    skills: ["Digital design", "Social Media Marketing", "Content Creation"]
  },
  // Active Team Leads & Members
  {
    admissionNumber: 292,
    fullName: "ABDULLA MIKDAD",
    role: "Team 1 Captain",
    teamId: 1,
    attendancePercentage: 95,
    programsParticipated: ["Essay Writing (Arabic)", "Kannada Drama", "Vision & Action"],
    achievements: ["Best Captain Q1", "Star Athlete"],
    bio: "Proactive manager leading Team 1 towards continuous academic and program leadership.",
    skills: ["Team Leadership", "Strategic Planning", "Coaching"]
  },
  {
    admissionNumber: 305,
    fullName: "MOHAMMAD FAZIL CM",
    role: "Urdu Wing Chairman & Team 1 Assistant",
    teamId: 1,
    attendancePercentage: 90,
    programsParticipated: ["Mushaira Night", "Essay Writing (Arabic)", "Public Speaking"],
    achievements: ["Urdu Literature Excellence"],
    bio: "Passionate about Urdu poetry, ghazals, and promoting regional linguistic treasures among campus groups.",
    skills: ["Poetry Writing", "Public Speaking", "Event Hosting"]
  },
  {
    admissionNumber: 270,
    fullName: "ABDUOL NAFI KM",
    role: "General Wing Convener",
    teamId: 1,
    attendancePercentage: 89,
    programsParticipated: ["Essay Writing (Arabic)", "Kannada Drama"],
    achievements: []
  },
  {
    admissionNumber: 279,
    fullName: "MOHAMMAD SAMIQ",
    role: "English Wing Convener",
    teamId: 1,
    attendancePercentage: 91,
    programsParticipated: ["Essay Writing (Arabic)", "Vision & Action"],
    achievements: ["Debate Runner Up"]
  },
  {
    admissionNumber: 291,
    fullName: "ARSHAD GI",
    role: "Kannada Wing Chairman",
    teamId: 1,
    attendancePercentage: 93,
    programsParticipated: ["Kannada Drama", "Essay Writing (Arabic)"],
    achievements: ["Drama Icon Award"]
  },
  {
    admissionNumber: 301,
    fullName: "MOHAMMAD THWALHA",
    role: "Student Representative",
    teamId: 1,
    attendancePercentage: 87,
    programsParticipated: ["Kannada Drama"]
  },
  {
    admissionNumber: 272,
    fullName: "MOHAMMAD RAFI MK",
    role: "Student Representative",
    teamId: 1,
    attendancePercentage: 89,
    programsParticipated: ["Essay Writing (Arabic)", "Vision & Action"]
  },
  {
    admissionNumber: 261,
    fullName: "MOHAMMAD RAZEEN",
    role: "Kannada Wing Convener",
    teamId: 1,
    attendancePercentage: 92,
    programsParticipated: ["Kannada Drama", "Creative Canvas"]
  },
  // TEAM 2 MEMBERS
  {
    admissionNumber: 296,
    fullName: "MOHAMMAD AMJAD",
    role: "Team 2 Captain",
    teamId: 2,
    attendancePercentage: 94,
    programsParticipated: ["Public Speaking", "Vision & Action", "Mushaira Night"],
    achievements: ["Exceptional Planner Award"],
    bio: "Fosters healthy group work, keeping Team 2 structured and ready to organize multiple events."
  },
  {
    admissionNumber: 266,
    fullName: "AHMMAD BISHIR",
    role: "General Wing Chairman & Team 2 Assistant",
    teamId: 2,
    attendancePercentage: 91,
    programsParticipated: ["Public Speaking", "Mushaira Night", "Vision & Action"],
    achievements: ["Multi-Talent of the Year"]
  },
  {
    admissionNumber: 302,
    fullName: "MOHAMMAD ANAS",
    role: "Student Representative",
    teamId: 2,
    attendancePercentage: 86,
    programsParticipated: ["Public Speaking", "Vision & Action"]
  },
  {
    admissionNumber: 269,
    fullName: "MOHAMMAD SHAMMAS",
    role: "English Wing Chairman",
    teamId: 2,
    attendancePercentage: 93,
    programsParticipated: ["Public Speaking", "Vision & Action"],
    achievements: ["English Writing Laureate"]
  },
  {
    admissionNumber: 268,
    fullName: "MOHAMMAD IJLAN KU",
    role: "Student Representative",
    teamId: 2,
    attendancePercentage: 90,
    programsParticipated: ["Public Speaking", "Mushaira Night"]
  },
  {
    admissionNumber: 307,
    fullName: "MOHAMMAD THUFIAL",
    role: "Student Representative",
    teamId: 2,
    attendancePercentage: 85,
    programsParticipated: ["Mushaira Night"]
  },
  {
    admissionNumber: 304,
    fullName: "MUNSIF AHMED",
    role: "Student Representative",
    teamId: 2,
    attendancePercentage: 88,
    programsParticipated: ["Vision & Action", "Public Speaking"]
  },
  // TEAM 3 MEMBERS
  {
    admissionNumber: 282,
    fullName: "SAHAD IBRAHIM",
    role: "Team 3 Captain",
    teamId: 3,
    attendancePercentage: 93,
    programsParticipated: ["Mushaira Night", "Public Speaking", "Creative Canvas"],
    achievements: ["Best Coordinator Award"],
    bio: "Pioneering creative art sessions and Urdu language showcases, directing Team 3 toward dynamic performance."
  },
  {
    admissionNumber: 286,
    fullName: "MOHAMMAD SHAHIM",
    role: "Arabic Wing Convener & Team 3 Assistant",
    teamId: 3,
    attendancePercentage: 92,
    programsParticipated: ["Mushaira Night", "Essay Writing (Arabic)", "Creative Canvas"],
    achievements: ["Calligraphy Champion"]
  },
  {
    admissionNumber: 300,
    fullName: "RAZA HAMZA",
    role: "Urdu Wing Convener",
    teamId: 3,
    attendancePercentage: 90,
    programsParticipated: ["Mushaira Night", "Creative Canvas"]
  },
  {
    admissionNumber: 267,
    fullName: "MUHAMMAD RAZI",
    role: "Student Representative",
    teamId: 3,
    attendancePercentage: 89,
    programsParticipated: ["Mushaira Night", "Creative Canvas"]
  },
  {
    admissionNumber: 255,
    fullName: "MOHAMMAD AZAR",
    role: "Student Representative",
    teamId: 3,
    attendancePercentage: 88,
    programsParticipated: ["Mushaira Night"]
  },
  {
    admissionNumber: 274,
    fullName: "MOHAMMAD APSAL",
    role: "Student Representative",
    teamId: 3,
    attendancePercentage: 85,
    programsParticipated: ["Mushaira Night"]
  },
  // Others
  {
    admissionNumber: 293,
    fullName: "MOHAMMAD RAFIH",
    role: "Student Representative",
    teamId: 1,
    attendancePercentage: 87,
    programsParticipated: ["Essay Writing (Arabic)"]
  },
  {
    admissionNumber: 285,
    fullName: "MOHAMMAD THAJUDDEEN",
    role: "Arabic Wing Chairman",
    teamId: 3,
    attendancePercentage: 95,
    programsParticipated: ["Essay Writing (Arabic)", "Mushaira Night", "Creative Canvas"],
    achievements: ["Linguistic Excellence Badge"],
    bio: "Passionate promoter of Classical Arabic traditions, lecturing, and conducting interactive group seminars.",
    skills: ["Arabic Grammar", "Translation", "Event Execution"]
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 1,
    name: "Team 1",
    captainId: 292, // Mikdad
    assistantId: 305, // Fazil CM
    memberIds: [270, 279, 291, 301, 272, 261, 293],
    score: 840,
    rank: 1,
    dutiesCompleted: 14
  },
  {
    id: 2,
    name: "Team 2",
    captainId: 296, // Amjad
    assistantId: 266, // Bishir
    memberIds: [302, 269, 268, 307, 304],
    score: 790,
    rank: 2,
    dutiesCompleted: 12
  },
  {
    id: 3,
    name: "Team 3",
    captainId: 282, // Sahad
    assistantId: 286, // Shahim
    memberIds: [300, 267, 255, 274, 285],
    score: 775,
    rank: 3,
    dutiesCompleted: 11
  }
];

export const INITIAL_PROGRAMS: Program[] = [
  {
    id: "prog-1",
    title: "Essay Writing (Arabic)",
    date: "2026-01-18",
    venue: "Main Hall A",
    category: "Arabic",
    assignedTeamId: 1,
    status: "Completed",
    description: "An intensive essay contest highlighting Arab literature, syntax, and contemporary issues.",
  },
  {
    id: "prog-2",
    title: "Public Speaking",
    date: "2026-02-02",
    venue: "Auditorium B",
    category: "English",
    assignedTeamId: 2,
    status: "Completed",
    description: "Students pitch speeches on youth empowerment and future global technological shifts.",
  },
  {
    id: "prog-3",
    title: "Mushaira Night",
    date: "2026-02-14",
    venue: "Seminar Room 1",
    category: "Urdu",
    assignedTeamId: 3,
    status: "Completed",
    description: "A cultural gathering celebrating classical ghazals, poetry recitals, and modern Shayari.",
  },
  {
    id: "prog-4",
    title: "Kannada Drama Rehearsal",
    date: "2026-03-05",
    venue: "Cultural Amphitheater",
    category: "Kannada",
    assignedTeamId: 1,
    status: "Completed",
    description: "Rehearsal and creative feedback session for the upcoming Karnataka State Heritage Drama.",
  },
  {
    id: "prog-5",
    title: "Swalah Talent Hunt",
    date: "2026-07-15",
    venue: "Main Campus Center",
    category: "General",
    assignedTeamId: 3,
    status: "Registration Open",
    registrationDeadline: "2026-07-10",
    registeredUsers: [288, 289, 305, 292, 282],
    description: "Showcasing student expertise in non-academic fields including digital arts, mimicry, public hosting, and speed solving."
  },
  {
    id: "prog-6",
    title: "Creative Canvas Exhibition",
    date: "2026-07-28",
    venue: "Art Block Gallery",
    category: "General",
    assignedTeamId: 2,
    status: "Upcoming",
    description: "An expressive canvas painting competition spanning watercolor portraits and modern digital creations."
  },
  {
    id: "prog-7",
    title: "Vision & Action Forum",
    date: "2026-08-10",
    venue: "Executive Boardroom",
    category: "General",
    assignedTeamId: 1,
    status: "Upcoming",
    description: "Class community brainstorm with the main committee outlining projects, infrastructure enhancements, and career workshops."
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: "not-1",
    title: "Executive Committee Meeting Scheduled",
    date: "2026-06-25",
    content: "Agenda: Project Swalah 2026, upcoming state scholarship filings, and language wing budget allocations. All committee members must present with status reports.",
    type: "meeting"
  },
  {
    id: "not-2",
    title: "Syllabus Revisions & Exam Center Updates",
    date: "2026-06-20",
    content: "Please check with the administrative cell for updated center registration codes. Mid-semester schedule is pinned on notice boards.",
    type: "exam"
  },
  {
    id: "not-3",
    title: "National Merit Scholarship Portal Open",
    date: "2026-06-18",
    content: "Eligible students must apply before June 30th. Document attestation services will be arranged this Friday under classes coordinator.",
    type: "scholarship"
  },
  {
    id: "not-4",
    title: "Swalah Talent Hunt 2026 Guidelines",
    date: "2026-06-15",
    content: "Registration details are updated. Teams must submit custom equipment requirements to PR Officer Mohammad Hasan Shanid before July 5th.",
    type: "announcement"
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    type: "income",
    amount: 12000,
    category: "Sponsorship",
    date: "2026-05-12",
    description: "Class Alumni Union Sponsorship"
  },
  {
    id: "tx-2",
    type: "income",
    amount: 7500,
    category: "Member contribution",
    date: "2026-05-20",
    description: "Monthly Union Fee Collections"
  },
  {
    id: "tx-3",
    type: "expense",
    amount: 2500,
    category: "Programs",
    date: "2026-02-14",
    description: "Mushaira Night sound setup and light tea refreshments"
  },
  {
    id: "tx-4",
    type: "expense",
    amount: 1500,
    category: "Stage Refreshments",
    date: "2026-02-02",
    description: "High Tea for guests at Public Speaking Event"
  },
  {
    id: "tx-5",
    type: "income",
    amount: 5000,
    category: "Grant",
    date: "2026-06-01",
    description: "Inter-collegiate Urdu Wing Fest Prize Grant"
  },
  {
    id: "tx-6",
    type: "expense",
    amount: 650,
    category: "Certificates & Medals",
    date: "2026-03-10",
    description: "Bronze medals for Kannada Drama performers"
  }
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: "res-1",
    title: "Arabic Grammar Mastery Guide",
    category: "Study Material",
    date: "2026-05-30",
    description: "A complete syllabus-oriented handbook covering intermediate syntax, verbs, and common vocabulary.",
    downloadUrl: "#"
  },
  {
    id: "res-2",
    title: "Weekly Attendance Declaration Form",
    category: "Form",
    date: "2026-06-10",
    description: "Template to record and submit session participant logs directly to the Committee Secretary.",
    downloadUrl: "#"
  },
  {
    id: "res-3",
    title: "Annual Union Budget Allocation Audit",
    category: "Report",
    date: "2026-04-15",
    description: "Detailed analysis of Swalah resources, expense vouchers, and alumni fund metrics.",
    downloadUrl: "#"
  },
  {
    id: "res-4",
    title: "Interactive Debate and Drama Certificate",
    category: "Certificate",
    date: "2026-02-28",
    description: "Verifiable digital certificate template given to all class volunteers and podium awardees.",
    downloadUrl: "#"
  }
];

export const INITIAL_MAGAZINE: MagazineArticle[] = [
  {
    id: "art-1",
    title: "Bridges of Thought: How Multi-linguism Enriches Classroom Culture",
    author: "MOHAMMAD SHAMMAS",
    category: "Article",
    excerpt: "Exploring our multi-lingual roots and the profound social links forged by class platforms like Arabic, Urdu, and English.",
    content: "When we analyze our diverse class matrix, we find students translating humor, poetry, and state philosophies with high integrity. This article deepens our understanding of multi-lingual systems and outlines classroom experiments to bridge linguistic gaps.",
    date: "2026-05-14"
  },
  {
    id: "art-2",
    title: "Ghazal of the Crescent Moon",
    author: "MOHAMMAD FAZIL CM",
    category: "Poetry",
    excerpt: "An expressive Urdu poetic recital mapping dreams, youth aspirations, and late-night study struggles.",
    content: "A collection of short couplets tracing nostalgia. The rhythm guides participants into deep emotional valleys while maintaining standard meters. Highly praised during the February Mushaira Night.",
    date: "2026-02-14"
  },
  {
    id: "art-3",
    title: "The Visionary Academic: Interview with President Ahmed Nabeel",
    author: "MOHAMMAD HASAN SHANID",
    category: "Interview",
    excerpt: "Exclusive conversation outlining leadership structures, plans, and persistent class memories.",
    content: "We sat with Nabeel to talk about his long-term dreams for Swalah Union. He discusses class teamwork, overcoming stage fears, and establishing state-of-the-art study banks for less-served student peers.",
    date: "2026-06-02"
  }
];

export const INITIAL_IDEAS: Idea[] = [
  {
    id: "idea-1",
    title: "Swalah Digital Library & E-Archives",
    description: "Let's aggregate previous semester lecture records, exam models, and textbook PDFs onto an offline-cached public folder for easy student downloads.",
    author: "Abdulla Mikdad",
    votes: 18,
    date: "2026-06-12",
    status: "Approved"
  },
  {
    id: "idea-2",
    title: "Weekly Football / Sports Tournaments",
    description: "Creating rapid 15-minute inter-team games each Saturday to foster real-world sportsmanship and team rankings.",
    author: "Mohammad Anas",
    votes: 24,
    date: "2026-06-15",
    status: "Reviewed"
  },
  {
    id: "idea-3",
    title: "Anonymous Peer Mental Support Box",
    description: "An anonymous text module enabling classmates going through high stress to connect with executive members or guidance advisors safely.",
    author: "Anonymous",
    votes: 12,
    date: "2026-06-20",
    status: "Pending"
  }
];

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: "mem-1",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=60",
    message: "Nothing compares to the energy during the countdown to Swalah Launch 2025! A great year begins.",
    author: "Altaf Rahman",
    date: "2025-08-20"
  },
  {
    id: "mem-2",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=60",
    message: "Mushaira Night was absolute gold. Sitting under the glowing lantern reciting Fazil's verse.",
    author: "Raza Hamza",
    date: "2026-02-14"
  },
  {
    id: "mem-3",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=60",
    message: "Late night debate revisions. Team 1 practicing until our throats were absolutely dry!",
    author: "Mohammad Samiq",
    date: "2026-01-17"
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Main Committee Inauguration Group",
    imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
    category: "Anniversary 2026",
    description: "Nabeel, Altaf, Nazim, and other core officers taking the oath of office.",
    date: "2026-01-05"
  },
  {
    id: "gal-2",
    title: "Mushaira Stage Performance Recital",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
    category: "Swalah Talent",
    description: "Fazil CM reading classical Urdu ghazals under warm golden spotlights.",
    date: "2026-02-14"
  },
  {
    id: "gal-3",
    title: "Interactive Creative Canvas Display",
    imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=80",
    category: "Creative Canvas",
    description: "Stretches of watercolors, calligraphy works, and modern abstract design sketches.",
    date: "2026-03-20"
  },
  {
    id: "gal-4",
    title: "Midsummer General Body Session",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    category: "Vision & Action",
    description: "Interactive session addressing class assignments, programs, and team standings.",
    date: "2026-05-18"
  },
  {
    id: "gal-5",
    title: "Quiz Finals Championship Award",
    imageUrl: "https://images.unsplash.com/photo-1453733190148-c44698c265a8?w=800&auto=format&fit=crop&q=80",
    category: "Quiz Finals",
    description: "Team 2 lifting the ultimate Swalah Brainiac of the Semester cup.",
    date: "2026-04-10"
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "att-1",
    date: "2026-01-18",
    programId: "prog-1",
    programTitle: "Essay Writing (Arabic)",
    presentAdNos: [288, 289, 287, 265, 276, 305, 270, 279, 291, 272, 261, 292, 293, 285, 286]
  },
  {
    id: "att-2",
    date: "2026-02-02",
    programId: "prog-2",
    programTitle: "Public Speaking",
    presentAdNos: [288, 289, 287, 276, 296, 266, 302, 269, 268, 304, 307]
  },
  {
    id: "att-3",
    date: "2026-02-14",
    programId: "prog-3",
    programTitle: "Mushaira Night",
    presentAdNos: [288, 289, 287, 276, 253, 290, 282, 286, 300, 267, 255, 274, 285]
  },
  {
    id: "att-4",
    date: "2026-03-05",
    programId: "prog-4",
    programTitle: "Kannada Drama Rehearsal",
    presentAdNos: [288, 265, 253, 292, 305, 270, 291, 301, 261]
  }
];

export const INITIAL_WINNERS: Winner[] = [
  {
    id: "win-1",
    studentName: "AHMED NABEEL",
    admissionNumber: 288,
    teamId: 1,
    competitionName: "Arabic Essay Writing Competition",
    position: "First",
    date: "2026-01-18",
    category: "Essay Writing",
    year: "2026"
  },
  {
    id: "win-2",
    studentName: "MOHAMMAD NASHWAN",
    admissionNumber: 289,
    teamId: 2,
    competitionName: "Inter-Wing Speech Championship",
    position: "Second",
    date: "2026-02-02",
    category: "Speech Competition",
    year: "2026"
  },
  {
    id: "win-3",
    studentName: "ALTAHF RAHMAN",
    admissionNumber: 287,
    teamId: 3,
    competitionName: "Annual Urdu Poetry Mushaira",
    position: "Third",
    date: "2026-02-14",
    category: "Poetry Competition",
    year: "2026"
  },
  {
    id: "win-4",
    studentName: "MOHAMMAD HASAN SHANID",
    admissionNumber: 290,
    teamId: 3,
    competitionName: "Creative Canvas Art Contest",
    position: "First",
    date: "2026-03-22",
    category: "Creative Canvas",
    year: "2026"
  },
  {
    id: "win-5",
    studentName: "AHMED NAZIM",
    admissionNumber: 276,
    teamId: 2,
    competitionName: "Mega General Quiz Competition",
    position: "First",
    date: "2026-04-05",
    category: "Quiz Competition",
    year: "2026"
  },
  {
    id: "win-6",
    studentName: "MOHAMMAD UNAIS",
    admissionNumber: 265,
    teamId: 1,
    competitionName: "Swalah Talent Hunt 2026",
    position: "Third",
    date: "2026-04-18",
    category: "Swalah Talent",
    year: "2026"
  },
  {
    id: "win-7",
    studentName: "AHMED NABEEL",
    admissionNumber: 288,
    teamId: 1,
    competitionName: "Arabic Symposium Debate",
    position: "Second",
    date: "2026-05-10",
    category: "Arabic Symposium",
    year: "2026"
  }
];

