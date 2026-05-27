import { Leaf, Sparkles, Waves } from "lucide-react";

function Hero() {
  return (
    <section className="hero hero-centered" id="home">
      <div className="hero-bg-shape hero-bg-one"></div>
      <div className="hero-bg-shape hero-bg-two"></div>
      <div className="hero-bg-shape hero-bg-three"></div>

      <div className="hero-brand-card">
        <div className="hero-logo-wrap">
          <div className="hero-logo">
            <Leaf size={34} />
          </div>

          <div className="hero-logo-small hero-logo-small-left">
            <Sparkles size={18} />
          </div>

          <div className="hero-logo-small hero-logo-small-right">
            <Waves size={18} />
          </div>
        </div>

        <h2 className="hero-brand-title">SAAF</h2>

        <p className="hero-brand-tagline">Small steps to a calmer mind.</p>

        <p className="hero-brand-desc">
          A gentle support app designed to help track daily progress, reduce
          stress, and encourage calm routines for people facing obsessive
          cleaning thoughts.
        </p>
      </div>
    </section>
  );
}

export default Hero;