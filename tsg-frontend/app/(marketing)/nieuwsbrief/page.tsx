export const metadata = {
  title: 'Nieuwsbrief',
  description: 'Meld je aan voor de TSG nieuwsbrief.',
}

export default function NieuwsbriefPage() {
  return (
    <main>
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
