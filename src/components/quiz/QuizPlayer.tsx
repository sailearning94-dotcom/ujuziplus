"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/store/appStore";

const QUESTIONS = [
  {
    id: "q1",
    text: "What is the default operating voltage of Arduino Uno?",
    options: ["3.3V", "5V", "9V", "12V"],
    correct: 1,
  },
  {
    id: "q2",
    text: "Which function runs once at startup?",
    options: ["loop()", "setup()", "main()", "init()"],
    correct: 1,
  },
  {
    id: "q3",
    text: "PWM stands for:",
    options: [
      "Pulse Width Modulation",
      "Power Wire Management",
      "Program Write Mode",
      "Pin Width Mapping",
    ],
    correct: 0,
  },
];

type Phase = "intro" | "active" | "result";

export function QuizPlayer({
  lessonId,
  courseId,
  passScore = 70,
  timeLimitMinutes = 10,
  onComplete,
}: {
  lessonId: string;
  courseId: string;
  passScore?: number;
  timeLimitMinutes?: number;
  onComplete?: (passed: boolean) => void;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);
  const submitQuiz = useAppStore((s) => s.submitQuiz);
  const markLessonComplete = useAppStore((s) => s.markLessonComplete);

  const handleSubmit = () => {
    let correct = 0;
    QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correct) correct++;
    });
    const pct = Math.round((correct / QUESTIONS.length) * 100);
    setScore(pct);
    submitQuiz(lessonId, pct, passScore);
    setPhase("result");
    if (pct >= passScore) {
      markLessonComplete(courseId, lessonId);
      onComplete?.(true);
    } else {
      onComplete?.(false);
    }
  };

  if (phase === "intro") {
    return (
      <Card className="max-w-lg mx-auto text-center">
        <h2 className="text-xl font-semibold">Arduino Basics Quiz</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-600 text-left">
          <li>• {QUESTIONS.length} questions</li>
          <li>• Time limit: {timeLimitMinutes} minutes</li>
          <li>• Pass score: {passScore}%</li>
          <li>• Attempts remaining: 2</li>
        </ul>
        <Button className="mt-6" size="lg" onClick={() => setPhase("active")}>
          Start Quiz
        </Button>
      </Card>
    );
  }

  if (phase === "result") {
    const passed = score >= passScore;
    return (
      <Card className="max-w-lg mx-auto text-center">
        <div className={`text-5xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>
          {score}%
        </div>
        <p className="mt-2 text-lg font-semibold">{passed ? "Passed!" : "Not passed"}</p>
        <div className="mt-4 space-y-2 text-left text-sm">
          {QUESTIONS.map((q, i) => (
            <div
              key={q.id}
              className={`rounded-lg p-2 ${answers[q.id] === q.correct ? "bg-green-50" : "bg-red-50"}`}
            >
              Q{i + 1}: {answers[q.id] === q.correct ? "Correct" : "Incorrect"} — {q.text}
            </div>
          ))}
        </div>
        {!passed && (
          <Button className="mt-4" variant="secondary" onClick={() => { setPhase("intro"); setAnswers({}); }}>
            Retry Quiz
          </Button>
        )}
      </Card>
    );
  }

  const q = QUESTIONS[current];
  return (
    <Card className="max-w-2xl mx-auto">
      <div className="mb-4 flex justify-between text-sm text-gray-500">
        <span>
          Question {current + 1} of {QUESTIONS.length}
        </span>
        <span>{timeLimitMinutes}:00 remaining</span>
      </div>
      <h3 className="text-lg font-semibold">{q.text}</h3>
      <div className="mt-4 space-y-2">
        {q.options.map((opt, i) => (
          <label
            key={opt}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${
              answers[q.id] === i ? "border-brand bg-brand-light" : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name={q.id}
              checked={answers[q.id] === i}
              onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
            />
            {opt}
          </label>
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          disabled={current === 0}
          onClick={() => setCurrent((c) => c - 1)}
        >
          Previous
        </Button>
        {current < QUESTIONS.length - 1 ? (
          <Button onClick={() => setCurrent((c) => c + 1)} disabled={answers[q.id] === undefined}>
            Next
          </Button>
        ) : (
          <Button
            onClick={() => {
              if (confirm("Submit quiz? You cannot change answers after submitting.")) handleSubmit();
            }}
            disabled={Object.keys(answers).length < QUESTIONS.length}
          >
            Submit Quiz
          </Button>
        )}
      </div>
    </Card>
  );
}
