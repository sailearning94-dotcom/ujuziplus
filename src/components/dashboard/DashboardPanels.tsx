import Link from "next/link";
import {
  Award,
  BookOpen,
  FlaskConical,
  MessageSquare,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

const ACTIONS = [
  {
    href: "/dashboard/community",
    label: "Community",
    desc: "Ask & share",
    icon: MessageSquare,
    accent: "brand",
  },
  {
    href: "/dashboard/lab",
    label: "Innovation lab",
    desc: "Hands-on labs",
    icon: FlaskConical,
    accent: "navy",
  },
  {
    href: "/courses",
    label: "Browse catalog",
    desc: "Find new skills",
    icon: BookOpen,
    accent: "blue",
  },
  {
    href: "/showcase",
    label: "Showcase",
    desc: "See projects",
    icon: Trophy,
    accent: "amber",
  },
] as const;

export function DashboardQuickActions() {
  return (
    <Reveal delay={0.1}>
      <div className="learner-dashboard-panel">
        <h3 className="learner-dashboard-panel__title">
          <Sparkles className="h-4 w-4 text-brand" />
          Quick actions
        </h3>
        <div className="learner-quick-actions">
          {ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.href}
                href={a.href}
                className={`learner-quick-action learner-quick-action--${a.accent}`}
              >
                <span className="learner-quick-action__icon">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="learner-quick-action__label">{a.label}</span>
                  <span className="learner-quick-action__desc">{a.desc}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}

export function DashboardAchievementsPanel({
  certificates,
  completedCourses,
}: {
  certificates: { id: string; verifyCode: string; issuedAt: Date; course: { title: string } }[];
  completedCourses: number;
}) {
  return (
    <Reveal delay={0.14}>
      <div className="learner-dashboard-panel">
        <h3 className="learner-dashboard-panel__title">
          <Award className="h-4 w-4 text-amber-500" />
          Achievements
        </h3>

        <div className="learner-achievement-stats">
          <div className="learner-achievement-stat">
            <Trophy className="h-4 w-4 text-blue-500" />
            <div>
              <p className="learner-achievement-stat__value">{completedCourses}</p>
              <p className="learner-achievement-stat__label">Completed</p>
            </div>
          </div>
          <div className="learner-achievement-stat">
            <Award className="h-4 w-4 text-amber-500" />
            <div>
              <p className="learner-achievement-stat__value">{certificates.length}</p>
              <p className="learner-achievement-stat__label">Certificates</p>
            </div>
          </div>
        </div>

        {certificates.length === 0 ? (
          <p className="learner-dashboard-panel__empty">
            Finish a course to earn your first certificate.
          </p>
        ) : (
          <ul className="learner-cert-list">
            {certificates.slice(0, 3).map((cert) => (
              <li key={cert.id}>
                <Link href={`/certificate/${cert.verifyCode}`} className="learner-cert-item">
                  <span className="learner-cert-item__dot" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="learner-cert-item__title">{cert.course.title}</span>
                    <span className="learner-cert-item__date">
                      {new Date(cert.issuedAt).toLocaleDateString("en-TZ", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </span>
                  <span className="learner-cert-item__link">View</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {certificates.length > 0 && (
          <Link href="/dashboard/certificates" className="learner-dashboard-panel__footer-link">
            All certificates →
          </Link>
        )}
      </div>
    </Reveal>
  );
}

export function DashboardDiscussionsPanel({
  discussions,
}: {
  discussions: {
    id: string;
    title: string;
    channel: string;
    _count: { replies: number };
  }[];
}) {
  return (
    <Reveal delay={0.18}>
      <div className="learner-dashboard-panel">
        <h3 className="learner-dashboard-panel__title">
          <MessageSquare className="h-4 w-4 text-purple-500" />
          Your discussions
        </h3>

        {discussions.length === 0 ? (
          <p className="learner-dashboard-panel__empty">
            Join the conversation —{" "}
            <Link href="/dashboard/community" className="font-semibold text-brand hover:underline">
              post in Community
            </Link>
          </p>
        ) : (
          <ul className="learner-discussion-list">
            {discussions.map((d) => (
              <li key={d.id}>
                <Link
                  href={`/dashboard/community/${d.channel}/${d.id}`}
                  className="learner-discussion-item"
                >
                  <span className="learner-discussion-item__channel">#{d.channel}</span>
                  <span className="learner-discussion-item__title">{d.title}</span>
                  <span className="learner-discussion-item__meta">{d._count.replies} replies</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Link href="/dashboard/community" className="learner-dashboard-panel__footer-link">
          Open community →
        </Link>
      </div>
    </Reveal>
  );
}
