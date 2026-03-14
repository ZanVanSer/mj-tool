import { PageIntro } from "@/components/page-intro";
import { PlaceholderCard } from "@/components/placeholder-card";

export default function AnalyzePage() {
  return (
    <section className="space-y-8">
      <PageIntro
        title="Email Quality Score"
        description="Run rule-based checks against your email HTML and review quality, compatibility, and delivery-focused warnings."
      />

      <div className="grid gap-4 md:grid-cols-4">
        {[
          "Overall Score",
          "Passed Checks",
          "Warnings",
          "Critical Errors",
        ].map((label) => (
          <PlaceholderCard
            key={label}
            title={label}
            description="This card will show live analyzer results once the scoring engine is wired."
            compact
          />
        ))}
      </div>

      <PlaceholderCard
        title="Analyzer categories ready"
        description="We’ll keep this route purely rule-based, with no DKIM/SPF/DMARC or third-party deliverability checks."
      />
    </section>
  );
}
