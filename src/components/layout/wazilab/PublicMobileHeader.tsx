"use client";

import Link from "next/link";
import type { Session } from "next-auth";
import { Box, IconButton, AppBar, Toolbar, Avatar, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { UjuziLogo } from "@/components/brand/UjuziLogo";

/** Mobile-only header for guests and non-student signed-in users on public pages. */
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
        display: { sm: "none" },
        bgcolor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar>
        <IconButton edge="start" onClick={onMenuClick} aria-label="menu">
          <MenuIcon />
        </IconButton>
        <UjuziLogo variant="full" theme="light" logoHeight={40} href="/" />
        <Box sx={{ flex: 1 }} />
        {isAuthenticated && user ? (
          <Link href="/dashboard">
            <Avatar
              src={user.avatarUrl ?? user.image ?? undefined}
              alt={user.fullName || user.name || "User"}
              sx={{ width: 32, height: 32 }}
            />
          </Link>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button component={Link} href="/auth/login" color="primary" size="small" sx={{ textTransform: "none" }}>
              Log in
            </Button>
            <Button
              component={Link}
              href="/auth/register"
              variant="contained"
              color="primary"
              size="small"
              sx={{ textTransform: "none" }}
            >
              Sign up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
