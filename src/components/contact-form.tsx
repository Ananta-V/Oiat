 "use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // UI-only starter: do not imply that data was sent or stored.
    setSubmitted(true);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {submitted ? (
        <div className="form-notice" role="status">
          <CheckCircle2 size={20} />
          <div>
            <strong>Preview submission complete</strong>
            <p>This is a frontend demo only. No personal information has been sent or stored.</p>
            <button className="text-button" type="button" onClick={() => setSubmitted(false)}>
              Send another message
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="form-row">
            <label className="field">
              <span>Your name</span>
              <input name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder="How should we address you?" />
            </label>
            <label className="field">
              <span>Mobile number</span>
              <input name="mobile" type="tel" autoComplete="tel" required maxLength={24} placeholder="+91 00000 00000" />
            </label>
          </div>
          <label className="field">
            <span>Email address</span>
            <input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" />
          </label>
          <label className="field">
            <span>What would you like to tell us?</span>
            <textarea name="message" required minLength={10} maxLength={2000} rows={4} placeholder="Tell us a little about your enquiry..." />
          </label>
          <button className="button button--gold contact-form__submit" type="submit">
            Send an enquiry <ArrowUpRight size={16} />
          </button>
          <p className="form-privacy">Your details should be handled privately and securely. This form is not connected to a server yet.</p>
        </>
      )}
    </form>
  );
}
