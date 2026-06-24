"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { MuiLabDrawer } from "./MuiLabDrawer";
import { LabFooter } from "./LabFooter";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { PublicMobileHeader } from "@/components/layout/wazilab/PublicMobileHeader";
import { DRAWER_COLLAPSED, DRAWER_WIDTH } from "@/theme/wazilab-mui-theme";
import { isAdminRole, isInstructorRole, isStudentRole } from "@/lib/auth/roles";

const CHROMELESS_PREFIXES = ["/auth", "/onboarding"];

export function LabShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerExpanded, setDrawerExpanded] = useState(false);
  const { data: session, status } = useSession();

  const role = session?.user?.role;
  const isStudent = isStudentRole(role);
  const isInstructor = isInstructorRole(role);
  const isAdmin = isAdminRole(role);
  const chromeless = CHROMELESS_PREFIXES.some((p) => pathname.startsWith(p));

  const showAuthenticatedChrome =
    !chromeless && (status === "authenticated" || status === "loading");
  const showStudentMobileNav = !chromeless && status === "authenticated" && isStudent;

  return (
    <Box className="LabPage" sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <MuiLabDrawer
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onExpandedChange={setDrawerExpanded}
        showStudentNav={status === "authenticated" && isStudent}
        showInstructorNav={status === "authenticated" && (isInstructor || isAdmin)}
        showAdminNav={status === "authenticated" && isAdmin}
      />

      <Box
        component="main"
        className={`LabPage-main${drawerExpanded ? " LabPage-main--expanded" : ""}`}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          minWidth: 0,
          maxWidth: "100%",
          overflowX: "hidden",
          ml: {
            xs: 0,
            sm: drawerExpanded ? `${DRAWER_WIDTH - DRAWER_COLLAPSED}px` : 0,
          },
          transition: "margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {showAuthenticatedChrome ? (
          <AppTopbar session={session ?? null} onMenuClick={() => setMobileOpen(true)} />
        ) : !chromeless ? (
          <PublicMobileHeader
            session={session}
            isAuthenticated={false}
            onMenuClick={() => setMobileOpen(true)}
          />
        ) : null}

        <Box
          className="page-transition"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            maxWidth: "100%",
            pb: showStudentMobileNav ? { xs: 10, lg: 0 } : 0,
          }}
        >
          {children}
        </Box>
        <LabFooter />
        {showStudentMobileNav && <MobileNav />}
      </Box>
    </Box>
  );
}
