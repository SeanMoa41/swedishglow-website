export const metadata = {
  title: 'Reseller Programma',
  description: 'Word partner van The Swedish Glow.',
}

export default function ResellerProgrammaPage() {
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
        <span className="current">Reseller programma</span>
      </div>

      <section className="page-hero">
        <div className="page-hero-eyebrow">Word partner</div>
        <h1>The Swedish Glow <em>voor jouw klanten</em>.</h1>
        <p>Sluit je aan bij honderden professionals — van schoonheidsspecialisten en huidtherapeuten tot plastisch chirurgen, diëtisten en wellness-experts — die The Swedish Glow inzetten als premium aanvulling op hun behandelingen.</p>
      </section>

      <section className="reseller-intro">
        <p className="lead">&quot;Schoonheid begint van binnenuit. Geef je klanten een ritueel dat hun resultaten verlengt.&quot;</p>
        <p>Wij geloven dat huidverbeterende behandelingen krachtiger worden wanneer ze gecombineerd worden met suppletie van binnenuit. Daarom werken we exclusief samen met professionele salons, klinieken en wellness-experts die deze visie delen. Word reseller en ontvang exclusieve voorwaarden, marketingmateriaal en directe ondersteuning.</p>
      </section>

      {/* Stats band */}
      <section className="reseller-stats">
        <div className="reseller-stats-wrap">
          <div className="reseller-stat">
            <div className="num">500<em>+</em></div>
            <div className="label">Aangesloten partners</div>
          </div>
          <div className="reseller-stat">
            <div className="num">23</div>
            <div className="label">Landen wereldwijd</div>
          </div>
          <div className="reseller-stat">
            <div className="num">4,8<em>/5</em></div>
            <div className="label">Gemiddelde klantbeoordeling</div>
          </div>
          <div className="reseller-stat">
            <div className="num">100k<em>+</em></div>
            <div className="label">Tevreden klanten</div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits">
        <div className="benefits-wrap">
          <div className="section-header">
            <div className="eyebrow">Wat krijg je</div>
            <h2>De voordelen voor <em>jou</em>.</h2>
            <p>Een partnerschap dat verder gaat dan alleen producten. Wij investeren in jouw succes.</p>
          </div>
          <div className="benefits-grid">
            <div className="benefit">
              <div className="num">I</div>
              <h4>Exclusieve resellerprijzen</h4>
              <p>Aantrekkelijke marges op alle producten in onze collectie. Hoe meer je groeit, hoe beter de voorwaarden.</p>
            </div>
            <div className="benefit">
              <div className="num">II</div>
              <h4>Premium marketingmateriaal</h4>
              <p>Professionele productfoto&apos;s, video&apos;s, social media templates en flyers — direct beschikbaar voor jouw kanalen.</p>
            </div>
            <div className="benefit">
              <div className="num">III</div>
              <h4>Persoonlijke begeleiding</h4>
              <p>Een vaste contactpersoon die je helpt bij productadvies, training en het uitbreiden van jouw aanbod.</p>
            </div>
            <div className="benefit">
              <div className="num">IV</div>
              <h4>Real-time bestelmodule</h4>
              <p>Toegang tot ons reseller portal: actuele voorraad, snelle bestellingen en automatische facturatie.</p>
            </div>
            <div className="benefit">
              <div className="num">V</div>
              <h4>Productkennistraining</h4>
              <p>Webinars en trainingen over ingrediënten, werking en hoe je The Swedish Glow het beste integreert in jouw behandelingen.</p>
            </div>
            <div className="benefit">
              <div className="num">VI</div>
              <h4>Vermelding op onze website</h4>
              <p>Word vermeld als officieel verkooppunt op onze website — meer zichtbaarheid voor jouw salon bij potentiële klanten.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner types */}
      <section className="partner-types">
        <div className="section-header">
          <div className="eyebrow">Voor wie</div>
          <h2>Past dit bij <em>jouw bedrijf</em>?</h2>
          <p>Wij werken samen met professionals die hun klanten écht resultaat willen geven. Herken je jezelf?</p>
        </div>
        <div className="partner-grid">
          <div className="partner-type">
            <div className="partner-type-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="24" cy="18" r="8"/>
                <path d="M10 38 c0-6 6-10 14-10 s14 4 14 10"/>
              </svg>
            </div>
            <h4>Schoonheidsspecialisten</h4>
            <p>Versterk je gezichtsbehandelingen met suppletie van binnenuit. Verleng resultaten en bind klanten langduriger.</p>
          </div>
          <div className="partner-type">
            <div className="partner-type-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M24 8 c-7 0-12 5-12 12 0 4 2 7 4 9 v9 h16 v-9 c2-2 4-5 4-9 0-7-5-12-12-12z"/>
                <path d="M20 22 l3 3 5-6"/>
              </svg>
            </div>
            <h4>Huidtherapeuten</h4>
            <p>Combineer klinische huidzorg met krachtige interne ondersteuning. Voor zichtbaar én duurzaam resultaat bij je cliënten.</p>
          </div>
          <div className="partner-type">
            <div className="partner-type-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 24 h20 M24 14 v20"/>
                <circle cx="24" cy="24" r="14"/>
              </svg>
            </div>
            <h4>Plastisch chirurgen</h4>
            <p>Optimaliseer hersteltijd en huidkwaliteit rondom ingrepen. Marine collageen ondersteunt het lichaam in elke fase.</p>
          </div>
          <div className="partner-type">
            <div className="partner-type-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8 c4-2 12-2 16 0 v32 c-4-2-12-2-16 0z"/>
                <path d="M22 18 h6 M22 24 h6 M22 30 h4"/>
              </svg>
            </div>
            <h4>Diëtisten &amp; voedingsexperts</h4>
            <p>Vul jouw voedingsadvies aan met premium suppletie. Vloeibare formules met optimale opname voor elk traject.</p>
          </div>
          <div className="partner-type">
            <div className="partner-type-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 6 c0 8 4 12 8 14 4-2 8-6 8-14"/>
                <path d="M14 22 v18 M22 22 v18 M30 22 v18"/>
              </svg>
            </div>
            <h4>Kappers &amp; haarspecialisten</h4>
            <p>Adviseer Nordsilk aan klanten met dunner wordend haar. Een natuurlijk supplement dat van binnenuit voedt en versterkt.</p>
          </div>
          <div className="partner-type">
            <div className="partner-type-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M24 6 c-8 0-14 6-14 14 0 10 14 22 14 22 s14-12 14-22 c0-8-6-14-14-14z"/>
                <path d="M19 18 c2 2 4 2 6 0 1 1 2 2 4 2"/>
              </svg>
            </div>
            <h4>Wellness &amp; spa&apos;s</h4>
            <p>Bied je klanten een complete reset — van massage en huidbehandeling tot een ritueel dat thuis doorgaat.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <div className="how-wrap">
          <div className="how-header">
            <div className="eyebrow">Hoe het werkt</div>
            <h2>Drie stappen naar <em>partnerschap</em>.</h2>
            <p>Een eenvoudig proces. Binnen twee weken kun je The Swedish Glow al aanbieden in jouw praktijk of salon.</p>
          </div>
          <div className="how-steps">
            <div className="how-step">
              <div className="how-step-num">I</div>
              <h4>Aanvraag</h4>
              <p>Vul het korte formulier in. We bekijken jouw aanvraag en nemen binnen twee werkdagen persoonlijk contact met je op.</p>
            </div>
            <div className="how-step">
              <div className="how-step-num">II</div>
              <h4>Kennismaking</h4>
              <p>Een gesprek waarin we elkaars visie verkennen. Wij vertellen over de producten, jij over je praktijk. Geen verplichtingen.</p>
            </div>
            <div className="how-step">
              <div className="how-step-num">III</div>
              <h4>Lancering</h4>
              <p>Toegang tot het reseller portal, je eerste bestelling, marketingmateriaal en een vaste contactpersoon. Jij begint, wij ondersteunen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner quote */}
      <section className="partner-quote">
        <div className="partner-quote-wrap">
          <div className="eyebrow">Wat partners zeggen</div>
          <blockquote>
            Mijn cliënten kwamen voor een gezichtsbehandeling, maar gingen weg met een ritueel.
            Sinds we The Swedish Glow aanbieden, zien we sterkere resultaten — en blijvender.
            Het past bij alles waar onze praktijk voor staat.
          </blockquote>
          <div className="quote-attr">
            <span className="name">Marieke van der Berg</span>
            <span className="role">Huidtherapeut · Praktijk Velvet, Amsterdam</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="reseller-faq">
        <div className="reseller-faq-wrap">
          <div className="reseller-faq-header">
            <div className="eyebrow">Vragen vooraf</div>
            <h2>Veelgestelde <em>vragen</em>.</h2>
          </div>

          <details className="faq-item">
            <summary>Wat zijn de minimale afnamevoorwaarden?</summary>
            <div className="faq-answer">
              We werken zonder vaste minimum-afname per maand. Wel hanteren we een eerste
              introductiebestelling waarmee je de complete collectie in jouw praktijk kunt presenteren.
              De exacte voorwaarden bespreken we tijdens het kennismakingsgesprek — afgestemd op de
              omvang en focus van jouw bedrijf.
            </div>
          </details>

          <details className="faq-item">
            <summary>Krijg ik exclusiviteit in mijn regio?</summary>
            <div className="faq-answer">
              Voor bepaalde categorieën professionals — zoals plastisch chirurgen en huidtherapeuten —
              bieden we regionale exclusiviteit aan. Voor andere partners werken we met een zorgvuldig
              spreidingsbeleid zodat partners elkaar versterken in plaats van beconcurreren.
            </div>
          </details>

          <details className="faq-item">
            <summary>Welke marketing-ondersteuning krijg ik?</summary>
            <div className="faq-answer">
              Je krijgt toegang tot een uitgebreide bibliotheek met professionele productfoto&apos;s,
              social media templates, video&apos;s, flyers en in-store materiaal. Daarnaast bieden we
              op aanvraag op maat gemaakte content voor jouw specifieke kanalen en doelgroep.
            </div>
          </details>

          <details className="faq-item">
            <summary>Hoe werkt het bestelproces?</summary>
            <div className="faq-answer">
              Via ons reseller portal heb je 24/7 toegang tot voorraad, prijzen en je
              bestelhistorie. Bestellingen die voor 14:00 binnenkomen, worden dezelfde dag
              verzonden. Facturatie verloopt automatisch en wordt maandelijks afgehandeld.
            </div>
          </details>

          <details className="faq-item">
            <summary>Krijg ik training over de producten?</summary>
            <div className="faq-answer">
              Ja, alle nieuwe partners worden uitgenodigd voor een uitgebreide product-onboarding.
              Daarnaast organiseren we periodieke webinars, ingrediënt-deep-dives en een jaarlijks
              partner-evenement waarin we de nieuwste ontwikkelingen delen.
            </div>
          </details>

          <details className="faq-item">
            <summary>Wat als een product niet past bij mijn cliënt?</summary>
            <div className="faq-answer">
              We hanteren een coulant retourbeleid voor partners. Onverkochte producten in
              originele verpakking kunnen onder voorwaarden retour, en bij twijfel adviseren we
              je graag persoonlijk welk product het beste aansluit bij jouw cliëntèle.
            </div>
          </details>
        </div>
      </section>

      {/* Application form */}
      <section className="application">
        <div className="application-wrap">
          <h2>Doe een <em>aanvraag</em>.</h2>
          <p>Vul het formulier hieronder in en we nemen binnen 2 werkdagen contact met je op om de mogelijkheden te bespreken.</p>
          <form className="app-form" id="resellerForm">
            <div className="app-row">
              <div className="app-field">
                <label htmlFor="rcompany">Bedrijfsnaam</label>
                <input type="text" id="rcompany" required />
              </div>
              <div className="app-field">
                <label htmlFor="rkvk">KVK nummer</label>
                <input type="text" id="rkvk" required />
              </div>
            </div>
            <div className="app-row">
              <div className="app-field">
                <label htmlFor="rname">Jouw naam</label>
                <input type="text" id="rname" required />
              </div>
              <div className="app-field">
                <label htmlFor="rrole">Functie</label>
                <input type="text" id="rrole" />
              </div>
            </div>
            <div className="app-row">
              <div className="app-field">
                <label htmlFor="remail">E-mailadres</label>
                <input type="email" id="remail" required />
              </div>
              <div className="app-field">
                <label htmlFor="rphone">Telefoonnummer</label>
                <input type="tel" id="rphone" />
              </div>
            </div>
            <div className="app-field">
              <label htmlFor="rtype">Soort bedrijf</label>
              <select id="rtype">
                <option>Schoonheidssalon</option>
                <option>Huidtherapie praktijk</option>
                <option>Plastisch chirurgie / kliniek</option>
                <option>Diëtist / voedingsdeskundige</option>
                <option>Kapsalon</option>
                <option>Wellness / spa</option>
                <option>Online webshop</option>
                <option>Anders</option>
              </select>
            </div>
            <div className="app-field">
              <label htmlFor="rmessage">Bericht (optioneel)</label>
              <textarea id="rmessage" placeholder="Vertel kort iets over jouw bedrijf en waarom je geïnteresseerd bent..."></textarea>
            </div>
            <div className="app-actions">
              <button type="submit" className="btn-primary">Verstuur aanvraag <span className="arrow">→</span></button>
            </div>
          </form>
          <div className="app-success" id="appSuccess">
            <strong>Bedankt voor je aanvraag.</strong><br />
            We hebben je gegevens ontvangen en nemen binnen 2 werkdagen contact met je op.
          </div>
        </div>
      </section>

      {/* CTA block */}
      <section className="cta-block">
        <h2>Al een <em>partner</em>?</h2>
        <p>Log in op het reseller portal voor je actuele voorraad, bestellingen en marketing materiaal.</p>
        <a href="/reseller/register" className="btn-primary">Naar reseller portal <span className="arrow">→</span></a>
      </section>
    </main>
  )
}
