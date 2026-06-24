"use client";

import { useState } from "react";
import { FileText, ChevronDown, ChevronUp, Download, Maximize2, Minimize2 } from "lucide-react";

type Props = {
  url: string;
  title?: string;
  defaultExpanded?: boolean;
};

export function PdfViewer({ url, title, defaultExpanded = true }: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [fullscreen, setFullscreen] = useState(false);

  const fileName = title ?? url.split("/").pop()?.split("?")[0] ?? "Document";

  return (
    <div className={`rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm
      ${fullscreen ? "fixed inset-4 z-50 flex flex-col shadow-2xl" : ""}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 text-red-500 shrink-0" />
          <span className="text-sm font-medium text-gray-700 truncate">{fileName}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <a
            href={url}
            download
            title="Download PDF"
            className="h-7 w-7 flex items-center justify-center rounded hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={() => setFullscreen(!fullscreen)}
            title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            className="h-7 w-7 flex items-center justify-center rounded hover:bg-gray-200 text-gray-500 transition-colors"
          >
            {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            title={expanded ? "Collapse" : "Expand"}
            className="h-7 w-7 flex items-center justify-center rounded hover:bg-gray-200 text-gray-500 transition-colors"
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* PDF iframe */}
      {expanded && (
        <div className={fullscreen ? "flex-1 overflow-hidden" : ""}>
          <iframe
            src={`${url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
            title={fileName}
            className="w-full border-0"
            style={{ height: fullscreen ? "100%" : "680px" }}
          />
        </div>
      )}

      {/* Collapsed state */}
      {!expanded && (
        <div className="px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
          <span>PDF collapsed —</span>
          <button type="button" className="text-brand hover:underline" onClick={() => setExpanded(true)}>
            click to expand
          </button>
        </div>
      )}

      {/* Fullscreen backdrop */}
      {fullscreen && (
        <div
          className="fixed inset-0 bg-black/50 -z-10"
          onClick={() => setFullscreen(false)}
        />
      )}
    </div>
  );
}
