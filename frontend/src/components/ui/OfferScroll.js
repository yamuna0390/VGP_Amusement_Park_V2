"use client";
import { useState } from "react";

export default function OfferScroll({ offer, isSelected, onSelect }) {
  const [open, setOpen] = useState(false);

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open);
  };

  const handleApply = (e) => {
    e.stopPropagation();
    if (onSelect) onSelect(offer.id);
  };

  // Safe fallback if offer structure is unexpected
  if (!offer) return null;

  return (
    <div 
      className={`offer-acc ${open ? 'open' : ''} ${isSelected ? 'selected' : ''}`}
      style={{ '--ac': offer.color || 'var(--purple)' }}
    >
      <div className="acc-head" onClick={toggle}>
        <div className="acc-icon">{offer.icon || '🎁'}</div>
        <div className="acc-title">
          <h3>{offer.name}</h3>
          <span className="acc-tag">{offer.tag || 'Offer'}</span>
        </div>
        <div className="acc-toggle"></div>
      </div>
      
      <div className="acc-body">
        <div className="acc-scroll">
          <div className="acc-roller top"></div>
          <div className="acc-content">
            <div className="acc-seal"></div>
            {offer.code && <div className="acc-code">Code: {offer.code}</div>}
            <p className="acc-desc" dangerouslySetInnerHTML={{ __html: offer.desc }}></p>
            <div className="acc-elig">{offer.dateLabel}</div>
            {onSelect && (
              <button className="btn-next cta-green" onClick={handleApply}>
                {isSelected ? '✓ Applied' : 'Apply This Offer'}
              </button>
            )}
          </div>
          <div className="acc-roller bot"></div>
        </div>
      </div>
    </div>
  );
}
