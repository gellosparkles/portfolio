// Single source of truth for profile content. Open items are tracked in TODO.md.

export const site = {
  name: "Hansi Lee",
  legalName: "Tz-Jing Lee",
  role: "Electrical & Computer Engineering · USC Viterbi",
  graduation: "Graduating May 2028",
  location: "Los Angeles, CA",
  focus: "AI + Hardware Systems",
  tagline:
    "I build AI that runs on real hardware: ML models, embedded systems, sensors and robots, with security as a strand.",
  seeking: "Seeking Summer 2027 internships in AI and hardware systems.",
  about: [
    "I'm an ECE student at USC Viterbi and a CURVE fellow in the Khan Lab, working on wearable sweat sensors. I also co-founded Hubl and build robotics at Terra Labs.",
    "I like problems where the model has to meet real hardware, real data and real users.",
  ],
  links: {
    email: "hansilee@usc.edu" as string | null,
    linkedin: "https://www.linkedin.com/in/tzjinglee" as string | null,
    github: "https://github.com/gellosparkles" as string | null,
    resume: null as string | null,
  },
};

// Headline numbers shown under the hero, in display order.
export const stats = [
  { value: "2 labs · ~2 yrs", label: "AI & bio-sensor research" },
  { value: "2 wins · $1,200", label: "hackathon prizes (1st Buildathon $1,000, 2nd Games Week $200)" },
  { value: "2", label: "co-authored manuscripts, to appear 2026" },
  { value: "5", label: "organizations: robotics · cyber · software" },
];

export const education = {
  school: "University of Southern California, Viterbi School of Engineering",
  degree: "B.S. Electrical and Computer Engineering",
  when: "Aug 2025 – May 2028",
  gpa: "3.85",
};

export type DemoId = "hub-route" | "connection-path" | "audit-pipeline" | "spiral-sensor" | "tether-arm" | "case-studies";

export type Experience = {
  org: string;
  role: string;
  where: string;
  when: string;
  summary: string;
  chips: string[];
  /** Live demo shown in the card; roles without one show a placeholder. */
  demo?: DemoId;
  link?: { label: string; href: string };
};

// Resume order. One sentence and 2–4 chips per role; the resume bullets are not reproduced.
export const experience: Experience[] = [
  {
    org: "Khan Lab USC",
    role: "CURVE Researcher",
    where: "Los Angeles, CA",
    when: "Jan 2026 – Present",
    summary:
      "Redesigned a published spiral sweat-collection layout to stop fluid leaks; the lab confirmed it was more reliable and performed better in experiments.",
    chips: ["CURVE Fellow", "2 manuscripts (to appear)", "Leak-free redesign", "Microfluidics"],
    demo: "spiral-sensor",
  },
  {
    org: "Hubl LLC",
    role: "Co-Founder / CTO",
    where: "Los Angeles, CA",
    when: "Nov 2025 – Present",
    summary: "Pooled event buses: cluster riders into hubs, then route buses through them.",
    chips: ["1st Buildathon", "2nd Games Week", "Greif Incubator", "14/14 seats, sold out in 3 days"],
    demo: "hub-route",
  },
  {
    org: "Institute for Information Industry",
    role: "Cybersecurity Intern",
    where: "Taipei, TW",
    when: "Jun 2026 – Aug 2026",
    summary: "LLM tool that audits company documents against ISO 27001.",
    chips: ["98% match (51/52)", "~60 s per audit", "Gemini + Grok", "Vertex AI"],
    demo: "audit-pipeline",
  },
  {
    org: "YesTurnkey Technology",
    role: "Electronics & Network Engineering Intern",
    where: "Taipei, TW",
    when: "May 2026 – Jul 2026",
    summary: "Remote peer-to-peer webcam streaming from a Raspberry Pi 5.",
    chips: ["WebRTC", "STUN/TURN", "Raspberry Pi 5", "Ubuntu VM"],
    demo: "connection-path",
  },
  {
    org: "Terra Labs USC",
    role: "Electrical Engineer / Programmer",
    where: "Los Angeles, CA",
    when: "Sep 2026 – Present",
    summary: "Power and control for Tether, a 7-DOF robotic arm.",
    chips: ["7-DOF", "ESP32 master/slave", "3 motor groups", "ROS2"],
    demo: "tether-arm",
    link: { label: "uscterralabs.com", href: "https://uscterralabs.com" },
  },
  {
    org: "Chang Gung University Intelligent Control Lab",
    role: "Project Founder / Researcher",
    where: "Taoyuan City, TW",
    when: "Aug 2024 – Jun 2025",
    summary: "Gesture-recognition research and an ML Sudoku solver on an ESP32-CAM.",
    chips: ["85% accuracy", "Poster at 20th Formosa Seminar", "Solver < 0.2 s"],
    demo: "case-studies",
  },
];

export const publications = [
  {
    title: "Regarding a MobileNet and GRU-based Dynamic Hand-Gesture Recognition Model",
    authors: ["Peng-Ru Hou", "Tz-Jing Lee", "Yeong-Hua Chang"],
    me: "Tz-Jing Lee",
    venue: "Poster, 20th Formosa Plastics Corp. Applied Technology Seminar",
    highlight: "85% test accuracy vs. 66% for an RNN + GRU baseline",
    href: "/projects/gesture-recognition",
    paperPdf: null as string | null,
  },
];

export const honors = [
  {
    title: "CURVE Undergraduate Research Fellow",
    org: "Center for Undergraduate Research in Viterbi Engineering, USC",
    when: "Fall 2026 – Present",
    detail: null as string | null,
  },
  {
    title: "Dean's List",
    org: "USC Viterbi School of Engineering",
    when: "Fall 2025 – Present",
    detail: null as string | null,
  },
  {
    title: "1st place, USC Buildathon · 2nd place, Games Week Hackathon",
    org: "With Hubl",
    when: "2025–26",
    detail: null as string | null,
  },
];

export const certifications = [
  {
    title: "Competency Certification in Generative AI Office Applications",
    org: "Institute for Information Industry (III), Taiwan",
    when: "Issued Jul 2026 · valid through Jul 2028",
    url: null as string | null,
  },
];

export const skills = [
  "Python",
  "C++",
  "2D CAD",
  "PCB",
  "Linux",
  "MATLAB",
  "Agentic AI",
  "LLM",
  "ROS2",
  "ESP32",
  "Raspberry Pi",
  "Arduino",
];

export const interests = [
  "AI Security",
  "Security R&D",
  "Systems and Devices",
  "Robotics",
  "Competitive Programming",
  "Fitness",
  "Chess",
  "Poker",
  "Pool",
];
