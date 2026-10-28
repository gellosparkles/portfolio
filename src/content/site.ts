// Single source of truth for profile content. Open items are tracked in TODO.md.

export const site = {
  name: "Hansi Lee",
  legalName: "Tz-Jing Lee",
  role: "Electrical & Computer Engineering · USC Viterbi",
  graduation: "Graduating May 2028",
  location: "Los Angeles, CA",
  focus: "AI + Hardware Systems",
  tagline: "AI that runs on real hardware.",
  seeking: "Seeking Summer 2027 internships in AI and hardware systems.",
  links: {
    email: "hansilee@usc.edu" as string | null,
    linkedin: "https://www.linkedin.com/in/tzjinglee" as string | null,
    github: "https://github.com/gellosparkles" as string | null,
    resume: "/resume.pdf" as string | null,
  },
};

// Headline numbers shown under the hero, in display order: big value, small unit, one-line label.
export const stats = [
  { value: "~2", unit: "yrs", label: "AI & bio-sensor research · 2 labs" },
  { value: "2", unit: "wins", label: "hackathons · $1,200 in prizes" },
  { value: "2", unit: "papers", label: "co-authored manuscripts, to appear 2026" },
  { value: "5", unit: "orgs", label: "robotics · cyber · software" },
];

// Organizations row; the count must match the "5 organizations" stat.
export const organizations = [
  { org: "Terra Labs", role: "Electrical Engineer / Programmer", tag: "Robotics", href: "https://uscterralabs.com" },
  { org: "Cyborg", role: "General member", tag: "Cyber", href: "https://usccyb.org" },
  { org: "Cyborg Consulting", role: "Consultant", tag: "Cyber", href: "https://usccyb.org/consulting/" },
  { org: "TACTICS", role: "General member", tag: "Cyber", href: "https://usctactics.org" },
  { org: "HackSC", role: "Product Manager / Backend Developer", tag: "Software", href: "https://hacksc.com" },
] as { org: string; role: string; tag: string; href?: string }[];

export const education = {
  school: "University of Southern California, Viterbi School of Engineering",
  degree: "B.S. Electrical and Computer Engineering",
  when: "Aug 2025 – May 2028",
  gpa: "3.85",
};

export type DemoId = "hub-route" | "connection-path" | "audit-pipeline" | "spiral-sensor" | "tether-arm" | "case-studies" | "cell-filament";

export type Experience = {
  /** URL of the detail page: /work/<slug>. */
  slug: string;
  org: string;
  role: string;
  where: string;
  when: string;
  summary: string;
  chips: string[];
  /** Home-page tile: one big number with its unit, and a single short hook line. */
  big: { value: string; unit: string };
  hook: string;
  /** Detail page body, a few short sentences. */
  details: string[];
  demo: DemoId;
  link?: { label: string; href: string };
};

// Resume order. One sentence and 2–4 chips per role; the resume bullets are not reproduced.
export const experience: Experience[] = [
  {
    slug: "khan-lab",
    org: "Khan Lab USC",
    role: "CURVE Researcher",
    where: "Los Angeles, CA",
    when: "Jan 2026 – Present",
    summary:
      "Redesigned a published spiral sweat-collection layout to stop fluid leaks; the lab confirmed it was more reliable and performed better in experiments.",
    chips: ["CURVE Fellow", "2 manuscripts (to appear)", "Leak-free redesign", "Microfluidics"],
    big: { value: "2", unit: "manuscripts" },
    hook: "A published sweat sensor leaked at every turn. I smoothed them out.",
    details: [
      "Wearable sweat sensors route sweat from the skin through a microfluidic channel and past sensing electrodes.",
      "The published layout stacks half-circle channels joined by hairpin turns, and fluid leaked out at those turns. My redesign replaces them with one continuous spiral.",
      "The lab confirmed the redesign was more reliable and performed better in experiments. Two co-authored manuscripts on the work are to appear in 2026.",
    ],
    demo: "spiral-sensor",
  },
  {
    slug: "hubl",
    org: "Hubl LLC",
    role: "Co-Founder / CTO",
    where: "Los Angeles, CA",
    when: "Nov 2025 – Present",
    summary: "Pooled event buses: cluster riders into hubs, then route buses through them.",
    chips: ["1st Buildathon", "2nd Games Week", "Greif Incubator", "14/14 seats, sold out in 3 days"],
    big: { value: "14/14", unit: "seats in 3 days" },
    hook: "Pooled buses to events. The first trip sold out in three days.",
    details: [
      "Riders are clustered into pickup hubs, then routes are planned so each bus covers its nearby hubs and ends at the venue.",
      "First trip: 14 of 14 seats sold out in 3 days, at $15 a seat versus $31–62 by Uber.",
      "Hubl won 1st place at the USC Buildathon and 2nd at Games Week, and joined the Greif Incubator.",
    ],
    demo: "hub-route",
  },
  {
    slug: "iii",
    org: "Institute for Information Industry",
    role: "Cybersecurity Intern",
    where: "Taipei, TW",
    when: "Jun 2026 – Aug 2026",
    summary: "LLM tool that audits company documents against ISO 27001.",
    chips: ["98% match (51/52)", "~60 s per audit", "Gemini + Grok", "Vertex AI"],
    big: { value: "98%", unit: "match · 51/52" },
    hook: "An LLM auditor that checks ISO 27001 in about a minute.",
    details: [
      "The tool reads a company's documents and checks them against ISO 27001, clause by clause, through a 4-step ISMS check before the LLM gives its verdict.",
      "Its verdicts matched on 51 of 52 checks (98%), at about 60 seconds per audit, using Gemini and Grok on Vertex AI.",
      "Every company, document and verdict in the demo is synthetic.",
    ],
    demo: "audit-pipeline",
  },
  {
    slug: "yesturnkey",
    org: "YesTurnkey Technology",
    role: "Electronics & Network Engineering Intern",
    where: "Taipei, TW",
    when: "May 2026 – Jul 2026",
    summary: "Remote peer-to-peer webcam streaming from a Raspberry Pi 5.",
    chips: ["WebRTC", "STUN/TURN", "Raspberry Pi 5", "Ubuntu VM"],
    big: { value: "P2P", unit: "video from a Pi 5" },
    hook: "Live video from a Raspberry Pi, straight through the firewall.",
    details: [
      "A Raspberry Pi 5 streams its webcam to a remote browser peer to peer over WebRTC.",
      "STUN finds a direct path through the NAT. When there isn't one, the stream falls back to a TURN relay.",
    ],
    demo: "connection-path",
  },
  {
    slug: "terra-labs",
    org: "Terra Labs USC",
    role: "Electrical Engineer / Programmer",
    where: "Los Angeles, CA",
    when: "Sep 2026 – Present",
    summary: "Power and control for Tether, a 7-DOF robotic arm.",
    chips: ["7-DOF", "ESP32 master/slave", "3 motor groups", "ROS2"],
    big: { value: "7", unit: "DOF" },
    hook: "Power and control for a seven-joint robot arm.",
    details: [
      "Tether is a 7-DOF robotic arm built at Terra Labs USC. I work on its power and control.",
      "An ESP32 master/slave setup drives the arm's 3 motor groups, with ROS2 on top.",
      "The arm in the demo is a stand-in, not the real model.",
    ],
    demo: "tether-arm",
    link: { label: "uscterralabs.com", href: "https://uscterralabs.com" },
  },
  {
    slug: "chang-gung",
    org: "Chang Gung University Intelligent Control Lab",
    role: "Project Founder / Researcher",
    where: "Taoyuan City, TW",
    when: "Aug 2024 – Jun 2025",
    summary: "Gesture-recognition research and an ML Sudoku solver on an ESP32-CAM.",
    chips: ["85% accuracy", "Poster at 20th Formosa Seminar", "Solver < 0.2 s"],
    big: { value: "85%", unit: "accuracy" },
    hook: "Gestures read from video. Sudoku read by a microcontroller.",
    details: [
      "I founded two projects in the lab.",
      "A MobileNet + GRU model reads hand gestures from video at 85% accuracy (baseline 66%), presented as a poster at the 20th Formosa Plastics Applied Technology Seminar.",
      "An ESP32-CAM reads Sudoku digits on device, and my solver finishes in under 0.2 s.",
    ],
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
