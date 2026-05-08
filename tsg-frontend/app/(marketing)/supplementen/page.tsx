export const metadata = {
  title: 'Supplementen',
  description: 'Alle TSG supplementen op een rij.',
}

export default function SupplementenPage() {
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
        <span className="current">Supplementen</span>
      </div>

      <section className="page-hero">
        <div className="page-hero-eyebrow">De collectie</div>
        <h1>Onze <em>supplementen</em>.</h1>
        <p>Vier rituelen, één toewijding. Premium vloeibare supplementen, ontwikkeld in Zweden, voor élke vrouw die haar lichaam serieus neemt.</p>
      </section>

      <section className="shop-grid">
        <a href="/marine-collageen" className="shop-card">
          <div className="shop-card-image">
            <span className="shop-card-roman">I</span>
            <div className="shop-card-badge">Bestseller</div>
            <img src="/images/marine-collageen-13000-het-ochtendritueel-van-the-.jpg" alt="Marine Collageen 13.000" />
          </div>
          <div className="shop-card-info">
            <div className="shop-card-tag">Het ochtendritueel</div>
            <h3>Marine Collageen 13.000</h3>
            <p>Vloeibare premium viscollageen — 13.000 mg per shot. Voor stevigheid, hydratatie en glow van binnenuit.</p>
            <div className="shop-card-footer">
              <div className="shop-card-price">Vanaf €59</div>
              <div className="shop-card-cta">Ontdek <span>→</span></div>
            </div>
          </div>
        </a>
        <a href="/nordsilk" className="shop-card">
          <div className="shop-card-image">
            <span className="shop-card-roman">II</span>
            <div className="shop-card-badge">Vegan</div>
            <img src="/images/nordsilk.jpg" alt="Nordsilk" />
          </div>
          <div className="shop-card-info">
            <div className="shop-card-tag">Het haarritueel</div>
            <h3>Nordsilk</h3>
            <p>Voor wie merkt dat haar dunner wordt. Voedt haar, hoofdhuid en nagels van binnenuit.</p>
            <div className="shop-card-footer">
              <div className="shop-card-price">Vanaf €47</div>
              <div className="shop-card-cta">Ontdek <span>→</span></div>
            </div>
          </div>
        </a>
        <a href="/freja" className="shop-card">
          <div className="shop-card-image">
            <span className="shop-card-roman">III</span>
            <div className="shop-card-badge">Coming soon</div>
            <img src="/images/freja.jpg" alt="FREJA" />
          </div>
          <div className="shop-card-info">
            <div className="shop-card-tag">Het basisritueel</div>
            <h3>FREJA</h3>
            <p>Premium vloeibare Omega 3 uit de Noordzee. Het fundament onder elk ritueel.</p>
            <div className="shop-card-footer">
              <div className="shop-card-price">Coming soon</div>
              <div className="shop-card-cta">Ontdek <span>→</span></div>
            </div>
          </div>
        </a>
        <a href="/hermade" className="shop-card">
          <div className="shop-card-image">
            <span className="shop-card-roman">IV</span>
            <img src="/images/hermade-2.jpg" alt="HÉRMADE" />
          </div>
          <div className="shop-card-info">
            <div className="shop-card-tag">Het maandritueel</div>
            <h3>HÉRMADE</h3>
            <p>30 sticks voor energie, balans en innerlijke rust tijdens de overgang.</p>
            <div className="shop-card-footer">
              <div className="shop-card-price">€39</div>
              <div className="shop-card-cta">Ontdek <span>→</span></div>
            </div>
          </div>
        </a>
      </section>
    </main>
  )
}
