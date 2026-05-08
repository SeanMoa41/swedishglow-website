export const metadata = {
  title: 'Levering',
  description: 'Informatie over levering en verzending.',
}

export default function LeveringPage() {
  return (
    <main>
      <div className="breadcrumb">
        <a href="/">Home</a>
        <span className="sep">/</span>
        <span className="current">Levering &amp; Retour</span>
      </div>

      <section className="page-hero">
        <div className="page-hero-eyebrow">Klantenservice</div>
        <h1>Levering &amp; <em>Retour</em>.</h1>
        <p>Alles over verzending, levertijden en hoe je producten kunt retourneren.</p>
      </section>

      <div className="info-content">
        <h2><em>Levering</em></h2>
        <p>We versturen alle bestellingen vanaf onze logistieke partner in Nederland. Bestellingen geplaatst voor 17.00 uur op werkdagen worden dezelfde dag verzonden.</p>

        <h3>Levertijden</h3>
        <ul>
          <li><strong>Nederland</strong>: 1-2 werkdagen via PostNL</li>
          <li><strong>België &amp; Luxemburg</strong>: 2-3 werkdagen</li>
          <li><strong>Duitsland</strong>: 2-4 werkdagen</li>
          <li><strong>Overig EU</strong>: 3-7 werkdagen</li>
          <li><strong>Buiten EU</strong>: 5-14 werkdagen, neem voor specifieke landen contact op</li>
        </ul>

        <h3>Verzendkosten</h3>
        <ul>
          <li>Nederland: <strong>€4,95</strong> — gratis vanaf <strong>€60</strong></li>
          <li>België: <strong>€7,50</strong> — gratis vanaf <strong>€80</strong></li>
          <li>Duitsland: <strong>€9,95</strong> — gratis vanaf <strong>€100</strong></li>
        </ul>

        <h2><em>Retourneren</em></h2>
        <p>Je hebt het recht om binnen 14 dagen na ontvangst zonder opgave van redenen je bestelling te retourneren. Voor onze voedingssupplementen geldt:</p>
        <ul>
          <li><strong>Ongeopende producten</strong>: kunnen kosteloos retour binnen 14 dagen</li>
          <li><strong>Geopende voedingssupplementen</strong>: kunnen om hygiënische redenen niet retour worden genomen</li>
        </ul>

        <h3>Hoe retourneren?</h3>
        <ol>
          <li>Stuur een e-mail naar <a href="mailto:hello@theswedishglow.com">hello@theswedishglow.com</a> met je bestelnummer</li>
          <li>Je ontvangt binnen 24 uur een retourlabel en instructies</li>
          <li>Verstuur het pakket binnen 14 dagen</li>
          <li>Wij verwerken je terugbetaling binnen 7 werkdagen na ontvangst</li>
        </ol>

        <h2>Vragen?</h2>
        <p>Mail naar <a href="mailto:hello@theswedishglow.com">hello@theswedishglow.com</a> of stuur een WhatsApp naar <a href="https://wa.me/+31630537452">+31 6 30 53 74 52</a>.</p>
      </div>
    </main>
  )
}
