'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header>
        <nav className="nav-wrap">
          <div className="nav-left">
            <Link href="/shop">Shop</Link>
            <div className="nav-dropdown">
              <Link href="/supplementen" className="nav-dropdown-trigger">
                Supplementen <span className="nav-arrow">&#9662;</span>
              </Link>
              <div className="nav-dropdown-menu" role="menu">
                <Link href="/marine-collageen" role="menuitem">
                  <span className="nav-product-num">I</span>
                  <span className="nav-product-info">
                    <span className="nav-product-name">Marine Collageen 13.000</span>
                    <span className="nav-product-tag">Het ochtendritueel</span>
                  </span>
                </Link>
                <Link href="/nordsilk" role="menuitem">
                  <span className="nav-product-num">II</span>
                  <span className="nav-product-info">
                    <span className="nav-product-name">Nordsilk</span>
                    <span className="nav-product-tag">Het haarritueel</span>
                  </span>
                </Link>
                <Link href="/freja" role="menuitem">
                  <span className="nav-product-num">III</span>
                  <span className="nav-product-info">
                    <span className="nav-product-name">FREJA</span>
                    <span className="nav-product-tag">Het basisritueel</span>
                  </span>
                </Link>
                <Link href="/hermade" role="menuitem">
                  <span className="nav-product-num">IV</span>
                  <span className="nav-product-info">
                    <span className="nav-product-name">H&#201;RMADE</span>
                    <span className="nav-product-tag">Het maandritueel</span>
                  </span>
                </Link>
                <div className="nav-dropdown-divider"></div>
                <Link href="/#100-dagen-kuur" role="menuitem" className="nav-dropdown-cta">
                  <span className="nav-product-num">&#8734;</span>
                  <span className="nav-product-info">
                    <span className="nav-product-name">100-dagen kuur</span>
                    <span className="nav-product-tag">Het signature ritueel</span>
                  </span>
                </Link>
              </div>
            </div>
            <Link href="/stories">Stories</Link>
            <Link href="/over-ons">Ons verhaal</Link>
            <Link href="/reseller-programma">Reseller programma</Link>
          </div>
          <Link href="/" className="logo" aria-label="The Swedish Glow homepage">
            <img src="/images/the-swedish-glow-logo.png" className="logo-mark" alt="" />
            <span className="logo-text">The Swedish <em>Glow</em></span>
          </Link>
          <div className="nav-right">
            <div className="lang-switch">
              <Link href="/" className="active">NL</Link>
              <Link href="/">EN</Link>
            </div>
            <Link href="/mijn-account">Account</Link>
            <Link href="/winkelwagen">Cart (0)</Link>
            <Link href="/reseller/login" className="reseller-login">Login Resellers</Link>
          </div>
          <button
            className="nav-hamburger"
            aria-label="Menu openen"
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <span></span><span></span><span></span>
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <div
        className="mobile-menu"
        id="mobile-menu"
        aria-hidden={!mobileOpen}
      >
        <div className="mobile-menu-header">
          <span className="mobile-menu-title">Menu</span>
          <button
            className="mobile-menu-close"
            aria-label="Menu sluiten"
            onClick={() => setMobileOpen(false)}
          >
            &times;
          </button>
        </div>
        <nav className="mobile-menu-nav" aria-label="Mobile navigation">
          <Link href="/shop" onClick={() => setMobileOpen(false)}>Shop</Link>
          <Link href="/supplementen" onClick={() => setMobileOpen(false)}>Supplementen</Link>
          <div className="mobile-menu-sublist">
            <Link href="/marine-collageen" onClick={() => setMobileOpen(false)}>&#8212; Marine Collageen 13.000</Link>
            <Link href="/nordsilk" onClick={() => setMobileOpen(false)}>&#8212; Nordsilk</Link>
            <Link href="/freja" onClick={() => setMobileOpen(false)}>&#8212; FREJA</Link>
            <Link href="/hermade" onClick={() => setMobileOpen(false)}>&#8212; H&#201;RMADE</Link>
            <Link href="/#100-dagen-kuur" onClick={() => setMobileOpen(false)}>&#8212; 100-dagen kuur</Link>
          </div>
          <Link href="/stories" onClick={() => setMobileOpen(false)}>Stories</Link>
          <Link href="/over-ons" onClick={() => setMobileOpen(false)}>Ons verhaal</Link>
          <Link href="/reseller-programma" onClick={() => setMobileOpen(false)}>Reseller programma</Link>
          <div className="mobile-menu-divider"></div>
          <Link href="/mijn-account" onClick={() => setMobileOpen(false)}>Mijn account</Link>
          <Link href="/winkelwagen" onClick={() => setMobileOpen(false)}>Winkelwagen</Link>
          <Link href="/reseller/login" onClick={() => setMobileOpen(false)}>Login resellers</Link>
        </nav>
      </div>
    </>
  )
}
