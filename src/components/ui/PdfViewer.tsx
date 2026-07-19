"use client";

import { useState } from "react";
import { FileText, ChevronDown, ChevronUp, Download, Maximize2, Minimize2 } from "lucide-react";

type Props = {
  url: string;
  title?: string;
  defaultExpanded?: boolean;
  /** Renders as a fixed full-screen panel (below the app topbar) with a
   * collapsible header, instead of a normal in-flow card. No page scrolling
   * involved — the PDF's own viewer handles scrolling internally. */
  fullBleed?: boolean;
};

export function PdfViewer({ url, title, defaultExpanded = true, fullBleed = false }: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [fullscreen, setFullscreen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  const fileName = title ?? url.split("/").pop()?.split("?")[0] ?? "Document";
  const src = `${url}#toolbar=1&navpanes=0&scrollbar=0&view=FitH`;

  if (fullBleed) {
    return (
      <div className="absolute inset-0 z-20 flex flex-col bg-white">
        {headerVisible && (
          <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-red-500" />
              <span className="truncate text-sm font-medium text-gray-700">{fileName}</span>
            </div>
            <div className="ml-2 flex shrink-0 items-center gap-1">
              <a
                href={url}
                download
                title="Download PDF"
                className="flex h-7 w-7 items-center justify-center rounded text-gray-500 transition-colors hover:bg-gray-200"
              >
                <Download className="h-3.5 w-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setHeaderVisible(false)}
                title="Hide header"
                className="flex h-7 w-7 items-center justify-center rounded text-gray-500 transition-colors hover:bg-gray-200"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
        <div className="relative flex-1 overflow-hidden">
          {!headerVisible && (
            <button
              type="button"
              onClick={() => setHeaderVisible(true)}
              title="Show header"
              className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded bg-white/90 text-gray-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          )}
          <iframe src={src} title={fileName} className="h-full w-full border-0" />
        </div>
      </div>
    );
  }

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
            src={src}
            title={fileName}
            className="w-full border-0"
            style={fullscreen ? { height: "100%" } : { height: "calc(100vh - 220px)", minHeight: 500 }}
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
