import React from "react";

export default function OiAITopbar() {
  return (
    <header className={"topbar sticky-topbar"} id={"main-topbar"}>
      <button className={"mobile-menu"} id={"mobile-menu"} aria-label={"Open menu"}><span></span><span></span><span></span></button>
      <a className={"mobile-brand"} href={"#top"} aria-label={"OiAI home"}><span>OiAI</span><small>HOMEMADE CHOCOLATES</small></a>
      <div className={"topbar-note"}><span className={"tiny-sun"}>✳</span> A little sweetness, made the old-fashioned way.</div>
      <div className={"topbar-cta-wrap"}>
        <a
          href={"https://wa.me/916303648554?text=Hi%20Laxmi!%20I'd%20love%20to%20order%20some%20homemade%20chocolates%20from%20OiAI."}
          target={"_blank"}
          rel={"noopener noreferrer"}
          className={"topbar-wa-cta"}
          aria-label={"Order via WhatsApp"}
        >
          <span className={"topbar-wa-icon"}>💬</span>
          <span className={"topbar-wa-label"}>Order on WhatsApp</span>
        </a>
      </div>
    </header>
  );
}
