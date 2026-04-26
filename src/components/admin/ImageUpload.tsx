"use client";

import { useState, useRef, useCallback, type ChangeEvent, type DragEvent } from "react";
import {
  Upload,
  X,
  Link as LinkIcon,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

type FolderPreset = "hero" | "thumbnail" | "team" | "partner" | "logo" | "service" | "industry" | "testimonial" | "general";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: FolderPreset;
  label?: string;
  recommendedSize?: string;
  recommendedDimensions?: string;
  maxSizeMB?: number;
  required?: boolean;
}

const PRESETS: Record<FolderPreset, { size: string; dimensions: string; maxMB: number }> = {
  hero: { size: "1920×1080", dimensions: "16:9 widescreen", maxMB: 2 },
  thumbnail: { size: "800×600", dimensions: "4:3", maxMB: 1 },
  team: { size: "500×500", dimensions: "1:1 square", maxMB: 1 },
  partner: { size: "400×200", dimensions: "2:1 (transparent PNG ideal)", maxMB: 0.5 },
  logo: { size: "300×300", dimensions: "1:1 square", maxMB: 0.5 },
  service: { size: "1200×800", dimensions: "3:2", maxMB: 1.5 },
  industry: { size: "1200×800", dimensions: "3:2", maxMB: 1.5 },
  testimonial: { size: "200×200", dimensions: "1:1 square", maxMB: 0.5 },
  general: { size: "1200×800", dimensions: "3:2", maxMB: 2 },
};

export function ImageUpload({
  value,
  onChange,
  folder = "general",
  label = "Image",
  recommendedSize,
  recommendedDimensions,
  maxSizeMB,
  required = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlMode, setUrlMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const preset = PRESETS[folder];
  const displaySize = recommendedSize ?? preset.size;
  const displayDimensions = recommendedDimensions ?? preset.dimensions;
  const displayMaxMB = maxSizeMB ?? preset.maxMB;

  const validate = useCallback(
    (file: File): string | null => {
      const allowed = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/svg+xml",
        "image/gif",
      ];
      if (!allowed.includes(file.type)) {
        return `Invalid file type "${file.type}". Use JPG, PNG, WebP, SVG, or GIF.`;
      }
      if (file.size > displayMaxMB * 1024 * 1024) {
        return `File too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Max ${displayMaxMB}MB for this slot.`;
      }
      return null;
    },
    [displayMaxMB]
  );

  const upload = useCallback(
    async (file: File) => {
      setError(null);
      setSuccess(false);

      const validationError = validate(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setUploading(true);
      setProgress(0);
      const tick = setInterval(() => {
        setProgress((p) => Math.min(p + 8, 90));
      }, 120);

      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", folder);

        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const text = await res.text();

        let data: { url?: string; error?: string };
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            `Server returned non-JSON response (${res.status}). ${text.slice(0, 120)}`
          );
        }

        if (!res.ok) {
          throw new Error(data.error ?? `Upload failed (${res.status})`);
        }
        if (!data.url) {
          throw new Error("Upload succeeded but no URL was returned.");
        }

        setProgress(100);
        onChange(data.url);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2200);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        clearInterval(tick);
        setUploading(false);
        setTimeout(() => setProgress(0), 800);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [folder, onChange, validate]
  );

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) upload(file);
    },
    [upload]
  );

  const handleUrlSubmit = () => {
    setError(null);
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setError("Please enter a URL.");
      return;
    }
    try {
      new URL(trimmed);
    } catch {
      setError("Invalid URL format.");
      return;
    }
    onChange(trimmed);
    setUrlInput("");
    setUrlMode(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2200);
  };

  const handleRemove = async () => {
    if (!value) return;
    if (!confirm("Remove this image?")) return;

    if (value.includes(".blob.vercel-storage.com")) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: value }),
        });
      } catch {
        // Non-fatal — clear UI either way
      }
    }
    onChange(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs tracking-widest text-gray-mid uppercase">
          {label}
          {required && <span className="text-red-bright ml-1">*</span>}
        </label>
        <button
          type="button"
          onClick={() => {
            setUrlMode((m) => !m);
            setError(null);
          }}
          className="text-xs text-blue-light hover:text-blue-royal flex items-center gap-1 transition"
        >
          <LinkIcon className="w-3 h-3" />
          {urlMode ? "Use file upload" : "Use URL instead"}
        </button>
      </div>

      <div className="bg-blue-primary/10 border border-blue-primary/25 rounded-lg p-3 text-xs space-y-1">
        <div className="flex items-center gap-2 font-medium text-blue-light">
          <ImageIcon className="w-3.5 h-3.5" /> Recommended specifications
        </div>
        <div className="text-gray-mid space-y-0.5 ml-5">
          <div>
            <span className="text-off-white/80">Size:</span> {displaySize} px
          </div>
          <div>
            <span className="text-off-white/80">Aspect:</span> {displayDimensions}
          </div>
          <div>
            <span className="text-off-white/80">Max:</span> {displayMaxMB}MB · JPG, PNG, WebP, SVG, GIF
          </div>
        </div>
      </div>

      {urlMode ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleUrlSubmit();
              }
            }}
            placeholder="https://example.com/image.jpg"
            className="flex-1 bg-navy-deep border border-navy-light rounded-lg px-3 py-2.5 text-sm text-off-white focus:border-red-bright focus:outline-none focus:ring-1 focus:ring-red-bright transition"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-4 py-2.5 bg-gradient-to-r from-red-primary to-red-deep hover:from-red-bright hover:to-red-primary text-white text-xs tracking-widest uppercase font-medium rounded-lg transition"
          >
            Use URL
          </button>
        </div>
      ) : value ? (
        <div className="relative inline-block group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="rounded-lg border border-navy-light object-cover max-h-40 max-w-full"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-primary hover:bg-red-bright text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
            aria-label="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="mt-2 text-xs text-gray-dark truncate max-w-md">{value}</p>
        </div>
      ) : (
        <div
          onDrop={onDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragging(false);
          }}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
            dragging
              ? "border-red-bright bg-red-primary/10 scale-[1.01]"
              : "border-navy-light hover:border-red-bright/60 bg-navy-deep/40"
          } ${uploading ? "opacity-60 pointer-events-none" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml,image/gif"
            className="hidden"
            onChange={onFileChange}
            disabled={uploading}
          />

          {uploading ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-gray-mid text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-red-bright" />
                Uploading… {progress}%
              </div>
              <div className="w-full max-w-xs mx-auto bg-navy-light rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-primary to-blue-primary h-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-navy-rich flex items-center justify-center border border-navy-light">
                <Upload className="w-5 h-5 text-red-bright" />
              </div>
              <p className="text-sm text-off-white">
                {dragging ? "Drop image here" : "Click or drag image to upload"}
              </p>
              <p className="text-xs text-gray-mid">
                {displaySize} · {displayDimensions} · max {displayMaxMB}MB
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 bg-red-deep/20 border border-red-primary/40 rounded-lg px-3 py-2 text-red-bright text-xs">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-900/30 border border-green-500/40 rounded-lg px-3 py-2 text-green-400 text-xs">
          <CheckCircle className="w-3.5 h-3.5" />
          Image saved.
        </div>
      )}
    </div>
  );
}
