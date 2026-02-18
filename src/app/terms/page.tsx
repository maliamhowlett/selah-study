import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-extrabold text-foreground">Terms of Use</h1>
      <p className="mb-8 text-sm text-muted">Last updated: February 2026</p>

      <div className="space-y-8 text-foreground leading-relaxed">
        <section>
          <h2 className="mb-3 text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Selah Study (&ldquo;the Service&rdquo;), you agree to be bound by
            these Terms of Use. If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-foreground">2. Description of Service</h2>
          <p>
            Selah Study is a free educational tool that provides lecture recording with transcription,
            Bible study resources, flashcard creation, and note-taking features. The Service is
            designed for personal educational and devotional use.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-foreground">3. Recording & Consent</h2>
          <p className="mb-2">
            <strong>Important:</strong> The recording feature is provided for your personal educational
            use. By using the recording feature, you acknowledge and agree that:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>You are solely responsible</strong> for obtaining all necessary consents and
              permissions before recording any lecture, conversation, sermon, or other audio content.
            </li>
            <li>
              Recording laws vary by jurisdiction. In many places, recording without the consent of
              all parties is <strong>illegal</strong>. It is your responsibility to understand and
              comply with all applicable local, state, federal, and international laws regarding
              audio recording.
            </li>
            <li>
              Selah Study does not record, store, or transmit your audio to any server. All
              transcription is performed locally in your browser using the Web Speech API.
            </li>
            <li>
              Selah Study is not liable for any legal consequences resulting from your use of the
              recording feature without proper consent.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-foreground">4. Data Storage & Privacy</h2>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              All data (transcriptions, notes, flashcards, and preferences) is stored{" "}
              <strong>locally in your browser</strong> using localStorage. Selah Study does not
              collect, store, or have access to your personal data on any server.
            </li>
            <li>
              Clearing your browser data will permanently delete all stored content. Selah Study
              is not responsible for any data loss.
            </li>
            <li>
              Bible verse data is retrieved from bible-api.com, a free public API serving the
              World English Bible (public domain). No personal data is sent to this API.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-foreground">5. Bible Content</h2>
          <p>
            Scripture quotations are from the World English Bible (WEB), which is in the public
            domain. Selah Study does not claim ownership of any Biblical text. The WEB translation
            is provided for educational and devotional purposes.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-foreground">6. Educational Purpose</h2>
          <p>
            Selah Study is intended for educational and devotional purposes only. The Service is
            provided &ldquo;as is&rdquo; without warranties of any kind, express or implied. We do
            not guarantee the accuracy of transcriptions, as they depend on browser speech
            recognition capabilities.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-foreground">7. User Conduct</h2>
          <p>You agree not to:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>Use the Service for any unlawful purpose</li>
            <li>Record content without proper consent from all relevant parties</li>
            <li>Attempt to reverse-engineer, modify, or distribute the Service</li>
            <li>Use the Service in any way that could harm or impair the Service for other users</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-foreground">8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Selah Study and its creators shall not be
            liable for any indirect, incidental, special, consequential, or punitive damages, or
            any loss of data, use, or profits, arising out of or related to your use of the Service.
            This includes, but is not limited to, any legal consequences arising from the recording
            of audio content without proper consent.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-foreground">9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Use at any time. Changes will be posted
            on this page with an updated date. Your continued use of the Service after changes
            constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-foreground">10. Contact</h2>
          <p>
            If you have questions about these Terms of Use, please reach out through our website.
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-border pt-6">
        <Link
          href="/"
          className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
