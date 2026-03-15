import { Link } from "wouter";
import Nav from "../components/Nav";
import { usePageMeta } from "../hooks/use-page-meta";

const posts = [
  {
    slug: "/blog/commercial-property-video-production-sydney",
    title: "Commercial Property Video Production Sydney: Why Agents Are Making the Switch",
    excerpt:
      "Why Sydney's top commercial real estate agents are investing in professional video production for their property listings — and what it's doing for their campaigns.",
    date: "March 2026",
    category: "Industry Insights",
  },
];

export default function Blog() {
  usePageMeta(
    "Blog | One Now Two — Commercial Property Video Sydney",
    "Insights on commercial property video production, marketing, and the Sydney real estate market from One Now Two."
  );

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--ink)]">
      <Nav />

      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Blog</h1>
            <p className="text-soft-grey text-lg">
              Insights on commercial property video production and the Sydney market.
            </p>
          </div>

          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={post.slug}
                className="block group border border-[var(--hairline)] rounded-lg p-6 hover:border-white/30 transition-colors no-underline"
              >
                <p className="text-soft-grey text-xs uppercase tracking-wider mb-2">
                  {post.category} — {post.date}
                </p>
                <h2 className="font-serif text-2xl mb-3 group-hover:text-white transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-soft-grey text-sm leading-relaxed mb-4">{post.excerpt}</p>
                <span className="text-soft-grey text-sm group-hover:text-white transition-colors">
                  Read more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-8 section-border text-center text-soft-grey text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} One Now Two — Sydney, Australia</div>
          <div className="flex gap-6">
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/enquire" className="hover:text-white transition-colors">Enquire</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
