"use client";

/**
 * MockLearnPlayerPage — the original learn player for mock/demo courses.
 * Unchanged from Phase 0, kept for backwards-compatibility.
 */

import { useState } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemText,
  LinearProgress,
  Paper,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import { AssignmentPanel } from "@/components/assignments/AssignmentPanel";
import { courseCurriculum, courses } from "@/data/mock";
import { useAppStore } from "@/store/appStore";
import { LabShell } from "@/components/layout/wazilab/LabShell";

export default function MockLearnPlayerPage({
  courseSlug,
  lessonSlug,
}: {
  courseSlug: string;
  lessonSlug: string;
  userId: string;
}) {
  const [playing, setPlaying] = useState(false);
  const course = courses.find((c) => c.slug === courseSlug);
  const allLessons = courseCurriculum.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
  const lesson = allLessons[currentIndex] || allLessons[0];
  const prev = allLessons[currentIndex - 1];
  const next = allLessons[currentIndex + 1];

  const markLessonComplete = useAppStore((s) => s.markLessonComplete);
  const enrollments = useAppStore((s) => s.enrollments);
  const enrollment = enrollments.find((e) => e.courseSlug === courseSlug);
  const completedCount = enrollment?.completedLessons.length ?? 0;
  const isCompleted = enrollment?.completedLessons.includes(lesson?.id || "");

  const handleMarkComplete = () => {
    if (course) markLessonComplete(course.id, lesson.id);
  };

  const progressPct = allLessons.length ? (completedCount / allLessons.length) * 100 : 0;

  const renderContent = () => {
    if (!lesson) return null;
    switch (lesson.type) {
      case "quiz":
        return <QuizPlayer lessonId={lesson.id} courseId={course?.id || ""} onComplete={() => {}} />;
      case "assignment":
        return <AssignmentPanel lessonId={lesson.id} title={lesson.title} />;
      case "article":
        return (
          <Box sx={{ maxWidth: 720 }}>
            <Typography variant="h1" sx={{ fontSize: "1.5rem", fontWeight: 600, mb: 2 }}>
              {lesson.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              IoT devices can generally be grouped into categories: Consumer IoT, Enterprise IoT, and
              Industrial IoT. In this topic you will explore each category with practical examples.
            </Typography>
          </Box>
        );
      default:
        return (
          <Paper
            variant="outlined"
            sx={{
              minHeight: 280,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "grey.100",
            }}
          >
            <Button variant="contained" color="primary" size="large" onClick={() => setPlaying(!playing)}>
              {playing ? "Pause" : "Play"} video
            </Button>
            <Typography sx={{ mt: 2, fontWeight: 500 }}>{lesson.title}</Typography>
          </Paper>
        );
    }
  };

  return (
    <LabShell>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: "calc(100vh - 120px)" }}>
        <Paper
          square
          elevation={0}
          sx={{ width: { md: 280 }, borderRight: 1, borderColor: "divider", borderRadius: 0, display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
              Topics
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 0.5, fontWeight: 600 }}>
              {course?.title}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
              Progress · {completedCount} of {allLessons.length} topics done
            </Typography>
            <LinearProgress variant="determinate" value={progressPct} sx={{ mt: 1, height: 6, borderRadius: 1 }} />
          </Box>
          <List dense sx={{ overflow: "auto", flex: 1, py: 0 }}>
            {courseCurriculum.map((mod) => (
              <Box key={mod.id}>
                <Typography
                  variant="caption"
                  sx={{ display: "block", px: 2, py: 1, bgcolor: "primary.light", color: "primary.dark", fontWeight: 700, textTransform: "uppercase" }}
                >
                  {mod.title}
                </Typography>
                {mod.lessons.map((l) => {
                  const done = enrollment?.completedLessons.includes(l.id);
                  return (
                    <ListItemButton
                      key={l.id}
                      component={Link}
                      href={`/learn/${courseSlug}/${l.slug}`}
                      selected={l.slug === lesson?.slug}
                    >
                      {done && <CheckCircleIcon color="success" sx={{ fontSize: 18, mr: 1 }} />}
                      <ListItemText primary={l.title} />
                    </ListItemButton>
                  );
                })}
              </Box>
            ))}
          </List>
        </Paper>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
            <Button component={Link} href="/courses" size="small" color="primary">← Courses</Button>
            {lesson?.type !== "quiz" && lesson?.type !== "assignment" && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<CheckCircleIcon />}
                onClick={handleMarkComplete}
                disabled={!!isCompleted}
              >
                {isCompleted ? "Topic done" : "Mark Topic Done"}
              </Button>
            )}
          </Box>
          <Box sx={{ flex: 1, p: 3 }}>{renderContent()}</Box>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, py: 1.5 }}>
            {prev ? (
              <Button component={Link} href={`/learn/${courseSlug}/${prev.slug}`} variant="outlined" size="small">Previous</Button>
            ) : <span />}
            {next ? (
              <Button component={Link} href={`/learn/${courseSlug}/${next.slug}`} variant="contained" size="small">Next</Button>
            ) : (
              <Button component={Link} href="/dashboard/certificates" variant="contained" size="small" color="success">Finish</Button>
            )}
          </Box>
        </Box>
      </Box>
    </LabShell>
  );
}
