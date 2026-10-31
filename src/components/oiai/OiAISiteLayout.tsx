import OiAISidebar from "./OiAISidebar";
import OiAIScrim from "./OiAIScrim";
import OiAIAnnouncement from "./OiAIAnnouncement";
import OiAITopbar from "./OiAITopbar";
import OiAIHero from "./OiAIHero";
import OiAIPromises from "./OiAIPromises";
import OiAICategories from "./OiAICategories";
import OiAIProductShelf from "./OiAIProductShelf";
import OiAIStory from "./OiAIStory";
import OiAIProcess from "./OiAIProcess";
import OiAIMoments from "./OiAIMoments";
import OiAIGifting from "./OiAIGifting";
import OiAINewsletter from "./OiAINewsletter";
import OiAIFooter from "./OiAIFooter";

export default function OiAISiteLayout() {
  return (
    <div className="site-layout" id="top">
      <OiAISidebar />
      <OiAIScrim />
      <main className="main-content">
        <OiAIAnnouncement />
        <OiAITopbar />
        <OiAIHero />
        <OiAIPromises />
        <OiAICategories />
        <OiAIProductShelf />
        <OiAIStory />
        <OiAIProcess />
        <OiAIMoments />
        <OiAIGifting />
        <OiAINewsletter />
        <OiAIFooter />
      </main>
    </div>
  );
}
