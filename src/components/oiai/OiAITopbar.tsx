import React from "react";

export default function OiAITopbar() {
  return (
    <header className={"topbar"}> <button className={"mobile-menu"} id={"mobile-menu"} aria-label={"Open menu"}><span></span><span></span><span></span></button> <a className={"mobile-brand"} href={"#top"} aria-label={"OiAI home"}><span>OiAI</span><small>HOMEMADE CHOCOLATES</small></a> <div className={"topbar-note"}><span className={"tiny-sun"}>✳</span> A little sweetness, made the old-fashioned way.</div> </header>
  );
}
