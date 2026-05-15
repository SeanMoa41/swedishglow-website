"""Fetch WooCommerce product IDs and print a summary."""
import sys
import requests
from app.config import settings


def main():
    if not settings.wc_consumer_key or not settings.wc_consumer_secret:
        print("ERROR: WC_CONSUMER_KEY / WC_CONSUMER_SECRET not set in .env")
        sys.exit(1)

    base = settings.wc_url.rstrip("/")
    auth = (settings.wc_consumer_key, settings.wc_consumer_secret)

    page, products = 1, []
    while True:
        r = requests.get(
            f"{base}/wp-json/wc/v3/products",
            auth=auth,
            params={"per_page": 100, "page": page, "status": "any"},
            timeout=10,
        )
        r.raise_for_status()
        batch = r.json()
        if not batch:
            break
        products.extend(batch)
        page += 1

    print(f"\n{'ID':<8} {'TYPE':<12} {'STATUS':<10} {'SKU':<20} {'MODIFIED':<22} NAME")
    print("-" * 90)
    for p in sorted(products, key=lambda x: x["date_modified"], reverse=True):
        sku = p.get("sku") or "—"
        modified = p.get("date_modified", "")[:16]
        stock = "" if p.get("stock_status") == "instock" else f" [{p.get('stock_status')}]"
        print(f"{p['id']:<8} {p['type']:<12} {p['status']:<10} {sku:<20} {modified:<22} {p['name']}{stock}")

        if p["type"] == "variable":
            vr = requests.get(
                f"{base}/wp-json/wc/v3/products/{p['id']}/variations",
                auth=auth,
                params={"per_page": 100},
                timeout=10,
            )
            vr.raise_for_status()
            for v in sorted(vr.json(), key=lambda x: x["id"]):
                attrs = ", ".join(a["option"] for a in v.get("attributes", []))
                vsku = v.get("sku") or "—"
                vstatus = "" if v.get("stock_status") == "instock" else f" [{v.get('stock_status')}]"
                print(f"  └─ var {v['id']:<6} €{str(v.get('price','?')):<8} sku={vsku:<16} {attrs}{vstatus}")

    print(f"\n{len(products)} product(s) found")


if __name__ == "__main__":
    main()
