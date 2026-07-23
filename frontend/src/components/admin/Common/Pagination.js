"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.css";

/**
 * Pagination — Fully reusable across all admin modules.
 *
 * Props:
 *   currentPage  {number}
 *   totalPages   {number}
 *   totalItems   {number}
 *   itemsPerPage {number}
 *   onPageChange {function(pageNumber)}
 *   label        {string}  — default "results"
 */
export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  label = "results",
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  /* Build page number list with ellipsis */
  function buildPages() {
    const pages = [];
    const delta = 2;
    let prev = null;

    for (let i = 1; i <= totalPages; i++) {
      const inRange =
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta);

      if (inRange) {
        if (prev !== null && i - prev > 1) {
          pages.push("…");
        }
        pages.push(i);
        prev = i;
      }
    }
    return pages;
  }

  const pages = buildPages();

  return (
    <div className="pgn-wrapper">

      <span className="pgn-info">
        Showing {startItem}–{endItem} of {totalItems} {label}
      </span>

      <div className="pgn-controls">

        <button
          className="pgn-nav-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous Page"
          type="button"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((page, idx) =>
          page === "…" ? (
            <span key={`ellipsis-${idx}`} className="pgn-ellipsis">
              …
            </span>
          ) : (
            <button
              key={page}
              className={`pgn-page-btn ${page === currentPage ? "pgn-active" : ""}`}
              onClick={() => onPageChange(page)}
              type="button"
            >
              {page}
            </button>
          )
        )}

        <button
          className="pgn-nav-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Next Page"
          type="button"
        >
          <ChevronRight size={16} />
        </button>

      </div>
    </div>
  );
}
