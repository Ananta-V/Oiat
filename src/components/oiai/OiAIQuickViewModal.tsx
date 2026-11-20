import React from "react";

export default function OiAIQuickViewModal() {
  return (
    <section
      className={"quick-view-modal"}
      id={"quick-view-modal"}
      aria-label={"Chocolate details and order"}
      aria-hidden={"true"}
      role={"dialog"}
      aria-modal={"true"}
    >
      <div className={"qv-modal-header-bar"}>
        <div className={"qv-modal-badge"}>
          <span className={"qv-badge-pip"}>✳</span>
          <span>OI·AI ARTISANAL BATCH</span>
        </div>
        <button
          className={"close-button modal-close"}
          id={"modal-close"}
          aria-label={"Close chocolate details"}
          type={"button"}
        >
          <span aria-hidden={"true"}>×</span>
        </button>
      </div>
      <div id={"quick-view-content"}></div>
    </section>
  );
}
