export const metadata = {
  title: 'HÉRMADE',
  description: 'Gerichte ondersteuning voor vrouwen in elke fase van het leven.',
}

export default function HermadePage() {
  return (
    <main>
      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <a href="/">Home</a>
        <span className="sep">/</span>
        <a href="/supplementen">Supplementen</a>
        <span className="sep">/</span>
        <span className="current">HÉRMADE</span>
      </div>

      {/* PRODUCT HERO */}
      <section className="product-hero">
        <div className="product-hero-image">
          <span className="roman">IV</span>
          <img src="/images/het-verhaal-achter-hermade.jpg" alt="HÉRMADE — Het maandritueel van The Swedish Glow" />
        </div>
        <div className="product-hero-content">
          <div className="product-hero-eyebrow">EXCLUSIVE · HET MAANDRITUEEL</div>
          <h1>HÉRMADE</h1>
          <p className="product-hero-tagline">Natuurlijke ondersteuning voor vrouwen in de overgang</p>
          <p className="product-hero-lead">30 sticks voor energie, balans en innerlijke rust tijdens de overgang.</p>
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
                <input type="radio" name="variant-hermade" />
                <div className="variant-content">
                  <div className="variant-label">30 sticks — 1 maand</div>
                  <div className="variant-subtitle">Eén kuur</div>
                </div>
                <div className="variant-price">€39</div>
              </label>
              <label className="variant-option variant--recommended">
                <div className="variant-badge">Aanbevolen</div>
                <input type="radio" name="variant-hermade" defaultChecked />
                <div className="variant-content">
                  <div className="variant-label">3× 30 sticks — 3 maanden</div>
                  <div className="variant-subtitle">Voor langdurige balans</div>
                </div>
                <div className="variant-price">€111</div>
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
                <path d="M22 4 L8 26 h12 L18 44 L40 22 H28 L30 4 z" />
              </svg>
            </div>
            <h4>Meer energie</h4>
            <p>Ondersteunt je vitaliteit en helpt vermoeidheid verminderen.</p>
          </div>
          <div className="usp-item">
            <div className="usp-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="24" cy="24" r="18" />
                <path d="M24 6 c-6 6-6 12 0 18 s6 12 0 18" opacity="0.6" />
                <circle cx="24" cy="14" r="2" fill="currentColor" opacity="0.5" />
                <circle cx="24" cy="34" r="2" fill="currentColor" opacity="0.5" />
              </svg>
            </div>
            <h4>Innerlijke balans</h4>
            <p>Met saffraan, maca en magnesium voor stemming en kalmte.</p>
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
                <rect x="14" y="8" width="20" height="32" rx="2" />
                <path d="M22 14 h4 M22 20 h4 M22 26 h4 M22 32 h4" opacity="0.5" />
              </svg>
            </div>
            <h4>Onderweg te gebruiken</h4>
            <p>Handige sticks — ook makkelijk mee te nemen in je tas.</p>
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="product-description">
        <div className="product-description-image">
          <img src="/images/hermade-product.jpg" alt="HÉRMADE lifestyle" />
        </div>
        <div className="product-description-content">
          <div className="eyebrow">Het verhaal</div>
          <h2>Niet zomaar een <em>supplement</em>.</h2>
          <p>De overgang is geen pauze, het is een nieuwe fase vol kracht. HÉRMADE helpt je om elke dag jezelf te blijven — vol energie, veerkracht en innerlijke rust. Een 30-dagen ritueel met zorgvuldig geselecteerde botanicals voor balans en welzijn.</p>
          <p>Met een zachte sinaasappel-gembersmaak en een krachtige combinatie van vitaminen, mineralen en plantaardige extracten. Laat stemmingswisselingen, vermoeidheid en hormonale onrust niet langer je dag bepalen — deze handige sticks ondersteunen je lichaam precies waar het nodig is.</p>
          <p>Natuurlijk, vrouwvriendelijk en makkelijk in gebruik. Eén stick per dag, opgelost in water of meegenomen onderweg. Voor de vrouw die sterk in haar verandering staat.</p>
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
              <div className="ingredient-name">Magnesium</div>
              <div className="ingredient-detail">Voor energie, spierfunctie en zenuwstelsel</div>
            </div>
            <div className="ingredient-row">
              <div className="ingredient-name">Saffraan-extract</div>
              <div className="ingredient-detail">Ondersteunt stemming en innerlijke rust</div>
            </div>
            <div className="ingredient-row">
              <div className="ingredient-name">Maca-poeder</div>
              <div className="ingredient-detail">Adaptogeen kruid voor energie en hormonale balans</div>
            </div>
            <div className="ingredient-row">
              <div className="ingredient-name">Vitamine B-complex</div>
              <div className="ingredient-detail">Voor energiemetabolisme en vermoeidheid</div>
            </div>
            <div className="ingredient-row">
              <div className="ingredient-name">Vitamine D3 &amp; K2</div>
              <div className="ingredient-detail">Voor botten, immuunsysteem en hartgezondheid</div>
            </div>
            <div className="ingredient-row">
              <div className="ingredient-name">Natuurlijke sinaasappel-gembersmaak</div>
              <div className="ingredient-detail">100% natuurlijk</div>
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
              <div className="value">1 stick per dag</div>
            </div>
            <div className="usage-item">
              <div className="label">Wanneer</div>
              <div className="value">&apos;s Ochtends, opgelost in water</div>
            </div>
            <div className="usage-item">
              <div className="label">Duur</div>
              <div className="value">30 dagen per kuur · 3 maanden voor optimaal resultaat</div>
            </div>
          </div>
          <p className="usage-tip">Open een stick en meng met een glas water. Schud goed of roer voor gebruik. Buiten bereik van kinderen houden.</p>
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
              <div className="stage-day">DAG 1—7</div>
              <h4>Aanloop</h4>
              <p>Je lichaam neemt de actieve ingrediënten op. Eerste subtiele veranderingen.</p>
            </div>
            <div className="stage">
              <div className="stage-pct">50<sup>%</sup></div>
              <div className="stage-icon">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="24" cy="24" r="14" />
                  <text x="24" y="29" textAnchor="middle" fontFamily="Cormorant Garamond" fontStyle="italic" fontSize="14" fill="currentColor" stroke="none">2</text>
                </svg>
              </div>
              <div className="stage-day">DAG 8—14</div>
              <h4>Energie</h4>
              <p>Meer vitaliteit, betere nachtrust. Vermoeidheid wijkt langzaam.</p>
            </div>
            <div className="stage">
              <div className="stage-pct">75<sup>%</sup></div>
              <div className="stage-icon">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="24" cy="24" r="14" />
                  <text x="24" y="29" textAnchor="middle" fontFamily="Cormorant Garamond" fontStyle="italic" fontSize="14" fill="currentColor" stroke="none">3</text>
                </svg>
              </div>
              <div className="stage-day">DAG 15—21</div>
              <h4>Balans</h4>
              <p>Stemming voelt stabieler. Hormonale schommelingen worden gedempt.</p>
            </div>
            <div className="stage">
              <div className="stage-pct">100<sup>%</sup></div>
              <div className="stage-icon">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="24" cy="24" r="14" />
                  <text x="24" y="29" textAnchor="middle" fontFamily="Cormorant Garamond" fontStyle="italic" fontSize="14" fill="currentColor" stroke="none">4</text>
                </svg>
              </div>
              <div className="stage-day">DAG 22—30+</div>
              <h4>Innerlijke rust</h4>
              <p>Een gevoel van zelf weer in balans. Klaar voor de volgende maand.</p>
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
              <blockquote>Eindelijk een product dat me niet alleen ondersteunt maar ook hoort. Mijn nachten zijn rustiger en mijn humeur stabieler.</blockquote>
              <div className="review-author">
                <div className="name">Annemiek, 49</div>
                <div className="meta">Klant sinds 2024</div>
              </div>
            </article>
            <article className="review-card">
              <div className="review-stars">★★★★★</div>
              <blockquote>Drie maanden gebruikt en wat een verschil. Meer energie, minder opvliegers, en het smaakt heerlijk.</blockquote>
              <div className="review-author">
                <div className="name">Karin, 53</div>
                <div className="meta">Klant sinds 2025</div>
              </div>
            </article>
            <article className="review-card">
              <div className="review-stars">★★★★★</div>
              <blockquote>De sticks zijn handig voor onderweg. Ik voel me sterker en kalmer in deze overgangsfase.</blockquote>
              <div className="review-author">
                <div className="name">Tessa, 47</div>
                <div className="meta">Klant sinds 2024</div>
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
              <div className="faq-answer"><p>Veel vrouwen merken al binnen 1 à 2 weken meer energie en betere nachtrust. Voor optimaal resultaat raden we een kuur van 3 maanden aan.</p></div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">Is HÉRMADE een vervanging voor hormoontherapie?<span className="icon">+</span></button>
              <div className="faq-answer"><p>Nee, HÉRMADE is een voedingssupplement met natuurlijke ingrediënten ter ondersteuning. Het is geen vervanging voor medische hormoontherapie. Bij medische klachten of vragen raadpleeg altijd je arts.</p></div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">Mag ik dit gebruiken tijdens medicatie?<span className="icon">+</span></button>
              <div className="faq-answer"><p>Bij gebruik van medicatie raden we aan om eerst je arts of apotheker te raadplegen voordat je begint met dit supplement.</p></div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">Hoe smaakt het?<span className="icon">+</span></button>
              <div className="faq-answer"><p>HÉRMADE heeft een natuurlijke sinaasappel-gembersmaak. Zacht en aangenaam, gemakkelijk dagelijks in te nemen.</p></div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">Hoe gebruik ik HÉRMADE?<span className="icon">+</span></button>
              <div className="faq-answer"><p>Open één stick per dag en meng met een glas water of voeg toe aan smoothie. Bij voorkeur in de ochtend.</p></div>
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
