"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { LearnerPageHero } from "@/components/shared/LearnerPageHero";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { WAZILAB_LAB_FILTERS } from "@/lib/wazilab-theme";
import { WaziLabGrid } from "@/components/layout/wazilab/WaziLabGrid";
import { toggleLabResourceBookmark } from "@/lib/actions/lab-resources";
import { useAppStore } from "@/store/appStore";
import { useRouter } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";

type ResourceItem = {
  id: string;
  slug: string;
  title: string;
  type: string;
  category: string | null;
};

export function LabResourcesClient({
  resources,
  savedIds,
  userId,
}: {
  resources: ResourceItem[];
  savedIds: string[];
  userId: string | null;
}) {
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [saved, setSaved] = useState(new Set(savedIds));
  const [isPending, startTransition] = useTransition();
  const showToast = useAppStore((s) => s.showToast);
  const router = useRouter();

  const filtered = resources.filter((r) => {
    if (tab === 1 && !saved.has(r.id)) return false;
    if (typeFilter && r.category !== typeFilter) return false;
    return true;
  });

  const toggleSave = (resourceId: string, title: string) => {
    if (!userId) {
      router.push("/auth/login?callbackUrl=/lab-resources");
      return;
    }
    startTransition(async () => {
      const res = await toggleLabResourceBookmark(userId, resourceId);
      if (res.success) {
        setSaved((prev) => {
          const next = new Set(prev);
          if (res.data.saved) next.add(resourceId);
          else next.delete(resourceId);
          return next;
        });
        showToast(res.data.saved ? `Saved ${title}` : `Removed ${title}`, "success");
      }
    });
  };

  return (
    <Box className="learner-canvas" sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
      <LearnerPageHero
        banner="lab-resources"
        title="Lab Resources"
        subtitle="Hardware components, guides, and reference materials for hands-on labs."
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 2 }}>
        <Tab label="All resources" />
        <Tab label={`My lab (${saved.size})`} />
      </Tabs>

      <Reveal delay={0.06}>
      <Box sx={{ mt: 3, display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 3 }}>
        <Paper variant="outlined" sx={{ width: { lg: 200 }, flexShrink: 0, borderRadius: 2 }}>
          <Typography variant="overline" sx={{ display: "block", px: 2, pt: 2, color: "text.secondary" }}>
            Filter by category
          </Typography>
          <List dense>
            <ListItemButton selected={!typeFilter} onClick={() => setTypeFilter(null)}>
              <ListItemText primary="All" />
            </ListItemButton>
            {WAZILAB_LAB_FILTERS.map((f) => (
              <ListItemButton key={f} selected={typeFilter === f} onClick={() => setTypeFilter(f)}>
                <ListItemText primary={f} />
              </ListItemButton>
            ))}
          </List>
        </Paper>

        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </Typography>
          <WaziLabGrid>
            {filtered.map((item) => (
              <Card
                key={item.slug}
                sx={{
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 20px rgba(243,146,35,0.12)",
                  },
                }}
              >
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" className="capitalize">
                    {item.type.toLowerCase()}
                    {item.category ? ` · ${item.category}` : ""}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant={saved.has(item.id) ? "contained" : "outlined"}
                    disabled={isPending}
                    onClick={() => toggleSave(item.id, item.title)}
                  >
                    {saved.has(item.id) ? "Saved" : "My lab"}
                  </Button>
                  <Button size="small" component={Link} href={`/lab-resources/${item.slug}`}>
                    Learn more
                  </Button>
                </CardActions>
              </Card>
            ))}
          </WaziLabGrid>
          {filtered.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 8, textAlign: "center" }}>
              {tab === 1 ? "Nothing saved yet. Browse resources and add to My lab." : "No resources found."}
            </Typography>
          )}
        </Box>
      </Box>
      </Reveal>
    </Box>
  );
}
