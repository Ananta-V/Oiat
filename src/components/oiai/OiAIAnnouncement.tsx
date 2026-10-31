import React from "react";

export default function OiAIAnnouncement() {
  return (
    <div className={"announcement-bar"}> <span className={"announcement-star"} aria-hidden={"true"}>✳</span><button className={"announcement-feedback"} type={"button"} data-feedback-open={"Chocolate I tried"} aria-label={"Give feedback on your chocolate sample and "}><span className={"announcement-prompt"}>TRIED A SAMPLE?</span><span className={"announcement-message"}>Tell us how it tasted &amp; felt</span></button><span className={"announcement-heart"} aria-hidden={"true"}>♥</span> </div>
  );
}
