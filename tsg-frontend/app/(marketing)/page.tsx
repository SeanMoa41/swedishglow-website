export const metadata = {
  title: 'Vloeibare Marine Collageen & Omega 3 Supplementen',
  description:
    'Premium beauty rituelen uit Zweden. Marine Collageen 13.000, Omega 3, Nordsilk en HÉRMADE.',
}

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-text">
          <div className="hero-eyebrow">
            <span className="eyebrow-stars" aria-hidden="true">★ ★ ★ ★ ★</span>
            <span>4,8 op Trustpilot · 100.000+ vrouwen · 23 landen</span>
          </div>
          <h1 id="hero-heading">
            Zweedse beauty<br />
            rituelen uit het<br />
            <em>hoge noorden</em>.
          </h1>
          <p className="hero-tagline">Premium essences voor élke vrouw.</p>
          <p className="hero-lead">
            Premium beauty essences en rituelen voor stralende huid, vol haar en innerlijke
            balans. Vanuit Zweden, voor de vrouw die schoonheid van binnenuit verstaat.
          </p>
          <div className="hero-cta">
            <a href="/shop" className="btn">Ontdek de collectie <span className="arrow">→</span></a>
            <a href="/over-ons" className="btn btn-outline">Lees ons verhaal</a>
          </div>
          <div className="hero-trust-inline">
            <span>Premium ingrediënten</span>
            <span className="dot">·</span>
            <span>Made in Sweden</span>
            <span className="dot">·</span>
            <span>GMO &amp; glutenvrij</span>
            <span className="dot">·</span>
            <span>Familiemerk sinds 2022</span>
          </div>
        </div>
        <div className="hero-image-wrap">
          <img
            src="/images/hermade-hands.jpg"
            alt="HÉRMADE — Natural Beauty van The Swedish Glow, vastgehouden door zachte handen"
          />
          <div className="hero-badge">
            <span className="new">Nieuw</span>
            <div className="name">Hérmade</div>
            <div className="divider"></div>
            <div className="tagline">30 × 4,5 g · Natural Beauty</div>
          </div>
        </div>
      </section>

      {/* MAGAZINE SPLIT BANNER */}
      <section className="magazine-split" aria-label="Categorieën">
        <div className="split-pane">
          <img
            src="/images/het-verhaal-achter-hermade.jpg"
            alt="HÉRMADE ritueel — The Swedish Glow exclusive supplement"
          />
          <div className="label-overlay">
            <div className="tag">Het maandritueel</div>
            <h3>Het <strong>HÉRMADE</strong> ritueel</h3>
            <a href="/hermade">Ontdek nu →</a>
          </div>
        </div>
        <div className="split-pane">
          <img
            src="/images/marine-collageen-13000-het-ochtendritueel-van-the-.jpg"
            alt="Marine Collageen 13.000, het ochtendritueel van The Swedish Glow"
          />
          <div className="label-overlay">
            <div className="tag">Het ochtendritueel</div>
            <h3>Het <strong>Marine Collageen</strong> ritueel</h3>
            <a href="/marine-collageen">Ontdek nu →</a>
          </div>
        </div>
      </section>

      {/* PRESS */}
      <section className="press-strip" aria-label="Featured in">
        <div className="press-wrap">
          <div className="label">Vermeld in vakbladen · As featured in</div>
          <div className="press-logos">
            <span className="press-logo">Kapper Magazine</span>
            <span className="press-logo bold">De Beauty Professional</span>
            <span className="press-logo bold">★ 4.8 Trustpilot</span>
          </div>
        </div>
      </section>

      {/* FACTS */}
      <section className="facts-band" aria-label="Kerncijfers">
        <div className="facts-grid">
          <div className="fact">
            <div className="number">
              13.000<span style={{ fontSize: '1.4rem' }}>mg</span>
            </div>
            <div className="label">Marine collageen per shot</div>
          </div>
          <div className="fact">
            <div className="number">100%</div>
            <div className="label">Gemaakt in Zweden</div>
          </div>
          <div className="fact">
            <div className="number">6–12</div>
            <div className="label">Weken tot zichtbaar resultaat</div>
          </div>
          <div className="fact">
            <div className="number">
              4,8<span style={{ fontSize: '1.4rem' }}>/5</span>
            </div>
            <div className="label">Trustpilot beoordeling</div>
          </div>
        </div>
      </section>

      {/* INTRO STORY */}
      <section className="intro" aria-labelledby="intro-heading">
        <div className="intro-image">
          <img
            src="/images/elin-hellqvist-moayedi-oprichtster-van-the-swedish.jpg"
            alt="Elin Hellqvist-Moayedi, oprichtster van The Swedish Glow met Nordsilk supplement"
          />
          <div className="caption">Elin Hellqvist-Moayedi</div>
        </div>
        <div className="intro-text">
          <div className="eyebrow">Het verhaal achter het merk</div>
          <h2 id="intro-heading">Een merk dat begint bij <em>één vrouw</em>.</h2>
          <p>
            Elin Hellqvist-Moayedi werd geboren op een eiland aan de Zweedse kust, werkte zich op
            door bedrijven als IKEA, Shimano en ASML, en nam in 2022 de stap die ze al jaren wilde
            nemen: een merk bouwen dat vrouwen op een voetstuk zet.
          </p>
          <p>
            The Swedish Glow is wat daaruit groeide. Een Nederlands familiemerk met Zweedse roots,
            opgezet samen met haar man, en inmiddels het ochtendritueel van meer dan 100.000 vrouwen
            in 23 landen. Geen quick fixes, wel toewijding. Geen marketing-beloftes, wel zichtbaar
            resultaat.
          </p>
          <div className="signature">Elin Hellqvist-Moayedi, oprichtster</div>
          <a href="/over-ons" className="intro-cta">
            Lees het hele verhaal
            <span className="arrow">→</span>
          </a>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="products" id="producten" aria-labelledby="products-heading">
        <div className="section-header">
          <h2 id="products-heading">Onze <em>rituelen</em><br />en essences.</h2>
          <div className="header-meta">
            Vijf rituelen. Eén filosofie. Elk product een Nordic-ritueel, ontworpen voor zichtbaar
            resultaat op huid, haar en welzijn.
          </div>
        </div>
        <div className="product-grid">
          <article className="product-card">
            <div className="image-wrap" data-overlay="Nieuw · Het basisritueel">
              <img
                src="/images/freja.jpg"
                alt="FREJA vloeibare Omega 3 visolie, het basisritueel van The Swedish Glow"
              />
            </div>
            <div className="product-meta">
              <span className="product-tag">Het basisritueel · Omega 3</span>
              <span className="product-price">vanaf €42</span>
            </div>
            <h3>FREJA</h3>
            <p className="product-desc">
              <em>Het basisritueel.</em> Premium vloeibare Omega 3 uit duurzame Noordzee-visserij,
              met de hoogste concentratie EPA en DHA per lepel. Voor een gezond hart, scherpe geest
              en kalme huid. Het fundament onder elk ander ritueel.
            </p>
            <a href="/freja" className="product-link">Ontdek het ritueel →</a>
          </article>
          <article className="product-card">
            <div className="image-wrap" data-overlay="Bestseller · Het ochtendritueel">
              <img
                src="/images/marine-collageen-13000-het-ochtendritueel-van-the-.jpg"
                alt="Marine Collageen 13.000, het ochtendritueel van The Swedish Glow"
              />
            </div>
            <div className="product-meta">
              <span className="product-tag">Het ochtendritueel · Marine Collageen</span>
              <span className="product-price">vanaf €59</span>
            </div>
            <h3>Marine Collageen 13.000</h3>
            <p className="product-desc">
              <em>Het ochtendritueel.</em> Vloeibare premium viscollageen met 13.000 mg per shot,
              aangevuld met hyaluronzuur, vitamine C, A, B-complex, zink en selenium. Eén shot, één
              moment voor jezelf, elke ochtend.
            </p>
            <a href="/marine-collageen" className="product-link">Ontdek de kuur →</a>
          </article>
          <article className="product-card">
            <div className="image-wrap" data-overlay="Voor haar · Het haarritueel">
              <img
                src="/images/nordsilk.jpg"
                alt="Nordsilk vloeibaar supplement — het haarritueel voor sterk haar en gezonde hoofdhuid"
              />
            </div>
            <div className="product-meta">
              <span className="product-tag">Het haarritueel · Nordsilk</span>
              <span className="product-price">vanaf €47</span>
            </div>
            <h3>Nordsilk</h3>
            <p className="product-desc">
              <em>Het haarritueel.</em> Vloeibaar haarsupplement voor wie last heeft van dunner
              wordend haar of een gevoelige hoofdhuid. Voedt de haarcyclus van binnenuit met
              essentiële vitamines en mineralen.
            </p>
            <a href="/nordsilk" className="product-link">Ontdek het ritueel →</a>
          </article>
          <article className="product-card">
            <div className="image-wrap" data-overlay="Limited · Het maandritueel">
              <img
                src="/images/hermade-product.jpg"
                alt="HÉRMADE supplement, het maandritueel van The Swedish Glow voor vrouwen in de overgang"
              />
            </div>
            <div className="product-meta">
              <span className="product-tag">Het maandritueel · HÉRMADE</span>
              <span className="product-price">€39</span>
            </div>
            <h3>HÉRMADE</h3>
            <p className="product-desc">
              <em>Het maandritueel.</em> Onze gelimiteerde collectie sachets, ontwikkeld voor
              vrouwen in de peri- en postmenopauze. 30 dagen toewijding aan jezelf, voor balans en
              welzijn in een nieuwe levensfase.
            </p>
            <a href="/hermade" className="product-link">Ontdek HÉRMADE →</a>
          </article>
        </div>
      </section>

      {/* ONZE RITUELEN — filosofie sectie */}
      <section className="rituals-philosophy" aria-labelledby="rituals-philosophy-heading">
        <div className="rituals-philosophy-wrap">
          <div className="rituals-ornament" aria-hidden="true">
            <svg viewBox="0 0 240 50" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="25" x2="90" y2="25" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
              <circle cx="100" cy="25" r="2.5" fill="currentColor" opacity="0.5" />
              <circle cx="120" cy="25" r="4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
              <circle cx="140" cy="25" r="2.5" fill="currentColor" opacity="0.5" />
              <line x1="150" y1="25" x2="240" y2="25" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
            </svg>
          </div>

          <div className="rituals-philosophy-header">
            <div className="eyebrow">Onze filosofie</div>
            <h2 id="rituals-philosophy-heading">Geen supplement.<br /><em>Een ritueel.</em></h2>
            <p className="rituals-lede">
              In Zweden begint elke ochtend met aandacht voor jezelf. Een glas, een moment van
              rust, een gewoonte die je eraan herinnert dat zelfzorg geen beloning is maar een
              fundament. Dat gevoel hebben we meegenomen naar elk product dat we maken. Geen pillen
              die je tussen alles door slikt, maar rituelen die jou even alleen geven.
            </p>
          </div>

          <div className="rituals-grid">
            <a href="/marine-collageen" className="ritual-card ritual-card--linked" data-ritual="1">
              <div className="ritual-card-num">I</div>
              <h3>Het <em>ochtendritueel</em></h3>
              <p className="ritual-product">Marine Collageen 13.000</p>
              <p className="ritual-desc">
                Een shot. Eén moment. Het anker waar je dag op rust, voor stevigheid, hydratatie en
                glow van binnenuit.
              </p>
              <span className="ritual-card-arrow" aria-hidden="true">Ontdek het ritueel →</span>
            </a>

            <a href="/nordsilk" className="ritual-card ritual-card--linked" data-ritual="2">
              <div className="ritual-card-num">II</div>
              <h3>Het <em>haarritueel</em></h3>
              <p className="ritual-product">Nordsilk</p>
              <p className="ritual-desc">
                Voor wie merkt dat haar dunner wordt. Voedt de haarcyclus van binnenuit met de
                essentiële bouwstenen die je dagelijks nodig hebt.
              </p>
              <span className="ritual-card-arrow" aria-hidden="true">Ontdek het ritueel →</span>
            </a>

            <a href="/freja" className="ritual-card ritual-card--linked" data-ritual="3">
              <div className="ritual-card-num">III</div>
              <h3>Het <em>basisritueel</em></h3>
              <p className="ritual-product">FREJA</p>
              <p className="ritual-desc">
                Premium vloeibare Omega 3 uit Noordzee-vis. Hoog gedoseerde EPA en DHA voor hart,
                brein en huid. Het fundament onder elk ander ritueel.
              </p>
              <span className="ritual-card-arrow" aria-hidden="true">Ontdek het ritueel →</span>
            </a>

            <a href="/hermade" className="ritual-card ritual-card--linked" data-ritual="4">
              <div className="ritual-card-num">IV</div>
              <h3>Het <em>maandritueel</em></h3>
              <p className="ritual-product">HÉRMADE</p>
              <p className="ritual-desc">
                Het 30-dagen ritueel voor vrouwen in de overgang. Sachets met zorgvuldig
                geselecteerde botanicals voor balans en welzijn.
              </p>
              <span className="ritual-card-arrow" aria-hidden="true">Ontdek het ritueel →</span>
            </a>

            <article className="ritual-card ritual-card--cta" id="ritualShowcase">
              <div className="cta-ornament" aria-hidden="true">
                <svg viewBox="0 0 80 30" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="15" x2="28" y2="15" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
                  <circle cx="40" cy="15" r="2.5" fill="currentColor" opacity="0.7" />
                  <line x1="52" y1="15" x2="80" y2="15" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
                </svg>
              </div>

              {/* DEFAULT: Quiz */}
              <div className="cta-state cta-state--active" data-state="default">
                <div className="cta-eyebrow">Persoonlijk advies</div>
                <h3>Welk ritueel past bij <em>jou</em>?</h3>
                <p className="ritual-product">Een paar vragen, één persoonlijk antwoord</p>
                <p className="ritual-desc">
                  Niet elk lichaam vraagt om hetzelfde ritueel. Vertel ons wat voor jou nu het
                  belangrijkste is, en we adviseren het ritueel dat het beste bij jou past.
                </p>

                <div className="quiz-question">
                  <div className="quiz-label">Wat is voor jou nu het belangrijkste?</div>
                  <div className="quiz-options">
                    <button className="quiz-option" data-quiz-target="ritual-1">
                      <span className="quiz-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="4" />
                          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" />
                        </svg>
                      </span>
                      <span className="quiz-text">Stralende huid</span>
                    </button>
                    <button className="quiz-option" data-quiz-target="ritual-2">
                      <span className="quiz-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 3c-3 4-3 8 0 12s3 8 0 6" />
                          <path d="M8 5c-2 3-2 7 0 10" />
                          <path d="M16 5c2 3 2 7 0 10" />
                        </svg>
                      </span>
                      <span className="quiz-text">Sterk haar</span>
                    </button>
                    <button className="quiz-option" data-quiz-target="ritual-3">
                      <span className="quiz-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2c4 6 4 14 0 20-4-6-4-14 0-20z" />
                          <path d="M5 12c2 1 4 1 7 0 3-1 5-1 7 0" />
                        </svg>
                      </span>
                      <span className="quiz-text">Algeheel welzijn</span>
                    </button>
                    <button className="quiz-option" data-quiz-target="ritual-4">
                      <span className="quiz-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M8 14c1 1 2 2 4 2s3-1 4-2" />
                          <circle cx="9" cy="10" r="0.5" fill="currentColor" />
                          <circle cx="15" cy="10" r="0.5" fill="currentColor" />
                        </svg>
                      </span>
                      <span className="quiz-text">Overgangsbalans</span>
                    </button>
                  </div>
                </div>

                <div className="quiz-hint">
                  <span className="hint-line"></span>
                  <span>Of ontdek het <a href="/marine-collageen" className="hint-link">100-dagen signature ritueel →</a></span>
                  <span className="hint-line"></span>
                </div>
              </div>

              {/* I: Marine Collageen / Ochtendritueel */}
              <div className="cta-state" data-state="ritual-1">
                <div className="cta-eyebrow">Het ochtendritueel</div>
                <h3>Marine <em>Collageen</em></h3>
                <p className="ritual-product">Eén shot, elke ochtend</p>
                <p className="ritual-desc">
                  De bestseller. 13.000 mg vloeibare premium viscollageen per shot, aangevuld met
                  hyaluronzuur, vitamine C, A, B-complex, zink en selenium. Voor stevigheid,
                  hydratatie en glow van binnenuit.
                </p>
                <div className="cta-stats">
                  <div className="cta-stat"><div className="num">13<sup>k</sup></div><div className="lbl">mg per shot</div></div>
                  <div className="cta-stat"><div className="num">8</div><div className="lbl">weken zichtbaar</div></div>
                  <div className="cta-stat"><div className="num">94<sup>%</sup></div><div className="lbl">ziet verschil</div></div>
                </div>
                <div className="cta-actions">
                  <a href="/marine-collageen" className="cta-button">Ontdek Marine Collageen <span className="arrow">→</span></a>
                  <a href="/marine-collageen" className="cta-secondary">100-dagen kuur</a>
                </div>
                <div className="cta-footer">
                  <span>Vanaf €59</span><span className="dot">·</span>
                  <span>13.000 mg per dosis</span><span className="dot">·</span>
                  <span>Met hyaluronzuur</span>
                </div>
              </div>

              {/* II: Nordsilk / Haarritueel */}
              <div className="cta-state" data-state="ritual-2">
                <div className="cta-eyebrow">Het haarritueel</div>
                <h3>Nordsilk <em>essence</em></h3>
                <p className="ritual-product">Voor sterk haar en gezonde hoofdhuid</p>
                <p className="ritual-desc">
                  Voor wie merkt dat haar dunner wordt of een gevoelige hoofdhuid heeft. Voedt de
                  haarcyclus van binnenuit met biotine, zink en silicium. Het ritueel dat haar laat
                  groeien zoals het bedoeld is.
                </p>
                <div className="cta-stats">
                  <div className="cta-stat"><div className="num">12</div><div className="lbl">weken voor cyclus</div></div>
                  <div className="cta-stat"><div className="num">3<sup>+</sup></div><div className="lbl">actieve werkstoffen</div></div>
                  <div className="cta-stat"><div className="num">87<sup>%</sup></div><div className="lbl">voelt verschil</div></div>
                </div>
                <div className="cta-actions">
                  <a href="/nordsilk" className="cta-button">Ontdek Nordsilk <span className="arrow">→</span></a>
                  <a href="#ritueel" className="cta-secondary">Hoe het werkt</a>
                </div>
                <div className="cta-footer">
                  <span>Vanaf €47</span><span className="dot">·</span>
                  <span>Met biotine &amp; zink</span><span className="dot">·</span>
                  <span>Voor haar &amp; nagels</span>
                </div>
              </div>

              {/* III: FREJA / Basisritueel */}
              <div className="cta-state" data-state="ritual-3">
                <div className="cta-eyebrow">Het basisritueel</div>
                <h3>FREJA <em>Omega 3</em></h3>
                <p className="ritual-product">Het fundament onder elk ritueel</p>
                <p className="ritual-desc">
                  Premium vloeibare Omega 3 uit duurzame Noordzee-vis met hoog gedoseerde EPA en
                  DHA. Voor hart, brein, huid en algeheel welzijn. Het fundament waarop alle andere
                  rituelen rusten.
                </p>
                <div className="cta-stats">
                  <div className="cta-stat"><div className="num">2<sup>g</sup></div><div className="lbl">EPA + DHA per dosis</div></div>
                  <div className="cta-stat"><div className="num">100<sup>%</sup></div><div className="lbl">duurzame visserij</div></div>
                  <div className="cta-stat"><div className="num">91<sup>%</sup></div><div className="lbl">voelt vitaler</div></div>
                </div>
                <div className="cta-actions">
                  <a href="/freja" className="cta-button">Ontdek FREJA <span className="arrow">→</span></a>
                  <a href="#ritueel" className="cta-secondary">Hoe het werkt</a>
                </div>
                <div className="cta-footer">
                  <span>Vanaf €42</span><span className="dot">·</span>
                  <span>Noordzee-vis</span><span className="dot">·</span>
                  <span>Hoog gedoseerd EPA/DHA</span>
                </div>
              </div>

              {/* IV: HÉRMADE / Maandritueel */}
              <div className="cta-state" data-state="ritual-4">
                <div className="cta-eyebrow">Het maandritueel</div>
                <h3>HÉRMADE <em>balans</em></h3>
                <p className="ritual-product">30 dagen toewijding aan jezelf</p>
                <p className="ritual-desc">
                  Een gelimiteerde collectie voor vrouwen in de peri- en postmenopauze. Sachets met
                  zorgvuldig geselecteerde botanicals, ontwikkeld voor balans en welzijn in een
                  nieuwe levensfase.
                </p>
                <div className="cta-stats">
                  <div className="cta-stat"><div className="num">30</div><div className="lbl">sachets</div></div>
                  <div className="cta-stat"><div className="num">7<sup>+</sup></div><div className="lbl">botanicals</div></div>
                  <div className="cta-stat"><div className="num">96<sup>%</sup></div><div className="lbl">voelt balans</div></div>
                </div>
                <div className="cta-actions">
                  <a href="/hermade" className="cta-button">Ontdek HÉRMADE <span className="arrow">→</span></a>
                  <a href="#ritueel" className="cta-secondary">Hoe het werkt</a>
                </div>
                <div className="cta-footer">
                  <span>€39</span><span className="dot">·</span>
                  <span>Voor overgang</span><span className="dot">·</span>
                  <span>Gelimiteerde collectie</span>
                </div>
              </div>
            </article>
          </div>

          <div className="rituals-closing">
            <blockquote>
              Een ritueel werkt omdat je het kiest. Niet omdat je het moet.
              <span className="quote-attribution">— De filosofie van The Swedish Glow</span>
            </blockquote>
          </div>
        </div>
      </section>

      {/* 100-DAY SIGNATURE RITUAL CTA */}
      <section className="signature-ritual" id="100-dagen-kuur" aria-labelledby="signature-heading">
        <div className="signature-wrap">
          <div className="signature-content">
            <div className="signature-ornament" aria-hidden="true">
              <svg viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="15" x2="38" y2="15" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                <circle cx="50" cy="15" r="3" fill="currentColor" opacity="0.7" />
                <line x1="62" y1="15" x2="100" y2="15" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
              </svg>
            </div>
            <div className="signature-eyebrow">Het signature ritueel</div>
            <h2 id="signature-heading">Het <em>100-dagen ritueel</em></h2>
            <p className="signature-tagline">Een seizoen voor jezelf.</p>
            <p className="signature-desc">
              Honderd dagen toewijding aan jezelf — geen quick fix, maar een verandering die blijft.
              Wetenschappelijk heeft je huid drie maanden nodig om zichtbaar te vernieuwen. Wij
              geven je er net iets meer. Vier flessen Marine Collageen 13.000, dagelijks 20 ml in de
              ochtend, ingebed in een ritueel dat van jou is.
            </p>
            <div className="signature-stats">
              <div className="signature-stat"><div className="num">4</div><div className="lbl">flessen × 500 ml</div></div>
              <div className="signature-stat"><div className="num">100</div><div className="lbl">dagen ritueel</div></div>
              <div className="signature-stat"><div className="num">94<sup>%</sup></div><div className="lbl">ziet verschil</div></div>
            </div>

            <div className="signature-timeline" aria-label="Wanneer zie je effecten?">
              <div className="signature-timeline-label">Wanneer zie je <em>effecten</em>?</div>
              <div className="signature-timeline-grid">
                <div className="sig-phase">
                  <div className="sig-phase-day">Dag 1—25</div>
                  <div className="sig-phase-text">
                    Het lichaam neemt de actieve ingrediënten op. Eerste subtiele veranderingen in
                    hydratatie en energie.
                  </div>
                </div>
                <div className="sig-phase">
                  <div className="sig-phase-day">Dag 26—50</div>
                  <div className="sig-phase-text">
                    De huid voelt steviger en gladder. Haar wordt voller, nagels groeien sterker.
                  </div>
                </div>
                <div className="sig-phase">
                  <div className="sig-phase-day">Dag 51—75</div>
                  <div className="sig-phase-text">
                    Zichtbaar resultaat op fijne lijntjes en huidstevigheid. De glow keert terug.
                  </div>
                </div>
                <div className="sig-phase">
                  <div className="sig-phase-day">Dag 76—100</div>
                  <div className="sig-phase-text">
                    Je ritueel is een gewoonte geworden. De resultaten zijn blijvend en diep.
                  </div>
                </div>
              </div>
            </div>

            <div className="signature-actions">
              <a href="/marine-collageen" className="signature-button">
                Start de 100-dagen kuur <span className="arrow">→</span>
              </a>
              <a href="#ritueel" className="signature-secondary">Hoe het werkt</a>
            </div>
            <div className="signature-footer">
              <span>Vrijblijvend annuleren</span><span className="dot">·</span>
              <span>Gratis verzending</span><span className="dot">·</span>
              <span>Bespaar t.o.v. losse flessen</span>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY CONCERN */}
      <section className="concerns" aria-labelledby="concerns-heading">
        <div className="concerns-header">
          <div className="eyebrow">Shop by concern</div>
          <h2 id="concerns-heading">Wat heeft jouw <em>lichaam</em> nodig?</h2>
          <p>
            Vind de juiste formule voor jouw doelen — van stralende huid tot sterk haar, van
            vitaliteit tot ondersteuning tijdens de overgang.
          </p>
        </div>
        <div className="concerns-grid">
          <a href="/shop" className="concern-card">
            <img
              src="/images/marine-collagen-13000-ritueel-voor-stralende-huid-.jpg"
              alt="Marine Collagen 13.000 ritueel — voor stralende huid en gladdere teint"
            />
            <div className="concern-content">
              <span className="number">01</span>
              <h4>Stralende huid</h4>
              <span className="arrow-text">Voor jou →</span>
            </div>
          </a>
          <a href="/shop" className="concern-card">
            <img
              src="/images/nordsilk-supplementen-voor-sterk-en-vol-haar-the-s.jpg"
              alt="Nordsilk supplementen voor sterk en vol haar — The Swedish Glow"
            />
            <div className="concern-content">
              <span className="number">02</span>
              <h4>Sterk &amp; vol haar</h4>
              <span className="arrow-text">Voor jou →</span>
            </div>
          </a>
          <a href="/shop" className="concern-card">
            <img
              src="/images/freja.jpg"
              alt="FREJA Omega 3 voor algemeen welzijn van The Swedish Glow"
            />
            <div className="concern-content">
              <span className="number">03</span>
              <h4>Algeheel welzijn</h4>
              <span className="arrow-text">Voor jou →</span>
            </div>
          </a>
          <a href="/shop" className="concern-card">
            <img
              src="/images/het-verhaal-achter-hermade.jpg"
              alt="HÉRMADE supplement — voor balans en welzijn tijdens de overgang"
            />
            <div className="concern-content">
              <span className="number">04</span>
              <h4>Overgang &amp; balans</h4>
              <span className="arrow-text">Voor jou →</span>
            </div>
          </a>
        </div>
      </section>

      {/* INGREDIENT SCIENCE */}
      <section className="science" aria-labelledby="science-heading">
        <div className="science-grid">
          <div className="science-image">
            <img
              src="/images/the-swedish-glow-productcollectie-met-marine-colla.jpg"
              alt="The Swedish Glow productcollectie met Marine Collagen 13.000, FREJA Omega 3, Nordsilk en HÉRMADE supplementen"
            />
          </div>
          <div className="science-content">
            <div className="eyebrow">De wetenschap erachter</div>
            <h2 id="science-heading">
              Hooggedoseerd, <em>klinisch onderbouwd</em>, en zorgvuldig samengesteld.
            </h2>
            <p>
              Elk ingrediënt in onze formules is gekozen op basis van wetenschappelijk onderzoek en
              klinische studies. Geen vulstoffen, geen marketing-ingrediënten — alleen wat bewezen
              werkt voor huid, haar en welzijn.
            </p>
            <div className="ingredient-list">
              <div className="ingredient-item">
                <h4>Marine Collageen</h4>
                <p>
                  Hooggedoseerd type I collageen uit duurzame visbron. 13.000 mg per shot — klinisch
                  onderzocht voor huidstevigheid.
                </p>
              </div>
              <div className="ingredient-item">
                <h4>Hyaluronzuur</h4>
                <p>
                  Houdt water vast in de huid. Werkt synergetisch met collageen voor optimale
                  hydratatie en elasticiteit.
                </p>
              </div>
              <div className="ingredient-item">
                <h4>Vitamine C</h4>
                <p>
                  Essentieel voor de natuurlijke collageensynthese in je lichaam. Antioxidant tegen
                  oxidatieve stress.
                </p>
              </div>
              <div className="ingredient-item">
                <h4>Omega 3 (DHA &amp; EPA)</h4>
                <p>
                  Premium visolie uit duurzame Noordzee-bronnen. Ondersteunt de huidbarrière,
                  hersenfunctie en hartgezondheid.
                </p>
              </div>
              <div className="ingredient-item">
                <h4>Biotine, Zink &amp; Selenium</h4>
                <p>
                  Het trio voor sterk haar en gezonde nagels. Draagt bij aan het behoud van glanzend
                  haar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HÉRMADE FEATURE */}
      <section className="feature-strip">
        <div className="feature-grid">
          <div className="feature-image">
            <img
              src="/images/hermade-2.jpg"
              alt="HÉRMADE supplement van The Swedish Glow in luxe verpakking"
            />
            <div className="feature-image-overlay">
              <div className="label">Limited Collection</div>
              <div className="name">HÉRMADE</div>
            </div>
          </div>
          <div className="feature-content">
            <div className="eyebrow">Limited collection</div>
            <h2>HÉRMADE — een ritueel <em>voor jezelf</em>.</h2>
            <p>
              Onze meest exclusieve formule, ontworpen voor de moderne vrouw die kwaliteit boven
              kwantiteit verkiest. 30 dagelijkse sachets, zorgvuldig samengesteld voor diepwerkende
              ondersteuning van huid en welzijn.
            </p>
            <ul className="feature-list">
              <li>30 sachets van 4,5 gram — één maand kuur</li>
              <li>Hooggedoseerde actieve ingrediënten</li>
              <li>Premium verpakking, ideaal als cadeau</li>
              <li>Gemaakt in Zweden, vrij van GMO en gluten</li>
            </ul>
            <a href="/hermade" className="btn">Ontdek HÉRMADE <span className="arrow">→</span></a>
          </div>
        </div>
      </section>

      {/* 100-DAY RITUAL — EDITORIAL EXTENDED */}
      <section className="ritual" id="ritueel" aria-labelledby="ritual-heading">
        {/* Decorative gold ornament header */}
        <div className="ritual-ornament" aria-hidden="true">
          <svg viewBox="0 0 240 60" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="30" x2="80" y2="30" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <circle cx="100" cy="30" r="3" fill="currentColor" opacity="0.4" />
            <path d="M 110 30 Q 120 15, 130 30 Q 140 45, 150 30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
            <circle cx="140" cy="30" r="3" fill="currentColor" opacity="0.4" />
            <line x1="160" y1="30" x2="240" y2="30" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          </svg>
        </div>

        <div className="ritual-wrap">
          <div className="eyebrow">Het 100-dagen ritueel</div>
          <h2 id="ritual-heading">
            Echte schoonheid komt <em>van binnenuit</em>.<br />En vraagt om tijd.
          </h2>
          <p className="ritual-lede">
            Onderzoek toont aan dat consistente inname van collageen pas na meerdere weken zichtbaar
            resultaat geeft. Daarom hebben wij ons ritueel gebouwd rondom een 100-dagen kuur — vier
            flessen, één doel: van binnenuit stralen.
          </p>

          {/* Progress journey with rich icons */}
          <div className="ritual-stages">
            <div className="stage">
              <div className="stage-pct">25<sup>%</sup></div>
              <div className="stage-icon">
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="32" cy="32" r="14" opacity="0.9" />
                  <path d="M22 32 Q32 24 42 32" opacity="0.6" />
                  <path d="M22 32 Q32 40 42 32" opacity="0.6" />
                  <circle cx="32" cy="32" r="2" fill="currentColor" />
                </svg>
              </div>
              <div className="stage-day">Dag 1 — 30</div>
              <h4>Activatie</h4>
              <p>Je lichaam neemt de actieve ingrediënten op. Eerste subtiele veranderingen in hydratatie en energie.</p>
            </div>

            <div className="stage">
              <div className="stage-pct">50<sup>%</sup></div>
              <div className="stage-icon">
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M32 12 Q44 22 44 36 Q44 50 32 52 Q20 50 20 36 Q20 22 32 12 Z" />
                  <path d="M32 24 Q38 32 32 44 Q26 32 32 24 Z" opacity="0.5" />
                </svg>
              </div>
              <div className="stage-day">Dag 31 — 60</div>
              <h4>Verdieping</h4>
              <p>Huid voelt steviger en gladder. Haar wordt voller. Nagels groeien sterker.</p>
            </div>

            <div className="stage">
              <div className="stage-pct">75<sup>%</sup></div>
              <div className="stage-icon">
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="32" cy="32" r="18" />
                  <circle cx="32" cy="32" r="11" opacity="0.6" />
                  <circle cx="32" cy="32" r="4" fill="currentColor" opacity="0.8" />
                  <line x1="32" y1="6" x2="32" y2="12" strokeLinecap="round" />
                  <line x1="32" y1="52" x2="32" y2="58" strokeLinecap="round" />
                  <line x1="6" y1="32" x2="12" y2="32" strokeLinecap="round" />
                  <line x1="52" y1="32" x2="58" y2="32" strokeLinecap="round" />
                  <line x1="14" y1="14" x2="18" y2="18" strokeLinecap="round" opacity="0.6" />
                  <line x1="46" y1="46" x2="50" y2="50" strokeLinecap="round" opacity="0.6" />
                  <line x1="46" y1="18" x2="50" y2="14" strokeLinecap="round" opacity="0.6" />
                  <line x1="14" y1="50" x2="18" y2="46" strokeLinecap="round" opacity="0.6" />
                </svg>
              </div>
              <div className="stage-day">Dag 61 — 90</div>
              <h4>De glow</h4>
              <p>Zichtbare resultaten op fijne lijntjes en huidstevigheid. Je glow is terug.</p>
            </div>

            <div className="stage">
              <div className="stage-pct">100<sup>%</sup></div>
              <div className="stage-icon">
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M16 32 Q32 16 48 32 Q32 48 16 32 Z" />
                  <path d="M22 32 Q32 22 42 32 Q32 42 22 32 Z" opacity="0.6" />
                  <circle cx="32" cy="32" r="3" fill="currentColor" />
                  <path d="M32 8 L32 14 M32 50 L32 56 M8 32 L14 32 M50 32 L56 32" strokeLinecap="round" opacity="0.5" />
                </svg>
              </div>
              <div className="stage-day">Dag 91 — 100+</div>
              <h4>Onderhoud</h4>
              <p>Een dagelijkse gewoonte voor blijvende resultaten — jouw Swedish Glow ritueel.</p>
            </div>
          </div>

          {/* What's happening inside */}
          <div className="ritual-inside">
            <div className="ritual-inside-header">
              <div className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Wat gebeurt er in je lichaam</div>
              <h3>Drie pijlers, één <em>fundament</em>.</h3>
            </div>
            <div className="ritual-inside-grid">
              <div className="pillar">
                <div className="pillar-icon">
                  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M24 6 C16 14, 16 22, 24 28 C32 22, 32 14, 24 6 Z" />
                    <path d="M24 28 L24 42" strokeLinecap="round" />
                    <path d="M18 36 L24 42 L30 36" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h4>Cellulaire opname</h4>
                <p>
                  Vloeibare moleculen worden snel opgenomen via je darmwand en bereiken je cellen
                  waar ze nodig zijn.
                </p>
              </div>
              <div className="pillar">
                <div className="pillar-icon">
                  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <circle cx="24" cy="24" r="14" />
                    <path d="M24 14 Q30 18 30 24 Q30 30 24 34 Q18 30 18 24 Q18 18 24 14 Z" opacity="0.6" />
                    <circle cx="24" cy="24" r="3" fill="currentColor" />
                  </svg>
                </div>
                <h4>Collageensynthese</h4>
                <p>
                  Je lichaam gebruikt de aminozuren om nieuwe collageenvezels op te bouwen — de
                  basis van een stevige huid.
                </p>
              </div>
              <div className="pillar">
                <div className="pillar-icon">
                  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M12 36 Q20 28 24 32 Q28 36 36 12" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="36" cy="12" r="3" />
                    <path d="M8 40 L40 40" strokeLinecap="round" opacity="0.5" />
                  </svg>
                </div>
                <h4>Zichtbaar resultaat</h4>
                <p>
                  Met de tijd zie en voel je het verschil — niet als pleister, maar als langdurige
                  verandering vanuit binnen.
                </p>
              </div>
            </div>
          </div>

          {/* Editorial closing quote */}
          <div className="ritual-closing">
            <div className="ritual-quote">
              <span className="quote-decor">&quot;</span>
              <p>
                Het is geen sprint. Het is een seizoen — een seizoen waarin je investeert in
                jezelf, dag voor dag.
              </p>
            </div>
            <a href="/marine-collageen" className="btn btn-gold">
              Start de 100-dagen kuur <span className="arrow">→</span>
            </a>
            <div className="ritual-meta">
              <span>4 flessen × 500 ml</span>
              <span>·</span>
              <span>Voldoende voor 100 dagen</span>
              <span>·</span>
              <span>Vrijblijvend annuleren</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDERS / FAMILY STORY */}
      <section className="founders" aria-labelledby="founders-heading">
        <div className="founders-wrap">
          <div className="founders-images">
            <div className="founders-landscape">
              <img
                src="/images/waarom-we-kozen-voor-branno.jpg"
                alt="Het noorderlicht boven Zweden — de inspiratie achter The Swedish Glow"
              />
              <div className="landscape-caption">
                <span className="caption-label">Lapland · Zweden</span>
                <span className="caption-text">Aurora Borealis</span>
              </div>
            </div>
          </div>
          <div className="founders-content">
            <div className="eyebrow">Het verhaal van Elin Hellqvist-Moayedi</div>
            <h2>Geboren uit liefde voor het <em>Zweedse welzijnsritueel</em>.</h2>
            <p>
              Tijdens onze reizen door Zweden ontdekten we hoe diep welzijn verweven is met het
              dagelijks leven — van de Scandinavische winterzon tot de gewoonte om te beginnen met
              iets puurs en voedzaams. Die eenvoud, dat ritueel, wilden we meenemen naar Nederland.
            </p>
            <div className="founders-quote">
              Wij maken supplementen die wij zelf elke ochtend nemen — voor onze familie, en voor
              de jouwe.
              <div className="founders-quote-attribution">— Elin Hellqvist-Moayedi, oprichtster</div>
            </div>
            <p>
              Vandaag werken we samen met Zweedse producenten die dezelfde waarden delen:
              zuiverheid, zorgvuldigheid, en het vermogen om iets klein te houden zodat de kwaliteit
              hoog blijft. Geen massaproductie. Wel het beste van wat de Noordse natuur biedt.
            </p>
            <div className="founders-meta">
              <div><strong>2022</strong>Opgericht in Nederland</div>
              <div><strong>100.000+</strong>Tevreden klanten</div>
              <div><strong>23</strong>Landen wereldwijd</div>
            </div>
          </div>
        </div>
      </section>

      {/* NORDIC PROMISE */}
      <section className="promise" aria-labelledby="promise-heading">
        <div className="promise-header">
          <div className="eyebrow-ornament">
            <span className="line"></span>
            <span className="label">Nordic Promise</span>
            <span className="line"></span>
          </div>
          <h2
            id="promise-heading"
            className="serif"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400 }}
          >
            Wat je <em style={{ color: 'var(--moss)', fontStyle: 'italic' }}>altijd</em> van ons
            mag verwachten.
          </h2>
        </div>
        <div className="promise-grid">
          <div className="promise-item">
            <div className="promise-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M24 6 L10 12 v10 c0 9 6 17 14 20 8-3 14-11 14-20 V12 L24 6z" />
                <path d="M19 24 l4 4 8-9" strokeWidth="1.4" />
              </svg>
            </div>
            <h4>Made in Sweden</h4>
            <p>Geproduceerd onder strenge Zweedse kwaliteitsnormen, met natuurlijke ingrediënten.</p>
          </div>
          <div className="promise-item">
            <div className="promise-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="24" cy="24" r="18" />
                <path d="M24 8 c4 6 4 14 0 20 -4-6-4-14 0-20z" opacity="0.5" />
                <path d="M16 24 h16" opacity="0.5" />
                <path d="M14 30 c4-2 8-2 10 0 2 2 6 2 10 0" opacity="0.5" />
              </svg>
            </div>
            <h4>Vrij van GMO &amp; gluten</h4>
            <p>Geen onnodige toevoegingen, geen suiker. Schone formules die je lichaam herkent.</p>
          </div>
          <div className="promise-item">
            <div className="promise-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="24" cy="18" r="6" />
                <path d="M14 38 c0-5 4-9 10-9 s10 4 10 9" />
                <circle cx="36" cy="22" r="3" opacity="0.5" />
                <circle cx="12" cy="22" r="3" opacity="0.5" />
                <path d="M30 32 c2 0 5 2 5 6" opacity="0.5" />
                <path d="M18 32 c-2 0-5 2-5 6" opacity="0.5" />
              </svg>
            </div>
            <h4>Familiemerk</h4>
            <p>Een Nederlands familiebedrijf dat persoonlijk staat voor elk product dat we maken.</p>
          </div>
          <div className="promise-item">
            <div className="promise-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 28 h20" />
                <path d="M26 22 h12 l4 8 v6 h-4" />
                <path d="M6 28 v8 h4" />
                <circle cx="14" cy="36" r="4" fill="currentColor" fillOpacity="0.1" />
                <circle cx="34" cy="36" r="4" fill="currentColor" fillOpacity="0.1" />
                <path d="M10 16 h12" opacity="0.4" />
                <path d="M14 22 h8" opacity="0.4" />
              </svg>
            </div>
            <h4>Gratis verzending</h4>
            <p>Vanaf €60, vandaag besteld is morgen in huis. Eenvoudig retourneren binnen 14 dagen.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials" aria-labelledby="testimonials-heading">
        <div className="testimonials-wrap">
          <div className="testimonials-header">
            <div className="eyebrow">Echte verhalen</div>
            <h2 id="testimonials-heading">
              Meer dan <em>100.000 vrouwen</em> kozen voor hun Swedish Glow.
            </h2>
            <p>
              Van eerste kuur tot vaste ochtendgewoonte — dit is wat onze klanten ons vertellen over
              hun ervaringen.
            </p>
          </div>
          <div className="testimonials-grid">
            <article className="testimonial">
              <div className="testimonial-stars">★★★★★</div>
              <blockquote>
                Na drie maanden zag ik écht verschil — sterker haar, een gladdere huid, en een rust
                in mijn ochtendritueel die ik niet meer wil missen.
              </blockquote>
              <div className="testimonial-author">
                <div>
                  <div className="name">Marieke, 47</div>
                  <div className="meta">Klant sinds 2023</div>
                </div>
                <div className="product">Marine Collageen</div>
              </div>
            </article>
            <article className="testimonial">
              <div className="testimonial-stars">★★★★★</div>
              <blockquote>
                Mijn haaruitval is duidelijk minder geworden, en ik krijg vaker complimenten over
                mijn huid. Eindelijk een supplement dat doet wat het belooft.
              </blockquote>
              <div className="testimonial-author">
                <div>
                  <div className="name">Sophie, 52</div>
                  <div className="meta">Klant sinds 2024</div>
                </div>
                <div className="product">Nordsilk</div>
              </div>
            </article>
            <article className="testimonial">
              <div className="testimonial-stars">★★★★★</div>
              <blockquote>
                FREJA neem ik elke ochtend met mijn koffie. Mijn huid voelt rustiger, mijn hoofd
                helderder. Het is een ritueel geworden zonder dat ik er nog over hoef na te denken.
              </blockquote>
              <div className="testimonial-author">
                <div>
                  <div className="name">Lisa, 34</div>
                  <div className="meta">Klant sinds 2024</div>
                </div>
                <div className="product">FREJA Omega 3</div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* RESULTS / KLINISCHE CIJFERS */}
      <section className="results" aria-labelledby="results-heading">
        <div className="results-wrap">
          <div className="eyebrow">Resultaten in cijfers</div>
          <h2 id="results-heading">Wat klanten <em>na 12 weken</em> ervaren.</h2>
          <p>
            Op basis van een interne klanttevredenheidsenquête onder 847 deelnemers die de 100-dagen
            kuur volgden in 2024.
          </p>
          <div className="results-grid">
            <div className="result-stat">
              <div className="pct">94<sup>%</sup></div>
              <h4>Stevigere huid</h4>
              <p>Ervaren een merkbaar steviger en gladder huidgevoel.</p>
            </div>
            <div className="result-stat">
              <div className="pct">87<sup>%</sup></div>
              <h4>Voller haar</h4>
              <p>Zien duidelijk verschil in de dikte en glans van hun haar.</p>
            </div>
            <div className="result-stat">
              <div className="pct">91<sup>%</sup></div>
              <h4>Sterkere nagels</h4>
              <p>Minder breuk en zichtbaar gezondere nagelgroei.</p>
            </div>
            <div className="result-stat">
              <div className="pct">96<sup>%</sup></div>
              <h4>Zou aanbevelen</h4>
              <p>Beveelt The Swedish Glow aan bij vrienden en familie.</p>
            </div>
          </div>
          <div className="results-footnote">
            * Resultaten kunnen per persoon verschillen. Inname dient consistent te zijn voor
            optimaal effect.
          </div>
        </div>
      </section>

      {/* MAGAZINE EDITORIAL SPREAD */}
      <section className="magazine" aria-labelledby="magazine-heading">
        <div className="magazine-grid">
          <div className="magazine-image">
            <img src="/images/freja.jpg" alt="FREJA Omega 3 — The Swedish Glow nieuwste lancering" />
          </div>
          <div className="magazine-content">
            <div className="issue">Issue No. 01 — Het Nordic ritueel</div>
            <h2 id="magazine-heading">FREJA — een ode aan <em>de zee</em>.</h2>
            <p className="lede">
              Vernoemd naar de Nordse godin van schoonheid, liefde en vruchtbaarheid. Onze nieuwe
              vloeibare Omega 3 brengt de kracht van de Scandinavische kust naar je dagelijkse
              ritueel.
            </p>
            <p className="body-copy">
              FREJA is het resultaat van twee jaar onderzoek — een formule die de essentie van Omega
              3 vangt in 150 ml zuiverheid. Geen capsules, geen vissmaak. Alleen wat je lichaam
              herkent en gebruikt.
            </p>
            <p className="body-copy">
              Voor wie zijn ochtend wil beginnen met iets dat voedt — van binnenuit, met aandacht.
            </p>
            <a href="/freja" className="read-more">Lees het volledige verhaal →</a>
          </div>
        </div>
      </section>

      {/* EDITORIAL QUOTE */}
      <section className="editorial">
        <div className="editorial-wrap">
          <div className="quote-mark">&quot;</div>
          <blockquote>
            Schoonheid is geen project. Het is een ritueel — iets wat je elke ochtend rustig,
            bewust, en met aandacht voor jezelf doet.
          </blockquote>
          <cite>— The Swedish Glow philosophy</cite>
        </div>
      </section>

      {/* INSTAGRAM-STYLE LOOKBOOK */}
      <section className="lookbook" aria-labelledby="lookbook-heading">
        <div className="lookbook-header">
          <div>
            <div className="eyebrow">@theswedishglow</div>
            <h2 id="lookbook-heading">Het ritueel <em>in beeld</em>.</h2>
          </div>
          <a href="https://www.instagram.com/theswedishglow/" className="handle">Volg ons →</a>
        </div>
        <div className="lookbook-grid">
          <a href="https://www.instagram.com/theswedishglow/" className="lookbook-tile">
            <img src="/images/marine-collageen-13000-lifestyle.jpg" alt="Marine Collagen 13.000 lifestyle The Swedish Glow" />
          </a>
          <a href="https://www.instagram.com/theswedishglow/" className="lookbook-tile">
            <img src="/images/nordsilk.jpg" alt="Nordsilk lifestyle The Swedish Glow" />
          </a>
          <a href="https://www.instagram.com/theswedishglow/" className="lookbook-tile">
            <img src="/images/hermade-2.jpg" alt="HÉRMADE verpakking The Swedish Glow" />
          </a>
          <a href="https://www.instagram.com/theswedishglow/" className="lookbook-tile">
            <img src="/images/het-verhaal-achter-hermade.jpg" alt="Vrouw met HÉRMADE sachets van The Swedish Glow" />
          </a>
          <a href="https://www.instagram.com/theswedishglow/" className="lookbook-tile">
            <img src="/images/nordsilk-het-haarritueel-van-the-swedish-glow.jpg" alt="Nordsilk portrait The Swedish Glow" />
          </a>
          <a href="https://www.instagram.com/theswedishglow/" className="lookbook-tile">
            <img src="/images/marine-collageen-13000-het-ochtendritueel-van-the-.jpg" alt="Marine Collageen still life The Swedish Glow" />
          </a>
          <a href="https://www.instagram.com/theswedishglow/" className="lookbook-tile">
            <img src="/images/hermade-product.jpg" alt="HÉRMADE styling The Swedish Glow" />
          </a>
          <a href="https://www.instagram.com/theswedishglow/" className="lookbook-tile">
            <img src="/images/marine-collagen-13000-ritueel-voor-stralende-huid-.jpg" alt="Marine Collageen ritueel The Swedish Glow" />
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section" aria-labelledby="faq-heading">
        <div className="faq-wrap">
          <div className="faq-intro">
            <div className="eyebrow">Veelgestelde vragen</div>
            <h2 id="faq-heading">Alles wat je wilt <em>weten</em>.</h2>
            <p>
              De meest gestelde vragen over onze supplementen, het 100-dagen ritueel en Nordic
              beauty in het algemeen — kort en helder beantwoord.
            </p>
            <p style={{ marginTop: '32px' }}>
              Staat je vraag er niet bij?{' '}
              <a href="/contact" style={{ color: 'var(--ink)', borderBottom: '1px solid var(--gold)' }}>
                Neem contact op
              </a>
              .
            </p>
          </div>
          <div className="faq-list">
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">
                Werkt vloeibaar collageen beter dan poeder of capsules?<span className="icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Vloeibaar collageen wordt door velen als prettiger ervaren omdat het direct
                  opneembaar is en een hogere dosering per portie kan bevatten. Onze Marine
                  Collageen levert 13.000 mg per dagelijkse shot van 20 ml — een van de hoogste
                  doseringen op de Europese markt. Wat het beste werkt verschilt per persoon, maar
                  consistente inname is altijd het belangrijkste.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">
                Hoeveel mg collageen per dag heb ik nodig voor zichtbaar resultaat?<span className="icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Klinisch onderzoek toont effecten op huidstevigheid en hydratatie vanaf 2.500 tot
                  10.000 mg collageen per dag. Onze formule met 13.000 mg per shot zit ruim boven de
                  aanbevolen ondergrens, zodat je geen risico loopt op onderdosering. Resultaten zijn
                  doorgaans zichtbaar tussen 6 en 12 weken bij dagelijks gebruik.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">
                Wanneer zie ik resultaat van The Swedish Glow?<span className="icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  De meeste klanten merken in week 4 al subtiele verschillen in huidhydratatie en
                  energie. Vanaf week 8 zijn veranderingen in haar, nagels en huidstevigheid
                  zichtbaar. Voor optimale resultaten raden we een kuur van 100 dagen aan, gevolgd
                  door een onderhoudsdosering.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">
                Zijn de supplementen geschikt tijdens de overgang?<span className="icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Ja. Veel van onze klanten zijn vrouwen tussen 40 en 65 jaar, in de peri- of
                  postmenopauze. Onze formules ondersteunen huid, haar en welzijn juist in de
                  levensfase waarin de natuurlijke collageenproductie afneemt. Gebruik je medicatie?
                  Raadpleeg dan altijd eerst je arts.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">
                Bevat Marine Collageen vis? Is het geschikt bij visallergie?<span className="icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Ja, onze Marine Collageen wordt gewonnen uit duurzame visbronnen. Bij visallergie
                  raden we af deze te gebruiken en raden we aan eerst contact op te nemen voor
                  persoonlijk advies.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">
                Wat is het verschil tussen FREJA en Plantique Omega 3?<span className="icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  FREJA is onze nieuwe vlaggenschip Omega 3, een premium vloeibare formule uit
                  duurzame Noordzee-visserij met een hoge concentratie EPA en DHA. Plantique was
                  onze plantaardige Omega 3 uit algen, die we momenteel uitfaseren. Plantique is nog
                  beschikbaar zolang de voorraad strekt voor klanten die de plantaardige variant
                  verkiezen.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">
                Waar worden de producten gemaakt?<span className="icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Alle The Swedish Glow supplementen worden geproduceerd in Zweden onder strenge
                  kwaliteitsnormen. We zijn een Nederlands familiebedrijf met Zweedse roots: de
                  combinatie van Nederlandse zorgvuldigheid en Scandinavische zuiverheid zit in alles
                  wat we maken.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-question" aria-expanded="false">
                Wat is het verschil tussen marine collageen en rundercollageen?<span className="icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Marine collageen (uit vis) bestaat voornamelijk uit type I collageen, het type dat
                  het meest voorkomt in de huid. Rundercollageen bevat naast type I ook veel type
                  III, vooral interessant voor gewrichten. Marine collageen wordt door zijn kleinere
                  peptidegrootte vaak sneller opgenomen. Wij kozen bewust voor marine collageen voor
                  zijn focus op huid, haar en nagels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter">
        <div className="newsletter-wrap">
          <div className="eyebrow">Het Nordic ritueel</div>
          <h2>Ontvang ons <em>welkomstcadeau</em>.</h2>
          <p>
            Schrijf je in voor onze nieuwsbrief en ontvang ons welkomstcadeau, plus inspiratie voor
            je Nordic beauty-ritueel.
          </p>
          <form className="newsletter-form">
            <input type="email" placeholder="Jouw e-mailadres" required />
            <button type="submit">Inschrijven →</button>
          </form>
        </div>
      </section>
    </main>
  )
}
