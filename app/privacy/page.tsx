import Link from "next/link";

export const metadata = {
  title: "Privacy Policy · InstantCoverLetter.ai",
  description: "How InstantCoverLetter.ai handles your data.",
};

export default function PrivacyPolicy() {
  const lastUpdated = "May 2026";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-indigo-300 hover:text-indigo-200 text-sm mb-8 inline-block"
        >
          ← Back to home
        </Link>

        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-slate-400 text-sm mb-10">Last updated: {lastUpdated}</p>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Overview</h2>
            <p>
              InstantCoverLetter.ai (&quot;we&quot;, &quot;us&quot;, or &quot;the Service&quot;) is a free
              AI-powered cover letter generator. This Privacy Policy explains what data
              we collect, how we use it, and your rights regarding your information.
            </p>
            <p className="mt-3">
              By using the Service, you agree to the practices described here.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. Information We Collect</h2>
            <p className="font-semibold text-white">a) Information You Provide</p>
            <p className="mt-1">
              When you use the cover letter generator, you provide your name (optional),
              professional background/experience, and a job description. This text is
              sent to our AI provider (Groq) only to generate your letter and is not
              stored on our servers afterward.
            </p>

            <p className="font-semibold text-white mt-4">b) Payment Information</p>
            <p className="mt-1">
              If you upgrade to Pro, payment is processed by Stripe. We never see or
              store your card details. Stripe receives your email, billing address, and
              payment method, governed by{" "}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-300 hover:underline"
              >
                Stripe&apos;s Privacy Policy
              </a>
              .
            </p>

            <p className="font-semibold text-white mt-4">c) Cookies</p>
            <p className="mt-1">We use a small number of essential cookies:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>
                <strong>usage</strong>: tracks daily generation count for free users
                (resets daily)
              </li>
              <li>
                <strong>pro_token</strong>: identifies you as a Pro subscriber after
                purchase (signed, encrypted)
              </li>
              <li>
                <strong>customer_token</strong>: links your session to your Stripe
                customer record so you can manage your subscription
              </li>
            </ul>
            <p className="mt-2">
              These cookies are required for the Service to function. We do not use
              tracking, advertising, or third-party analytics cookies on the core
              product.
            </p>

            <p className="font-semibold text-white mt-4">d) Server Logs</p>
            <p className="mt-1">
              Like most websites, our hosting provider (Vercel) automatically logs
              standard server data such as IP addresses, browser type, and timestamps
              for security and performance. These logs are retained briefly per
              Vercel&apos;s policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>To generate your cover letter (the only purpose of the experience/job description text)</li>
              <li>To enforce free-tier daily limits</li>
              <li>To process payments and provide Pro access</li>
              <li>To respond to support requests if you contact us</li>
              <li>To detect abuse and protect the Service</li>
            </ul>
            <p className="mt-3">
              <strong>We do not sell your data.</strong> We do not use your inputs to
              train any AI models.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Third-Party Services</h2>
            <p>We rely on these providers to operate:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>
                <strong>Groq</strong> — AI letter generation (
                <a
                  href="https://groq.com/privacy-policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-300 hover:underline"
                >
                  privacy policy
                </a>
                )
              </li>
              <li>
                <strong>Stripe</strong> — payment processing (
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-300 hover:underline"
                >
                  privacy policy
                </a>
                )
              </li>
              <li>
                <strong>Vercel</strong> — hosting and infrastructure (
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-300 hover:underline"
                >
                  privacy policy
                </a>
                )
              </li>
              <li>
                <strong>Impact.com</strong> — affiliate link tracking when you click
                recommended partner links
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">5. Data Retention</h2>
            <p>
              The text you input (resume, job description) is sent to our AI provider
              and the generated letter is returned to you. We do not store this
              content on our servers after the request is complete.
            </p>
            <p className="mt-3">
              Pro subscriber records (linked to your Stripe customer ID) are retained
              for as long as your subscription is active and as needed for billing
              records.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Cancel your subscription anytime via the Manage Subscription portal</li>
              <li>Request deletion of your Pro account data by emailing us</li>
              <li>Clear cookies in your browser to reset usage tracking</li>
              <li>Request a copy of any data we hold about you</li>
            </ul>
            <p className="mt-3">
              EU/UK users have additional rights under GDPR including data portability
              and the right to lodge a complaint with a supervisory authority.
            </p>
            <p className="mt-3">
              California residents have additional rights under CCPA, including the
              right to know, delete, and opt out of the sale of personal information
              (we do not sell personal information).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">7. Children&apos;s Privacy</h2>
            <p>
              The Service is not intended for users under 16 years of age. We do not
              knowingly collect data from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy occasionally. The &quot;Last updated&quot; date
              at the top reflects the latest revision. Material changes will be
              highlighted on the homepage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">9. Contact</h2>
            <p>
              Questions about this Privacy Policy or your data? Contact us at:{" "}
              <a
                href="mailto:coldcosmas@gmail.com"
                className="text-indigo-300 hover:underline"
              >
                coldcosmas@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}