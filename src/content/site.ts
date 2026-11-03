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
  // Home-page intro, first person. Every claim here is backed by an entry in `experience` below.
  intro:
    "I study electrical and computer engineering at USC, and I like the point where a model has to meet real hardware. Lately that has meant redesigning a sweat sensor so it stops leaking, wiring power and control for a seven-joint robot arm, and starting an event-bus company whose first trip sold out in three days.",
  // Professional headshot for the hero, served from /public. Until it is set, the hero shows a placeholder frame.
  headshot: null as { src: string; alt: string } | null,
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
  /** Process photos for the detail page's build log, served from /public/media/<slug>/. */
  media?: Media[];
  /** The photo that leads this project's spread on the home page. */
  cover?: Media;
};

// Slides render as an overlapping deck on the work page instead of the photo row.
// `focus` is a CSS object-position for crops (e.g. "top" to keep the first lines of a notebook page);
// `ratio` overrides the home page's 3:2 crop for images that must be shown whole.
export type Media = { src: string; alt: string; caption: string; slide?: true; focus?: string; ratio?: string };

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
    cover: { src: "/media/khan-lab/spiral-design.webp", alt: "CAD drawing of the spiral sweat sensor: bottom electrode traces in gold following a continuous blue microfluidic spiral, with a 10 mm scale bar", caption: "My spiral design, rendered from the CAD file: electrodes in gold, the microfluidic channel in blue." },
    media: [
      { src: "/media/khan-lab/channel-sketch.webp", alt: "Whiteboard sketch of a spiral microfluidic channel with 86 µm and 170 µm widths and 40–50 µL volumes", caption: "Channel widths and volumes, worked out on the whiteboard." },
      { src: "/media/khan-lab/materials-sketch.webp", alt: "Sketch of PVB, PDMS and Parylene C layers over the channel outline", caption: "Choosing the layer stack: PVB, PDMS, Parylene C." },
      { src: "/media/khan-lab/layout-sketch.webp", alt: "Hand sketch of the electrode ring and channel inlets", caption: "Electrode ring and inlets, first pass." },
      { src: "/media/khan-lab/tubing-sketch.webp", alt: "Notebook sketch with tubing laid over the channel plan for a flow test", caption: "Tubing routed for the first flow test." },
      { src: "/media/khan-lab/mask-print.webp", alt: "Printed microfluidic mask designs on transparency film", caption: "Masks printed for laser cutting." },
      { src: "/media/khan-lab/stencil-cutouts.webp", alt: "Small cut-out stencils of the channel design", caption: "Cut stencils, ready to bond." },
    ],
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
    cover: { src: "/media/hubl/simulator.webp", alt: "Hubl's bus simulator 14 minutes into a run on an OpenStreetMap map of LA: four drop-off hubs, riders waiting at virtual stops and buses on road-following routes", caption: "The routing simulator mid-run: riders grouped into stops, buses routed along real LA streets to the hubs. Map © OpenStreetMap contributors." },
    media: [
      { src: "/media/hubl/team.webp", alt: "The five-person BusIn' team on stage with the $1,000 check and finalist certificates", caption: "The team, right after the win." },
      { src: "/media/hubl/first-place.webp", alt: "Innovate x LA 2025 Design Day and Buildathon first-place certificate", caption: "1st place, Innovate x LA Buildathon." },
      { src: "/media/hubl/prize-check.webp", alt: "Oversized $1,000 prize check made out to BusIn'", caption: "$1,000 prize for the BusIn' pitch." },
      { src: "/media/hubl/user-flow.webp", alt: "Handwritten four-step booking flow: view trips, pick time, reserve, invite friends", caption: "The four-step booking flow, on paper first." },
    ],
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
    cover: { src: "/media/iii/slide-tool-overview-en.webp", alt: "Slide, translated to English: the tool in four stages, LLM generates company data, evidence extraction and merging, ISMS four-step review, LLM cross-check and compliance verdict", caption: "The whole tool on one slide, translated from my Chinese deck.", ratio: "1400 / 788" },
    media: [
      { src: "/media/iii/phase-plan.webp", alt: "Notebook page planning the auditor in three phases with a list of key risks", caption: "Phase plan and risk list, written before any code." },
      { src: "/media/iii/slide-pipeline.webp", alt: "Slide: analysis pipeline from reading evidence to JSON and Markdown output, run on Gemini 3.5 Flash and Grok 4.2", caption: "Evidence in, verdict out as JSON and Markdown.", slide: true },
      { src: "/media/iii/slide-isms-review.webp", alt: "Slide: four ISMS checkpoints, mechanism, execution, continuity and review, mapped to non-, partial and full compliance", caption: "Four checkpoints decide the compliance level.", slide: true },
      { src: "/media/iii/slide-llm-crosscheck.webp", alt: "Slide: Gemini and Grok each judge three times and the median verdict is kept", caption: "Two models, three runs each, median verdict.", slide: true },
    ],
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
    cover: { src: "/media/yesturnkey/desk.webp", alt: "Internship workstation with a monitor, laptop, Raspberry Pi and network cabling", caption: "The bench: Pi, laptop and the network it had to get through." },
    media: [
      { src: "/media/yesturnkey/desk.webp", alt: "Internship workstation with a monitor, laptop, Raspberry Pi and network cabling", caption: "The bench: Pi, laptop and the network it had to get through." },
    ],
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
    cover: { src: "/media/terra-labs/actuator-bench.webp", alt: "Joint actuators wired to a CAN bus on a bench supply at 24 V", caption: "Joint actuators on the CAN bus at 24 V." },
    media: [
      { src: "/media/terra-labs/arm-sketch.webp", alt: "Whiteboard sketch of the robot arm's joints, motors and battery placement", caption: "Whiteboard layout of joints, motors and battery." },
      { src: "/media/terra-labs/actuator-bench.webp", alt: "Joint actuators wired to a CAN bus on a bench supply at 24 V", caption: "Actuators on the CAN bus at 24 V." },
      { src: "/media/terra-labs/battery-charge.webp", alt: "6S LiPo pack on a balance charger", caption: "Balance-charging the 6S pack." },
    ],
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
    cover: { src: "/media/chang-gung/prototype.webp", alt: "Three views of the Sudoku prototype: an ESP32-CAM in a LEGO housing standing over handwritten digits on an iPad", caption: "The prototype: an ESP32-CAM in a LEGO housing, reading digits off a backlit iPad.", ratio: "1668 / 720" },
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
