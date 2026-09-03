"use client";

import { useCallback, useRef, useState } from "react";
import {
  PORTFOLIO_MAX_FILES,
  mergePortfolioFiles,
} from "../lib/portfolio";

interface PortfolioUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export default function PortfolioUpload({ files, onChange }: PortfolioUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = useCallback(
    (list: FileList | File[] | null) => {
      if (!list) return;
      const incoming = Array.from(list);
      const result = mergePortfolioFiles(files, incoming);
      setError(result.error);
      onChange(result.files);
    },
    [files, onChange],
  );

  return (
    <div className="space-y-3">
      <button
        type="button"
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          accept(event.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`group relative w-full overflow-hidden rounded-2xl border border-dashed px-6 py-10 text-left transition-all duration-300 ${
          dragging
            ? "border-gold bg-gold/10"
            : "border-white/15 bg-white/[0.03] hover:border-gold/50 hover:bg-white/[0.05]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf,image/jpeg,.jpg,.jpeg,image/png,.png"
          multiple
          className="hidden"
          onChange={(event) => {
            accept(event.target.files);
            event.target.value = "";
          }}
        />
        <div className="relative z-10">
          <p className="font-display text-lg text-white">Drop portfolio files</p>
          <p className="mt-2 text-sm text-mist">
            PDF, JPG, or PNG · up to {PORTFOLIO_MAX_FILES} files · 10 MB each.
            Images are analysed with the vision model you pick next.
          </p>
        </div>
      </button>
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
      {files.length > 0 ? (
        <ul className="space-y-2">
          {files.map((file) => (
            <li
              key={`${file.name}-${file.size}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-3"
            >
              <div>
                <p className="text-sm text-white">{file.name}</p>
                <p className="mt-0.5 font-mono text-[11px] text-mist">
                  {(file.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onChange(files.filter((item) => item !== file))
                }
                className="shrink-0 text-xs uppercase tracking-widest text-mist transition hover:text-white"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
