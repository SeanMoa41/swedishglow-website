export const metadata = {
  title: 'FREJA',
  description: 'Plantaardige Omega 3 essence met vitamines A, D3, E en K2.',
}

export default function FrejaPage() {
  return (
    <main>
      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <a href="/">Home</a>
        <span className="sep">/</span>
        <a href="/supplementen">Supplementen</a>
        <span className="sep">/</span>
        <span className="current">FREJA</span>
      </div>

      {/* PRODUCT HERO */}
      <section className="product-hero">
        <div className="product-hero-image">
          <span className="roman">III</span>
          <img src="/images/freja.jpg" alt="FREJA — Het basisritueel van The Swedish Glow" />
        </div>
        <div className="product-hero-content">
          <div className="product-hero-eyebrow">COMING SOON · HET BASISRITUEEL</div>
          <h1>FREJA</h1>
          <p className="product-hero-tagline">Premium vloeibare Omega 3 uit Noordzee-vis</p>
          <p className="product-hero-lead">Het fundament onder elk ritueel. Hoog gedoseerde EPA en DHA voor hart, brein en huid.</p>
          <div className="product-trust">
            <span><span className="star">★★★★★</span> 4,8 op Trustpilot</span>
            <span className="dot">·</span>
            <span>100.000+ vrouwen</span>
            <span className="dot">·</span>
            <span>Made in Sweden</span>
          </div>

          <div className="coming-soon-block">
            <div className="cs-eyebrow">Coming soon</div>
            <h3>FREJA arriveert binnenkort</h3>
            <p>Onze nieuwe vlaggenschip Omega 3 is in finale productie. Schrijf je in voor de wachtlijst en ontvang als eerste bericht zodra de eerste flessen klaar zijn.</p>
            <form className="cs-form">
              <input type="email" placeholder="Jouw e-mailadres" required />
              <button type="submit">Schrijf me in <span className="arrow">→</span></button>
              <div className="cs-success" hidden>✓ Je staat op de wachtlijst. We sturen bericht zodra FREJA verkrijgbaar is.</div>
            </form>
            <div className="cs-meta">
              <span>Geen verplichtingen</span>
              <span className="dot">·</span>
              <span>Eerste 100 inschrijvers krijgen exclusieve early-access</span>
            </div>
          </div>
        </div>
      </section>

      {/* USPS BAND */}
      <section className="usps-band">
        <div className="usps-grid">
          <div className="usp-item">
            <div className="usp-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 24 c4-8 12-12 22-12 6 0 10 4 10 12 0 8-4 12-10 12-10 0-18-4-22-12z" />
                <path d="M30 18 a2 2 0 1 1 0 4" fill="currentColor" opacity="0.4" />
                <path d="M8 24 c-2-3-2-6 0-9 m0 18 c-2-3-2-6 0-9" opacity="0.5" />
              </svg>
            </div>
            <h4>Premium Noordzee-vis</h4>
            <p>Hoog gedoseerde EPA en DHA uit duurzame visserij.</p>
          </div>
          <div className="usp-item">
            <div className="usp-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M24 38 C12 30 6 22 6 16 c0-5 4-8 8-8 4 0 8 4 10 8 2-4 6-8 10-8 4 0 8 3 8 8 0 6-6 14-18 22z" />
                <path d="M14 22 l4 0 2-4 3 8 3-6 2 2 4 0" opacity="0.5" />
              </svg>
            </div>
            <h4>Voor hart en brein</h4>
            <p>EPA en DHA dragen bij aan een normaal functionerend hart en hersenen.</p>
          </div>
          <div className="usp-item">
            <div className="usp-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M24 6 L8 14 v10 c0 9 7 17 16 20 9-3 16-11 16-20 V14 L24 6z" />
                <path d="M19 22 l4 4 8-9" strokeWidth="1.4" />
              </svg>
            </div>
            <h4>Made in Sweden</h4>
            <p>Geproduceerd onder de strengste Zweedse kwaliteitsnormen.</p>
          </div>
          <div className="usp-item">
            <div className="usp-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="24" cy="24" r="16" />
                <path d="M16 24 c4-2 8-2 8 0 0 2 4 2 8 0" opacity="0.6" />
                <path d="M16 30 c4-2 8-2 8 0 0 2 4 2 8 0" opacity="0.4" />
              </svg>
            </div>
            <h4>Schone formule</h4>
            <p>Non-GMO en vrij van GMO, gluten en suiker.</p>
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="product-description">
        <div className="product-description-image">
          <img src="/images/freja.jpg" alt="FREJA lifestyle" />
        </div>
        <div className="product-description-content">
          <div className="eyebrow">Het verhaal</div>
          <h2>Niet zomaar een <em>supplement</em>.</h2>
          <p>FREJA is onze nieuwe vlaggenschip Omega 3 — een premium vloeibare formule uit duurzame Noordzee-visserij. Met een hoge concentratie EPA en DHA, de vetzuren die je lichaam zelf niet kan aanmaken maar wel hard nodig heeft.</p>
          <p>Omega 3 is meer dan een huid-supplement. Het is het fundament onder algeheel welzijn. EPA en DHA dragen bij aan het normaal functioneren van je hart, ondersteunen je hersenen en helpen je huid van binnenuit voeden. Het rituaal waarop alle andere rituelen rusten.</p>
          <p>FREJA is binnenkort verkrijgbaar. Schrijf je in voor de wachtlijst en ontvang een persoonlijke uitnodiging zodra de eerste flessen klaar zijn voor verzending.</p>
        </div>
      </section>

      {/* INGREDIENTS */}
      <section className="ingredients-section">
        <div className="ingredients-wrap">
          <div className="section-header-center">
            <div className="eyebrow">Wat zit erin</div>
            <h2>Een <em>complete</em> formule.</h2>
            <p>Zorgvuldig samengesteld in Zweden, met de hoogste kwaliteit ingrediënten.</p>
          </div>
          <div className="ingredients-list">
            <div className="ingredient-row">
              <div className="ingredient-name">EPA &amp; DHA</div>
              <div className="ingredient-detail">Hoog gedoseerde Omega 3 vetzuren uit duurzame Noordzee-vis</div>
            </div>
            <div className="ingredient-row">
              <div className="ingredient-name">Vitamine A</div>
              <div className="ingredient-detail">Voor de natuurlijke werking van de huid</div>
            </div>
            <div className="ingredient-row">
              <div className="ingredient-name">Vitamine D3</div>
              <div className="ingredient-detail">Ondersteunt botten en immuunsysteem</div>
            </div>
            <div className="ingredient-row">
              <div className="ingredient-name">Vitamine E</div>
              <div className="ingredient-detail">Antioxidant — beschermt cellen tegen oxidatieve schade</div>
            </div>
            <div className="ingredient-row">
              <div className="ingredient-name">Vitamine K2</div>
              <div className="ingredient-detail">Ondersteunt natuurlijke bot- en bloedvatfunctie</div>
            </div>
          </div>
        </div>
      </section>

      {/* USAGE */}
      <section className="usage-section">
        <div className="usage-wrap">
          <div className="section-header-center">
            <div className="eyebrow">Hoe gebruik je het</div>
            <h2>Een <em>simpel</em> ritueel.</h2>
          </div>
          <div className="usage-grid">
            <div className="usage-item">
              <div className="label">Dosering</div>
              <div className="value">Volgt bij lancering</div>
            </div>
            <div className="usage-item">
              <div className="label">Wanneer</div>
              <div className="value">&apos;s Ochtends bij de maaltijd</div>
            </div>
            <div className="usage-item">
              <div className="label">Duur</div>
              <div className="value">Volgt bij lancering</div>
            </div>
          </div>
          <p className="usage-tip">Volledige gebruiksinstructies volgen zodra FREJA verkrijgbaar is.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="product-faq">
        <div className="faq-wrap">
          <div className="section-header-center">
            <div className="eyebrow">Veelgestelde vragen</div>
            <h2>Alles wat je wilt <em>weten</em>.</h2>
          </div>
          <div className="faq-list">
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">Wanneer is FREJA verkrijgbaar?<span className="icon">+</span></button>
              <div className="faq-answer"><p>FREJA is in finale productie. Schrijf je in voor de wachtlijst en je ontvangt als eerste bericht zodra de eerste flessen klaar zijn voor verzending.</p></div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">Wat is het verschil tussen FREJA en Plantique Omega 3?<span className="icon">+</span></button>
              <div className="faq-answer"><p>FREJA is onze nieuwe vlaggenschip Omega 3, een premium vloeibare formule uit duurzame Noordzee-vis met hoge concentratie EPA en DHA. Plantique was onze plantaardige Omega 3 uit algen, die we momenteel uitfaseren. FREJA biedt een hogere concentratie EPA en DHA en is onze nieuwe standaard voor het basisritueel.</p></div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">Is FREJA geschikt voor vegetariërs?<span className="icon">+</span></button>
              <div className="faq-answer"><p>FREJA bevat ingrediënten uit vis en is daarom niet vegetarisch. Voor een plantaardige optie verwijzen we je naar onze andere supplementen.</p></div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">Wat is een goede prijs?<span className="icon">+</span></button>
              <div className="faq-answer"><p>Prijs en variaties worden bekend gemaakt bij lancering. Inschrijven voor de wachtlijst geeft je toegang tot exclusieve early-access voorwaarden.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* CROSS-SELL */}
      <section className="cross-sell-section">
        <div className="cross-sell-wrap">
          <div className="section-header-center">
            <div className="eyebrow">Past goed bij dit ritueel</div>
            <h2>Combineer met <em>andere rituelen</em>.</h2>
          </div>
          <div className="cross-sell-grid">
            <a href="/marine-collageen" className="cross-sell-card">
              <div className="cross-sell-image">
                <img src="/images/marine-collageen-13000-lifestyle.jpg" alt="Marine Collageen 13.000" />
              </div>
              <div className="cross-sell-info">
                <div className="cross-sell-tag">Het ochtendritueel</div>
                <h4>Marine Collageen 13.000</h4>
                <p>De bestseller. Voor stevigheid, hydratatie en glow van binnenuit.</p>
                <div className="cross-sell-cta">Vanaf €59 <span>→</span></div>
              </div>
            </a>
            <a href="/nordsilk" className="cross-sell-card">
              <div className="cross-sell-image">
                <img src="/images/nordsilk.jpg" alt="Nordsilk" />
              </div>
              <div className="cross-sell-info">
                <div className="cross-sell-tag">Het haarritueel</div>
                <h4>Nordsilk</h4>
                <p>Voor wie merkt dat haar dunner wordt. Voedt haar, hoofdhuid en nagels van binnenuit.</p>
                <div className="cross-sell-cta">Vanaf €47 <span>→</span></div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
