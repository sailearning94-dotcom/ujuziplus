"use client";

import Link from "next/link";
import type { Session } from "next-auth";
import { Box, IconButton, AppBar, Toolbar, Avatar, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { UjuziLogo } from "@/components/brand/UjuziLogo";

/** Header for guests and non-student signed-in users on public pages (all breakpoints). */
export function PublicMobileHeader({
  session,
  isAuthenticated,
  onMenuClick,
}: {
  session: Session | null;
  isAuthenticated: boolean;
  onMenuClick: () => void;
}) {
  const user = session?.user;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      className="glass-topbar"
      sx={{
        bgcolor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar>
        <IconButton edge="start" onClick={onMenuClick} aria-label="menu" sx={{ display: { sm: "none" } }}>
          <MenuIcon />
        </IconButton>
        <UjuziLogo variant="full" theme="light" logoHeight={40} href="/" />
        <Box sx={{ flex: 1 }} />
        <IconButton component={Link} href="/search" aria-label="Search" sx={{ mr: isAuthenticated ? 0 : 0.5 }}>
          <SearchIcon />
        </IconButton>
        {isAuthenticated && user ? (
          <Link href="/dashboard">
            <Avatar
              src={user.avatarUrl ?? user.image ?? undefined}
              alt={user.fullName || user.name || "User"}
              sx={{ width: 32, height: 32 }}
            />
          </Link>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
            <Button
              component={Link}
              href="/auth/login"
              variant="outlined"
              color="primary"
              size="medium"
              sx={{
                textTransform: "none",
                fontWeight: 700,
                px: { xs: 1.5, sm: 3 },
                borderRadius: 999,
                borderWidth: 1.5,
                "&:hover": { borderWidth: 1.5 },
              }}
            >
              Log in
            </Button>
            <Button
              component={Link}
              href="/auth/register"
              variant="contained"
              color="primary"
              size="medium"
              disableElevation
              sx={{
                textTransform: "none",
                fontWeight: 700,
                px: { xs: 2, sm: 3 },
                borderRadius: 999,
                boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
                "&:hover": { boxShadow: "0 4px 14px rgba(0,0,0,0.18)" },
              }}
            >
              Sign up free
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
