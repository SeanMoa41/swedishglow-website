export const metadata = {
  title: 'Cookiebeleid',
  description: 'Het cookiebeleid van The Swedish Glow.',
}

export default function CookiesPage() {
  return (
    <main>
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
