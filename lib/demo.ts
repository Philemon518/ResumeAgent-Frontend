import type { EvaluationResult, RoleSummary } from "./types";

function demoRole(
  name: string,
  position_title: string,
  department: string,
  categoryCount: number,
  description: string,
): RoleSummary {
  return {
    name,
    position_title,
    department,
    description,
    source: "community",
    categories: Array.from({ length: categoryCount }, (_, index) => ({
      key: `category_${index}`,
      label: `Category ${index + 1}`,
      max: 20,
      icon: "•",
    })),
    bonus_max: 15,
    max_final_score: 115,
  };
}

/** Rubric catalog shape used by `/demo/rubrics`, mirroring `GET /roles`. */
export const DEMO_ROLES: RoleSummary[] = [
  demoRole(
    "software_engineering_intern",
    "Software Engineering Intern",
    "Engineering",
    4,
    "HackerRank hiring-agent intern rubric: open source, self-projects, production experience, and technical skills.",
  ),
  demoRole(
    "senior_full_stack_engineer",
    "Senior / Full-Stack Software Engineer",
    "Engineering",
    6,
    "Experienced software engineers: production systems, architecture, leadership, and technical breadth.",
  ),
  demoRole(
    "backend_engineer",
    "Backend Engineer",
    "Engineering",
    5,
    "Services, data stores, APIs, and production reliability for backend-focused engineers.",
  ),
  demoRole(
    "frontend_engineer",
    "Frontend Engineer",
    "Engineering",
    5,
    "User interfaces, accessibility, performance, and product-facing engineering.",
  ),
  demoRole(
    "devops_sre",
    "DevOps / Site Reliability Engineer",
    "Engineering",
    5,
    "Infrastructure, delivery, observability, and reliability engineering.",
  ),
  demoRole(
    "engineering_manager",
    "Engineering Manager",
    "Engineering",
    5,
    "Team leadership, delivery, hiring, and technical judgment for engineering managers.",
  ),
  demoRole(
    "automotive_engineer_intern",
    "Automotive Engineer Intern",
    "Engineering",
    4,
    "Automotive intern: vehicle design and analysis, testing and validation, manufacturing, and engineering tools.",
  ),
  demoRole(
    "machine_learning_engineer",
    "Machine Learning Engineer",
    "Data & ML",
    5,
    "Applied ML: problem framing, models in production, evaluation, and data quality.",
  ),
  demoRole(
    "data_analyst",
    "Data Analyst",
    "Data & ML",
    5,
    "Analysis quality, metrics, stakeholder communication, and decision impact.",
  ),
  demoRole(
    "product_manager",
    "Product Manager",
    "Product",
    5,
    "Problem discovery, product sense, delivery, and measured outcomes for PMs.",
  ),
  demoRole(
    "product_designer",
    "Product Designer",
    "Design",
    5,
    "Product design: research, craft, systems, and shipped UX outcomes.",
  ),
  demoRole(
    "general_professional",
    "General professional",
    "General",
    6,
    "Role-agnostic screening: experience, impact, skills, and communication when no specialist rubric fits.",
  ),
  demoRole(
    "museum_curator_intern",
    "Museum Curator Intern",
    "Art",
    4,
    "Museum curator intern: collections research, exhibitions, and professional museum practice.",
  ),
  demoRole(
    "investment_banking_intern",
    "Investment Banking Intern",
    "Economics",
    4,
    "Investment banking intern: finance preparation, commercial judgment, relevant experience, and execution.",
  ),
  demoRole(
    "consultant_intern",
    "Consultant Intern",
    "Economics",
    4,
    "Consultant intern: problem solving, business judgment, leadership, and client-ready execution.",
  ),
  demoRole(
    "government_economist_intern",
    "Economic Policy Intern",
    "Economics",
    4,
    "Economic policy intern: economics and policy analysis, quantitative methods, research judgment, and communication.",
  ),
  demoRole(
    "accounting_intern",
    "Accounting Intern",
    "Economics",
    4,
    "Accounting intern: financial reporting, practical accounting, systems accuracy, and professionalism.",
  ),
  demoRole(
    "legislative_assistant_intern",
    "Legislative Assistant Intern",
    "Politics",
    4,
    "Legislative intern: policy research, writing, legislative process, and office execution.",
  ),
];

/**
 * Fictional result used by `/demo` for screenshots and UI work without a
 * running backend or a real CV. Not shipped in any evaluation path.
 */
export const DEMO_RESULT: EvaluationResult = {
  candidate_name: "Alex Rivera",
  model: "gemma4:31b-mlx",
  runtime: "local",
  github_enriched: true,
  resume: null,
  github: null,
  evaluations: [
    {
      role: "senior_full_stack_engineer",
      position_title: "Senior / Full-Stack Software Engineer",
      department: "Engineering",
      total_score: 78,
      total_max: 100,
      bonus_points: 8,
      deductions: 0,
      bonus_breakdown:
        "Maintains a 4k-star open-source CLI with an active release cadence.",
      deduction_reasons: "",
      overall: 86,
      max_final_score: 115,
      categories: [
        {
          key: "production_systems",
          label: "Production Systems",
          icon: "🛠",
          score: 25,
          max: 30,
          evidence:
            "Founding engineer at a Series A analytics company; scaled ingestion from pre-seed to millions of daily events while holding p95 latency under 200ms and 99.9% uptime.",
          next_bracket:
            "Add cost, capacity, and failure-mode evidence to reach the top band.",
        },
        {
          key: "architecture",
          label: "Architecture & Design",
          icon: "🏗",
          score: 16,
          max: 20,
          evidence:
            "Led the migration from a monolith to five owned services, with a written RFC covering the queue-versus-stream trade-off and a documented rollback path.",
          next_bracket:
            "Show how the new services changed latency, cost, or on-call load.",
        },
        {
          key: "leadership",
          label: "Leadership & Impact",
          icon: "🌟",
          score: 11,
          max: 15,
          evidence:
            "Mentored four engineers, two of whom were promoted; introduced the design-review process now used across the platform group.",
          next_bracket:
            "Describe hiring, staffing, or org-level decisions you owned.",
        },
        {
          key: "open_source",
          label: "Open Source",
          icon: "⚡",
          score: 13,
          max: 15,
          evidence:
            "Maintainer of a widely used TypeScript CLI (4.1k stars) and merged contributor to two infrastructure projects, including a scheduler fix.",
          next_bracket:
            "Already near the top; add release cadence or downstream adopters.",
        },
        {
          key: "self_projects",
          label: "Personal Projects",
          icon: "🚀",
          score: 7,
          max: 10,
          evidence:
            "Self-hosted observability stack with published benchmarks; documented, versioned, and used by others outside the author.",
          next_bracket:
            "Name users, issues, or PRs that show the project is maintained.",
        },
        {
          key: "breadth",
          label: "Technical Breadth",
          icon: "🧩",
          score: 6,
          max: 10,
          evidence:
            "Strong backend and infrastructure depth. Front-end work is present but mostly internal tooling, with little evidence of user-facing UI ownership.",
          next_bracket:
            "Describe a user-facing UI you shipped end to end.",
        },
      ],
      key_strengths: [
        "Quantified production outcomes: event volume, latency, and uptime are all stated with numbers.",
        "Architecture decisions are documented with trade-offs, not just tool names.",
        "Open-source maintainership on a project with real external adoption.",
      ],
      areas_for_improvement: [
        "Front-end ownership is thin for a full-stack title — no user-facing surface is described end to end.",
        "Cost and capacity work is absent; scaling is described only in throughput terms.",
      ],
      conclusion:
        "A production-minded engineer with documented systems work and real open-source adoption, stronger on backend than user-facing product surfaces.",
    },
    {
      role: "backend_engineer",
      position_title: "Backend Engineer",
      department: "Engineering",
      total_score: 72,
      total_max: 100,
      bonus_points: 5,
      deductions: 2,
      bonus_breakdown: "Public write-up of the ingestion redesign.",
      deduction_reasons:
        "Two listed technologies appear only as keywords with no described usage.",
      overall: 75,
      max_final_score: 115,
      categories: [
        {
          key: "systems_apis",
          label: "Systems & APIs",
          icon: "🔌",
          score: 24,
          max: 30,
          evidence:
            "Owned three public APIs including a versioned partner integration; contracts and consumer impact are described.",
          next_bracket:
            "Add measured latency or error-budget outcomes for those APIs.",
        },
        {
          key: "data_storage",
          label: "Data & Storage",
          icon: "🗄",
          score: 15,
          max: 20,
          evidence:
            "Designed the event schema and a partitioning strategy; migrations are mentioned with a stated backfill approach.",
          next_bracket:
            "Quantify data volume, consistency work, or query performance.",
        },
        {
          key: "reliability",
          label: "Reliability & Operations",
          icon: "🛡",
          score: 17,
          max: 20,
          evidence:
            "On-call rotation, defined SLOs, and two postmortems referenced with resulting fixes.",
          next_bracket:
            "Already strong; add MTTR or SLO-breach history with outcomes.",
        },
        {
          key: "quality",
          label: "Quality & Testing",
          icon: "✅",
          score: 9,
          max: 15,
          evidence:
            "Integration tests and CI gates are mentioned; no load or contract testing is described.",
          next_bracket:
            "Describe load, contract, or chaos testing you actually ran.",
        },
        {
          key: "collaboration",
          label: "Collaboration",
          icon: "🤝",
          score: 12,
          max: 15,
          evidence:
            "Cross-functional work with product and data teams, with a shipped outcome attributed to the collaboration.",
          next_bracket:
            "Name the decision you owned and the team that adopted it.",
        },
      ],
      key_strengths: [
        "Reliability practice is concrete: SLOs, on-call, and postmortems with follow-through.",
        "API ownership is described at contract level, not as ticket work.",
      ],
      areas_for_improvement: [
        "Testing depth stops at integration; no evidence of load or contract testing for the partner API.",
      ],
      conclusion:
        "A backend engineer with clear API ownership and reliability practice, whose testing story still needs load and contract evidence.",
    },
  ],
};
