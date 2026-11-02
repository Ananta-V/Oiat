import React from "react";

export default function OiAIMoments() {
  return (
    <section className="moments-section section-pad" id="moments">
      <div className="moments-heading reveal">
        <div>
          <div className="eyebrow">CHOCOLATE IS A LOVE LANGUAGE</div>
          <h2>
            For the people who <em>feel like home.</em>
          </h2>
        </div>
        <p>
          Some memories are made around a table. Some in a late-night text. Some with the last chocolate split exactly in half.
        </p>
      </div>

      <div className="memory-card-grid" id="memory-card-grid">
        <div className="memory-card memory-family reveal">
          <span className="memory-card-index">01 · SUNDAY TABLE</span>
          <span aria-hidden="true" className="memory-art memory-photo">
            <img
              src="/images/oiai/photo-milkPralines-02cd3864aed0.jpg"
              alt="A little chocolate treat for the family table"
              loading="eager"
            />
          </span>
          <span className="memory-card-copy">
            <strong>For the ones who feel like home.</strong>
            <span>One box. Five reaching hands. Someone saves a piece for later.</span>
            <small>MADE FOR SHARED MOMENTS</small>
          </span>
        </div>

        <div className="memory-card memory-love reveal">
          <span className="memory-card-index">02 · JUST-BECAUSE NOTE</span>
          <span aria-hidden="true" className="memory-art memory-photo">
            <img
              src="/images/oiai/photo-giftDetail-413c588aa5b2.jpg"
              alt="A chocolate gift for someone special"
              loading="eager"
            />
          </span>
          <span className="memory-card-copy">
            <strong>For your favourite person.</strong>
            <span>For the one who gets the first bite — and steals yours, too.</span>
            <small>FOR YOUR PERSON</small>
          </span>
        </div>

        <div className="memory-card memory-friends reveal">
          <span className="memory-card-index">03 · AFTER-HOURS CREW</span>
          <span aria-hidden="true" className="memory-art memory-photo">
            <img
              src="/images/oiai/photo-ganacheTruffles-7aba3afc44ec.jpg"
              alt="Chocolate truffles to share with friends"
              loading="eager"
            />
          </span>
          <span className="memory-card-copy">
            <strong>For your chosen family.</strong>
            <span>Late-night laughs. Friends who save you the corner piece.</span>
            <small>FOR YOUR CHOSEN FAMILY</small>
          </span>
        </div>

        <div className="memory-card memory-self reveal">
          <span className="memory-card-index">04 · THE SMALL WIN</span>
          <span aria-hidden="true" className="memory-art memory-photo">
            <img
              src="/images/oiai/photo-cocoaShards-44c7ec5f0d56.jpg"
              alt="Dark chocolate for a small personal win"
              loading="eager"
            />
          </span>
          <span className="memory-card-copy">
            <strong>For showing up for yourself.</strong>
            <span>A hard week, a brave step, or a Tuesday worth celebrating.</span>
            <small>FOR YOUR LITTLE WIN</small>
          </span>
        </div>
      </div>

      <div className="moments-footnote">
        <span>Every little bite has a story.</span>
        <i></i>
        <button type="button" className="text-arrow" data-feedback-open="Your OiAI story">
          Tell us yours &amp; get a little thank-you ♥
        </button>
      </div>
    </section>
  );
}
