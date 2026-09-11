import type { ResumeDTO, ScanDTO } from "../api";

interface MockResume extends ResumeDTO {
  raw_text: string;
  seed_created_at: string;
}

interface MockScan extends ScanDTO {
  seed_created_at: string;
}

const SEED_CREATED_AT = "2026-09-11T12:00:00Z";

const MOCK_RESUMES: MockResume[] = [
  {
    id: 1,
    file_name: "Resume_SWE_v3.pdf",
    created_at: "2026-09-10T14:30:00Z",
    seed_created_at: SEED_CREATED_AT,
    raw_text:
      "Alex Chen | Senior Software Engineer | 8+ yrs exp\n" +
      "Tech: React, Node.js, TypeScript, PostgreSQL, AWS\n" +
      "Led team of 5, built microservices serving 2M+ users",
    latest_scan: { id: 1, overall_score: 85, created_at: "2026-09-10T14:30:00Z" },
  },
  {
    id: 2,
    file_name: "Resume_2026.pdf",
    created_at: "2026-09-05T09:15:00Z",
    seed_created_at: SEED_CREATED_AT,
    raw_text:
      "Jordan Smith | Full Stack Developer | 5+ yrs exp\n" +
      "Skills: JavaScript, React, Python, Docker, CI/CD\n" +
      "Shipped e-commerce platform processing $5M/yr",
    latest_scan: { id: 2, overall_score: 78, created_at: "2026-09-05T09:15:00Z" },
  },
  {
    id: 3,
    file_name: "Resume_Frontend_Lead.pdf",
    created_at: "2026-08-28T16:45:00Z",
    seed_created_at: SEED_CREATED_AT,
    raw_text:
      "Taylor Rivera | Frontend Engineer | 4+ yrs exp\n" +
      "UI/UX focused, built design systems in Figma & React\n" +
      "Optimized web app LCP from 4.2s to 1.1s",
    latest_scan: { id: 3, overall_score: 71, created_at: "2026-08-28T16:45:00Z" },
  },
  {
    id: 4,
    file_name: "Resume_Backend_v2.pdf",
    created_at: "2026-08-20T11:20:00Z",
    seed_created_at: SEED_CREATED_AT,
    raw_text:
      "Morgan Lee | Backend Developer | 3+ yrs exp\n" +
      "REST & GraphQL APIs, Redis caching, Kafka events\n" +
      "Reduced API latency by 60% with query optimization",
    latest_scan: { id: 4, overall_score: 68, created_at: "2026-08-20T11:20:00Z" },
  },
  {
    id: 5,
    file_name: "Resume_General_v1.pdf",
    created_at: "2026-08-12T08:00:00Z",
    seed_created_at: SEED_CREATED_AT,
    raw_text:
      "Casey Wilson | Software Developer | 2+ yrs exp\n" +
      "Generalist, open source contributor, quick learner\n" +
      "Built internal tools saving 20 hrs/week for ops team",
    latest_scan: { id: 5, overall_score: 62, created_at: "2026-08-12T08:00:00Z" },
  },
];

const MOCK_SCANS: MockScan[] = [
  {
    id: 1,
    resume_id: 1,
    overall_score: 85,
    missing_keywords: ["Kubernetes", "Terraform", "GraphQL"],
    suggested_edits: [
      "Add Kubernetes experience if you have deployed or managed clusters",
      "Quantify the scale of microservices: specify throughput, request volume, or infra cost savings",
      "Include a bullet on infrastructure-as-code (Terraform/CDK) tooling",
    ],
    created_at: "2026-09-10T14:30:00Z",
    seed_created_at: SEED_CREATED_AT,
  },
  {
    id: 2,
    resume_id: 2,
    overall_score: 78,
    missing_keywords: ["TypeScript", "AWS", "Kubernetes", "Microservices"],
    suggested_edits: [
      "Replace 'JavaScript' with 'TypeScript' and note TS projects you have shipped",
      "Specify AWS services used (EC2, S3, Lambda, RDS)",
      "Break down the $5M/yr platform: order volume, team size, stack specifics",
      "Add Kubernetes or container orchestration experience if applicable",
    ],
    created_at: "2026-09-05T09:15:00Z",
    seed_created_at: SEED_CREATED_AT,
  },
  {
    id: 3,
    resume_id: 3,
    overall_score: 71,
    missing_keywords: ["TypeScript", "Next.js", "Testing Library", "Jest", "Accessibility"],
    suggested_edits: [
      "Highlight TypeScript adoption and migration projects",
      "Mention Next.js SSR/ISR features and performance wins",
      "Add unit/integration testing stack (Jest, React Testing Library, Vitest)",
      "Include accessibility compliance (WCAG 2.1 AA, screen reader testing)",
    ],
    created_at: "2026-08-28T16:45:00Z",
    seed_created_at: SEED_CREATED_AT,
  },
  {
    id: 4,
    resume_id: 4,
    overall_score: 68,
    missing_keywords: ["Docker", "AWS", "PostgreSQL", "System Design", "CI/CD"],
    suggested_edits: [
      "Explicitly list Docker containerization & image optimization work",
      "Add AWS/GCP cloud services: VPC, load balancers, managed DBs",
      "Mention PostgreSQL query tuning, indexing strategies, or partitioned tables",
      "Document CI/CD pipelines (GitHub Actions, CircleCI) and deployment frequency",
    ],
    created_at: "2026-08-20T11:20:00Z",
    seed_created_at: SEED_CREATED_AT,
  },
  {
    id: 5,
    resume_id: 5,
    overall_score: 62,
    missing_keywords: [
      "React",
      "TypeScript",
      "Docker",
      "AWS",
      "PostgreSQL",
      "REST API",
      "Agile",
    ],
    suggested_edits: [
      "Add specific programming languages and frameworks with years of experience",
      "Include modern frontend stack (React, TypeScript, bundlers, component libs)",
      "Describe backend experience: databases, REST/GraphQL APIs, auth patterns",
      "Quantify every project bullet: users, cost/time savings, performance gains",
      "Add education, certifications, and notable open source links",
      "Mention agile ceremonies, sprint cadence, and cross-team collaboration",
    ],
    created_at: "2026-08-12T08:00:00Z",
    seed_created_at: SEED_CREATED_AT,
  },
];

export const mockHistoryStore = {
  listResumes(): ResumeDTO[] {
    return MOCK_RESUMES.map(
      ({ id, file_name, created_at, latest_scan }): ResumeDTO => ({
        id,
        file_name,
        created_at,
        latest_scan,
      }),
    );
  },

  listScans(resumeId?: number): ScanDTO[] {
    const filtered =
      resumeId === undefined
        ? MOCK_SCANS
        : MOCK_SCANS.filter((s) => s.resume_id === resumeId);
    return filtered.map(
      ({
        id,
        resume_id,
        overall_score,
        missing_keywords,
        suggested_edits,
        created_at,
      }): ScanDTO => ({
        id,
        resume_id,
        overall_score,
        missing_keywords,
        suggested_edits,
        created_at,
      }),
    );
  },

  getScanById(id: number): ScanDTO | undefined {
    const scan = MOCK_SCANS.find((s) => s.id === id);
    if (!scan) return undefined;
    const {
      resume_id,
      overall_score,
      missing_keywords,
      suggested_edits,
      created_at,
    } = scan;
    return {
      id,
      resume_id,
      overall_score,
      missing_keywords,
      suggested_edits,
      created_at,
    };
  },
};
