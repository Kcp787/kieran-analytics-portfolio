"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  Github,
  Linkedin,
  Mail,
  FileText,
  MapPin,
  Briefcase,
  Code2,
  Database,
  LayoutDashboard,
  Table2,
  Sparkles,
  ShieldCheck,
  Search,
  ArrowRight,
  Download,
} from "lucide-react";

// -----------------------------
// CONFIG (edit these)
// -----------------------------
const PROFILE = {
  name: "Kieran Wong",
  title: "Remote Data & Analytics Contractor",
  tagline:
    "Forecasting • Automation • Decision Support | Python • SQL • Tableau | UK-based (tax) | Fully Remote",
  location: "Prestwich, England (Remote)",
  email: "Kieran.Wong336@gmail.com",
  linkedin: "https://www.linkedin.com/in/kieranw7799",
  github: "https://github.com/Kcp787", // optional
  cvUrl: "https://github.com/Kcp787/UU_Personal/blob/76a801fd5ae39fc7f0bfcd3ac25e3c5086402f91/Kieran_Wong_Remote_Analytics_Contractor.pdf", // replace with a hosted PDF link (Google Drive public link, GitHub raw, etc.)
};

// -----------------------------
// Sample data for interactive demos
// -----------------------------
const timeseries = [
  { month: "Jan", demand: 102, supply: 110 },
  { month: "Feb", demand: 108, supply: 112 },
  { month: "Mar", demand: 111, supply: 113 },
  { month: "Apr", demand: 118, supply: 116 },
  { month: "May", demand: 125, supply: 120 },
  { month: "Jun", demand: 131, supply: 124 },
  { month: "Jul", demand: 140, supply: 128 },
  { month: "Aug", demand: 136, supply: 127 },
  { month: "Sep", demand: 129, supply: 125 },
  { month: "Oct", demand: 121, supply: 122 },
  { month: "Nov", demand: 112, supply: 118 },
  { month: "Dec", demand: 106, supply: 114 },
];

const kpiBars = [
  { name: "Data Quality", value: 92 },
  { name: "Pipeline Uptime", value: 99 },
  { name: "Dashboard Adoption", value: 78 },
  { name: "Reporting Speed", value: 85 },
];

const anomaly = [
  { day: "Mon", score: 0.12 },
  { day: "Tue", score: 0.18 },
  { day: "Wed", score: 0.15 },
  { day: "Thu", score: 0.22 },
  { day: "Fri", score: 0.65 },
  { day: "Sat", score: 0.28 },
  { day: "Sun", score: 0.19 },
];

// -----------------------------
// Notebook-like content (dummy)
// -----------------------------
const NOTEBOOK = [
  {
    type: "markdown",
    content:
      "# Forecasting demo (sample notebook)\nThis mini-notebook shows a typical workflow: cleaning, feature engineering, baseline forecast, and quick validation. The data here is synthetic — the goal is to demonstrate how I structure analysis and communicate results.",
  },
  {
    type: "code",
    title: "Load + shape data",
    content: `import pandas as pd\n\n# Synthetic monthly series\ndf = pd.DataFrame({\n  "month": ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],\n  "demand": [102,108,111,118,125,131,140,136,129,121,112,106],\n  "supply": [110,112,113,116,120,124,128,127,125,122,118,114]\n})\n\ndf["gap"] = df["supply"] - df["demand"]\ndf.head()` ,
  },
  {
    type: "output",
    content:
      "month  demand  supply  gap\nJan    102     110      8\nFeb    108     112      4\nMar    111     113      2\nApr    118     116     -2\nMay    125     120     -5",
  },
  {
    type: "code",
    title: "Baseline forecast (moving average)",
    content: `# 3-month moving average baseline\ndf["forecast"] = df["demand"].rolling(3).mean()\n# Simple error metric on months where forecast exists\ndf_eval = df.dropna().copy()\nmae = (df_eval["demand"] - df_eval["forecast"]).abs().mean()\nmae` ,
  },
  { type: "output", content: "2.78  # MAE (synthetic)" },
  {
    type: "markdown",
    content:
      "**Interpretation:** A quick baseline gives a useful benchmark. In a real engagement, I’d compare baselines, add covariates, and validate across seasons/segments, then package outputs into a dashboard for stakeholders.",
  },
];

// -----------------------------
// Utilities
// -----------------------------
function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-muted flex items-center justify-center shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          {subtitle ? (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
      {children}
    </Badge>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="rounded-2xl border bg-background overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center justify-between bg-muted/30">
        <div className="text-sm font-medium flex items-center gap-2">
          <Code2 className="h-4 w-4" />
          <span>{title}</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-xl"
                onClick={() => navigator.clipboard.writeText(code)}
              >
                Copy
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy to clipboard</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <pre className="p-4 text-xs overflow-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function OutputBlock({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border bg-muted/20 p-4">
      <div className="text-xs font-medium text-muted-foreground mb-2">Output</div>
      <pre className="text-xs overflow-auto leading-relaxed">
        <code>{text}</code>
      </pre>
    </div>
  );
}

function MockDashboardCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">{title}</div>
            <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
          </div>
          <Pill>Demo</Pill>
        </div>
        <div className="mt-4 h-[240px]">{children}</div>
      </CardContent>
    </Card>
  );
}

function PipelineDiagram() {
  const nodes = [
    { k: "Sources", d: "CSV / SQL / APIs" },
    { k: "Ingest", d: "Validation + schema checks" },
    { k: "Transform", d: "SQL + Python (dbt-style)" },
    { k: "Model", d: "Forecasting + metrics" },
    { k: "Serve", d: "BI + extracts" },
    { k: "Monitor", d: "Quality + alerts" },
  ];

  return (
    <div className="rounded-2xl border bg-background p-5">
      <div className="text-sm font-semibold flex items-center gap-2">
        <Database className="h-4 w-4" />
        ETL / Analytics Delivery Flow
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Example of how I structure an end-to-end analytics pipeline for reliability.
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-6 gap-3 items-stretch">
        {nodes.map((n, i) => (
          <div key={n.k} className="relative">
            <div className="rounded-2xl border bg-muted/20 p-3 h-full">
              <div className="text-xs font-semibold">{n.k}</div>
              <div className="text-[11px] text-muted-foreground mt-1 leading-snug">
                {n.d}
              </div>
            </div>
            {i < nodes.length - 1 ? (
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <ArrowRight className="h-4 w-4" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExcelVbaPanel() {
  const [tab, setTab] = useState("excel");
  const vba = `Option Explicit\n\nSub RefreshAllAndExport()\n    ' Example: refresh pivots and export a clean report\n    Application.ScreenUpdating = False\n\n    ThisWorkbook.RefreshAll\n    Application.CalculateUntilAsyncQueriesDone\n\n    Sheets("Report").ExportAsFixedFormat _\n        Type:=xlTypePDF, _\n        Filename:=ThisWorkbook.Path & "\\Weekly_Report.pdf"\n\n    Application.ScreenUpdating = True\nEnd Sub`;

  const excel = `=LET(\n  _tbl, Table1,\n  _region, [@Region],\n  _sum, SUMIFS(_tbl[Value], _tbl[Region], _region, _tbl[Status], "Active"),\n  IFERROR(_sum, 0)\n)`;

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold flex items-center gap-2">
              <Table2 className="h-4 w-4" />
              Excel + VBA examples
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Native Excel workflows, automation, and reproducible reporting.
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={tab === "excel" ? "default" : "secondary"}
              className="rounded-xl"
              onClick={() => setTab("excel")}
            >
              Excel
            </Button>
            <Button
              size="sm"
              variant={tab === "vba" ? "default" : "secondary"}
              className="rounded-xl"
              onClick={() => setTab("vba")}
            >
              VBA
            </Button>
          </div>
        </div>

        <div className="mt-4">
          {tab === "excel" ? (
            <CodeBlock title="Example Excel formula (LET + SUMIFS)" code={excel} />
          ) : (
            <CodeBlock title="Example VBA macro (refresh + export)" code={vba} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectCard({
  title,
  desc,
  tags,
  highlights,
}: {
  title: string;
  desc: string;
  tags: string[];
  highlights: string[];
}) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">{title}</div>
            <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {desc}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((t) => (
                <Pill key={t}>{t}</Pill>
              ))}
            </div>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
        <Separator className="my-4" />
        <ul className="text-sm space-y-2 list-disc pl-5">
          {highlights.map((h) => (
            <li key={h} className="text-sm text-muted-foreground">
              <span className="text-foreground/90">{h}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function PortfolioSite() {
  const [q, setQ] = useState("");

  const skillGroups = useMemo(
    () => [
      {
        title: "Core",
        icon: Code2,
        items: ["Python", "SQL", "Tableau", "Streamlit", "VBA", "DAX"],
      },
      {
        title: "Analytics",
        icon: LayoutDashboard,
        items: [
          "Forecasting",
          "Scenario modelling",
          "Time series analysis",
          "Decision support",
          "Stakeholder reporting",
        ],
      },
      {
        title: "Delivery",
        icon: ShieldCheck,
        items: [
          "Remote collaboration",
          "Git (Azure Repos / GitLab)",
          "Data quality checks",
          "Reproducible workflows",
          "Regulatory / exec reporting",
        ],
      },
    ],
    []
  );

  const projects = useMemo(
    () => [
      {
        title: "Forecasting + decision support dashboard",
        desc:
          "Example end-to-end workflow: prepare data, build baseline forecasts, publish KPIs, and communicate risk/uncertainty to stakeholders.",
        tags: ["Python", "SQL", "Tableau-style", "Forecasting"],
        highlights: [
          "Designed KPIs and definitions to ensure consistent reporting",
          "Created repeatable analysis with clear assumptions and validation",
          "Packaged outputs for business users (dashboard + changelog)",
        ],
      },
      {
        title: "ETL + reporting pipeline (template)",
        desc:
          "Demonstration of how I structure an analytics pipeline with validation, transformations, and monitoring.",
        tags: ["ETL", "Data quality", "Automation"],
        highlights: [
          "Schema checks and tests to prevent silent failures",
          "Version-controlled transformations and release notes",
          "Monitoring for freshness and anomaly detection",
        ],
      },
      {
        title: "Excel automation pack",
        desc:
          "Native Excel workflows for non-technical teams: templates, pivots, controlled inputs, and VBA automation for repeatable exports.",
        tags: ["Excel", "VBA", "Reporting"],
        highlights: [
          "Time-saving refresh/export routines",
          "Clear instructions and guardrails for end users",
          "Audit-friendly outputs and change tracking",
        ],
      },
    ],
    []
  );

  const filteredProjects = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return projects;
    return projects.filter((p) =>
      (p.title + " " + p.desc + " " + p.tags.join(" "))
        .toLowerCase()
        .includes(s)
    );
  }, [q, projects]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          <Card className="rounded-2xl shadow-sm lg:col-span-8">
            <CardContent className="p-7">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight">
                    {PROFILE.name}
                  </h1>
                  <div className="mt-2 text-base text-muted-foreground">
                    {PROFILE.title}
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {PROFILE.tagline}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Pill>Available: Remote contracts</Pill>
                    <Pill>Day rate: £450–£550</Pill>
                    <Pill>Timezone: UK / overlap-friendly</Pill>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button
                      className="rounded-2xl"
                      onClick={() =>
                        document
                          .getElementById("projects")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      View work
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button
                      variant="secondary"
                      className="rounded-2xl"
                      onClick={() =>
                        document
                          .getElementById("notebook")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      Notebook demo
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-2xl"
                      asChild
                    >
                      <a href={PROFILE.cvUrl} target="_blank" rel="noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download CV
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {PROFILE.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Open to remote contract/consultancy
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> Output-focused, async-friendly
                  </div>
                </div>
              </div>

              <Separator className="my-6" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {skillGroups.map((g) => (
                  <div
                    key={g.title}
                    className="rounded-2xl border bg-muted/10 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <g.icon className="h-4 w-4" />
                      <div className="text-sm font-semibold">{g.title}</div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {g.items.map((it) => (
                        <Pill key={it}>{it}</Pill>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm lg:col-span-4">
            <CardContent className="p-7">
              <SectionTitle
                icon={Mail}
                title="Contact"
                subtitle="Fastest way to reach me"
              />

              <div className="mt-5 space-y-3">
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="flex items-center justify-between rounded-2xl border p-3 hover:bg-muted/30 transition"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{PROFILE.email}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </a>

                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-2xl border p-3 hover:bg-muted/30 transition"
                >
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    <span className="text-sm">LinkedIn</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </a>

                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                  className={classNames(
                    "flex items-center justify-between rounded-2xl border p-3 hover:bg-muted/30 transition",
                    PROFILE.github.includes("your-handle") && "opacity-60"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    <span className="text-sm">GitHub (optional)</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </a>

                <a
                  href={PROFILE.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={classNames(
                    "flex items-center justify-between rounded-2xl border p-3 hover:bg-muted/30 transition",
                    PROFILE.cvUrl === "#" && "opacity-60"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">CV (PDF)</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </a>
              </div>

              <Separator className="my-6" />
              <div className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground/90">Note:</span>{" "}
                This portfolio contains demo data and examples to showcase approach and
                tooling. Replace placeholders with real screenshots or case studies as
                available.
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* PROJECTS */}
        <div id="projects" className="mt-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionTitle
              icon={Sparkles}
              title="Projects"
              subtitle="A few representative examples (demo)"
            />
            <div className="mt-5 flex items-center gap-3">
              <div className="relative w-full max-w-md">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search projects (e.g., forecasting, ETL, Tableau)"
                  className="pl-9 rounded-2xl"
                />
              </div>
              <Pill>{filteredProjects.length} shown</Pill>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredProjects.map((p) => (
                <ProjectCard key={p.title} {...p} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* DASHBOARD DEMOS */}
        <div className="mt-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionTitle
              icon={LayoutDashboard}
              title="BI-style dashboards"
              subtitle="Interactive charts (demo). Replace with Tableau screenshots if desired."
            />

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <MockDashboardCard
                title="Demand vs Supply"
                subtitle="Seasonal pattern + gap monitoring"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeseries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="demand" strokeWidth={2} />
                    <Line type="monotone" dataKey="supply" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </MockDashboardCard>

              <MockDashboardCard
                title="Operational KPIs"
                subtitle="Quality, uptime, adoption, speed"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={kpiBars}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" hide />
                    <YAxis domain={[0, 100]} />
                    <RTooltip />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  {kpiBars.map((k) => (
                    <div
                      key={k.name}
                      className="rounded-xl border bg-muted/10 p-2"
                    >
                      <div className="font-medium text-foreground/90">{k.name}</div>
                      <div className="mt-1">{k.value}%</div>
                    </div>
                  ))}
                </div>
              </MockDashboardCard>

              <MockDashboardCard
                title="Anomaly signal"
                subtitle="Example scoring output"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={anomaly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <RTooltip />
                    <Area type="monotone" dataKey="score" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-3 text-xs text-muted-foreground">
                  Demonstrates how I’d communicate monitoring signals alongside
                  thresholds and action notes.
                </div>
              </MockDashboardCard>
            </div>
          </motion.div>
        </div>

        {/* NOTEBOOK */}
        <div id="notebook" className="mt-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionTitle
              icon={Code2}
              title="Notebook demo"
              subtitle="Jupyter-style analysis (demo content)"
            />

            <Card className="rounded-2xl shadow-sm mt-6">
              <CardContent className="p-6">
                <Tabs defaultValue="render" className="w-full">
                  <TabsList className="rounded-2xl">
                    <TabsTrigger value="render" className="rounded-2xl">
                      Rendered
                    </TabsTrigger>
                    <TabsTrigger value="cells" className="rounded-2xl">
                      Cells
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="rounded-2xl">
                      Recruiter notes
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="render" className="mt-5">
                    <div className="space-y-4">
                      <div className="rounded-2xl border bg-muted/10 p-4">
                        <div className="text-sm font-semibold">What this shows</div>
                        <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          A typical approach: define the question, shape data, establish
                          a baseline, validate, then package results. Replace this demo
                          with a real notebook export later if you’d like.
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <MockDashboardCard
                          title="Forecast baseline"
                          subtitle="Simple benchmark for validation"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={timeseries}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <RTooltip />
                              <Line type="monotone" dataKey="demand" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </MockDashboardCard>
                        <div className="rounded-2xl border bg-background p-5">
                          <div className="text-sm font-semibold">Key takeaways</div>
                          <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc pl-5">
                            <li>
                              Start with a baseline and document assumptions
                            </li>
                            <li>
                              Validate outputs and build trust with stakeholders
                            </li>
                            <li>
                              Package analysis into dashboards and changelogs
                            </li>
                          </ul>
                          <Separator className="my-4" />
                          <div className="text-xs text-muted-foreground">
                            Want a real notebook? Replace demo cells in the NOTEBOOK
                            array and add links to GitHub or a hosted HTML export.
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="cells" className="mt-5">
                    <div className="space-y-4">
                      {NOTEBOOK.map((cell, idx) => {
                        if (cell.type === "markdown") {
                          return (
                            <div
                              key={idx}
                              className="rounded-2xl border bg-muted/10 p-4"
                            >
                              <div className="text-xs font-medium text-muted-foreground mb-2">
                                Markdown
                              </div>
                              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                                {cell.content}
                              </div>
                            </div>
                          );
                        }
                        if (cell.type === "code") {
                          return (
                            <CodeBlock
                              key={idx}
                              title={cell.title || `Code cell ${idx + 1}`}
                              code={cell.content}
                            />
                          );
                        }
                        return <OutputBlock key={idx} text={cell.content} />;
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="mt-5">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="rounded-2xl border bg-muted/10 p-4">
                        <div className="text-sm font-semibold">How to review</div>
                        <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          This page is designed for quick scanning: skills → examples →
                          approach. Recruiters can click CV and reach out.
                        </div>
                      </div>
                      <div className="rounded-2xl border bg-muted/10 p-4">
                        <div className="text-sm font-semibold">What I deliver</div>
                        <ul className="mt-2 space-y-2 text-sm text-muted-foreground list-disc pl-5">
                          <li>Clean, tested datasets and definitions</li>
                          <li>Repeatable analysis and forecasts</li>
                          <li>Dashboards + stakeholder-ready summaries</li>
                        </ul>
                      </div>
                      <div className="rounded-2xl border bg-muted/10 p-4">
                        <div className="text-sm font-semibold">Next step</div>
                        <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          If you’d like a role-specific version of this page, I can
                          create a tailored case study section for the job.
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ETL + Excel */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <PipelineDiagram />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <ExcelVbaPanel />
          </motion.div>
        </div>

        {/* FOOTER */}
        <div className="mt-12 text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-3">
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:text-foreground"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <span className="opacity-40">•</span>
            <a
              href={`mailto:${PROFILE.email}`}
              className="inline-flex items-center gap-2 hover:text-foreground"
            >
              <Mail className="h-4 w-4" /> Email
            </a>
            <span className="opacity-40">•</span>
            <a
              href={PROFILE.cvUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:text-foreground"
            >
              <FileText className="h-4 w-4" /> CV
            </a>
          </div>
          <div className="mt-2">© {new Date().getFullYear()} {PROFILE.name}. Built as a lightweight portfolio page.</div>
        </div>
      </div>
    </div>
  );
}
