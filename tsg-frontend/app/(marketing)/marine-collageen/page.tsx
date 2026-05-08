export const metadata = {
  title: 'Marine Collageen 13.000',
  description: '13.000 mg vloeibaar marine collageen voor stralende huid, sterke nagels en gezond haar.',
}

export default function MarineCollageenPage() {
  return (
    <main>
      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <a href="/">Home</a>
        <span className="sep">/</span>
        <a href="/supplementen">Supplementen</a>
        <span className="sep">/</span>
        <span className="current">Marine Collageen 13.000</span>
      </div>

      {/* PRODUCT HERO */}
      <section className="product-hero">
        <div className="product-hero-image">
          <span className="roman">I</span>
          <img src="/images/marine-collageen-13000-het-ochtendritueel-van-the-.jpg" alt="Marine Collageen 13.000 — Het ochtendritueel van The Swedish Glow" />
        </div>
        <div className="product-hero-content">
          <div className="product-hero-eyebrow">BESTSELLER · HET OCHTENDRITUEEL</div>
          <h1>Marine Collageen 13.000</h1>
          <p className="product-hero-tagline">Vloeibare premium viscollageen met 13.000 mg per shot</p>
          <p className="product-hero-lead">De bestseller. Voor stevigheid, hydratatie en glow van binnenuit.</p>
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
                <input type="radio" name="variant-marine-collageen" />
                <div className="variant-content">
                  <div className="variant-label">500 ml — Kuur 25 dagen</div>
                  <div className="variant-subtitle">1 fles</div>
                </div>
                <div className="variant-price">€59</div>
              </label>
              <label className="variant-option variant--recommended">
                <div className="variant-badge">Aanbevolen</div>
                <input type="radio" name="variant-marine-collageen" defaultChecked />
                <div className="variant-content">
                  <div className="variant-label">4 × 500 ml — Kuur 100 dagen</div>
                  <div className="variant-subtitle">4 flessen · Het signature ritueel</div>
                </div>
                <div className="variant-price">€216</div>
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
                <path d="M16 8 h16 v6 c0 2-1 4-3 5 v18 c0 4-2 7-5 7 s-5-3-5-7 V19 c-2-1-3-3-3-5 V8z" />
                <path d="M16 8 v6" opacity="0.4" />
                <path d="M32 8 v6" opacity="0.4" />
              </svg>
            </div>
            <h4>13.000 mg per shot</h4>
            <p>De hoogste dosering collageen per portie van alle supplementen op de markt.</p>
          </div>
          <div className="usp-item">
            <div className="usp-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="24" cy="24" r="14" />
                <path d="M24 12 v24" opacity="0.4" />
                <path d="M12 24 h24" opacity="0.4" />
                <circle cx="24" cy="24" r="3" fill="currentColor" />
              </svg>
            </div>
            <h4>14× beter opgenomen</h4>
            <p>Vloeibare formule wordt efficiënter opgenomen dan capsules of poeders.</p>
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
            <p>Non-GMO en vrij van tarwe, gluten, soja, ei, noten, melk en suiker.</p>
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="product-description">
        <div className="product-description-image">
          <img src="/images/marine-collageen-13000-lifestyle.jpg" alt="Marine Collageen 13.000 lifestyle" />
        </div>
        <div className="product-description-content">
          <div className="eyebrow">Het verhaal</div>
          <h2>Niet zomaar een <em>supplement</em>.</h2>
          <p>Onze gehydrolyseerde collageen shots voeden je lichaam met essentiële vitamines, mineralen en antioxidanten — de bouwstoffen die je natuurlijke collageenproductie weer een oppepper geven. Vanaf je 25e neemt deze namelijk geleidelijk af, met ongeveer 1% per jaar.</p>
          <p>Onze vloeibare formule bevat 14× meer actieve ingrediënten dan collageenpillen of poeders, en wordt efficiënter opgenomen door je lichaam. Eén shot per dag, één moment voor jezelf — drink het puur, meng het met water of verwerk het in een smoothie.</p>
          <p>Marine Collageen 13.000 wordt zorgvuldig samengesteld uit gehydrolyseerde eiwitpeptiden van zoetwatervissen (type I en III) en aangevuld met vitamine C, A, B5, B6, B12, selenium, zink en hyaluronzuur. Een complete formule, in één fles.</p>
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
              <div className="ingredient-name">Marine Collageen</div>
              <div className="ingredient-detail">Type I &amp; III peptiden uit gehydrolyseerde zoetwatervis — 13.000 mg per shot</div>
            </div>
            <div className="ingredient-row">
              <div className="ingredient-name">Hyaluronzuur</div>
              <div className="ingredient-detail">Voor hydratatie en elasticiteit van de huid</div>
            </div>
            <div className="ingredient-row">
              <div className="ingredient-name">Vitamine C</div>
              <div className="ingredient-detail">Draagt bij aan natuurlijke collageenvorming</div>
            </div>
            <div className="ingredient-row">
              <div className="ingredient-name">Vitamine A</div>
              <div className="ingredient-detail">Voedt de huid en ondersteunt herstel</div>
            </div>
            <div className="ingredient-row">
              <div className="ingredient-name">Vitamine B5, B6, B12</div>
              <div className="ingredient-detail">Ondersteunt eiwitmetabolisme</div>
            </div>
            <div className="ingredient-row">
              <div className="ingredient-name">Zink &amp; Selenium</div>
              <div className="ingredient-detail">Voor huidherstel en celvernieuwing</div>
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
              <div className="value">20 ml per dag</div>
            </div>
            <div className="usage-item">
              <div className="label">Wanneer</div>
              <div className="value">&apos;s Ochtends, op een lege maag</div>
            </div>
            <div className="usage-item">
              <div className="label">Duur</div>
              <div className="value">25 dagen per fles · 100 dagen voor signature kuur</div>
            </div>
          </div>
          <p className="usage-tip">Drink puur als shot, meng met water of verwerk in een smoothie. Goed schudden voor gebruik. Na opening in de koelkast bewaren en binnen 2 maanden gebruiken.</p>
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
              <p>Je lichaam neemt de actieve ingrediënten op. Eerste subtiele veranderingen in hydratatie en energie.</p>
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
              <p>Huid voelt steviger en gladder. Haar wordt voller. Nagels groeien sterker.</p>
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
              <h4>De glow</h4>
              <p>Zichtbare resultaten op fijne lijntjes en huidstevigheid. Je glow is terug.</p>
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
              <p>Een dagelijkse gewoonte voor blijvende resultaten — jouw Swedish Glow ritueel.</p>
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
              <blockquote>Na drie maanden zag ik écht verschil — sterker haar, een gladdere huid, en een rust in mijn ochtendritueel die ik niet meer wil missen.</blockquote>
              <div className="review-author">
                <div className="name">Marieke, 47</div>
                <div className="meta">Klant sinds 2023</div>
              </div>
            </article>
            <article className="review-card">
              <div className="review-stars">★★★★★</div>
              <blockquote>Mijn schoonheidsspecialist raadde Marine Collagen 13.000 aan. Na de eerste kuur was ik om — mijn huid voelt steviger en mijn glow is terug.</blockquote>
              <div className="review-author">
                <div className="name">Sandra, 52</div>
                <div className="meta">Klant sinds 2024</div>
              </div>
            </article>
            <article className="review-card">
              <div className="review-stars">★★★★★</div>
              <blockquote>Eindelijk een collageen dat doet wat het belooft. Ik voel het verschil al na enkele weken. Zo fijn dat ik niet 5 verschillende potjes meer hoef te slikken.</blockquote>
              <div className="review-author">
                <div className="name">Eva, 38</div>
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
              <div className="faq-answer"><p>De meeste klanten zien de eerste resultaten binnen 6 tot 12 weken bij dagelijks gebruik. Voor optimale en blijvende effecten op huid, haar en nagels raden we een kuur van 100 dagen aan.</p></div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">Hoe gebruik ik Marine Collageen 13.000?<span className="icon">+</span></button>
              <div className="faq-answer"><p>Neem dagelijks één shot van 20 ml, bij voorkeur in de ochtend op een lege maag. Drink het puur, meng met water of verwerk in een smoothie. Goed schudden voor gebruik.</p></div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">Bevat het allergenen?<span className="icon">+</span></button>
              <div className="faq-answer"><p>Marine Collageen 13.000 bevat ingrediënten uit vis. Het is non-GMO en vrij van tarwe, gluten, soja, ei, noten, melk en suiker.</p></div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">Mag ik dit gebruiken tijdens zwangerschap?<span className="icon">+</span></button>
              <div className="faq-answer"><p>Bij een medische aandoening, zwangerschap of borstvoeding raden we aan om eerst je arts te raadplegen voordat je begint met dit supplement.</p></div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">Hoe bewaar ik de fles?<span className="icon">+</span></button>
              <div className="faq-answer"><p>Koel bewaren, niet in direct zonlicht. Na opening in de koelkast bewaren en binnen 2 maanden gebruiken.</p></div>
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
