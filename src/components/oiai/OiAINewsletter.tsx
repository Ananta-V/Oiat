import React from "react";

export default function OiAINewsletter() {
  return (
    <section className={"newsletter-section section-pad"} id={"newsletter"}> <div className={"newsletter-doodle"} aria-hidden={"true"}>♡</div> <div className={"newsletter-copy"}><span className={"eyebrow"}>LETTERS FROM THE SWEET SIDE</span><h2>Good things in your <em>inbox.</em></h2><p>New batches, little surprises, and very occasional chocolate-related gossip.</p></div> <form className={"newsletter-form"} id={"newsletter-form"}><label htmlFor={"newsletter-email"}>YOUR EMAIL, PLEASE</label><div className={"newsletter-input-wrap"}><input id={"newsletter-email"} type={"email"} placeholder={"you@thegoodplace.com"} required={true} /><button type={"submit"} aria-label={"Subscribe to newsletter"}>↗</button></div><small id={"newsletter-message"} aria-live={"polite"}>No spam. We don't even like raisins in the wrong chocolate.</small></form> </section>
  );
}
