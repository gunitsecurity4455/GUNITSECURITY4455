import type { Metadata } from "next";
import { ExternalLink, Facebook, Instagram } from "lucide-react";
import { getSiteSettings } from "@/lib/site-data";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Blog & Updates",
  description:
    "Latest updates, photos, and insights from G-Unit Security operations across Perth.",
};

export const revalidate = 3600;

/**
 * Both Instagram and Facebook embed URLs work off a username/handle stored in
 * SiteSettings (instagramUrl / facebookUrl). If the admin hasn't set them yet
 * we fall back to a known-good placeholder + a 'Set this in admin' note.
 */
function handleFromUrl(url: string | null | undefined, kind: "ig" | "fb"): string {
  if (!url) return kind === "ig" ? "gunitsecurity" : "gunitsecurity";
  // Take the last path segment; strip trailing slashes / query strings.
  const cleaned = url.replace(/\/+$/, "").split("?")[0].split("/").filter(Boolean);
  return cleaned[cleaned.length - 1] ?? "gunitsecurity";
}

export default async function BlogPage() {
  const settings = await getSiteSettings();
  const igHandle = handleFromUrl(settings?.instagramUrl, "ig");
  const fbHandle = handleFromUrl(settings?.facebookUrl, "fb");
  const igUrl = settings?.instagramUrl || `https://instagram.com/${igHandle}`;
  const fbUrl = settings?.facebookUrl || `https://facebook.com/${fbHandle}`;

  return (
    <>
      <PageHero
        title={
          <>
            Latest <span className="brand-gradient-text">Updates</span>
          </>
        }
        subtitle="Follow the journey, the operations, and the moments behind G-Unit Security across Perth."
        breadcrumbs={[{ href: "/", label: "Home" }, { label: "Blog" }]}
      />

      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[5px] uppercase text-gold-bright mb-4">
              Stay Connected
            </p>
            <h2 className="font-display text-5xl sm:text-6xl tracking-wider">
              Live <span className="brand-gradient-text">Social</span> Feeds
            </h2>
            <p className="font-serif italic text-lg text-off-white/60 mt-5 max-w-xl mx-auto">
              New posts on Instagram or Facebook show up here automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Instagram */}
            <article className="card-luxury rounded-2xl p-6 md:p-8">
              <header className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl tracking-wider">Instagram</h3>
                  <p className="text-xs text-off-white/55">@{igHandle}</p>
                </div>
                <a
                  href={igUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-off-white/50 hover:text-gold-bright transition"
                  aria-label="Open Instagram profile"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </header>

              <div className="aspect-square rounded-xl overflow-hidden border border-white/8 bg-pure-black">
                <iframe
                  title="Instagram feed"
                  src={`https://www.instagram.com/${igHandle}/embed`}
                  className="w-full h-full"
                  loading="lazy"
                  scrolling="no"
                  allowTransparency
                />
              </div>

              <a
                href={igUrl}
                target="_blank"
                rel="noreferrer"
                className="block w-full mt-5 py-3 text-center text-xs tracking-[3px] uppercase font-medium rounded-lg bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-white hover:opacity-90 transition"
              >
                Follow on Instagram
              </a>
            </article>

            {/* Facebook */}
            <article className="card-luxury rounded-2xl p-6 md:p-8">
              <header className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-primary flex items-center justify-center">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl tracking-wider">Facebook</h3>
                  <p className="text-xs text-off-white/55">@{fbHandle}</p>
                </div>
                <a
                  href={fbUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-off-white/50 hover:text-gold-bright transition"
                  aria-label="Open Facebook page"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </header>

              <div className="aspect-square rounded-xl overflow-hidden border border-white/8 bg-pure-black">
                <iframe
                  title="Facebook page"
                  src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
                    fbUrl
                  )}&tabs=timeline&width=400&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                  className="w-full h-full"
                  loading="lazy"
                  scrolling="no"
                  allowTransparency
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              </div>

              <a
                href={fbUrl}
                target="_blank"
                rel="noreferrer"
                className="block w-full mt-5 py-3 text-center text-xs tracking-[3px] uppercase font-medium rounded-lg bg-blue-primary hover:bg-blue-royal text-white transition"
              >
                Follow on Facebook
              </a>
            </article>
          </div>

          <p className="text-center text-xs text-off-white/40 mt-12 max-w-md mx-auto">
            Configure the handles by setting Instagram URL and Facebook URL in{" "}
            <span className="text-off-white/70">Admin → Site Settings</span>.
          </p>
        </div>
      </section>
    </>
  );
}
