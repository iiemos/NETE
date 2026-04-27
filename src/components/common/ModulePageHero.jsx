import { Icon } from "@iconify/react";

export default function ModulePageHero({
  title,
  subtitle,
  eyebrow,
  meta,
  stats = [],
  actions,
  compact = false,
  showArt = true,
}) {
  return (
    <header className={compact ? "module-hero module-hero--compact" : "module-hero"}>
      <div className="module-hero__inner">
        <div className="module-hero__left">
          {eyebrow ? <div className="module-hero__eyebrow">{eyebrow}</div> : null}
          <h1 className="module-hero__title">{title}</h1>
          {subtitle ? <p className="module-hero__subtitle">{subtitle}</p> : null}
          {meta ? <p className="module-hero__meta">{meta}</p> : null}

          {stats.length > 0 ? (
            <div className="module-hero__stats">
              {stats.map((item) => (
                <article key={item.label} className="module-hero__stat-card">
                  <div className="module-hero__stat-label">
                    {item.label}
                    {item.tip ? (
                      <Icon className="module-hero__stat-tip" icon="mdi:help-circle-outline" aria-hidden="true" />
                    ) : null}
                  </div>
                  <div className="module-hero__stat-value">{item.value}</div>
                </article>
              ))}
            </div>
          ) : null}

          {actions ? <div className="module-hero__actions">{actions}</div> : null}
        </div>

        {showArt ? (
          <div className="module-hero__art" aria-hidden="true">
            <span className="module-hero__pillar module-hero__pillar--1"></span>
            <span className="module-hero__pillar module-hero__pillar--2"></span>
            <span className="module-hero__pillar module-hero__pillar--3"></span>
            <span className="module-hero__coin module-hero__coin--1"></span>
            <span className="module-hero__coin module-hero__coin--2"></span>
            <span className="module-hero__coin module-hero__coin--3"></span>
          </div>
        ) : null}
      </div>
    </header>
  );
}
