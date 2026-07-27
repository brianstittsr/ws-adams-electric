"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { isSuperAdmin } from "@/lib/permissions";
import { collection, query, where, onSnapshot, terminate } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/schema";
import { useUserProfile } from "@/contexts/user-profile-context";
import { useFeatureVisibility } from "@/contexts/feature-visibility-context";
import { RoleSwitcherCompact } from "@/components/portal/role-switcher";
import { FeatureKey, SectionKey } from "@/lib/feature-visibility";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Factory,
  LayoutDashboard,
  Target,
  FolderKanban,
  Users,
  Building,
  FileText,
  Calendar,
  CalendarDays,
  CheckSquare,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Mail,
  Handshake,
  DollarSign,
  User,
  ImageIcon,
  Shield,
  Rocket,
  Battery,
  UserCog,
  Building2,
  Search,
  Linkedin,
  FileSignature,
  Bot,
  Plug,
  Bug,
  Heart,
  Phone,
  CalendarClock,
  GraduationCap,
  Paintbrush,
  BookOpen,
  Database,
  Ticket,
  UsersRound,
  Briefcase,
  Network,
  Menu,
  Presentation,
  Quote,
  ArrowRightLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

// System Management
const systemManagementItems: { title: string; href: string; icon: React.ElementType; badge?: string; featureKey: FeatureKey }[] = [];

// Project Management
const projectManagementItems: { title: string; href: string; icon: React.ElementType; badge?: string; featureKey: FeatureKey }[] = [
  {
    title: "AI Workforce",
    href: "/portal/ai-workforce",
    icon: Bot,
    badge: "AI",
    featureKey: "aiWorkforce",
  },
  {
    title: "EOS2 Dashboard",
    href: "/portal/eos2",
    icon: Target,
    badge: "EOS",
    featureKey: "eos2",
  },
  {
    title: "Action Items",
    href: "/portal/rocks",
    icon: CheckSquare,
    featureKey: "rocks",
  },
];

// Data
const dataItems: { title: string; href: string; icon: React.ElementType; badge?: string; featureKey: FeatureKey }[] = [
  {
    title: "Apollo Search",
    href: "/portal/apollo-search",
    icon: Search,
    badge: "AI",
    featureKey: "apolloSearch",
  },
];

// People
const peopleItems: { title: string; href: string; icon: React.ElementType; badge?: string; featureKey: FeatureKey }[] = [];

// Productivity
const productivityItems: { title: string; href: string; icon: React.ElementType; badge?: string; featureKey: FeatureKey }[] = [];

// Affiliate Center
const affiliateCenterItems: { title: string; href: string; icon: React.ElementType; badge?: string; featureKey: FeatureKey }[] = [];

// Content
const contentItems: { title: string; href: string; icon: React.ElementType; badge?: string; featureKey: FeatureKey }[] = [];

// Admin
const adminItems: { title: string; href: string; icon: React.ElementType; badge?: string; featureKey: FeatureKey }[] = [
  {
    title: "Book a Call",
    href: "/portal/admin/book-a-call",
    icon: Calendar,
    featureKey: "bookACall",
  },
  {
    title: "Page Designer",
    href: "/portal/admin/page-designer",
    icon: Paintbrush,
    featureKey: "pageDesigner",
  },
  {
    title: "Mail",
    href: "/portal/admin/mail",
    icon: Mail,
    featureKey: "mailAdmin",
  },
];

// Legacy 83 Business
const legacy83BusinessItems: { title: string; href: string; icon: React.ElementType; badge?: string; featureKey: FeatureKey }[] = [
  {
    title: "Bug Tracker",
    href: "/portal/bug-tracker",
    icon: Bug,
    featureKey: "bugTracker",
  },
  {
    title: "System Documentation",
    href: "/portal/system-docs",
    icon: BookOpen,
    featureKey: "systemDocs",
  },
  {
    title: "Opportunities",
    href: "/portal/opportunities",
    icon: Target,
    featureKey: "opportunities",
  },
  {
    title: "Projects",
    href: "/portal/projects",
    icon: FolderKanban,
    featureKey: "projects",
  },
  {
    title: "Calendar",
    href: "/portal/calendar",
    icon: Calendar,
    featureKey: "calendar",
  },
  {
    title: "Meetings",
    href: "/portal/meetings",
    icon: Users,
    featureKey: "meetings",
  },
  {
    title: "Availability",
    href: "/portal/availability",
    icon: CalendarDays,
    featureKey: "availability",
  },
  {
    title: "Proposal Creator",
    href: "/portal/proposals",
    icon: FileText,
    badge: "AI",
    featureKey: "proposals",
  },
  {
    title: "Events",
    href: "/portal/admin/events",
    icon: Ticket,
    featureKey: "events",
  },
  {
    title: "Networking",
    href: "/portal/networking",
    icon: Handshake,
    featureKey: "networking",
  },
  {
    title: "Deals",
    href: "/portal/deals",
    icon: DollarSign,
    featureKey: "deals",
  },
  {
    title: "Supplier Search",
    href: "/portal/supplier-search",
    icon: Factory,
    badge: "AI",
    featureKey: "supplierSearch",
  },
  {
    title: "Team Members",
    href: "/portal/admin/team-members",
    icon: UserCog,
    featureKey: "teamMembers",
  },
  {
    title: "Affiliates",
    href: "/portal/affiliates",
    icon: Users,
    featureKey: "affiliates",
  },
  {
    title: "Customers",
    href: "/portal/customers",
    icon: Building,
    featureKey: "customers",
  },
  {
    title: "Documents",
    href: "/portal/documents",
    icon: FileText,
    featureKey: "documents",
  },
  {
    title: "GoHighLevel",
    href: "/portal/gohighlevel",
    icon: Plug,
    badge: "CRM",
    featureKey: "gohighlevel",
  },
  {
    title: "GHL Integration",
    href: "/portal/admin/ghl-migration",
    icon: ArrowRightLeft,
    featureKey: "ghlMigration",
  },
  {
    title: "Hero Carousel",
    href: "/portal/admin/hero",
    icon: Presentation,
    featureKey: "heroManagement",
  },
  {
    title: "Image Manager",
    href: "/portal/admin/images",
    icon: ImageIcon,
    featureKey: "imageManager",
  },
  {
    title: "Academy Admin",
    href: "/portal/admin/academy",
    icon: GraduationCap,
    featureKey: "academyAdmin",
  },
  {
    title: "Navigation Manager",
    href: "/portal/admin/navigation",
    icon: Menu,
    featureKey: "navigationManager",
  },
  {
    title: "Revenue Config",
    href: "/portal/admin/revenue",
    icon: DollarSign,
    featureKey: "revenueConfig",
  },
  {
    title: "Alignable",
    href: "/portal/admin/alignable",
    icon: Network,
    featureKey: "alignable",
  },
  {
    title: "Backup & Restore",
    href: "/portal/admin/backups",
    icon: Database,
    featureKey: "backups",
  },
  {
    title: "Success Stories",
    href: "/portal/admin/success-stories",
    icon: Quote,
    featureKey: "successStories",
  },
];

export function PortalSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { getDisplayName, getInitials, profile, linkedTeamMember } = useUserProfile();
  const { canSeeFeature, canSeeSection, isPreviewMode } = useFeatureVisibility();
  const [bookCallLeadsCount, setBookCallLeadsCount] = useState(0);
  const [opportunitiesCount, setOpportunitiesCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const currentUserRole = linkedTeamMember?.role || "affiliate";
  const showSuperAdminLink = isSuperAdmin(currentUserRole);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      // Terminate Firestore to prevent internal assertion errors when switching users
      if (db) {
        try {
          await terminate(db);
          console.log("Firestore terminated before sign out");
        } catch (terminateError) {
          console.warn("Could not terminate Firestore:", terminateError);
        }
      }
      
      // Sign out from Firebase Auth
      if (auth) {
        await auth.signOut();
      }
      // Clear session storage
      sessionStorage.removeItem("svp_authenticated");
      sessionStorage.removeItem("svp_user_email");
      sessionStorage.removeItem("svp_firebase_uid");
      sessionStorage.removeItem("svp_user_name");
      sessionStorage.removeItem("svp_team_member_id");
      sessionStorage.removeItem("svp_user_role");
      // Clear local storage remember me
      localStorage.removeItem("svp_remembered_email");
      localStorage.removeItem("svp_remember_me");
      // Force a full page reload to reinitialize Firebase cleanly
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
      window.location.href = "/";
    }
  };

  // Subscribe to BookCallLeads count (new leads only)
  useEffect(() => {
    if (!db) return;
    
    const q = query(
      collection(db, COLLECTIONS.BOOK_CALL_LEADS),
      where("status", "==", "new")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBookCallLeadsCount(snapshot.size);
    });
    
    return () => unsubscribe();
  }, []);

  // Subscribe to Opportunities count (active opportunities)
  useEffect(() => {
    if (!db) return;
    
    const q = query(
      collection(db, COLLECTIONS.OPPORTUNITIES),
      where("status", "in", ["new", "contacted", "qualified", "proposal", "negotiation"])
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOpportunitiesCount(snapshot.size);
    });
    
    return () => unsubscribe();
  }, []);

  // Subscribe to Projects count (active projects)
  useEffect(() => {
    if (!db) return;
    
    const q = query(
      collection(db, COLLECTIONS.PROJECTS),
      where("status", "in", ["planning", "in_progress", "on_hold"])
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProjectsCount(snapshot.size);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Collapsible state for each section
  const [openSections, setOpenSections] = useState({
    systemManagement: true,
    projectManagement: true,
    data: false,
    people: false,
    productivity: false,
    affiliateCenter: false,
    content: false,
    admin: false,
    legacy83Business: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Get dynamic count for specific items
  const getDynamicCount = (href: string): number | null => {
    if (href === "/portal/opportunities") return opportunitiesCount > 0 ? opportunitiesCount : null;
    if (href === "/portal/projects") return projectsCount > 0 ? projectsCount : null;
    return null;
  };

  // Helper to render menu items
  const renderMenuItems = (items: typeof systemManagementItems) => (
    <SidebarMenu>
      {items.filter(item => canSeeFeature(item.featureKey)).map((item) => {
        const dynamicCount = getDynamicCount(item.href);
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
              tooltip={item.title}
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
            {dynamicCount !== null ? (
              <SidebarMenuBadge>{dynamicCount}</SidebarMenuBadge>
            ) : item.badge ? (
              <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
            ) : null}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );

  // Helper to render a collapsible section
  const renderSection = (
    sectionKey: keyof typeof openSections,
    label: string,
    items: typeof systemManagementItems
  ) => {
    const visibleItems = items.filter(item => canSeeFeature(item.featureKey));
    if (visibleItems.length === 0) return null;

    return (
      <Collapsible open={openSections[sectionKey]} onOpenChange={() => toggleSection(sectionKey)}>
        <SidebarGroup>
          <CollapsibleTrigger asChild>
            <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent/50 rounded-md flex items-center justify-between pr-2">
              <span>{label}</span>
              {openSections[sectionKey] ? (
                <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
              ) : (
                <ChevronRight className="h-4 w-4 text-sidebar-foreground/60" />
              )}
            </SidebarGroupLabel>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarGroupContent>
              {renderMenuItems(visibleItems)}
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    );
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/portal" className="flex items-center gap-2 px-2 py-4">
          <NextImage
            src="/legacy83Logo.webp"
            alt="Legacy 83 Business Inc"
            width={160}
            height={53}
            className="h-10 w-auto"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Preview Mode Indicator */}
        {isPreviewMode && (
          <div className="mx-2 mb-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-md">
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              👁️ Preview Mode Active
            </p>
          </div>
        )}

        {/* Legacy 83 Business */}
        <Collapsible open={openSections.legacy83Business} onOpenChange={() => toggleSection("legacy83Business")}>
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent/50 rounded-md flex items-center justify-between pr-2">
                <span>Legacy 83 Business</span>
                {openSections.legacy83Business ? (
                  <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-sidebar-foreground/60" />
                )}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {legacy83BusinessItems.filter(item => canSeeFeature(item.featureKey)).map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.badge && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                  {/* SuperAdmin Controls - Only visible to superadmins */}
                  {showSuperAdminLink && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === "/portal/admin/superadmin"}
                        tooltip="SuperAdmin Controls"
                      >
                        <Link href="/portal/admin/superadmin">
                          <Shield className="h-4 w-4" />
                          <span>SuperAdmin Controls</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* System Management */}
        {renderSection("systemManagement", "System Management", systemManagementItems)}

        {/* Project Management */}
        {renderSection("projectManagement", "Project Management", projectManagementItems)}

        {/* Productivity */}
        {renderSection("productivity", "Productivity", productivityItems)}

        {/* Data */}
        {renderSection("data", "Data", dataItems)}

        {/* People */}
        {renderSection("people", "People", peopleItems)}

        {/* Affiliate Center */}
        {renderSection("affiliateCenter", "Affiliate Center", affiliateCenterItems)}

        {/* Content */}
        {renderSection("content", "Content", contentItems)}

        {/* Admin */}
        {renderSection("admin", "Admin", adminItems)}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {/* Role Switcher for SuperAdmin */}
        <RoleSwitcherCompact />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">{getDisplayName()}</span>
                    <span className="text-xs text-sidebar-foreground/60 capitalize">{profile.role.replace("_", " ")}</span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/portal/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/portal/settings?tab=notifications">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/portal/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
