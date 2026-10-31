import React from "react";

export default function OiAIFooter() {
  return (
    <footer className={"site-footer"}> <div className={"footer-brand"}><a className={"footer-logo"} href={"#top"}>OiAI<span>♥</span></a><p>Oops! I Ate It.<br />Homemade chocolates. Happy little accidents.</p></div> <div className={"footer-col"}><span>COME WANDER</span><a href={"#collections"}>Find your craving</a><a href={"#shop"}>The chocolate shelf</a><a href={"#gifting"}>Gifting, sorted</a></div> <div className={"footer-col"}><span>A LITTLE HOUSEKEEPING</span><a href={"#our-story"}>Our story</a><a href={"#newsletter"}>Sweet notes</a><a href={"#top"} id={"instagram-link"}>Follow the crumbs ↗</a><a href={"/admin"}>Studio admin ↗</a></div> <div className={"footer-end"}><span>© <span id={"year"}></span> OiAI HOMEMADE CHOCOLATES</span><span>MADE WITH LOVE IN HYDERABAD, INDIA</span><span className={"footer-heart"}>♥</span></div> </footer>
  );
}
