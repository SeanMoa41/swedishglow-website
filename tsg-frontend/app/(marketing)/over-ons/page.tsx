export const metadata = {
  title: 'Over Ons',
  description: 'Het verhaal achter The Swedish Glow.',
}

export default function OverOnsPage() {
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

      {/* HERO */}
      <section className="story-hero">
        <div className="story-hero-wrap">
          <div className="eyebrow">Het verhaal</div>
          <h1>Het echte. <em>Daar</em><br />gaat het over.</h1>
          <p className="lede">
            Het verhaal van Elin Hellqvist-Moayedi. Geboren in Zweden, gevormd in de corporate wereld,
            psycholoog van professie — en een vrouw die heeft geleerd dat het lichaam draagt
            wat de psyche geen tijd heeft om te zeggen.
          </p>
        </div>
      </section>

      {/* FOUNDER OPENING */}
      <section className="founder-opening">
        <div className="founder-opening-grid">
          <div className="founder-portrait">
            <img src="/images/elin-hellqvist-moayedi-oprichtster-van-the-swedish.jpg" alt="Elin Hellqvist-Moayedi, oprichtster van The Swedish Glow" />
            <div className="founder-portrait-caption">
              <div className="name">Elin Hellqvist-Moayedi</div>
              <div className="role">Oprichtster · Psycholoog</div>
            </div>
          </div>
          <div className="founder-intro">
            <div className="number-mark">01</div>
            <h2>Hej, ik ben <em>Elin</em>.</h2>
            <p>
              Ik ben psycholoog. En oprichtster. Maar bovenal ben ik iemand die altijd
              wil praten over het echte — durven oprecht en eerlijk zijn, ook als het
              niet goed gaat. Dat is geen persoonlijkheidstrek voor mij. Het is een
              keuze die ik elke dag opnieuw maak.
            </p>
            <p>
              The Swedish Glow is de plek waar beide helften mogen bestaan: het
              evidence-based en het tastbare, het rationele en het spirituele. Want
              dáár leven vrouwen werkelijk hun leven — met feiten én onderbuikgevoel,
              met onderzoek én zelfzorg. Dit merk weigert je te dwingen te kiezen.
            </p>
          </div>
        </div>
      </section>

      {/* CHAPTERS */}
      <section className="story-chapters">
        <div className="story-chapters-wrap">
          <div className="story-chapters-header">
            <div className="eyebrow">Drie hoofdstukken</div>
            <h2>Een <em>familieverhaal</em>, in drie bewegingen.</h2>
            <p>
              Een eiland. Een carrière. Een merk. Hoe een Zweeds meisje uitgroeide tot oprichtster
              van een familiebedrijf dat nu in 23 landen het Nordic-ritueel deelt.
            </p>
          </div>

          <article className="chapter">
            <div className="chapter-marker">
              <div className="num">I</div>
              <div className="year">Mijn pad</div>
            </div>
            <div className="chapter-content">
              <h3>Van het stalmeisje, naar de <em>boardroom</em>.</h3>
              <p>
                Voordat ik psycholoog werd, was ik HR-manager bij ASML, IKEA en Shimano. Daarvoor
                was ik als twintiger leider bij H&amp;M. En daarvoor was ik een stalmeisje in Göteborg
                dat leerde werken in de regen en het donker zonder te klagen.
              </p>
              <p>
                Ik ben de eerste in mijn familie die afstudeerde in een tweede taal. Zeven, acht jaar
                leefde ik in de mannelijke hiërarchie, het mannenspel, en ik was er goed in. Maar ik
                was nog steeds, op een bepaalde manier, hetzelfde meisje uit de stal — dat had
                geleerd hiërarchieën te lezen en zich erin te bewegen om ruimte te maken.
              </p>
              <p>
                Toen kwam het moederschap. En er gebeurde iets wat ik rationeel niet kan verklaren —
                en dat is precies het punt. Voor het eerst in mijn leven was het gevoel sterker dan
                het rationele. Ik, die mijn hele leven had gebouwd op overleven door hard werken
                en berekening, verliet de toppositie bij een van &apos;s werelds grootste bedrijven.
                Niet omdat het slim was. Maar omdat er iets in mij groter was dan het spel
                dat ik had gespeeld.
              </p>
              <blockquote>
                Daar begint The Swedish Glow. Niet in een bedrijfsplan.
                In een moment van spiritualiteit sterker dan rationaliteit.
                <span className="attribution">Elin Hellqvist-Moayedi</span>
              </blockquote>
            </div>
          </article>

          <article className="chapter">
            <div className="chapter-marker">
              <div className="num">II</div>
              <div className="year">Zweden</div>
            </div>
            <div className="chapter-content">
              <h3>De stilte die geneest, en de stilte die <em>doodt</em>.</h3>
              <p>
                Generaties lang is mijn familie succesvol geweest door fysiek hard werken — en
                door stilte. We hebben moeilijke tijden doorstaan. We spraken er niet over.
                Het is een stil contract waarin ik geboren ben.
              </p>
              <p>
                Thuis in Zweden zijn al mijn dierbaren. Alle warmte, alle liefde, al het socializen.
                En tegelijkertijd heb ik me daar het meest alleen gevoeld. Want het is één ding om
                alleen te zijn in uitsluiting. Het is iets totaal anders om alleen te zijn in
                het erbij horen — omringd door mensen die van je houden, maar niet de taal hebben
                voor waar je over moet praten.
              </p>
              <p>
                Het echte. Daar wil ik altijd over praten. Durven oprecht en eerlijk te zijn,
                ook als het niet goed gaat. Niet als persoonlijkheidstrek — als noodzaak.
              </p>
              <blockquote>
                Je bent alleen als je alleen bent van jezelf. Maar eenzaamheid is magisch
                als je bij jezelf bent. Dat is het hele verschil.
                <span className="attribution">Elin Hellqvist-Moayedi</span>
              </blockquote>
            </div>
          </article>

          <article className="chapter">
            <div className="chapter-marker">
              <div className="num">III</div>
              <div className="year">2022</div>
            </div>
            <div className="chapter-content">
              <h3>Een familiemerk, geboren uit <em>liefde</em>.</h3>
              <p>
                In 2022 nam ik de stap. Samen met mijn man bouwde ik een merk dat alles bracht wat
                de corporate wereld mij had geleerd, in een vorm die persoonlijk aanvoelt.
                Een Nederlands familiebedrijf met Zweedse roots.
              </p>
              <p>
                De missie is duidelijk: vrouwen op een voetstuk zetten. Niet met loze beloftes,
                maar met producten die werken. Met ingrediënten van de hoogste kwaliteit.
                Met een ritueel dat tijd vraagt — en daardoor juist iets oplevert wat blijft.
              </p>
              <p>
                Drie jaar later is The Swedish Glow uitgegroeid tot een merk dat in 23 landen
                verkrijgbaar is, met meer dan 100.000 vrouwen die hun ochtend met ons beginnen.
                Nog altijd een familiemerk. Nog altijd geboren uit Zweden.
              </p>
              <blockquote>
                Elke fles die we maken is eerst door onze handen gegaan, eerst door ons getest,
                eerst voor onze familie. Pas dan voor de jouwe.
                <span className="attribution">Elin Hellqvist-Moayedi</span>
              </blockquote>
            </div>
          </article>
        </div>
      </section>

      {/* FILOSOFIE */}
      <section className="philosophy">
        <div className="philosophy-wrap">
          <div className="philosophy-header">
            <div className="eyebrow">Mijn filosofie</div>
            <h2>Dit is waar ik <em>in geloof</em>.</h2>
            <p>
              Zes overtuigingen die niet komen uit een leerboek, maar uit een leven van werken,
              verlangen, moederschap en stilte. De plek waar het rationele en het tastbare elkaar
              ontmoeten.
            </p>
          </div>

          <div className="philosophy-grid">
            <article className="belief">
              <div className="belief-num">01</div>
              <h3>Glow is geen prestatie.</h3>
              <p>Glow is wat overblijft als je stopt met het opbouwen van een carrière bovenop een uitgeput lichaam. Het is geen huid. Het is een zenuwstelsel dat heeft mogen ademen.</p>
            </article>

            <article className="belief">
              <div className="belief-num">02</div>
              <h3>Het lichaam draagt wat de psyche niet zegt.</h3>
              <p>Als je niet mag huilen, huilen je schouders. Als je niet kunt rusten, stort je maag in. Als je geen ruimte mag innemen, krimpt je stem.</p>
            </article>

            <article className="belief">
              <div className="belief-num">03</div>
              <h3>Stilte is gif en medicijn.</h3>
              <p>Zweden heeft me beide geleerd. Eenzaamheid is verstikkend als je niet bij jezelf bent — en bevrijdend zodra je dat wel bent. Daar zit het hele verschil.</p>
            </article>

            <article className="belief">
              <div className="belief-num">04</div>
              <h3>De gezondheid van vrouwen is nooit neutraal.</h3>
              <p>Ze wordt gevormd door wie voor wie zorgt, wie de klap opvangt, wie verlies in stilte draagt. Alles nestelt zich in het zenuwstelsel — niet alleen in de portemonnee.</p>
            </article>

            <article className="belief">
              <div className="belief-num">05</div>
              <h3>Er is een intelligentie groter dan het rationele.</h3>
              <p>Het vrouwelijk lichaam weet dingen voordat wij ze weten. The Swedish Glow is een uitnodiging om naar die intelligentie te luisteren — niet eroverheen te praten.</p>
            </article>

            <article className="belief">
              <div className="belief-num">06</div>
              <h3>Beide helften mogen bestaan.</h3>
              <p>Bewijs en ziel. Onderzoek en zelfzorg. Wat bewezen kan worden en wat alleen gevoeld kan worden. Vrouwen leven met feiten én onderbuikgevoel. Wij weigeren je te dwingen te kiezen.</p>
            </article>
          </div>
        </div>
      </section>

      {/* FOUNDER CLOSING */}
      <section className="founder-closing">
        <div className="founder-closing-wrap">
          <div className="eyebrow">Waarom</div>
          <blockquote className="closing-quote">
            Ik bouw The Swedish Glow niet omdat ik heel ben.
            <em>Ik bouw het omdat ik genoeg keer ben gebroken</em>
            om te weten wat een vrouw werkelijk bijeenhoudt —
            en wat haar uiteindelijk laat stralen.
            <span className="attribution">Elin Hellqvist-Moayedi</span>
          </blockquote>
        </div>
      </section>

      {/* VALUES */}
      <section className="values">
        <div className="values-wrap">
          <div className="eyebrow">Waar wij in geloven</div>
          <h2>Drie waarden, <em>één missie</em>: vrouwen laten stralen.</h2>

          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M16 4 C10 10, 10 16, 16 20 C22 16, 22 10, 16 4 Z" />
                  <path d="M16 20 L16 28" strokeLinecap="round" />
                </svg>
              </div>
              <h4>Vrouwen op een voetstuk</h4>
              <p>
                Wij maken producten voor vrouwen die zichzelf serieus nemen. Geen gimmicks,
                geen onhaalbare beloftes. Alleen kwaliteit die het waard is om in te investeren.
              </p>
            </div>

            <div className="value-item">
              <div className="value-icon">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="16" cy="16" r="12" />
                  <path d="M16 8 Q22 12 22 16 Q22 20 16 24 Q10 20 10 16 Q10 12 16 8 Z" opacity="0.5" />
                </svg>
              </div>
              <h4>De beste ingrediënten</h4>
              <p>
                Geen vulstoffen, geen marketing-ingrediënten. Wij werken met Zweedse producenten
                die dezelfde standaard hanteren als wij: zuiverheid boven schaal.
              </p>
            </div>

            <div className="value-item">
              <div className="value-icon">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M6 20 Q12 14 16 18 Q20 22 26 6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="26" cy="6" r="2" />
                </svg>
              </div>
              <h4>Uitstekende werking</h4>
              <p>
                Een product moet werken. Onze formules zijn zorgvuldig samengesteld op basis van
                klinisch onderzoek, en getest op één criterium: zichtbaar resultaat na 100 dagen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERVIEW Q&A */}
      <section className="interview">
        <div className="interview-wrap">
          <div className="interview-header">
            <div className="eyebrow">In gesprek met Elin</div>
            <h2>Vijf vragen aan <em>de oprichtster</em>.</h2>
          </div>

          <article className="qa">
            <div className="question">Wat mis je het meest aan Brännö?</div>
            <div className="answer">
              De stilte. Je staat op, je zet thee, je hoort niets behalve de zee en misschien
              een meeuw. In Nederland duurt het wat langer om bij die stilte te komen, maar mijn
              ochtendritueel (een glas water, een shot Marine Collageen, een paar minuten in
              de tuin) is wel mijn eigen versie van Brännö geworden.
            </div>
          </article>

          <article className="qa">
            <div className="question">Waarom de stap van ASML naar je eigen merk?</div>
            <div className="answer">
              Ik heb veel geleerd in de corporate wereld. Bij IKEA over hoe je merk en cultuur
              bouwt. Bij Shimano over precisie. Bij ASML over schaal. Maar ik wilde iets bouwen
              waar mijn naam aan vastzit, letterlijk. Een merk waar vrouwen voelen dat er iemand
              achter zit die ze écht in het oog wil kijken.
            </div>
          </article>

          <article className="qa">
            <div className="question">Wat betekent &quot;vrouwen op een voetstuk zetten&quot; voor jou?</div>
            <div className="answer">
              Drie dingen tegelijk. Eén: producten maken die zo goed zijn dat een vrouw zich
              gezien voelt. Twee: een ritueel aanbieden dat zelfzorg weer waardevol maakt. Geen
              haast, geen schuldgevoel, gewoon tijd voor jezelf. En drie: zelf het voorbeeld zijn.
              Vrouwelijke ondernemer, familiemoeder, en bewijs dat je niet hoeft te kiezen.
            </div>
          </article>

          <article className="qa">
            <div className="question">Wie zit er nog meer in The Swedish Glow?</div>
            <div className="answer">
              Mijn man werkt mee aan The Swedish Glow naast zijn rol in het IT-bedrijf dat hij
              met zijn broer van zijn vader overnam. Het zit in de familie aan beide kanten:
              ondernemerschap, doorpakken, iets opbouwen dat blijft. Ons team is klein maar gepassioneerd,
              en we werken met Zweedse producenten die we inmiddels persoonlijk kennen.
            </div>
          </article>

          <article className="qa">
            <div className="question">Waar wil je over vijf jaar staan?</div>
            <div className="answer">
              Ik droom van een merk dat in elke badkamer van Europa staat. Niet als zoveelste
              productje, maar als een vertrouwd ritueel. En ik droom van een community waar
              vrouwen elkaar versterken. Dat is voor mij wat luxe écht betekent: tijd nemen,
              kwaliteit kiezen, en weten dat je deel uitmaakt van iets groters dan jezelf.
            </div>
          </article>
        </div>
      </section>

      {/* CONNECT */}
      <section className="connect">
        <div className="connect-wrap">
          <div className="eyebrow">Kom langs</div>
          <h2>Volg ons <em>verhaal</em>.</h2>
          <p>
            We delen de mensen, plekken en producten achter The Swedish Glow op Instagram.
            Van Brännö-zomers tot het laatste laboratoriumbezoek in Zweden.
          </p>
          <div className="connect-links">
            <a href="https://www.instagram.com/theswedishglow/" className="connect-link">Instagram →</a>
            <a href="https://nl.trustpilot.com/review/theswedishglow.com" className="connect-link">Trustpilot →</a>
            <a href="/contact" className="connect-link">Contact →</a>
          </div>
        </div>
      </section>
    </main>
  )
}
