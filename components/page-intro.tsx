type PageIntroProps = {
  title: string;
  description: string;
  eyebrow?: string;
};

export function PageIntro({
  eyebrow,
  title,
  description,
}: PageIntroProps) {
  return (
    <div className="max-w-3xl space-y-3 pt-2">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.34em] text-sky-600">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
        {title}
      </h1>
      <p className="text-base leading-8 text-slate-600 sm:text-lg">{description}</p>
    </div>
  );
}
