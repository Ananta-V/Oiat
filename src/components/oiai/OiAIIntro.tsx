import React from "react";

export default function OiAIIntro() {
  return (
    <div className={"oiai-intro"} id={"oiai-intro"} role={"presentation"} aria-label={"OiAI intro animation"}> <div className={"intro-logo-wrap"}> <img className={"intro-logo"} src={"/images/oiai/inline-5ce9324fd6c7.png"} alt={"OiAI"} /> <svg className={"intro-ring"} viewBox={"0 0 100 100"} aria-hidden={"true"}><circle cx={"50"} cy={"50"} r={"48"}></circle></svg> <p className={"intro-tagline"}>A little bite of belonging.</p> <img className={"intro-camera"} src={"/images/oiai/inline-f322f393a964.png"} alt={""} aria-hidden={"true"} /> </div> <div className={"intro-flash"} aria-hidden={"true"}></div> </div>
  );
}
