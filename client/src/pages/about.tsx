import { Link } from "wouter";
import Nav from "../components/Nav";
import { SiteFooter } from "@/components/SiteChrome";

export default function About() {
  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--ink)]">
      <Nav />

      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">About Us</h1>
          </div>

          <div className="space-y-8 text-lg leading-relaxed">
            <p className="text-soft-grey">
              At One Now Two, we specialise in crafting exceptional video content tailored for commercial real estate.
            </p>

            <p className="text-soft-grey">
              Based in Sydney, we proudly serve Newcastle, the Central Coast, regional NSW, and beyond — across Australia and internationally.
            </p>

            <p className="text-soft-grey">
              With over 15 years of experience in video production, our team brings a cinematic approach to every project. We've spent years crafting TVCs, brand films, and commercial content for agencies and brands — now we're bringing that same level of craft to property video production.
            </p>

            <div className="border-t border-b border-[var(--hairline)] py-8 my-12">
              <h2 className="font-serif text-2xl mb-6">What We Cover</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-soft-grey">
                <div>• Industrial & Warehouse</div>
                <div>• Retail & Shopping Precincts</div>
                <div>• Hotels, Hospitality & Tourism</div>
                <div>• Property Developments</div>
              </div>
            </div>

            <p className="text-soft-grey">
              We work fast, stay organised, and make handover easy. Whether it's a quick walkthrough or a full development film, we approach every project with the same attention to detail.
            </p>

            <div className="text-center pt-8">
              <Link href="/enquire" className="btn-primary">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
