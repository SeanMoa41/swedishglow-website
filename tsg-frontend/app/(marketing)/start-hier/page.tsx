export const metadata = {
  title: 'Start Hier',
  description: 'Ontdek welk TSG ritueel bij jou past.',
}

export default function StartHierPage() {
  return (
    <main>
      {/* Portal Hero */}
      <header className="portal-hero">
        <div className="portal-hero-content">
          <div className="portal-eyebrow">Start hier</div>
          <h1>The Swedish <em>Glow</em></h1>
          <p>Ontdek welk ritueel het beste bij jou past, of blader door onze complete collectie supplementen.</p>
          <a href="/" className="portal-cta">Naar de homepage <span className="arrow">→</span></a>
        </div>
      </header>

      {/* Section: Main pages */}
      <section className="portal-section">
        <div className="section-title">
          <div className="section-title-eyebrow">Begin hier</div>
          <h2>De <em>kern</em> van de site</h2>
        </div>
        <div className="page-grid">
          <a href="/" className="page-card">
            <div className="page-card-header">
              <div className="page-num">★</div>
              <div className="page-tag tag-bestseller">Hoofdpagina</div>
            </div>
            <div className="page-card-body">
              <h3>Homepage</h3>
              <p>De volledige homepage met hero, magazine split, rituelen, quiz en signature 100-dagen sectie.</p>
              <div className="page-card-cta">Bekijk <span>→</span></div>
            </div>
          </a>

          <a href="/over-ons" className="page-card">
            <div className="page-card-header">
              <div className="page-num">II</div>
              <div className="page-tag">Story</div>
            </div>
            <div className="page-card-body">
              <h3>Ons verhaal</h3>
              <p>Het verhaal van Elin Hellqvist-Moayedi en de oorsprong van The Swedish Glow op het eiland Brännö.</p>
              <div className="page-card-cta">Lees verder <span>→</span></div>
            </div>
          </a>

          <a href="/shop" className="page-card">
            <div className="page-card-header">
              <div className="page-num">III</div>
              <div className="page-tag">Catalogus</div>
            </div>
            <div className="page-card-body">
              <h3>Shop / Supplementen</h3>
              <p>De volledige collectie premium vloeibare supplementen — vier rituelen, één toewijding.</p>
              <div className="page-card-cta">Bekijk collectie <span>→</span></div>
            </div>
          </a>

          <a href="/stories" className="page-card">
            <div className="page-card-header">
              <div className="page-num">IV</div>
              <div className="page-tag">Blog</div>
            </div>
            <div className="page-card-body">
              <h3>Stories &amp; inzichten</h3>
              <p>Verhalen over rituelen, ingrediënten en de wetenschap achter The Swedish Glow.</p>
              <div className="page-card-cta">Lees stories <span>→</span></div>
            </div>
          </a>
        </div>
      </section>

      {/* Section: Products */}
      <section className="portal-section">
        <div className="section-title">
          <div className="section-title-eyebrow">De producten</div>
          <h2>Alle <em>vier</em> rituelen</h2>
        </div>
        <div className="page-grid">
          <a href="/marine-collageen" className="page-card">
            <div className="page-card-header">
              <div className="page-num">I</div>
              <div className="page-tag tag-bestseller">Bestseller</div>
            </div>
            <div className="page-card-body">
              <h3>Marine Collageen 13.000</h3>
              <p>Het ochtendritueel. Vloeibare premium viscollageen — 13.000 mg per shot voor stevigheid en glow van binnenuit.</p>
              <div className="page-card-cta">Vanaf €59 <span>→</span></div>
            </div>
          </a>

          <a href="/nordsilk" className="page-card">
            <div className="page-card-header">
              <div className="page-num">II</div>
              <div className="page-tag tag-new">Vegan</div>
            </div>
            <div className="page-card-body">
              <h3>Nordsilk</h3>
              <p>Het haarritueel. Voedt haar, hoofdhuid en nagels van binnenuit met vitamine C, silicium en biotine.</p>
              <div className="page-card-cta">Vanaf €47 <span>→</span></div>
            </div>
          </a>

          <a href="/freja" className="page-card">
            <div className="page-card-header">
              <div className="page-num">III</div>
              <div className="page-tag tag-soon">Coming soon</div>
            </div>
            <div className="page-card-body">
              <h3>FREJA</h3>
              <p>Het basisritueel. Premium vloeibare Omega 3 uit de Noordzee — schrijf je in voor de wachtlijst.</p>
              <div className="page-card-cta">Wachtlijst <span>→</span></div>
            </div>
          </a>

          <a href="/hermade" className="page-card">
            <div className="page-card-header">
              <div className="page-num">IV</div>
              <div className="page-tag">Exclusive</div>
            </div>
            <div className="page-card-body">
              <h3>HÉRMADE</h3>
              <p>Het maandritueel. 30 sticks voor energie, balans en innerlijke rust tijdens de overgang.</p>
              <div className="page-card-cta">€39 <span>→</span></div>
            </div>
          </a>
        </div>
      </section>

      {/* Section: Reseller */}
      <section className="portal-section">
        <div className="section-title">
          <div className="section-title-eyebrow">Voor partners</div>
          <h2>Het <em>reseller</em> programma</h2>
        </div>
        <div className="page-grid">
          <a href="/reseller-programma" className="page-card">
            <div className="page-card-header">
              <div className="page-num">V</div>
              <div className="page-tag">Voor partners</div>
            </div>
            <div className="page-card-body">
              <h3>Reseller programma</h3>
              <p>Word officieel partner. Voor schoonheidsspecialisten, kappers en wellness-professionals — met aanvraagformulier.</p>
              <div className="page-card-cta">Word partner <span>→</span></div>
            </div>
          </a>

          <a href="/reseller/login" className="page-card">
            <div className="page-card-header">
              <div className="page-num">VI</div>
              <div className="page-tag tag-bestseller">Login</div>
            </div>
            <div className="page-card-body">
              <h3>Reseller portal</h3>
              <p>Login voor bestaande resellers. Toegang tot het partner portal met voorraad, marketing en bestellingen.</p>
              <div className="page-card-cta">Inloggen <span>→</span></div>
            </div>
          </a>
        </div>
      </section>

      {/* Section: Klantenservice */}
      <section className="portal-section">
        <div className="section-title">
          <div className="section-title-eyebrow">Klantenservice</div>
          <h2>Service &amp; <em>support</em></h2>
        </div>
        <div className="page-grid">
          <a href="/contact" className="page-card">
            <div className="page-card-header">
              <div className="page-num">VII</div>
              <div className="page-tag">Contact</div>
            </div>
            <div className="page-card-body">
              <h3>Neem contact op</h3>
              <p>Contactformulier, e-mail, WhatsApp en openingstijden — wij staan voor je klaar.</p>
              <div className="page-card-cta">Bekijk <span>→</span></div>
            </div>
          </a>

          <a href="/nieuwsbrief" className="page-card">
            <div className="page-card-header">
              <div className="page-num">X</div>
              <div className="page-tag">Newsletter</div>
            </div>
            <div className="page-card-body">
              <h3>Nieuwsbrief</h3>
              <p>Inschrijfpagina voor de maandelijkse nieuwsbrief met drie voordelen-perks.</p>
              <div className="page-card-cta">Bekijk <span>→</span></div>
            </div>
          </a>

          <a href="/levering" className="page-card">
            <div className="page-card-header">
              <div className="page-num">XI</div>
              <div className="page-tag">Service</div>
            </div>
            <div className="page-card-body">
              <h3>Levering &amp; retour</h3>
              <p>Verzending, levertijden per land, verzendkosten en retourbeleid uitgewerkt.</p>
              <div className="page-card-cta">Bekijk <span>→</span></div>
            </div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="portal-footer">
        <div className="portal-footer-wrap">
          <h3>The Swedish <em>Glow</em></h3>
          <p>Een Nederlands familiemerk met Zweedse roots. Premium vloeibare supplementen voor elke vrouw die haar lichaam serieus neemt.</p>
          <div className="legal-links">
            <a href="/voorwaarden">Algemene Voorwaarden</a>
            <a href="/privacy">Privacy Statement</a>
            <a href="/cookies">Cookiebeleid</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
