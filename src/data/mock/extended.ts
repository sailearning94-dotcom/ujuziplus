export const communityChannels = [
  { slug: "general", name: "General", description: "Community-wide discussions" },
  { slug: "showcase", name: "Showcase", description: "Share your projects" },
  { slug: "help", name: "Help", description: "Get help with coding & STEM" },
  { slug: "robotics", name: "Robotics", description: "Robotics discussions" },
];

export const communityPosts = [
  {
    id: "post-1",
    channelSlug: "general",
    title: "Best Arduino starter kit in Dar?",
    author: "Grace Mrema",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=grace",
    content: "Looking for recommendations for a robotics club at our school.",
    upvotes: 24,
    replies: 8,
    createdAt: "2026-05-20",
    tags: ["hardware", "arduino"],
  },
  {
    id: "post-2",
    channelSlug: "showcase",
    title: "Solar irrigation MVP demo",
    author: "Peter Njoroge",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=peter",
    content: "Just deployed our ESP32-based system in Morogoro. Video demo inside!",
    upvotes: 56,
    replies: 12,
    createdAt: "2026-05-18",
    tags: ["iot", "agriculture"],
  },
];

export const competitions = [
  {
    id: "comp-1",
    slug: "dar-hackathon-2026",
    title: "Dar es Salaam Innovation Hackathon 2026",
    description: "48-hour hackathon for youth innovators. Build solutions for local challenges.",
    startDate: "2026-06-15",
    endDate: "2026-06-17",
    prize: "TZS 5,000,000",
    teams: 42,
    status: "upcoming",
  },
  {
    id: "comp-2",
    slug: "stem-fair-2026",
    title: "National STEM Fair",
    description: "Showcase robotics and IoT projects from schools across Tanzania.",
    startDate: "2026-07-01",
    endDate: "2026-07-03",
    prize: "Scholarships + Kits",
    teams: 120,
    status: "registration_open",
  },
];

export const programs = [
  {
    id: "prog-1",
    slug: "stem-bootcamp-2026",
    title: "STEM Bootcamp 2026",
    type: "Bootcamp",
    startDate: "2026-07-01",
    endDate: "2026-08-15",
    format: "Hybrid",
    seats: 50,
    enrolled: 38,
    price: 150000,
  },
  {
    id: "prog-2",
    slug: "women-in-tech",
    title: "Women in Tech Initiative",
    type: "Program",
    startDate: "Ongoing",
    endDate: "Dec 2026",
    format: "Online",
    seats: 200,
    enrolled: 145,
    price: 0,
  },
  {
    id: "prog-3",
    slug: "startup-incubator-c3",
    title: "Startup Incubator Cohort 3",
    type: "Incubator",
    startDate: "2026-09-01",
    endDate: "2027-02-28",
    format: "In-person",
    seats: 20,
    enrolled: 12,
    price: 500000,
  },
];

export const resources = [
  { id: "r-1", title: "Arduino Cheat Sheet", type: "PDF", size: "2.4 MB", category: "Robotics" },
  { id: "r-2", title: "ESP32 Pinout Guide", type: "PDF", size: "1.1 MB", category: "IoT" },
  { id: "r-3", title: "Python Data Science Starter Kit", type: "ZIP", size: "15 MB", category: "AI" },
  { id: "r-4", title: "Robotics Kit Assembly Manual", type: "PDF", size: "8.2 MB", category: "Hardware" },
];

export const reviews = [
  { id: "rev-1", user: "Grace M.", rating: 5, comment: "Excellent hands-on course!", date: "2026-05-01" },
  { id: "rev-2", user: "Peter N.", rating: 4, comment: "Great content, wish there were more labs.", date: "2026-04-20" },
];

export const pricingPlans = [
  {
    name: "Free",
    price: 0,
    features: ["Access free courses", "Community access", "Basic certificates"],
  },
  {
    name: "Learner",
    price: 25000,
    period: "month",
    features: ["All free features", "20% off paid courses", "Priority support", "Download resources"],
    popular: true,
  },
  {
    name: "Organization",
    price: 0,
    period: "custom",
    features: ["Bulk seats", "Private courses", "Analytics dashboard", "White-label option"],
  },
];

export const pendingCourses = [
  {
    id: "pc-1",
    title: "Advanced Drone Programming",
    instructor: "Dr. Amina Hassan",
    category: "Robotics",
    submittedAt: "2026-05-22",
    lessonCount: 24,
  },
];

export const adminUsers = [
  { id: "u-1", name: "William Mwangi", email: "william@example.com", role: "student", status: "active", joined: "2025-01-15" },
  { id: "u-2", name: "Grace Mrema", email: "grace@example.com", role: "instructor", status: "active", joined: "2024-08-20" },
  { id: "u-3", name: "Peter Njoroge", email: "peter@example.com", role: "student", status: "suspended", joined: "2025-03-10" },
];

export const payments = [
  { id: "pay-1", user: "William M.", course: "Arduino Robotics", amount: 35000, method: "M-Pesa", status: "completed", date: "2026-05-24" },
  { id: "pay-2", user: "Grace M.", course: "IoT Agriculture", amount: 55000, method: "Airtel Money", status: "completed", date: "2026-05-23" },
  { id: "pay-3", user: "James K.", course: "Web Dev", amount: 60000, method: "Card", status: "pending", date: "2026-05-25" },
];
