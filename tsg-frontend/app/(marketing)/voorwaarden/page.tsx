export const metadata = {
  title: 'Algemene Voorwaarden',
  description: 'De algemene voorwaarden van The Swedish Glow.',
}

export default function VoorwaardenPage() {
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
        <span className="current">Algemene Voorwaarden</span>
      </div>

      <section className="page-hero">
        <div className="page-hero-eyebrow">Juridisch</div>
        <h1>Algemene <em>Voorwaarden</em>.</h1>
        <p>Onze voorwaarden voor het gebruik van deze website en de aankoop van onze producten.</p>
      </section>

      <div className="info-content">
        <p><em>Laatst bijgewerkt: 6 mei 2026</em></p>

        <h2>1. <em>Toepasselijkheid</em></h2>
        <p>Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen van The Swedish Glow en op alle overeenkomsten tussen The Swedish Glow en haar klanten. Door een bestelling te plaatsen, ga je akkoord met deze voorwaarden.</p>

        <h2>2. <em>Bestellingen</em></h2>
        <p>Een overeenkomst komt tot stand op het moment dat je een bestelling plaatst en wij je bestelling per e-mail bevestigen. We behouden ons het recht voor bestellingen zonder opgaaf van redenen te weigeren.</p>

        <h2>3. <em>Prijzen en betaling</em></h2>
        <p>Alle prijzen op onze website zijn in Euro&apos;s, inclusief BTW en exclusief eventuele verzendkosten. We accepteren betaling via iDEAL, Bancontact, creditcard, PayPal en Klarna.</p>

        <h2>4. <em>Levering</em></h2>
        <p>We streven ernaar je bestelling binnen 1-2 werkdagen te leveren. Voor uitgebreide informatie verwijzen we naar onze <a href="/levering">leverings- en retourvoorwaarden</a>.</p>

        <h2>5. <em>Herroepingsrecht</em></h2>
        <p>Je hebt het recht om binnen 14 dagen na ontvangst zonder opgave van redenen je bestelling te retourneren. Geopende voedingssupplementen kunnen om hygiënische redenen niet retour worden genomen.</p>

        <h2>6. <em>Garantie en aansprakelijkheid</em></h2>
        <p>We staan garant voor de kwaliteit van onze producten. Onze producten zijn voedingssupplementen en geen vervanging voor medische behandelingen. Bij twijfel raadpleeg altijd je arts.</p>

        <h2>7. <em>Privacy</em></h2>
        <p>Voor informatie over hoe we omgaan met je persoonsgegevens verwijzen we naar ons <a href="/privacy">privacy statement</a>.</p>

        <h2>8. <em>Contact</em></h2>
        <p>Vragen over deze voorwaarden? Neem <a href="/contact">contact met ons op</a>.</p>
      </div>
    </main>
  )
}
