"use client";

export default function OfferCard({ offer, isSelected, onSelect }) {
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
          {offer.couponCode && (
            <p className="bk-offer__code">
              🎫 Code: <strong>{offer.couponCode}</strong> — applied automatically
            </p>
          )}
          <p className="bk-offer__terms">⚠️ {offer.terms}</p>
          {offer.discountType === "percent" && (
            <div className="bk-offer__tag">
              {offer.discountValue}% OFF
            </div>
          )}
          {offer.discountType === "bogo" && (
            <div className="bk-offer__tag">BUY 1 GET 1</div>
          )}
        </div>
      )}

      {/* Collapsed discount label */}
      {!isSelected && (
        <span className="bk-offer__pct">
          {offer.discountType === "percent"
            ? `${offer.discountValue}% OFF`
            : offer.discountType === "bogo"
            ? "BUY 1 GET 1"
            : "COMBO"}
        </span>
      )}
    </div>
  );
}
