import React from "react";

export default function OiAITopbar() {
  return (
    <header className={"topbar sticky-topbar"} id={"main-topbar"}>
      <button className={"mobile-menu"} id={"mobile-menu"} aria-label={"Open menu"}>
        <span></span><span></span><span></span>
      </button>

      <a className={"mobile-brand"} href={"#top"} aria-label={"OiAI home"}>
        <span>OiAI</span><small>HOMEMADE CHOCOLATES</small>
      </a>

      <div className={"topbar-note"}>
        <span className={"tiny-sun"}>✳</span> A little sweetness, made the old-fashioned way.
      </div>

      <div className={"topbar-cta-wrap"}>
        <a
          href={"https://wa.me/916303648554?text=Hi%20Laxmi!%20I'd%20love%20to%20order%20some%20homemade%20chocolates%20from%20OiAI."}
          target={"_blank"}
          rel={"noopener noreferrer"}
          className={"topbar-wa-cta"}
          id={"topbar-wa-cta"}
          aria-label={"Order via WhatsApp"}
        >
          <svg className={"topbar-wa-svg"} width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.06 7.64C8.87 7.64 8.56 7.71 8.3 8C8.04 8.29 7.3 9.02 7.3 10.49C7.3 11.96 8.37 13.37 8.52 13.57C8.67 13.77 10.63 16.79 13.63 18.08C14.34 18.39 14.9 18.57 15.33 18.71C16.05 18.94 16.7 18.91 17.22 18.83C17.8 18.74 19.01 18.1 19.26 17.38C19.52 16.67 19.52 16.05 19.44 15.93C19.36 15.81 19.17 15.74 18.88 15.6C18.6 15.45 17.22 14.77 16.96 14.68C16.7 14.58 16.51 14.53 16.32 14.82C16.13 15.11 15.58 15.74 15.42 15.93C15.25 16.13 15.08 16.15 14.8 16C14.51 15.86 13.59 15.56 12.5 14.59C11.66 13.84 11.09 12.91 10.93 12.63C10.76 12.34 10.91 12.19 11.06 12.04C11.19 11.91 11.35 11.7 11.5 11.52C11.64 11.35 11.69 11.23 11.79 11.03C11.89 10.84 11.84 10.67 11.76 10.53C11.69 10.38 11.11 8.95 10.87 8.36C10.63 7.79 10.39 7.87 10.21 7.86C10.04 7.85 9.85 7.85 9.66 7.85C9.46 7.85 9.16 7.92 8.9 8.19"/>
          </svg>
          <span className={"topbar-wa-label"}>Order on WhatsApp</span>
          <b className={"topbar-wa-arrow"} aria-hidden={"true"}>↗</b>
        </a>
      </div>
    </header>
  );
}
