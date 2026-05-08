export const metadata = {
  title: 'Cookiebeleid',
  description: 'Het cookiebeleid van The Swedish Glow.',
}

export default function CookiesPage() {
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
        <span className="current">Cookiebeleid</span>
      </div>

      <section className="page-hero">
        <div className="page-hero-eyebrow">Cookies</div>
        <h1>Ons <em>cookiebeleid</em>.</h1>
        <p>Welke cookies we gebruiken en waarom.</p>
      </section>

      <div className="info-content">
        <p><em>Laatst bijgewerkt: 6 mei 2026</em></p>

        <h2>Wat zijn <em>cookies</em>?</h2>
        <p>Cookies zijn kleine tekstbestanden die bij een bezoek aan onze website op je apparaat worden opgeslagen. Ze helpen onze website goed te laten werken en geven ons inzicht in hoe bezoekers de site gebruiken.</p>

        <h2>Welke cookies <em>gebruiken we</em>?</h2>

        <h3>Functionele cookies (altijd actief)</h3>
        <p>Deze cookies zijn noodzakelijk voor het correct functioneren van de website. Denk aan het onthouden van je winkelwagen of inloggegevens. Hier vragen we geen toestemming voor omdat ze essentieel zijn.</p>

        <h3>Analytische cookies (met toestemming)</h3>
        <p>We gebruiken anonieme statistieken om te begrijpen hoe onze site wordt gebruikt. Dit helpt ons de site te verbeteren. We gebruiken hiervoor Google Analytics, geanonimiseerd.</p>

        <h3>Marketing cookies (met toestemming)</h3>
        <p>Voor het tonen van relevante advertenties op andere websites. Alleen actief als je hiervoor expliciet toestemming geeft.</p>

        <h2>Cookies <em>uitschakelen</em></h2>
        <p>Je kunt cookies altijd weigeren of verwijderen via je browserinstellingen. Houd er rekening mee dat sommige delen van de website dan mogelijk niet correct werken.</p>

        <h2>Vragen?</h2>
        <p>Neem <a href="/contact">contact met ons op</a> als je vragen hebt over ons cookiebeleid.</p>
      </div>
    </main>
  )
}
