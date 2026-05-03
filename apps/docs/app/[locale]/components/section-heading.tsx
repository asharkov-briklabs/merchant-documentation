interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  mb?: "md" | "none";
}

export function SectionHeading({ eyebrow, title, mb = "md" }: SectionHeadingProps) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#2a9d90] mb-2">
        {eyebrow}
      </div>
      <h2
        className={[
          "text-2xl font-semibold text-vinr-700",
          mb === "md" ? "mb-8" : "mb-0",
        ].join(" ")}
      >
        {title}
      </h2>
    </div>
  );
}
