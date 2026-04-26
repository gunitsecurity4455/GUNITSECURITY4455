import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { getSession } from "@/lib/auth-helpers";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];
const MAX_SIZE = 5 * 1024 * 1024;

const ALLOWED_FOLDERS = new Set([
  "general",
  "hero",
  "thumbnail",
  "team",
  "partner",
  "logo",
  "service",
  "industry",
  "testimonial",
]);

function sanitiseFolder(input: FormDataEntryValue | null): string {
  const name = typeof input === "string" ? input.toLowerCase().trim() : "";
  return ALLOWED_FOLDERS.has(name) ? name : "general";
}

function sanitiseFilename(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9.-]/g, "-").replace(/-+/g, "-");
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch (err) {
    return NextResponse.json(
      { error: "Could not parse form data" },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      {
        error: `Unsupported file type "${file.type}". Allowed: JPG, PNG, WebP, SVG, GIF.`,
      },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      {
        error: `File too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Max 5MB.`,
      },
      { status: 400 }
    );
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Vercel Blob is not configured. Add the Blob store to the Vercel project (Settings → Storage) and redeploy.",
      },
      { status: 500 }
    );
  }

  const folder = sanitiseFolder(formData.get("folder"));
  const filename = `${folder}/${Date.now()}-${sanitiseFilename(file.name)}`;

  try {
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      size: file.size,
      type: file.type,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("Vercel Blob upload error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const url = (body as { url?: unknown })?.url;
  if (typeof url !== "string" || !url) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  // Only delete URLs that look like Vercel Blob outputs.
  if (!url.includes(".blob.vercel-storage.com")) {
    // Non-blob URLs (legacy /uploads/* paths or external URLs) — nothing to do.
    return NextResponse.json({ success: true, skipped: true });
  }

  try {
    await del(url);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    console.error("Vercel Blob delete error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
