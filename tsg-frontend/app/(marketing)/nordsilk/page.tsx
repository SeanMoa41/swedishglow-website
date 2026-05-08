export const metadata = {
  title: 'Nordsilk',
  description: 'Voedend ritueel voor sterk en glanzend haar, met biotine en zink.',
}

export default function NordsilkPage() {
  return (
    <main>
      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <a href="/">Home</a>
        <span className="sep">/</span>
        <a href="/supplementen">Supplementen</a>
        <span className="sep">/</span>
        <span className="current">Nordsilk</span>
      </div>

      {/* PRODUCT HERO */}
      <section className="product-hero">
        <div className="product-hero-image">
          <span className="roman">II</span>
          <img src="/images/nordsilk-het-haarritueel-van-the-swedish-glow.jpg" alt="Nordsilk — Het haarritueel van The Swedish Glow" />
        </div>
        <div className="product-hero-content">
          <div className="product-hero-eyebrow">VOOR HAAR · HET HAARRITUEEL</div>
          <h1>Nordsilk</h1>
          <p className="product-hero-tagline">Vloeibaar supplement voor mooi haar, soepele huid en sterke nagels</p>
          <p className="product-hero-lead">Voor wie merkt dat haar dunner wordt. Voedt haar, hoofdhuid en nagels van binnenuit.</p>
          <div className="product-trust">
            <span><span className="star">★★★★★</span> 4,8 op Trustpilot</span>
            <span className="dot">·</span>
            <span>100.000+ vrouwen</span>
            <span className="dot">·</span>
            <span>Made in Sweden</span>
          </div>

          <div className="variants">
            <div className="variants-label">Kies je kuur</div>
            <div className="variants-list">
              <label className="variant-option">
                <input type="radio" name="variant-nordsilk" />
                <div className="variant-content">
                  <div className="variant-label">500 ml — Kuur 33 dagen</div>
                  <div className="variant-subtitle">1 fles</div>
                </div>
                <div className="variant-price">€47</div>
              </label>
              <label className="variant-option variant--recommended">
                <div className="variant-badge">Aanbevolen</div>
                <input type="radio" name="variant-nordsilk" defaultChecked />
                <div className="variant-content">
                  <div className="variant-label">3 × 500 ml — Kuur 100 dagen</div>
                  <div className="variant-subtitle">3 flessen · Voor zichtbaar resultaat</div>
                </div>
                <div className="variant-price">€126</div>
              </label>
            </div>
          </div>
          <div className="purchase-actions">
            <button className="btn-primary">In winkelwagen <span className="arrow">→</span></button>
            <div className="purchase-meta">
              <span>Vandaag besteld, morgen in huis</span>
              <span className="dot">·</span>
              <span>Gratis verzending vanaf €60</span>
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
                <path d="M14 8 c0 6 2 10 4 12 1-1 2-2 2-4 0 2 1 3 2 4 1-1 2-2 2-4 0 2 1 3 2 4 1-1 2-2 2-4 0 2 1 3 2 4 2-2 4-6 4-12" />
                <path d="M16 20 v18 M22 22 v18 M28 22 v18 M34 20 v18" opacity="0.5" />
              </svg>
            </div>
            <h4>Voor sterk haar</h4>
            <p>Stimuleert de haargroei en versterkt het haar vanaf de aanzet.</p>
          </div>
          <div className="usp-item">
            <div className="usp-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M24 8 c-8 0-14 6-14 14 0 10 14 18 14 18 s14-8 14-18 c0-8-6-14-14-14z" />
                <path d="M24 14 v18" opacity="0.5" />
                <path d="M18 22 c2 2 4 2 6 0" opacity="0.5" />
                <path d="M24 22 c2 2 4 2 6 0" opacity="0.5" />
              </svg>
            </div>
            <h4>100% plantaardig</h4>
            <p>Volledig vegan en geschikt voor elke levensstijl.</p>
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
            <p>Non-GMO en vrij van gluten, soja, ei, noten, melk en suiker.</p>
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="product-description">
        <div className="product-description-image">
          <img src="/images/nordsilk.jpg" alt="Nordsilk lifestyle" />
        </div>
        <div className="product-description-content">
          <div className="eyebrow">Het verhaal</div>
          <h2>Niet zomaar een <em>supplement</em>.</h2>
          <p>Merk je dat je haar dunner wordt, het volume afneemt of dat je vaker haren verliest? Nordsilk voedt je haarwortels van binnenuit, stimuleert de natuurlijke groeicyclus en geeft je weer voller, steviger en glanzender haar.</p>
          <p>Het geheim zit in de unieke combinatie van Vitamine C, Silicium en Biotine. Drie krachtige bouwstoffen die elkaar versterken en samen werken aan een gezonde hoofdhuid, sterk haar en stevige nagels — van binnenuit.</p>
          <p>Nordsilk is volledig plantaardig en geschikt voor veganisten. Door de vloeibare vorm wordt het gemakkelijk opgenomen door je lichaam. Eén dosis per dag, met een natuurlijke citroensmaak — het maakt je dagelijkse ritueel licht en aangenaam.</p>
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
              <div className="ingredient-name">Vitamine C</div>
              <div className="ingredient-detail">Draagt bij aan natuurlijke collageenvorming voor de huid en hoofdhuid</div>
            </div>
            <div className="ingredient-row">
              <div className="ingredient-name">Silicium</div>
              <div className="ingredient-detail">Bouwsteen voor sterk haar en stevige nagels</div>
            </div>
            <div className="ingredient-row">
              <div className="ingredient-name">Biotine (Vitamine B7)</div>
              <div className="ingredient-detail">Ondersteunt normale haargroei en huidverzorging</div>
            </div>
            <div className="ingredient-row">
              <div className="ingredient-name">Natuurlijke citroensmaak</div>
              <div className="ingredient-detail">Lichte, frisse smaak — 100% natuurlijk</div>
            </div>
            <div className="ingredient-row">
              <div className="ingredient-name">Gefilterd water</div>
              <div className="ingredient-detail">Veelvuldig gefilterd voor optimale zuiverheid</div>
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
              <div className="value">15 ml per dag</div>
            </div>
            <div className="usage-item">
              <div className="label">Wanneer</div>
              <div className="value">&apos;s Ochtends, op een lege maag</div>
            </div>
            <div className="usage-item">
              <div className="label">Duur</div>
              <div className="value">33 dagen per fles · 100 dagen voor zichtbaar resultaat</div>
            </div>
          </div>
          <p className="usage-tip">Neem de dagelijkse dosis puur of meng met water, smoothie of yoghurt. Goed schudden voor gebruik. Na opening gekoeld bewaren en binnen 2 maanden gebruiken.</p>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="product-timeline">
        <div className="timeline-wrap">
          <div className="section-header-center">
            <div className="eyebrow">Wat je mag verwachten</div>
            <h2>Het ritueel <em>over tijd</em></h2>
            <p>Echte schoonheid kost tijd. Hier is hoe je ritueel zich ontvouwt.</p>
          </div>
          <div className="ritual-stages">
            <div className="stage">
              <div className="stage-pct">25<sup>%</sup></div>
              <div className="stage-icon">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="24" cy="24" r="14" />
                  <text x="24" y="29" textAnchor="middle" fontFamily="Cormorant Garamond" fontStyle="italic" fontSize="14" fill="currentColor" stroke="none">1</text>
                </svg>
              </div>
              <div className="stage-day">DAG 1—30</div>
              <h4>Activatie</h4>
              <p>Eerste subtiele veranderingen — vaak het snelst zichtbaar bij de nagels.</p>
            </div>
            <div className="stage">
              <div className="stage-pct">50<sup>%</sup></div>
              <div className="stage-icon">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="24" cy="24" r="14" />
                  <text x="24" y="29" textAnchor="middle" fontFamily="Cormorant Garamond" fontStyle="italic" fontSize="14" fill="currentColor" stroke="none">2</text>
                </svg>
              </div>
              <div className="stage-day">DAG 31—60</div>
              <h4>Verdieping</h4>
              <p>Haarconditie verbetert, het haar voelt sterker en voller aan.</p>
            </div>
            <div className="stage">
              <div className="stage-pct">75<sup>%</sup></div>
              <div className="stage-icon">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="24" cy="24" r="14" />
                  <text x="24" y="29" textAnchor="middle" fontFamily="Cormorant Garamond" fontStyle="italic" fontSize="14" fill="currentColor" stroke="none">3</text>
                </svg>
              </div>
              <div className="stage-day">DAG 61—90</div>
              <h4>Glans</h4>
              <p>Optimale resultaten worden zichtbaar. Glans, volume en sterke groei.</p>
            </div>
            <div className="stage">
              <div className="stage-pct">100<sup>%</sup></div>
              <div className="stage-icon">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="24" cy="24" r="14" />
                  <text x="24" y="29" textAnchor="middle" fontFamily="Cormorant Garamond" fontStyle="italic" fontSize="14" fill="currentColor" stroke="none">4</text>
                </svg>
              </div>
              <div className="stage-day">DAG 91—100+</div>
              <h4>Onderhoud</h4>
              <p>Voor lange-termijn resultaat. Halve dosis per dag is voldoende.</p>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="product-reviews">
        <div className="reviews-wrap">
          <div className="section-header-center">
            <div className="eyebrow">Echte verhalen</div>
            <h2>Wat klanten <em>zeggen</em></h2>
          </div>
          <div className="reviews-grid">
            <article className="review-card">
              <div className="review-stars">★★★★★</div>
              <blockquote>Mijn haar valt minder uit en voelt veel voller aan. Eindelijk een product dat doet wat het belooft.</blockquote>
              <div className="review-author">
                <div className="name">Linda, 44</div>
                <div className="meta">Klant sinds 2023</div>
              </div>
            </article>
            <article className="review-card">
              <div className="review-stars">★★★★★</div>
              <blockquote>Na 8 weken zag ik echt verschil — mijn nagels breken niet meer en mijn haar glanst weer.</blockquote>
              <div className="review-author">
                <div className="name">Bianca, 51</div>
                <div className="meta">Klant sinds 2024</div>
              </div>
            </article>
            <article className="review-card">
              <div className="review-stars">★★★★★</div>
              <blockquote>Heerlijk dat het vegan is, lekker van smaak en het werkt. Ik gebruik het samen met Marine Collageen.</blockquote>
              <div className="review-author">
                <div className="name">Femke, 36</div>
                <div className="meta">Klant sinds 2025</div>
              </div>
            </article>
          </div>
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
              <button className="faq-question" aria-expanded="false">Wanneer zie ik resultaat?<span className="icon">+</span></button>
              <div className="faq-answer"><p>Veel gebruikers merken binnen 4 tot 8 weken al verschil: een gladdere huid, meer glans in het haar en sterkere nagels. Voor zichtbaar en langdurig resultaat raden we een kuur van 100 dagen aan.</p></div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">Is Nordsilk vegan?<span className="icon">+</span></button>
              <div className="faq-answer"><p>Ja, Nordsilk is volledig plantaardig en geschikt voor veganisten.</p></div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">Kan ik Nordsilk combineren met Marine Collageen?<span className="icon">+</span></button>
              <div className="faq-answer"><p>Ja, deze twee supplementen zijn perfect te combineren. Nordsilk focust op haar, huid en nagels via plantaardige bouwstoffen, terwijl Marine Collageen diep inwerkt op de huidstructuur via collageen en ondersteunende vitamines.</p></div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">Mag ik dit gebruiken tijdens zwangerschap?<span className="icon">+</span></button>
              <div className="faq-answer"><p>Bij zwangerschap of borstvoeding raden we aan om eerst je arts of verloskundige te raadplegen voordat je dit supplement gebruikt.</p></div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">Hoe bewaar ik de fles?<span className="icon">+</span></button>
              <div className="faq-answer"><p>Koel bewaren, buiten direct zonlicht. Na openen gekoeld bewaren en binnen 2 maanden gebruiken.</p></div>
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
            <a href="/hermade" className="cross-sell-card">
              <div className="cross-sell-image">
                <img src="/images/hermade-product.jpg" alt="HÉRMADE" />
              </div>
              <div className="cross-sell-info">
                <div className="cross-sell-tag">Het maandritueel</div>
                <h4>HÉRMADE</h4>
                <p>30 sticks voor energie, balans en innerlijke rust tijdens de overgang.</p>
                <div className="cross-sell-cta">€39 <span>→</span></div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
