export const metadata = {
  title: 'Contact',
  description: 'Neem contact op met The Swedish Glow.',
}

export default function ContactPage() {
  return (
    <main>
      <div className="breadcrumb">
        <a href="/">Home</a>
        <span className="sep">/</span>
        <span className="current">Contact</span>
      </div>

      <section className="page-hero">
        <div className="page-hero-eyebrow">Contact</div>
        <h1>Laat van je <em>horen</em>.</h1>
        <p>We horen graag van je — over onze producten, je ritueel of een persoonlijk advies. We reageren binnen 24 uur op werkdagen.</p>
      </section>

      <div className="contact-wrap">
        <div className="contact-form-wrap">
          <h2>Stuur een <em>bericht</em>.</h2>
          <p>Vul het formulier hieronder in. We reageren binnen 24 uur op werkdagen.</p>
          <form className="contact-form">
            <div className="row">
              <div className="field">
                <label htmlFor="voornaam">Voornaam</label>
                <input type="text" id="voornaam" required />
              </div>
              <div className="field">
                <label htmlFor="achternaam">Achternaam</label>
                <input type="text" id="achternaam" required />
              </div>
            </div>
            <div className="field">
              <label htmlFor="email">E-mailadres</label>
              <input type="email" id="email" required />
            </div>
            <div className="field">
              <label htmlFor="onderwerp">Onderwerp</label>
              <input type="text" id="onderwerp" />
            </div>
            <div className="field">
              <label htmlFor="bericht">Je bericht</label>
              <textarea id="bericht" required></textarea>
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '12px', alignSelf: 'flex-start' }}>Verstuur <span className="arrow">→</span></button>
          </form>
        </div>

        <aside className="contact-info">
          <h3>Andere manieren om ons te bereiken</h3>
          <div className="contact-info-block">
            <div className="label">E-mail</div>
            <div className="value"><a href="mailto:hello@theswedishglow.com">hello@theswedishglow.com</a></div>
          </div>
          <div className="contact-info-block">
            <div className="label">WhatsApp</div>
            <div className="value"><a href="https://wa.me/+31630537452">+31 6 30 53 74 52</a></div>
          </div>
          <div className="contact-info-block">
            <div className="label">Bereikbaar</div>
            <div className="value">Maandag t/m vrijdag<br />09.00 — 17.00 uur</div>
          </div>
          <div className="contact-info-block">
            <div className="label">Volg ons</div>
            <div className="value">
              <a href="https://www.instagram.com/theswedishglow/">Instagram</a> ·{' '}
              <a href="https://www.facebook.com/theswedishglow">Facebook</a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
