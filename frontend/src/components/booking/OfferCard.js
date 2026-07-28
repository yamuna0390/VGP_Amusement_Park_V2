"use client";

export default function OfferCard({ offer, isSelected, onSelect }) {
  // Determine the discount label to display
  const getDiscountLabel = () => {
    switch (offer.discountType) {
      case "percent": return `${offer.discountValue}% OFF`;
      case "flat":    return `₹${offer.discountValue} OFF`;
      case "bogo":    return "BUY 1 GET 1";
      case "b2g1":    return "BUY 2 GET 1";
      case "combo":   return "COMBO DEAL";
      default:        return "SPECIAL";
    }
  };

  return (
    <div
      className={`bk-offer ${isSelected ? "bk-offer--open" : ""}`}
      onClick={() => onSelect(isSelected ? null : offer)}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(e) => e.key === "Enter" && onSelect(isSelected ? null : offer)}
    >
      {/* Header row */}
      <div className="bk-offer__head">
        <span
          className="bk-offer__badge"
          style={{ background: offer.badgeColor }}
        >
          {offer.badge}
        </span>
        <span className="bk-offer__title">{offer.title}</span>
        <span className="bk-offer__arrow">{isSelected ? "▲" : "▼"}</span>
      </div>

      {/* Expanded body */}
      {isSelected && (
        <div className="bk-offer__body">
          <p className="bk-offer__desc">{offer.description}</p>
          {offer.terms && (
            <p className="bk-offer__terms">⚠️ {offer.terms}</p>
          )}
          <div className="bk-offer__tag">{getDiscountLabel()}</div>
        </div>
      )}

      {/* Collapsed discount label */}
      {!isSelected && (
        <span className="bk-offer__pct">{getDiscountLabel()}</span>
      )}
    </div>
  );
}
