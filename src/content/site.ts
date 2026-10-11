// Single source of truth for profile content. Open items are tracked in TODO.md.

export const site = {
  name: "Hansi Lee",
  legalName: "Tz-Jing Lee",
  role: "Electrical & Computer Engineering · USC Viterbi",
  graduation: "Expected 2028",
  location: "Los Angeles, CA",
  tagline:
    "I build applied AI systems end to end: computer-vision models, LLM pipelines, and the hardware and web stacks they run on.",
  seeking: "Seeking Summer 2027 internships in ML / AI research and applied ML engineering.",
  about: [
    "I'm an Electrical and Computer Engineering student at the USC Viterbi School of Engineering (3.84 GPA, Dean's List) and a CURVE undergraduate research fellow in the Khan Lab, working on wearable sweat sensors for stress classification.",
    "My ML work started in computer vision: a MobileNet + GRU model for dynamic hand-gesture recognition, presented as a poster at the 20th Formosa Plastics Applied Technology Seminar, and an ESP32-CAM Sudoku solver that runs a digit classifier on a microcontroller. Since then I've built an LLM-driven ISO 27001 compliance auditor at Taiwan's Institute for Information Industry, and I co-founded Hubl, a demand-responsive transit startup that won a USC Buildathon.",
    "I like problems where the model has to meet real hardware, real data and real users.",
  ],
  links: {
    email: "hansilee@usc.edu" as string | null,
    linkedin: "https://www.linkedin.com/in/tzjinglee" as string | null,
    github: "https://github.com/gellosparkles" as string | null,
    resume: null as string | null,
  },
};

export const education = [
  {
    school: "University of Southern California, Viterbi School of Engineering",
    degree: "B.S. Electrical and Computer Engineering · GPA 3.84 · Dean's List",
    when: "Aug 2025 – Expected 2028",
  },
  {
    school: "Kang Chiao International School, Linkou Campus",
    degree: "High school, Taiwan",
    when: null as string | null,
  },
];

export type Experience = {
  org: string;
  role: string;
  where: string;
  when: string;
  points: string[];
  tags: string[];
};

export const experience: Experience[] = [
  {
    org: "Institute for Information Industry (III)",
    role: "Cybersecurity Intern",
    where: "Taipei, TW",
    when: "Jun – Aug 2026",
    points: [
      "Built an LLM-assisted ISO 27001 clause-compliance tool. It generates synthetic company documents with Google Vertex AI, parses the PDFs, and runs a four-step ISMS-based LLM analysis engine that outputs audit reports in JSON and Markdown.",
      "Developed the web app and UI that host the pipeline as a product prototype. Presented weekly to mentors and wrote the deployment documentation.",
    ],
    tags: ["LLMs", "Vertex AI", "PDF parsing", "ISO 27001", "Web app"],
  },
  {
    org: "YesTurnkey Technology Inc.",
    role: "Electronics & Network Engineering Intern",
    where: "Taipei, TW",
    when: "May – Jul 2026",
    points: [
      "Set up remote peer-to-peer webcam streaming on a Raspberry Pi 5 over WebRTC for multiple browser users, with STUN and TURN servers to guarantee remote connectivity through NAT.",
      "Configured port forwarding and an Ubuntu VM on a Windows server, automated Pi peer reconnection for constant availability, and migrated users to the company domain.",
    ],
    tags: ["WebRTC", "STUN/TURN", "Raspberry Pi 5", "Linux", "Networking"],
  },
  {
    org: "Khan Lab, USC",
    role: "CURVE Undergraduate Researcher",
    where: "Los Angeles, CA",
    when: "Jan 2026 – Present",
    points: [
      "Designed an original spiral 2D electrode layout and laser-cut microfluidic components for sweat-collection devices and lithium sensors, working toward physical and mental stress classification with a PhD mentor.",
      "Ran microfluidic-pump experiments with artificial sweat samples, analyzed lithium-sensing data, designed a multi-electrode hybrid board layout, and helped design a hardware-based stress-detection system.",
    ],
    tags: ["Wearable sensors", "Microfluidics", "PCB layout", "Data analysis"],
  },
  {
    org: "Hubl LLC",
    role: "Co-founder · Developer · Presenter",
    where: "Los Angeles, CA",
    when: "Nov 2025 – Present",
    points: [
      "Startup building demand-responsive bus transit. Prototyped hub-generation and path-finding algorithms on the Google Maps API for pickup simulations across metro LA, plus a frontend visualization for planning and for training the routing algorithm.",
      "Built a preliminary ticketing web app and the market plan and pitch. Won 1st place at the USC Buildathon and 2nd at the Games Week Hackathon, and is backed by the USC Marshall Greif Incubator.",
    ],
    tags: ["Routing algorithms", "Google Maps API", "Full-stack", "Pitching"],
  },
  {
    org: "Chang Gung University, Intelligent Control Lab",
    role: "Project Founder / Researcher",
    where: "Taoyuan, TW",
    when: "Aug 2024 – Jun 2025",
    points: [
      "Researched ML architectures for dynamic hand-gesture recognition with Prof. Yeong-Hua Chang. Co-wrote the paper and presented the poster at the 20th Formosa Plastics Applied Technology Seminar.",
      "Founded the ESP32-CAM Sudoku-solver project: an original solving algorithm (under 0.2 s per solve), a handwritten-digit deep-learning model, a physical prototype and an engineering notebook.",
    ],
    tags: ["Computer vision", "Keras", "ESP32", "Research"],
  },
];

export const publications = [
  {
    title: "Regarding a MobileNet and GRU-based Dynamic Hand-Gesture Recognition Model",
    authors: ["Peng-Ru Hou", "Tz-Jing Lee", "Yeong-Hua Chang"],
    me: "Tz-Jing Lee",
    venue: "Poster, 20th Formosa Plastics Corp. Applied Technology Seminar",
    highlight: "84.38% test accuracy vs. 65.62% for an RNN + GRU baseline",
    href: "/projects/gesture-recognition",
    paperPdf: null as string | null,
  },
];

export const honors = [
  {
    title: "CURVE Undergraduate Research Fellow",
    org: "Center for Undergraduate Research in Viterbi Engineering, USC",
    when: "Fall 2026 – Present",
    detail: "Research fellowship funded by the Puckett Research Fund, in the Khan Lab.",
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

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Machine learning & AI",
    items: [
      "CNNs & transfer learning",
      "RNN / GRU sequence models",
      "LLM pipelines & agentic AI",
      "Hyperparameter search (Optuna)",
      "Model evaluation (P/R/F1)",
    ],
  },
  {
    group: "Languages & tools",
    items: ["Python", "C++", "TypeScript", "MATLAB", "TensorFlow / Keras", "Google Vertex AI", "Edge Impulse"],
  },
  {
    group: "Hardware & systems",
    items: ["ESP32 / Arduino", "Raspberry Pi", "Linux", "WebRTC, STUN/TURN", "PCB & electrode layout"],
  },
  {
    group: "Web",
    items: ["React / Next.js", "three.js", "Google Maps API", "Full-stack prototyping"],
  },
];

export const interests = ["AI development", "Cybersecurity", "Robotics", "Competitive programming", "Chess", "Poker", "Pool", "Fitness"];
