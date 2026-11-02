import React from "react";

export default function OiAIFeedbackModal() {
  return (
    <>
    {/* ── Thank-you success overlay (opens after form submit) ── */}
    <div
      id="feedback-success-overlay"
      aria-modal="true"
      role="dialog"
      aria-labelledby="success-heading"
      aria-hidden="true"
      style={{ display: "none" }}
    >
      <div id="feedback-success-card">
        <div className="thanks-stamp" style={{ margin: "0 auto 20px" }}>
          THANK YOU
          <br />
          <b>♥</b>
        </div>
        <span className="eyebrow">A LITTLE SOMETHING, FROM US</span>
        <h3 id="success-heading" style={{ margin: "12px 0 8px" }}>That was sweeter than chocolate.</h3>
        <p id="success-message" style={{ margin: "0 0 24px", lineHeight: 1.6 }}>Your note means the world to our tiny kitchen.</p>
        <button type="button" id="success-close-btn" className="button button-ink">
          <span>Close</span>
          <b>✕</b>
        </button>
      </div>
    </div>

    <section
      className={"feedback-modal"}
      id={"feedback-modal"}
      role={"dialog"}
      aria-modal={"true"}
      aria-labelledby={"feedback-title"}
      aria-hidden={"true"}
    >
      <button
        className={"feedback-close"}
        id={"feedback-close"}
        type={"button"}
        aria-label={"Close feedback form"}
      >
        ×
      </button>
      <div className={"feedback-modal-art"}>
        <span className={"feedback-spark"} aria-hidden={"true"}>
          ✳
        </span>
        <img
          className={"feedback-art-photo"}
          src={"/images/oiai/photo-pralines-09e90126f78c.jpg"}
          alt={"Glossy handmade chocolate pralines"}
          loading={"lazy"}
        />
        <div className={"feedback-art-copy"}>
          <span className={"feedback-art-script"}>
            your sample,
            <br />
            your say
          </span>
          <span className={"feedback-art-caption"}>TINY KITCHEN · BIG FEELINGS</span>
        </div>
      </div>
      <div className={"feedback-modal-body"}>
        <span className={"eyebrow"}>A LITTLE NOTE MEANS A LOT</span>
        <h2 id={"feedback-title"}>
          Help us make <em>more memories.</em>
        </h2>
        <p className={"feedback-intro"} id={"feedback-intro"}>
          Tell us what you noticed in your sample — the first taste, the texture, and the feeling it left behind. Your honest little note helps our tiny kitchen make every bite better.
        </p>

        <form id={"feedback-form"} className={"feedback-form"}>
          <div className={"feedback-form-row"}>
            <label>
              YOUR NAME
              <input
                id={"feedback-name"}
                name={"name"}
                autoComplete={"name"}
                placeholder={"What should we call you?"}
                required={true}
                maxLength={80}
              />
            </label>
            <label>
              YOUR EMAIL
              <input
                id={"feedback-email"}
                name={"email"}
                type={"email"}
                autoComplete={"email"}
                placeholder={"Where can your thank-you find you?"}
                required={true}
                maxLength={160}
              />
            </label>
          </div>
          <label>
            WHICH SAMPLE DID YOU TRY?
            <select id={"feedback-context"} name={"context"}>
              <option value={"Your OiAI story"}>A little of everything</option>
              <option value={"Secret Crush"}>Secret Crush (Dark &amp; Almond)</option>
              <option value={"Bad Habit"}>Bad Habit (Dark &amp; Cocoa Cashew)</option>
              <option value={"Sweet Surrender"}>Sweet Surrender (Nutella Centre)</option>
              <option value={"Sugar Rush"}>Sugar Rush (Marshmallow &amp; Crisps)</option>
              <option value={"Mixed Signals"}>Mixed Signals (White &amp; Dark Marble)</option>
              <option value={"First Love"}>First Love (Plain Milk Chocolate)</option>
              <option value={"Dark Affair"}>Dark Affair (70% Dark Chocolate)</option>
              <option value={"Pocket Mischief"}>Pocket Mischief (Chocolate Almonds)</option>
              <option value={"Caught Snacking"}>Caught Snacking (Chocolate Cashews)</option>
              <option value={"Filled Centres"}>Filled-centre chocolate</option>
              <option value={"Milk & Marble"}>Milk or marble chocolate</option>
              <option value={"Crunch & Crisps"}>Crunch &amp; crisps</option>
              <option value={"Plain Dark"}>Plain dark chocolate</option>
              <option value={"Nutty Packs"}>Chocolate-covered nuts</option>
              <option value={"Chocolate I tried"}>A little sample (not sure which one)</option>
            </select>
          </label>
          <fieldset className={"taste-rating"}>
            <legend>
              HOW WAS THAT FIRST BITE? <span>Pick one</span>
            </legend>
            <div className={"rating-options"}>
              <label>
                <input type={"radio"} name={"sample_rating"} value={"1"} required={true} />
                <span>
                  <b>★</b>
                  <small>Not me</small>
                </span>
              </label>
              <label>
                <input type={"radio"} name={"sample_rating"} value={"2"} />
                <span>
                  <b>★★</b>
                  <small>Improve</small>
                </span>
              </label>
              <label>
                <input type={"radio"} name={"sample_rating"} value={"3"} />
                <span>
                  <b>★★★</b>
                  <small>Good</small>
                </span>
              </label>
              <label>
                <input type={"radio"} name={"sample_rating"} value={"4"} />
                <span>
                  <b>★★★★</b>
                  <small>Loved it</small>
                </span>
              </label>
              <label>
                <input type={"radio"} name={"sample_rating"} value={"5"} defaultChecked={true} />
                <span>
                  <b>★★★★★</b>
                  <small>Again!</small>
                </span>
              </label>
            </div>
          </fieldset>
          <fieldset className={"feeling-picker"}>
            <legend>
              WHAT DID IT MAKE YOU FEEL? <span>Choose any</span>
            </legend>
            <div className={"mood-options"}>
              <label>
                <input type={"checkbox"} name={"feeling"} value={"Comforted"} />
                <span>♥ Comforted</span>
              </label>
              <label>
                <input type={"checkbox"} name={"feeling"} value={"Joyful"} />
                <span>✳ Joyful</span>
              </label>
              <label>
                <input type={"checkbox"} name={"feeling"} value={"Nostalgic"} />
                <span>⌁ Nostalgic</span>
              </label>
              <label>
                <input type={"checkbox"} name={"feeling"} value={"Surprised"} />
                <span>♡ Surprised</span>
              </label>
              <label>
                <input type={"checkbox"} name={"feeling"} value={"Ready to share"} />
                <span>☻ Ready to share</span>
              </label>
              <label>
                <input type={"checkbox"} name={"feeling"} value={"Wanting another bite"} />
                <span>↗ One more bite</span>
              </label>
            </div>
          </fieldset>
          <label className={"feedback-story-label"}>
            YOUR LITTLE TASTE NOTE
            <textarea
              id={"feedback-message"}
              name={"feedback"}
              placeholder={"Describe the taste, the texture, the moment — or what you’d make even better…"}
              required={true}
              minLength={8}
              maxLength={1200}
              rows={4}
            />
          </label>
          <button className={"button button-ink feedback-submit"} type={"submit"}>
            <span>Send my little note</span>
            <b>♥</b>
          </button>
          <small className={"feedback-privacy"}>
            Your feedback helps us make OiAI even sweeter. Thank you for sharing a little love.
          </small>
        </form>

        <div className={"feedback-error"} id={"feedback-error"} role={"alert"} hidden={true}></div>

        <div className={"feedback-thanks"} id={"feedback-thanks"} hidden={true}>
          <div className={"thanks-stamp"}>
            THANK YOU
            <br />
            <b>♥</b>
          </div>
          <span className={"eyebrow"}>A LITTLE SOMETHING, FROM US</span>
          <h3>That was sweeter than chocolate.</h3>
          <p id={"thanks-message"}>Your note means the world to our tiny kitchen.</p>
          <button
            type={"button"}
            className={"button button-ink"}
            id={"feedback-reset-btn"}
            style={{ marginTop: 20 }}
          >
            <span>Send another taste note</span>
            <b>↗</b>
          </button>
        </div>
      </div>
    </section>
    </>
  );
}
