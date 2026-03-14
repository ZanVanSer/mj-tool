import { PageIntro } from "@/components/page-intro";
import { PlaceholderCard } from "@/components/placeholder-card";

export default function SettingsPage() {
  return (
    <section className="space-y-8">
      <PageIntro
        title="Settings"
        description="Configure your email development environment and analyzer thresholds from one focused control panel."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <PlaceholderCard
          title="Preview Settings"
          description="Default width, preferred device, and theme controls will live here."
        />
        <PlaceholderCard
          title="Analyzer Thresholds"
          description="HTML size threshold, spam sensitivity, and link-check preferences will be connected in Phase 6."
        />
      </div>
    </section>
  );
}
