import React from "react";

export default function OiAIQuickViewModal() {
  return (
    <section className={"quick-view-modal"} id={"quick-view-modal"} aria-label={"Chocolate details"} aria-hidden={"true"} role={"dialog"} aria-modal={"true"}><button className={"close-button modal-close"} id={"modal-close"} aria-label={"Close product details"}>×</button><div id={"quick-view-content"}></div></section>
  );
}
