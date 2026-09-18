import { useState } from "react";
import Nav from "../components/Nav";
import { SiteFooter } from "@/components/SiteChrome";
import { SeoHead } from "@/components/SeoHead";

export default function Enquire() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("email", formData.email);
      formDataObj.append("phone", formData.phone);
      formDataObj.append("message", formData.message);
      formDataObj.append("_subject", "New Property Video Enquiry — One Now Two");

      const response = await fetch("https://formspree.io/f/meorqnnr", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formDataObj,
      });

      if (response.ok) {
        window.location.href = `${window.location.origin}/thanks`;
      } else {
        setError(
          "Something went wrong sending your enquiry. Please try again, or email us at hello@onenowtwo.com.au."
        );
      }
    } catch {
      setError(
        "Something went wrong sending your enquiry. Please try again, or email us at hello@onenowtwo.com.au."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass =
    "w-full px-4 py-3 bg-[var(--cream)] border border-[var(--hairline)] rounded-lg text-[var(--ink)] placeholder-[var(--muted-grey)] focus:outline-none focus:border-[var(--navy)] focus:ring-2 focus:ring-[var(--navy)]/20 transition-colors";

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--ink)]">
      <SeoHead
        title="Enquire | One Now Two"
        description="Discuss a commercial property video, drone or photography campaign with One Now Two."
        path="/enquire"
      />
      <Nav />

      <main className="pt-28 md:pt-32 pb-20">
        <div className="max-w-lg mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Enquire</h1>
            <p className="text-soft-grey text-lg">
              Tell us about the asset, audience and timing. We&apos;ll get back
              to you soon.
            </p>
            <p className="text-soft-grey text-sm mt-3">
              Prefer to email?{" "}
              <a
                href="mailto:hello@onenowtwo.com.au"
                className="text-[var(--navy)] underline-offset-2 hover:underline"
              >
                hello@onenowtwo.com.au
              </a>
            </p>
            <p className="text-soft-grey text-sm mt-2">
              Or call{" "}
              <a
                href="tel:+61449783720"
                className="text-[var(--navy)] underline-offset-2 hover:underline"
              >
                0449 783 720
              </a>
            </p>
          </div>

          <div className="bg-[var(--bg)] border border-[var(--hairline)] rounded-lg p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name <span className="text-soft-grey">(required)</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email <span className="text-soft-grey">(required)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={fieldClass}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Tell us about your project
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Property type, location, timeline..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`${fieldClass} resize-none`}
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
                >
                  {error}
                  <div className="mt-2">
                    <a
                      href="mailto:hello@onenowtwo.com.au"
                      className="underline underline-offset-2"
                    >
                      hello@onenowtwo.com.au
                    </a>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending…" : "Send enquiry"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
