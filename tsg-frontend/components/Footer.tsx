import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="footer-wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="/images/the-swedish-glow-logo.png" className="footer-logo-mark" alt="The Swedish Glow logo" />
            <h3>The Swedish <em>Glow</em></h3>
            <p>Een Nederlands familiemerk met Zweedse roots. Premium vloeibare supplementen voor huid, haar en welzijn, gemaakt in Zweden, met liefde voor het Nordic beauty-ritueel.</p>
            <div className="social">
              <a href="https://www.instagram.com/theswedishglow/" aria-label="Instagram">IG</a>
              <a href="https://www.facebook.com/theswedishglow" aria-label="Facebook">FB</a>
              <a href="https://wa.me/+31630537452" aria-label="WhatsApp">WA</a>
              <a href="https://nl.trustpilot.com/review/theswedishglow.com" aria-label="Trustpilot">&#9733;</a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Shop</h5>
            <ul>
              <li><Link href="/shop">Alle producten</Link></li>
              <li><Link href="/marine-collageen">Marine Collageen 13.000</Link></li>
              <li><Link href="/freja">FREJA Omega 3</Link></li>
              <li><Link href="/nordsilk">Nordsilk</Link></li>
              <li><Link href="/hermade">H&#201;RMADE</Link></li>
              <li><Link href="/freja">Plantique Omega 3</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Over</h5>
            <ul>
              <li><Link href="/over-ons">Ons verhaal</Link></li>
              <li><Link href="/supplementen">Hoe het werkt</Link></li>
              <li><Link href="/stories">Stories &amp; blog</Link></li>
              <li><Link href="/reseller-programma">Reseller worden</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Support</h5>
            <ul>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/levering">Verzending &amp; retour</Link></li>
              <li><Link href="/mijn-account">Mijn account</Link></li>
              <li><Link href="/nieuwsbrief">Nieuwsbrief</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>&#169; 2026 The Swedish Glow &middot; All rights reserved</div>
          <div className="legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/voorwaarden">Voorwaarden</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
