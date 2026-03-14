import { PageIntro } from "@/components/page-intro";
import { PlaceholderCard } from "@/components/placeholder-card";

export default function OutputPage() {
  return (
    <section className="space-y-8">
      <PageIntro
        title="HTML Output"
        description="Review and export your generated email code with a clean workspace for copy, download, and minified output."
      />

      <PlaceholderCard
        title="Output workspace prepared"
        description="This page will show generated and minified HTML, export actions, and code viewing once the conversion flow is added."
      />
    </section>
  );
}
