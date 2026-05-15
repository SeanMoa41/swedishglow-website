from app.models import (
    Reseller,
    TierThreshold,
    PartnerApplication,
    Product,
    Quotation,
    Invoice,
    MarketingFile,
    FileDownload,
)


def test_all_models_importable():
    assert Reseller.__tablename__ == "resellers"
    assert TierThreshold.__tablename__ == "tier_thresholds"
    assert PartnerApplication.__tablename__ == "applications"
    assert Product.__tablename__ == "products"
    assert Quotation.__tablename__ == "quotations"
    assert Invoice.__tablename__ == "invoices"
    assert MarketingFile.__tablename__ == "marketing_files"
    assert FileDownload.__tablename__ == "file_downloads"


def test_tier_threshold_has_auto_approve_field():
    from app.models.reseller import TierThreshold
    assert hasattr(TierThreshold, "auto_approve")
