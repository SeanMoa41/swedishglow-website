export const metadata = {
  title: 'Privacybeleid',
  description: 'Het privacybeleid van The Swedish Glow.',
}

export default function PrivacyPage() {
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
        <span className="current">Privacy Statement</span>
      </div>

      <section className="page-hero">
        <div className="page-hero-eyebrow">Privacy</div>
        <h1>Privacy <em>Statement</em>.</h1>
        <p>Hoe we omgaan met jouw persoonsgegevens, helder en eerlijk uitgelegd.</p>
      </section>

      <div className="info-content">
        <p><em>Laatst bijgewerkt: 6 mei 2026</em></p>

        <h2>Welke <em>gegevens</em> verzamelen we?</h2>
        <p>We verzamelen alleen de gegevens die we nodig hebben om jou goed te kunnen helpen:</p>
        <ul>
          <li>Naam, adres, e-mailadres en telefoonnummer (voor het verwerken van bestellingen)</li>
          <li>Betalingsgegevens (verwerkt door beveiligde betalingsproviders)</li>
          <li>Bestelhistorie en accountgegevens (als je een account aanmaakt)</li>
          <li>Anonieme websitestatistieken (om onze site te verbeteren)</li>
        </ul>

        <h2>Hoe gebruiken we <em>jouw gegevens</em>?</h2>
        <p>We gebruiken jouw gegevens uitsluitend voor:</p>
        <ul>
          <li>Het verwerken en verzenden van je bestellingen</li>
          <li>Het beantwoorden van je vragen</li>
          <li>Het verzenden van onze nieuwsbrief (alleen als je je daarvoor hebt aangemeld)</li>
          <li>Het verbeteren van onze website en producten</li>
        </ul>

        <h2>Delen we jouw <em>gegevens</em>?</h2>
        <p>Nee. We verkopen je gegevens nooit aan derden. We delen alleen wat strikt noodzakelijk is met onze betalings- en verzendpartners.</p>

        <h2>Jouw <em>rechten</em></h2>
        <p>Je hebt het recht je gegevens in te zien, te wijzigen of te laten verwijderen. Stuur een e-mail naar <a href="mailto:hello@theswedishglow.com">hello@theswedishglow.com</a> en we regelen het binnen 30 dagen.</p>

        <h2>Hoe lang <em>bewaren</em> we gegevens?</h2>
        <p>Bestelgegevens bewaren we 7 jaar conform de Nederlandse fiscale wetgeving. Account- en marketinggegevens bewaren we zolang je actief bent en kun je op elk moment laten verwijderen.</p>
      </div>
    </main>
  )
}
