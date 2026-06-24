"use client";

import { useState } from "react";
import { Upload, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/appStore";

export function AssignmentPanel({
  lessonId,
  title,
}: {
  lessonId: string;
  title: string;
}) {
  const [files, setFiles] = useState<string[]>([]);
  const [github, setGithub] = useState("");
  const [text, setText] = useState("");
  const status = useAppStore((s) => s.assignmentStatus[lessonId] || "draft");
  const submitAssignment = useAppStore((s) => s.submitAssignment);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const names = Array.from(e.dataTransfer.files).map((f) => f.name);
    setFiles((prev) => [...prev, ...names]);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Badge
          variant={
            status === "graded"
              ? "success"
              : status === "submitted"
                ? "warning"
                : status === "revision"
                  ? "error"
                  : "outline"
          }
        >
          {status === "draft" ? "Draft" : status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>

      <div className="prose prose-sm mb-6 text-gray-600">
        <h3 className="font-semibold text-gray-900">Instructions</h3>
        <p>Connect the DC motor to pins 5 and 6. Upload your Arduino sketch and submit a short video or photo of the working motor.</p>
        <h4 className="font-medium mt-4">Rubric</h4>
        <ul className="list-disc pl-5">
          <li>Wiring correctness (30 pts)</li>
          <li>Code functionality (40 pts)</li>
          <li>Documentation (30 pts)</li>
        </ul>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-brand"
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">Drag & drop files here (PDF, ZIP, images — max 50MB)</p>
        <input
          type="file"
          multiple
          className="mt-2 text-sm"
          onChange={(e) => {
            const names = Array.from(e.target.files || []).map((f) => f.name);
            setFiles((prev) => [...prev, ...names]);
          }}
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">
          {files.map((f) => (
            <li key={f} className="flex justify-between rounded bg-gray-50 px-3 py-1">
              {f}
              <button type="button" onClick={() => setFiles(files.filter((x) => x !== f))} className="text-red-500">
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        <Input
          label="GitHub repository (optional)"
          placeholder="https://github.com/username/repo"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium">Written response</label>
        <textarea
          className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-sm h-24"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe your approach..."
        />
      </div>

      <div className="mt-6 flex gap-2">
        <Button variant="outline" onClick={() => useAppStore.getState().showToast("Draft saved", "info")}>
          Save Draft
        </Button>
        <Button
          disabled={status === "submitted" || status === "graded"}
          onClick={() => submitAssignment(lessonId)}
        >
          Submit Assignment
        </Button>
      </div>

      {status === "graded" && (
        <div className="mt-4 rounded-lg bg-green-50 p-4">
          <p className="font-semibold text-green-800">Grade: 92/100</p>
          <p className="mt-1 text-sm text-green-700">Excellent motor control implementation. Consider adding error handling for stall detection.</p>
        </div>
      )}
    </Card>
  );
}
