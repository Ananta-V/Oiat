"use client";

import React, { useEffect, useState } from "react";

type SiteSettings = {
  whatsapp: string;
  instagram: string;
  email: string;
};

const DEFAULT_SETTINGS: SiteSettings = {
  whatsapp: "+91 63036 48554",
  instagram: "@oiai.chocolates",
  email: "hello@oiaichocolates.com",
};

export default function OiAIFooter() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data) {
          setSettings({
            whatsapp: data.whatsapp || DEFAULT_SETTINGS.whatsapp,
            instagram: data.instagram || DEFAULT_SETTINGS.instagram,
            email: data.email || DEFAULT_SETTINGS.email,
          });
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const cleanPhone = (settings.whatsapp || "").replace(/[^0-9]/g, "");
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hi Laxmi! I'd love to order some homemade chocolates from OiAI.")}`
    : "https://wa.me/916303648554?text=Hi%20Laxmi!%20I'd%20love%20to%20order%20some%20homemade%20chocolates%20from%20OiAI.";

  const cleanInsta = (settings.instagram || "").replace(/^@/, "").trim();
  const instaUrl = cleanInsta ? `https://instagram.com/${cleanInsta}` : "https://instagram.com/oiai.chocolates";
  const displayInsta = settings.instagram.startsWith("@") ? settings.instagram : `@${settings.instagram}`;

  const mailtoUrl = `mailto:${(settings.email || "hello@oiaichocolates.com").trim()}?subject=OiAI%20Chocolates%20Inquiry`;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" id="contact">
      {/* 1. Brand & Kitchen Notebook Signature */}
      <div className="footer-brand">
        <a className="footer-logo" href="#top" aria-label="OiAI Home">
          OiAI<span className="footer-logo-heart">♥</span>
        </a>
        <p className="footer-tagline">
          Oops! I Ate It.
          <br />
          Handmade chocolates. Honest feelings.
        </p>
        <div className="footer-kitchen-note">
          <span className="kitchen-note-star">✳</span>
          <span>Crafted in tiny batches in Hyderabad, using roasted whole nuts & pure cocoa butter.</span>
        </div>
      </div>

      {/* 2. Collections & Discovery */}
      <div className="footer-col">
        <span className="footer-col-title">THE SWEET SHELF</span>
        <a href="#collections">Pick your craving</a>
        <a href="#shop">All seven creations</a>
        <a href="#our-story">How we make them</a>
        <a href="#gifting">Custom gifting boxes</a>
      </div>

      {/* 3. Housekeeping & Community */}
      <div className="footer-col">
        <span className="footer-col-title">KITCHEN DIARY</span>
        <a href="#our-story">Our little story</a>
        <a href="#newsletter">The weekly note</a>
        <a href={instaUrl} target="_blank" rel="noopener noreferrer" id="instagram-link" className="footer-external-link">
          Instagram: {displayInsta} <b aria-hidden="true">↗</b>
        </a>
        <span className="footer-hours-note">Open for orders Mon–Sun · 10am–9pm</span>
      </div>

      {/* 4. Direct Connect & WhatsApp Action */}
      <div className="footer-col footer-col-direct">
        <span className="footer-col-title">DIRECT FROM LAXMI</span>
        <p className="footer-direct-desc">
          Have an order in mind or custom event? Message us directly on WhatsApp.
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-wa-card-btn"
          aria-label={`Order on WhatsApp at ${settings.whatsapp}`}
        >
          <svg className="footer-wa-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.06 7.64C8.87 7.64 8.56 7.71 8.3 8C8.04 8.29 7.3 9.02 7.3 10.49C7.3 11.96 8.37 13.37 8.52 13.57C8.67 13.77 10.63 16.79 13.63 18.08C14.34 18.39 14.9 18.57 15.33 18.71C16.05 18.94 16.7 18.91 17.22 18.83C17.8 18.74 19.01 18.1 19.26 17.38C19.52 16.67 19.52 16.05 19.44 15.93C19.36 15.81 19.17 15.74 18.88 15.6C18.6 15.45 17.22 14.77 16.96 14.68C16.7 14.58 16.51 14.53 16.32 14.82C16.13 15.11 15.58 15.74 15.42 15.93C15.25 16.13 15.08 16.15 14.8 16C14.51 15.86 13.59 15.56 12.5 14.59C11.66 13.84 11.09 12.91 10.93 12.63C10.76 12.34 10.91 12.19 11.06 12.04C11.19 11.91 11.35 11.7 11.5 11.52C11.64 11.35 11.69 11.23 11.79 11.03C11.89 10.84 11.84 10.67 11.76 10.53C11.69 10.38 11.11 8.95 10.87 8.36C10.63 7.79 10.39 7.87 10.21 7.86C10.04 7.85 9.85 7.85 9.66 7.85C9.46 7.85 9.16 7.92 8.9 8.19"/>
          </svg>
          <span className="footer-wa-text">
            <strong>Order on WhatsApp</strong>
            <small>{settings.whatsapp}</small>
          </span>
          <b className="footer-wa-arrow" aria-hidden="true">↗</b>
        </a>
        <a href={mailtoUrl} className="footer-mail-link" aria-label={`Send email to ${settings.email}`}>
          ✉ {settings.email}
        </a>
      </div>

      {/* 5. Footer Bottom Bar */}
      <div className="footer-end">
        <span>© <span id="year">{currentYear}</span> OiAI HOMEMADE CHOCOLATES · ALL RIGHTS RESERVED</span>
        <span className="footer-hand-promise">“Never share the last one.”</span>
        <span className="footer-place">HYDERABAD, INDIA <span className="footer-heart">♥</span></span>
      </div>
    </footer>
  );
}
