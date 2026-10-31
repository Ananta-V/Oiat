import React from "react";

export default function OiAIToast() {
  return (
    <div className={"toast"} id={"toast"} role={"status"} aria-live={"polite"}><span className={"toast-heart"}>♥</span><span id={"toast-message"}>A little something added.</span><button id={"toast-view"} type={"button"}>View bag ↗</button></div>
  );
}
