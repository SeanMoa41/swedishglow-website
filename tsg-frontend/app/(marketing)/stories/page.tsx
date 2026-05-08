export const metadata = {
  title: 'Stories',
  description: 'Ervaringen en verhalen van onze gemeenschap.',
}

export default function StoriesPage() {
  return (
    <main>
      <div className="breadcrumb">
        <a href="/">Home</a>
        <span className="sep">/</span>
        <span className="current">Stories</span>
      </div>

      <section className="page-hero">
        <div className="page-hero-eyebrow">Het journal</div>
        <h1>Stories &amp; <em>inzichten</em>.</h1>
        <p>Verhalen over rituelen, ingrediënten en de vrouwen achter The Swedish Glow. Verdiep je in wat schoonheid van binnenuit écht betekent.</p>
      </section>

      <section className="stories-list">
        <a href="#" className="story-card">
          <div className="story-card-image">
            <img src="/images/freja.jpg" alt="Omega 3 bij rosacea: natuurlijke rust voor een gevoelige huid" />
          </div>
          <div className="story-card-info">
            <div className="story-meta">
              <span>Skincare &amp; lifestyle</span>
              <span className="dot">·</span>
              <span>6 min leestijd</span>
            </div>
            <h3>Omega 3 bij rosacea: natuurlijke rust voor een gevoelige huid</h3>
            <p>Ontdek hoe omega 3-vetzuren helpen bij rosacea. Kalmeer ontstekingen, versterk je huidbarrière en geef je gevoelige huid de ondersteuning die het nodig heeft.</p>
            <div className="story-card-cta">Lees verder <span>→</span></div>
          </div>
        </a>
        <a href="#" className="story-card">
          <div className="story-card-image">
            <img src="/images/the-swedish-glow-productcollectie-met-marine-colla.jpg" alt="Meer eten, minder voeden: waarom suppletie geen luxe is" />
          </div>
          <div className="story-card-info">
            <div className="story-meta">
              <span>Skincare &amp; lifestyle</span>
              <span className="dot">·</span>
              <span>5 min leestijd</span>
            </div>
            <h3>Meer eten, minder voeden: waarom suppletie geen luxe is</h3>
            <p>We leven in een tijd van overvloed, maar komen toch voedingsstoffen tekort. Ontdek waarom suppletie geen luxe is, maar soms pure noodzaak.</p>
            <div className="story-card-cta">Lees verder <span>→</span></div>
          </div>
        </a>
        <a href="#" className="story-card">
          <div className="story-card-image">
            <img src="/images/marine-collageen-13000-het-ochtendritueel-van-the-.jpg" alt="Werken collageensupplementen echt?" />
          </div>
          <div className="story-card-info">
            <div className="story-meta">
              <span>Collageen &amp; huidverzorging</span>
              <span className="dot">·</span>
              <span>8 min leestijd</span>
            </div>
            <h3>Werken collageensupplementen echt?</h3>
            <p>Collageensupplementen beloven veel — maar doen ze ook echt iets voor je huid? We duiken in de feiten, delen ervaringen en geven je slimme tips.</p>
            <div className="story-card-cta">Lees verder <span>→</span></div>
          </div>
        </a>
        <a href="#" className="story-card">
          <div className="story-card-image">
            <img src="/images/marine-collageen-13000-lifestyle.jpg" alt="Omega-3 supplement: alles over DHA, EPA en algenolie" />
          </div>
          <div className="story-card-info">
            <div className="story-meta">
              <span>Ken je ingrediënt</span>
              <span className="dot">·</span>
              <span>7 min leestijd</span>
            </div>
            <h3>Omega-3 supplement: alles over DHA, EPA en algenolie</h3>
            <p>Omega-3 vetzuren zijn onmisbaar voor je hart, hersenen en algehele gezondheid — maar veel mensen krijgen er te weinig van binnen. Lees alles over de voordelen.</p>
            <div className="story-card-cta">Lees verder <span>→</span></div>
          </div>
        </a>
        <a href="#" className="story-card">
          <div className="story-card-image">
            <img src="/images/nordsilk-het-haarritueel-van-the-swedish-glow.jpg" alt="Haar &amp; Hormonen: Wat oestrogeen, testosteron en stress doen met je haar" />
          </div>
          <div className="story-card-info">
            <div className="story-meta">
              <span>Voeding &amp; gezondheid</span>
              <span className="dot">·</span>
              <span>9 min leestijd</span>
            </div>
            <h3>Haar &amp; Hormonen: wat oestrogeen, testosteron en stress doen met je haar</h3>
            <p>Hormonen hebben grote invloed op je haargroei en -uitval. Van zwangerschap tot stress en overgang: ontdek hoe jouw hormonale balans samenhangt met de conditie van je haar.</p>
            <div className="story-card-cta">Lees verder <span>→</span></div>
          </div>
        </a>
        <a href="#" className="story-card">
          <div className="story-card-image">
            <img src="/images/marine-collagen-13000-ritueel-voor-stralende-huid-.jpg" alt="Werken collageensupplementen écht?" />
          </div>
          <div className="story-card-info">
            <div className="story-meta">
              <span>De wetenschap</span>
              <span className="dot">·</span>
              <span>8 min leestijd</span>
            </div>
            <h3>De wetenschap achter collageen</h3>
            <p>Ontdek wat 25+ klinische studies zeggen over collageen en huidresultaten — en wat dat voor jouw ritueel betekent.</p>
            <div className="story-card-cta">Lees verder <span>→</span></div>
          </div>
        </a>
        <a href="#" className="story-card">
          <div className="story-card-image">
            <img src="/images/het-verhaal-achter-hermade.jpg" alt="Het verhaal achter HÉRMADE" />
          </div>
          <div className="story-card-info">
            <div className="story-meta">
              <span>Achter de schermen</span>
              <span className="dot">·</span>
              <span>6 min leestijd</span>
            </div>
            <h3>Het verhaal achter HÉRMADE</h3>
            <p>Hoe Elin een supplement ontwikkelde voor de overgang — vrouwvriendelijk, natuurlijk en zonder taboes.</p>
            <div className="story-card-cta">Lees verder <span>→</span></div>
          </div>
        </a>
        <a href="#" className="story-card">
          <div className="story-card-image">
            <img src="/images/waarom-we-kozen-voor-branno.jpg" alt="Waarom we kozen voor Brännö" />
          </div>
          <div className="story-card-info">
            <div className="story-meta">
              <span>Het merk</span>
              <span className="dot">·</span>
              <span>5 min leestijd</span>
            </div>
            <h3>Waarom we kozen voor Brännö</h3>
            <p>Een eiland in het hoge noorden, een familiemerk en de stilte die alles veranderde.</p>
            <div className="story-card-cta">Lees verder <span>→</span></div>
          </div>
        </a>
      </section>
    </main>
  )
}
