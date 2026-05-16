import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import homeVideo from "../../assets/images/home.mp4";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="hero stacking-root" id="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true"></div>
      <div className="hero__grid" aria-hidden="true"></div>
      <div className="glow-orb glow-orb--purple glow-orb--hero-purple" aria-hidden="true"></div>
      <div className="glow-orb glow-orb--acid glow-orb--hero-acid" aria-hidden="true"></div>

      <div className="container">
        <div className="hero__inner">
          <div className="hero__content">
            <div className="hero__badge" aria-label="Now live">
              <span className="hero__badge-dot" aria-hidden="true"></span>
              {t("landing.hero.badge")}
            </div>

            <h1 className="hero__title" id="hero-title">
              <span className="hero__title-line--acid">{t("landing.hero.titleA")}</span><br />
              <span>{t("landing.hero.titleB")}</span><br />
              <span className="hero__title-line--muted">{t("landing.hero.titleC")}</span>
            </h1>

            <p className="hero__subtitle">{t("landing.hero.subtitle")}</p>

            <div className="hero__actions">
              <button className="btn btn--primary btn--lg" id="get-started-btn">
                {t("landing.hero.primary")}
                <Icon className="hero__action-icon" icon="mdi:arrow-right" aria-hidden="true" />
              </button>
              <button className="btn btn--ghost btn--lg">
                {t("landing.hero.secondary")}
              </button>
            </div>
          </div>

          <div className="hero__video-wrap float-anim" aria-hidden="true">
            <video
              className="hero__video"
              src={homeVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
