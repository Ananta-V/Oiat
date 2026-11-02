"use client";

import React, { useEffect, useState } from "react";

type SiteSettings = {
  whatsapp: string;
  instagram: string;
  email: string;
};

const DEFAULT_SETTINGS: SiteSettings = {
  whatsapp: "+91 81251 07227",
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
      .catch(() => {
        // Fallback to defaults gracefully
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const cleanPhone = (settings.whatsapp || "").replace(/[^0-9]/g, "");
  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : "https://wa.me/918125107227";

  const cleanInsta = (settings.instagram || "").replace(/^@/, "").trim();
  const instaUrl = cleanInsta ? `https://instagram.com/${cleanInsta}` : "https://instagram.com/oiai.chocolates";
  const displayInsta = settings.instagram.startsWith("@") ? settings.instagram : `@${settings.instagram}`;

  const mailtoUrl = `mailto:${(settings.email || "hello@oiaichocolates.com").trim()}`;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <a className="footer-logo" href="#top">
          OiAI<span>♥</span>
        </a>
        <p>
          Oops! I Ate It.
          <br />
          Homemade chocolates. Happy little accidents.
        </p>
      </div>

      <div className="footer-col">
        <span>COME WANDER</span>
        <a href="#collections">Find your craving</a>
        <a href="#shop">The chocolate shelf</a>
        <a href="#gifting">Gifting, sorted</a>
      </div>

      <div className="footer-col">
        <span>A LITTLE HOUSEKEEPING</span>
        <a href="#our-story">Our story</a>
        <a href="#newsletter">Sweet notes</a>
        <a href={instaUrl} target="_blank" rel="noopener noreferrer" id="instagram-link">
          Follow the crumbs ↗
        </a>
      </div>

      <div className="footer-col">
        <span>GET IN TOUCH</span>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-contact-link"
          aria-label={`Chat on WhatsApp at ${settings.whatsapp}`}
        >
          <span className="icon">💬</span> WhatsApp: {settings.whatsapp}
        </a>
        <a
          href={instaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-contact-link"
          aria-label={`Visit Instagram profile ${displayInsta}`}
        >
          <span className="icon">📸</span> Instagram: {displayInsta}
        </a>
        <a
          href={mailtoUrl}
          className="footer-contact-link"
          aria-label={`Send email to ${settings.email}`}
        >
          <span className="icon">✉</span> Email: {settings.email}
        </a>
      </div>

      <div className="footer-end">
        <span>© <span id="year">{currentYear}</span> OiAI HOMEMADE CHOCOLATES</span>
        <span>MADE WITH LOVE IN HYDERABAD, INDIA</span>
        <span className="footer-heart">♥</span>
      </div>
    </footer>
  );
}
