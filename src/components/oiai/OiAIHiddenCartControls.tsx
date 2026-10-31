import React from "react";

export default function OiAIHiddenCartControls() {
  return (
    <div hidden={true}><button id={"cart-open"} type={"button"} aria-hidden={"true"} tabIndex={-1}>Hidden cart handler</button><button id={"mobile-cart-open"} type={"button"} aria-hidden={"true"} tabIndex={-1}>Hidden mobile cart handler</button><span id={"cart-count"}>0</span><span id={"mobile-cart-count"}>0</span></div>
  );
}
