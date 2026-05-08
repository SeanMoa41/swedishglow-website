export const metadata = {
  title: 'Nieuwsbrief',
  description: 'Meld je aan voor de TSG nieuwsbrief.',
}

export default function NieuwsbriefPage() {
  return (
    <main>
      {/* Mobile menu overlay */}
      <div className="mobile-menu" id="mobile-menu" aria-hidden="true">
        <div className="mobile-menu-header">
          <span className="mobile-menu-title">Menu</span>
          <button className="mobile-menu-close" aria-label="Menu sluiten">&times;</button>
        </div>
        <nav className="mobile-menu-nav" aria-label="Mobile navigation">
          <a href="/shop">Shop</a>
          <a href="/supplementen">Supplementen</a>
          <div className="mobile-menu-sublist">
            <a href="/marine-collageen">— Marine Collageen 13.000</a>
            <a href="/nordsilk">— Nordsilk</a>
            <a href="/freja">— FREJA</a>
            <a href="/hermade">— HÉRMADE</a>
            <a href="/#100-dagen-kuur">— 100-dagen kuur</a>
          </div>
          <a href="/stories">Stories</a>
          <a href="/over-ons">Ons verhaal</a>
          <a href="/reseller-programma">Reseller programma</a>
          <div className="mobile-menu-divider"></div>
          <a href="/mijn-account">Mijn account</a>
          <a href="/winkelwagen">Winkelwagen</a>
          <a href="/reseller/login">Login resellers</a>
        </nav>
      </div>

      <div className="breadcrumb">
        <a href="/">Home</a>
        <span className="sep">/</span>
        <span className="current">Nieuwsbrief</span>
      </div>

      <section className="page-hero">
        <div className="page-hero-eyebrow">Word lid</div>
        <h1>Onze <em>nieuwsbrief</em>.</h1>
        <p>Eens per maand een editie vol verhalen, rituelen en exclusieve aanbiedingen — direct in je inbox.</p>
      </section>

      <section className="newsletter-content">
        <p>De Swedish Glow nieuwsbrief is geen reclamemail. Het is een editie. Een verhaal van Elin over haar laatste ontdekking, een artikel over wat collageen écht doet, soms een persoonlijke aanbieding voor onze trouwe lezers. Niet meer dan eens per maand — beloofd.</p>

        <div className="newsletter-perks">
          <div className="newsletter-perk">
            <div className="num">I</div>
            <h4>Verhalen, geen reclame</h4>
            <p>Diepgaande artikelen over rituelen, ingrediënten en welzijn.</p>
          </div>
          <div className="newsletter-perk">
            <div className="num">II</div>
            <h4>Vroege toegang</h4>
            <p>Wees als eerste bij nieuwe lanceringen — zoals FREJA.</p>
          </div>
          <div className="newsletter-perk">
            <div className="num">III</div>
            <h4>Exclusieve aanbiedingen</h4>
            <p>Speciale prijzen voor lezers, niet beschikbaar op de website.</p>
          </div>
        </div>

        <div className="newsletter-form-wrap">
          <form className="newsletter-form">
            <input type="email" placeholder="Jouw e-mailadres" required />
            <button type="submit">Inschrijven →</button>
          </form>
          <p className="newsletter-disclaimer">Je kan je op elk moment uitschrijven. We delen je gegevens nooit met derden.</p>
        </div>
      </section>
    </main>
  )
}
