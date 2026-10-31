import React from "react";

export default function OiAIGifting() {
  return (
    <section className={"gifting-section section-pad"} id={"gifting"}> <div className={"gift-art reveal"}> <div className={"gift-image-frame"}><img src={"/images/oiai/photo-gift-b6c8ee965229.jpg"} alt={"A thoughtful gift ready to be opened"} loading={"eager"} /><span className={"gift-ribbon"}></span></div> <div className={"gift-tag"}>JUST BECAUSE<br />IS A REASON.</div> <span className={"gift-spark gift-spark-one"}>✳</span><span className={"gift-spark gift-spark-two"}>♡</span> </div> <div className={"gift-copy reveal"}> <span className={"eyebrow"}> A GOOD GIFT NEVER NEEDS A REASON</span> <h2>Say it with<br /><em>something sweet.</em></h2> <p>For birthdays, family reunions, first dates, apologies, new beginnings, and very specific Tuesdays. A box of chocolate says “I remembered”, “I’m proud of you”, and sometimes “I ate one on the way”.</p> <button className={"button button-paper"} type={"button"} data-category-jump={"Gifts"}><span>Find a lovely little gift</span><b>↗</b></button> <span className={"gift-handnote"}>they'll think of you with every bite.</span> </div> </section>
  );
}
