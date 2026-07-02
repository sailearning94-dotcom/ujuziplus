import type { Course, Module, Notification, Organization, Project, User } from "@/types/app";

export const currentUser: User = {
  id: "u-001",
  username: "william_m",
  fullName: "William Mwangi",
  email: "william@example.com",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=william",
  roles: ["student", "instructor"],
  isVerifiedInstructor: true,
};

export const platformStats = {
  learners: 12450,
  courses: 380,
  certificates: 8200,
  organizations: 45,
  instructors: 120,
};

export const courses: Course[] = [
  {
    id: "c-001",
    slug: "arduino-robotics-fundamentals",
    title: "Arduino Robotics Fundamentals",
    subtitle: "Build your first robot from scratch",
    description:
      "Hands-on robotics course covering sensors, motors, and autonomous navigation for African innovators.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=340&fit=crop",
    instructor: {
      id: "i-001",
      fullName: "Dr. Amina Hassan",
      username: "amina_h",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=amina",
    },
    category: "Robotics",
    level: "beginner",
    language: "English",
    price: 45000,
    discountPrice: 35000,
    isFree: false,
    rating: 4.8,
    totalReviews: 234,
    totalEnrollments: 1840,
    durationHours: 12,
    status: "published",
    whatYouLearn: [
      "Wire Arduino sensors and actuators",
      "Program motor control with C++",
      "Build line-following robots",
      "Integrate ultrasonic distance sensors",
    ],
  },
  {
    id: "c-002",
    slug: "python-ai-starter",
    title: "Python for AI — Starter Path",
    subtitle: "From zero to your first ML model",
    description: "Learn Python fundamentals and build practical AI projects for real-world African challenges.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=340&fit=crop",
    instructor: {
      id: "i-002",
      fullName: "James Okello",
      username: "jokello",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
    },
    category: "AI & Machine Learning",
    level: "beginner",
    language: "English",
    price: 0,
    isFree: true,
    rating: 4.9,
    totalReviews: 512,
    totalEnrollments: 4200,
    durationHours: 18,
    status: "published",
    whatYouLearn: [
      "Python syntax and data structures",
      "NumPy and Pandas for data analysis",
      "Train a classification model",
      "Deploy a simple AI API",
    ],
  },
  {
    id: "c-003",
    slug: "iot-smart-agriculture",
    title: "IoT for Smart Agriculture",
    subtitle: "Connect sensors to the cloud for farming solutions",
    description: "Build IoT systems using ESP32 for soil monitoring, irrigation automation, and data dashboards.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=340&fit=crop",
    instructor: {
      id: "i-003",
      fullName: "Fatuma Said",
      username: "fatuma_s",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatuma",
    },
    category: "IoT",
    level: "intermediate",
    language: "English",
    price: 55000,
    isFree: false,
    rating: 4.7,
    totalReviews: 89,
    totalEnrollments: 620,
    durationHours: 14,
    status: "published",
    whatYouLearn: [
      "ESP32 programming and WiFi setup",
      "MQTT protocol for sensor data",
      "Build a real-time dashboard",
      "Solar-powered field deployment",
    ],
  },
  {
    id: "c-004",
    slug: "fullstack-react-nextjs",
    title: "Full-Stack Web with React & Next.js",
    subtitle: "Build production-ready web applications",
    description: "Modern web development from UI components to API routes and deployment on Vercel.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=340&fit=crop",
    instructor: {
      id: "i-004",
      fullName: "David Kimani",
      username: "dkimani",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    },
    category: "Web Development",
    level: "intermediate",
    language: "English",
    price: 60000,
    isFree: false,
    rating: 4.6,
    totalReviews: 178,
    totalEnrollments: 2100,
    durationHours: 22,
    status: "published",
    whatYouLearn: [
      "React hooks and component patterns",
      "Next.js App Router and SSR",
      "REST API integration",
      "Deploy to production",
    ],
  },
];

export const courseCurriculum: Module[] = [
  {
    id: "m-1",
    title: "Getting Started with Arduino",
    order: 1,
    lessons: [
      { id: "l-1", slug: "introduction", title: "Course Introduction", type: "video", durationMinutes: 8, isFreePreview: true, isCompleted: true },
      { id: "l-2", slug: "setup-arduino-ide", title: "Setting Up Arduino IDE", type: "video", durationMinutes: 12, isFreePreview: true, isCompleted: true },
      { id: "l-3", slug: "first-blink", title: "Your First Blink Program", type: "video", durationMinutes: 15, isFreePreview: false, isCompleted: true },
      { id: "l-4", slug: "quiz-basics", title: "Arduino Basics Quiz", type: "quiz", durationMinutes: 10, isFreePreview: false, isCompleted: false },
    ],
  },
  {
    id: "m-2",
    title: "Sensors & Motors",
    order: 2,
    lessons: [
      { id: "l-5", slug: "ultrasonic-sensor", title: "Ultrasonic Distance Sensor", type: "video", durationMinutes: 18, isFreePreview: false, isCompleted: false },
      { id: "l-6", slug: "motor-control", title: "DC Motor Control", type: "video", durationMinutes: 22, isFreePreview: false, isCompleted: false },
      { id: "l-7", slug: "lab-motor-test", title: "Practical Lab: Motor Test", type: "assignment", durationMinutes: 45, isFreePreview: false, isCompleted: false },
    ],
  },
];

export const projects: Project[] = [
  {
    id: "p-001",
    slug: "solar-irrigation-iot",
    title: "Solar-Powered Smart Irrigation",
    description: "ESP32-based system that monitors soil moisture and automates irrigation for smallholder farmers.",
    thumbnailUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=340&fit=crop",
    category: "IoT",
    tags: ["ESP32", "Agriculture", "Solar"],
    creators: [{ id: "u-002", fullName: "Grace Mrema", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=grace" }],
    likes: 142,
    status: "mvp",
    githubUrl: "https://github.com/example/solar-irrigation",
  },
  {
    id: "p-002",
    slug: "health-chatbot-sw",
    title: "Swahili Health Assistant Chatbot",
    description: "AI chatbot providing basic health information in Swahili for rural communities with low connectivity.",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=340&fit=crop",
    category: "AI",
    tags: ["NLP", "Healthcare", "Swahili"],
    creators: [{ id: "u-003", fullName: "Peter Njoroge", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=peter" }],
    likes: 89,
    status: "prototype",
  },
];

export const organizations: Organization[] = [
  {
    id: "o-001",
    slug: "techstar-university",
    name: "TechStar University",
    type: "university",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=TSU",
    memberCount: 2400,
    isVerified: true,
  },
  {
    id: "o-002",
    slug: "dar-innovation-hub",
    name: "Dar Innovation Hub",
    type: "hub",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=DIH",
    memberCount: 450,
    isVerified: true,
  },
];

export const notifications: Notification[] = [
  {
    id: "n-1",
    type: "assignment_feedback",
    title: "Assignment graded",
    body: "Your Motor Control Lab received 92/100",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    href: "/learn/arduino-robotics-fundamentals/motor-control",
  },
  {
    id: "n-2",
    type: "course_update",
    title: "New lesson available",
    body: "Ultrasonic Distance Sensor is now live",
    isRead: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    href: "/learn/arduino-robotics-fundamentals/ultrasonic-sensor",
  },
  {
    id: "n-3",
    type: "enrollment",
    title: "Enrollment confirmed",
    body: "You enrolled in Arduino Robotics Fundamentals",
    isRead: true,
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
];

export const dashboardStats = {
  activeCourses: 3,
  completedCourses: 2,
  certificates: 2,
  hoursLearned: 47,
  innovationScore: 780,
  projectsBuilt: 1,
  competitionRank: 12,
  streak: 14,
};
