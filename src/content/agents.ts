// AI agent workflow projects and the in-progress hardware build.
// Facts come from Internship_find/resume-context.md (agent projects) and
// alignment/Hardware_AI_Security_Project/plan.md (Mini Sentry). Mini Sentry is planned work: never state results for it.

export type AgentProject = {
  title: string;
  stack: string;
  when: string;
  big: { value: string; unit: string };
  points: string[];
  chips: string[];
};

export const agentWorkflows: AgentProject[] = [
  {
    title: "Alignment: Personal AI Agent System",
    stack: "Claude Code and Codex",
    when: "Sep 2026 – Present",
    big: { value: "10", unit: "memory files" },
    points: [
      "One shared rules file drives both Claude Code and Codex, with 6 custom skills that break tasks into energy-tagged chunks, rank the next task, schedule work, and run check-ins.",
      "The agents keep persistent memory in 10 Markdown files (goals, schedule, knowledge map, log), synced to my phone through GitHub.",
      "A Python tool syncs that memory with a Google Doc task list through the Docs API.",
    ],
    chips: ["Claude Code", "Codex", "6 skills", "Google Docs API", "Python"],
  },
  {
    title: "Memory-Driven Project Workflow",
    stack: "Claude Code skills",
    when: "Oct 2026 – Present",
    big: { value: "17", unit: "merged PRs" },
    points: [
      "6 Claude Code skills (build, work, study, align, big-picture, onramp) read the agents' memory of my skill levels, schedule, and learning rules to plan projects, run build sessions, and log progress.",
      "I used it to direct Claude Code through a spec, tickets, and 17 merged PRs for a job-search agent (TypeScript, SQLite, local web dashboard) that reads job-board APIs and scores each opening with an LLM against 2 resumes.",
    ],
    chips: ["Spec → tickets → PRs", "TypeScript", "SQLite", "LLM scoring"],
  },
];

export const ongoing = {
  title: "Mini Sentry: a hardware kill switch for AI agents",
  status: "Prep now · build Dec 14, 2026 – Jan 10, 2027",
  pitch:
    "An AI agent runs inside a sandbox I write, in a VM. Its only path to the internet goes through a Raspberry Pi that checks every connection against a policy. An FPGA watches the Pi and cuts the link in hardware when anything goes wrong, so no software can override it.",
  why: "It serves my direction: using hardware as a way to secure and regulate AI. It is modeled on NVIDIA's OpenShell and Sentry agent-security stack, cut down to a bench-top build.",
  layers: [
    { name: "Sandbox", where: "VM", what: "A C program (jail) that runs the agent with no root, no network by default, file access limited by Landlock, and risky system calls blocked by seccomp. It fails closed: if any control is missing, the agent never starts." },
    { name: "Policy gate", where: "Raspberry Pi", what: "nftables forces all traffic through Envoy, which asks OPA whether each connection is allowed, based on who the agent is (a client certificate) and where it is going." },
    { name: "Kill switch", where: "FPGA", what: "A Verilog watchdog expects a heartbeat from the Pi. A missed beat or a button press cuts the link, and only a physical reset restores it. The link's resting state is cut, so a dead or unprogrammed FPGA also fails closed." },
  ],
  weeks: [
    { n: "W1", goal: "Sandbox in C", done: "10 escape attempts, all blocked · UART echo on the FPGA" },
    { n: "W2", goal: "Red-team OpenShell · FPGA watchdog", done: "Findings table · watchdog passes its testbench and trips on the board" },
    { n: "W3", goal: "Pi + FPGA together", done: "Agent reaches only allowed APIs · killing Envoy or pulling FPGA power cuts the link" },
    { n: "W4", goal: "Measure, attack, write up", done: "Added latency (p50/p99), kill time, attack results · 4–6 page writeup" },
  ],
  measures: ["Latency the Pi adds (p50 / p99)", "Kill time: FPGA cycles + last packet out", "Attacks: DNS tunnelling, leaks through allowed domains, forged heartbeats"],
  prep: ["FPGA basics in Verilog (HDLBits)", "Linux namespaces and seccomp", "Envoy + OPA policies", "Choosing the FPGA board"],
  future: [
    { title: "Challenge-response heartbeat", text: "The FPGA sends a random nonce and the Pi answers with an HMAC, so a compromised Pi can't replay old heartbeats." },
    { title: "Network filter in hardware", text: "On a board with Ethernet, match each packet's IP and port against an allowlist held in FPGA memory. Sized as a spring project." },
    { title: "Hardware activation probe", text: "Copy a model's internal activations to a separate device that runs interpretability probes, logs flagged features, and can stop inference. Same idea as Mini Sentry: watch what the model thinks, not just what it does." },
  ],
};
