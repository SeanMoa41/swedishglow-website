# Reseller Portaal — Netlify deploy (v2)

**Belangrijk:** in deze versie heet het bestand `index.html`, zodat het portaal direct op de root-URL van je Netlify site verschijnt.

## Hoe deployen

1. Ga naar https://app.netlify.com/drop
2. Sleep deze map (`reseller-portaal-deploy-v2`) op de drop-zone — of klik op de bestaande site → **Deploys** → "Drag and drop your site folder here" om de bestaande site te overschrijven
3. Het portaal verschijnt direct op `https://jouw-site.netlify.app/`

## Inloggen

- `suzanne@theswedishglow.com` / `TSGadmin2026!`
- `elin@theswedishglow.com` / `TSGadmin2026!`

## Wat is veranderd t.o.v. de eerste deploy

- Bestandsnaam: `reseller-portaal.html` → `index.html` (zodat de root-URL werkt)
- `_redirects` aangepast naar `/index.html`

## Bestandstructuur

```
reseller-portaal-deploy-v2/
├── index.html      ← het portaal
├── _redirects      ← URL rewrites
└── README.md
```
