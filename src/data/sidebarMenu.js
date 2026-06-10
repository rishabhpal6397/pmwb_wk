import {
  LayoutDashboard,
  Info,
  ChartColumn,
  Users,
  GraduationCap,
  Target,
  TriangleAlert,
  Bug,
  Lightbulb,
  FileSearch,
  BadgeCheck,
  FolderCheck,
  BookOpenCheck,
  Trophy,
  ShieldAlert,
  CalendarRange,
} from "lucide-react";

const menuItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    key: "project-info",
    label: "Project Info",
    path: "/project-info",
    icon: Info,
  },

  {
    key: "psr",
    label: "Project Status Review",
    path: "/psr",
    icon: ChartColumn,
  },

  {
    key: "resources",
    label: "Resources",
    path: "/resources",
    icon: Users,
  },

  {
    key: "training",
    label: "Training",
    path: "/training",
    icon: GraduationCap,
  },

  {
    key: "metrics",
    label: "Metrics",
    path: "/metrics",
    icon: Target,
  },

  {
    key: "risks",
    label: "Risk Management",
    path: "/risks",
    icon: TriangleAlert,
  },

  {
    key: "risk-methodology",
    label: "Risk Methodology",
    path: "/risk-methodology",
    icon: ShieldAlert,
    },

    {
    key: "size-schedule-effort",
    label: "Size, Schedule & Effort",
    path: "/size-schedule-effort",
    icon: CalendarRange,
    },

  {
    key: "issuesManagment",
    label: "IssuesManagement",
    path: "/issues-management",
    icon: Bug,
  },

  {
    key: "opportunities",
    label: "Opportunities",
    path: "/opportunities",
    icon: Lightbulb,
  },

  {
    key: "verificationdata",
    label: "Verification Data",
    path: "/verification",
    icon: FileSearch,
  },

  {
    key: "verificationsummary",
    label: "Verification Summary",
    path: "/verificationsummary",
    icon: BadgeCheck,
  },

  {
    key: "closeout",
    label: " Project Closeout Meeting",
    path: "/closeout",
    icon: FolderCheck,
  },

  {
    key: "lessons",
    label: "Lessons Learned",
    path: "/lessons",
    icon: BookOpenCheck,
  },

  {
    key: "performance",
    label: "Performance",
    path: "/performance",
    icon: Trophy,
  },
];

export default menuItems;